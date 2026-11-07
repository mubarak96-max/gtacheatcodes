import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { pageUrl } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const pages = await getCollection('pages');
  const latest = pages.reduce((d, p) => (p.data.updatedDate > d ? p.data.updatedDate : d), new Date(0));
  const entries: { loc: string; lastmod: Date; priority: string }[] = [
    { loc: '/', lastmod: latest, priority: '1.0' },
    { loc: '/guides/', lastmod: latest, priority: '0.7' },
    { loc: '/about/', lastmod: latest, priority: '0.3' },
    { loc: '/privacy/', lastmod: latest, priority: '0.1' },
    ...pages.map((p) => ({
      loc: pageUrl(p.data.kind, p.id),
      lastmod: p.data.updatedDate,
      priority: p.data.kind === 'hub' ? '0.9' : p.data.kind === 'tool' ? '0.8' : '0.7',
    })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url><loc>${new URL(e.loc, site).href}</loc><lastmod>${e.lastmod.toISOString().slice(0, 10)}</lastmod><priority>${e.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
