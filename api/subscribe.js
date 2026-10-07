/* ============================================================
   AEROSKY — api/subscribe.js (Vercel Serverless Function)
   Newsletter "Ofertas exclusivas": salva no Supabase e envia
   e-mail de boas-vindas com descontos.
   Env: SUPABASE_URL + SUPABASE_SERVICE_KEY (tabela: supabase.sql)
   ============================================================ */
import { sendMail } from "./_mail.js";

const SITE = process.env.SITE_URL || "https://aerosky-airlines.vercel.app";

function offersHtml() {
  const card = (cidade, preco, link) => `
    <div style="border:1px solid #E2E9F3;border-radius:12px;padding:16px;margin:12px 0">
      <div style="font-weight:800;color:#0A1C3D;font-size:17px">${cidade}</div>
      <div style="color:#5B6B8C;font-size:13px">Ida e volta · taxas incluídas</div>
      <div style="font-weight:800;color:#0A1C3D;font-size:20px;margin:6px 0">${preco} <span style="font-size:12px;color:#5B6B8C">/pessoa</span></div>
      <a href="${link}" style="display:inline-block;background:#0A1C3D;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 20px;border-radius:10px">Ver voos →</a>
    </div>`;
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#F4F7FC;margin:0;padding:32px">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #E2E9F3">
    <div style="font-size:22px;font-weight:800;color:#0A1C3D">✈ AeroSky Airlines</div>
    <h1 style="color:#0A1C3D;font-size:24px;margin:16px 0 4px">Ofertas exclusivas de descontos 🎉</h1>
    <p style="color:#5B6B8C">Você entrou para a lista VIP. Use o cupom <b style="color:#9A7626;background:#FBF3DE;padding:3px 10px;border-radius:8px">SKY10</b> e ganhe 10% off em qualquer voo.</p>
    ${card("Lisboa · 5 noites", "R$ 4.290", SITE + "/vendas.html")}
    ${card("Paris · 6 noites", "R$ 5.590", SITE + "/vendas.html")}
    ${card("Miami · 4 noites", "R$ 3.690", SITE + "/vendas.html")}
    <a href="${SITE}/vendas.html" style="display:block;text-align:center;background:linear-gradient(135deg,#DDBB62,#C9A24B);color:#1A1206;text-decoration:none;font-weight:800;padding:14px;border-radius:12px;margin-top:8px">Quero minhas ofertas →</a>
    <p style="color:#9AA8C3;font-size:12px;margin-top:16px">© 2026 AeroSky Airlines · Valores fictícios de demonstração.</p>
  </div></body></html>`;
}

async function saveSubscriber(email) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return { saved: false, reason: "SUPABASE_NOT_CONFIGURED" };
  const r = await fetch(`${url.replace(/\/$/, "")}/rest/v1/newsletter_subscribers`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify({ email }),
  });
  if (!r.ok) return { saved: false, reason: `SUPABASE_${r.status}` };
  return { saved: true };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  const email = (req.body?.email || "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "Informe um e-mail válido." });

  const db = await saveSubscriber(email).catch(() => ({ saved: false, reason: "SUPABASE_ERROR" }));
  try {
    await sendMail({ to: email, subject: "🎉 Ofertas exclusivas de descontos — AeroSky", html: offersHtml() });
  } catch (e) {
    if (e.message === "NO_PROVIDER")
      return res.status(500).json({ error: "Provedor de e-mail não configurado (GMAIL_* ou RESEND_API_KEY).", saved: db.saved });
    return res.status(502).json({ error: "Inscrito salvo, mas o e-mail falhou. Tente de novo.", saved: db.saved });
  }
  return res.status(200).json({ ok: true, saved: db.saved, detail: db.reason || undefined });
}
