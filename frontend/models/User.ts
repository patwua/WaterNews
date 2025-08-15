import { Schema, models, model } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  role: { type: String, enum: ['author','admin'], default: 'author' },
}, { timestamps: true })

export default models.User || model('User', UserSchema)
