import nodemailer, { Transporter } from "nodemailer";

let transporter: Transporter | null = null;
function getTransport(): Transporter | null {
  if (transporter) return transporter;
  const url = process.env.SMTP_URL;
  if (!url) return null; // email disabled
  transporter = nodemailer.createTransport(url);
  return transporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<{ ok: boolean; disabled?: boolean }> {
  const t = getTransport();
  if (!t) return { ok: false, disabled: true };
  const from =
    process.env.EMAIL_FROM || "WaterNews CMS <no-reply@waternews.invalid>";
  await t.sendMail({ from, to, subject, html: html || text, text });
  return { ok: true };
}

export default sendEmail;
