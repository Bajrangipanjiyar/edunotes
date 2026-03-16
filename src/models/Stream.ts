import mongoose, { Schema, Document } from 'mongoose';

export interface IStream extends Document {
  name: string;
  classId: mongoose.Types.ObjectId; // Kis class ki stream hai (e.g. Class 11)
}

const StreamSchema: Schema = new Schema({
  name: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
}, { timestamps: true });

export default mongoose.models.Stream || mongoose.model<IStream>('Stream', StreamSchema);