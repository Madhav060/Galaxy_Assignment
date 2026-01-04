import mongoose, { Schema, Document, Model } from "mongoose";

// 1. TypeScript Interface
export interface IUser extends Document {
  clerkId: string;     // The unique ID from Clerk (e.g., user_2n...)
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    clerkId: { 
      type: String, 
      required: true, 
      unique: true, 
      index: true // Indexing makes looking up users by Clerk ID very fast
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    firstName: { type: String },
    lastName: { type: String },
    imageUrl: { type: String },
  },
  { 
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

// 3. Next.js Hot Reload Fix
// Checks if the model exists in the global cache before creating a new one
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

