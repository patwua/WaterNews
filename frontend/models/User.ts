import { Schema, models, model, Model, Document } from 'mongoose'

export interface IUser {
  name?: string
  email: string
  passwordHash: string
  bio: string
  avatarUrl: string
  role: 'author' | 'admin'
}

export type IUserDoc = IUser & Document

const UserSchema = new Schema<IUser>({
  name: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  bio: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  role: { type: String, enum: ['author','admin'], default: 'author' },
}, { timestamps: true })

const UserModel: Model<IUserDoc> = (models.User as Model<IUserDoc>) || model<IUserDoc>('User', UserSchema)
export default UserModel
