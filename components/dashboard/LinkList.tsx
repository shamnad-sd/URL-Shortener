'use client';

import { useEffect, useState } from 'react';
import { Link } from '../../types';
import LinkItem from './LinkItem';

interface LinkListProps {
  refreshTrigger: number;
}

export default function LinkList({ refreshTrigger }: LinkListProps) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">Loading links...</p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">
          No links yet. Create your first short link above!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Your Links ({links.length})
      </h2>
      
      <div className="space-y-3">
        {links.map((link) => (
          <LinkItem
            key={link._id}
            link={link}
            onUpdate={fetchLinks}
            onDelete={fetchLinks}
          />
        ))}
      </div>
    </div>
  );
}