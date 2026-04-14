/**
 * app.js — Main entry point, router, and global action handlers
 * Loads as ES module, orchestrates all views and engines
 */
import { store, bus, roomActions, timerActions, selectors } from './state.js';
import { engine, formatKc, formatTimer, icons } from './engine.js';
import { agendaData, activities, contentData, getBlockActivities } from './data.js';
import { renderLanding, renderJoin, renderLobby, renderHost, renderParticipant, renderDisplay, renderArena, renderMap } from './views.js';
import { initChannel, broadcast } from './supabase.js';

/* ==========================================================================
   ROUTER — view-based navigation via state
   ========================================================================== */
const appRoot = document.getElementById('app');

function render() {
  const view = store.state.view;
  let html = '';
  switch (view) {
    case 'landing':     html = renderLanding(); break;
    case 'join':        html = renderJoin(); break;
    case 'lobby':       html = renderLobby(); break;
    case 'host':        html = renderHost(); break;
    case 'participant': html = renderParticipant(); break;
    case 'display':     html = renderDisplay(); break;
    case 'arena':       html = renderArena(); break;
    case 'map':         html = renderMap(); break;
    default:            html = renderLanding();
  }
  appRoot.innerHTML = html;
  appRoot.dataset.view = view;
  document.body.dataset.view = view;
}

/* ==========================================================================
   GLOBAL ACTION HANDLERS — exposed to onclick in templates
   ========================================================================== */

// Navigation
window._navigateTo = (view) => {
  store.set('view', view);
  render();
};

// Room actions
window._createRoom = () => {
  const code = roomActions.createRoom();
  // Add host as virtual participant for testing
  roomActions.joinRoom(code, 'Lektor', null);
  initChannel(code);
  render();
};

window._joinRoom = () => {
  const codeInput = document.getElementById('room-code-input');
  const nameInput = document.getElementById('participant-name-input');
  if (!codeInput || !nameInput) return;
  const code = codeInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();
  if (!code || code.length < 4) { codeInput.focus(); return; }
  if (!name) { nameInput.focus(); return; }
  const teamId = window._selectedTeam || null;
  roomActions.joinRoom(code, name, teamId);
  initChannel(code);
  render();
};

window._selectTeam = (btn, teamId) => {
  document.querySelectorAll('.join-team-btn').forEach(b => b.classList.remove('is-selected'));
  btn.classList.add('is-selected');
  window._selectedTeam = teamId;
};
window._selectedTeam = null;

window._startSession = () => {
  roomActions.startSession();
  store.set('view', 'host');
  render();
};

// Block navigation
window._goToBlock = (blockId) => {
  roomActions.goToBlock(blockId);
  if (store.state.view === 'map') {
    store.set('view', store.state.isHostMode ? 'host' : 'participant');
  }
  render();
};

window._nextBlock = () => {
  const current = store.state.session.currentBlockId || 1;
  if (current < 8) window._goToBlock(current + 1);
};

window._prevBlock = () => {
  const current = store.state.session.currentBlockId || 1;
  if (current > 1) window._goToBlock(current - 1);
};

window._toggleBlockDone = (blockId) => {
  roomActions.toggleBlockDone(blockId);
  render();
};

// Activity actions
window._startActivity = (activityId) => {
  engine.start(activityId);
  store.set('view', 'arena');
  render();
};

// Engine shortcuts
window._engine = engine;
window._roomActions = roomActions;
window._store = store;

// Estimate template handlers
window._updateEstimate = (value) => {
  const display = document.getElementById('estimate-value');
  if (display) display.textContent = formatKc(Number(value));
};

window._submitEstimate = () => {
  const slider = document.getElementById('estimate-slider');
  if (!slider) return;
  roomActions.submitAnswer(Number(slider.value));
  render();
};

// Quiz template handlers
window._startQuizRound = () => {
  const act = activities.find(a => a.id === store.state.activity.id);
  if (act) {
    timerActions.start(act.config.timePerQuestion || 15);
  }
  engine.advance('live');
  render();
};

window._submitQuizAnswer = (optionIndex) => {
  const act = activities.find(a => a.id === store.state.activity.id);
  if (!act) return;
  const questions = contentData[act.config.questions] || [];
  const q = questions[store.state.activity.roundIndex];
  if (!q) return;
  roomActions.submitAnswer(optionIndex);
  // Score: correct + speed bonus
  if (optionIndex === q.correct) {
    const timeBonus = Math.max(0, store.state.timer.remaining);
    roomActions.addScore(store.state.localParticipantId, 100 + timeBonus * 5);
  }
  render();
};

window._nextQuizQuestion = () => {
  roomActions.nextRound();
  const act = activities.find(a => a.id === store.state.activity.id);
  if (act) timerActions.start(act.config.timePerQuestion || 15);
  engine.advance('live');
  render();
};

// Vote template handlers
window._submitVote = (optionIndex) => {
  roomActions.submitAnswer(optionIndex);
  render();
};

// Sort/classify handlers
window._cycleSortItem = (btn) => {
  const cats = document.querySelectorAll('.sort-bucket');
  const currentCat = parseInt(btn.dataset.cat || '-1');
  const nextCat = (currentCat + 1) % (cats.length + 1);
  if (nextCat >= cats.length) {
    // Back to pool
    btn.dataset.cat = '-1';
    btn.style.borderColor = '';
    btn.style.background = '';
  } else {
    btn.dataset.cat = nextCat;
    const colors = ['var(--color-accent)', 'var(--color-forest)', 'var(--color-teal)', '#E65100'];
    btn.style.borderColor = colors[nextCat] || colors[0];
    btn.style.background = `${colors[nextCat] || colors[0]}15`;
  }
};

window._submitSort = () => {
  const items = document.querySelectorAll('.sort-item');
  const result = {};
  items.forEach((item, i) => {
    result[i] = parseInt(item.dataset.cat || '-1');
  });
  roomActions.submitAnswer(result);
  render();
};

// Scenario/branching handlers
window._branchTo = (nodeId) => {
  store.state.activity._branchNode = nodeId;
  render();
};

window._resetBranching = () => {
  store.state.activity._branchNode = null;
  render();
};

window._submitCase = () => {
  const input = document.getElementById('case-input');
  if (input) roomActions.submitAnswer(input.value);
  render();
};

// Roleplay handlers
window._startRoleplayRound = () => {
  const act = activities.find(a => a.id === store.state.activity.id);
  if (act) timerActions.start(act.config.timePerRound || 60);
  engine.advance('live');
  render();
};

window._submitFeedback = (score) => {
  // store for later
  window._feedbackScore = score;
};

window._submitRoleplayFeedback = () => {
  const text = document.getElementById('feedback-text')?.value || '';
  roomActions.submitAnswer({ score: window._feedbackScore || 3, text });
  render();
};

// Free input handlers
window._submitFreeText = () => {
  const input = document.getElementById('freetext-input');
  if (!input || !input.value.trim()) return;
  roomActions.submitAnswer(input.value.trim());
  render();
};

// Matching handlers
window._flipCard = (btn) => {
  if (btn.classList.contains('is-matched')) return;
  btn.classList.add('is-flipped');
  const flipped = document.querySelectorAll('.matching-card.is-flipped:not(.is-matched)');
  if (flipped.length === 2) {
    const a = flipped[0], b = flipped[1];
    if (a.dataset.pair === b.dataset.pair && a.dataset.id !== b.dataset.id) {
      // Match!
      setTimeout(() => { a.classList.add('is-matched'); b.classList.add('is-matched'); }, 400);
      roomActions.addScore(store.state.localParticipantId, 50);
    } else {
      setTimeout(() => { a.classList.remove('is-flipped'); b.classList.remove('is-flipped'); }, 800);
    }
  }
};

window._startMatching = () => {
  const act = activities.find(a => a.id === store.state.activity.id);
  if (act) timerActions.start(act.config.timeLimit || 90);
  engine.advance('live');
  render();
};

// Auction handlers
window._updateAuctionBudget = () => {
  const act = activities.find(a => a.id === store.state.activity.id);
  if (!act) return;
  const budget = act.config.budget || 300000;
  const inputs = document.querySelectorAll('.auction-bid-input');
  let spent = 0;
  inputs.forEach(inp => { spent += parseInt(inp.value || '0'); });
  const display = document.getElementById('auction-budget');
  const remaining = budget - spent;
  if (display) display.textContent = `Zbývá: ${formatKc(remaining)}`;
  if (remaining < 0 && display) display.classList.add('budget-over');
  else if (display) display.classList.remove('budget-over');
};

window._submitAuction = () => {
  const inputs = document.querySelectorAll('.auction-bid-input');
  const bids = {};
  inputs.forEach(inp => { bids[inp.dataset.idx] = parseInt(inp.value || '0'); });
  roomActions.submitAnswer(bids);
  render();
};

// Review handlers
window._submitReview = (score) => {
  window._reviewScore = score;
};

window._submitReviewFull = () => {
  const comment = document.getElementById('review-comment')?.value || '';
  roomActions.submitAnswer({ score: window._reviewScore || 3, comment });
  render();
};

// Reflection handler
window._submitReflection = () => {
  const input = document.getElementById('reflection-input');
  if (input) roomActions.submitAnswer(input.value);
  engine.advance();
  render();
};

// Character counter for free text
document.addEventListener('input', (e) => {
  if (e.target.id === 'freetext-input') {
    const counter = document.getElementById('char-count');
    if (counter) counter.textContent = e.target.value.length;
  }
});

/* ==========================================================================
   KEYBOARD NAVIGATION
   ========================================================================== */
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const view = store.state.view;
  if (view === 'host' || view === 'participant') {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); window._nextBlock(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); window._prevBlock(); }
  }
  if (e.key === 'Escape' && view === 'arena') {
    engine.end();
    store.set('view', store.state.isHostMode ? 'host' : 'participant');
    render();
  }
});

/* ==========================================================================
   BUS LISTENERS — re-render on state changes
   ========================================================================== */
bus.on('activity:phase-changed', () => render());
bus.on('activity:started', () => render());
bus.on('activity:ended', () => render());
bus.on('activity:lock-changed', () => render());
bus.on('activity:reveal', () => render());
bus.on('activity:next-round', () => render());
bus.on('session:block-changed', () => render());
bus.on('submission:new', () => render());
bus.on('room:joined', () => render());

bus.on('timer:tick', () => {
  const timerEl = document.getElementById('arena-timer');
  if (timerEl) {
    timerEl.textContent = formatTimer(store.state.timer.remaining);
    if (store.state.timer.remaining <= 10) timerEl.classList.add('timer-urgent');
  }
});

bus.on('timer:expired', () => {
  if (store.state.activity.phase === 'live') {
    engine.advance('reveal');
    render();
  }
});

/* ==========================================================================
   URL HASH ROUTING (optional — for direct links)
   ========================================================================== */
function handleHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (hash === 'display') {
    store.set('view', 'display');
    render();
  }
}
window.addEventListener('hashchange', handleHash);

/* ==========================================================================
   INIT
   ========================================================================== */
function init() {
  // Check for saved session
  const savedCode = localStorage.getItem('nzp_room_code');
  const isHost = localStorage.getItem('nzp_is_host') === 'true';

  // Start at landing
  store.set('view', 'landing');

  // Handle hash route
  handleHash();

  // Initial render
  render();
}

document.addEventListener('DOMContentLoaded', init);
