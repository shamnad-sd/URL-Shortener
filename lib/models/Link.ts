import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILink extends Document {
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  userId: mongoose.Types.ObjectId;
  clickCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LinkSchema: Schema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customAlias: {
      type: String,
      sparse: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user queries
LinkSchema.index({ userId: 1, createdAt: -1 });

const Link: Model<ILink> = 
  mongoose.models.Link || mongoose.model<ILink>('Link', LinkSchema);

export default Link;