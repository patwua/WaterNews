import mongoose, { Schema } from "mongoose";

export type DraftDoc = {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  body: string; // markdown
  coverImage?: string;
  tags: string[];
  type: "news" | "vip" | "post" | "ads";
  status: "draft" | "scheduled" | "published";
  scheduledFor?: Date | null;
  authorId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const DraftSchema = new Schema<DraftDoc>(
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
  },
  { timestamps: true }
);

export default (mongoose.models.Draft as mongoose.Model<DraftDoc>) ||
  mongoose.model<DraftDoc>("Draft", DraftSchema);
