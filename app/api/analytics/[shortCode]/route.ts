import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/mongodb';
import Link from '../../../../lib/models/Link';
import Analytics from '../../../../lib/models/Analytics';
import User from '../../../../lib/models/User';

//  GET - Fetch analytics for a specific link
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { shortCode } = await params;
    const link = await Link.findOne({ shortCode, userId: user._id });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    // Fetch analytics data
    const analyticsData = await Analytics.find({ linkId: link._id })
      .sort({ timestamp: -1 })
      .limit(100)
      .lean();

    // Aggregate data
    const totalClicks = link.clickCount;
    
    // Group by browser
    const browserStats = analyticsData.reduce((acc: any, item) => {
      const browser = item.browser || 'Unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    // Group by device
    const deviceStats = analyticsData.reduce((acc: any, item) => {
      const device = item.device || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      totalClicks,
      recentClicks: analyticsData,
      browserStats,
      deviceStats,
    }, { status: 200 });
  } catch (error) {
    console.error('GET /api/analytics/[shortCode] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}