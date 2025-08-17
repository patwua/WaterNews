import mongoose, { Schema, models, model, type Model } from "mongoose";

export interface EventDoc {
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
  
  // NEW moderation workflow fields
  status?: "open" | "in_review" | "flagged" | "resolved";
  assignedTo?: string | null; // moderator user id/email
  secondReview?: boolean;

  createdAt: Date;
  updatedAt: Date;
}

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

    // NEW workflow fields
    status: { type: String, enum: ["open", "in_review", "flagged", "resolved"], default: "open", index: true },
    assignedTo: { type: String, default: null, index: true },
    secondReview: { type: Boolean, default: false, index: true },
  },
  { timestamps: true } // now tracks updatedAt too
);
// Helpful indexes for scaling
EventSchema.index({ type: 1, visibility: 1, createdAt: -1 });
EventSchema.index({ targetId: 1, createdAt: -1 });
EventSchema.index({ actorId: 1, createdAt: -1 });
EventSchema.index({ status: 1, updatedAt: -1 });
EventSchema.index({ assignedTo: 1, status: 1 });

const Event = (models.Event as Model<EventDoc>) || model<EventDoc>("Event", EventSchema);
export default Event;
