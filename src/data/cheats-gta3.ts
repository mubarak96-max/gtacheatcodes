import type { Cheat } from './types';

// GTA III (PS2, Xbox, PC, plus The Definitive Edition). PC codes are typed
// during gameplay. GTA III is the only 3D-era game with a straight money cheat.
export const gta3: Cheat[] = [
  { id: 'gesundheit', name: 'Full Health', effect: 'Restores Claude to full health.', category: 'health', ps: 'R2 R2 L1 R1 L D R U L D R U', pc: 'GESUNDHEIT', popular: true },
  { id: 'tortoise', name: 'Full Armor', effect: 'Gives full body armor.', category: 'health', ps: 'R2 R2 L1 L2 L D R U L D R U', pc: 'TORTOISE', popular: true },
  { id: 'ifiwerearichman', name: '$250,000 Money', effect: 'Adds $250,000 to your bank.', category: 'health', ps: 'R2 R2 L1 L1 L D R U L D R U', pc: 'IFIWEREARICHMAN', popular: true },
  { id: 'gunsgunsguns', name: 'All Weapons', effect: 'Gives every weapon with ammo. Repeat for more ammo.', category: 'weapons', ps: 'R2 R2 L1 R2 L D R U L D R U', pc: 'GUNSGUNSGUNS', popular: true },
  { id: 'nastylimbscheat', name: 'Gore Mode', effect: 'Enables extra dismemberment.', category: 'weapons', ps: 'S L1 O D L1 R1 T R L1 X', pc: 'NASTYLIMBSCHEAT' },
  { id: 'nopoliceplease', name: 'Clear Wanted Level', effect: 'Removes all wanted stars.', category: 'wanted', ps: 'R2 R2 L1 R2 U D U D U D', pc: 'NOPOLICEPLEASE', popular: true },
  { id: 'morepoliceplease', name: 'Raise Wanted Level', effect: 'Adds two wanted stars.', category: 'wanted', ps: 'R2 R2 L1 L1 L R L R L R', pc: 'MOREPOLICEPLEASE' },
  { id: 'giveusatank', name: 'Spawn Rhino Tank', effect: 'Spawns a Rhino tank.', category: 'vehicles', ps: 'O O O O O O R1 L2 L1 T O T', pc: 'GIVEUSATANK', popular: true },
  { id: 'chittychittybb', name: 'Flying Cars', effect: 'Cars take off at speed.', category: 'traffic', ps: 'R R2 O R1 L2 D L1 R1', pc: 'CHITTYCHITTYBB', popular: true },
  { id: 'cornerslikemad', name: 'Better Handling', effect: 'Cars grip the road far better.', category: 'traffic', ps: 'R1 L1 R2 L1 L R1 R1 T', pc: 'CORNERSLIKEMAD' },
  { id: 'anicesetofwheels', name: 'Invisible Cars', effect: 'Only the wheels of cars are visible.', category: 'traffic', ps: 'L1 L1 S R2 T L1 T', pc: 'ANICESETOFWHEELS' },
  { id: 'bangbangbang', name: 'Blow Up All Cars', effect: 'Every nearby car explodes.', category: 'fun', ps: 'L2 R2 L1 R1 L2 R2 T S O T L2 L1', pc: 'BANGBANGBANG', risky: true, popular: true },
  { id: 'itsallgoingmaaad', name: 'Pedestrians Riot', effect: 'Pedestrians fight each other.', category: 'peds', ps: 'D U L U X R1 R2 L2 L1', pc: 'ITSALLGOINGMAAAD', risky: true },
  { id: 'nobodylikesme3', name: 'Pedestrians Attack You', effect: 'Every pedestrian turns on you.', category: 'peds', ps: 'D U L U X R1 R2 L1 L2', pc: 'NOBODYLIKESME', risky: true },
  { id: 'weaponsforall', name: 'Pedestrians Have Weapons', effect: 'Pedestrians are armed.', category: 'peds', ps: 'R2 R1 T X L2 L1 U D', pc: 'WEAPONSFORALL' },
  { id: 'skincancerforme', name: 'Sunny Weather', effect: 'Sets sunny weather.', category: 'world', ps: 'L1 L2 R1 R2 R2 R1 L2 T', pc: 'SKINCANCERFORME' },
  { id: 'ilikescotland', name: 'Cloudy Weather', effect: 'Sets cloudy weather.', category: 'world', ps: 'L1 L2 R1 R2 R2 R1 L2 S', pc: 'ILIKESCOTLAND' },
  { id: 'ilovescotland', name: 'Rainy Weather', effect: 'Sets rain.', category: 'world', ps: 'L1 L2 R1 R2 R2 R1 L2 O', pc: 'ILOVESCOTLAND' },
  { id: 'peasoup', name: 'Foggy Weather', effect: 'Sets thick fog.', category: 'world', ps: 'L1 L2 R1 R2 R2 R1 L2 X', pc: 'PEASOUP' },
  { id: 'madweather', name: 'Fast Weather', effect: 'Weather changes rapidly.', category: 'world', pc: 'MADWEATHER' },
  { id: 'timeflieswhenyou', name: 'Faster Clock', effect: 'In-game time passes faster.', category: 'world', ps: 'O O L1 S L1 S S S L1 T O T', pc: 'TIMEFLIESWHENYOU' },
  { id: 'ilikedressingup', name: 'Change Outfit', effect: "Cycles Claude's skin through pedestrian models.", category: 'player', pc: 'ILIKEDRESSINGUP' },
];
