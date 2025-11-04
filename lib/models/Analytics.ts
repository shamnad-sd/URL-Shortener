import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnalytics extends Document {
  linkId: mongoose.Types.ObjectId;
  shortCode: string;
  timestamp: Date;
  userAgent: string;
  browser?: string;
  device?: string;
  os?: string;
  ipAddress?: string;
  referrer?: string;
}

const AnalyticsSchema: Schema = new Schema(
  {
    linkId: {
      type: Schema.Types.ObjectId,
      ref: 'Link',
      required: true,
      index: true,
    },
    shortCode: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    os: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    referrer: {
      type: String,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for analytics queries
AnalyticsSchema.index({ linkId: 1, timestamp: -1 });
AnalyticsSchema.index({ shortCode: 1, timestamp: -1 });

const Analytics: Model<IAnalytics> = 
  mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

export default Analytics;