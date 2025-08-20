import nodemailer from "nodemailer";

let transporter = null;
function getTransport() {
  if (transporter) return transporter;
  const url = process.env.SMTP_URL;
  if (!url) return null; // email disabled
  transporter = nodemailer.createTransport(url);
  return transporter;
}

export async function sendEmail({ to, subject, html, text }) {
  const t = getTransport();
  if (!t) return { ok: false, disabled: true };
  const from = process.env.EMAIL_FROM || "WaterNews CMS <no-reply@waternews.invalid>";
  await t.sendMail({ from, to, subject, html: html || text, text });
  return { ok: true };
}
