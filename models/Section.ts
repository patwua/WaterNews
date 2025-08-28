import mongoose, { Schema, models, model, type Model } from "mongoose";

export interface SectionDoc {
  _id: string;
  id: string;
  enabled: boolean;
  context?: Record<string, any> | null;
}

const SectionSchema = new Schema<SectionDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    enabled: { type: Boolean, default: true },
    context: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const Section = (models.Section as Model<SectionDoc>) || model<SectionDoc>("Section", SectionSchema);
export default Section;
