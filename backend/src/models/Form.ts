import mongoose, { Document, Schema } from "mongoose";

export interface IQuestion {
  id: string;
  type: "text" | "multiple-choice";
  questionText: string;
  options?: string[];
  required: boolean;
}

export interface IForm extends Document {
  admin: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const FormSchema: Schema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questions: [
    {
      id: { type: String, required: true },
      type: { type: String, enum: ["text", "multiple-choice"], required: true },
      questionText: { type: String, required: true, trim: true },
      options: [{ type: String, trim: true }],
      required: { type: Boolean, default: false },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
});

FormSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export const Form = mongoose.model<IForm>("Form", FormSchema);
