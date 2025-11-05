import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/mongodb';
import Link from '../../../../lib/models/Link';
import User from '../../../../lib/models/User';
import { isValidAlias, isValidUrl } from '../../../../lib/utils';

// PUT - Update a link
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const body = await req.json();
    const { originalUrl, customAlias } = body;
    const link = await Link.findOne({ _id: id, userId: user._id });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    // Validate URL if provided
    if (originalUrl && !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Validate and check custom alias if provided
    if (customAlias && customAlias !== link.customAlias) {
      if (!isValidAlias(customAlias)) {
        return NextResponse.json(
          { error: 'Invalid alias format' },
          { status: 400 }
        );
      }

      const existingLink = await Link.findOne({
        $or: [{ shortCode: customAlias }, { customAlias }],
        _id: { $ne: id },
      });

      if (existingLink) {
        return NextResponse.json(
          { error: 'This alias is already taken' },
          { status: 409 }
        );
      }
    }

    // Update link
    if (originalUrl) link.originalUrl = originalUrl;
    if (customAlias !== undefined) link.customAlias = customAlias;

    await link.save();

    return NextResponse.json({ link }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/links/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a link
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Find and delete link
    const link = await Link.findOneAndDelete({ _id: id, userId: user._id });

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Link deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/links/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}