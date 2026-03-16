import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  classId: mongoose.Types.ObjectId;
  streamId?: mongoose.Types.ObjectId; // Optional
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  streamId: { type: Schema.Types.ObjectId, ref: 'Stream' },
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);