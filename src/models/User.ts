import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  firebaseUID: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firebaseUID: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);