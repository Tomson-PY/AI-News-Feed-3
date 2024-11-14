export const createProxiedUrl = (url: string): string => {
  // For Google News, use their RSS feed directly without proxy
  if (url.includes('news.google.com')) {
    return url;
  }

  // Use a reliable CORS proxy for other sources
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}