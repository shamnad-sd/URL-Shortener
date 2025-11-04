import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Link from '../../../../lib/models/Link';
import Analytics from '../../../../lib/models/Analytics';
import { parseUserAgent } from '../../../../lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    
    await connectDB();

    // Find the link
    const link = await Link.findOne({ shortCode, isActive: true });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Get headers for analytics
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const referrer = req.headers.get('referer') || '';
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'Unknown';

    // Parse user agent
    const { browser, device, os } = parseUserAgent(userAgent);

    // Track analytics (async, don't block redirect)
    Promise.all([
      Analytics.create({
        linkId: link._id,
        shortCode,
        userAgent,
        browser,
        device,
        os,
        ipAddress: ip,
        referrer,
      }),
      Link.findByIdAndUpdate(link._id, { $inc: { clickCount: 1 } })
    ]).catch(err => console.error('Analytics error:', err));

    // Return redirect response
    return NextResponse.redirect(link.originalUrl, { status: 302 });
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}