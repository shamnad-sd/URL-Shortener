import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
    },
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development
const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;