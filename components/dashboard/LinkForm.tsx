'use client';

import { useState } from 'react';

interface LinkFormProps {
  onSuccess: () => void;
}

export default function LinkForm({ onSuccess }: LinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalUrl,
          customAlias: customAlias || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create link');
      }

      setSuccess(`Link created! ${data.shortUrl}`);
      setOriginalUrl('');
      setCustomAlias('');
      
      // Notify parent to refresh
      setTimeout(() => {
        onSuccess();
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Short Link</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Original URL *
          </label>
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Alias (optional)
          </label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            placeholder="my-custom-link"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Only letters, numbers, hyphens, and underscores (3-50 chars)
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Short Link'}
        </button>
      </form>
    </div>
  );
}