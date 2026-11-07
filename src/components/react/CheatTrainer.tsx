import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHEATS, GAMES } from '../../data/games';
import type { GameKey } from '../../data/types';
import { GAMEPAD_MAP, KEYMAP, glyphsFor, tokens, type Token } from '../../lib/buttons';
import ButtonSeq from './ButtonSeq';
import './trainer.css';

type Pad = 'ps' | 'xbox' | 'switch';
type Status = 'ready' | 'running' | 'done';

const TRAINER_GAMES: GameKey[] = ['gta5', 'sa', 'vc', 'gta3'];
const BEST_KEY = 'gtacc:bests';
const STATS_KEY = 'gtacc:trainer';

const KEY_TO_TOKEN: Record<string, Token> = Object.entries(KEYMAP).reduce(
  (acc, [tok, keys]) => {
    keys.forEach((k) => (acc[k] = tok as Token));
    return acc;
  },
  {} as Record<string, Token>
);

const KEY_HINT: Record<Token, string> = {
  U: '↑', D: '↓', L: '←', R: '→', X: 'K', O: 'L', S: 'J', T: 'I', L1: 'Q', L2: '1', R1: 'E', R2: '3',
};

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const fmt = (ms: number) => (ms / 1000).toFixed(2) + 's';

export default function CheatTrainer() {
  const [game, setGame] = useState<GameKey>('sa');
  const pool = useMemo(() => CHEATS[game].filter((c) => c.ps), [game]);
  const [cheatId, setCheatId] = useState<string>(pool[0].id);
  const cheat = pool.find((c) => c.id === cheatId) ?? pool[0];
  const seq = useMemo(() => tokens(cheat.ps!), [cheat]);

  const [pad, setPad] = useState<Pad>('ps');
  const [memory, setMemory] = useState(false);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<Status>('ready');
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState(0);
  const [flash, setFlash] = useState<Token | null>(null);
  const [bests, setBests] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({ done: 0, streak: 0, bestStreak: 0 });
  const [padName, setPadName] = useState<string | null>(null);
  const [newBest, setNewBest] = useState(false);

  // Restore saved progress + deep-link params.
  useEffect(() => {
    setBests(load(BEST_KEY, {}));
    setStats(load(STATS_KEY, { done: 0, streak: 0, bestStreak: 0 }));
    const p = new URLSearchParams(location.search);
    const g = p.get('game') as GameKey | null;
    const c = p.get('cheat');
    const pd = p.get('pad') as Pad | null;
    if (pd && ['ps', 'xbox', 'switch'].includes(pd)) setPad(pd);
    if (g && TRAINER_GAMES.includes(g)) {
      setGame(g);
      if (c && CHEATS[g].some((x) => x.id === c && x.ps)) setCheatId(c);
      else setCheatId(CHEATS[g].find((x) => x.ps)!.id);
    }
  }, []);

  // Live combo progress lives in a ref so rapid inputs (fast typing, a controller
  // pressing two buttons in one frame) are never lost between renders.
  const run = useRef({ idx: 0, status: 'ready' as Status, start: 0, mistakes: 0 });
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const bestsRef = useRef(bests);
  bestsRef.current = bests;
  const sync = () => {
    const r = run.current;
    setIdx(r.idx);
    setStatus(r.status);
    setStart(r.start);
    setMistakes(r.mistakes);
  };

  const reset = useCallback(() => {
    run.current = { idx: 0, status: 'ready', start: 0, mistakes: 0 };
    sync();
    setNewBest(false);
  }, []);

  useEffect(reset, [cheatId, game, reset]);

  // Timer tick.
  useEffect(() => {
    if (status !== 'running') return;
    let raf = 0;
    const tick = () => {
      setNow(performance.now());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status]);

  const press = useCallback(
    (t: Token) => {
      setFlash(t);
      setTimeout(() => setFlash((f) => (f === t ? null : f)), 120);
      const r = run.current;
      if (r.status === 'done') return;
      if (t !== seq[r.idx]) {
        // A wrong input resets the combo, just like in the game.
        r.mistakes += 1;
        r.idx = t === seq[0] ? 1 : 0;
        if (r.status === 'ready' && r.idx === 1) {
          r.start = performance.now();
          r.status = 'running';
        }
        setShake((s) => s + 1);
        sync();
        const s = { ...statsRef.current, streak: 0 };
        statsRef.current = s;
        setStats(s);
        save(STATS_KEY, s);
        return;
      }
      if (r.status === 'ready') {
        r.start = performance.now();
        r.status = 'running';
      }
      r.idx += 1;
      if (r.idx === seq.length) {
        const ms = performance.now() - r.start;
        r.status = 'done';
        setResult(ms);
        const key = `${game}:${cheat.id}`;
        const prev = bestsRef.current[key];
        if (!prev || ms < prev) {
          const b = { ...bestsRef.current, [key]: ms };
          bestsRef.current = b;
          setBests(b);
          save(BEST_KEY, b);
          setNewBest(!!prev);
        }
        const st = statsRef.current;
        const streak = r.mistakes === 0 ? st.streak + 1 : 0;
        const s = { done: st.done + 1, streak, bestStreak: Math.max(st.bestStreak, streak) };
        statsRef.current = s;
        setStats(s);
        save(STATS_KEY, s);
      }
      sync();
    },
    [seq, game, cheat]
  );

  const pressRef = useRef(press);
  pressRef.current = press;

  // Keyboard input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        if (status === 'done') {
          e.preventDefault();
          reset();
        }
        return;
      }
      const t = KEY_TO_TOKEN[e.key];
      if (!t) return;
      e.preventDefault();
      pressRef.current(t);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, reset]);

  // Real controller via the Gamepad API.
  useEffect(() => {
    if (!('getGamepads' in navigator)) return;
    let raf = 0;
    const prev: Record<number, boolean> = {};
    const loop = () => {
      const gp = [...navigator.getGamepads()].find(Boolean);
      if (gp) {
        setPadName((n) => n ?? gp.id);
        gp.buttons.forEach((b, i) => {
          const down = b.pressed || b.value > 0.5;
          if (down && !prev[i] && GAMEPAD_MAP[i]) pressRef.current(GAMEPAD_MAP[i]);
          prev[i] = down;
        });
      }
      raf = requestAnimationFrame(loop);
    };
    const onConnect = (e: GamepadEvent) => setPadName(e.gamepad.id);
    const onDisconnect = () => setPadName(null);
    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, []);

  const randomCheat = () => {
    const g = TRAINER_GAMES[Math.floor(Math.random() * TRAINER_GAMES.length)];
    const list = CHEATS[g].filter((c) => c.ps && c.id !== cheat.id);
    setGame(g);
    setCheatId(list[Math.floor(Math.random() * list.length)].id);
  };

  const elapsed = status === 'running' ? now - start : status === 'done' ? result : 0;
  const best = bests[`${game}:${cheat.id}`];
  const g = (t: Token) => glyphsFor(t, pad)[0];
  const padBtn = (t: Token, cls: string) => {
    const gl = g(t);
    return (
      <button
        type="button"
        className={`tp-btn ${cls}${flash === t ? ' is-hit' : ''}`}
        style={gl.color ? { color: gl.color } : undefined}
        onPointerDown={(e) => {
          e.preventDefault();
          press(t);
        }}
        aria-label={gl.aria}
      >
        <span>{gl.label}</span>
        <kbd>{KEY_HINT[t]}</kbd>
      </button>
    );
  };

  return (
    <section className="tr" style={{ ['--gx' as string]: GAMES[game].accent }} aria-label="Cheat combo trainer">
      <div className="tr-top">
        <label className="tr-field">
          <span>Game</span>
          <select
            value={game}
            onChange={(e) => {
              const ng = e.target.value as GameKey;
              setGame(ng);
              setCheatId(CHEATS[ng].find((c) => c.ps)!.id);
              e.target.blur();
            }}
          >
            {TRAINER_GAMES.map((k) => (
              <option key={k} value={k}>
                {GAMES[k].short}
              </option>
            ))}
          </select>
        </label>
        <label className="tr-field tr-grow">
          <span>Cheat</span>
          <select
            value={cheat.id}
            onChange={(e) => {
              setCheatId(e.target.value);
              // Hand the arrow keys back to the trainer.
              e.target.blur();
            }}
          >
            {pool.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({tokens(c.ps!).length} inputs)
              </option>
            ))}
          </select>
        </label>
        <div className="tr-field">
          <span>Controller</span>
          <div className="tr-seg">
            {(['ps', 'xbox', 'switch'] as Pad[]).map((p) => (
              <button key={p} type="button" className={p === pad ? 'is-active' : ''} onClick={() => setPad(p)}>
                {p === 'ps' ? 'PS' : p === 'xbox' ? 'Xbox' : 'Switch'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="tr-sub">
        <button type="button" className="chip" aria-pressed={memory} onClick={() => setMemory((m) => !m)}>
          🧠 Memory mode {memory ? 'on' : 'off'}
        </button>
        <button type="button" className="chip" onClick={randomCheat}>
          🎲 Random cheat
        </button>
        <span className={`tr-pad${padName ? ' is-on' : ''}`}>
          {padName ? `🎮 Controller connected` : '🎮 Plug in a controller and press any button'}
        </span>
      </div>

      <div className={`tr-stage${status === 'done' ? ' is-done' : ''}`}>
        <div className="tr-head">
          <div>
            <p className="tr-label">Enter the code for</p>
            <p className="tr-cheat">{cheat.name}</p>
          </div>
          <div className="tr-clock" aria-live="off">
            <span>{fmt(elapsed)}</span>
            <small>Best {best ? fmt(best) : '—'}</small>
          </div>
        </div>

        <div className="tr-seq" key={shake} data-shake={shake > 0 ? 'y' : undefined}>
          <ButtonSeq seq={cheat.ps!} platform={pad} cursor={idx} hidden={memory && status !== 'ready'} />
        </div>
        <div className="tr-progress" aria-hidden="true">
          <span style={{ width: `${(idx / seq.length) * 100}%` }} />
        </div>

        <div className="tr-status" aria-live="polite">
          {status === 'ready' && <p>Press the first button to start the clock. {memory && 'The combo hides once you start.'}</p>}
          {status === 'running' && (
            <p>
              {idx}/{seq.length} inputs · {mistakes} {mistakes === 1 ? 'reset' : 'resets'}
            </p>
          )}
          {status === 'done' && (
            <div className="tr-win">
              <p className="tr-win-title">Cheat activated</p>
              <p>
                {fmt(result)} with {mistakes} {mistakes === 1 ? 'reset' : 'resets'}
                {newBest && ' · New personal best!'}
              </p>
              <div className="tr-win-actions">
                <button type="button" className="btn btn-primary" onClick={reset}>
                  Go again (Space)
                </button>
                <button type="button" className="btn" onClick={randomCheat}>
                  Next random cheat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tp" aria-label="On-screen controller">
        <div className="tp-shoulders">
          <div>
            {padBtn('L2', 'tp-sh')}
            {padBtn('L1', 'tp-sh')}
          </div>
          <div>
            {padBtn('R1', 'tp-sh')}
            {padBtn('R2', 'tp-sh')}
          </div>
        </div>
        <div className="tp-body">
          <div className="tp-dpad">
            {padBtn('U', 'tp-d tp-u')}
            {padBtn('L', 'tp-d tp-l')}
            {padBtn('R', 'tp-d tp-r')}
            {padBtn('D', 'tp-d tp-dn')}
          </div>
          <div className="tp-face">
            {padBtn('T', 'tp-f tp-u')}
            {padBtn('S', 'tp-f tp-l')}
            {padBtn('O', 'tp-f tp-r')}
            {padBtn('X', 'tp-f tp-dn')}
          </div>
        </div>
      </div>

      <dl className="tr-stats">
        <div>
          <dt>Combos cleared</dt>
          <dd>{stats.done}</dd>
        </div>
        <div>
          <dt>Clean streak</dt>
          <dd>{stats.streak}</dd>
        </div>
        <div>
          <dt>Best streak</dt>
          <dd>{stats.bestStreak}</dd>
        </div>
        <div>
          <dt>Personal bests</dt>
          <dd>{Object.keys(bests).length}</dd>
        </div>
      </dl>
    </section>
  );
}
