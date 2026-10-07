/* ============================================================
   AEROSKY — verify-email.js
   Widget de verificação por código de e-mail (Gmail e outros).
   Uso: AeroSkyVerify.open(emailInicial?, onVerified)
   Persiste em localStorage: aerosky_verified_email
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const LS_KEY = "aerosky_verified_email";

  function toast(msg, type = "info") {
    const wrap = $("#toastWrap");
    if (!wrap) return alert(msg.replace(/<[^>]+>/g, ""));
    const el = document.createElement("div");
    el.className = "toast " + type;
    el.innerHTML = `<span>${type === "success" ? "✅" : type === "error" ? "⚠️" : "📩"}</span><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 4500);
  }

  let token = null, email = "", timer = null, cooldown = 0, onVerified = null;

  function ensureModal() {
    if ($("#modal-verify")) return;
    const css = document.createElement("style");
    css.textContent = `.code-boxes{display:flex;gap:8px;justify-content:center;margin:16px 0}
.code-boxes input{width:46px;height:54px;text-align:center;font-size:1.4rem;font-weight:800;font-family:var(--font-display);border:1.5px solid var(--line);border-radius:12px;background:#F8FAFD;color:var(--navy-800);outline:none}
.code-boxes input:focus{border-color:var(--blue);box-shadow:0 0 0 4px rgba(46,155,255,.13)}
.verified-badge{display:inline-flex;align-items:center;gap:6px;background:#E6F9EF;color:#0A7A3D;font-weight:800;font-size:.78rem;padding:6px 12px;border-radius:100px;margin-top:8px}`;
    document.head.appendChild(css);
    const div = document.createElement("div");
    div.innerHTML = `
    <div class="modal-overlay" id="modal-verify">
      <div class="modal">
        <button class="modal-close" data-close>✕</button>
        <h3>📩 Verificar e-mail</h3>
        <p class="m-sub">Enviamos um código de 6 dígitos. Vale para Gmail e outros provedores.</p>
        <div id="vfStep1">
          <div class="field"><label class="lbl">Seu e-mail</label><input class="inp" id="vfEmail" type="email" placeholder="voce@gmail.com"></div>
          <button class="btn btn-gold btn-block" id="vfSend" type="button">Enviar código →</button>
        </div>
        <div id="vfStep2" hidden>
          <p style="font-size:.88rem;color:var(--muted)">Código enviado para <b id="vfSentTo"></b></p>
          <div class="code-boxes" id="vfBoxes">${"<input inputmode='numeric' maxlength='1'>".repeat(6)}</div>
          <button class="btn btn-primary btn-block" id="vfCheck" type="button">Verificar código</button>
          <p style="text-align:center;font-size:.83rem;color:var(--muted);margin-top:12px"><button id="vfResend" type="button" style="color:var(--blue);font-weight:700" disabled>Aguarde 60s para reenviar</button></p>
        </div>
      </div>
    </div>`;
    document.body.appendChild(div);
    const overlay = $("#modal-verify");
    overlay.addEventListener("click", (e) => { if (e.target === overlay || e.target.closest("[data-close]")) overlay.classList.remove("open"); });
    $("#vfSend").addEventListener("click", sendCode);
    $("#vfCheck").addEventListener("click", checkCode);
    $("#vfResend").addEventListener("click", sendCode);
    $$("#vfBoxes input").forEach((inp, i, all) => {
      inp.addEventListener("input", () => { inp.value = inp.value.replace(/\D/g, ""); if (inp.value && i < 5) all[i + 1].focus(); });
      inp.addEventListener("keydown", (e) => { if (e.key === "Backspace" && !inp.value && i > 0) all[i - 1].focus(); });
      inp.addEventListener("paste", (e) => {
        const d = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
        if (d.length === 6) { e.preventDefault(); d.split("").forEach((c, j) => all[j].value = c); all[5].focus(); }
      });
    });
  }

  async function sendCode() {
    email = ($("#vfEmail").value || "").trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast("Informe um e-mail válido.", "error"); return; }
    const btn = $("#vfSend");
    btn.disabled = true; btn.textContent = "Enviando… ⏳";
    try {
      const r = await fetch("/api/send-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha ao enviar.");
      token = j.token;
      $("#vfStep1").hidden = true; $("#vfStep2").hidden = false;
      $("#vfSentTo").textContent = email;
      $$("#vfBoxes input").forEach((i) => (i.value = ""));
      $("#vfBoxes input").focus();
      startCooldown();
      toast(`Código enviado para <b>${email}</b>. Confira a caixa de entrada (e o spam).`, "success");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      btn.disabled = false; btn.textContent = "Enviar código →";
    }
  }

  function startCooldown() {
    cooldown = 60;
    const b = $("#vfResend");
    clearInterval(timer);
    timer = setInterval(() => {
      cooldown -= 1;
      if (cooldown <= 0) { clearInterval(timer); b.disabled = false; b.textContent = "Reenviar código"; }
      else { b.disabled = true; b.textContent = `Aguarde ${cooldown}s para reenviar`; }
    }, 1000);
    b.disabled = true; b.textContent = "Aguarde 60s para reenviar";
  }

  async function checkCode() {
    const code = $$("#vfBoxes input").map((i) => i.value).join("");
    if (!/^\d{6}$/.test(code)) { toast("Digite os 6 números do código.", "error"); return; }
    const btn = $("#vfCheck");
    btn.disabled = true; btn.textContent = "Verificando…";
    try {
      const r = await fetch("/api/verify-code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, code, token }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Falha na verificação.");
      localStorage.setItem(LS_KEY, JSON.stringify({ email: j.email, at: new Date().toISOString() }));
      $("#modal-verify").classList.remove("open");
      toast(`E-mail <b>${j.email}</b> verificado! ✅`, "success");
      document.dispatchEvent(new CustomEvent("aerosky:verified", { detail: { email: j.email } }));
      if (onVerified) onVerified(j.email);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      btn.disabled = false; btn.textContent = "Verificar código";
    }
  }

  window.AeroSkyVerify = {
    open(initialEmail, cb) {
      ensureModal();
      onVerified = cb || null;
      token = null;
      $("#vfStep1").hidden = false; $("#vfStep2").hidden = true;
      if (initialEmail) $("#vfEmail").value = initialEmail;
      $("#modal-verify").classList.add("open");
      setTimeout(() => $("#vfEmail").focus(), 100);
    },
    verified() {
      try { return JSON.parse(localStorage.getItem(LS_KEY) || "null"); } catch { return null; }
    },
  };
})();
