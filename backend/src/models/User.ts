import mongoose, { Document, Schema } from "mongoose";

// Define the User document interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string; // Hashed password
  createdAt: Date;
}

// Define the User schema
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the User model
export const User = mongoose.model<IUser>("User", UserSchema);
