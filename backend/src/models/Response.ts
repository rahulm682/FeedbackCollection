import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for a single answer
export interface IAnswer {
  questionId: string;
  answerText?: string;
  selectedOptions?: string[];
}

// Define the Response document interface
export interface IResponse extends Document {
  form: mongoose.Types.ObjectId;
  answers: IAnswer[];
  submittedAt: Date;
}

// Define the Response schema
const ResponseSchema: Schema = new Schema({
  form: {
    type: Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  answers: [
    {
      questionId: { type: String, required: true },
      answerText: { type: String, trim: true },
      selectedOptions: [{ type: String, trim: true }],
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Response = mongoose.model<IResponse>('Response', ResponseSchema);
