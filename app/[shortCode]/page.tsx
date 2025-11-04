import { redirect } from 'next/navigation';
import connectDB from '../../lib/mongodb';
import Link from '../../lib/models/Link';

interface PageProps {
  params: { shortCode: string };
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  await connectDB();
  const link = await Link.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }],
    isActive: true
  }).lean();

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Link not found</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Redirect through API for analytics tracking
  redirect(`/api/r/${shortCode}`);
}
