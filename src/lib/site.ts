export const SITE = {
  name: 'GTA Cheat Codes',
  shortName: 'GTACheats',
  tagline: 'Every GTA cheat code. Every platform. Zero fluff.',
  description:
    'Verified cheat codes for GTA 5, San Andreas, Vice City, GTA 4 and GTA 3 on PlayStation, Xbox, Switch, PC and phone, with interactive search, a combo trainer and a cheat roulette.',
  locale: 'en_US',
  twitter: '',
  author: 'GTA Cheat Codes Editorial Team',
};

export const pageUrl = (kind: 'hub' | 'guide' | 'tool', slug: string) =>
  kind === 'hub' ? `/${slug}/` : kind === 'guide' ? `/guides/${slug}/` : `/tools/${slug}/`;
