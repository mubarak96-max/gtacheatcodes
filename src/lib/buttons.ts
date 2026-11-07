import type { Platform } from '../data/types';

/** PlayStation token -> display data for each controller family. */
export type Token = 'X' | 'O' | 'T' | 'S' | 'L1' | 'L2' | 'R1' | 'R2' | 'U' | 'D' | 'L' | 'R';

export interface ButtonGlyph {
  label: string;
  /** Visual style key used by the CSS. */
  kind: 'face' | 'shoulder' | 'dpad';
  color?: string;
  /** Full name for screen readers. */
  aria: string;
}

const DPAD: Record<string, ButtonGlyph> = {
  U: { label: '↑', kind: 'dpad', aria: 'Up' },
  D: { label: '↓', kind: 'dpad', aria: 'Down' },
  L: { label: '←', kind: 'dpad', aria: 'Left' },
  R: { label: '→', kind: 'dpad', aria: 'Right' },
};

const PS: Record<string, ButtonGlyph> = {
  X: { label: '✕', kind: 'face', color: '#7aa7ff', aria: 'Cross' },
  O: { label: '○', kind: 'face', color: '#ff6b81', aria: 'Circle' },
  T: { label: '△', kind: 'face', color: '#3ddc97', aria: 'Triangle' },
  S: { label: '□', kind: 'face', color: '#ff8de0', aria: 'Square' },
  L1: { label: 'L1', kind: 'shoulder', aria: 'L1' },
  L2: { label: 'L2', kind: 'shoulder', aria: 'L2' },
  R1: { label: 'R1', kind: 'shoulder', aria: 'R1' },
  R2: { label: 'R2', kind: 'shoulder', aria: 'R2' },
  ...DPAD,
};

const XBOX: Record<string, ButtonGlyph> = {
  X: { label: 'A', kind: 'face', color: '#5ad16a', aria: 'A' },
  O: { label: 'B', kind: 'face', color: '#ff5a5a', aria: 'B' },
  T: { label: 'Y', kind: 'face', color: '#ffd23f', aria: 'Y' },
  S: { label: 'X', kind: 'face', color: '#4aa8ff', aria: 'X' },
  L1: { label: 'LB', kind: 'shoulder', aria: 'Left bumper' },
  L2: { label: 'LT', kind: 'shoulder', aria: 'Left trigger' },
  R1: { label: 'RB', kind: 'shoulder', aria: 'Right bumper' },
  R2: { label: 'RT', kind: 'shoulder', aria: 'Right trigger' },
  ...DPAD,
};

const SWITCH: Record<string, ButtonGlyph> = {
  X: { label: 'B', kind: 'face', color: '#e8e8e8', aria: 'B' },
  O: { label: 'A', kind: 'face', color: '#e8e8e8', aria: 'A' },
  T: { label: 'X', kind: 'face', color: '#e8e8e8', aria: 'X' },
  S: { label: 'Y', kind: 'face', color: '#e8e8e8', aria: 'Y' },
  L1: { label: 'L', kind: 'shoulder', aria: 'L' },
  L2: { label: 'ZL', kind: 'shoulder', aria: 'ZL' },
  R1: { label: 'R', kind: 'shoulder', aria: 'R' },
  R2: { label: 'ZR', kind: 'shoulder', aria: 'ZR' },
  ...DPAD,
};

export const tokens = (seq: string): Token[] => seq.trim().split(/\s+/) as Token[];

export function glyphsFor(seq: string, platform: Platform): ButtonGlyph[] {
  const map = platform === 'xbox' ? XBOX : platform === 'switch' ? SWITCH : PS;
  return tokens(seq).map((t) => map[t] ?? { label: t, kind: 'face', aria: t });
}

/** Plain-text version of a sequence, e.g. "R1, R2, L1, Cross, Left..." */
export function sequenceText(seq: string, platform: Platform): string {
  return glyphsFor(seq, platform)
    .map((g) => (g.kind === 'face' && platform === 'ps' ? g.aria : g.kind === 'dpad' ? g.aria : g.label))
    .join(', ');
}

/** Keyboard keys used by the trainer for each token. */
export const KEYMAP: Record<Token, string[]> = {
  U: ['ArrowUp'],
  D: ['ArrowDown'],
  L: ['ArrowLeft'],
  R: ['ArrowRight'],
  X: ['k', 'K'],
  O: ['l', 'L'],
  S: ['j', 'J'],
  T: ['i', 'I'],
  L1: ['q', 'Q'],
  L2: ['1'],
  R1: ['e', 'E'],
  R2: ['3'],
};

/** Standard Gamepad API button index -> token. */
export const GAMEPAD_MAP: Record<number, Token> = {
  0: 'X',
  1: 'O',
  2: 'S',
  3: 'T',
  4: 'L1',
  5: 'R1',
  6: 'L2',
  7: 'R2',
  12: 'U',
  13: 'D',
  14: 'L',
  15: 'R',
};
