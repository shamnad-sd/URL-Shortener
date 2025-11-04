import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '../../../lib/mongodb';
import Link from '../../../lib/models/Link';
import User from '../../../lib/models/User';
import { generateShortCode, isValidAlias, isValidUrl } from '../../../lib/utils';


// In-memory rate limiting (use Redis in production)
const rateLimitStore = new Map<string, number>();

function checkRateLimit(userId: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}:${today}`;
  const count = rateLimitStore.get(key) || 0;
  const limit = parseInt(process.env.RATE_LIMIT_PER_DAY || '100');
  
  if (count >= limit) {
    return false;
  }
  
  rateLimitStore.set(key, count + 1);
  return true;
}

// GET - Fetch all links for the logged-in user
export async function GET(req: NextRequest) {
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

    const links = await Link.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ links }, { status: 200 });
  } catch (error) {
    console.error('GET /api/links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new short link
export async function POST(req: NextRequest) {
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

    // Safely obtain a string representation of the user's id for rate-limiting.
    // Mongoose _id can be an ObjectId (with toString) or a string.
  const rawUserId: unknown = (user as { _id?: { toString(): string } | string })._id;
    let userIdStr: string;
    if (
      rawUserId !== null &&
      typeof rawUserId === 'object' &&
      typeof (rawUserId as { toString?: unknown }).toString === 'function'
    ) {
      userIdStr = (rawUserId as { toString(): string }).toString();
    } else {
      userIdStr = String(rawUserId);
    }

    // Check rate limit
    if (!checkRateLimit(userIdStr)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Maximum links per day reached.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { originalUrl, customAlias } = body;

    // Validate URL
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate or validate short code
    let shortCode: string;

    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return NextResponse.json(
          { error: 'Invalid alias. Use only letters, numbers, hyphens, and underscores (3-50 chars)' },
          { status: 400 }
        );
      }

      // Check if alias already exists
      const existingLink = await Link.findOne({
        $or: [{ shortCode: customAlias }, { customAlias }],
      });

      if (existingLink) {
        return NextResponse.json(
          { error: 'This alias is already taken' },
          { status: 409 }
        );
      }

      shortCode = customAlias;
    } else {
      // Generate unique short code
      do {
        shortCode = generateShortCode();
      } while (await Link.findOne({ shortCode }));
    }

    // Create link
    const newLink = await Link.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || undefined,
      userId: user._id,
    });

    return NextResponse.json(
      { 
        link: newLink,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${shortCode}`
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/links error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}