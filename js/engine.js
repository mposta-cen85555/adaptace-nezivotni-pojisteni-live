/**
 * engine.js — Activity engine state machine + 10 reusable activity templates
 * Each template provides host/participant/display renderers
 */
import { store, bus, roomActions, timerActions, selectors } from './state.js';
import { activities, contentData } from './data.js';

/* ==========================================================================
   ICONS — simple SVG line icons (no emoji)
   ========================================================================== */
export const icons = {
  play: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
  pause: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
  check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  arrowRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
  arrowLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>',
  unlock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/></svg>',
  eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  clock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  trophy: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>',
  send: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  refresh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>',
};

/* ==========================================================================
   FORMAT HELPERS
   ========================================================================== */
export function formatKc(v) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(v);
}

export function formatTimer(s) {
  if (s < 0) s = 0;
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

/* ==========================================================================
   ACTIVITY ENGINE — phase state machine
   Phases: idle → intro → instructions → live → countdown → reveal → results → reflection → idle
   ========================================================================== */
export class ActivityEngine {
  constructor() {
    this.phases = ['intro', 'instructions', 'live', 'countdown', 'reveal', 'results', 'reflection'];
    bus.on('timer:expired', () => {
      if (store.state.activity.phase === 'live' || store.state.activity.phase === 'countdown') {
        this.advance('reveal');
      }
    });
  }

  start(activityId) {
    roomActions.startActivity(activityId);
  }

  advance(phase) {
    if (phase) {
      roomActions.advancePhase(phase);
    } else {
      const current = store.state.activity.phase;
      const idx = this.phases.indexOf(current);
      if (idx < this.phases.length - 1) {
        roomActions.advancePhase(this.phases[idx + 1]);
      } else {
        this.end();
      }
    }
  }

  end() {
    roomActions.endActivity();
  }

  getActivity(activityId) {
    return activities.find(a => a.id === activityId);
  }

  getTemplate(activityId) {
    const act = this.getActivity(activityId);
    if (!act) return null;
    return templateRegistry[act.template] || null;
  }

  getContentData(key) {
    return contentData[key] || [];
  }
}

export const engine = new ActivityEngine();

/* ==========================================================================
   TEMPLATE REGISTRY — maps template names to renderer classes
   ========================================================================== */
const templateRegistry = {};

function registerTemplate(name, template) {
  templateRegistry[name] = template;
}

/* ==========================================================================
   BASE TEMPLATE — shared rendering patterns
   ========================================================================== */
class BaseTemplate {
  /** Render the arena header with activity name and phase controls */
  renderArenaHeader(activity, phase) {
    const isHost = store.state.isHostMode;
    const phaseDots = this.renderPhaseDots(phase);
    return `
      <div class="arena-header">
        <div class="arena-header-top">
          <button class="arena-close-btn" onclick="window._engine.end()" aria-label="Zavřít">${icons.x}</button>
          <div class="arena-title">${activity.name}</div>
          <div class="arena-phase-label">${this.phaseLabel(phase)}</div>
        </div>
        <div class="arena-phase-dots">${phaseDots}</div>
        ${isHost ? this.renderHostControls(activity, phase) : ''}
      </div>
    `;
  }

  renderPhaseDots(currentPhase) {
    const phases = ['intro', 'instructions', 'live', 'reveal', 'results'];
    return phases.map(p => `<span class="phase-dot${p === currentPhase ? ' is-active' : ''}" data-phase="${p}"></span>`).join('');
  }

  phaseLabel(phase) {
    const labels = { intro: 'Úvod', instructions: 'Instrukce', live: 'Probíhá', countdown: 'Odpočet', reveal: 'Odhalení', results: 'Výsledky', reflection: 'Reflexe' };
    return labels[phase] || '';
  }

  renderHostControls(activity, phase) {
    const locked = store.state.activity.isLocked;
    const subCount = selectors.submissionCount(activity.id, store.state.activity.roundIndex);
    const pCount = selectors.participantCount();
    return `
      <div class="arena-host-bar">
        <span class="host-bar-stat">${icons.users} ${subCount}/${pCount} odpovědí</span>
        <button class="btn btn-sm btn-ghost" onclick="window._roomActions.toggleLock()">${locked ? icons.unlock : icons.lock} ${locked ? 'Odemknout' : 'Zamknout'}</button>
        <button class="btn btn-sm btn-ghost" onclick="window._roomActions.reveal()">${icons.eye} Odhalit</button>
        <button class="btn btn-sm btn-accent" onclick="window._engine.advance()">${icons.arrowRight} Další fáze</button>
      </div>
    `;
  }

  /** Render timer widget */
  renderTimer() {
    const { remaining, running } = store.state.timer;
    const cls = remaining <= 10 && running ? 'timer-urgent' : running ? 'timer-running' : '';
    return `<div class="arena-timer ${cls}" id="arena-timer">${formatTimer(remaining)}</div>`;
  }

  /** Render participant count */
  renderParticipantCount() {
    const count = selectors.submissionCount(store.state.activity.id, store.state.activity.roundIndex);
    const total = selectors.participantCount();
    return `<div class="arena-submission-count">${count} / ${total} odpovědí</div>`;
  }

  /** Default intro screen */
  renderIntro(activity) {
    return `
      <div class="arena-center">
        <div class="arena-intro-card">
          <div class="arena-intro-label">Aktivita</div>
          <h2 class="arena-intro-title">${activity.name}</h2>
          <p class="arena-intro-brief">${activity.brief}</p>
          ${store.state.isHostMode ? `<button class="btn btn-lg btn-accent" onclick="window._engine.advance('instructions')">Pokračovat ${icons.arrowRight}</button>` : '<p class="arena-waiting">Čekejte na lektora...</p>'}
        </div>
      </div>
    `;
  }

  /** Default reflection screen */
  renderReflection(activity) {
    return `
      <div class="arena-center">
        <div class="arena-reflection-card">
          <h3>Reflexe</h3>
          <p>Co vás v této aktivitě překvapilo?</p>
          <textarea class="arena-reflection-input" placeholder="Vaše myšlenka..." rows="3" id="reflection-input"></textarea>
          <button class="btn btn-accent" onclick="window._submitReflection()">Odeslat ${icons.send}</button>
          ${store.state.isHostMode ? `<button class="btn btn-outline" onclick="window._engine.end()">Ukončit aktivitu</button>` : ''}
        </div>
      </div>
    `;
  }

  /** Render for host/participant/display based on phase */
  render(activity, phase, viewMode) {
    return this.renderArenaHeader(activity, phase) + this.renderPhaseContent(activity, phase, viewMode);
  }

  renderPhaseContent(activity, phase, viewMode) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'reflection': return this.renderReflection(activity);
      default: return `<div class="arena-center"><p>Fáze: ${phase}</p></div>`;
    }
  }
}

/* ==========================================================================
   TEMPLATE: ESTIMATE — numeric estimate + reveal + distribution
   Used by: B1A1 (damage slider), B1A4, B5A4
   ========================================================================== */
class EstimateTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase, viewMode) {
    const items = engine.getContentData(activity.config.items);
    const currentItem = items[store.state.activity.roundIndex] || items[0];
    if (!currentItem) return super.renderPhaseContent(activity, phase, viewMode);

    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderInstructions(activity, currentItem);
      case 'live': return viewMode === 'display' ? this.renderDisplayLive(activity, currentItem) : this.renderLive(activity, currentItem);
      case 'reveal': return this.renderReveal(activity, currentItem);
      case 'results': return this.renderResults(activity, items);
      case 'reflection': return this.renderReflection(activity);
      default: return super.renderPhaseContent(activity, phase, viewMode);
    }
  }

  renderInstructions(activity, item) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <div class="arena-card-label">Scénář ${store.state.activity.roundIndex + 1}</div>
          <h3 class="arena-card-title">${item.label}</h3>
          <p class="arena-card-desc">${item.desc}</p>
          <p class="arena-card-instruction">Odhadněte výši škody v Kč.</p>
          ${store.state.isHostMode ? `
            <div class="arena-card-actions">
              <button class="btn btn-accent" onclick="window._engine.advance('live')">Spustit odhady ${icons.play}</button>
            </div>
          ` : '<p class="arena-waiting">Čekejte na spuštění...</p>'}
        </div>
      </div>
    `;
  }

  renderLive(activity, item) {
    const cfg = activity.config;
    const submitted = store.state.submissions.find(s => s.activityId === activity.id && s.round === store.state.activity.roundIndex && s.participantId === store.state.localParticipantId);
    const locked = store.state.activity.isLocked;

    if (submitted) {
      return `
        <div class="arena-center">
          <div class="arena-card">
            <div class="arena-submitted-badge">${icons.check} Odesláno</div>
            <p class="arena-submitted-value">${formatKc(submitted.value)}</p>
            <p class="arena-waiting">Čekejte na odhalení...</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3 class="arena-card-title">${item.label}</h3>
          <p class="arena-card-desc">${item.desc}</p>
          ${locked ? '<p class="arena-locked-msg">Odpovědi jsou zamčené.</p>' : `
            <div class="estimate-input-group">
              <input type="range" class="estimate-slider" min="${cfg.min || 0}" max="${cfg.max || 500000}" step="${cfg.step || 5000}" value="${(cfg.max || 500000) / 4}" oninput="window._updateEstimate(this.value)" id="estimate-slider" />
              <div class="estimate-value" id="estimate-value">${formatKc((cfg.max || 500000) / 4)}</div>
            </div>
            <button class="btn btn-accent btn-lg" onclick="window._submitEstimate()">Odeslat odhad ${icons.send}</button>
          `}
        </div>
        ${this.renderParticipantCount()}
      </div>
    `;
  }

  renderDisplayLive(activity, item) {
    const subs = selectors.submissionsForActivity(activity.id, store.state.activity.roundIndex);
    const total = selectors.participantCount() || 1;
    return `
      <div class="arena-display-center">
        <h2 class="display-scenario-title">${item.label}</h2>
        <p class="display-scenario-desc">${item.desc}</p>
        <div class="display-progress-ring">
          <div class="progress-ring-count">${subs.length}</div>
          <div class="progress-ring-total">/ ${total}</div>
          <div class="progress-ring-label">odpovědí</div>
        </div>
        ${this.renderTimer()}
      </div>
    `;
  }

  renderReveal(activity, item) {
    const subs = selectors.submissionsForActivity(activity.id, store.state.activity.roundIndex);
    const values = subs.map(s => s.value);
    const avg = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;

    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg arena-reveal-card">
          <h3>${item.label}</h3>
          <div class="reveal-real-value">
            <div class="reveal-label">Skutečná škoda</div>
            <div class="reveal-number">${formatKc(item.realValue)}</div>
          </div>
          <div class="reveal-stats">
            <div class="reveal-stat">
              <div class="reveal-stat-label">Průměrný odhad</div>
              <div class="reveal-stat-value">${formatKc(avg)}</div>
            </div>
            <div class="reveal-stat">
              <div class="reveal-stat-label">Rozptyl</div>
              <div class="reveal-stat-value">${formatKc(min)} – ${formatKc(max)}</div>
            </div>
            <div class="reveal-stat">
              <div class="reveal-stat-label">Odpovědí</div>
              <div class="reveal-stat-value">${values.length}</div>
            </div>
          </div>
          ${store.state.isHostMode ? `
            <div class="arena-card-actions">
              ${store.state.activity.roundIndex < (engine.getContentData(activity.config.items).length - 1)
                ? `<button class="btn btn-accent" onclick="window._roomActions.nextRound(); window._engine.advance('instructions')">Další scénář ${icons.arrowRight}</button>`
                : `<button class="btn btn-accent" onclick="window._engine.advance('results')">Výsledky ${icons.arrowRight}</button>`
              }
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderResults(activity, items) {
    const allSubs = selectors.submissionsForActivity(activity.id);
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Shrnutí</h3>
          <div class="results-grid">
            ${items.map((item, i) => {
              const roundSubs = allSubs.filter(s => s.round === i);
              const avg = roundSubs.length ? Math.round(roundSubs.reduce((a, b) => a + b.value, 0) / roundSubs.length) : 0;
              const diff = item.realValue ? Math.round(((avg - item.realValue) / item.realValue) * 100) : 0;
              return `
                <div class="results-row">
                  <div class="results-label">${item.label}</div>
                  <div class="results-real">${formatKc(item.realValue)}</div>
                  <div class="results-avg">${formatKc(avg)}</div>
                  <div class="results-diff ${diff > 0 ? 'diff-over' : 'diff-under'}">${diff > 0 ? '+' : ''}${diff}%</div>
                </div>
              `;
            }).join('')}
          </div>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('reflection')">Reflexe ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('estimate', new EstimateTemplate());

/* ==========================================================================
   TEMPLATE: QUIZ — multiple choice + timer + leaderboard
   Used by: B1A5, B2A3, B6A2, B6A4
   ========================================================================== */
class QuizTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase, viewMode) {
    const questions = engine.getContentData(activity.config.questions);
    const currentQ = questions[store.state.activity.roundIndex];
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderQuizInstructions(activity, questions);
      case 'live': return viewMode === 'display' ? this.renderDisplayQuestion(activity, currentQ) : this.renderQuestion(activity, currentQ);
      case 'reveal': return this.renderQuizReveal(activity, currentQ);
      case 'results': return this.renderLeaderboard(activity);
      default: return super.renderPhaseContent(activity, phase, viewMode);
    }
  }

  renderQuizInstructions(activity, questions) {
    return `
      <div class="arena-center">
        <div class="arena-card">
          <h3>${questions.length} otázek</h3>
          <p>${activity.config.timePerQuestion} sekund na odpověď</p>
          <p>Rychlejší správná odpověď = více bodů</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._startQuizRound()">Spustit kvíz ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderQuestion(activity, q) {
    if (!q) return '<div class="arena-center"><p>Žádné otázky k dispozici. <em>Content needs validation.</em></p></div>';
    const submitted = store.state.submissions.find(s => s.activityId === activity.id && s.round === store.state.activity.roundIndex && s.participantId === store.state.localParticipantId);
    return `
      <div class="arena-center">
        ${this.renderTimer()}
        <div class="arena-card arena-card--lg">
          <div class="quiz-question-num">Otázka ${store.state.activity.roundIndex + 1}</div>
          <h3 class="quiz-question-text">${q.q}</h3>
          <div class="quiz-options">
            ${q.options.map((opt, i) => `
              <button class="quiz-option ${submitted ? (i === q.correct ? 'is-correct' : submitted.value === i ? 'is-wrong' : '') : ''}"
                onclick="window._submitQuizAnswer(${i})" ${submitted ? 'disabled' : ''}>${opt}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderDisplayQuestion(activity, q) {
    if (!q) return '<div class="arena-display-center"><p>Content needs validation</p></div>';
    return `
      <div class="arena-display-center">
        ${this.renderTimer()}
        <div class="display-question-card">
          <div class="display-question-num">Otázka ${store.state.activity.roundIndex + 1}</div>
          <h2 class="display-question-text">${q.q}</h2>
          <div class="display-options">
            ${q.options.map((opt, i) => `<div class="display-option"><span class="display-option-letter">${String.fromCharCode(65 + i)}</span>${opt}</div>`).join('')}
          </div>
        </div>
        ${this.renderParticipantCount()}
      </div>
    `;
  }

  renderQuizReveal(activity, q) {
    if (!q) return '<div class="arena-center"><p>No data</p></div>';
    const subs = selectors.submissionsForActivity(activity.id, store.state.activity.roundIndex);
    const correctCount = subs.filter(s => s.value === q.correct).length;
    const questions = engine.getContentData(activity.config.questions);
    const hasNext = store.state.activity.roundIndex < questions.length - 1;
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>${q.q}</h3>
          <div class="quiz-reveal-answer">
            <div class="quiz-reveal-correct">${q.options[q.correct]}</div>
            <div class="quiz-reveal-stats">${correctCount} / ${subs.length} správně</div>
          </div>
          ${store.state.isHostMode ? `
            <div class="arena-card-actions">
              ${hasNext
                ? `<button class="btn btn-accent" onclick="window._nextQuizQuestion()">Další otázka ${icons.arrowRight}</button>`
                : `<button class="btn btn-accent" onclick="window._engine.advance('results')">Výsledky ${icons.trophy}</button>`
              }
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderLeaderboard(activity) {
    const lb = selectors.leaderboard();
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3 class="leaderboard-title">${icons.trophy} Výsledky</h3>
          <div class="leaderboard-list">
            ${lb.slice(0, 10).map((entry, i) => `
              <div class="leaderboard-row ${i < 3 ? 'leaderboard-top' : ''}">
                <span class="leaderboard-rank">${i + 1}.</span>
                <span class="leaderboard-name">${entry.name}</span>
                <span class="leaderboard-score">${entry.score} b.</span>
              </div>
            `).join('') || '<p>Zatím žádné výsledky.</p>'}
          </div>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('reflection')">Reflexe ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('quiz', new QuizTemplate());

/* ==========================================================================
   TEMPLATE: SORT / CLASSIFY — drag-drop + categories
   Used by: B2A2, B2A4, B2A5, B3A1, B3A2
   ========================================================================== */
class SortTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase, viewMode) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderSortInstructions(activity);
      case 'live': return this.renderSortLive(activity);
      case 'reveal': return this.renderSortReveal(activity);
      default: return super.renderPhaseContent(activity, phase, viewMode);
    }
  }

  renderSortInstructions(activity) {
    const categories = activity.config.categories;
    const catNames = typeof categories === 'string' ? (engine.getContentData(categories) || []) : (categories || []);
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Roztřiďte položky do kategorií</h3>
          <div class="sort-categories-preview">
            ${(Array.isArray(catNames) ? catNames : []).map(c => `<span class="sort-category-tag">${typeof c === 'string' ? c : c.name || c}</span>`).join('')}
          </div>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._engine.advance('live')">Spustit ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderSortLive(activity) {
    const items = engine.getContentData(activity.config.items);
    const categories = activity.config.categories;
    const catData = typeof categories === 'string' ? (engine.getContentData(categories) || []) : (categories || []);
    const submitted = store.state.submissions.find(s => s.activityId === activity.id && s.participantId === store.state.localParticipantId);

    if (submitted) {
      return `<div class="arena-center"><div class="arena-card"><div class="arena-submitted-badge">${icons.check} Odpověď odeslána</div><p class="arena-waiting">Čekejte na odhalení...</p></div></div>`;
    }

    return `
      <div class="arena-center">
        ${this.renderTimer()}
        <div class="arena-card arena-card--wide">
          <div class="sort-categories-row" id="sort-categories">
            ${(Array.isArray(catData) ? catData : []).map((c, i) => {
              const label = typeof c === 'string' ? c : (c.name || c);
              return `<div class="sort-bucket" data-cat="${i}"><div class="sort-bucket-label">${label}</div><div class="sort-bucket-items" id="bucket-${i}"></div></div>`;
            }).join('')}
          </div>
          <div class="sort-items-pool" id="sort-pool">
            ${(items || []).map((item, i) => {
              const text = typeof item === 'string' ? item : (item.text || item.name || item);
              return `<button class="sort-item" data-idx="${i}" onclick="window._cycleSortItem(this)">${text}</button>`;
            }).join('')}
          </div>
          <button class="btn btn-accent btn-lg" onclick="window._submitSort()">Odeslat ${icons.send}</button>
        </div>
      </div>
    `;
  }

  renderSortReveal(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Správné zařazení</h3>
          <p class="arena-card-desc">Podívejte se, jak měly být položky roztříděny.</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('results')">Výsledky ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('sort', new SortTemplate());
registerTemplate('classify', new SortTemplate());

/* ==========================================================================
   TEMPLATE: VOTE / POLL — instant group vote with reveal
   Used by: B1A4, B3A3, B7A4
   ========================================================================== */
class VoteTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase, viewMode) {
    const items = engine.getContentData(activity.config.items);
    const currentItem = items[store.state.activity.roundIndex] || items[0];
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderVoteInstructions(activity, currentItem);
      case 'live': return viewMode === 'display' ? this.renderDisplayVote(activity, currentItem) : this.renderVoteLive(activity, currentItem);
      case 'reveal': return this.renderVoteReveal(activity, currentItem);
      default: return super.renderPhaseContent(activity, phase, viewMode);
    }
  }

  renderVoteInstructions(activity, item) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <div class="arena-card-label">Hlasování</div>
          ${item ? `<h3>${item.text || item}</h3>` : '<h3>Připravte se na hlasování</h3>'}
          <p>Vyberte jednu z možností.</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._engine.advance('live')">Spustit hlasování ${icons.play}</button>` : '<p class="arena-waiting">Čekejte...</p>'}
        </div>
      </div>
    `;
  }

  renderVoteLive(activity, item) {
    const options = activity.config.options || ['Ano', 'Ne'];
    const submitted = store.state.submissions.find(s => s.activityId === activity.id && s.round === store.state.activity.roundIndex && s.participantId === store.state.localParticipantId);
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          ${item ? `<h3>${item.text || item}</h3>` : ''}
          <div class="vote-options">
            ${options.map((opt, i) => `
              <button class="vote-option-btn ${submitted && submitted.value === i ? 'is-selected' : ''}"
                onclick="window._submitVote(${i})" ${submitted ? 'disabled' : ''}>${opt}</button>
            `).join('')}
          </div>
          ${submitted ? '<p class="arena-submitted-badge">Hlasováno</p>' : ''}
        </div>
        ${this.renderParticipantCount()}
      </div>
    `;
  }

  renderDisplayVote(activity, item) {
    return `
      <div class="arena-display-center">
        ${item ? `<h2 class="display-question-text">${item.text || item}</h2>` : ''}
        ${this.renderParticipantCount()}
      </div>
    `;
  }

  renderVoteReveal(activity, item) {
    const subs = selectors.submissionsForActivity(activity.id, store.state.activity.roundIndex);
    const options = activity.config.options || ['Ano', 'Ne'];
    const counts = options.map((_, i) => subs.filter(s => s.value === i).length);
    const total = subs.length || 1;
    const items = engine.getContentData(activity.config.items);
    const hasNext = store.state.activity.roundIndex < items.length - 1;

    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          ${item ? `<h3>${item.text || item}</h3>` : ''}
          <div class="vote-results-bars">
            ${options.map((opt, i) => `
              <div class="vote-result-row">
                <span class="vote-result-label">${opt}</span>
                <div class="vote-result-bar-track"><div class="vote-result-bar-fill" style="width:${Math.round((counts[i] / total) * 100)}%"></div></div>
                <span class="vote-result-count">${counts[i]}</span>
              </div>
            `).join('')}
          </div>
          ${store.state.isHostMode ? `
            <div class="arena-card-actions">
              ${hasNext ? `<button class="btn btn-accent" onclick="window._roomActions.nextRound(); window._engine.advance('instructions')">Další ${icons.arrowRight}</button>` :
                `<button class="btn btn-accent" onclick="window._engine.advance('results')">Výsledky ${icons.arrowRight}</button>`}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('vote', new VoteTemplate());

/* ==========================================================================
   TEMPLATE: SCENARIO — branching decisions / case workspace
   Used by: B2A1, B3A4, B3A5, B5A1, B5A5, B6A1, B6A3, B6A5
   ========================================================================== */
class ScenarioTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase) {
    const cases = engine.getContentData(activity.config.cases);
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderScenarioInstructions(activity, cases);
      case 'live': return activity.config.mode === 'branching' ? this.renderBranching(activity, cases) : this.renderCaseWorkspace(activity, cases);
      case 'reveal': return this.renderScenarioReveal(activity);
      default: return super.renderPhaseContent(activity, phase);
    }
  }

  renderScenarioInstructions(activity, cases) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>${activity.name}</h3>
          <p>${activity.brief}</p>
          <p>${cases.length > 0 ? `${cases.length} scénářů připraveno.` : '<em>Scénáře čekají na doplnění business týmem.</em>'}</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._engine.advance('live')">Začít ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderBranching(activity, nodes) {
    if (!nodes.length) return '<div class="arena-center"><p>Rozhodovací strom čeká na doplnění dat.</p></div>';
    const currentNodeId = store.state.activity._branchNode || nodes[0].id;
    const node = nodes.find(n => n.id === currentNodeId) || nodes[0];

    if (node.result) {
      const cls = node.result === 'success' ? 'result-success' : node.result === 'danger' ? 'result-danger' : 'result-warning';
      return `
        <div class="arena-center">
          <div class="arena-card arena-card--lg ${cls}">
            <h3>${node.text}</h3>
            <button class="btn btn-outline" onclick="window._resetBranching()">Začít znovu ${icons.refresh}</button>
            ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('reveal')">Pokračovat ${icons.arrowRight}</button>` : ''}
          </div>
        </div>
      `;
    }

    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>${node.question}</h3>
          <div class="scenario-options">
            ${(node.options || []).map(opt => `
              <button class="btn btn-outline btn-lg" onclick="window._branchTo('${opt.next}')">${opt.text}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderCaseWorkspace(activity, cases) {
    const currentCase = cases[store.state.activity.roundIndex] || cases[0];
    if (!currentCase) return '<div class="arena-center"><p>Data připravena k doplnění.</p></div>';
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <div class="case-header">
            <h3>${currentCase.name || currentCase.id}</h3>
            ${currentCase.type ? `<span class="case-type-badge">${currentCase.type}</span>` : ''}
          </div>
          ${currentCase.members ? `<p class="case-members">${currentCase.members}</p>` : ''}
          ${currentCase.risks ? `
            <div class="case-risks">
              <div class="case-label">Rizika</div>
              ${currentCase.risks.map(r => `<span class="case-risk-tag">${r}</span>`).join('')}
            </div>
          ` : ''}
          <textarea class="arena-input" placeholder="Vaše analýza a doporučení..." rows="4" id="case-input"></textarea>
          <button class="btn btn-accent" onclick="window._submitCase()">Odeslat ${icons.send}</button>
        </div>
      </div>
    `;
  }

  renderScenarioReveal(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Vyhodnocení</h3>
          <p>Lektor shrne klíčové body.</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('results')">Pokračovat ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('scenario', new ScenarioTemplate());

/* ==========================================================================
   TEMPLATE: ROLEPLAY — paired/group exercise with timer + structure
   Used by: B4A1-4, B5A2, B6A5, B7A1-2, B7A5
   ========================================================================== */
class RoleplayTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderRoleplayInstructions(activity);
      case 'live': return this.renderRoleplayLive(activity);
      case 'reveal': return this.renderRoleplayFeedback(activity);
      default: return super.renderPhaseContent(activity, phase);
    }
  }

  renderRoleplayInstructions(activity) {
    const cfg = activity.config;
    const roles = cfg.roles || ['Role A', 'Role B'];
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>${activity.name}</h3>
          <div class="roleplay-setup">
            <div class="roleplay-rounds">${cfg.rounds || 3} kol × ${cfg.timePerRound || 60}s</div>
            <div class="roleplay-roles">
              ${roles.map(r => `<span class="roleplay-role-tag">${r}</span>`).join('')}
            </div>
            <div class="roleplay-mode">${cfg.mode === 'speed-dating' ? 'Rotace po každém kole' : cfg.mode === 'triples' ? 'Trojice s pozorovatelem' : 'Párový režim'}</div>
          </div>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._startRoleplayRound()">Spustit kolo 1 ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderRoleplayLive(activity) {
    const cfg = activity.config;
    const roundIdx = store.state.activity.roundIndex;
    const prompts = engine.getContentData(cfg.prompts);
    const prompt = prompts[roundIdx] || prompts[0];
    const roles = cfg.roles || ['Role A', 'Role B'];

    return `
      <div class="arena-center">
        ${this.renderTimer()}
        <div class="arena-card arena-card--lg roleplay-live-card">
          <div class="roleplay-round-badge">Kolo ${roundIdx + 1} / ${cfg.rounds || 3}</div>
          ${prompt ? `
            <div class="roleplay-prompt">
              ${prompt.context ? `<div class="roleplay-context">${prompt.context}</div>` : ''}
              ${prompt.task ? `<div class="roleplay-task">${prompt.task}</div>` : `<div class="roleplay-task">${typeof prompt === 'string' ? prompt : 'Cvičení probíhá.'}</div>`}
            </div>
          ` : '<p class="roleplay-task">Cvičení probíhá – komunikujte s partnerem.</p>'}
          <div class="roleplay-roles-display">
            ${roles.map(r => `<span class="roleplay-active-role">${r}</span>`).join(' ⇄ ')}
          </div>
        </div>
      </div>
    `;
  }

  renderRoleplayFeedback(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Zpětná vazba</h3>
          <p>Ohodnoťte svého partnera.</p>
          <div class="feedback-scale">
            ${[1, 2, 3, 4, 5].map(n => `<button class="feedback-star" onclick="window._submitFeedback(${n})">${n}</button>`).join('')}
          </div>
          <textarea class="arena-input" placeholder="Konkrétní zpětná vazba..." rows="2" id="feedback-text"></textarea>
          <button class="btn btn-accent" onclick="window._submitRoleplayFeedback()">Odeslat ${icons.send}</button>
          ${store.state.isHostMode && store.state.activity.roundIndex < (activity.config.rounds || 3) - 1
            ? `<button class="btn btn-outline" onclick="window._startRoleplayRound()">Další kolo ${icons.arrowRight}</button>`
            : store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('results')">Výsledky ${icons.arrowRight}</button>` : ''
          }
        </div>
      </div>
    `;
  }
}
registerTemplate('roleplay', new RoleplayTemplate());

/* ==========================================================================
   TEMPLATE: FREE INPUT — text submission + shared wall
   Used by: B3A4, B8A1-5
   ========================================================================== */
class FreeInputTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderInputInstructions(activity);
      case 'live': return this.renderInputLive(activity);
      case 'reveal': return this.renderWall(activity);
      case 'results': return this.renderWall(activity);
      default: return super.renderPhaseContent(activity, phase);
    }
  }

  renderInputInstructions(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>${activity.name}</h3>
          <p class="arena-card-instruction">${activity.config.prompt}</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._engine.advance('live')">Otevřít zadávání ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderInputLive(activity) {
    const submitted = store.state.submissions.find(s => s.activityId === activity.id && s.participantId === store.state.localParticipantId);
    const limit = activity.config.charLimit || 300;
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <p class="arena-card-instruction">${activity.config.prompt}</p>
          ${submitted ? `
            <div class="arena-submitted-badge">${icons.check} Odesláno</div>
            <div class="freetext-submitted-text">${submitted.value}</div>
          ` : `
            <textarea class="arena-input arena-input--lg" placeholder="Napište zde..." rows="4" maxlength="${limit}" id="freetext-input"></textarea>
            <div class="char-counter"><span id="char-count">0</span> / ${limit}</div>
            <button class="btn btn-accent btn-lg" onclick="window._submitFreeText()">Odeslat ${icons.send}</button>
          `}
        </div>
        ${this.renderParticipantCount()}
      </div>
    `;
  }

  renderWall(activity) {
    const subs = selectors.submissionsForActivity(activity.id);
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--wide">
          <h3>Odpovědi skupiny</h3>
          <div class="wall-grid">
            ${subs.map(s => {
              const p = store.state.participants.find(p => p.id === s.participantId);
              return `
                <div class="wall-card">
                  <div class="wall-card-author">${p?.name || 'Anonym'}</div>
                  <div class="wall-card-text">${s.value}</div>
                </div>
              `;
            }).join('') || '<p>Zatím žádné příspěvky.</p>'}
          </div>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.end()">Ukončit aktivitu</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('freeInput', new FreeInputTemplate());

/* ==========================================================================
   TEMPLATE: AUCTION — budget allocation game
   Used by: B1A2
   ========================================================================== */
class AuctionTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderAuctionInstructions(activity);
      case 'live': return this.renderAuctionLive(activity);
      case 'reveal': return this.renderAuctionReveal(activity);
      default: return super.renderPhaseContent(activity, phase);
    }
  }

  renderAuctionInstructions(activity) {
    const budget = activity.config.budget || 300000;
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Týmová aukce oprav</h3>
          <p>Váš rozpočet: <strong>${formatKc(budget)}</strong></p>
          <p>Přidělte částky na jednotlivé opravy. Nepřekročte rozpočet.</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._engine.advance('live')">Spustit aukci ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderAuctionLive(activity) {
    const items = engine.getContentData(activity.config.items);
    const budget = activity.config.budget || 300000;
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <div class="auction-budget" id="auction-budget">Zbývá: ${formatKc(budget)}</div>
          <div class="auction-items">
            ${(items || []).map((item, i) => `
              <div class="auction-item">
                <span class="auction-item-name">${item.name || item}</span>
                <span class="auction-item-cost">${item.cost ? formatKc(item.cost) : '?'}</span>
                <input type="number" class="auction-bid-input" data-idx="${i}" placeholder="0" min="0" max="${budget}" step="5000" oninput="window._updateAuctionBudget()" />
              </div>
            `).join('') || '<p>Položky čekají na doplnění.</p>'}
          </div>
          <button class="btn btn-accent btn-lg" onclick="window._submitAuction()">Odeslat rozhodnutí ${icons.send}</button>
        </div>
      </div>
    `;
  }

  renderAuctionReveal(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Výsledky aukce</h3>
          <p>Lektor vyhodnotí rozhodnutí týmů.</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('results')">Pokračovat ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('auction', new AuctionTemplate());

/* ==========================================================================
   TEMPLATE: MATCHING — memory / pexeso game
   Used by: B1A3
   ========================================================================== */
class MatchingTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderMatchInstructions(activity);
      case 'live': return this.renderMatchLive(activity);
      case 'reveal': return this.renderMatchReveal(activity);
      default: return super.renderPhaseContent(activity, phase);
    }
  }

  renderMatchInstructions(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Pexeso: událost a dopad</h3>
          <p>Spárujte pojistné události s jejich finančním dopadem.</p>
          <p>Čas: ${activity.config.timeLimit || 90}s</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._startMatching()">Spustit ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderMatchLive(activity) {
    const pairs = engine.getContentData(activity.config.pairs);
    const allCards = [];
    (pairs || []).forEach((p, i) => {
      allCards.push({ id: `e${i}`, text: p.event, pairId: i, type: 'event' });
      allCards.push({ id: `i${i}`, text: p.impact, pairId: i, type: 'impact' });
    });
    // Shuffle
    for (let i = allCards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [allCards[i], allCards[j]] = [allCards[j], allCards[i]]; }

    return `
      <div class="arena-center">
        ${this.renderTimer()}
        <div class="arena-card arena-card--wide">
          <div class="matching-grid" id="matching-grid">
            ${allCards.map(c => `
              <button class="matching-card" data-id="${c.id}" data-pair="${c.pairId}" onclick="window._flipCard(this)">
                <span class="matching-card-front">?</span>
                <span class="matching-card-back">${c.text}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderMatchReveal(activity) {
    const pairs = engine.getContentData(activity.config.pairs);
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Správné páry</h3>
          <div class="matching-results">
            ${(pairs || []).map(p => `
              <div class="matching-pair-result">
                <span class="matching-event">${p.event}</span>
                <span class="matching-arrow">→</span>
                <span class="matching-impact">${p.impact}</span>
              </div>
            `).join('')}
          </div>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('results')">Pokračovat ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('matching', new MatchingTemplate());

/* ==========================================================================
   TEMPLATE: REVIEW — evaluate / critique / card battle
   Used by: B4A5, B5A2, B5A3, B5A5, B7A3
   ========================================================================== */
class ReviewTemplate extends BaseTemplate {
  renderPhaseContent(activity, phase) {
    switch (phase) {
      case 'intro': return this.renderIntro(activity);
      case 'instructions': return this.renderReviewInstructions(activity);
      case 'live': return this.renderReviewLive(activity);
      case 'reveal': return this.renderReviewResults(activity);
      default: return super.renderPhaseContent(activity, phase);
    }
  }

  renderReviewInstructions(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>${activity.name}</h3>
          <p>${activity.brief}</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent btn-lg" onclick="window._engine.advance('live')">Začít hodnocení ${icons.play}</button>` : '<p class="arena-waiting">Čekejte na start...</p>'}
        </div>
      </div>
    `;
  }

  renderReviewLive(activity) {
    const items = engine.getContentData(activity.config.items);
    const currentItem = items[store.state.activity.roundIndex] || items[0];
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          ${currentItem ? `
            <h3>${currentItem.name || currentItem.title || 'Položka k hodnocení'}</h3>
            <p>${currentItem.desc || currentItem.text || ''}</p>
          ` : '<p>Položky čekají na doplnění.</p>'}
          <div class="review-scale">
            ${[1, 2, 3, 4, 5].map(n => `<button class="review-score-btn" onclick="window._submitReview(${n})">${n}</button>`).join('')}
          </div>
          <textarea class="arena-input" placeholder="Komentář (volitelné)..." rows="2" id="review-comment"></textarea>
          <button class="btn btn-accent" onclick="window._submitReviewFull()">Odeslat hodnocení ${icons.send}</button>
        </div>
      </div>
    `;
  }

  renderReviewResults(activity) {
    return `
      <div class="arena-center">
        <div class="arena-card arena-card--lg">
          <h3>Shrnutí hodnocení</h3>
          <p>Lektor komentuje výsledky.</p>
          ${store.state.isHostMode ? `<button class="btn btn-accent" onclick="window._engine.advance('results')">Pokračovat ${icons.arrowRight}</button>` : ''}
        </div>
      </div>
    `;
  }
}
registerTemplate('review', new ReviewTemplate());

/* ==========================================================================
   TEMPLATE LOOKUP — export
   ========================================================================== */
export { templateRegistry };
