import { useEffect, useRef, useState } from 'react';
import { CHEATS, GAMES, GAME_ORDER } from '../../data/games';
import { PLATFORM_LABELS, type Category, type Cheat, type GameKey, type Platform } from '../../data/types';
import ButtonSeq from './ButtonSeq';
import './roulette.css';

type Pick = { game: GameKey; cheat: Cheat };

const CHALLENGES: Record<Category, string[]> = {
  health: ['Pick a fight with the toughest crowd you can find and stay alive for three minutes.', 'Take on a five-star chase and use this only when your health bar turns red.'],
  weapons: ['Clear a gang hangout using only the first weapon you scroll to.', 'Hold off the cops from a rooftop for two minutes.'],
  wanted: ['Get the maximum wanted level, then lose it without using another cheat.', 'Survive at full wanted level until the clock hits a full in-game hour.'],
  vehicles: ['Spawn it and drive it to the highest point on the map without leaving the seat.', 'Use it to cross the whole map in under five real minutes.'],
  player: ['Do a full lap of the city on foot using this boost only.', 'Chain three stunts in a row without touching a vehicle.'],
  world: ['Find the best photo spot on the map in this weather or time.', 'Finish a street race under these conditions.'],
  traffic: ['Drive across the map obeying every traffic light. Good luck.', 'Find the weirdest car you can and keep it in one piece for five minutes.'],
  peds: ['Survive at the busiest intersection on the map for two minutes.', 'Walk from one end of downtown to the other without fighting back.'],
  fun: ['Record the funniest 30 seconds you can and send it to a friend.', 'Combine it with one more random cheat. Spin again.'],
};

function availablePlatforms(g: GameKey): Platform[] {
  return GAMES[g].platforms;
}

function codeFor(c: Cheat, p: Platform) {
  return p === 'pc' ? c.pc : p === 'phone' ? c.phone : c.ps;
}

export default function CheatRoulette() {
  const [scope, setScope] = useState<GameKey | 'all'>('all');
  const [platform, setPlatform] = useState<Platform>('ps');
  const [reel, setReel] = useState<Pick | null>(null);
  const [final, setFinal] = useState<Pick | null>(null);
  const [challenge, setChallenge] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [spins, setSpins] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      setSpins(Number(localStorage.getItem('gtacc:spins') || '0'));
    } catch {}
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const pool = (): Pick[] => {
    const games = scope === 'all' ? GAME_ORDER : [scope];
    return games.flatMap((g) => CHEATS[g].map((cheat) => ({ game: g, cheat })));
  };

  const spin = () => {
    if (spinning) return;
    const p = pool();
    const pick = p[Math.floor(Math.random() * p.length)];
    setSpinning(true);
    setFinal(null);
    timers.current.forEach(clearTimeout);
    timers.current = [];
    // Decelerating reel: ~24 frames over ~2.4s.
    let t = 0;
    for (let i = 0; i < 24; i++) {
      t += 40 + i * i * 0.45;
      timers.current.push(window.setTimeout(() => setReel(p[Math.floor(Math.random() * p.length)]), t));
    }
    timers.current.push(
      window.setTimeout(() => {
        setReel(pick);
        setFinal(pick);
        const list = CHALLENGES[pick.cheat.category];
        setChallenge(list[Math.floor(Math.random() * list.length)]);
        setSpinning(false);
        const plats = availablePlatforms(pick.game);
        // Keep the chosen platform if this game supports it and the cheat has a code for it.
        const good = (pl: Platform) => plats.includes(pl) && !!codeFor(pick.cheat, pl);
        if (!good(platform)) {
          const alt = plats.find(good);
          if (alt) setPlatform(alt);
        }
        setSpins((s) => {
          const n = s + 1;
          try {
            localStorage.setItem('gtacc:spins', String(n));
          } catch {}
          return n;
        });
      }, t + 120)
    );
  };

  const shown = reel ?? null;
  const fg = final ? GAMES[final.game] : null;
  const code = final ? codeFor(final.cheat, platform) : undefined;
  const isConsole = platform === 'ps' || platform === 'xbox' || platform === 'switch';

  return (
    <section className="rl" aria-label="Cheat roulette">
      <div className="rl-scope" role="tablist" aria-label="Game">
        <button className="chip" aria-pressed={scope === 'all'} onClick={() => setScope('all')}>
          All games
        </button>
        {GAME_ORDER.map((g) => (
          <button key={g} className="chip" aria-pressed={scope === g} onClick={() => setScope(g)}>
            {GAMES[g].short}
          </button>
        ))}
      </div>

      <div className={`rl-machine${spinning ? ' is-spinning' : ''}${final ? ' is-landed' : ''}`}>
        <div className="rl-lights" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
        <div className="rl-window" aria-live="polite">
          {shown ? (
            <>
              <span className="rl-game" style={{ color: GAMES[shown.game].accent }}>
                {GAMES[shown.game].short}
              </span>
              <span className="rl-name">{shown.cheat.name}</span>
            </>
          ) : (
            <span className="rl-name rl-idle">Feeling lucky?</span>
          )}
        </div>
        <button type="button" className="rl-spin" onClick={spin} disabled={spinning}>
          {spinning ? 'Spinning…' : final ? 'Spin again' : 'Spin the wheel'}
        </button>
        <p className="rl-count">{spins} spins on this device</p>
      </div>

      {final && fg && (
        <div className="rl-result" style={{ ['--gx' as string]: fg.accent }}>
          <div className="rl-res-head">
            <div>
              <p className="rl-res-k">{fg.name}</p>
              <h3>{final.cheat.name}</h3>
              <p className="rl-res-e">{final.cheat.effect}</p>
            </div>
            <a className="btn" href={`${fg.hub}#${final.game}-${final.cheat.id}`}>
              All {fg.short} cheats →
            </a>
          </div>
          <div className="rl-plats">
            {fg.platforms.map((p) => (
              <button
                key={p}
                className={`chip${p === platform ? ' is-active' : ''}`}
                onClick={() => setPlatform(p)}
                disabled={!codeFor(final.cheat, p)}
              >
                {PLATFORM_LABELS[p]}
              </button>
            ))}
          </div>
          <div className="rl-code">
            {!code && <span className="cx-na">No code on {PLATFORM_LABELS[platform]} for this one. Pick another platform.</span>}
            {code && isConsole && <ButtonSeq seq={code} platform={platform} />}
            {code && platform === 'pc' && <code className="code-pc">{code}</code>}
            {code && platform === 'phone' && <code className="code-phone">{code}</code>}
          </div>
          <div className="rl-challenge">
            <span>Your challenge</span>
            <p>{challenge}</p>
          </div>
          {final.cheat.risky && (
            <p className="rl-warn">⚠ This cheat can break missions. Don't save your game while it is active.</p>
          )}
        </div>
      )}
    </section>
  );
}
