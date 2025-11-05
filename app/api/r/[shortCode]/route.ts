import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Link from '../../../../lib/models/Link';
import Analytics from '../../../../lib/models/Analytics';
import { parseUserAgent } from '../../../../lib/utils';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await context.params;
    await connectDB();

    const link = await Link.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
      isActive: true
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    // Collect analytics info
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const referrer = req.headers.get('referer') || '';
    const ip = req.headers.get('x-forwarded-for') || 'Unknown';
    const { browser, device, os } = parseUserAgent(userAgent);

    // Log analytics asynchronously
    Analytics.create({
      linkId: link._id,
      shortCode,
      userAgent,
      browser,
      device,
      os,
      ipAddress: ip,
      referrer,
    }).catch(console.error);


    await Link.findByIdAndUpdate(link._id, { $inc: { clickCount: 1 } });

    // Redirect to original URL
    return NextResponse.redirect(link.originalUrl);
  } catch (err) {
    console.error('Redirect error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
