import mongoose, { Schema } from "mongoose";

export type EventDoc = {
  _id: string;
  type:
    | "article_published"
    | "thread_hot"
    | "follow"
    | "like"
    | "moderation_note";
  actorId?: string | null;
  targetId?: string | null; // postId/threadId/userId
  visibility: "public" | "internal"; // privacy control
  redactedText?: string;            // safe text used for embeddings/recs
  rawTextHash?: string;             // hash of raw text (no raw store by default)
  tags?: string[];
  category?: string | null;
  createdAt: Date;
};

const EventSchema = new Schema<EventDoc>(
  {
    type: { type: String, required: true },
    actorId: { type: String, default: null },
    targetId: { type: String, default: null },
    visibility: { type: String, enum: ["public", "internal"], default: "public", index: true },
    redactedText: { type: String, default: "" },
    rawTextHash: { type: String, default: "" },
    tags: { type: [String], default: [] },
    category: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
EventSchema.index({ type: 1, visibility: 1, createdAt: -1 });
EventSchema.index({ targetId: 1, createdAt: -1 });
EventSchema.index({ actorId: 1, createdAt: -1 });

export default (mongoose.models.Event as mongoose.Model<EventDoc>) ||
  mongoose.model<EventDoc>("Event", EventSchema);
