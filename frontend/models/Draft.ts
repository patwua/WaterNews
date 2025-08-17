import mongoose from "mongoose";
const { Schema, models, model } = (mongoose as any);

export type DraftSource = {
  kind: "thread" | "post" | "note" | "external";
  refId: string;      // e.g., thread id, post id, URL, etc.
  hash: string;       // stable hash of source payload
  label?: string;     // human label shown in UI
};

export type DraftDoc = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  body: string;
  coverImage?: string;
  tags: string[];
  type: "news" | "vip" | "post" | "ads";
  status: "draft" | "scheduled" | "published";
  scheduledFor?: Date | null;
  authorId?: string | null;
  sources?: DraftSource[]; // NEW
  createdAt: Date;
  updatedAt: Date;
};

const DraftSourceSchema = new (Schema as any)({
  kind: { type: String, enum: ["thread", "post", "note", "external"], required: true },
  refId: { type: String, required: true },
  hash: { type: String, required: true },
  label: { type: String },
});

const DraftSchema = new (Schema as any)(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true, unique: true },
    summary: { type: String },
    body: { type: String, default: "" },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    type: { type: String, enum: ["news", "vip", "post", "ads"], default: "news" },
    status: { type: String, enum: ["draft", "scheduled", "published"], default: "draft", index: true },
    scheduledFor: { type: Date, default: null },
    authorId: { type: String, default: null },
    sources: { type: [DraftSourceSchema], default: [] }, // NEW
  },
  { timestamps: true }
);

export default (models && (models as any).Draft) ||
  (model as any)("Draft", DraftSchema);
