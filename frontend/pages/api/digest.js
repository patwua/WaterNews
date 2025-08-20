// Nightly digest builder (provider-optional).
// If Nodemailer is available (installed) and SMTP config present, emails are sent.
// Otherwise, this returns JSON so you can cron on Render and still see output.
import Event from "@/models/Event";
import { dbConnect } from "@/lib/server/db";

export default async function handler(req, res) {
  // Allow GET (preview) and POST (trigger)
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "Method not allowed" });
  try {
    await dbConnect();
  } catch {
    return res.status(200).json({ ok: true, sent: 0, reason: "db offline - preview only" });
  }

  // Build simple per-assignee digest: open items grouped by user
  const pipeline = [
    { $match: { status: { $in: ["open", "in_review", "flagged"] }, assignedTo: { $exists: true, $ne: null } } },
    { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
  ];
  const agg = await Event.aggregate(pipeline).catch(() => []);

  // Try to send if mailer is available & configured
  let sent = 0;
  const smtp = process.env.SMTP_URL || process.env.SMTP_CONNECTION_STRING || null;
  if (smtp) {
    try {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport(smtp);
      for (const row of agg) {
        const to = await lookupUserEmail(row._id); // implement your own mapping
        if (!to) continue;
        const html = `<p>You have <strong>${row.count}</strong> open moderation items.</p><p>Visit the queue to review.</p>`;
        await transport.sendMail({
          to,
          from: process.env.MAIL_FROM || "no-reply@waternews.local",
          subject: "Your WaterNews moderation digest",
          html,
        });
        sent++;
      }
    } catch (e) {
      // If nodemailer is not installed or SMTP fails, fall through and just return JSON
      return res.status(200).json({ ok: true, sent: 0, preview: agg, warn: "mailer unavailable or failed" });
    }
  } else {
    // No SMTP configured: preview JSON
    return res.status(200).json({ ok: true, sent: 0, preview: agg, info: "no SMTP configured" });
  }

  return res.status(200).json({ ok: true, sent });
}

async function lookupUserEmail(userId) {
  // TODO: wire to your users collection/NextAuth user store
  // Safe default: return null to skip if unknown.
  return null;
}
