/**
 * supabase.js — Supabase client abstraction
 * Ready for Supabase Realtime / Broadcast / Presence connection
 * Currently uses local state; replace with real Supabase when deploying
 */
import { bus, store } from './state.js';

/* ==========================================================================
   SUPABASE CONFIG — set these env vars for production
   ========================================================================== */
const SUPABASE_URL = '';   // e.g. https://xxx.supabase.co
const SUPABASE_ANON_KEY = '';

/** Whether Supabase is configured and available */
export const isOnline = () => !!(SUPABASE_URL && SUPABASE_ANON_KEY);

/* ==========================================================================
   REALTIME CHANNEL — room-based broadcast
   ========================================================================== */
let channel = null;

/**
 * Initialize realtime channel for a room
 * When Supabase is connected, this will:
 * - Subscribe to room channel
 * - Broadcast state changes
 * - Sync presence (who's online)
 * - Handle reconnection
 */
export function initChannel(roomCode) {
  if (!isOnline()) {
    console.info('[Supabase] Offline mode — using local state only');
    return;
  }

  // TODO: Initialize Supabase client
  // const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  // channel = supabase.channel(`room:${roomCode}`);

  // TODO: Subscribe to broadcast events
  // channel.on('broadcast', { event: 'state-sync' }, (payload) => { ... });
  // channel.on('broadcast', { event: 'submission' }, (payload) => { ... });
  // channel.on('broadcast', { event: 'phase-change' }, (payload) => { ... });

  // TODO: Track presence
  // channel.on('presence', { event: 'sync' }, () => { ... });
  // channel.on('presence', { event: 'join' }, ({ key, newPresences }) => { ... });
  // channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => { ... });

  // channel.subscribe(async (status) => {
  //   if (status === 'SUBSCRIBED') {
  //     await channel.track({ participantId: store.state.localParticipantId, name: '...' });
  //   }
  // });
}

/**
 * Broadcast an event to all participants in the room
 */
export function broadcast(event, payload) {
  if (!isOnline() || !channel) {
    // Local mode: directly apply via event bus
    bus.emit(`sync:${event}`, payload);
    return;
  }
  // channel.send({ type: 'broadcast', event, payload });
}

/**
 * Save submission to Supabase database
 */
export async function saveSubmission(submission) {
  if (!isOnline()) {
    // Local: already in store.state.submissions
    return;
  }
  // const { data, error } = await supabase
  //   .from('submissions')
  //   .insert(submission);
}

/**
 * Load room state from Supabase
 */
export async function loadRoom(roomCode) {
  if (!isOnline()) {
    return null; // No server-side state
  }
  // const { data } = await supabase
  //   .from('rooms')
  //   .select('*, sessions(*), participants(*)')
  //   .eq('code', roomCode)
  //   .single();
  // return data;
}

/**
 * Create room in Supabase
 */
export async function createRoom(roomCode, hostId) {
  if (!isOnline()) return;
  // const { data } = await supabase
  //   .from('rooms')
  //   .insert({ code: roomCode, host_id: hostId, created_at: new Date().toISOString() });
}

/**
 * Cleanup — unsubscribe from channel
 */
export function disconnect() {
  if (channel) {
    // channel.unsubscribe();
    channel = null;
  }
}

/* ==========================================================================
   DB SCHEMA (for reference — create in Supabase dashboard)
   ==========================================================================

   CREATE TABLE rooms (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     code TEXT UNIQUE NOT NULL,
     host_id TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT now(),
     status TEXT DEFAULT 'lobby'
   );

   CREATE TABLE sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     room_id UUID REFERENCES rooms(id),
     current_block_id INT,
     current_activity_id TEXT,
     status TEXT DEFAULT 'idle',
     started_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   CREATE TABLE participants (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     room_id UUID REFERENCES rooms(id),
     name TEXT NOT NULL,
     team_id TEXT,
     score INT DEFAULT 0,
     is_online BOOLEAN DEFAULT true,
     joined_at TIMESTAMPTZ DEFAULT now()
   );

   CREATE TABLE submissions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     room_id UUID REFERENCES rooms(id),
     participant_id UUID REFERENCES participants(id),
     activity_id TEXT NOT NULL,
     round INT DEFAULT 0,
     value JSONB,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   CREATE TABLE scores (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     room_id UUID REFERENCES rooms(id),
     participant_id UUID REFERENCES participants(id),
     activity_id TEXT,
     points INT,
     created_at TIMESTAMPTZ DEFAULT now()
   );

   -- Enable Realtime on all tables
   ALTER PUBLICATION supabase_realtime ADD TABLE rooms, sessions, participants, submissions, scores;

   ========================================================================== */
