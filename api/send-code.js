/* ============================================================
   AEROSKY — api/send-code.js (Vercel Serverless Function)
   Gera código de 6 dígitos, envia por e-mail e devolve um
   token HMAC stateless (sem banco de dados).
   Provedor: Resend (se RESEND_API_KEY) ou Gmail SMTP.
   ============================================================ */
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const CODE_TTL_MS = 10 * 60 * 1000; // código válido por 10 min
const sentAt = new Map(); // rate-limit simples por instância

function validEmail(e) {
  return typeof e === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());
}

function emailHtml(code) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#F4F7FC;margin:0;padding:32px">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #E2E9F3">
    <div style="font-size:22px;font-weight:800;color:#0A1C3D">✈ AeroSky Airlines</div>
    <p style="color:#5B6B8C">Seu código de verificação é:</p>
    <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#0A1C3D;text-align:center;background:#F4F7FC;border-radius:12px;padding:18px 0;margin:16px 0">${code}</div>
    <p style="color:#5B6B8C;font-size:14px">Válido por 10 minutos. Se você não solicitou, ignore este e-mail.</p>
    <p style="color:#9AA8C3;font-size:12px">© 2026 AeroSky Airlines · Mensagem automática, não responda.</p>
  </div></body></html>`;
}

async function sendMail(to, code) {
  const subject = `Seu código AeroSky: ${code}`;
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "AeroSky Airlines <onboarding@resend.dev>",
      to,
      subject,
      html: emailHtml(code),
    });
    if (error) throw new Error(error.message);
    return "resend";
  }
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const tx = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await tx.sendMail({ from: `AeroSky Airlines <${process.env.GMAIL_USER}>`, to, subject, html: emailHtml(code) });
    return "gmail";
  }
  throw new Error("NO_PROVIDER");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método não permitido." });
  const email = (req.body?.email || "").trim().toLowerCase();
  if (!validEmail(email)) return res.status(400).json({ error: "Informe um e-mail válido." });

  // rate-limit: máx 3 envios / 10 min por e-mail
  const now = Date.now();
  const log = (sentAt.get(email) || []).filter((t) => now - t < CODE_TTL_MS);
  if (log.length >= 3) return res.status(429).json({ error: "Muitos envios. Aguarde 10 minutos." });
  log.push(now);
  sentAt.set(email, log);

  const secret = process.env.VERIFY_SECRET;
  if (!secret) return res.status(500).json({ error: "Serviço de e-mail não configurado (VERIFY_SECRET)." });

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const exp = now + CODE_TTL_MS;
  try {
    await sendMail(email, code);
  } catch (e) {
    if (e.message === "NO_PROVIDER")
      return res.status(500).json({ error: "Provedor de e-mail não configurado (GMAIL_* ou RESEND_API_KEY)." });
    return res.status(502).json({ error: "Falha ao enviar o e-mail. Confira as credenciais." });
  }
  const sig = crypto.createHmac("sha256", secret).update(`${email}|${code}|${exp}`).digest("base64url");
  return res.status(200).json({ ok: true, token: `${exp}.${sig}`, expiresIn: 600 });
}
