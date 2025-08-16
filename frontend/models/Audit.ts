import mongoose, { Schema } from "mongoose";

export type AuditDoc = {
  _id: string;
  action:
    | "ingest_create"
    | "assign"
    | "release"
    | "flag_second"
    | "resolve"
    | "reopen";
  actorId?: string | null;     // moderator/system actor
  targetKind: "event";         // reserved for future kinds (post, user, etc.)
  targetId: string;            // Event._id (string)
  prev?: any;                  // minimal previous state snapshot
  next?: any;                  // minimal next state snapshot
  meta?: Record<string, any>;  // arbitrary context (e.g., reason)
  createdAt: Date;
};

const AuditSchema = new Schema<AuditDoc>(
  {
    action: { type: String, required: true },
    actorId: { type: String, default: null, index: true },
    targetKind: { type: String, required: true, index: true },
    targetId: { type: String, required: true, index: true },
    prev: { type: Schema.Types.Mixed },
    next: { type: Schema.Types.Mixed },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditSchema.index({ targetKind: 1, targetId: 1, createdAt: -1 });
AuditSchema.index({ action: 1, createdAt: -1 });

export default (mongoose.models.Audit as mongoose.Model<AuditDoc>) ||
  mongoose.model<AuditDoc>("Audit", AuditSchema);
