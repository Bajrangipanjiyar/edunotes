import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
  name: string;
  subjectId: mongoose.Types.ObjectId;
}

const ChapterSchema: Schema = new Schema({
  name: { type: String, required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
}, { timestamps: true });

export default mongoose.models.Chapter || mongoose.model<IChapter>('Chapter', ChapterSchema);