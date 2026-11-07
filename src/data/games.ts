import type { Cheat, GameKey, GameMeta } from './types';
import { gta5 } from './cheats-gta5';
import { sa } from './cheats-sa';
import { vc } from './cheats-vc';
import { gta3 } from './cheats-gta3';
import { gta4 } from './cheats-gta4';

export const GAMES: Record<GameKey, GameMeta> = {
  gta5: {
    key: 'gta5',
    name: 'Grand Theft Auto V',
    short: 'GTA 5',
    year: 2013,
    city: 'Los Santos',
    hub: '/gta-5-cheats/',
    accent: '#3ddc84',
    platforms: ['ps', 'xbox', 'pc', 'phone'],
    blurb: 'Button combos, PC console codes and 1-999 phone numbers for Michael, Franklin and Trevor.',
  },
  sa: {
    key: 'sa',
    name: 'Grand Theft Auto: San Andreas',
    short: 'GTA San Andreas',
    year: 2004,
    city: 'San Andreas',
    hub: '/gta-san-andreas-cheats/',
    accent: '#ffb547',
    platforms: ['ps', 'xbox', 'switch', 'pc'],
    blurb: 'HESOYAM, the jetpack, the Hydra and every other code CJ ever needed.',
  },
  vc: {
    key: 'vc',
    name: 'Grand Theft Auto: Vice City',
    short: 'GTA Vice City',
    year: 2002,
    city: 'Vice City',
    hub: '/gta-vice-city-cheats/',
    accent: '#ff4fd8',
    platforms: ['ps', 'xbox', 'switch', 'pc'],
    blurb: 'PANZER, flying cars and neon-soaked chaos for Tommy Vercetti.',
  },
  gta3: {
    key: 'gta3',
    name: 'Grand Theft Auto III',
    short: 'GTA 3',
    year: 2001,
    city: 'Liberty City',
    hub: '/gta-3-cheats/',
    accent: '#4fc3ff',
    platforms: ['ps', 'xbox', 'switch', 'pc'],
    blurb: 'The original 3D cheats, including the only real money code in the trilogy.',
  },
  gta4: {
    key: 'gta4',
    name: 'Grand Theft Auto IV',
    short: 'GTA 4',
    year: 2008,
    city: 'Liberty City',
    hub: '/gta-4-cheats/',
    accent: '#c9a26b',
    platforms: ['phone'],
    blurb: "Every phone number for Niko's cell, plus The Lost and Damned and The Ballad of Gay Tony.",
  },
};

export const CHEATS: Record<GameKey, Cheat[]> = { gta5, sa, vc, gta3, gta4 };

export const GAME_ORDER: GameKey[] = ['gta5', 'sa', 'vc', 'gta4', 'gta3'];

export const totalCheats = () => Object.values(CHEATS).reduce((n, list) => n + list.length, 0);
