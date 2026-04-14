/**
 * state.js — Room model, state management, and event bus
 * Provides the complete room/session/activity state with pub/sub
 * Ready for Supabase Realtime integration
 */

/* ==========================================================================
   EVENT BUS — simple pub/sub for decoupled communication
   ========================================================================== */
class EventBus {
  constructor() { this._listeners = {}; }
  on(event, fn) { (this._listeners[event] ||= []).push(fn); return () => this.off(event, fn); }
  off(event, fn) { const l = this._listeners[event]; if (l) this._listeners[event] = l.filter(f => f !== fn); }
  emit(event, data) { (this._listeners[event] || []).forEach(fn => fn(data)); }
}

export const bus = new EventBus();

/* ==========================================================================
   ROOM MODEL — complete session state
   ========================================================================== */
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[arr[i] % chars.length];
  return code;
}

function generateId() {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return Date.now().toString(36) + Array.from(arr, b => b.toString(36)).join('').slice(0, 8);
}

const initialState = {
  // ── View / routing ──
  view: 'landing',        // landing | join | lobby | host | participant | display | arena
  route: null,

  // ── Room ──
  room: {
    code: null,
    createdAt: null,
    hostId: null,
  },

  // ── Session ──
  session: {
    id: null,
    status: 'idle',       // idle | lobby | active | paused | completed
    currentBlockId: null,
    currentActivityId: null,
    startedAt: null,
  },

  // ── Participants ──
  participants: [],        // [{ id, name, teamId, joinedAt, isOnline, score }]
  localParticipantId: null,

  // ── Teams ──
  teams: [
    { id: 'team-a', name: 'Tým A', color: '#A4D233' },
    { id: 'team-b', name: 'Tým B', color: '#1A6B4B' },
    { id: 'team-c', name: 'Tým C', color: '#008080' },
  ],

  // ── Activity state ──
  activity: {
    id: null,
    phase: 'idle',        // idle | intro | instructions | live | countdown | reveal | results | reflection
    roundIndex: 0,
    totalRounds: 1,
    timerSeconds: 0,
    timerRunning: false,
    isLocked: false,       // host can lock submissions
    revealState: 'hidden', // hidden | partial | full
  },

  // ── Submissions ──
  submissions: [],         // [{ participantId, activityId, round, value, timestamp }]

  // ── Scores ──
  scores: {},              // { participantId: totalScore }

  // ── Display state (for projector) ──
  display: {
    mode: 'session',       // session | activity | leaderboard | countdown | reveal | wall
    data: null,
  },

  // ── Host controls ──
  host: {
    selectedBlockId: null,
    selectedActivityId: null,
  },

  // ── Timer ──
  timer: {
    target: 0,
    remaining: 0,
    running: false,
    intervalId: null,
  },

  // ── Presence ──
  presence: {},            // { participantId: { online, lastSeen } }

  // ── UI ──
  isHostMode: false,
  doneBlocks: new Set(),
  utilsPanelOpen: false,
};

/* ==========================================================================
   STATE STORE — reactive state with change tracking
   ========================================================================== */
class Store {
  constructor() {
    this._state = JSON.parse(JSON.stringify(initialState));
    // Restore non-serializable
    this._state.doneBlocks = new Set();
    this._state.timer.intervalId = null;
  }

  get state() { return this._state; }

  /** Update state and emit changes */
  set(path, value) {
    const keys = path.split('.');
    const forbidden = new Set(['__proto__', 'constructor', 'prototype']);
    if (keys.some(k => forbidden.has(k))) return;
    let obj = this._state;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!obj || typeof obj !== 'object') return;
      if (!Object.prototype.hasOwnProperty.call(obj, keys[i])) return;
      obj = obj[keys[i]];
    }
    if (!obj || typeof obj !== 'object') return;
    const finalKey = keys[keys.length - 1];
    if (forbidden.has(finalKey)) return;
    if (!Object.prototype.hasOwnProperty.call(obj, finalKey) && !(finalKey in obj)) {
      // Only allow setting keys that already exist in the state shape
      return;
    }
    Object.defineProperty(obj, finalKey, { value, writable: true, enumerable: true, configurable: true });
    bus.emit('state:change', { path, value });
    bus.emit(`state:${path}`, value);
  }

  /** Batch update */
  update(changes) {
    for (const [path, value] of Object.entries(changes)) {
      this.set(path, value);
    }
  }

  /** Reset to initial */
  reset() {
    Object.assign(this._state, JSON.parse(JSON.stringify(initialState)));
    this._state.doneBlocks = new Set();
    this._state.timer.intervalId = null;
    bus.emit('state:reset');
  }
}

export const store = new Store();

/* ==========================================================================
   ROOM ACTIONS — create, join, manage rooms
   ========================================================================== */
export const roomActions = {
  /** Host creates a new room */
  createRoom() {
    const code = generateRoomCode();
    const hostId = generateId();
    store.update({
      'room.code': code,
      'room.createdAt': Date.now(),
      'room.hostId': hostId,
      'session.id': generateId(),
      'session.status': 'lobby',
      'isHostMode': true,
      'view': 'lobby',
    });
    // Persist locally
    localStorage.setItem('nzp_room_code', code);
    localStorage.setItem('nzp_host_id', hostId);
    localStorage.setItem('nzp_is_host', 'true');
    bus.emit('room:created', { code, hostId });
    return code;
  },

  /** Participant joins a room */
  joinRoom(code, name, teamId) {
    const participantId = generateId();
    const participant = {
      id: participantId,
      name,
      teamId: teamId || null,
      joinedAt: Date.now(),
      isOnline: true,
      score: 0,
    };
    store.state.participants.push(participant);
    store.update({
      'room.code': code,
      'localParticipantId': participantId,
      'session.status': 'lobby',
      'view': 'lobby',
    });
    localStorage.setItem('nzp_room_code', code);
    localStorage.setItem('nzp_participant_id', participantId);
    localStorage.setItem('nzp_participant_name', name);
    bus.emit('room:joined', { participantId, name, teamId });
    return participantId;
  },

  /** Host starts the session */
  startSession() {
    store.update({
      'session.status': 'active',
      'session.startedAt': Date.now(),
      'session.currentBlockId': 1,
    });
    bus.emit('session:started');
  },

  /** Navigate to a block */
  goToBlock(blockId) {
    store.update({
      'session.currentBlockId': blockId,
      'session.currentActivityId': null,
      'activity.phase': 'idle',
    });
    bus.emit('session:block-changed', blockId);
  },

  /** Start an activity */
  startActivity(activityId) {
    store.update({
      'session.currentActivityId': activityId,
      'activity.id': activityId,
      'activity.phase': 'intro',
      'activity.roundIndex': 0,
      'activity.isLocked': false,
      'activity.revealState': 'hidden',
      'view': 'arena',
    });
    // Clear submissions for this activity
    store.set('submissions', store.state.submissions.filter(s => s.activityId !== activityId));
    bus.emit('activity:started', activityId);
  },

  /** Advance activity phase */
  advancePhase(phase) {
    store.set('activity.phase', phase);
    bus.emit('activity:phase-changed', phase);
  },

  /** Submit an answer */
  submitAnswer(value) {
    const sub = {
      participantId: store.state.localParticipantId,
      activityId: store.state.activity.id,
      round: store.state.activity.roundIndex,
      value,
      timestamp: Date.now(),
    };
    store.state.submissions.push(sub);
    bus.emit('submission:new', sub);
  },

  /** Host toggles lock */
  toggleLock() {
    const locked = !store.state.activity.isLocked;
    store.set('activity.isLocked', locked);
    bus.emit('activity:lock-changed', locked);
  },

  /** Host reveals answers */
  reveal(mode = 'full') {
    store.set('activity.revealState', mode);
    bus.emit('activity:reveal', mode);
  },

  /** Next round */
  nextRound() {
    const next = store.state.activity.roundIndex + 1;
    store.update({
      'activity.roundIndex': next,
      'activity.phase': 'live',
      'activity.isLocked': false,
      'activity.revealState': 'hidden',
    });
    bus.emit('activity:next-round', next);
  },

  /** End activity, return to block screen */
  endActivity() {
    store.update({
      'session.currentActivityId': null,
      'activity.phase': 'idle',
      'view': store.state.isHostMode ? 'host' : 'participant',
    });
    bus.emit('activity:ended');
  },

  /** Mark block as done */
  toggleBlockDone(blockId) {
    const done = store.state.doneBlocks;
    if (done.has(blockId)) done.delete(blockId);
    else done.add(blockId);
    bus.emit('block:done-toggled', blockId);
  },

  /** Add score */
  addScore(participantId, points) {
    if (!store.state.scores[participantId]) store.state.scores[participantId] = 0;
    store.state.scores[participantId] += points;
    bus.emit('scores:updated', { participantId, points });
  },
};

/* ==========================================================================
   TIMER ACTIONS
   ========================================================================== */
export const timerActions = {
  start(seconds) {
    this.stop();
    store.update({
      'timer.target': seconds,
      'timer.remaining': seconds,
      'timer.running': true,
    });
    const id = setInterval(() => {
      const r = store.state.timer.remaining - 1;
      store.set('timer.remaining', r);
      bus.emit('timer:tick', r);
      if (r <= 0) {
        this.stop();
        bus.emit('timer:expired');
      }
    }, 1000);
    store.set('timer.intervalId', id);
    bus.emit('timer:started', seconds);
  },
  stop() {
    if (store.state.timer.intervalId) {
      clearInterval(store.state.timer.intervalId);
      store.set('timer.intervalId', null);
    }
    store.set('timer.running', false);
    bus.emit('timer:stopped');
  },
  reset(seconds) {
    this.stop();
    store.update({
      'timer.remaining': seconds || store.state.timer.target,
      'timer.running': false,
    });
    bus.emit('timer:reset');
  },
};

/* ==========================================================================
   SELECTORS — derived state helpers
   ========================================================================== */
export const selectors = {
  currentBlock() {
    return store.state.session.currentBlockId;
  },
  currentActivity() {
    return store.state.session.currentActivityId;
  },
  submissionsForActivity(activityId, round) {
    return store.state.submissions.filter(s =>
      s.activityId === activityId && (round === undefined || s.round === round)
    );
  },
  participantCount() {
    return store.state.participants.length;
  },
  leaderboard() {
    return Object.entries(store.state.scores)
      .map(([id, score]) => {
        const p = store.state.participants.find(p => p.id === id);
        return { id, name: p?.name || 'Unknown', teamId: p?.teamId, score };
      })
      .sort((a, b) => b.score - a.score);
  },
  submissionCount(activityId, round) {
    return this.submissionsForActivity(activityId, round).length;
  },
};
