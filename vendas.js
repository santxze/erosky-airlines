/* ============================================================
   AEROSKY — vendas.js (página de vendas)
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const BRL = (v) => Math.round(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  /* Header */
  const header = $("#header");
  const onScroll = () => {
    const solid = window.scrollY > 40;
    header.classList.toggle("header-solid", solid);
    header.classList.toggle("header-transparent", !solid);
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  const burger = $("#hamburger"), mMenu = $("#mobileMenu");
  burger && burger.addEventListener("click", () => { burger.classList.toggle("open"); mMenu.classList.toggle("open"); });

  /* Countdown (termina à meia-noite) */
  function tick() {
    const now = new Date(), end = new Date(); end.setHours(23, 59, 59, 999);
    let s = Math.max(0, Math.floor((end - now) / 1000));
    $("#cdH").textContent = String(Math.floor(s / 3600)).padStart(2, "0");
    $("#cdM").textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    $("#cdS").textContent = String(s % 60).padStart(2, "0");
  }
  tick(); setInterval(tick, 1000);

  /* Classes */
  const CLASSES = [
    { name: "Econômica", price: 2499, feats: ["Assento padrão 31”", "1 bagagem de mão", "Refeição + entretenimento", "Wi-Fi a bordo"], cta: "checkout.html?origem=São Paulo (GRU)&destino=Lisboa (LIS)&pax=1&classe=Econômica&preco=2499&hora=09:40&voo=ASK 8402" },
    { name: "Econômica Premium", price: 3499, flag: "CUSTO-BENEFÍCIO", feat: true, feats: ["+38% espaço p/ pernas", "Bagagem 23kg inclusa", "Embarque prioritário", "Menu premium + lounge*"], cta: "checkout.html?origem=São Paulo (GRU)&destino=Paris (CDG)&pax=1&classe=Econômica Premium&preco=3499&hora=14:05&voo=ASK 8412" },
    { name: "Executiva", price: 7900, feats: ["Assento-cama 180°", "Lounge + 2 bagagens", "Menu do chef + espumante", "Fast-track + concierge"], cta: "checkout.html?origem=São Paulo (GRU)&destino=Nova York (JFK)&pax=1&classe=Executiva&preco=7900&hora=18:20&voo=ASK 8422" },
    { name: "Primeira Classe", price: 13900, feats: ["Suíte privativa + ducha*", "Champagne + caviar", "Motorista + hotel 5★", "Diamante Club vitalício"], cta: "checkout.html?origem=São Paulo (GRU)&destino=Dubai (DXB)&pax=1&classe=Primeira Classe&preco=13900&hora=22:35&voo=ASK 8432" },
  ];
  $("#classGrid").innerHTML = CLASSES.map(c => `
    <div class="class-card ${c.feat ? "featured" : ""}">
      ${c.flag ? `<span class="c-flag">★ ${c.flag}</span>` : ""}
      <h3>${c.name}</h3><div class="c-price">${BRL(c.price)}</div><small style="color:var(--muted)">por pessoa · ida e volta</small>
      <ul>${c.feats.map(f => `<li>${f}</li>`).join("")}</ul>
      <a href="${c.cta}" class="btn ${c.feat ? "btn-gold" : "btn-ghost"} btn-block" style="margin-top:auto">Voar ${c.name} →</a>
    </div>`).join("");

  /* Combos */
  const COMBOS = [
    { city: "Lisboa · 5 noites", img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=800&q=80", old: 5990, price: 4290, tag: "Voo + Hotel 4★" },
    { city: "Paris · 6 noites", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", old: 7900, price: 5590, tag: "Voo + Hotel 4★" },
    { city: "Miami · 4 noites", img: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=800&q=80", old: 5200, price: 3690, tag: "Voo + Resort" },
  ];
  $("#comboGrid").innerHTML = COMBOS.map(c => `
    <article class="offer-card"><div class="offer-media"><span class="offer-tag promo">${c.tag}</span>
    <img src="${c.img}" alt="${c.city}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'"></div>
    <div class="offer-body"><div class="offer-city">${c.city}</div>
    <div class="offer-foot"><div class="price"><small><s>${BRL(c.old)}</s> por</small><strong>${BRL(c.price)}</strong></div>
    <a class="btn-view" href="checkout.html">Montar combo</a></div></div></article>`).join("");

  /* Depoimentos */
  const TESTIS = [
    { n: "Camila R.", d: "São Paulo → Lisboa · Executiva", t: "Assento-cama impecável e tripulação nota mil. Cheguei descansada e o lounge em Guarulhos é surreal." },
    { n: "Diego M.", d: "Rio → Miami · Econômica Premium", t: "Espaço de sobra para as pernas e Wi-Fi rápido o voo todo. Melhor custo-benefício que já voei." },
    { n: "Fernanda L.", d: "São Paulo → Paris · Econômica", t: "Comprei na sale com SKY10, remarquei sem taxa pelo app e ainda ganhei upgrade. Virei cliente fiel." },
  ];
  $("#testiTrack").innerHTML = TESTIS.map(t => `
    <div class="testi"><div class="stars">★★★★★</div><p>“${t.t}”</p><strong>${t.n}</strong><small>${t.d}</small></div>`).join("");

  /* FAQ */
  const FAQS = [
    ["A remarcação é mesmo grátis?", "Nas tarifas Plus e Max, sim — você remarca pelo app sem multa, pagando só eventual diferença de tarifa. Na Light, há uma taxa fixa de R$ 189."],
    ["O cupom SKY10 funciona em qualquer voo?", "Sim, 10% off em qualquer tarifa no checkout, exceto combos já promocionados. Válido para 1 uso por CPF."],
    ["Como funciona o reembolso de 7 dias?", "Você pode cancelar em até 7 dias após a compra (voos com +30 dias de antecedência) e recebe 100% de volta no mesmo meio de pagamento."],
    ["Acumulo pontos Club comprando aqui?", "Sim! 1 a 2,5 pontos por dólar conforme seu nível. Os pontos caem em até 48h após o voo."],
    ["Posso pagar com Pix?", "Pode — e ganha 5% de desconto automático no checkout. Também aceitamos cartão em até 10x e carteiras digitais."],
  ];
  $("#faqList").innerHTML = FAQS.map(([q, a]) => `
    <div class="faq-item"><button class="faq-q" type="button">${q}<span>+</span></button><div class="faq-a"><p>${a}</p></div></div>`).join("");
  $$(".faq-q").forEach(b => b.addEventListener("click", () => {
    const item = b.parentElement, open = item.classList.contains("open");
    $$(".faq-item").forEach(i => { i.classList.remove("open"); i.querySelector("span").textContent = "+"; });
    if (!open) { item.classList.add("open"); b.querySelector("span").textContent = "−"; }
  }));
})();
