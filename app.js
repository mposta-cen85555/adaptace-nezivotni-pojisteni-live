/**
 * app.js – Adaptační den: Neživotní pojištění (ČS)
 * Chapter-based flow UI – vanilla JS
 *
 * TODO: Supabase – inicializace klienta a real-time room code
 * TODO: Supabase – autentizace host mode vs participant mode
 */

'use strict';

/* ==========================================================================
   DATA – 8 bloků agendy
   ========================================================================== */
const agendaData = [
  {
    id: 1,
    time: '09:00–09:45',
    name: 'Úvod do reality škod a mindset',
    durationMin: 45,
    activeRatio: '80 % aktivně',
    goal: 'Ukázat finanční dopad pojistných událostí, pracovat s odhadem nákladů a navázat na principy POSTOJ.',
    recommendedActivity: 'HTML slider na odhad škod (interaktivní mockup)',
    activities: [
      'HTML slider na odhad škod (interaktivní mockup)',
      'Týmová aukce oprav',
      'Pexeso událost/dopad',
      'Obhajoba platby ze svého',
      'Rychlý kvíz s daty',
    ],
    important: 'Pracovat s emocí – přimět účastníky cítit reálný finanční dopad bez pojištění. Neříkat čísla napřed – nechat odhadnout.',
    remember: 'Připravit reálné výše škod z pojistných událostí ČS (záplava bytu 180 000 Kč, požár garsonky 420 000 Kč). Slider musí být viditelný celé skupině.',
    role: 'Moderátor diskuse – sbírá odhady, komentuje rozdíly, navazuje na princip POSTOJ.',
    lecturerNote: 'Typická chyba: lektor řekne čísla příliš brzy. Drž napětí – nech skupinu hádat aspoň 2 minuty. Reakce na podhodnocení: „To by tedy nestačilo ani na střechu..."',
    hasMockup: 'damage-slider',
  },
  {
    id: 2,
    time: '09:45–10:30',
    name: 'Mapa rizik a parametrů v praxi',
    durationMin: 45,
    activeRatio: '70 % aktivně',
    goal: 'Orientace v parametrech pojištění, práce s modelovými rodinami, riziky a produktovými taháky.',
    recommendedActivity: 'Klientské složky 3 rodin',
    activities: [
      'Klientské složky 3 rodin',
      'Hledání argumentů pro likvidátora',
      'Časovka s definicemi',
      'Vizuální mapa z kartiček',
      'Terče krytí a výluk',
    ],
    important: 'Propojit abstraktní parametry s konkrétní rodinou – Novákovi, Svobodovi, Horáčkovi. Každá rodina má jiný typ nemovitosti a jiná rizika.',
    remember: 'Připravit klientské složky (fyzické nebo digitální). Časovka – max 90 sekund na definici.',
    role: 'Průvodce mapou rizik – komentuje výběry týmů, upozorňuje na přehlížená rizika.',
    lecturerNote: 'Novákovi = panelák 3+1, Svobodovi = rodinný dům se zahradou, Horáčkovi = chalupa + pronájem bytu. Každá rodina má jiná rizika – Horáčkovi mají odpovědnost pronajímatele!',
    hasMockup: null,
  },
  {
    id: 3,
    time: '10:45–11:30',
    name: 'Kdo nese odpovědnost?',
    durationMin: 45,
    activeRatio: '85 % aktivně',
    goal: 'Rozlišit občanskou odpovědnost, odpovědnost z nemovitosti a výluky na reálných případech.',
    recommendedActivity: 'Tinder-swipe situací (interaktivní mockup – přepínač typu situace)',
    activities: [
      'Tinder-swipe situací (interaktivní mockup – přepínač typu situace)',
      'Kinetická hra v rozích',
      'Hlasování barevnými kartami',
      'Tvorba hraničních případů',
      'Analýza vůči konkurenci',
    ],
    important: 'Hranice mezi odpovědností z nemovitosti a občanskou odpovědností je pro klienty nejasná – trénovat ji na reálných příkladech.',
    remember: 'Přichystat sadu situačních karet. Kinetická hra potřebuje prostor – připravit rohy místnosti.',
    role: 'Soudce – nechá skupinu rozhodnout, pak vysvětlí správné řešení a výluky.',
    lecturerNote: 'Nejčastější záměna: odpovědnost nájemce vs. vlastníka bytu. Připravit případ „prasklé potrubí v bytě pronajímatele" – kdo platí?',
    hasMockup: 'responsibility',
  },
  {
    id: 4,
    time: '11:30–12:00',
    name: 'Přechod k nabídce (FIT → Hades)',
    durationMin: 30,
    activeRatio: '90 % aktivně',
    goal: 'Natrénovat přechodovou frázi a přirozený vstup do nabídky v systému.',
    recommendedActivity: 'Buddy dril přechodové věty',
    activities: [
      'Buddy dril přechodové věty',
      'Ping-pong frází',
      'Trénink s pospíchajícím klientem',
      'Slepý rozhovor bez monitoru',
      'Analýza videoukázek',
    ],
    important: 'Přechod FIT → Hades musí být přirozený, ne robotický. Klíčová věta: „Na základě toho, co jste mi řekl, bych vám rád ukázal, jak by to vypadalo konkrétně pro vás."',
    remember: 'Mít připravené videoukázky – dobrá a špatná verze přechodu. Buddy drill – každý si musí vyzkoušet obě role.',
    role: 'Trenér – dává feedback na přirozenost a plynulost přechodu.',
    lecturerNote: 'Typická chyba: „Takže teď vám ukážu systém Hades..." – příliš technické. Správně: navázat na potřebu klienta, ne na systém.',
    hasMockup: null,
  },
  {
    id: 5,
    time: '12:45–13:45',
    name: 'Modelování nabídek v systému',
    durationMin: 60,
    activeRatio: '95 % aktivně',
    goal: 'Tvořit reálné nabídky pro klientské rodiny, reagovat na změnu zadání a odbourat strach ze systému.',
    recommendedActivity: 'Modelování zadání 3 rodin',
    activities: [
      'Modelování zadání 3 rodin',
      'Štafeta s prohozením rolí',
      'Audit hotových nabídek',
      'Poskládání řešení do rozpočtu',
      'Modelování s náhlou změnou',
    ],
    important: 'Jde o práci v systému Hades – ne jen o teorii. Každý účastník musí sám vytvořit alespoň jednu nabídku. Chyba v systému = učení, ne selhání.',
    remember: 'Zajistit přístup do testovacího prostředí Hades pro všechny. Záložní varianta: modelování na papírových formulářích.',
    role: 'Kouč u systému – obchází, pomáhá, neopravuje za účastníka.',
    lecturerNote: 'Největší strach účastníků: „Rozbiju to." Ukázat, že testovací prostředí je bezpečné – žádná data se neukládají do produkce.',
    hasMockup: null,
  },
  {
    id: 6,
    time: '13:45–14:30',
    name: 'Práce se stávajícími smlouvami',
    durationMin: 45,
    activeRatio: '75 % aktivně',
    goal: 'Pochopit lhůty, výročí, výpovědi a bezpečný přechod klienta bez penále.',
    recommendedActivity: 'Časová osa výpovědí z karet (interaktivní mockup – decision tree)',
    activities: [
      'Časová osa výpovědí z karet (interaktivní mockup – decision tree)',
      'Lhůty ve starých smlouvách',
      'Rozhodovací strom digitálně',
      'Řešení pohotovostních dotazů',
      'Navigace klienta po telefonu',
    ],
    important: 'Zákonné lhůty jsou pevné – chyba v načasování výpovědi = ztráta klienta nebo penále. Důraz na výroční datum smlouvy jako klíčový moment.',
    remember: 'Připravit vzorové smlouvy s různými výročími. Rozhodovací strom – vytisknout nebo mít digitálně na sdílené obrazovce.',
    role: 'Průvodce procesem – upozorňuje na rizika špatného načasování.',
    lecturerNote: 'Klíčová lhůta: výpověď musí být doručena pojistiteli nejméně 6 týdnů před výročím. Nejčastější chyba: účastník řekne klientovi výpovědní datum, ale zapomene na doručení.',
    hasMockup: 'decision-tree',
  },
  {
    id: 7,
    time: '14:45–15:45',
    name: 'Obchodní rozhovor a námitky',
    durationMin: 60,
    activeRatio: '90 % aktivně',
    goal: 'Trénovat argumentaci nad hotovou modelací, reagovat na námitky cena/konkurence a obhajovat kvalitu krytí.',
    recommendedActivity: 'Speed-dating s námitkami (interaktivní mockup – karta s námitkou a polem „doporučená reakce")',
    activities: [
      'Rozhovory ve trojicích s checklistem',
      'Speed-dating s námitkami (interaktivní mockup – karta s námitkou)',
      'Vyjednávání nad kartami argumentů',
      'Obhajoba nabídky před skupinou',
      'Řešení námitek od lektora',
    ],
    important: 'Námitky na cenu a konkurenci jsou nejčastější – na ty se soustředit. Argumentovat kvalitou krytí, ne slevou.',
    remember: 'Připravit 10 nejčastějších námitek z praxe. Speed-dating – každý musí projít min. 3 různé námitky.',
    role: 'Náročný klient – simuluje reálné námitky, dává feedback po každém kole.',
    lecturerNote: 'Nejsilnější argument proti ceně: srovnat roční pojistné s průměrnou škodou. „Za 4 800 Kč ročně = 400 Kč měsíčně vám kryjeme škodu až 2 miliony."',
    hasMockup: 'objections',
  },
  {
    id: 8,
    time: '15:45–16:00',
    name: 'Závěrečná reflexe a akční plán',
    durationMin: 15,
    activeRatio: '100 % aktivně',
    goal: 'Uzavřít den jedním konkrétním cílem a jednou věcí, kterou účastník zkusí hned druhý den v praxi.',
    recommendedActivity: 'Sdílení 1 klíčové věci v kruhu',
    activities: [
      'Sdílení 1 klíčové věci v kruhu',
      'Písemný akční plán na kartičce',
      'Párový závazek – řekni kolegovi',
      'Digitální výstup – odešli si e-mail',
      'Skupinový flipchart závazků',
    ],
    important: 'Konkrétnost – ne „budu lépe komunikovat", ale „příští týden se zeptám každého klienta na nemovitost".',
    remember: 'Každý účastník odchází s písemným akčním plánem (kartička nebo digitální výstup).',
    role: 'Svědek – drží prostor, neopravuje, podporuje konkrétnost.',
    lecturerNote: 'Pokud skupina mlčí – začni sám. Sdílej svůj závazek jako lektor. Tím otevřeš prostor pro ostatní.',
    hasMockup: null,
  },
];

/* ==========================================================================
   APP STATE
   ========================================================================== */
const state = {
  currentChapter: 0,           // 0 = cover, 1 = map, 2-9 = blocks, 10 = closing
  totalChapters: 11,           // 0..10
  doneBlocks: new Set(),
  isHostMode: false,
  isProjectionMode: false,
  timers: {},
};

/* ==========================================================================
   HELPERS
   ========================================================================== */
function formatKc(value) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(value);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getActiveBlockId() {
  const now = new Date();
  const hm = now.getHours() * 60 + now.getMinutes();
  const schedule = [
    { id: 1, start: 540, end: 585 },
    { id: 2, start: 585, end: 630 },
    { id: 3, start: 645, end: 690 },
    { id: 4, start: 690, end: 720 },
    { id: 5, start: 765, end: 825 },
    { id: 6, start: 825, end: 870 },
    { id: 7, start: 885, end: 945 },
    { id: 8, start: 945, end: 960 },
  ];
  for (const s of schedule) {
    if (hm >= s.start && hm < s.end) return s.id;
  }
  return null;
}

/** Map chapter index (0-10) to a label */
function chapterLabel(idx) {
  if (idx === 0) return 'Úvod';
  if (idx === 1) return 'Mapa dne';
  if (idx >= 2 && idx <= 9) return `Blok ${idx - 1} / 8`;
  if (idx === 10) return 'Závěr';
  return '';
}

/* ==========================================================================
   RENDER – HEADER PROGRESS DOTS
   ========================================================================== */
function renderHeaderDots() {
  const container = document.getElementById('header-progress');
  if (!container) return;
  let html = '';
  for (let i = 0; i < state.totalChapters; i++) {
    const isCurrent = i === state.currentChapter;
    const isDone = i >= 2 && i <= 9 && state.doneBlocks.has(i - 1);
    const cls = isCurrent ? 'is-current' : isDone ? 'is-done' : '';
    html += `<button class="header-dot ${cls}" aria-label="${chapterLabel(i)}" onclick="goToChapter(${i})"></button>`;
  }
  container.innerHTML = html;
}

/* ==========================================================================
   RENDER – MAP SCREEN
   ========================================================================== */
function renderMap() {
  const container = document.getElementById('map-grid');
  if (!container) return;
  const activeId = getActiveBlockId();
  container.innerHTML = agendaData.map(block => {
    const isActive = block.id === activeId;
    const isDone = state.doneBlocks.has(block.id);
    const chapterIdx = block.id + 1; // blocks are chapters 2-9
    return `
      <div
        class="map-tile${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}"
        role="listitem"
        onclick="goToChapter(${chapterIdx})"
        tabindex="0"
        aria-label="Kapitola ${block.id}: ${block.name}"
      >
        <div class="map-tile-num">${block.id}</div>
        <div class="map-tile-main">
          <div class="map-tile-time">${block.time}</div>
          <div class="map-tile-name">${block.name}</div>
          <div class="map-tile-goal">${block.goal}</div>
        </div>
        <div class="map-tile-meta">
          <div class="map-tile-duration">${block.durationMin} min</div>
          <div class="map-tile-ratio">${block.activeRatio}</div>
        </div>
        <svg class="map-tile-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    `;
  }).join('');
}

/* ==========================================================================
   RENDER – BLOCK CHAPTER SCREENS
   ========================================================================== */
function renderBlockChapters() {
  const container = document.getElementById('block-chapters');
  if (!container) return;
  const activeId = getActiveBlockId();
  container.innerHTML = agendaData.map(block => {
    const chapterIdx = block.id + 1;
    return `
      <section
        class="chapter chapter--block"
        id="chapter-block-${block.id}"
        data-chapter="${chapterIdx}"
        aria-labelledby="block-screen-title-${block.id}"
      >
        <div class="block-screen">
          <div class="block-screen-num">Kapitola ${block.id} / 8</div>
          <div class="block-screen-time">${block.time}</div>
          <h2 class="block-screen-title" id="block-screen-title-${block.id}">${block.name}</h2>
          <p class="block-screen-goal">${block.goal}</p>

          <div class="block-screen-meta">
            <span class="block-meta-pill">${block.durationMin} min</span>
            <span class="block-meta-pill">${block.activeRatio}</span>
            ${block.id === activeId ? '<span class="block-meta-pill" style="background:#FFF8F0;color:#E65100">▶ Právě teď</span>' : ''}
          </div>

          <!-- Timer – host only -->
          <div class="block-screen-timer" onclick="event.stopPropagation()">
            <span class="timer-display" id="timer-display-${block.id}">${formatTime(block.durationMin * 60)}</span>
            <button class="btn btn-sm btn-outline" onclick="timerAction('start', ${block.id})" aria-label="Spustit">▶</button>
            <button class="btn btn-sm btn-ghost" onclick="timerAction('stop', ${block.id})" aria-label="Stop">⏸</button>
            <button class="btn btn-sm btn-ghost" onclick="timerAction('reset', ${block.id})" aria-label="Reset">↺</button>
          </div>

          <div class="block-screen-activity">
            <div class="block-screen-activity-label">Doporučená aktivita</div>
            <div class="block-screen-activity-name">${block.recommendedActivity}</div>
          </div>

          <div class="block-screen-actions">
            <button class="btn-detail" onclick="openDetail(${block.id})" aria-label="Zobrazit detail bloku ${block.id}">
              Zobrazit detail
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>

          <!-- Done checkbox – host only -->
          <label class="block-screen-done">
            <input
              type="checkbox"
              class="block-done-checkbox"
              id="done-${block.id}"
              ${state.doneBlocks.has(block.id) ? 'checked' : ''}
              aria-label="Označit blok ${block.id} jako splněný"
              onchange="toggleDone(${block.id}, this.checked)"
            />
            <span>Blok splněn</span>
          </label>
        </div>
      </section>
    `;
  }).join('');
}

/* ==========================================================================
   DETAIL DRAWER CONTENT
   ========================================================================== */
function openDetail(blockId) {
  const block = agendaData.find(b => b.id === blockId);
  if (!block) return;
  const drawer = document.getElementById('detail-drawer');
  const backdrop = document.getElementById('detail-backdrop');
  const inner = document.getElementById('detail-drawer-inner');
  if (!drawer || !inner) return;

  inner.innerHTML = `
    <div class="detail-section-title">Kapitola ${block.id}</div>
    <h2 class="detail-block-title">${block.name}</h2>
    <div class="detail-block-time">${block.time} · ${block.durationMin} minut · ${block.activeRatio}</div>

    <div class="detail-section-title">Aktivity</div>
    <div class="detail-activity-tabs" role="tablist">
      <button class="detail-activity-tab is-active" onclick="switchDetailActivity(${block.id}, 'recommended', this)" role="tab" aria-selected="true">Doporučená</button>
      <button class="detail-activity-tab" onclick="switchDetailActivity(${block.id}, 'all', this)" role="tab" aria-selected="false">Všechny varianty</button>
    </div>
    <div id="detail-rec-${block.id}">
      <div class="detail-recommended">
        <div class="detail-recommended-label">Doporučená aktivita</div>
        <div class="detail-recommended-name">${block.recommendedActivity}</div>
      </div>
    </div>
    <div id="detail-all-${block.id}" style="display:none">
      <div class="detail-all-activities">
        ${block.activities.map((act, i) => `
          <div class="detail-act-item${i === 0 ? ' is-recommended' : ''}">
            <span class="detail-act-num">${i + 1}</span>
            <span>${act}${i === 0 ? ' <em>(doporučeno)</em>' : ''}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="detail-section-title">Důležité informace</div>
    <div class="detail-info-grid">
      <div class="detail-info-box detail-info-important">
        <div class="detail-info-box-title">Co je důležité</div>
        <div>${block.important}</div>
      </div>
      <div class="detail-info-box detail-info-remember">
        <div class="detail-info-box-title">Na co nezapomenout</div>
        <div>${block.remember}</div>
      </div>
      <div class="detail-info-box detail-info-role">
        <div class="detail-info-box-title">Role lektora</div>
        <div>${block.role}</div>
      </div>
    </div>

    <div class="detail-lecturer-note">
      <button class="lecturer-note-toggle" aria-expanded="false" aria-controls="detail-lnote-${block.id}" onclick="toggleLecturerNote(${block.id}, this)">🔒 Lektorská poznámka</button>
      <div class="lecturer-note-content" id="detail-lnote-${block.id}">${block.lecturerNote}</div>
    </div>

    ${block.hasMockup ? renderMockup(block) : ''}
  `;

  drawer.hidden = false;
  backdrop.hidden = false;
  requestAnimationFrame(() => {
    drawer.classList.add('is-open');
  });
  drawer.scrollTop = 0;
}

function closeDetail() {
  const drawer = document.getElementById('detail-drawer');
  const backdrop = document.getElementById('detail-backdrop');
  if (!drawer) return;
  drawer.classList.remove('is-open');
  setTimeout(() => {
    drawer.hidden = true;
    if (backdrop) backdrop.hidden = true;
  }, 350);
}

function switchDetailActivity(blockId, mode, btn) {
  const rec = document.getElementById(`detail-rec-${blockId}`);
  const all = document.getElementById(`detail-all-${blockId}`);
  const tabs = btn.closest('.detail-activity-tabs').querySelectorAll('.detail-activity-tab');
  tabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
  btn.classList.add('is-active');
  btn.setAttribute('aria-selected', 'true');
  if (mode === 'recommended') { rec.style.display = ''; all.style.display = 'none'; }
  else { rec.style.display = 'none'; all.style.display = ''; }
}

/* ==========================================================================
   MOCKUPS
   ========================================================================== */
function renderMockup(block) {
  switch (block.hasMockup) {
    case 'damage-slider':  return renderDamageSliderMockup(block.id);
    case 'responsibility': return renderResponsibilityMockup(block.id);
    case 'decision-tree':  return renderDecisionTreeMockup(block.id);
    case 'objections':     return renderObjectionsMockup(block.id);
    default: return '';
  }
}

/* -- Blok 1: Slider -- */
const damageEvents = [
  { label: 'Záplava bytu', desc: 'Přízemní byt 2+kk v panelovém domě, zatopení po havárii potrubí – voda v celém bytě.', real: 180000, comment: 'Průměrná škoda při záplavě bytu: výměna podlah, sušení zdí, oprava elektroinstalace a vybavení.' },
  { label: 'Požár garsonky', desc: 'Garsonka 28 m², požár zaviněný vadnou elektronikou – kompletní vyhoření.', real: 420000, comment: 'Celková obnova po požáru zahrnuje stavební práce, nové vybavení, výmalbu a spotřebiče.' },
  { label: 'Krádež vybavení', desc: 'Vloupání do bytu 3+1 – odcizena elektronika, šperky a hotovost.', real: 95000, comment: 'Průměrná hodnota odcizených věcí při vloupání do bytu v ČR.' },
];

function renderDamageSliderMockup(blockId) {
  return `
    <div class="mockup-section">
      <div class="mockup-label">Interaktivní mockup – Odhad škody</div>
      <div class="mockup-card">
        <div class="damage-event-switcher" role="group" aria-label="Výběr pojistné události">
          ${damageEvents.map((ev, i) => `
            <button class="damage-event-btn${i === 0 ? ' is-active' : ''}" onclick="selectDamageEvent(${i})" aria-pressed="${i === 0}">${ev.label}</button>
          `).join('')}
        </div>
        <p class="damage-event-desc" id="damage-event-desc">${damageEvents[0].desc}</p>
        <p class="damage-slider-label">Odhadněte výši škody:</p>
        <input type="range" id="damage-slider" class="damage-slider" min="0" max="500000" step="5000" value="50000" aria-label="Odhad škody v Kč" oninput="updateDamageEstimate(this.value)" />
        <div class="damage-estimate-display" id="damage-estimate-display" aria-live="polite">${formatKc(50000)}</div>
        <button class="btn btn-primary" onclick="revealDamage()" aria-expanded="false" aria-controls="damage-reveal-result">Odhalit reálnou škodu</button>
        <div class="damage-reveal-result" id="damage-reveal-result" aria-live="polite">
          <div class="damage-real-value" id="damage-real-value"></div>
          <div class="damage-comment" id="damage-comment"></div>
        </div>
      </div>
    </div>
  `;
}

/* -- Blok 3: Odpovědnost -- */
const situations = [
  { title: 'Záplava sousedního bytu', desc: 'Vám přetekla vana – voda zatekla do bytu souseda pod vámi a poškodila jeho nábytek a podlahy.', question: 'Kdo nese odpovědnost za škodu?', answerType: 'Občanská odpovědnost (pojištění domácnosti)', answerText: 'Škodu na sousedově majetku hradí vaše pojištění občanské odpovědnosti v rámci pojištění domácnosti. Klíčové: musíte mít toto krytí sjednáno.' },
  { title: 'Pes pokousal sousedovo dítě', desc: 'Váš pes na zahradě rodinného domu pokousal dítě souseda. Dítě muselo na ošetření.', question: 'Kdo nese odpovědnost a jaký typ pojištění kryje tuto škodu?', answerType: 'Občanská odpovědnost – pojištění domácnosti', answerText: 'Odpovídáte jako vlastník psa. Škodu (ošetření, případná bolestná) kryje pojištění odpovědnosti v rámci pojištění domácnosti. Bez tohoto krytí platíte z vlastní kapsy.' },
  { title: 'Strom padl na auto souseda', desc: 'Ze svého pozemku vám padl strom na auto zaparkovaného souseda. Strom byl starý, ale formálně zdravý.', question: 'Kdo hradí škodu na autě?', answerType: 'Odpovědnost z nemovitosti (pojištění nemovitosti)', answerText: 'Jako vlastník pozemku odpovídáte za škody způsobené stromem. Kryje pojištění odpovědnosti vlastníka nemovitosti. Důležité: týká se jen vaší nemovitosti a pozemku.' },
  { title: 'Dítě rozbilo okno souseda', desc: 'Vaše dítě (10 let) hrálo fotbal a rozbilo okno souseda. Soused žádá náhradu škody.', question: 'Kdo nese odpovědnost za rozbité okno?', answerType: 'Občanská odpovědnost – pojištění domácnosti (rodičovská odpovědnost)', answerText: 'Rodiče odpovídají za škody způsobené nezletilými dětmi. Pojištění odpovědnosti v rámci pojištění domácnosti kryje i tuto situaci, pokud je sjednána rodičovská odpovědnost.' },
];

function renderResponsibilityMockup(blockId) {
  return `
    <div class="mockup-section">
      <div class="mockup-label">Interaktivní mockup – Kdo nese odpovědnost?</div>
      <div class="mockup-card" data-current="0">
        <div class="situation-counter" id="situation-counter" aria-live="polite">Situace 1 z ${situations.length}</div>
        ${situations.map((s, i) => `
          <div class="situation-card" id="situation-${i}" style="${i > 0 ? 'display:none' : ''}">
            <div class="situation-title">${s.title}</div>
            <p class="situation-desc">${s.desc}</p>
            <p class="situation-question"><strong>${s.question}</strong></p>
            <button class="btn btn-outline" onclick="revealSituation(${i})" id="situation-reveal-btn-${i}" aria-expanded="false" aria-controls="situation-answer-${i}">Zobrazit odpověď</button>
            <div class="situation-answer" id="situation-answer-${i}" aria-live="polite">
              <div class="situation-answer-type">${s.answerType}</div>
              <p>${s.answerText}</p>
            </div>
          </div>
        `).join('')}
        <div class="situation-nav">
          <button class="btn btn-outline" onclick="prevSituation()">← Předchozí</button>
          <button class="btn btn-primary" onclick="nextSituation()">Další →</button>
        </div>
      </div>
    </div>
  `;
}

/* -- Blok 6: Decision tree -- */
function renderDecisionTreeMockup(blockId) {
  return `
    <div class="mockup-section">
      <div class="mockup-label">Interaktivní mockup – Rozhodovací strom výpovědi</div>
      <div class="mockup-card">
        <div class="dt-step is-active" id="dt-step-0">
          <p class="dt-question">Chce klient přejít k pojištění ČS od jiného pojistitele?</p>
          <div class="dt-buttons">
            <button class="btn btn-primary" onclick="dtGo(1)">Ano, chce přejít</button>
            <button class="btn btn-outline" onclick="dtGo('no-intent')">Ne / Nejasné</button>
          </div>
        </div>
        <div class="dt-step" id="dt-step-1">
          <p class="dt-question">Zjistil/a jsi datum výročí stávající smlouvy klienta?</p>
          <div class="dt-buttons">
            <button class="btn btn-primary" onclick="dtGo(2)">Ano, datum znám</button>
            <button class="btn btn-outline" onclick="dtGo('find-anniversary')">Ne, zjistím ho</button>
          </div>
        </div>
        <div class="dt-step" id="dt-step-2">
          <p class="dt-question">Je výročí smlouvy za více než 6 týdnů od dnešního dne?</p>
          <div class="dt-buttons">
            <button class="btn btn-success" onclick="dtGo('ok-termination')">Ano – výročí je dál</button>
            <button class="btn btn-danger" onclick="dtGo(3)">Ne – výročí je brzy</button>
          </div>
        </div>
        <div class="dt-step" id="dt-step-3">
          <p class="dt-question">Existuje důvod pro mimořádnou výpověď? (pojistná událost, změna podmínek)</p>
          <div class="dt-buttons">
            <button class="btn btn-primary" onclick="dtGo('ok-extraordinary')">Ano – existuje důvod</button>
            <button class="btn btn-outline" onclick="dtGo('wait-next')">Ne – žádný důvod</button>
          </div>
        </div>
        <div class="dt-step" id="dt-step-ok-termination">
          <div class="dt-result ok"><span class="dt-result-icon">✅</span><div><div class="dt-result-text">Lze podat výpověď ke konci pojistného období</div><p class="dt-result-sub">Výpověď musí být doručena pojistiteli nejméně 6 týdnů před výročím. Podat písemně s dostatečnou rezervou.</p></div></div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-ok-extraordinary">
          <div class="dt-result warn"><span class="dt-result-icon">⚠️</span><div><div class="dt-result-text">Mimořádná výpověď je možná – ověřit podmínky</div><p class="dt-result-sub">Výpověď z důvodu pojistné události musí být podána do 1 měsíce. Nutné doložit důvod.</p></div></div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-wait-next">
          <div class="dt-result no"><span class="dt-result-icon">🔴</span><div><div class="dt-result-text">Výpověď nyní není možná – čekat na příští výročí</div><p class="dt-result-sub">Informuj klienta o výročním datu. Nastav připomínku 8 týdnů předem.</p></div></div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-no-intent">
          <div class="dt-result warn"><span class="dt-result-icon">⚠️</span><div><div class="dt-result-text">Záměr není jasný – vrátit se k potřebám klienta</div><p class="dt-result-sub">Zjisti, proč klient zvažuje přechod. Bez jasného záměru nemá smysl řešit lhůty.</p></div></div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-find-anniversary">
          <div class="dt-result warn"><span class="dt-result-icon">📅</span><div><div class="dt-result-text">Zjisti datum výročí smlouvy</div><p class="dt-result-sub">Požádej klienta o smlouvu. Datum výročí je klíčové – bez něj nelze pokračovat.</p></div></div>
          <div class="dt-buttons" style="margin-top:12px">
            <button class="btn btn-primary" onclick="dtGo(2)">Datum zjištěno – pokračovat</button>
            <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* -- Blok 7: Námitky -- */
const objections = [
  { text: 'To je příliš drahé.', type: 'price', typeLabel: 'Cena', response: 'Rozumím, cena je důležitá. Pojďme se podívat, co za tyto peníze dostanete. Roční pojistné činí cca 4 800 Kč – to je 400 Kč měsíčně. Za to máte krytou škodu až 2 miliony korun. Srovnejte to s cenou jediné opravy po záplavě: průměrně 180 000 Kč.' },
  { text: 'U konkurence mám lepší cenu.', type: 'competition', typeLabel: 'Konkurence', response: 'To je možné. Podívejme se ale na to, co přesně ta nabídka kryje. Klíčové není jen cena, ale šíře krytí – například pojištění odpovědnosti, živelní škody nebo asistenční služby. Mohu vám ukázat konkrétní srovnání?' },
  { text: 'Pojištění nepotřebuji, nikdy se mi nic nestalo.', type: 'postpone', typeLabel: 'Odmítnutí', response: 'To je dobrá zpráva. Pojištění funguje přesně tak – platíte za to, abyste při nehodě nezůstal bez prostředků. Průměrná škoda při vloupání je 95 000 Kč, při požáru přes 400 000 Kč. Kolik byste byl ochoten zaplatit z vlastní kapsy?' },
  { text: 'Manžel/ka to musí schválit.', type: 'authority', typeLabel: 'Autorita', response: 'To chápu, jde o společné rozhodnutí. Mohu vám připravit nabídku ve formě, kterou snadno ukážete partnerovi/ce? Shrnutí na jednu stranu s klíčovými body.' },
  { text: 'Zavolám vám příští týden.', type: 'postpone', typeLabel: 'Odkládání', response: 'Samozřejmě, nechci vás tlačit. Mohu se zeptat – je něco konkrétního, co vás zastavuje? Chci se ujistit, že máte všechny informace. Rád si rezervuji čas přímo teď.' },
];

function renderObjectionsMockup(blockId) {
  return `
    <div class="mockup-section">
      <div class="mockup-label">Interaktivní mockup – Karta námitky</div>
      <div class="mockup-card" data-current="0">
        <div class="objection-counter" id="objection-counter" aria-live="polite">Námitka 1 z ${objections.length}</div>
        ${objections.map((obj, i) => `
          <div class="objection-card" id="objection-${i}" style="${i > 0 ? 'display:none' : ''}">
            <span class="objection-type ${obj.type}">${obj.typeLabel}</span>
            <div class="objection-text">"${obj.text}"</div>
            <button class="btn btn-outline" onclick="revealObjection(${i})" id="objection-reveal-btn-${i}" aria-expanded="false" aria-controls="objection-response-${i}">Zobrazit doporučenou reakci</button>
            <div class="objection-response" id="objection-response-${i}" aria-live="polite">${obj.response}</div>
          </div>
        `).join('')}
        <div class="objection-nav">
          <button class="btn btn-outline" onclick="prevObjection()">← Předchozí</button>
          <button class="btn btn-primary" onclick="nextObjection()">Další →</button>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   CHAPTER NAVIGATION
   ========================================================================== */
function getAllChapters() {
  return document.querySelectorAll('[data-chapter]');
}

function goToChapter(idx) {
  if (idx < 0 || idx >= state.totalChapters) return;
  state.currentChapter = idx;
  const chapters = getAllChapters();
  if (chapters[idx]) {
    chapters[idx].scrollIntoView({ behavior: 'smooth' });
  }
  updateNav();
}

function nextChapter() {
  goToChapter(state.currentChapter + 1);
}

function prevChapter() {
  goToChapter(state.currentChapter - 1);
}

function updateNav() {
  const label = document.getElementById('chapter-nav-label');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');
  if (label) label.textContent = chapterLabel(state.currentChapter);
  if (prevBtn) prevBtn.disabled = state.currentChapter <= 0;
  if (nextBtn) nextBtn.disabled = state.currentChapter >= state.totalChapters - 1;
  renderHeaderDots();
  updateHeaderBar();
}

function updateHeaderBar() {
  const pct = Math.round((state.currentChapter / (state.totalChapters - 1)) * 100);
  const fill = document.getElementById('header-bar-fill');
  if (fill) {
    fill.style.width = pct + '%';
    fill.setAttribute('aria-valuenow', pct);
  }
}

/* ==========================================================================
   SCROLL OBSERVER – detect which chapter is in view
   ========================================================================== */
function initScrollObserver() {
  const chapters = getAllChapters();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
        const idx = parseInt(entry.target.dataset.chapter, 10);
        if (!isNaN(idx) && idx !== state.currentChapter) {
          state.currentChapter = idx;
          updateNav();
        }
      }
    }
  }, {
    root: document.getElementById('chapters'),
    threshold: 0.5,
  });
  chapters.forEach(ch => observer.observe(ch));
}

/* ==========================================================================
   TIMER
   ========================================================================== */
function timerAction(action, blockId) {
  const block = agendaData.find(b => b.id === blockId);
  if (!block) return;
  if (!state.timers[blockId]) {
    state.timers[blockId] = { interval: null, remaining: block.durationMin * 60, running: false };
  }
  const t = state.timers[blockId];
  const display = document.getElementById(`timer-display-${blockId}`);
  if (!display) return;

  if (action === 'start') {
    if (t.running) return;
    t.running = true;
    t.interval = setInterval(() => {
      t.remaining--;
      display.textContent = formatTime(t.remaining);
      display.classList.toggle('is-running', t.remaining > 0);
      display.classList.toggle('is-expired', t.remaining <= 0);
      if (t.remaining <= 0) { clearInterval(t.interval); t.running = false; display.textContent = '00:00'; }
    }, 1000);
    display.classList.add('is-running');
    display.classList.remove('is-expired');
  } else if (action === 'stop') {
    clearInterval(t.interval);
    t.running = false;
    display.classList.remove('is-running');
  } else if (action === 'reset') {
    clearInterval(t.interval);
    t.running = false;
    t.remaining = block.durationMin * 60;
    display.textContent = formatTime(t.remaining);
    display.classList.remove('is-running', 'is-expired');
  }
}

/* ==========================================================================
   DONE + PROGRESS
   ========================================================================== */
function toggleDone(blockId, checked) {
  if (checked) state.doneBlocks.add(blockId);
  else state.doneBlocks.delete(blockId);
  updateProgressBar();
  renderHeaderDots();
  renderMap(); // update map tiles

  // TODO: Supabase – synchronizace stavu checkboxů mezi účastníky
}

function updateProgressBar() {
  const count = state.doneBlocks.size;
  const total = agendaData.length;
  const pct = Math.round((count / total) * 100);
  const fill = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-label');
  if (fill) { fill.style.width = pct + '%'; fill.setAttribute('aria-valuenow', pct); }
  if (label) label.textContent = `${count} / ${total} bloků splněno`;
}

/* ==========================================================================
   LECTURER NOTE
   ========================================================================== */
function toggleLecturerNote(blockId, btn) {
  const content = document.getElementById(`detail-lnote-${blockId}`);
  if (!content) return;
  const isVis = content.classList.contains('is-visible');
  content.classList.toggle('is-visible', !isVis);
  btn.setAttribute('aria-expanded', String(!isVis));
  btn.textContent = isVis ? '🔒 Lektorská poznámka' : '🔓 Skrýt poznámku';
}

/* ==========================================================================
   DAMAGE SLIDER
   ========================================================================== */
let currentDamageEvent = 0;

function selectDamageEvent(index) {
  currentDamageEvent = index;
  document.querySelectorAll('.damage-event-btn').forEach((btn, i) => {
    btn.classList.toggle('is-active', i === index);
    btn.setAttribute('aria-pressed', i === index);
  });
  const desc = document.getElementById('damage-event-desc');
  if (desc) desc.textContent = damageEvents[index].desc;
  const result = document.getElementById('damage-reveal-result');
  if (result) result.classList.remove('is-visible');
  const slider = document.getElementById('damage-slider');
  if (slider) { slider.value = 50000; updateDamageEstimate(50000); }
}

function updateDamageEstimate(value) {
  const display = document.getElementById('damage-estimate-display');
  if (display) display.textContent = formatKc(Number(value));
}

function revealDamage() {
  const ev = damageEvents[currentDamageEvent];
  const result = document.getElementById('damage-reveal-result');
  const realVal = document.getElementById('damage-real-value');
  const comment = document.getElementById('damage-comment');
  if (!result || !realVal || !comment) return;
  realVal.textContent = `Skutečná škoda: ${formatKc(ev.real)}`;
  comment.textContent = ev.comment;
  result.classList.add('is-visible');
}

/* ==========================================================================
   RESPONSIBILITY SITUATIONS
   ========================================================================== */
let currentSituation = 0;

function showSituation(index) {
  situations.forEach((_, i) => {
    const el = document.getElementById(`situation-${i}`);
    if (el) el.style.display = i === index ? '' : 'none';
    const ans = document.getElementById(`situation-answer-${i}`);
    if (ans) ans.classList.remove('is-visible');
    const btn = document.getElementById(`situation-reveal-btn-${i}`);
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Zobrazit odpověď'; btn.disabled = false; }
  });
  const counter = document.getElementById('situation-counter');
  if (counter) counter.textContent = `Situace ${index + 1} z ${situations.length}`;
  currentSituation = index;
}
function revealSituation(index) {
  const ans = document.getElementById(`situation-answer-${index}`);
  const btn = document.getElementById(`situation-reveal-btn-${index}`);
  if (ans) ans.classList.add('is-visible');
  if (btn) { btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Odpověď zobrazena'; btn.disabled = true; }
}
function nextSituation() { showSituation((currentSituation + 1) % situations.length); }
function prevSituation() { showSituation((currentSituation - 1 + situations.length) % situations.length); }

/* ==========================================================================
   DECISION TREE
   ========================================================================== */
function dtGo(stepId) {
  document.querySelectorAll('.dt-step').forEach(el => el.classList.remove('is-active'));
  const target = document.getElementById(`dt-step-${stepId}`);
  if (target) target.classList.add('is-active');
}
function dtReset() { dtGo(0); }

/* ==========================================================================
   OBJECTIONS
   ========================================================================== */
let currentObjection = 0;

function showObjection(index) {
  objections.forEach((_, i) => {
    const el = document.getElementById(`objection-${i}`);
    if (el) el.style.display = i === index ? '' : 'none';
    const resp = document.getElementById(`objection-response-${i}`);
    if (resp) resp.classList.remove('is-visible');
    const btn = document.getElementById(`objection-reveal-btn-${i}`);
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Zobrazit doporučenou reakci'; btn.disabled = false; }
  });
  const counter = document.getElementById('objection-counter');
  if (counter) counter.textContent = `Námitka ${index + 1} z ${objections.length}`;
  currentObjection = index;
}
function revealObjection(index) {
  const resp = document.getElementById(`objection-response-${index}`);
  const btn = document.getElementById(`objection-reveal-btn-${index}`);
  if (resp) resp.classList.add('is-visible');
  if (btn) { btn.setAttribute('aria-expanded', 'true'); btn.textContent = 'Reakce zobrazena'; btn.disabled = true; }
}
function nextObjection() { showObjection((currentObjection + 1) % objections.length); }
function prevObjection() { showObjection((currentObjection - 1 + objections.length) % objections.length); }

/* ==========================================================================
   ACTION PLAN
   ========================================================================== */
function initActionPlan() {
  const input = document.getElementById('action-plan-input');
  const saveBtn = document.getElementById('btn-save-plan');
  const clearBtn = document.getElementById('btn-clear-plan');
  const display = document.getElementById('saved-plan-display');
  const displayText = document.getElementById('saved-plan-text');
  const saved = localStorage.getItem('nzp_action_plan');
  if (saved && input && display && displayText) {
    input.value = saved;
    displayText.textContent = saved;
    display.hidden = false;
  }
  if (saveBtn) saveBtn.addEventListener('click', () => {
    const val = input ? input.value.trim() : '';
    if (!val) return;
    localStorage.setItem('nzp_action_plan', val);
    if (displayText) displayText.textContent = val;
    if (display) display.hidden = false;
    // TODO: Supabase – uložení akčního plánu per participant do DB
  });
  if (clearBtn) clearBtn.addEventListener('click', () => {
    localStorage.removeItem('nzp_action_plan');
    if (input) input.value = '';
    if (display) display.hidden = true;
  });
}

/* ==========================================================================
   VIEW + PROJECTION SWITCHES
   ========================================================================== */
function initViewSwitcher() {
  const toggle = document.getElementById('toggle-view');
  const label = document.getElementById('view-label');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    state.isHostMode = toggle.checked;
    document.body.classList.toggle('participant-mode', !state.isHostMode);
    if (label) label.textContent = state.isHostMode ? 'Lektor' : 'Účastník';
  });
  document.body.classList.add('participant-mode');
}

function initProjectionMode() {
  const toggle = document.getElementById('toggle-projection');
  const label = document.getElementById('proj-label');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    state.isProjectionMode = toggle.checked;
    document.body.classList.toggle('projection-mode', state.isProjectionMode);
    if (label) label.textContent = state.isProjectionMode ? 'Zapnuto' : 'Vypnuto';
  });
}

/* ==========================================================================
   UTILITY PANEL
   ========================================================================== */
function initUtilsPanel() {
  const toggle = document.getElementById('btn-utils-toggle');
  const panel = document.getElementById('utils-panel');
  const close = document.getElementById('btn-utils-close');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
  if (close) close.addEventListener('click', () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
}

/* ==========================================================================
   EXPAND / COLLAPSE ALL (for detail drawers in map context)
   ========================================================================== */
function initExpandCollapse() {
  document.getElementById('btn-expand-all')?.addEventListener('click', () => {
    agendaData.forEach(b => openDetail(b.id));
  });
  document.getElementById('btn-collapse-all')?.addEventListener('click', () => {
    closeDetail();
  });
}

/* ==========================================================================
   DETAIL DRAWER close events
   ========================================================================== */
function initDetailDrawer() {
  document.getElementById('btn-detail-close')?.addEventListener('click', closeDetail);
  document.getElementById('detail-backdrop')?.addEventListener('click', closeDetail);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
  });
}

/* ==========================================================================
   KEYBOARD – navigate chapters with arrows
   ========================================================================== */
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    // Don't navigate when focus is in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // Don't navigate when detail drawer is open
    const drawer = document.getElementById('detail-drawer');
    if (drawer && drawer.classList.contains('is-open')) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); nextChapter(); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); prevChapter(); }
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Render
  renderMap();
  renderBlockChapters();
  renderHeaderDots();
  updateNav();

  // Init features
  initActionPlan();
  initViewSwitcher();
  initProjectionMode();
  initUtilsPanel();
  initExpandCollapse();
  initDetailDrawer();
  initKeyboardNav();
  updateProgressBar();

  // Scroll observer
  initScrollObserver();

  // Auto-navigate to active block
  const activeId = getActiveBlockId();
  if (activeId) {
    setTimeout(() => goToChapter(activeId + 1), 500);
  }

  // Update active block every 60s
  setInterval(() => { renderMap(); renderBlockChapters(); }, 60000);
});
