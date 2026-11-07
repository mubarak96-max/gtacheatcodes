import { useEffect, useMemo, useState } from 'react';
import { CHEATS, GAMES } from '../../data/games';
import { CATEGORY_LABELS, PLATFORM_LABELS, type Category, type Cheat, type GameKey, type Platform } from '../../data/types';
import { sequenceText } from '../../lib/buttons';
import ButtonSeq from './ButtonSeq';
import './explorer.css';

interface Props {
  games: GameKey[];
  category?: Category;
  defaultPlatform?: Platform;
  /** Show the search box (on by default). */
  searchable?: boolean;
  heading?: string;
}

const FAV_KEY = 'gtacc:favs';

function readFavs(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function codeFor(c: Cheat, p: Platform): string | undefined {
  if (p === 'pc') return c.pc;
  if (p === 'phone') return c.phone;
  return c.ps;
}

export default function CheatExplorer({ games, category, defaultPlatform, searchable = true, heading }: Props) {
  const [game, setGame] = useState<GameKey>(games[0]);
  const meta = GAMES[game];
  const initialPlatform =
    defaultPlatform && meta.platforms.includes(defaultPlatform) ? defaultPlatform : meta.platforms[0];
  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Category | 'all'>(category ?? 'all');
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setFavs(readFavs());
    if (!searchable) return;
    // Support /tools/cheat-finder/?q=jetpack&game=sa deep links (WebSite SearchAction).
    const p = new URLSearchParams(location.search);
    const q0 = p.get('q');
    const g0 = p.get('game') as GameKey | null;
    if (g0 && games.includes(g0)) setGame(g0);
    if (q0) {
      setQuery(q0);
      if (!g0 && games.length > 1) {
        const hit = games.find((g) =>
          CHEATS[g].some((c) => [c.name, c.effect, c.pc, c.pcAlt, c.phone].some((s) => s?.toLowerCase().includes(q0.toLowerCase())))
        );
        if (hit) setGame(hit);
      }
    }
  }, []);

  // Keep the platform valid when switching games.
  useEffect(() => {
    if (!GAMES[game].platforms.includes(platform)) {
      const p = defaultPlatform && GAMES[game].platforms.includes(defaultPlatform) ? defaultPlatform : GAMES[game].platforms[0];
      setPlatform(p);
    }
  }, [game]);

  const all = CHEATS[game];
  const counts = useMemo(() => {
    const m = new Map<Category, number>();
    all.forEach((c) => m.set(c.category, (m.get(c.category) ?? 0) + 1));
    return m;
  }, [all]);

  const q = query.trim().toLowerCase();
  const list = all.filter((c) => {
    if (cat !== 'all' && c.category !== cat) return false;
    if (favOnly && !favs.has(`${game}:${c.id}`)) return false;
    if (!q) return true;
    return [c.name, c.effect, c.pc, c.pcAlt, c.phone, c.id, c.note]
      .filter(Boolean)
      .some((s) => s!.toLowerCase().replace(/-/g, '').includes(q.replace(/-/g, '')));
  });

  const toggleFav = (id: string) => {
    const key = `${game}:${id}`;
    const next = new Set(favs);
    next.has(key) ? next.delete(key) : next.add(key);
    setFavs(next);
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
    } catch {}
  };

  const copy = async (c: Cheat) => {
    const code = codeFor(c, platform);
    if (!code) return;
    const text = platform === 'pc' || platform === 'phone' ? code : sequenceText(code, platform);
    try {
      await navigator.clipboard.writeText(`${c.name} (${meta.short}, ${PLATFORM_LABELS[platform]}): ${text}`);
    } catch {
      /* clipboard blocked; ignore */
    }
    setCopied(c.id);
    setTimeout(() => setCopied((v) => (v === c.id ? null : v)), 1400);
  };

  const favCount = all.filter((c) => favs.has(`${game}:${c.id}`)).length;
  const showCats = !category;

  return (
    <section className="cx" style={{ ['--gx' as string]: meta.accent }} aria-label={heading ?? `${meta.short} cheat list`}>
      {heading && <h2 className="cx-title">{heading}</h2>}

      {games.length > 1 && (
        <div className="cx-games" role="tablist" aria-label="Game">
          {games.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={g === game}
              className={`cx-game${g === game ? ' is-active' : ''}`}
              style={{ ['--gx' as string]: GAMES[g].accent }}
              onClick={() => {
                setGame(g);
                setCat(category ?? 'all');
              }}
            >
              <span className="cx-game-name">{GAMES[g].short}</span>
              <span className="cx-game-count">{CHEATS[g].length} cheats</span>
            </button>
          ))}
        </div>
      )}

      <div className="cx-controls">
        <div className="cx-platforms" role="tablist" aria-label="Platform">
          {meta.platforms.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={p === platform}
              className={`cx-plat${p === platform ? ' is-active' : ''}`}
              onClick={() => setPlatform(p)}
            >
              {PLATFORM_LABELS[p]}
            </button>
          ))}
        </div>
        {searchable && (
          <label className="cx-search">
            <span className="sr-only">Search cheats</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search: jetpack, tank, HESOYAM, 1-999…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        )}
      </div>

      <div className="cx-cats">
        {showCats && (
          <>
            <button className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              All <span className="cx-n">{all.length}</span>
            </button>
            {(Object.keys(CATEGORY_LABELS) as Category[])
              .filter((k) => counts.has(k))
              .map((k) => (
                <button key={k} className="chip" aria-pressed={cat === k} onClick={() => setCat(k)}>
                  {CATEGORY_LABELS[k]} <span className="cx-n">{counts.get(k)}</span>
                </button>
              ))}
          </>
        )}
        <button className="chip cx-favchip" aria-pressed={favOnly} onClick={() => setFavOnly((v) => !v)}>
          ★ Saved <span className="cx-n">{favCount}</span>
        </button>
      </div>

      <p className="cx-meta" aria-live="polite">
        Showing {list.length} of {all.length} {meta.short} cheats · {PLATFORM_LABELS[platform]}
        {platform === 'pc' && game === 'gta5' && ' · open the console with ~ and type the code'}
        {platform === 'pc' && game !== 'gta5' && ' · type the code during gameplay, no Enter needed'}
        {platform === 'phone' && ' · dial on the in-game phone'}
      </p>

      <ul className="cx-list">
        {list.map((c) => {
          const code = codeFor(c, platform);
          const fav = favs.has(`${game}:${c.id}`);
          const isConsole = platform === 'ps' || platform === 'xbox' || platform === 'switch';
          return (
            <li key={c.id} id={`${game}-${c.id}`} className="cx-row">
              <div className="cx-info">
                <h3 className="cx-name">
                  {c.name}
                  {c.popular && <span className="cx-badge cx-hot">Popular</span>}
                  {c.risky && (
                    <span className="cx-badge cx-risk" title="Can break missions or saves. Avoid saving with this active.">
                      Save risk
                    </span>
                  )}
                </h3>
                <p className="cx-effect">{c.effect}</p>
                {c.note && <p className="cx-note">{c.note}</p>}
              </div>
              <div className="cx-code">
                {!code && (
                  <span className="cx-na">
                    No {PLATFORM_LABELS[platform]} code.{' '}
                    {c.pc && platform !== 'pc' && (
                      <button className="cx-link" onClick={() => setPlatform('pc')}>
                        PC: {c.pc}
                      </button>
                    )}
                    {c.phone && platform !== 'phone' && meta.platforms.includes('phone') && (
                      <button className="cx-link" onClick={() => setPlatform('phone')}>
                        Phone: {c.phone}
                      </button>
                    )}
                  </span>
                )}
                {code && isConsole && <ButtonSeq seq={code} platform={platform} small />}
                {code && platform === 'pc' && (
                  <span className="cx-pc">
                    <code className="code-pc">{code}</code>
                    {c.pcAlt && (
                      <span className="cx-alt">
                        or <code className="code-pc">{c.pcAlt}</code>
                      </span>
                    )}
                  </span>
                )}
                {code && platform === 'phone' && <code className="code-phone">{code}</code>}
              </div>
              <div className="cx-actions">
                {code && (
                  <button className="cx-act" onClick={() => copy(c)} aria-label={`Copy ${c.name} code`}>
                    {copied === c.id ? '✓ Copied' : 'Copy'}
                  </button>
                )}
                {c.ps && isConsole && (
                  <a className="cx-act" href={`/tools/cheat-trainer/?game=${game}&cheat=${c.id}&pad=${platform}`}>
                    Practice
                  </a>
                )}
                <button
                  className={`cx-act cx-star${fav ? ' is-on' : ''}`}
                  onClick={() => toggleFav(c.id)}
                  aria-pressed={fav}
                  aria-label={fav ? `Remove ${c.name} from saved` : `Save ${c.name}`}
                >
                  {fav ? '★' : '☆'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {list.length === 0 && (
        <div className="cx-empty">
          <p>
            <strong>No cheats match.</strong> {favOnly ? 'You have not saved any cheats for this game yet.' : 'Try another word, like "car", "health" or "wanted".'}
          </p>
          <button
            className="btn"
            onClick={() => {
              setQuery('');
              setFavOnly(false);
              setCat(category ?? 'all');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
