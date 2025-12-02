import { NextResponse } from 'next/server';

type MediumArticle = {
  title: string;
  link: string;
  publishedAt: string;
};

// Try alternative Medium RSS URL formats (including proxy mirrors that tend
// to bypass Cloudflare challenges that frequently block direct fetches from
// serverless environments like Vercel during local development).
const MEDIUM_FEED_URLS = [
  'https://medium.com/feed/@mriganavdeka',
  'https://mriganavdeka.medium.com/feed',
  // Jina mirror fetcher – simply streams the target page's contents so we can
  // still parse RSS when Medium responds with bot protection to our IP.
  'https://r.jina.ai/https://medium.com/feed/@mriganavdeka',
  'https://r.jina.ai/https://mriganavdeka.medium.com/feed',
];
const MAX_ARTICLES = 16;

const htmlEntityMap: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

const stripCdata = (value: string) => value.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1');

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
      if (entity[0] === '#') {
        const isHex = entity[1].toLowerCase() === 'x';
        const code = isHex ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCharCode(code) : match;
      }

      return htmlEntityMap[entity.toLowerCase()] ?? match;
    })
    .trim();

const extractTagContent = (item: string, tag: string) => {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = item.match(regex);
  if (!match) return '';
  return decodeHtmlEntities(stripCdata(match[1]));
};

const parseFeed = (xml: string): MediumArticle[] => {
  const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  const articles: MediumArticle[] = [];

  for (const match of matches) {
    const segment = match[1];
    const title = extractTagContent(segment, 'title');
    const link = extractTagContent(segment, 'link');
    const publishedAt = extractTagContent(segment, 'pubDate');

    if (title && link) {
      articles.push({ title, link, publishedAt });
    }

    if (articles.length >= MAX_ARTICLES * 2) {
      break;
    }
  }

  return articles
    .sort((a, b) => {
      const timeA = Date.parse(a.publishedAt) || 0;
      const timeB = Date.parse(b.publishedAt) || 0;
      return timeB - timeA;
    })
    .slice(0, MAX_ARTICLES);
};

export async function GET() {
  // Try each URL until one works
  for (const feedUrl of MEDIUM_FEED_URLS) {
    try {
      const response = await fetch(feedUrl, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        cache: 'no-store',
        next: { revalidate: 3600 }, // Revalidate every hour
      });

      if (!response.ok) {
        continue; // Try next URL
      }

      const xml = await response.text();
      
      // Check if we got HTML instead of XML (Cloudflare challenge)
      if (xml.trim().startsWith('<!DOCTYPE') || xml.includes('challenge-platform')) {
        continue; // Try next URL
      }

      const articles = parseFeed(xml);
      
      if (articles.length > 0) {
        return NextResponse.json({ articles });
      }
    } catch (error) {
      console.error(`[medium-articles] Failed to fetch from ${feedUrl}`, error);
      continue; // Try next URL
    }
  }

  // All URLs failed
  console.error('[medium-articles] All Medium feed URLs failed');
  return NextResponse.json({ articles: [], error: 'Feed temporarily unavailable' }, { status: 503 });
}

