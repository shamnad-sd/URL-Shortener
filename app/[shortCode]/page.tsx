import { redirect } from 'next/navigation';
import connectDB from '../../lib/mongodb';
import Link from '../../lib/models/Link';


interface PageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const { shortCode } = await params;

  try {
    await connectDB();

    // Find the link
    const link = await Link.findOne({ shortCode, isActive: true }).lean();

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

    // Use API route for tracking and redirect
    redirect(`/api/r/${shortCode}`);
  } catch (error) {
    console.error('Redirect error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-lg text-gray-600 mb-4">Something went wrong</p>
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
}