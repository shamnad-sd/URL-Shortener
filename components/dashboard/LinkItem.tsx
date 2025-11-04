 'use client';

import { useEffect, useState } from 'react';
import { Link as LinkType  } from '../../types';

interface LinkItemProps {
  link: LinkType;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function LinkItem({ link, onUpdate, onDelete }: LinkItemProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editUrl, setEditUrl] = useState(link.originalUrl);
  const [editAlias, setEditAlias] = useState(link.customAlias || '');
  const [loading, setLoading] = useState(false);
  
  // Prefer the custom alias for display if present, otherwise use the generated shortCode
  const displayCode = link.customAlias || link.shortCode;
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${displayCode}`;


  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/links/${link._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl: editUrl,
          customAlias: editAlias,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        onUpdate();
        alert('Link updated successfully!');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update link');
      }
    } catch (error) {
      alert('Error updating link');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const res = await fetch(`/api/links/${link._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDelete();
      } else {
        alert('Failed to delete link');
      }
    } catch (error) {
      alert('Error deleting link');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Keep local edit fields in sync when the parent updates the link prop
  useEffect(() => {
    setEditUrl(link.originalUrl);
    setEditAlias(link.customAlias || '');
  }, [link._id, link.originalUrl, link.customAlias]);

  if (isEditing) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Edit Link</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original URL
            </label>
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Alias (optional)
            </label>
            <input
              type="text"
              value={editAlias}
              onChange={(e) => setEditAlias(e.target.value)}
              placeholder="my-custom-link"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {shortUrl}
            </a>
            <button
              onClick={handleCopy}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          
          <p className="text-sm text-gray-600 truncate mb-2">
            → {link.originalUrl}
          </p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <span className="mr-1">👆</span>
              <span className="font-semibold">{link.clickCount}</span>
              <span className="ml-1">clicks</span>
            </span>
            <span className="flex items-center">
              <span className="mr-1">📅</span>
              {formatDate(link.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
          >
            {showAnalytics ? 'Hide Stats' : 'Stats'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>

      {showAnalytics && (
        <div className="mt-4 pt-4 border-t">
          <AnalyticsView shortCode={link.shortCode} />
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ shortCode }: { shortCode: string }) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchAnalytics = async () => {
    if (loaded) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/${shortCode}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
        setLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loaded && !loading) {
    fetchAnalytics();
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading analytics...</p>;
  }

  if (!analytics || analytics.totalClicks === 0) {
    return <p className="text-sm text-gray-500">No clicks yet</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl font-bold text-gray-800">{analytics.totalClicks}</span>
        <span className="text-sm text-gray-600">Total Clicks</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded p-3">
          <p className="text-xs text-blue-600 font-medium mb-2">Browsers</p>
          {Object.entries(analytics.browserStats || {}).length > 0 ? (
            Object.entries(analytics.browserStats).map(([browser, count]: any) => (
              <p key={browser} className="text-sm text-gray-700">
                {browser}: <span className="font-semibold">{count}</span>
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No data</p>
          )}
        </div>
        
        <div className="bg-green-50 rounded p-3">
          <p className="text-xs text-green-600 font-medium mb-2">Devices</p>
          {Object.entries(analytics.deviceStats || {}).length > 0 ? (
            Object.entries(analytics.deviceStats).map(([device, count]: any) => (
              <p key={device} className="text-sm text-gray-700">
                {device}: <span className="font-semibold">{count}</span>
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No data</p>
          )}
        </div>
      </div>

      {analytics.recentClicks && analytics.recentClicks.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Recent Clicks</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analytics.recentClicks.slice(0, 10).map((click: any) => (
              <div key={click._id} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                <span className="font-medium">{click.browser || 'Unknown'}</span> on{' '}
                <span className="font-medium">{click.device || 'Unknown'}</span>
                {' • '}
                {new Date(click.timestamp).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}