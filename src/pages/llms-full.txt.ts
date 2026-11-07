import type { APIRoute } from 'astro';
import { CHEATS, GAMES, GAME_ORDER } from '../data/games';
import { CATEGORY_LABELS } from '../data/types';
import { sequenceText } from '../lib/buttons';
import { SITE } from '../lib/site';

// Every cheat code in plain text, for AI assistants and quick reference.
export const GET: APIRoute = ({ site }) => {
  const sections = GAME_ORDER.map((k) => {
    const g = GAMES[k];
    const rows = CHEATS[k].map((c) => {
      const parts = [`### ${c.name}`, `Effect: ${c.effect}`, `Category: ${CATEGORY_LABELS[c.category]}`];
      if (c.ps) {
        parts.push(`PlayStation: ${sequenceText(c.ps, 'ps')}`);
        parts.push(`Xbox: ${sequenceText(c.ps, 'xbox')}`);
        if (g.platforms.includes('switch')) parts.push(`Switch (Definitive Edition): ${sequenceText(c.ps, 'switch')}`);
      }
      if (c.pc) parts.push(`PC: ${c.pc}${c.pcAlt ? ` (or ${c.pcAlt})` : ''}`);
      if (c.phone) parts.push(`Phone: ${c.phone}`);
      if (c.note) parts.push(`Note: ${c.note}`);
      if (c.risky) parts.push('Warning: can break missions or saves; do not save while active.');
      return parts.join('\n');
    });
    return `## ${g.name} (${g.year}) cheat codes\nSource page: ${new URL(g.hub, site).href}\n\n${rows.join('\n\n')}`;
  });
  const body = `# ${SITE.name}: complete cheat code list\n\n${SITE.description}\nSingle-player only. Unofficial fan resource.\n\n${sections.join('\n\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
