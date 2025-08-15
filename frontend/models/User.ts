import { Schema, models, model, type Model } from 'mongoose'

export interface IUser {
  name?: string
  email: string
  passwordHash: string
  bio: string
  avatarUrl: string
  role: 'author' | 'admin'
}

const UserSchema = new Schema<IUser>({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  role: { type: String, enum: ['author','admin'], default: 'author' },
}, { timestamps: true })

// Keep typing minimal to avoid Mongoose 8 generic incompatibilities in CI
const User = (models.User as Model<IUser>) || model<IUser>('User', UserSchema)
export default User
