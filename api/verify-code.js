/* ============================================================
   AEROSKY — api/verify-code.js (Vercel Serverless Function)
   Valida o código de 6 dígitos contra o token HMAC.
   ============================================================ */
import crypto from "node:crypto";

const fails = new Map(); // tentativas por token (por instância)

function bad(res, msg, status = 400) {
  return res.status(status).json({ error: msg });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return bad(res, "Método não permitido.", 405);
  const email = (req.body?.email || "").trim().toLowerCase();
  const code = (req.body?.code || "").trim();
  const token = (req.body?.token || "").trim();
  const secret = process.env.VERIFY_SECRET;
  if (!secret) return bad(res, "Serviço de verificação não configurado.", 500);
  if (!/^\d{6}$/.test(code)) return bad(res, "Código inválido. Digite os 6 números.");
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return bad(res, "Código expirado. Peça um novo.", 410);

  const n = (fails.get(token) || 0) + 1;
  fails.set(token, n);
  if (n > 5) return bad(res, "Muitas tentativas. Peça um novo código.", 429);

  const expected = crypto.createHmac("sha256", secret).update(`${email}|${code}|${exp}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return bad(res, "Código incorreto. Tente de novo.");
  fails.delete(token);
  return res.status(200).json({ ok: true, email });
}
