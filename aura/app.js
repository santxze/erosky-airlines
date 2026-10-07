/* ============================================================
   AURA — Interações. Fonte de verdade: window.SITE_CONFIG.
   Sem backend: o formulário abre o WhatsApp com a mensagem
   montada (nunca afirma envio que não ocorreu).
   Futura API: implemente `sendLeadToAPI(lead)` (ver README).
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const cfg = window.SITE_CONFIG || {};
  const contact = cfg.contact || {};
  const clinic = cfg.clinic || {};
  const WA_NUMBER = contact.whatsappNumber || "5521999999999";
  const waLink = (msg) =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
      msg || contact.whatsappMsg || "Olá! Vim pelo site e gostaria de agendar uma avaliação."
    )}`;
  const IMG_FALLBACK = (seed) => `https://picsum.photos/seed/${seed}/700/500`;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- JSON-LD a partir do siteConfig (anti-fake) ---------- */
  (function injectSchema() {
    try {
      const isDemo = cfg.isDemo !== false;
      const schema = {
        "@context": "https://schema.org",
        "@type": "Dentist",
        name: clinic.name || "Aura Odontologia",
        description: clinic.description || "",
      };
      // Dados locais SOMENTE com dados reais validados (isDemo=false).
      if (!isDemo && cfg.address && contact.phoneHref) {
        schema.address = {
          "@type": "PostalAddress",
          streetAddress: cfg.address.street,
          addressLocality: cfg.address.city,
          addressRegion: cfg.address.state,
          addressCountry: cfg.address.country || "BR",
        };
        schema.telephone = contact.phoneHref;
        schema.priceRange = "$$";
      }
      const tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.textContent = JSON.stringify(schema);
      document.head.appendChild(tag);
    } catch {
      /* SEO progressivo — nunca quebra a página */
    }
  })();

  /* ---------- Preloader: sai imediatamente quando pronto ---------- */
  (function loader() {
    const el = $("#loader");
    if (!el) return;
    const done = () => el.classList.add("done");
    if (document.readyState === "complete") done();
    else addEventListener("load", done, { once: true });
    setTimeout(done, 2500); // segurança (conexões lentas)
  })();

  /* ---------- Header: 1 listener de scroll (rAF-throttled) ---------- */
  const header = $("#header");
  if (header) {
    let ticking = false;
    const update = () => {
      const solid = scrollY > 40;
      header.classList.toggle("header-solid", solid);
      header.classList.toggle("header-transparent", !solid);
      ticking = false;
    };
    addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------- Menu mobile acessível + trava de scroll ---------- */
  const burger = $("#hamburger");
  const mMenu = $("#mobileMenu");
  const openMenu = () => {
    mMenu.classList.add("open");
    burger.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    if (!mMenu.classList.contains("open")) return;
    mMenu.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  };
  burger?.addEventListener("click", () =>
    mMenu.classList.contains("open") ? closeMenu() : openMenu()
  );
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  /* ---------- Toast ---------- */
  function toast(msg) {
    const w = $("#toastWrap");
    if (!w) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    w.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }

  /* ---------- WhatsApp: links a partir do siteConfig ---------- */
  ["waFloat", "ctaWhats", "infoWhats", "footWhats"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.href = waLink();
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  /* ---------- Contato direto / endereço / horários (siteConfig) ---------- */
  (function hydrateContact() {
    const set = (id, html) => {
      const el = document.getElementById(id);
      if (el && html) el.innerHTML = html;
    };
    if (contact.phone && contact.email) {
      set(
        "infoDirect",
        `${contact.phone} · ${contact.email}<br><a href="${waLink()}" target="_blank" rel="noopener" style="color:var(--petrol);font-weight:800">Chamar no WhatsApp →</a>`
      );
    }
    if (cfg.address) {
      set("infoAddress", `${cfg.address.street}, ${cfg.address.city} · ${cfg.address.state}`);
      set("footAddress", `${cfg.address.street} — ${cfg.address.city}, ${cfg.address.state}`);
    }
    if (contact.mapsUrl) {
      const m = $("#infoMaps");
      if (m) m.href = contact.mapsUrl;
    }
    if (Array.isArray(cfg.businessHours)) {
      set("infoHours", cfg.businessHours.join("<br>"));
      set("footHours", cfg.businessHours.join(" · "));
    }
    const fw = $("#footWhats");
    if (fw && contact.phone) fw.textContent = `${contact.phone} · WhatsApp`;
    const ig = $("#footInstagram");
    if (ig && contact.instagram) {
      ig.href = contact.instagram;
      ig.textContent = clinic.shortName
        ? `Instagram ${contact.instagramLabel || ""}`.trim()
        : "Instagram";
    }
  })();

  /* ---------- Estatísticas (siteConfig + contador) ---------- */
  function runCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || "0", 10);
    const pre = el.dataset.prefix || "";
    const suf = el.dataset.suffix || "";
    const render = (v) =>
      (el.textContent =
        pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString("pt-BR")) + suf);
    if (reducedMotion) return render(target);
    const t0 = performance.now();
    const dur = 1500;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      render(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  (function renderStats() {
    const grid = $("#statsGrid");
    if (!grid || !Array.isArray(cfg.stats)) return;
    grid.innerHTML = cfg.stats
      .map(
        (s, i) => `
      <div class="stat reveal ${i === 1 ? "reveal-d1" : i === 2 ? "reveal-d2" : i === 3 ? "reveal-d3" : ""}">
        <strong><span data-count="${s.value}" data-prefix="${s.prefix || ""}" data-suffix="${s.suffix || ""}"${
          s.decimals ? ` data-decimals="${s.decimals}"` : ""
        }>0</span></strong>
        <small>${s.label}</small>
        ${s.demo ? '<span class="demo-tag">dado demonstrativo</span>' : ""}
      </div>`
      )
      .join("");
  })();

  /* ---------- Tratamentos (siteConfig, sem duplicação) ---------- */
  (function renderTreatments() {
    const grid = $("#treatGrid");
    if (!grid || !Array.isArray(cfg.treatments)) return;
    grid.innerHTML = cfg.treatments
      .map(
        (t, i) => `
      <article class="treat reveal ${
        i % 4 === 1 ? "reveal-d1" : i % 4 === 2 ? "reveal-d2" : i % 4 === 3 ? "reveal-d3" : ""
      }">
        <div class="media"><img src="${t.image}" alt="${t.name}" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK(
          "aura-t" + i
        )}'"></div>
        <div class="body"><h3>${t.name}</h3><p>${t.description}</p>
        <a class="link" href="#contato" aria-label="Agendar avaliação para ${t.name}">Conhecer tratamento <span aria-hidden="true">→</span></a></div>
      </article>`
      )
      .join("");
    // Opções do formulário a partir da mesma fonte.
    const sel = $("#fTrat");
    if (sel) {
      sel.innerHTML = cfg.treatments.map((t) => `<option>${t.name}</option>`).join("");
    }
    // Links do rodapé.
    const foot = $("#footTreats");
    if (foot) {
      foot.innerHTML = cfg.treatments
        .slice(0, 4)
        .map((t) => `<li><a href="#tratamentos">${t.name}</a></li>`)
        .join("");
    }
  })();

  /* ---------- Especialistas (siteConfig) ---------- */
  (function renderTeam() {
    const wrap = $("#teamGrid");
    if (!wrap || !Array.isArray(cfg.specialists)) return;
    wrap.innerHTML = cfg.specialists
      .map(
        (d, i) => `
      <article class="doc reveal ${i === 1 ? "reveal-d1" : i === 2 ? "reveal-d2" : ""}">
        <img src="${d.image}" alt="${d.name}" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK(
          "doc" + (i + 1)
        )}'">
        <div class="body"><small>${d.role}</small><h3>${d.name}</h3><p>${d.description}</p>
        <div class="cro">${d.cro}${d.demo ? " · demonstrativo" : ""}${d.instagram ? " · " + d.instagram : ""}</div></div>
      </article>`
      )
      .join("");
  })();

  /* ---------- Depoimentos (siteConfig) ---------- */
  (function renderTestis() {
    const wrap = $("#testiGrid");
    if (!wrap || !Array.isArray(cfg.testimonials)) return;
    const stars = (n) => "★★★★★".slice(0, n || 5);
    wrap.innerHTML = cfg.testimonials
      .map(
        (t, i) => `
      <div class="testi reveal ${i === 1 ? "reveal-d1" : i === 2 ? "reveal-d2" : ""}">
        <div class="who"><img src="${t.image}" alt="${t.name}" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK(
          "face" + (i + 1)
        )}'">
        <div><b>${t.name}</b><br><span class="stars" aria-label="${t.rating} de 5 estrelas">${stars(t.rating)}</span>${
          t.demo ? ' <span class="demo-tag">demonstrativo</span>' : ""
        }</div></div>
        <p>"${t.text}"</p>
      </div>`
      )
      .join("");
  })();

  /* ---------- Galeria + Before/After (siteConfig) ---------- */
  (function renderGallery() {
    const gal = $("#gallery");
    if (gal && Array.isArray(cfg.gallery)) {
      gal.innerHTML = cfg.gallery
        .map(
          (g, i) => `<img src="${g.src}" alt="${g.alt}" loading="lazy" tabindex="0" role="button" aria-label="Ampliar: ${g.alt}" onerror="this.onerror=null;this.src='${IMG_FALLBACK(
            "g" + (i + 1)
          )}'">`
        )
        .join("");
    }
    const ba = cfg.beforeAfter;
    if (ba) {
      const bImg = $("#baBefore");
      const aImg = $("#baAfterImg");
      if (bImg) {
        bImg.src = ba.before.src;
        bImg.alt = ba.before.alt;
      }
      if (aImg) {
        aImg.src = ba.after.src;
        aImg.alt = ba.after.alt;
      }
      const note = $("#baNote");
      if (note) note.textContent = ba.demoNote;
    }
  })();

  /* ---------- FAQ (siteConfig, acessível) ---------- */
  (function renderFaq() {
    const list = $("#faqList");
    if (!list || !Array.isArray(cfg.faq)) return;
    list.innerHTML = cfg.faq
      .map(
        (f, i) => `
      <div class="faq-item">
        <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">${f.q} <span class="plus" aria-hidden="true">+</span></button>
        <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><p>${f.a}</p></div>
      </div>`
      )
      .join("");
    $$(".faq-item", list).forEach((item) => {
      const btn = item.querySelector(".faq-q");
      btn.addEventListener("click", () => {
        const open = item.classList.contains("open");
        $$(".faq-item.open", list).forEach((o) => {
          o.classList.remove("open");
          o.querySelector(".faq-q")?.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  })();

  /* ---------- Reveal on scroll (único observer) ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        $$("[data-count]", en.target).forEach(runCount);
        if (en.target.hasAttribute("data-count")) runCount(en.target);
        io.unobserve(en.target);
      });
    },
    { threshold: 0.15 }
  );
  const observeReveals = () => $$(".reveal").forEach((el) => io.observe(el));
  observeReveals();

  /* ---------- Marcadores de precisão ---------- */
  const mio = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("active");
          mio.unobserve(en.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  $$(".marker").forEach((m) => mio.observe(m));

  /* ---------- Antes / Depois: mouse + touch + teclado ---------- */
  (function beforeAfter() {
    const ba = $("#baSlider");
    const after = $("#baAfter");
    const handle = $("#baHandle");
    if (!ba || !after || !handle) return;
    const MIN = 4;
    const MAX = 96;
    const STEP = 5;
    const fitAfter = () => {
      const img = after.querySelector("img");
      if (img) img.style.width = ba.clientWidth + "px";
    };
    fitAfter();
    addEventListener("resize", fitAfter, { passive: true });
    const apply = (pct) => {
      const v = Math.min(MAX, Math.max(MIN, Math.round(pct)));
      after.style.width = v + "%";
      handle.style.left = v + "%";
      ba.setAttribute("aria-valuenow", String(v));
    };
    let dragging = false;
    const fromClientX = (clientX) => {
      const r = ba.getBoundingClientRect();
      return ((clientX - r.left) / r.width) * 100;
    };
    ba.addEventListener("pointerdown", (e) => {
      dragging = true;
      try {
        ba.setPointerCapture(e.pointerId);
      } catch {
        /* navegadores sem capture */
      }
      apply(fromClientX(e.clientX));
    });
    ba.addEventListener("pointermove", (e) => {
      if (dragging) apply(fromClientX(e.clientX));
    });
    ["pointerup", "pointercancel"].forEach((ev) =>
      ba.addEventListener(ev, () => (dragging = false))
    );
    ba.addEventListener("keydown", (e) => {
      const cur = parseFloat(ba.getAttribute("aria-valuenow") || "50");
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        apply(cur - STEP);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        apply(cur + STEP);
      } else if (e.key === "Home") {
        e.preventDefault();
        apply(MIN);
      } else if (e.key === "End") {
        e.preventDefault();
        apply(MAX);
      }
    });
  })();

  /* ---------- Microinterações discretas (desktop, sem reduced-motion) ---------- */
  if (finePointer && !reducedMotion && !document.hidden) {
    $$(".exp-card").forEach((card) => {
      card.addEventListener(
        "pointermove",
        (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
          card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        },
        { passive: true }
      );
    });
    // Magnetic sutil — apenas botões principais, deslocamento mínimo.
    $$(".hero-ctas [data-magnetic]").forEach((btn) => {
      btn.addEventListener(
        "pointermove",
        (e) => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px, ${
            (e.clientY - r.top - r.height / 2) * 0.08
          }px)`;
        },
        { passive: true }
      );
      btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
    });

    /* Cursor discreto — pausado com aba oculta / sem motion */
    (function cursor() {
      const dot = $("#cDot");
      const ring = $("#cRing");
      if (!dot || !ring) return;
      let x = -100;
      let y = -100;
      let rx = -100;
      let ry = -100;
      let raf = 0;
      let active = true;
      addEventListener(
        "pointermove",
        (e) => {
          x = e.clientX;
          y = e.clientY;
          dot.style.left = x + "px";
          dot.style.top = y + "px";
          if (active && !raf) raf = requestAnimationFrame(follow);
        },
        { passive: true }
      );
      function follow() {
        raf = 0;
        if (!active || document.hidden) return;
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
        if (Math.abs(x - rx) + Math.abs(y - ry) > 0.5) {
          raf = requestAnimationFrame(follow);
        }
      }
      document.addEventListener("visibilitychange", () => {
        active = !document.hidden;
        if (active && !raf) raf = requestAnimationFrame(follow);
      });
      const hoverables = "a, button, .treat, .gal img, .ba-handle";
      document.addEventListener("pointerover", (e) => {
        if (e.target.closest(hoverables)) ring.classList.add("hovering");
      });
      document.addEventListener("pointerout", (e) => {
        if (e.target.closest(hoverables)) ring.classList.remove("hovering");
      });
    })();
  }

  /* ---------- Lightbox acessível (foco + scroll lock) ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImg");
  const lbClose = $("#lbClose");
  let lastFocus = null;
  function openLightbox(img) {
    if (!lb || !lbImg) return;
    lastFocus = document.activeElement;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose?.focus();
  }
  function closeLightbox() {
    if (!lb || !lb.classList.contains("open")) return;
    lb.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("click", (e) => {
    const img = e.target.closest?.("#gallery img");
    if (img) openLightbox(img);
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.matches?.("#gallery img") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openLightbox(e.target);
    }
  });
  lbClose?.addEventListener("click", closeLightbox);
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  /* ---------- Formulário → WhatsApp (honesto, sem backend falso) ----------
     Adapter futuro: defina `sendLeadToAPI(lead)` retornando Promise.
     Se existir e resolver com {ok:true}, exibe confirmação de envio.
     Caso contrário, segue o fluxo WhatsApp abaixo. */
  async function sendLeadToAPI() {
    return null; // sem backend — ver README "Integrar o formulário"
  }
  $("#leadForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = $("#fNome");
    const tel = $("#fTel");
    const email = $("#fEmail");
    let ok = true;
    const check = (el, errId, bad) => {
      el.classList.toggle("error", bad);
      document.getElementById(errId)?.classList.toggle("show", !!bad);
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) ok = false;
    };
    check(nome, "e-nome", nome.value.trim().length < 2);
    check(tel, "e-tel", tel.value.replace(/\D/g, "").length < 10);
    check(email, "e-email", !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim()));
    if (!ok) {
      toast("Verifique os campos destacados.");
      return;
    }

    const lead = {
      nome: nome.value.trim(),
      telefone: tel.value.trim(),
      email: email.value.trim(),
      tratamento: $("#fTrat").value,
      mensagem: $("#fMsg").value.trim(),
      origem: "site-aura",
      em: new Date().toISOString(),
    };

    // 1) Tenta backend real, se configurado no futuro.
    try {
      const res = await sendLeadToAPI(lead);
      if (res && res.ok) {
        $("#formStatus").textContent =
          "Recebido! Nossa equipe retornará no horário comercial.";
        toast(`Obrigado, ${lead.nome.split(" ")[0]}! Recebemos seus dados.`);
        e.target.reset();
        return;
      }
    } catch {
      /* cai para o fluxo WhatsApp */
    }

    // 2) Fluxo atual: monta mensagem e abre o WhatsApp da clínica.
    const clinica = clinic.name || "Aura Odontologia";
    const msg = [
      `Olá! Vim pelo site da ${clinica}.`,
      ``,
      `Nome: ${lead.nome}`,
      `Telefone: ${lead.telefone}`,
      `E-mail: ${lead.email}`,
      `Tratamento de interesse: ${lead.tratamento}`,
      ``,
      `Mensagem:`,
      lead.mensagem || "(não informada)",
      ``,
      `Gostaria de agendar uma avaliação.`,
    ].join("\n");
    window.open(waLink(msg), "_blank", "noopener");
    $("#formStatus").textContent =
      "Estamos abrindo o WhatsApp para concluir seu atendimento.";
    toast(`Obrigado, ${lead.nome.split(" ")[0]}! Continue pelo WhatsApp.`);
    e.target.reset();
  });
})();
