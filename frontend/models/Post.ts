import mongoose, { Schema } from "mongoose";

export type PostDoc = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;            // markdown (raw)
  coverImage?: string;
  tags: string[];
  category: "news" | "vip" | "post" | "ads";
  publishedAt: Date;
  authorId?: string | null;
  engagementScore?: number;
  isBreaking?: boolean;
};

const PostSchema = new Schema<PostDoc>(
  {
    slug: { type: String, required: true, index: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    category: { type: String, enum: ["news", "vip", "post", "ads"], default: "news", index: true },
    publishedAt: { type: Date, required: true, index: true },
    authorId: { type: String, default: null },
    engagementScore: { type: Number, default: 0 },
    isBreaking: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Post as mongoose.Model<PostDoc>) ||
  mongoose.model<PostDoc>("Post", PostSchema);
