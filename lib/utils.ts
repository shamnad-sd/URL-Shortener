import { nanoid } from 'nanoid';

/**
 * Generate a unique short code
 */
export function generateShortCode(length: number = 6): string {
  return nanoid(length);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate custom alias
 */
export function isValidAlias(alias: string): boolean {
  // Only allow alphanumeric, hyphens, and underscores
  const aliasRegex = /^[a-zA-Z0-9_-]+$/;
  return aliasRegex.test(alias) && alias.length >= 3 && alias.length <= 50;
}

/**
 * Parse user agent to extract browser and device info
 */
export function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera') || ua.includes('opr')) browser = 'Opera';

  // Device detection
  let device = 'Desktop';
  if (ua.includes('mobile')) device = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) device = 'Tablet';

  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'MacOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone')) os = 'iOS';

  return { browser, device, os };
}

/**
 * Get rate limit key for user
 */
export function getRateLimitKey(userId: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `ratelimit:${userId}:${today}`;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}