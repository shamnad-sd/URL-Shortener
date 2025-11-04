import { redirect } from 'next/navigation';
import connectDB from '../../lib/mongodb';
import Link from '../../lib/models/Link';
import NotFound from '../../components/NotFound';

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
      <NotFound  code='404' message='not found'/>
    );
  }

  // Redirect through API for analytics tracking
  redirect(`/api/r/${shortCode}`);
}
