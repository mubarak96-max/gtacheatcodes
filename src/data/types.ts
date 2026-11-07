export type Category =
  | 'health'
  | 'weapons'
  | 'wanted'
  | 'vehicles'
  | 'player'
  | 'world'
  | 'traffic'
  | 'peds'
  | 'fun';

export type Platform = 'ps' | 'xbox' | 'pc' | 'phone' | 'switch';

/**
 * A single cheat.
 * `ps` is a space-separated PlayStation sequence using tokens:
 *   X O T S (cross, circle, triangle, square), L1 L2 R1 R2, U D L R (d-pad).
 * Xbox and Switch inputs are derived from it (see lib/buttons.ts).
 */
export interface Cheat {
  id: string;
  name: string;
  effect: string;
  category: Category;
  ps?: string;
  pc?: string;
  pcAlt?: string;
  phone?: string;
  note?: string;
  /** Marks a cheat that can break missions or saves. */
  risky?: boolean;
  /** Marks fan favourites for "top cheats" views. */
  popular?: boolean;
}

export interface GameMeta {
  key: GameKey;
  name: string;
  short: string;
  year: number;
  city: string;
  hub: string;
  accent: string;
  platforms: Platform[];
  blurb: string;
}

export type GameKey = 'gta5' | 'sa' | 'vc' | 'gta3' | 'gta4';

export const CATEGORY_LABELS: Record<Category, string> = {
  health: 'Health & Armor',
  weapons: 'Weapons & Combat',
  wanted: 'Wanted Level',
  vehicles: 'Vehicle Spawns',
  player: 'Player & Skills',
  world: 'Weather & Time',
  traffic: 'Traffic & Driving',
  peds: 'Pedestrians',
  fun: 'Chaos & Fun',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  ps: 'PlayStation',
  xbox: 'Xbox',
  pc: 'PC',
  phone: 'Phone',
  switch: 'Switch',
};
