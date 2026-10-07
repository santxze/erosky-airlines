/* ============================================================
   AEROSKY — checkout.js
   Wizard de compra: tarifa → pax/assentos → extras → pagamento
   Salva a reserva em localStorage (aerosky_bookings) p/ o admin.
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const BRL = (v) => Math.round(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  function toast(msg, type = "info") {
    const wrap = $("#toastWrap");
    if (!wrap) return alert(msg.replace(/<[^>]+>/g, ""));
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<span>${type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 4200);
  }

  /* ---------- Dados do voo (via query) ---------- */
  const q = new URLSearchParams(location.search);
  const flight = {
    origem: q.get("origem") || "São Paulo (GRU)",
    destino: q.get("destino") || "Lisboa (LIS)",
    ida: q.get("ida") || new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10),
    volta: q.get("volta") || "",
    pax: Math.max(1, Math.min(6, parseInt(q.get("pax") || "1", 10) || 1)),
    classe: q.get("classe") || "Econômica",
    hora: q.get("hora") || "09:40",
    voo: q.get("voo") || "ASK 8402",
    base: parseFloat(q.get("preco") || "2499") || 2499,
  };

  const state = { step: 1, fare: "plus", seats: [], extras: {}, pay: "card", coupon: 0, couponCode: "" };

  const FARES = {
    light: { name: "Light", mult: 1, desc: "O essencial para viajar leve", feats: ["1 bagagem de mão", "Remarcação com taxa", "Assento padrão", "Acumula 1x pontos"] },
    plus: { name: "Plus", mult: 1.22, desc: "O equilíbrio favorito", flag: "MAIS ESCOLHIDA", feats: ["Bagagem despachada 23kg", "Remarcação flexível", "Escolha de assento grátis", "Acumula 1,5x pontos"] },
    max: { name: "Max", mult: 1.55, desc: "Máximo conforto e flex", feats: ["2 bagagens + prioritária", "Reembolso total", "Assento extra-conforto", "Acumula 2x pontos + lounge"] },
  };
  const EXTRAS = [
    { id: "bag", icon: "🧳", name: "Bagagem extra 23kg", desc: "Por passageiro · despacho prioritário", price: 189 },
    { id: "meal", icon: "🍽️", name: "Menu premium do chef", desc: "Prato quente + sobremesa + espumante", price: 129 },
    { id: "lounge", icon: "☕", name: "Acesso ao lounge VIP", desc: "Open food, ducha e Wi-Fi rápido", price: 199 },
    { id: "seg", icon: "🛡️", name: "Seguro viagem total", desc: "Saúde, extravio e cancelamento", price: 149 },
    { id: "prio", icon: "⚡", name: "Embarque prioritário", desc: "Grupo 1 + fila exclusiva", price: 79 },
  ];

  /* ---------- Render tarifa ---------- */
  const fareGrid = $("#fareGrid");
  fareGrid.innerHTML = Object.entries(FARES).map(([id, f]) => {
    const p = flight.base * f.mult;
    return `<div class="fare ${id === state.fare ? "sel" : ""}" data-fare="${id}">
      ${f.flag ? `<span class="flag">${f.flag}</span>` : ""}
      <strong>${f.name}</strong><small>${f.desc}</small>
      <div class="fp">${BRL(p)}</div><small>por pessoa</small>
      <ul>${f.feats.map(x => `<li>✓ ${x}</li>`).join("")}</ul></div>`;
  }).join("");
  $$("[data-fare]", fareGrid).forEach(el => el.addEventListener("click", () => {
    state.fare = el.dataset.fare;
    $$("[data-fare]", fareGrid).forEach(x => x.classList.toggle("sel", x === el));
    renderSummary();
  }));

  /* ---------- Passageiros ---------- */
  const paxForms = $("#paxForms");
  paxForms.innerHTML = Array.from({ length: flight.pax }, (_, i) => `
    <div style="border:1.5px solid var(--line);border-radius:14px;padding:16px">
      <strong style="font-size:.9rem;color:var(--navy-800)">🧍 Passageiro ${i + 1}${i === 0 ? " · Titular" : ""}</strong>
      <div class="form-grid" style="margin-top:12px">
        <div><label class="lbl">Nome completo</label><input class="inp" data-paxname="${i}" placeholder="Como está no documento"></div>
        <div><label class="lbl">Nascimento</label><input class="inp" type="date" data-paxdob="${i}"></div>
        <div><label class="lbl">Documento (CPF/Passaporte)</label><input class="inp" data-paxdoc="${i}" placeholder="000.000.000-00"></div>
        <div><label class="lbl">Assento</label><input class="inp" data-paxseat="${i}" readonly placeholder="Escolha no mapa" style="background:#FFFDF4"></div>
      </div>
    </div>`).join("");
  $("#seatCount").textContent = `${flight.pax} assento(s)`;

  /* ---------- Mapa de assentos ---------- */
  const seatMap = $("#seatMap");
  const occupied = new Set(["1A", "1B", "2C", "3D", "4B", "5E", "6A", "7F", "8C"]);
  const rows = 8, cols = ["A", "B", "C", "", "D", "E", "F"];
  seatMap.innerHTML = Array.from({ length: rows }, (_, r) => cols.map(c => {
    if (!c) return `<span class="seat aisle">${r + 1}</span>`;
    const code = `${r + 1}${c}`;
    const occ = occupied.has(code) ? "occ" : "free";
    return `<button type="button" class="seat ${occ}" data-seat="${code}" ${occ === "occ" ? "disabled" : ""}>${code}</button>`;
  }).join("")).join("");
  $$("[data-seat]", seatMap).forEach(b => b.addEventListener("click", () => {
    const code = b.dataset.seat;
    if (state.seats.includes(code)) {
      state.seats = state.seats.filter(s => s !== code);
      b.classList.remove("sel");
    } else {
      if (state.seats.length >= flight.pax) { toast(`Você só precisa de <b>${flight.pax} assento(s)</b>.`, "error"); return; }
      state.seats.push(code); b.classList.add("sel");
    }
    $$("[data-paxseat]").forEach((inp, i) => inp.value = state.seats[i] || "");
    renderSummary();
  }));

  /* ---------- Extras ---------- */
  const extrasList = $("#extrasList");
  extrasList.innerHTML = EXTRAS.map(e => `
    <div class="extra" data-extra="${e.id}">
      <span class="e-ic">${e.icon}</span>
      <div><strong>${e.name}</strong><small>${e.desc}</small></div>
      <span class="e-price">+${BRL(e.price)}</span>
    </div>`).join("");
  $$("[data-extra]", extrasList).forEach(el => el.addEventListener("click", () => {
    const id = el.dataset.extra;
    state.extras[id] = !state.extras[id];
    el.classList.toggle("on", state.extras[id]);
    renderSummary();
  }));

  /* ---------- Pagamento ---------- */
  $$("[data-pay]").forEach(b => b.addEventListener("click", () => {
    state.pay = b.dataset.pay;
    $$("[data-pay]").forEach(x => x.classList.toggle("sel", x === b));
    $("#payCard").hidden = state.pay !== "card";
    $("#payPix").hidden = state.pay !== "pix";
    renderSummary();
  }));
  const ccNum = $("#ccNum"), ccExp = $("#ccExp");
  ccNum.addEventListener("input", () => ccNum.value = ccNum.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "));
  ccExp.addEventListener("input", () => {
    let v = ccExp.value.replace(/\D/g, "").slice(0, 4);
    ccExp.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
  });
  $("#ctPhone").addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    e.target.value = v.length > 6 ? `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}` : v;
  });

  /* ---------- Totais ---------- */
  function totals() {
    const fareP = flight.base * FARES[state.fare].mult;
    const tickets = fareP * flight.pax;
    const extras = Object.entries(state.extras).filter(([, on]) => on).reduce((s, [id]) => s + EXTRAS.find(e => e.id === id).price * flight.pax, 0);
    const fees = 89 * flight.pax;
    let subtotal = tickets + extras + fees;
    const discount = state.pay === "pix" ? subtotal * 0.05 : 0;
    const couponD = subtotal * state.coupon;
    return { fareP, tickets, extras, fees, discount, couponD, total: Math.max(0, subtotal - discount - couponD) };
  }

  function renderSummary() {
    const t = totals();
    $("#ckRoute").innerHTML = `<b>${flight.origem} → ${flight.destino}</b> · ${flight.voo} · ${flight.ida}${flight.volta ? " · volta " + flight.volta : " · só ida"} · ${flight.pax} pax · ${flight.classe}`;
    $("#sumRoute").textContent = `${flight.voo} · ${flight.hora} · Tarifa ${FARES[state.fare].name}`;
    $("#sumLines").innerHTML = `
      <div class="s-line"><span>Passagens (${flight.pax}x ${BRL(t.fareP)})</span><span>${BRL(t.tickets)}</span></div>
      <div class="s-line"><span>Assentos</span><span>${state.seats.length ? state.seats.join(", ") : "—"}</span></div>
      <div class="s-line"><span>Extras</span><span>${t.extras ? "+" + BRL(t.extras) : "—"}</span></div>
      <div class="s-line"><span>Taxas de embarque</span><span>${BRL(t.fees)}</span></div>
      ${t.discount ? `<div class="s-line"><span>Desconto Pix (5%)</span><span>−${BRL(t.discount)}</span></div>` : ""}
      ${t.couponD ? `<div class="s-line"><span>Cupom ${state.couponCode}</span><span>−${BRL(t.couponD)}</span></div>` : ""}
      <div class="s-line total"><span>Total</span><strong>${BRL(t.total)}</strong></div>`;
    $("#ccParc").innerHTML = Array.from({ length: 10 }, (_, i) => {
      const n = i + 1, v = t.total / n;
      return `<option>Em ${n}x de ${BRL(v)}${n === 1 ? " à vista" : " sem juros"}</option>`;
    }).join("");
  }
  renderSummary();

  $("#btnCoupon").addEventListener("click", () => {
    const c = $("#coupon").value.trim().toUpperCase();
    if (c === "SKY10") { state.coupon = 0.10; state.couponCode = c; toast("Cupom <b>SKY10</b>: 10% off aplicado!", "success"); }
    else if (!c) { state.coupon = 0; state.couponCode = ""; }
    else { toast("Cupom inválido. Tente <b>SKY10</b>.", "error"); return; }
    renderSummary();
  });

  /* ---------- Wizard ---------- */
  const btnNext = $("#btnNext"), btnBack = $("#btnBack");
  function goStep(n) {
    state.step = Math.max(1, Math.min(5, n));
    $$("[data-panel]").forEach(p => p.hidden = +p.dataset.panel !== state.step);
    $$("#stepsBar .step").forEach(s => {
      const k = +s.dataset.s;
      s.classList.toggle("active", k === state.step);
      s.classList.toggle("done", k < state.step);
    });
    btnBack.style.visibility = state.step === 1 || state.step === 5 ? "hidden" : "visible";
    btnNext.style.display = state.step === 5 ? "none" : "";
    btnNext.textContent = state.step === 4 ? "💳 Pagar agora" : "Continuar →";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  btnBack.addEventListener("click", () => goStep(state.step - 1));

  function validStep() {
    if (state.step === 2) {
      let ok = true;
      $$("[data-paxname]").forEach(i => { const bad = i.value.trim().length < 3; i.classList.toggle("error", bad); if (bad) ok = false; });
      $$("[data-paxdoc]").forEach(i => { const bad = i.value.trim().length < 4; i.classList.toggle("error", bad); if (bad) ok = false; });
      if (!ok) { toast("Preencha nome e documento de todos os passageiros.", "error"); return false; }
      if (state.seats.length < flight.pax) { toast(`Escolha <b>${flight.pax} assento(s)</b> no mapa.`, "error"); return false; }
    }
    if (state.step === 4) {
      if (state.pay === "card") {
        const numBad = ccNum.value.replace(/\D/g, "").length < 16;
        const nameBad = $("#ccName").value.trim().length < 3;
        const expBad = !/^\d{2}\/\d{2}$/.test(ccExp.value);
        const cvvBad = $("#ccCvv").value.trim().length < 3;
        [ccNum, $("#ccName"), ccExp, $("#ccCvv")].forEach(i => i.classList.remove("error"));
        if (numBad) ccNum.classList.add("error");
        if (nameBad) $("#ccName").classList.add("error");
        if (expBad) ccExp.classList.add("error");
        if (cvvBad) $("#ccCvv").classList.add("error");
        if (numBad || nameBad || expBad || cvvBad) { toast("Confira os dados do cartão.", "error"); return false; }
      }
      const emBad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test($("#ctEmail").value.trim());
      $("#ctEmail").classList.toggle("error", emBad);
      if (emBad) { toast("Informe um e-mail válido para receber os bilhetes.", "error"); return false; }
      if (!$("#acceptTerms").checked) { toast("Aceite os termos para concluir.", "error"); return false; }
    }
    return true;
  }

  btnNext.addEventListener("click", () => {
    if (!validStep()) return;
    if (state.step < 4) { goStep(state.step + 1); return; }
    // Pagar
    btnNext.disabled = true; btnNext.textContent = "Processando… ⏳";
    setTimeout(() => {
      const t = totals();
      const code = "ASK" + Math.random().toString(36).slice(2, 6).toUpperCase();
      const booking = {
        code, origem: flight.origem, destino: flight.destino, ida: flight.ida,
        volta: flight.volta, pax: flight.pax, classe: flight.classe,
        voo: flight.voo, hora: flight.hora, tarifa: FARES[state.fare].name,
        seats: [...state.seats], extras: Object.keys(state.extras).filter(k => state.extras[k]),
        pay: state.pay === "pix" ? "Pix" : "Cartão", total: Math.round(t.total),
        email: $("#ctEmail").value.trim(), status: "Confirmado", created: new Date().toISOString(),
      };
      const all = JSON.parse(localStorage.getItem("aerosky_bookings") || "[]");
      all.unshift(booking);
      localStorage.setItem("aerosky_bookings", JSON.stringify(all));
      $("#locatorCode").textContent = code;
      $("#successDetail").textContent = `${flight.origem} → ${flight.destino} · ${flight.ida} · ${flight.pax} pax · ${BRL(t.total)} no ${booking.pay}`;
      btnNext.disabled = false;
      goStep(5);
      toast("Reserva <b>" + code + "</b> criada com sucesso!", "success");
    }, 1400);
  });

  goStep(1);
})();
