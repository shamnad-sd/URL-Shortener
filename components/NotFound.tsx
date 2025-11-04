import Link from 'next/link';

export default function NotFound({
  code = '404',
  message = 'Not found',
}: {
  code?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">{code}</h1>
        <p className="text-xl text-gray-600 mb-8">{message}</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
