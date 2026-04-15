/**
 * views.js — All view renderers: Landing, Join, Lobby, Host, Participant, Display, Arena
 * Per-block arena archetypes with differentiated visual identities
 */
import { agendaData, getBlockActivities, getRecommendedActivity, activities, arenaArchetypes, heroVisuals, marketData, insightData, blockIllustrations, competitorData, contentData } from './data.js';
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

/* Template icon mapping for activity picker */
const templateIcons = {
  estimate: icons.eye,
  auction: icons.trophy,
  matching: icons.refresh,
  vote: icons.users,
  quiz: icons.clock,
  scenario: icons.eye,
  sort: icons.refresh,
  classify: icons.arrowRight,
  roleplay: icons.users,
  review: icons.check,
  freeInput: icons.send,
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
  const illustration = blockIllustrations[blockId] || '';

  return `
    <div class="view-display" data-arena="${archetype.type || ''}" data-block="${blockId}" style="--arena-accent:${archetype.accent || 'var(--color-accent)'}">
      <div class="display-block-screen" style="${bgStyle}">
        <div class="display-hero-overlay"></div>
        <div class="display-block-content">
          ${illustration ? `<div class="display-block-illustration">${illustration}</div>` : ''}
          <div class="display-block-badge">Blok ${block.id} / 8</div>
          <h1 class="display-block-title">${block.name}</h1>
          ${block.tagline ? `<p class="display-block-tagline">${block.tagline}</p>` : ''}
          <p class="display-block-goal">${block.goal}</p>
          <div class="display-block-time">${block.time} · ${block.durationMin} min</div>
          <div class="display-block-participants">${icons.users} ${store.state.participants.length} účastníků</div>
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
   ACTIVITY PICKER — horizontal scrollable card picker
   ========================================================================== */
function renderActivityPicker(blockId, isHost) {
  const acts = getBlockActivities(blockId);
  if (!acts.length) return '';
  const archetype = arenaArchetypes[blockId] || {};

  const cards = acts.map(a => {
    const icon = templateIcons[a.template] || icons.arrowRight;
    return `
      <div class="activity-pick-card ${a.recommended ? 'is-recommended' : ''}" style="--arena-accent:${archetype.accent || 'var(--color-accent)'}" onclick="window._startActivity('${a.id}')">
        <div class="activity-pick-icon">${icon}</div>
        <div class="activity-pick-name">${a.name}</div>
        <div class="activity-pick-brief">${a.brief}</div>
        <div class="activity-pick-type">${a.template}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="activity-picker">
      ${isHost ? '<div class="activity-picker-label">Aktivity</div>' : ''}
      <div class="activity-picker-scroll">
        ${cards}
      </div>
    </div>
  `;
}

/* ==========================================================================
   INSIGHT PANEL — collapsible data/insight section (host only)
   ========================================================================== */
function renderInsightPanel(blockId) {
  const data = insightData[`block${blockId}`];
  if (!data) return '';

  const brief = data.dataBrief || {};
  const cards = data.insightCards || [];

  return `
    <div class="insight-panel" data-block="${blockId}">
      <button class="insight-panel-toggle" onclick="this.parentElement.classList.toggle('is-open')">
        ${icons.eye} Data &amp; Insight
      </button>
      <div class="insight-panel-body">
        ${brief.title ? `<div class="insight-brief-title">${brief.title}</div>` : ''}
        ${brief.stats ? `
          <div class="insight-brief-stats">
            ${brief.stats.map(s => `
              <div class="insight-stat-item">
                <div class="insight-stat-value">${s.value}</div>
                <div class="insight-stat-label">${s.label}</div>
                ${s.note ? `<div class="insight-stat-note">${s.note}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${cards.length ? `
          <div class="insight-cards-scroll">
            ${cards.map(c => `
              <div class="insight-card">
                <div class="insight-card-title">${c.title}</div>
                <div class="insight-card-text">${c.text}</div>
                ${c.highlight ? `<div class="insight-card-highlight">${c.highlight}</div>` : ''}
                ${c.source ? `<div class="insight-card-source">${c.source}</div>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${brief.source ? `<div class="insight-source">Zdroj: ${brief.source}</div>` : ''}
      </div>
    </div>
  `;
}

/* ==========================================================================
   BLOCK SCREEN — differentiated per-block layouts
   Routes to specific layout renderer based on arenaType
   ========================================================================== */
const blockRenderers = {
  'damage-reveal':    renderBlock1DamageReveal,
  'case-board':       renderBlock2CaseBoard,
  'decision-arena':   renderBlock3DecisionArena,
  'conversation-sim': renderBlock4ConversationSim,
  'modeling-sim':     renderBlock5ModelingSim,
  'timeline-branch':  renderBlock6TimelineBranch,
  'objection-battle': renderBlock7ObjectionBattle,
  'commitment-arena': renderBlock8CommitmentArena,
};

function renderBlockScreen(blockId, isHost) {
  const block = agendaData.find(b => b.id === blockId);
  if (!block) return '<div class="block-empty">Blok nenalezen.</div>';

  const archetype = arenaArchetypes[blockId] || {};
  const renderer = blockRenderers[archetype.type];
  if (renderer) {
    return renderer(block, blockId, isHost);
  }
  return renderBlockFallback(block, blockId, isHost);
}

/* ---------- Shared block wrapper ---------- */
function blockWrap(blockId, arenaType, accent, bgStyle, innerHtml) {
  return `
    <main class="block-screen-main">
      <section class="block-screen" data-block="${blockId}" data-arena="${arenaType}" style="--arena-accent:${accent}">
        <div class="block-hero-bg" style="${bgStyle}">
          <div class="block-hero-overlay"></div>
        </div>
        ${innerHtml}
      </section>
    </main>
  `;
}

function blockMeta(block, blockId) {
  return `
    <div class="block-meta-row">
      <span class="block-meta-pill">${icons.clock} ${block.durationMin} min</span>
      <span class="block-meta-pill">${block.activeRatio} aktivně</span>
    </div>
  `;
}

function blockDoneToggle(blockId) {
  const isDone = store.state.doneBlocks.has(blockId);
  return `
    <label class="block-done-toggle">
      <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window._toggleBlockDone(${blockId})" />
      <span>Blok splněn</span>
    </label>
  `;
}

/* ==========================================================================
   BLOCK 1: damage-reveal — Hero stat layout
   ========================================================================== */
function renderBlock1DamageReveal(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const capData = marketData.cap2024;
  const recommended = getRecommendedActivity(blockId) || getBlockActivities(blockId)[0];

  const inner = `
    <div class="block-hero-content block-hero--damage-reveal">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>

      <div class="damage-reveal-hero-stat">
        <div class="damage-reveal-stat-number">${capData.displayTexts.headline}</div>
        <div class="damage-reveal-stat-label">${capData.displayTexts.subline}</div>
      </div>

      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      ${recommended ? `
        <div class="activity-card activity-card--recommended" onclick="window._startActivity('${recommended.id}')">
          <div class="activity-card-label">Doporučená aktivita</div>
          <div class="activity-card-name">${recommended.name}</div>
          <div class="activity-card-brief">${recommended.brief}</div>
          <button class="btn btn-accent btn-lg activity-start-btn">Začni trénovat ${icons.arrowRight}</button>
        </div>
      ` : ''}
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 2: case-board — Three-column family card layout
   ========================================================================== */
function renderBlock2CaseBoard(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const families = contentData.familyCases || [];

  const familyCards = families.slice(0, 3).map(fam => `
    <div class="case-board-card">
      <div class="case-board-card-name">${fam.name}</div>
      <div class="case-board-card-type">${fam.type}</div>
      <div class="case-board-card-members">${icons.users} ${fam.members}</div>
      <div class="case-board-card-risks">
        ${fam.risks.map(r => `<span class="case-board-risk-tag">${r}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const inner = `
    <div class="block-hero-content block-hero--case-board">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="case-board-grid">
        ${familyCards}
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 3: decision-arena — Split-screen concept
   ========================================================================== */
function renderBlock3DecisionArena(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';

  const inner = `
    <div class="block-hero-content block-hero--decision-arena">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="decision-split-screen">
        <div class="decision-split-side decision-split--covered">
          <div class="decision-split-label">Kryto</div>
          <div class="decision-split-desc">Pojištění hradí</div>
        </div>
        <div class="decision-split-divider">
          <span class="decision-split-vs">?</span>
        </div>
        <div class="decision-split-side decision-split--excluded">
          <div class="decision-split-label">Výluka</div>
          <div class="decision-split-desc">Pojištění nehradí</div>
        </div>
      </div>

      <div class="decision-question-prompt">
        Rozhodněte – kdo nese odpovědnost?
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 4: conversation-sim — Chat bubble layout
   ========================================================================== */
function renderBlock4ConversationSim(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const prompts = contentData.transitionPrompts || [];

  const bubbles = prompts.slice(0, 3).map((p, i) => `
    <div class="chat-bubble ${i % 2 === 0 ? 'chat-bubble--client' : 'chat-bubble--banker'}">
      <div class="chat-bubble-role">${i % 2 === 0 ? 'Klient' : 'Bankéř'}</div>
      <div class="chat-bubble-text">${i % 2 === 0 ? p.context : p.task}</div>
    </div>
  `).join('');

  const inner = `
    <div class="block-hero-content block-hero--conversation-sim">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="conversation-preview">
        ${bubbles}
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 5: modeling-sim — Builder/dashboard layout
   ========================================================================== */
function renderBlock5ModelingSim(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const families = contentData.familyModelCases || [];

  const dashboardMetrics = families.slice(0, 3).map(fam => `
    <div class="modeling-stat-box">
      <div class="modeling-stat-title">${fam.name}</div>
      <div class="modeling-stat-type">${fam.type}</div>
      <div class="modeling-stat-budget">${fam.budget}</div>
      <div class="modeling-stat-needs">
        ${fam.needs.map(n => `<span class="modeling-need-tag">${n}</span>`).join('')}
      </div>
    </div>
  `).join('');

  const inner = `
    <div class="block-hero-content block-hero--modeling-sim">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="modeling-dashboard">
        <div class="modeling-dashboard-header">
          <span class="modeling-dashboard-label">Systém Hades — Přehled zadání</span>
        </div>
        <div class="modeling-dashboard-grid">
          ${dashboardMetrics}
        </div>
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 6: timeline-branch — Horizontal timeline
   ========================================================================== */
function renderBlock6TimelineBranch(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const events = contentData.timelineEvents || [];

  const timelineDots = events.map(ev => `
    <div class="timeline-dot-item">
      <div class="timeline-dot"></div>
      <div class="timeline-dot-label">${ev.label}</div>
    </div>
  `).join('');

  const inner = `
    <div class="block-hero-content block-hero--timeline-branch">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="timeline-visual">
        <div class="timeline-line"></div>
        <div class="timeline-dots">
          ${timelineDots}
        </div>
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 7: objection-battle — Card battle layout
   ========================================================================== */
function renderBlock7ObjectionBattle(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const objections = contentData.objectionCards || [];

  const objectionStack = objections.slice(0, 5).map((card, i) => `
    <div class="objection-fan-card" style="--fan-index:${i}; --fan-total:5">
      <div class="objection-fan-text">${card.text}</div>
      <div class="objection-fan-type">${card.type}</div>
    </div>
  `).join('');

  const inner = `
    <div class="block-hero-content block-hero--objection-battle">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="objection-battle-arena">
        <div class="objection-fan-stack">
          ${objectionStack}
        </div>
        <div class="objection-vs-divider">
          <span class="objection-vs-text">VS</span>
        </div>
        <div class="objection-response-side">
          <div class="objection-response-placeholder">Vaše argumenty</div>
        </div>
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ==========================================================================
   BLOCK 8: commitment-arena — Wall/mosaic layout
   ========================================================================== */
function renderBlock8CommitmentArena(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';

  const wallPlaceholders = Array.from({ length: 6 }, (_, i) => `
    <div class="commitment-wall-card commitment-wall-card--placeholder">
      <div class="commitment-wall-card-icon">${icons.send}</div>
      <div class="commitment-wall-card-text">Závazek #${i + 1}</div>
    </div>
  `).join('');

  const inner = `
    <div class="block-hero-content block-hero--commitment-arena">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      <div class="commitment-wall">
        <div class="commitment-wall-header">Zeď závazků</div>
        <div class="commitment-wall-grid">
          ${wallPlaceholders}
        </div>
      </div>
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type, archetype.accent, bgStyle, inner);
}

/* ---------- Fallback for unknown arena types ---------- */
function renderBlockFallback(block, blockId, isHost) {
  const hero = heroVisuals[blockId] || {};
  const archetype = arenaArchetypes[blockId] || {};
  const bgStyle = hero.cssGradient ? `background: ${hero.cssGradient};` : '';
  const illustration = blockIllustrations[blockId] || '';
  const recommended = getRecommendedActivity(blockId) || getBlockActivities(blockId)[0];

  const inner = `
    <div class="block-hero-content">
      ${illustration ? `<div class="block-illustration">${illustration}</div>` : ''}
      <div class="block-chapter-badge">Blok ${blockId}</div>
      <div class="block-time-badge">${block.time}</div>
      <h1 class="block-title">${block.name}</h1>
      ${block.tagline ? `<p class="block-tagline">${block.tagline}</p>` : ''}
      <p class="block-goal">${block.goal}</p>
      ${blockMeta(block, blockId)}

      ${recommended ? `
        <div class="activity-card activity-card--recommended" onclick="window._startActivity('${recommended.id}')">
          <div class="activity-card-label">Doporučená aktivita</div>
          <div class="activity-card-name">${recommended.name}</div>
          <div class="activity-card-brief">${recommended.brief}</div>
          <button class="btn btn-accent btn-lg activity-start-btn">Začni trénovat ${icons.arrowRight}</button>
        </div>
      ` : ''}
    </div>

    ${isHost ? renderInsightPanel(blockId) : ''}
    ${renderActivityPicker(blockId, isHost)}
    ${isHost ? blockDoneToggle(blockId) : ''}
  `;

  return blockWrap(blockId, archetype.type || '', archetype.accent || 'var(--color-accent)', bgStyle, inner);
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
