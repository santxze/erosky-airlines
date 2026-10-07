/* ============================================================
   AEROSKY — admin.js
   Dashboard: KPIs, reservas (localStorage + seed), voos, relatórios.
   Login demo: admin@aerosky.com / sky123 (sessionStorage).
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const BRL = (v) => Math.round(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

  function toast(msg, type = "info") {
    const wrap = $("#toastWrap");
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<span>${type === "success" ? "✅" : type === "error" ? "⚠️" : "ℹ️"}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 4000);
  }

  /* ---------- Auth ---------- */
  const gate = $("#loginGate"), app = $("#adminApp");
  function isAuthed() { return sessionStorage.getItem("aerosky_admin") === "1"; }
  function showApp() { gate.style.display = "none"; app.hidden = false; boot(); }
  if (isAuthed()) showApp();
  $("#adminLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#adEmail").value.trim() === "admin@aerosky.com" && $("#adPass").value === "sky123") {
      sessionStorage.setItem("aerosky_admin", "1"); showApp(); toast("Bem-vindo ao painel, <b>comandante</b> ✈", "success");
    } else toast("Credenciais inválidas. Use o acesso demo.", "error");
  });
  $("#btnLogout").addEventListener("click", () => { sessionStorage.removeItem("aerosky_admin"); location.reload(); });

  /* ---------- Dados ---------- */
  const SEED = [
    { code: "ASK8X2", route: "GRU → LIS", voo: "ASK 8402", ida: "2026-11-18", pax: 2, total: 5498, email: "maria@email.com", pay: "Cartão", status: "Confirmado", tarifa: "Plus" },
    { code: "ASK4M9", route: "GIG → MIA", voo: "ASK 8410", ida: "2026-12-05", pax: 1, total: 2899, email: "joao@email.com", pay: "Pix", status: "Confirmado", tarifa: "Light" },
    { code: "ASK7Q1", route: "GRU → CDG", voo: "ASK 8412", ida: "2026-12-20", pax: 3, total: 13200, email: "ana@email.com", pay: "Cartão", status: "Pendente", tarifa: "Max" },
    { code: "ASK2Z8", route: "GRU → JFK", voo: "ASK 8422", ida: "2026-11-30", pax: 2, total: 7900, email: "pedro@email.com", pay: "Cartão", status: "Confirmado", tarifa: "Plus" },
    { code: "ASK9T4", route: "GIG → EZE", voo: "ASK 8430", ida: "2026-11-12", pax: 4, total: 4996, email: "lucas@email.com", pay: "Pix", status: "Cancelado", tarifa: "Light" },
  ];
  let FLIGHTS = JSON.parse(localStorage.getItem("aerosky_flights") || "null") || [
    { num: "ASK 8402", route: "GRU → LIS", time: "09:40", price: 2499, occ: 82, active: true },
    { num: "ASK 8410", route: "GIG → MIA", time: "09:10", price: 2899, occ: 76, active: true },
    { num: "ASK 8412", route: "GRU → CDG", time: "14:05", price: 3949, occ: 91, active: true },
    { num: "ASK 8422", route: "GRU → JFK", time: "18:20", price: 3399, occ: 68, active: true },
    { num: "ASK 8430", route: "GIG → EZE", time: "07:30", price: 1249, occ: 54, active: false },
  ];

  function realBookings() {
    return JSON.parse(localStorage.getItem("aerosky_bookings") || "[]").map(b => ({
      code: b.code, route: `${short(b.origem)} → ${short(b.destino)}`, voo: b.voo, ida: b.ida,
      pax: b.pax, total: b.total, email: b.email, pay: b.pay, status: b.status, tarifa: b.tarifa,
    }));
  }
  function short(s) { const m = /\(([A-Z]{3})\)/.exec(s || ""); return m ? m[1] : (s || "—").split(" ")[0]; }
  function allBookings() { return [...realBookings(), ...SEED]; }
  function saveFlights() { localStorage.setItem("aerosky_flights", JSON.stringify(FLIGHTS)); }

  /* ---------- Navegação ---------- */
  $$("[data-view]").forEach(b => b.addEventListener("click", () => {
    $$("[data-view]").forEach(x => x.classList.toggle("active", x === b));
    $$("[data-viewpanel]").forEach(p => p.hidden = p.dataset.viewpanel !== b.dataset.view);
    $("#viewTitle").textContent = b.textContent.replace(/^[^\s]+\s/, "").split("  ")[0] || b.textContent;
  }));

  /* ---------- Render ---------- */
  function badge(s) {
    const cls = s === "Confirmado" ? "ok" : s === "Pendente" ? "wait" : "cancel";
    return `<span class="badge ${cls}">${s}</span>`;
  }

  function boot() { renderAll(); }

  function renderAll() {
    const books = allBookings();
    const revenue = books.filter(b => b.status !== "Cancelado").reduce((s, b) => s + b.total, 0);
    $("#kRev").textContent = BRL(revenue);
    $("#kBook").textContent = books.length;
    $("#kOcc").textContent = "78%";
    $("#kTk").textContent = BRL(revenue / Math.max(1, books.filter(b => b.status !== "Cancelado").length));
    $("#bookCount").textContent = books.length;

    $("#recentBody").innerHTML = books.slice(0, 5).map(b => `
      <tr><td><b>${b.code}</b></td><td>${b.route}</td><td>${b.ida}</td><td>${b.pax}</td><td><b>${BRL(b.total)}</b></td><td>${badge(b.status)}</td></tr>`).join("");

    renderBookings(); renderFlights(); renderCharts(books);
  }

  function renderBookings() {
    const term = ($("#fSearch").value || "").toLowerCase();
    const st = $("#fStatus").value;
    const books = allBookings().filter(b =>
      (!st || b.status === st) &&
      (!term || (b.code + b.route + b.email).toLowerCase().includes(term)));
    $("#bookBody").innerHTML = books.length ? books.map((b, i) => `
      <tr><td><b>${b.code}</b></td><td><b>${b.route}</b><br><small style="color:var(--muted)">${b.email} · ${b.tarifa}</small></td>
      <td>${b.voo}<br><small style="color:var(--muted)">${b.ida} · ${b.pax} pax</small></td>
      <td>${b.pay}</td><td><b>${BRL(b.total)}</b></td><td>${badge(b.status)}</td>
      <td><div class="tbl-actions">
        <button class="icon-btn" data-act="ok" data-code="${b.code}">✓ Confirmar</button>
        <button class="icon-btn danger" data-act="cancel" data-code="${b.code}">✕ Cancelar</button>
        <button class="icon-btn danger" data-act="del" data-code="${b.code}">🗑</button>
      </div></td></tr>`).join("")
      : `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:26px">Nenhuma reserva encontrada.</td></tr>`;

    $$("#bookBody [data-act]").forEach(btn => btn.addEventListener("click", () => {
      const code = btn.dataset.code, act = btn.dataset.act;
      // altera primeiro nas reservas reais; seed é só leitura (simula via toast)
      const real = JSON.parse(localStorage.getItem("aerosky_bookings") || "[]");
      const idx = real.findIndex(b => b.code === code);
      if (idx === -1) { toast(`Reserva demo <b>${code}</b>: ação simulada (${act === "ok" ? "confirmada" : act === "cancel" ? "cancelada" : "excluída"}). Vendas do checkout podem ser alteradas de verdade.`, "info"); return; }
      if (act === "del") real.splice(idx, 1);
      else real[idx].status = act === "ok" ? "Confirmado" : "Cancelado";
      localStorage.setItem("aerosky_bookings", JSON.stringify(real));
      renderAll(); toast(`Reserva <b>${code}</b> atualizada.`, "success");
    }));
  }
  $("#fSearch")?.addEventListener("input", renderBookings);
  $("#fStatus")?.addEventListener("change", renderBookings);

  function renderFlights() {
    $("#flightBody").innerHTML = FLIGHTS.map((f, i) => `
      <tr><td><b>${f.num}</b></td><td>${f.route}</td><td>${f.time}</td><td>${BRL(f.price)}</td>
      <td><div class="bar-track" style="min-width:90px"><div class="bar-fill" style="width:${f.occ}%"></div></div><small>${f.occ}%</small></td>
      <td>${f.active ? '<span class="badge ok">Ativo</span>' : '<span class="badge cancel">Pausado</span>'}</td>
      <td><div class="tbl-actions"><button class="icon-btn" data-f="toggle" data-i="${i}">${f.active ? "⏸ Pausar" : "▶ Ativar"}</button><button class="icon-btn danger" data-f="del" data-i="${i}">🗑</button></div></td></tr>`).join("");
    $$("#flightBody [data-f]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.i;
      if (b.dataset.f === "del") FLIGHTS.splice(i, 1); else FLIGHTS[i].active = !FLIGHTS[i].active;
      saveFlights(); renderFlights(); toast("Malha atualizada.", "success");
    }));
  }
  $("#flightForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    FLIGHTS.unshift({ num: $("#flNum").value.trim().toUpperCase(), route: $("#flRoute").value.trim().toUpperCase(), time: $("#flTime").value, price: +$("#flPrice").value, occ: Math.floor(20 + Math.random() * 60), active: true });
    saveFlights(); renderFlights(); e.target.reset(); toast("Voo cadastrado com sucesso!", "success");
  });

  function bar(label, val, max, money) {
    return `<div class="bar-row"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(val / max * 100)}%"></div></div><b>${money ? BRL(val) : val}</b></div>`;
  }
  function renderCharts(books) {
    const days = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
    const rev = [42, 58, 51, 67, 89, 74, 63].map(v => v * 1000);
    $("#revChart").innerHTML = days.map((d, i) => bar(d, rev[i], 89000, true)).join("");
    const occ = [["LIS", 91], ["CDG", 87], ["MIA", 79], ["JFK", 74], ["EZE", 58]];
    $("#occChart").innerHTML = occ.map(([d, v]) => bar(d, v, 100, false)).join("").replaceAll("</b>", "%</b>");

    const byDest = {};
    books.filter(b => b.status !== "Cancelado").forEach(b => byDest[b.route] = (byDest[b.route] || 0) + b.total);
    const maxD = Math.max(1, ...Object.values(byDest));
    $("#destChart").innerHTML = Object.entries(byDest).map(([d, v]) => bar(d, v, maxD, true)).join("");

    const byFare = {};
    books.forEach(b => byFare[b.tarifa || "Plus"] = (byFare[b.tarifa || "Plus"] || 0) + 1);
    const maxF = Math.max(1, ...Object.values(byFare));
    $("#fareChart").innerHTML = Object.entries(byFare).map(([d, v]) => bar(d, v, maxF, false)).join("").replaceAll("</b>", " vendas</b>");

    const total = books.filter(b => b.status !== "Cancelado").reduce((s, b) => s + b.total, 0);
    $("#execSummary").innerHTML = `A operação soma <b>${BRL(total)}</b> em ${books.length} reservas (incluindo vendas do checkout em tempo real). O destino de maior receita é <b>${Object.entries(byDest).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"}</b>. Recomendação: reforçar malha GRU → LIS/CDG e manter a sale com cupom SKY10 — conversão 18% acima da média.`;
  }

  /* Export CSV */
  $("#btnExport").addEventListener("click", () => {
    const books = allBookings();
    const csv = "codigo,rota,voo,data,pax,total,email,pagamento,status\n" + books.map(b => [b.code, b.route, b.voo, b.ida, b.pax, b.total, b.email, b.pay, b.status].join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "aerosky-reservas.csv"; a.click();
    toast("Relatório CSV exportado.", "success");
  });
})();
