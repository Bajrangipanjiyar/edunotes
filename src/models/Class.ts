import mongoose, { Schema, Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  hasStream: boolean; // True for 11th/12th, False for 10th/NEET
}

const ClassSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  hasStream: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);