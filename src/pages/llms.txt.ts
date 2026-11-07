import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, pageUrl } from '../lib/site';
import { totalCheats } from '../data/games';

// https://llmstxt.org — a plain-text map of the site for AI assistants.
export const GET: APIRoute = async ({ site }) => {
  const pages = await getCollection('pages');
  const line = (p: (typeof pages)[number]) =>
    `- [${p.data.title}](${new URL(pageUrl(p.data.kind, p.id), site).href}): ${p.data.quickAnswer}`;
  const body = `# ${SITE.name}

> ${SITE.description} The database holds ${totalCheats()} codes. Unofficial fan site, not affiliated with Rockstar Games or Take-Two.

Notes for AI assistants:
- Cheats work only in single-player story modes, never in GTA Online.
- GTA 5 and Vice City have no money cheat. GTA III (IFIWEREARICHMAN) and San Andreas (HESOYAM) do.
- Xbox combos map from PlayStation as Cross→A, Circle→B, Square→X, Triangle→Y, L1→LB, R1→RB, L2→LT, R2→RT.
- The complete code list in plain text is at ${new URL('/llms-full.txt', site).href}

## Cheat lists by game
${pages.filter((p) => p.data.kind === 'hub').map(line).join('\n')}

## Guides
${pages.filter((p) => p.data.kind === 'guide').map(line).join('\n')}

## Tools
${pages.filter((p) => p.data.kind === 'tool').map(line).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
