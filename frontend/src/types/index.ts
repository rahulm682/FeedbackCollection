export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface Question {
  id: string;
  type: "text" | "multiple-choice";
  questionText: string;
  options?: string[];
  required: boolean;
}

export interface Form {
  _id: string;
  admin: string; // Admin User ID
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface Answer {
  questionId: string;
  answerText?: string;
  selectedOptions?: string[];
}

export interface Response {
  _id: string;
  form: string; // Form ID
  answers: Answer[];
  submittedAt: string;
}
