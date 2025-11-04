export interface Link {
  _id: string;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  userId: string;
  clickCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsClick {
  _id: string;
  linkId: string;
  shortCode: string;
  timestamp: string;
  userAgent: string;
  browser?: string;
  device?: string;
  os?: string;
  ipAddress?: string;
  referrer?: string;
}

export interface AnalyticsData {
  totalClicks: number;
  recentClicks: AnalyticsClick[];
  browserStats: Record<string, number>;
  deviceStats: Record<string, number>;
}