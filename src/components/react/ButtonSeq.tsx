import type { Platform } from '../../data/types';
import { glyphsFor } from '../../lib/buttons';

interface Props {
  seq: string;
  platform: Platform;
  small?: boolean;
  /** Index of the next expected input (trainer). */
  cursor?: number;
  hidden?: boolean;
}

export default function ButtonSeq({ seq, platform, small, cursor, hidden }: Props) {
  const glyphs = glyphsFor(seq, platform);
  const label = glyphs.map((g) => g.aria).join(', ');
  return (
    <span className={`seq${small ? ' seq-sm' : ''}`} role="img" aria-label={label}>
      {glyphs.map((g, i) => {
        const state = cursor === undefined ? '' : i < cursor ? ' is-done' : i === cursor ? ' is-next' : '';
        return (
          <span
            key={i}
            className={`bt bt-${g.kind}${state}`}
            style={g.color && !hidden ? { color: g.color } : undefined}
            aria-hidden="true"
          >
            {hidden && (cursor === undefined || i >= cursor) ? '?' : g.label}
          </span>
        );
      })}
    </span>
  );
}
