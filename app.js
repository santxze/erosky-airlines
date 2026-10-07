/* ============================================================
   AEROSKY AIRLINES — app.js
   Componentes reutilizáveis + lógica da home + resultados
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Toast ---------- */
  function toast(msg, type = "info") {
    const wrap = $("#toastWrap");
    if (!wrap) return alert(msg);
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<span style="font-size:1.1rem">${type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 4200);
  }

  const BRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  /* Respeita prefers-reduced-motion: não reproduz o vídeo do hero (mostra apenas o poster) */
  const heroVideo = document.querySelector(".hero-bg video");
  if (heroVideo && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    heroVideo.removeAttribute("autoplay");
    heroVideo.pause();
  }

  /* ---------- Header scroll + mobile ---------- */
  const header = $("#header");
  const onScroll = () => {
    if (!header) return;
    const solid = window.scrollY > 40;
    header.classList.toggle("header-solid", solid);
    header.classList.toggle("header-transparent", !solid);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#hamburger"), mMenu = $("#mobileMenu");
  if (burger && mMenu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      mMenu.classList.toggle("open");
    });
    $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
      burger.classList.remove("open"); mMenu.classList.remove("open");
    }));
  }

  /* ---------- Modais ---------- */
  function openModal(name) {
    const m = $("#modal-" + name);
    if (m) m.classList.add("open");
    if (mMenu) { mMenu.classList.remove("open"); burger && burger.classList.remove("open"); }
  }
  function closeModals() { $$(".modal-overlay.open").forEach(m => m.classList.remove("open")); }
  $$("[data-modal]").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); openModal(b.dataset.modal); }));
  $$("[data-close]").forEach(b => b.addEventListener("click", (e) => { e.preventDefault(); closeModals(); if (b.tagName === "A" && b.getAttribute("href")?.startsWith("#")) { const t = $(b.getAttribute("href")); t && t.scrollIntoView({ behavior: "smooth" }); } }));
  $$(".modal-overlay").forEach(o => o.addEventListener("click", (e) => { if (e.target === o) closeModals(); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });

  /* ---------- Dados fictícios (componentes reutilizáveis) ---------- */
  const OFFERS = [
    { from: "Rio de Janeiro", fromCode: "GIG", to: "Miami", country: "Estados Unidos", toCode: "MIA", price: 2899, dur: "8h 10m", stops: "Direto", tag: "Ida e volta", promo: true, img: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=800&q=80" },
    { from: "São Paulo", fromCode: "GRU", to: "Paris", country: "França", toCode: "CDG", price: 3949, dur: "11h 20m", stops: "Direto", tag: "Mais procurado", promo: false, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80" },
    { from: "São Paulo", fromCode: "GRU", to: "Nova York", country: "Estados Unidos", toCode: "JFK", price: 3399, dur: "10h 05m", stops: "Direto", tag: "Ida e volta", promo: false, img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80" },
    { from: "Rio de Janeiro", fromCode: "GIG", to: "Lisboa", country: "Portugal", toCode: "LIS", price: 3199, dur: "9h 15m", stops: "Direto", tag: "-20% hoje", promo: true, img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=800&q=80" },
    { from: "São Paulo", fromCode: "GRU", to: "Londres", country: "Reino Unido", toCode: "LHR", price: 3799, dur: "11h 40m", stops: "Direto", tag: "Ida e volta", promo: false, img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80" },
    { from: "Rio de Janeiro", fromCode: "GIG", to: "Buenos Aires", country: "Argentina", toCode: "EZE", price: 1249, dur: "2h 55m", stops: "Direto", tag: "Oferta relâmpago", promo: true, img: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80" },
  ];
  const DESTS = [
    { city: "Paris", country: "França", detail: "A partir de R$ 3.949 · Direto", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80" },
    { city: "Nova York", country: "Estados Unidos", detail: "A partir de R$ 3.399 · Direto", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=80" },
    { city: "Dubai", country: "Emirados Árabes", detail: "A partir de R$ 4.899 · 1 parada", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80" },
    { city: "Roma", country: "Itália", detail: "A partir de R$ 3.799 · Direto", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80" },
    { city: "Londres", country: "Reino Unido", detail: "A partir de R$ 3.799 · Direto", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80" },
    { city: "Tóquio", country: "Japão", detail: "A partir de R$ 5.499 · 1 parada", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80" },
  ];

  /* Render ofertas */
  const grid = $("#offersGrid");
  if (grid) {
    grid.innerHTML = OFFERS.map((o, i) => `
      <article class="offer-card reveal ${i % 3 === 1 ? "reveal-d1" : i % 3 === 2 ? "reveal-d2" : ""}">
        <div class="offer-media">
          <span class="offer-tag ${o.promo ? "promo" : ""}">${o.tag}</span>
          <button class="offer-fav" aria-label="Favoritar" data-fav>♡</button>
          <img src="${o.img}" alt="${o.to}, ${o.country}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'">
          <div class="offer-route"><span class="code">${o.fromCode}</span> ✈ <span class="code">${o.toCode}</span></div>
        </div>
        <div class="offer-body">
          <div class="offer-city">${o.to} <span>· ${o.country}</span></div>
          <div style="font-size:.83rem;color:var(--muted)">Saindo de ${o.from}</div>
          <div class="offer-meta"><span>⏱ ${o.dur}</span><span>✈ ${o.stops}</span><span>🧳 Bagagem inclusa</span></div>
          <div class="offer-foot">
            <div class="price"><small>Ida e volta desde</small><strong>${BRL(o.price)} <em>/pessoa</em></strong></div>
            <button class="btn-view" data-book="${o.from}|${o.to}">Ver voos</button>
          </div>
        </div>
      </article>`).join("");
    $$("[data-fav]", grid).forEach(b => b.addEventListener("click", () => {
      b.classList.toggle("liked"); b.textContent = b.classList.contains("liked") ? "♥" : "♡";
    }));
    $$("[data-book]", grid).forEach(b => b.addEventListener("click", () => {
      const [from, to] = b.dataset.book.split("|");
      const ida = new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10);
      const volta = new Date(Date.now() + 28 * 864e5).toISOString().slice(0, 10);
      location.href = `resultados.html?origem=${encodeURIComponent(from)}&destino=${encodeURIComponent(to)}&ida=${ida}&volta=${volta}&pax=1&classe=Econômica`;
    }));
  }

  /* Render destinos */
  const dgrid = $("#destGrid");
  if (dgrid) {
    dgrid.innerHTML = DESTS.map((d, i) => `
      <div class="dest-card reveal" data-dest="${d.city}">
        <img src="${d.img}" alt="${d.city}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=900&q=80'">
        <span class="dest-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg></span>
        <div class="dest-info"><small>${d.country}</small><h3>${d.city}</h3><p>${d.detail}</p></div>
      </div>`).join("");
    $$("[data-dest]", dgrid).forEach(c => c.addEventListener("click", () => {
      const dest = $("#destino");
      if (dest) { dest.value = c.dataset.dest; $("#buscar").scrollIntoView({ behavior: "smooth" }); toast(`Destino <b>${c.dataset.dest}</b> selecionado. Complete a busca ✈`, "success"); }
    }));
  }

  /* ---------- Busca de voos ---------- */
  let tripType = "round";
  const pax = { adt: 1, chd: 0, inf: 0 };
  $$(".trip-tab").forEach(t => t.addEventListener("click", () => {
    $$(".trip-tab").forEach(x => x.classList.remove("active"));
    t.classList.add("active");
    tripType = t.dataset.trip;
    const volta = $("#volta");
    if (volta) { volta.disabled = tripType === "oneway"; if (tripType === "oneway") volta.value = ""; }
    const hint = $("#tripHint");
    if (hint) hint.textContent = tripType === "oneway" ? "🎫 Somente ida selecionada" : "🛫 Melhor preço garantido";
  }));

  const swapBtn = $("#swapBtn");
  if (swapBtn) swapBtn.addEventListener("click", () => {
    const o = $("#origem"), d = $("#destino");
    [o.value, d.value] = [d.value, o.value];
  });

  const paxBtn = $("#paxBtn"), paxPop = $("#paxPop");
  if (paxBtn && paxPop) {
    paxBtn.addEventListener("click", (e) => { e.stopPropagation(); paxPop.classList.toggle("open"); });
    document.addEventListener("click", (e) => { if (!paxPop.contains(e.target)) paxPop.classList.remove("open"); });
    $$("[data-pax]").forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.pax;
      pax[k] = Math.max(k === "adt" ? 1 : 0, Math.min(9, pax[k] + (b.dataset.op === "+" ? 1 : -1)));
      $("#nAdt").textContent = pax.adt; $("#nChd").textContent = pax.chd; $("#nInf").textContent = pax.inf;
      const total = pax.adt + pax.chd + pax.inf;
      paxBtn.textContent = `${total} passageiro${total > 1 ? "s" : ""}`;
    }));
  }

  const idaInput = $("#ida"), voltaInput = $("#volta");
  if (idaInput) { const t = new Date().toISOString().slice(0, 10); idaInput.min = t; if (voltaInput) voltaInput.min = t; }

  function setErr(input, errId, bad) {
    input.classList.toggle("error", bad);
    const e = document.getElementById(errId);
    if (e) e.classList.toggle("show", bad);
    return !bad;
  }

  const form = $("#searchForm");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const origem = $("#origem"), destino = $("#destino"), classe = $("#classe");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let ok = true;
    ok = setErr(origem, "err-origem", origem.value.trim().length < 2) && ok;
    ok = setErr(destino, "err-destino", destino.value.trim().length < 2) && ok;
    if (origem.value.trim().toLowerCase() === destino.value.trim().toLowerCase() && origem.value.trim()) {
      setErr(destino, "err-destino", true); $("#err-destino").textContent = "Origem e destino devem ser diferentes."; ok = false;
    }
    const idaBad = !idaInput.value || new Date(idaInput.value + "T12:00") < today;
    ok = setErr(idaInput, "err-ida", idaBad) && ok;
    if (tripType === "round") {
      const voltaBad = !voltaInput.value || voltaInput.value <= idaInput.value;
      ok = setErr(voltaInput, "err-volta", voltaBad) && ok;
    }
    if (!ok) { toast("Verifique os campos destacados para continuar.", "error"); return; }
    const total = pax.adt + pax.chd + pax.inf;
    const q = new URLSearchParams({ origem: origem.value.trim(), destino: destino.value.trim(), ida: idaInput.value, volta: voltaInput.value || "", pax: total, classe: classe.value, trip: tripType });
    toast(`Buscando voos <b>${origem.value.trim()} → ${destino.value.trim()}</b>...`, "success");
    setTimeout(() => location.href = "resultados.html?" + q.toString(), 700);
  });

  /* ---------- Minhas viagens (fictício) ---------- */
  const tripsList = $("#tripsList");
  if (tripsList) {
    const trips = [
      { code: "ASK8X2", route: "GRU → LIS", date: "18 Nov 2026 · 22:35", status: "Confirmado", color: "#0EC46B" },
      { code: "ASK4M9", route: "GIG → MIA", date: "05 Dez 2026 · 09:10", status: "Check-in aberto", color: "#2E9BFF" },
    ];
    tripsList.innerHTML = trips.map(t => `
      <div style="border:1.5px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:12px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <div style="width:48px;height:48px;border-radius:13px;background:var(--navy-800);display:grid;place-items:center;color:var(--gold-light);font-weight:800">✈</div>
        <div style="flex:1;min-width:180px"><strong>${t.route}</strong><br><small style="color:var(--muted)">${t.code} · ${t.date}</small></div>
        <span style="background:${t.color}1A;color:${t.color};font-weight:800;font-size:.78rem;padding:6px 12px;border-radius:100px">● ${t.status}</span>
        <button class="btn-view" onclick="void 0">Gerenciar</button>
      </div>`).join("");
  }

  /* ---------- Formulários ---------- */
  $("#loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("#loginEmail").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return toast("Informe um e-mail válido.", "error");
    if ($("#loginPass").value.length < 4) return toast("Informe sua senha.", "error");
    closeModals(); toast(`Bem-vindo(a) de volta! <b>+120 pontos</b> de login.`, "success");
  });
  $("#checkinForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#ciCode").value.trim().length < 4 || $("#ciName").value.trim().length < 2) return toast("Confira o código e o sobrenome.", "error");
    closeModals(); toast(`Check-in localizado! Reserva <b>${$("#ciCode").value.toUpperCase()}</b> pronta.`, "success");
  });
  $("#clubForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("#clubEmail").value.trim();
    if ($("#clubName").value.trim().length < 3) return toast("Informe seu nome completo.", "error");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return toast("Informe um e-mail válido.", "error");
    closeModals(); toast(`Conta criada! <b>1.000 pontos</b> de boas-vindas.`, "success");
  });
  $("#newsForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const em = $("#newsEmail").value.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) return toast("Informe um e-mail válido para receber as ofertas.", "error");
    $("#newsEmail").value = "";
    toast("Inscrição confirmada! Ofertas a caminho ✈", "success");
  });

  /* ---------- Reveal on scroll + contadores ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("visible");
      $$("[data-count]", en.target).forEach(runCount);
      if (en.target.hasAttribute("data-count")) runCount(en.target);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach(el => io.observe(el));

  function runCount(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const target = +el.dataset.count, t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ---------- Página de resultados ---------- */
  const resWrap = $("#resultsList");
  if (resWrap) {
    const q = new URLSearchParams(location.search);
    const origem = q.get("origem") || "São Paulo";
    const destino = q.get("destino") || "Lisboa";
    const summary = $("#resSummary");
    if (summary) summary.innerHTML = `<b>${origem} → ${destino}</b> · ${q.get("ida") || "—"} ${q.get("volta") ? " · volta " + q.get("volta") : "· só ida"} · ${q.get("pax") || 1} pax · ${q.get("classe") || "Econômica"}`;
    const cias = ["AeroSky", "AeroSky Plus", "AeroSky"];
    const hours = ["06:15", "09:40", "14:05", "18:20", "22:35"];
    const base = 1499;
    resWrap.innerHTML = hours.map((h, i) => {
      const price = base + i * 317 + Math.floor(Math.random() * 200);
      const dur = (6 + (i % 4)) + "h " + (10 + i * 7) + "m";
      return `<div class="flight-card">
        <div><div style="font-size:.78rem;font-weight:800;color:var(--blue);letter-spacing:.06em">✈ ${cias[i % 3]} · ASK 84${i}2 · ${i % 2 ? "1 parada" : "Direto"}</div>
        <div class="flight-times" style="margin-top:10px"><div class="t"><strong>${h}</strong><small>${origem.split(" ")[0].toUpperCase()}</small></div>
        <div class="flight-line"><span>${dur}</span><div class="bar"></div><span>${i % 2 ? "Conexão GIG" : "Voo direto"}</span></div>
        <div class="t"><strong>${String((+h.slice(0, 2) + 8) % 24).padStart(2, "0")}:${h.slice(3)}</strong><small>${destino.split(" ")[0].toUpperCase()}</small></div></div></div>
        <div class="flight-price"><div><small>Ida e volta desde</small><strong>${BRL(price)}</strong><small>em até 10x · ${Math.floor(price / 12)} pts Club</small></div>
        <button class="btn btn-gold" style="margin-top:10px" data-buy="${h}" data-price="${price}" data-voo="ASK 84${i}2">Selecionar</button></div></div>`;
    }).join("");
    $$("[data-buy]", resWrap).forEach(b => b.addEventListener("click", () => {
      const q2 = new URLSearchParams(location.search);
      q2.set("hora", b.dataset.buy);
      q2.set("preco", b.dataset.price);
      q2.set("voo", b.dataset.voo);
      location.href = "checkout.html?" + q2.toString();
    }));
  }
})();
