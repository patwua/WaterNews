import mongoose, { Schema, models, model, type Model } from "mongoose";

export interface PostDoc {
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
}

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

PostSchema.index({ publishedAt: -1 });
PostSchema.index({ tags: 1, publishedAt: -1 });
PostSchema.index({ title: "text", excerpt: "text" }); // requires MongoDB text index support
PostSchema.index({ slug: 1 }, { unique: true });

const Post = (models.Post as Model<PostDoc>) || model<PostDoc>("Post", PostSchema);
export default Post;
