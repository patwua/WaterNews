import mongoose from "mongoose";
const { Schema } = mongoose as any;

const SessionEventSchema = new Schema(
  {
    sessionId: { type: String, index: true, required: true },
    type: { type: String, required: true }, // "view_category" | "open_post" | ...
    value: { type: String },                // category/tag/slug
    createdAt: { type: Date, default: Date.now, index: true },
  },
  { versionKey: false }
);

// TTL index: 14 days (1209600 seconds)
SessionEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1209600 });

export default (mongoose as any).models.SessionEvent ||
  (mongoose as any).model("SessionEvent", SessionEventSchema, "session_events");
