import mongoose, { Schema, Document } from 'mongoose';

export interface ISubject extends Document {
  classId: string; // Pehle yeh ObjectId tha, ab yeh string hoga (e.g., "class-10")
  name: string;
  price: number;
  pdfUrl?: string; // PDF link ke liye, isko abhi optional rakha hai
}

const SubjectSchema: Schema = new Schema({
  classId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  pdfUrl: { type: String, default: "" }, 
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);