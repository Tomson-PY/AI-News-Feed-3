import { FeedItem } from '../types';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseAttributeValue: true,
  trimValues: true,
  parseTrueNumberOnly: false
});

const generateUniqueId = (item: any, category: string): string => {
  // Create a unique identifier using multiple item properties
  const titlePart = item.title ? `-${item.title.substring(0, 30)}` : '';
  const datePart = item.pubDate || item.published || item.updated || Date.now();
  const linkPart = item.link ? `-${item.link.split('/').pop()}` : '';
  
  // Create a more unique base ID
  const baseId = `${category}${titlePart}${linkPart}-${new Date(datePart).getTime()}`;
  
  // Clean the ID to remove special characters and spaces
  return baseId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const cleanContent = (content: any): string => {
  if (!content) return '';
  
  const textContent = typeof content === 'string' 
    ? content 
    : content['#text'] || content._ || '';

  return textContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
};

export async function parseFeed(url: string, category: string): Promise<FeedItem[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    if (!text.trim()) {
      throw new Error('Empty response from feed');
    }

    const result = parser.parse(text);
    
    // Handle different RSS feed structures
    const channel = result.rss?.channel || result.feed;
    if (!channel) {
      throw new Error('Invalid feed structure');
    }

    const items = channel.item || channel.entry || [];
    if (!Array.isArray(items)) {
      console.warn('No items found in feed');
      return [];
    }

    return items.map((item: any): FeedItem => {
      const content = item['content:encoded'] || 
                     item.content || 
                     item.description || 
                     item.summary || 
                     '';

      const title = Array.isArray(item.title) ? item.title[0] : item.title;
      const link = Array.isArray(item.link) 
        ? item.link[0]?.href || item.link[0] 
        : typeof item.link === 'string' 
          ? item.link 
          : item.link?.href || '';

      const cleanedContent = cleanContent(content);

      return {
        id: generateUniqueId(item, category),
        title: title || 'Untitled',
        link: link || '',
        content: cleanedContent.substring(0, 300) + (cleanedContent.length > 300 ? '...' : ''),
        pubDate: item.pubDate || item.published || item.updated || new Date().toISOString(),
        category
      };
    });
  } catch (error) {
    console.error(`Error parsing feed: ${url}`, error);
    return [];
  }
}