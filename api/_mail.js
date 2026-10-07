/* ============================================================
   AEROSKY — api/_mail.js (helper compartilhado)
   Envia via Resend (se RESEND_API_KEY) ou Gmail SMTP.
   ============================================================ */
import nodemailer from "nodemailer";
import { Resend } from "resend";

export async function sendMail({ to, subject, html }) {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "AeroSky Airlines <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    if (error) throw new Error(error.message);
    return "resend";
  }
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const tx = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await tx.sendMail({ from: `AeroSky Airlines <${process.env.GMAIL_USER}>`, to, subject, html });
    return "gmail";
  }
  const e = new Error("NO_PROVIDER");
  throw e;
}
