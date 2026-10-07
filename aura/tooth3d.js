/* ============================================================
   AURA — Escultura 3D premium (Three.js, lazy + pausável).
   1. Tenta carregar modelo real: models/tooth.glb (e variações).
   2. Sem GLB: escultura procedural aprimorada (coroa anatômica
      via LatheGeometry + raízes afuniladas, porcelana física).
   Render pausa fora da viewport e com aba oculta. DPR limitado.
   ============================================================ */
const stage = document.getElementById("stage");
const canvas = document.getElementById("toothCanvas");
const canvas2 = document.getElementById("toothCanvas2");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = matchMedia("(max-width: 640px)").matches;

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return true;
  }
}

if (!canvas || !hasWebGL() || reducedMotion) {
  // Fallback estático elegante (SVG) — sem custo de GPU.
  stage?.classList.add("no-webgl");
} else {
  initWhenVisible();
}

async function initWhenVisible() {
  // Aguarda o hero entrar na viewport (performance) com timeout seguro.
  await new Promise((res) => {
    if (!("IntersectionObserver" in window)) return res();
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        res();
      }
    });
    io.observe(canvas);
    setTimeout(res, 4000);
  });
  try {
    const THREE = await import("three");
    const heroScene = buildScene(THREE, canvas, true);
    let detailScene = null;
    if (canvas2 && !isMobile) detailScene = buildScene(THREE, canvas2, false);
    wireVisibility([heroScene, detailScene].filter(Boolean));
  } catch {
    stage?.classList.add("no-webgl");
  }
}

/* ---------- Material porcelana premium ---------- */
function porcelainMaterial(THREE) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xf8fbfa,
    roughness: 0.08,
    metalness: 0.0,
    transmission: 0.45,
    thickness: 1.8,
    ior: 1.46,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    sheen: 0.5,
    sheenColor: new THREE.Color(0xcde9e5),
    specularIntensity: 1.1,
    envMapIntensity: 1.15,
  });
}

/* ---------- Coroa anatômica via perfil Lathe ---------- */
function crownMesh(THREE, mat) {
  // Perfil: colo estreito → bojo → topo arredondado (molar/pré-molar).
  const pts = [];
  const profile = [
    [0.0, -0.55],
    [0.52, -0.5],
    [0.78, -0.28],
    [0.94, 0.05],
    [0.98, 0.35],
    [0.88, 0.62],
    [0.62, 0.85],
    [0.3, 0.97],
    [0.0, 1.0],
  ];
  for (const [x, y] of profile) pts.push(new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(pts, 96);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(1.02, 1, 0.88); // leve achatamento vestíbulo-lingual
  return mesh;
}

/* ---------- Raízes afuniladas com curvatura ---------- */
function rootMesh(THREE, mat, side) {
  // Cone de alta segmentação, afinado e curvado via deformação de vértices.
  const geo = new THREE.ConeGeometry(0.3, 1.6, 48, 24, true);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = (0.8 - y) / 1.6; // 0 topo → 1 ápice
    const bend = Math.pow(t, 2) * 0.22 * side;
    pos.setX(i, pos.getX(i) * (1 - t * 0.55) + bend);
    pos.setZ(i, pos.getZ(i) * (1 - t * 0.55) * 0.72);
  }
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(side * 0.38, -1.15, 0);
  mesh.rotation.z = -side * 0.16;
  return mesh;
}

function proceduralTooth(THREE) {
  const group = new THREE.Group();
  const mat = porcelainMaterial(THREE);
  group.add(crownMesh(THREE, mat));
  group.add(rootMesh(THREE, mat, -1));
  group.add(rootMesh(THREE, mat, 1));
  // Sulco oclusal sutil: toro fino escurecido no topo (profundidade).
  const groove = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.022, 12, 64),
    new THREE.MeshStandardMaterial({
      color: 0xdfe9e7,
      roughness: 0.5,
    })
  );
  groove.rotation.x = Math.PI / 2;
  groove.position.y = 0.93;
  groove.scale.set(1, 0.85, 1);
  group.add(groove);
  return group;
}

/* ---------- Tenta GLB real, senão procedural ---------- */
async function loadTooth(THREE) {
  const candidates = [
    "models/tooth.glb",
    "./models/tooth.glb",
    "public/models/tooth.glb",
    "/models/tooth.glb",
  ];
  try {
    const { GLTFLoader } = await import(
      "three/addons/loaders/GLTFLoader.js"
    );
    const loader = new GLTFLoader();
    for (const url of candidates) {
      try {
        const gltf = await loader.loadAsync(url);
        const model = gltf.scene;
        model.traverse((o) => {
          if (o.isMesh) {
            o.material = porcelainMaterial(THREE);
            o.castShadow = false;
          }
        });
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        if (size > 0) model.scale.multiplyScalar(3.2 / size);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const group = new THREE.Group();
        group.add(model);
        return group;
      } catch {
        /* tenta próximo caminho */
      }
    }
  } catch {
    /* addons indisponíveis (CDN sem addons) → procedural */
  }
  return proceduralTooth(THREE);
}

function buildScene(THREE, cv, interactive) {
  const renderer = new THREE.WebGLRenderer({
    canvas: cv,
    alpha: true,
    antialias: !isMobile,
    powerPreference: "high-performance",
  });
  // Configuração de cor/tonemapping quando suportada.
  try {
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
  } catch {
    /* versão antiga — mantém padrão */
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2));

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  cam.position.set(0, 0.25, 6.4);

  // Iluminação de estúdio: key + fill + rim + ambiente suave.
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(3.5, 4.5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x9fd8d2, 1.4);
  rim.position.set(-4.5, 2, -3.5);
  scene.add(rim);
  const fill = new THREE.PointLight(0xeafffb, 10, 25);
  fill.position.set(-1.5, -2.5, 3.5);
  scene.add(fill);
  const top = new THREE.DirectionalLight(0xffffff, 0.5);
  top.position.set(0, 6, 1);
  scene.add(top);

  // Sombra suave de contato.
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.45, 48),
    new THREE.MeshBasicMaterial({
      color: 0x0e3b3b,
      transparent: true,
      opacity: 0.12,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.15;
  scene.add(shadow);

  const holder = new THREE.Group();
  scene.add(holder);
  loadTooth(THREE).then((tooth) => {
    holder.add(tooth);
    api.tooth = tooth;
  });

  // Órbita decorativa premium.
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.25, 0.012, 16, 160),
    new THREE.MeshBasicMaterial({
      color: 0x2b7f7b,
      transparent: true,
      opacity: 0.45,
    })
  );
  ring.rotation.x = Math.PI / 2.4;
  scene.add(ring);

  // Partículas discretas (desktop apenas).
  let particles = null;
  if (!isMobile) {
    const n = 70;
    const pGeo = new THREE.BufferGeometry();
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: 0x9fd8d2,
        size: 0.03,
        transparent: true,
        opacity: 0.55,
      })
    );
    scene.add(particles);
  }

  function resize() {
    const w = cv.clientWidth || 400;
    const h = cv.clientHeight || 400;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
  }
  resize();
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(cv);
  } else {
    addEventListener("resize", resize, { passive: true });
  }

  const api = {
    tooth: null,
    running: true,
    inView: true,
    raf: 0,
    t: Math.random() * 10,
    mx: 0,
    my: 0,
  };

  let scrollP = 0;
  if (interactive) {
    addEventListener(
      "pointermove",
      (e) => {
        api.mx = (e.clientX / innerWidth - 0.5) * 2;
        api.my = (e.clientY / innerHeight - 0.5) * 2;
      },
      { passive: true }
    );
    // Scroll: deslocamento vertical sutil (sem cálculo caro).
    let ticking = false;
    addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          scrollP = Math.min(1, scrollY / innerHeight);
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  // Pausa fora da viewport.
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        api.inView = entries[0].isIntersecting;
        schedule(api);
      },
      { threshold: 0.05 }
    ).observe(cv);
  }

  const speed = isMobile ? 0.35 : 0.6;
  function frame() {
    api.raf = 0;
    if (!api.running || !api.inView || document.hidden) return;
    api.t += 0.008 * speed * 2;
    const tooth = api.tooth;
    if (tooth) {
      tooth.rotation.y += 0.004 * speed * 2;
      tooth.rotation.x += (api.my * 0.22 - tooth.rotation.x) * 0.04;
      tooth.rotation.z += (api.mx * 0.1 - tooth.rotation.z) * 0.04;
      const floatY = Math.sin(api.t) * 0.12 + (interactive ? scrollP * 0.6 : 0);
      tooth.position.y += (floatY - tooth.position.y) * 0.06;
    }
    ring.rotation.z += 0.0015;
    if (particles) particles.rotation.y += 0.0006;
    renderer.render(scene, cam);
    api.raf = requestAnimationFrame(frame);
  }
  api.start = function start() {
    api.running = true;
    if (api.inView && !document.hidden && !api.raf) {
      api.raf = requestAnimationFrame(frame);
    }
  };
  api.stop = function stop() {
    api.running = false;
    if (api.raf) cancelAnimationFrame(api.raf);
    api.raf = 0;
  };
  function schedule() {
    api.start();
  }
  schedule();
  return api;
}

/* Pausa global com aba oculta; retoma ao voltar. */
function wireVisibility(scenes) {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) scenes.forEach((s) => s.stop());
    else scenes.forEach((s) => s.start());
  });
}
