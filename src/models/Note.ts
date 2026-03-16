import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  title: string;
  description: string;
  classId: mongoose.Types.ObjectId;
  streamId?: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  chapterId: mongoose.Types.ObjectId;
  isFree: boolean;
  price: number;
  pdfUrl: string;
  thumbnailUrl: string;
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Hierarchy Links
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  streamId: { type: Schema.Types.ObjectId, ref: 'Stream' }, // Optional
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
  
  // Pricing
  isFree: { type: Boolean, default: false },
  price: { type: Number, default: 0 }, // Agar isFree true hai, toh price 0 hogi
  
  // Media Files (Cloudinary Links)
  pdfUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);