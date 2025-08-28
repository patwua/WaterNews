// @ts-nocheck
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { getDb } from "@/lib/db";
import { routeSubject } from "@/lib/cms-routing";
import { uploadLocalFile } from "@/lib/cloudinary";

export const config = { api: { bodyParser: false } };

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: true, keepExtensions: true });
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const { fields, files } = await parseForm(req);
    const subject = String(fields.subject || "general");
    const route = routeSubject(subject);

    const base = {
      subject,
      name: String(fields.name || "").trim(),
      email: String(fields.email || "").trim(),
      phone: String(fields.phone || "").trim(),
      anonymous: String(fields.anonymous || "") === "on" || fields.anonymous === true,
      body: String(fields.story || fields.message || "").trim(),
      queue: route.queue,
      status: route.status,
      priority: route.priority,
      roleTarget: route.role,
      createdAt: new Date(),
      notes: [],
      history: [{ at: new Date(), by: null, action: "created", meta: { queue: route.queue } }],
    };

    if (!base.name) return res.status(400).json({ ok: false, error: "Name is required for verification." });
    if (!base.email) return res.status(400).json({ ok: false, error: "Email is required." });
    if (!base.body) return res.status(400).json({ ok: false, error: "Message is required." });

    // Upload media (if any) to Cloudinary
    let attachments = [];
    const media = files?.media ? [].concat(files.media) : [];
    for (const f of media) {
      try {
        const uploaded = await uploadLocalFile(f.filepath, `waternews/${subject}`);
        attachments.push({
          ...uploaded,
          originalFilename: f.originalFilename,
          mimetype: f.mimetype,
        });
      } catch (e) {
        // Skip failed file; continue others
      } finally {
        try { fs.unlinkSync(f.filepath); } catch {}
      }
    }

    const ticket = { ...base, attachments };

    const db = await getDb();
    if (db) {
      await db.collection("tickets").createIndex({ createdAt: -1 });
      const r = await db.collection("tickets").insertOne(ticket);
      return res.status(200).json({ ok: true, id: r.insertedId });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}
