/**
 * views.js — All view renderers: Landing, Join, Lobby, Host, Participant, Display, Arena
 * Per-block arena archetypes with differentiated visual identities
 */
import { agendaData, getBlockActivities, getRecommendedActivity, activities, arenaArchetypes, heroVisuals, marketData } from './data.js';
import { store, bus, roomActions, timerActions, selectors } from './state.js';
import { engine, icons, formatKc, formatTimer } from './engine.js';

/* ==========================================================================
   ICON HELPER — line icons for blocks
   ========================================================================== */
const blockIcons = {
  'shield-alert': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  'map': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  'scale': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>',
  'arrow-right-circle': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
  'laptop': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="12" rx="2" ry="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>',
  'file-text': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  'message-circle': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>',
  'target': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
};

/* ==========================================================================
   LANDING VIEW — entry point
   ========================================================================== */
export function renderLanding() {
  return `
    <div class="view-landing">
      <div class="landing-card">
        <div class="landing-brand">Česká spořitelna · Insurance</div>
        <h1 class="landing-title">Adaptační den</h1>
        <p class="landing-subtitle">Neživotní pojištění</p>
        <p class="landing-desc">Kolaborativní tréninková platforma pro prezenční školení</p>
        <div class="landing-actions">
          <button class="btn btn-accent btn-lg" onclick="window._createRoom()">Vytvořit session (Lektor)</button>
          <button class="btn btn-outline btn-lg" onclick="window._navigateTo('join')">Připojit se</button>
          <button class="btn btn-ghost btn-lg" onclick="window._navigateTo('display')">Promítací režim</button>
        </div>
        <div class="landing-meta">
          <span>8 bloků</span><span>·</span><span>09:00 – 16:00</span><span>·</span><span>12 účastníků</span>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   JOIN VIEW — room code + name entry
   ========================================================================== */
export function renderJoin() {
  return `
    <div class="view-join">
      <div class="join-card">
        <button class="join-back" onclick="window._navigateTo('landing')">${icons.arrowLeft} Zpět</button>
        <h2 class="join-title">Připojit se</h2>
        <div class="join-form">
          <label class="join-label" for="room-code-input">Kód místnosti</label>
          <input type="text" id="room-code-input" class="join-input join-code-input" placeholder="XXXXXX" maxlength="6" autocomplete="off" spellcheck="false" />
          <label class="join-label" for="participant-name-input">Vaše jméno</label>
          <input type="text" id="participant-name-input" class="join-input" placeholder="Jan Novák" maxlength="30" />
          <label class="join-label" for="team-select">Tým (volitelné)</label>
          <div class="join-team-select" id="team-select">
            ${store.state.teams.map(t => `
              <button class="join-team-btn" data-team="${t.id}" style="--team-color:${t.color}" onclick="window._selectTeam(this, '${t.id}')">${t.name}</button>
            `).join('')}
          </div>
          <button class="btn btn-accent btn-lg join-submit" onclick="window._joinRoom()">Vstoupit do session ${icons.arrowRight}</button>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   LOBBY VIEW — waiting room before session starts
   ========================================================================== */
export function renderLobby() {
  const s = store.state;
  const participants = s.participants;
  const isHost = s.isHostMode;
  return `
    <div class="view-lobby">
      <div class="lobby-card">
        <div class="lobby-code-display">
          <div class="lobby-code-label">Kód místnosti</div>
          <div class="lobby-code-value">${s.room.code || '------'}</div>
        </div>
        <h2 class="lobby-title">Čekáme na účastníky</h2>
        <div class="lobby-participants">
          <div class="lobby-count">${icons.users} ${participants.length} připojeno</div>
          <div class="lobby-participant-list">
            ${participants.map(p => {
              const team = s.teams.find(t => t.id === p.teamId);
              return `
                <div class="lobby-participant">
                  <span class="lobby-participant-avatar" style="background:${team?.color || '#A4D233'}">${p.name.charAt(0).toUpperCase()}</span>
                  <span class="lobby-participant-name">${p.name}</span>
                  ${team ? `<span class="lobby-participant-team" style="color:${team.color}">${team.name}</span>` : ''}
                </div>
              `;
            }).join('') || '<p class="lobby-empty">Zatím se nikdo nepřipojil...</p>'}
          </div>
        </div>
        ${isHost ? `
          <button class="btn btn-accent btn-lg lobby-start" onclick="window._startSession()" ${participants.length < 1 ? 'disabled' : ''}>
            Zahájit den ${icons.play}
          </button>
        ` : `
          <div class="lobby-waiting">
            <div class="lobby-spinner"></div>
            <p>Čekejte na zahájení lektorem...</p>
          </div>
        `}
      </div>
    </div>
  `;
}

/* ==========================================================================
   HOST VIEW — block overview + session controls
   ========================================================================== */
export function renderHost() {
  const s = store.state;
  const currentBlockId = s.session.currentBlockId || 1;
  return renderSessionChrome('host') + renderBlockScreen(currentBlockId, true);
}

/* ==========================================================================
   PARTICIPANT VIEW — clean, focused block screen
   ========================================================================== */
export function renderParticipant() {
  const currentBlockId = store.state.session.currentBlockId || 1;
  return renderSessionChrome('participant') + renderBlockScreen(currentBlockId, false);
}

/* ==========================================================================
   DISPLAY VIEW — projector / big screen — premium, high-impact
   ========================================================================== */
export function renderDisplay() {
  const s = store.state;
  if (s.session.status !== 'active') {
    return renderDisplayIdle();
  }
  const currentBlockId = s.session.currentBlockId || 1;
  return renderDisplayBlock(currentBlockId);
}

function renderDisplayIdle() {
  const capData = marketData.cap2024;
  return `
    <div class="view-display">
      <div class="display-idle">
        <div class="display-brand">Česká spořitelna · Insurance</div>
        <h1 class="display-title">Adaptační den</h1>
        <p class="display-subtitle">Neživotní pojištění</p>
        ${store.state.room.code ? `
          <div class="display-room-code">
            <div class="display-code-label">Připojte se</div>
            <div class="display-code-value">${store.state.room.code}</div>
          </div>
          <div class="display-participant-count">${icons.users} ${store.state.participants.length} účastníků</div>
        ` : `
          <div class="display-market-stats">
            <div class="display-stat">
              <div class="display-stat-number">${capData.displayTexts.headline}</div>
              <div class="display-stat-label">${capData.displayTexts.subline}</div>
            </div>
            <div class="display-stat">
              <div class="display-stat-number">${capData.totalClaimEvents.toLocaleString('cs-CZ')}</div>
              <div class="display-stat-label">pojistných událostí v majetku</div>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}

function renderDisplayBlock(blockId) {
  const block = agendaData.find(b => b.id === blockId);
  if (!block) return '';
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';

  return `
    <div class="view-display" data-arena="${archetype.type || ''}">
      <div class="display-block-screen" style="${bgStyle}">
        <div class="display-hero-overlay"></div>
        <div class="display-block-content">
          <div class="display-block-badge">Blok ${block.id} / 8</div>
          <h1 class="display-block-title">${block.name}</h1>
          ${block.tagline ? `<p class="display-block-tagline">${block.tagline}</p>` : ''}
          <p class="display-block-goal">${block.goal}</p>
          <div class="display-block-time">${block.time} · ${block.durationMin} min</div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   SESSION CHROME — header + block navigation
   ========================================================================== */
function renderSessionChrome(mode) {
  const s = store.state;
  const currentBlockId = s.session.currentBlockId || 1;
  const isHost = mode === 'host';
  return `
    <header class="session-header">
      <div class="session-header-inner">
        <span class="session-brand">NŽP</span>
        <div class="session-block-dots">
          ${agendaData.map(b => `
            <button class="session-dot ${b.id === currentBlockId ? 'is-current' : ''} ${s.doneBlocks.has(b.id) ? 'is-done' : ''}"
              onclick="window._goToBlock(${b.id})" aria-label="Blok ${b.id}">${b.id}</button>
          `).join('')}
        </div>
        <div class="session-header-actions">
          ${isHost ? `<span class="session-participant-count">${icons.users} ${s.participants.length}</span>` : ''}
          ${isHost ? `<button class="btn btn-sm btn-ghost" onclick="window._navigateTo('landing')">${icons.x}</button>` : ''}
        </div>
      </div>
      <div class="session-progress-bar"><div class="session-progress-fill" style="width:${Math.round((currentBlockId / 8) * 100)}%"></div></div>
    </header>
    <nav class="session-block-nav">
      <button class="session-nav-btn" onclick="window._prevBlock()" ${currentBlockId <= 1 ? 'disabled' : ''}>${icons.arrowLeft}</button>
      <span class="session-nav-label">Blok ${currentBlockId} / 8</span>
      <button class="session-nav-btn" onclick="window._nextBlock()" ${currentBlockId >= 8 ? 'disabled' : ''}>${icons.arrowRight}</button>
    </nav>
  `;
}

/* ==========================================================================
   BLOCK SCREEN — the core block view (host + participant)
   Per-block hero visual + arena archetype styling
   ========================================================================== */
function renderBlockScreen(blockId, isHost) {
  const block = agendaData.find(b => b.id === blockId);
  if (!block) return '<div class="block-empty">Blok nenalezen.</div>';
  const acts = getBlockActivities(blockId);
  const recommended = acts.find(a => a.recommended) || acts[0];
  const isDone = store.state.doneBlocks.has(blockId);
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';

  return `
    <main class="block-screen-main">
      <section class="block-screen" data-block="${blockId}" data-arena="${archetype.type || ''}">
        <!-- Hero visual background -->
        <div class="block-hero-bg" style="${bgStyle}">
          <div class="block-hero-overlay"></div>
        </div>
        <div class="block-hero-content">
          <div class="block-chapter-badge">Blok ${blockId}</div>
          <div class="block-time-badge">${block.time}</div>
          <h1 class="block-title">${block.name}</h1>
          ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
          <p class="block-goal">${block.goal}</p>
          <div class="block-meta-row">
            <span class="block-meta-pill">${icons.clock} ${block.durationMin} min</span>
            <span class="block-meta-pill">${block.activeRatio} aktivně</span>
          </div>
        </div>

        <!-- Recommended activity card -->
        ${recommended ? `
          <div class="activity-card activity-card--recommended" style="--arena-accent:${archetype.accent || 'var(--color-accent)'}" onclick="window._startActivity('${recommended.id}')">
            <div class="activity-card-label">Doporučená aktivita</div>
            <div class="activity-card-name">${recommended.name}</div>
            <div class="activity-card-brief">${recommended.brief}</div>
            <button class="btn btn-accent btn-lg activity-start-btn">Začni trénovat ${icons.arrowRight}</button>
          </div>
        ` : ''}

        <!-- All activities list (host only) -->
        ${isHost ? `
          <div class="block-activities-list">
            <div class="activities-list-label">Všechny aktivity</div>
            ${acts.map(a => `
              <button class="activity-list-item ${a.recommended ? 'is-recommended' : ''}" onclick="window._startActivity('${a.id}')">
                <span class="activity-list-name">${a.name}</span>
                <span class="activity-list-template">${a.template}</span>
                ${icons.arrowRight}
              </button>
            `).join('')}
          </div>
        ` : ''}

        ${isHost ? `
          <label class="block-done-toggle">
            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window._toggleBlockDone(${blockId})" />
            <span>Blok splněn</span>
          </label>
        ` : ''}
      </section>
    </main>
  `;
}

/* ==========================================================================
   ARENA VIEW — fullscreen activity execution with per-block archetype
   ========================================================================== */
export function renderArena() {
  const activityId = store.state.session.currentActivityId;
  const phase = store.state.activity.phase;
  if (!activityId) return '<div class="arena-empty">Žádná aktivita.</div>';

  const activity = engine.getActivity(activityId);
  if (!activity) return '<div class="arena-empty">Aktivita nenalezena.</div>';

  const template = engine.getTemplate(activityId);
  if (!template) return '<div class="arena-empty">Šablona nedostupná.</div>';

  const blockId = activity.blockId;
  const archetype = arenaArchetypes[blockId] || {};
  const hero = heroVisuals[blockId] || {};
  const viewMode = store.state.isHostMode ? 'host' : 'participant';

  return `
    <div class="view-arena" data-arena="${archetype.type || ''}" data-block="${blockId}" style="--arena-accent:${archetype.accent || 'var(--color-accent)'}">
      <div class="arena-bg" style="${hero.cssGradient ? `background: ${hero.cssGradient};` : ''}">
        <div class="arena-bg-overlay"></div>
      </div>
      <div class="arena-content">
        ${template.render(activity, phase, viewMode)}
      </div>
    </div>
  `;
}

/* ==========================================================================
   MAP VIEW — chapter overview with per-block visual identity
   ========================================================================== */
export function renderMap() {
  return `
    <div class="view-map">
      <div class="map-header">
        <button class="btn btn-ghost" onclick="window._navigateTo(store.state.isHostMode ? 'host' : 'participant')">${icons.arrowLeft} Zpět</button>
        <h2>Mapa dne</h2>
      </div>
      <div class="map-grid">
        ${agendaData.map(b => {
          const isDone = store.state.doneBlocks.has(b.id);
          const hero = heroVisuals[b.id] || {};
          const archetype = arenaArchetypes[b.id] || {};
          return `
            <div class="map-tile ${isDone ? 'is-done' : ''}" data-arena="${archetype.type || ''}" onclick="window._goToBlock(${b.id})" style="${hero.cssGradient ? `--tile-bg: ${hero.cssGradient};` : ''}">
              <div class="map-tile-bg" style="${hero.cssGradient ? `background: ${hero.cssGradient};` : ''}"></div>
              <div class="map-tile-content">
                <div class="map-tile-num">${b.id}</div>
                <div class="map-tile-time">${b.time}</div>
                <div class="map-tile-name">${b.name}</div>
                ${b.tagline ? `<div class="map-tile-tagline">${b.tagline}</div>` : ''}
                <div class="map-tile-meta">${b.durationMin} min · ${b.activeRatio}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
