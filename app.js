/**
 * app.js – Adaptační den: Neživotní pojištění (ČS)
 * Facilitátorský nástroj – čistý vanilla JS, bez frameworků
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
   STAV APLIKACE
   ========================================================================== */
const state = {
  doneBlocks: new Set(),       // ID bloků označených jako splněné
  openBlocks: new Set(),       // ID otevřených accordionů
  isHostMode: false,           // true = host/lektor view
  isProjectionMode: false,
  timers: {},                  // { blockId: { interval, remaining, running } }
};

/* ==========================================================================
   HELPER FUNKCE
   ========================================================================== */

/** Formátuje číslo jako českou měnu Kč */
function formatKc(value) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(value);
}

/** Formátuje sekundy jako MM:SS */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/** Zjistí aktuální hodinu:minuty a vrátí ID aktivního bloku (nebo null) */
function getActiveBlockId() {
  const now = new Date();
  const hm = now.getHours() * 60 + now.getMinutes();
  const schedule = [
    { id: 1, start: 9 * 60,      end: 9 * 60 + 45  },
    { id: 2, start: 9 * 60 + 45, end: 10 * 60 + 30 },
    { id: 3, start: 10 * 60 + 45,end: 11 * 60 + 30 },
    { id: 4, start: 11 * 60 + 30,end: 12 * 60      },
    { id: 5, start: 12 * 60 + 45,end: 13 * 60 + 45 },
    { id: 6, start: 13 * 60 + 45,end: 14 * 60 + 30 },
    { id: 7, start: 14 * 60 + 45,end: 15 * 60 + 45 },
    { id: 8, start: 15 * 60 + 45,end: 16 * 60      },
  ];
  for (const s of schedule) {
    if (hm >= s.start && hm < s.end) return s.id;
  }
  return null;
}

/* ==========================================================================
   RENDER – TIMELINE
   ========================================================================== */
function renderTimeline() {
  const container = document.getElementById('timeline-cards');
  if (!container) return;
  const activeId = getActiveBlockId();
  container.innerHTML = agendaData.map(block => {
    const isActive = block.id === activeId;
    return `
      <a
        href="#block-${block.id}"
        class="timeline-card${isActive ? ' is-active' : ''}"
        role="listitem"
        aria-label="Blok ${block.id}: ${block.name}, ${block.time}"
      >
        <div class="timeline-card-num">Blok ${block.id}</div>
        <div class="timeline-card-time">${block.time.split('–')[0]}</div>
        <div class="timeline-card-name">${block.name}</div>
        <div class="timeline-card-goal">${block.goal.substring(0, 80)}${block.goal.length > 80 ? '…' : ''}</div>
        <div class="timeline-card-duration">${block.durationMin} min</div>
        <span class="timeline-badge-active">${isActive ? '▶ Právě teď' : block.activeRatio}</span>
      </a>
    `;
  }).join('');
}

/* ==========================================================================
   RENDER – AGENDA BLOCKS
   ========================================================================== */
function renderAgenda() {
  const container = document.getElementById('agenda-blocks');
  if (!container) return;
  const activeId = getActiveBlockId();

  container.innerHTML = agendaData.map(block => {
    const isActive = block.id === activeId;
    return `
      <article
        class="block-card${isActive ? ' is-active' : ''}"
        id="block-${block.id}"
        data-block-id="${block.id}"
        aria-labelledby="block-title-${block.id}"
      >
        <!-- HEADER -->
        <div
          class="block-header"
          role="button"
          tabindex="0"
          aria-expanded="false"
          aria-controls="block-body-${block.id}"
          id="block-header-${block.id}"
          onclick="toggleBlock(${block.id})"
          onkeydown="handleBlockKeydown(event, ${block.id})"
        >
          <div class="block-number" aria-hidden="true">${block.id}</div>
          <div class="block-header-main">
            <div class="block-time">${block.time}</div>
            <h3 class="block-title" id="block-title-${block.id}">${block.name}</h3>
            <div class="block-duration">${block.durationMin} minut</div>
          </div>
          <div class="block-header-badges">
            <span class="badge badge-active-ratio">${block.activeRatio}</span>
            ${isActive ? '<span class="badge badge-now">▶ Právě teď</span>' : ''}
            <span class="badge badge-done" id="badge-done-${block.id}" style="display:none">✓ Splněno</span>
          </div>
          <!-- Timer -->
          <div class="block-timer" onclick="event.stopPropagation()" role="timer" aria-label="Časovač bloku ${block.id}">
            <span class="timer-display" id="timer-display-${block.id}">${formatTime(block.durationMin * 60)}</span>
            <button class="btn btn-sm btn-outline" onclick="timerAction('start', ${block.id})" aria-label="Spustit časovač bloku ${block.id}">▶</button>
            <button class="btn btn-sm btn-ghost" onclick="timerAction('stop', ${block.id})" aria-label="Pozastavit časovač">⏸</button>
            <button class="btn btn-sm btn-ghost" onclick="timerAction('reset', ${block.id})" aria-label="Resetovat časovač">↺</button>
          </div>
          <!-- Done checkbox -->
          <div onclick="event.stopPropagation()">
            <input
              type="checkbox"
              class="block-done-checkbox"
              id="done-${block.id}"
              aria-label="Označit blok ${block.id} jako splněný"
              onchange="toggleDone(${block.id}, this.checked)"
            />
          </div>
          <span class="block-chevron" aria-hidden="true">▾</span>
        </div>

        <!-- BODY (accordion) -->
        <div class="block-body" id="block-body-${block.id}" role="region" aria-labelledby="block-header-${block.id}">

          <!-- Cíl -->
          <div class="block-goal" aria-label="Cíl bloku">
            <strong>Cíl:</strong> ${block.goal}
          </div>

          <!-- Aktivity -->
          <div class="activity-switcher">
            <div class="activity-switcher-tabs" role="tablist" aria-label="Zobrazení aktivit">
              <button
                class="activity-tab is-active"
                role="tab"
                aria-selected="true"
                onclick="switchActivity(${block.id}, 'recommended', this)"
              >Doporučená aktivita</button>
              <button
                class="activity-tab"
                role="tab"
                aria-selected="false"
                onclick="switchActivity(${block.id}, 'all', this)"
              >Všechny varianty</button>
            </div>
            <div id="activity-recommended-${block.id}" class="activity-panel">
              <div class="recommended-activity">
                <div class="recommended-activity-label">Doporučená aktivita</div>
                <div class="recommended-activity-name">${block.recommendedActivity}</div>
              </div>
            </div>
            <div id="activity-all-${block.id}" class="activity-panel" style="display:none">
              <ol class="all-activities-list">
                ${block.activities.map((act, i) => `
                  <li class="activity-item${i === 0 ? ' is-recommended' : ''}">
                    <span class="activity-item-num">${i + 1}</span>
                    <span>${act}${i === 0 ? ' <em>(doporučeno)</em>' : ''}</span>
                  </li>
                `).join('')}
              </ol>
            </div>
          </div>

          <!-- Info boxy -->
          <div class="info-boxes">
            <div class="info-box info-box-important" role="note">
              <div class="info-box-title">⚠ Co je důležité</div>
              <div class="info-box-content">${block.important}</div>
            </div>
            <div class="info-box info-box-remember" role="note">
              <div class="info-box-title">✓ Na co nezapomenout</div>
              <div class="info-box-content">${block.remember}</div>
            </div>
            <div class="info-box info-box-role" role="note">
              <div class="info-box-title">👤 Role lektora</div>
              <div class="info-box-content">${block.role}</div>
            </div>
          </div>

          <!-- Lektorská poznámka (skrytá v participant mode) -->
          <div class="lecturer-note">
            <button
              class="lecturer-note-toggle"
              aria-expanded="false"
              aria-controls="lecturer-note-content-${block.id}"
              onclick="toggleLecturerNote(${block.id}, this)"
            >🔒 Lektorská poznámka</button>
            <div class="lecturer-note-content" id="lecturer-note-content-${block.id}" role="note">
              ${block.lecturerNote}
            </div>
          </div>

          <!-- Interaktivní mockup (jen pro vybrané bloky) -->
          ${block.hasMockup ? renderMockup(block) : ''}

        </div>
      </article>
    `;
  }).join('');
}

/* ==========================================================================
   RENDER – INTERAKTIVNÍ MOCKUPY
   ========================================================================== */
function renderMockup(block) {
  switch (block.hasMockup) {
    case 'damage-slider':   return renderDamageSliderMockup(block.id);
    case 'responsibility':  return renderResponsibilityMockup(block.id);
    case 'decision-tree':   return renderDecisionTreeMockup(block.id);
    case 'objections':      return renderObjectionsMockup(block.id);
    default: return '';
  }
}

/* -- Blok 1: Slider škody -- */
const damageEvents = [
  {
    label: 'Záplava bytu',
    desc: 'Přízemní byt 2+kk v panelovém domě, zatopení po havárii potrubí – voda v celém bytě.',
    real: 180000,
    comment: 'Průměrná škoda při záplavě bytu: výměna podlah, sušení zdí, oprava elektroinstalace a vybavení.',
  },
  {
    label: 'Požár garsonky',
    desc: 'Garsonka 28 m², požár zaviněný vadnou elektronikou – kompletní vyhoření.',
    real: 420000,
    comment: 'Celková obnova po požáru zahrnuje stavební práce, nové vybavení, výmalbu a spotřebiče.',
  },
  {
    label: 'Krádež vybavení',
    desc: 'Vloupání do bytu 3+1 – odcizena elektronika, šperky a hotovost.',
    real: 95000,
    comment: 'Průměrná hodnota odcizených věcí při vloupání do bytu v ČR.',
  },
];

function renderDamageSliderMockup(blockId) {
  return `
    <div class="mockup-section" id="mockup-${blockId}">
      <div class="mockup-title">📊 Interaktivní mockup – Odhad škody</div>
      <div class="damage-slider-mockup">
        <div class="damage-event-switcher" role="group" aria-label="Výběr pojistné události">
          ${damageEvents.map((ev, i) => `
            <button
              class="damage-event-btn${i === 0 ? ' is-active' : ''}"
              onclick="selectDamageEvent(${i})"
              aria-pressed="${i === 0 ? 'true' : 'false'}"
            >${ev.label}</button>
          `).join('')}
        </div>
        <p class="damage-event-desc" id="damage-event-desc">${damageEvents[0].desc}</p>
        <p class="damage-slider-label">Odhadněte výši škody:</p>
        <input
          type="range"
          id="damage-slider"
          class="damage-slider"
          min="0"
          max="500000"
          step="5000"
          value="50000"
          aria-label="Slider odhadu výše škody v korunách"
          oninput="updateDamageEstimate(this.value)"
        />
        <div class="damage-estimate-display" id="damage-estimate-display" aria-live="polite">
          ${formatKc(50000)}
        </div>
        <button
          class="btn btn-primary damage-reveal-btn"
          onclick="revealDamage()"
          aria-expanded="false"
          aria-controls="damage-reveal-result"
        >Odhalit reálnou škodu</button>
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
  {
    title: 'Záplava sousedního bytu',
    desc: 'Vám přetekla vana – voda zatekla do bytu souseda pod vámi a poškodila jeho nábytek a podlahy.',
    question: 'Kdo nese odpovědnost za škodu?',
    answerType: 'Občanská odpovědnost (pojištění domácnosti)',
    answerText: 'Škodu na sousedově majetku hradí vaše pojištění občanské odpovědnosti v rámci pojištění domácnosti. Klíčové: musíte mít toto krytí sjednáno.',
  },
  {
    title: 'Pes pokousal sousedovo dítě',
    desc: 'Váš pes na zahradě rodinného domu pokousal dítě souseda. Dítě muselo na ošetření.',
    question: 'Kdo nese odpovědnost a jaký typ pojištění kryje tuto škodu?',
    answerType: 'Občanská odpovědnost – pojištění domácnosti',
    answerText: 'Odpovídáte jako vlastník psa. Škodu (ošetření, případná bolestná) kryje pojištění odpovědnosti v rámci pojištění domácnosti. Bez tohoto krytí platíte z vlastní kapsy.',
  },
  {
    title: 'Strom padl na auto souseda',
    desc: 'Ze svého pozemku vám padl strom na auto zaparkovaného souseda. Strom byl starý, ale formálně zdravý.',
    question: 'Kdo hradí škodu na autě?',
    answerType: 'Odpovědnost z nemovitosti (pojištění nemovitosti)',
    answerText: 'Jako vlastník pozemku odpovídáte za škody způsobené stromem. Kryje pojištění odpovědnosti vlastníka nemovitosti. Důležité: týká se jen vaší nemovitosti a pozemku.',
  },
  {
    title: 'Dítě rozbilo okno souseda',
    desc: 'Vaše dítě (10 let) hrálo fotbal a rozbilo okno souseda. Soused žádá náhradu škody.',
    question: 'Kdo nese odpovědnost za rozbité okno?',
    answerType: 'Občanská odpovědnost – pojištění domácnosti (rodičovská odpovědnost)',
    answerText: 'Rodiče odpovídají za škody způsobené nezletilými dětmi. Pojištění odpovědnosti v rámci pojištění domácnosti kryje i tuto situaci, pokud je sjednána rodičovská odpovědnost.',
  },
];

function renderResponsibilityMockup(blockId) {
  return `
    <div class="mockup-section" id="mockup-${blockId}">
      <div class="mockup-title">⚖ Interaktivní mockup – Kdo nese odpovědnost?</div>
      <div class="responsibility-mockup" data-current="0">
        <div class="situation-counter" id="situation-counter" aria-live="polite">Situace 1 z ${situations.length}</div>
        ${situations.map((s, i) => `
          <div class="situation-card${i > 0 ? '' : ''}" id="situation-${i}" style="${i > 0 ? 'display:none' : ''}">
            <div class="situation-title">${s.title}</div>
            <p class="situation-desc">${s.desc}</p>
            <p class="situation-question"><strong>${s.question}</strong></p>
            <button
              class="btn btn-outline"
              onclick="revealSituation(${i})"
              id="situation-reveal-btn-${i}"
              aria-expanded="false"
              aria-controls="situation-answer-${i}"
            >Zobrazit odpověď</button>
            <div class="situation-answer" id="situation-answer-${i}" aria-live="polite">
              <div class="situation-answer-type">${s.answerType}</div>
              <p>${s.answerText}</p>
            </div>
          </div>
        `).join('')}
        <div class="situation-nav">
          <button class="btn btn-outline" onclick="prevSituation()" aria-label="Předchozí situace">← Předchozí</button>
          <button class="btn btn-primary" onclick="nextSituation()" aria-label="Další situace">Další →</button>
        </div>
      </div>
    </div>
  `;
}

/* -- Blok 6: Decision tree -- */
function renderDecisionTreeMockup(blockId) {
  return `
    <div class="mockup-section" id="mockup-${blockId}">
      <div class="mockup-title">🌳 Interaktivní mockup – Rozhodovací strom výpovědi</div>
      <div class="decision-tree-mockup">
        <!-- Krok 0: Start -->
        <div class="dt-step is-active" id="dt-step-0">
          <p class="dt-question">Chce klient přejít k pojištění ČS od jiného pojistitele?</p>
          <div class="dt-buttons">
            <button class="btn btn-primary" onclick="dtGo(1)">Ano, chce přejít</button>
            <button class="btn btn-outline" onclick="dtGo('no-intent')">Ne / Nejasné</button>
          </div>
        </div>
        <!-- Krok 1: Datum výročí -->
        <div class="dt-step" id="dt-step-1">
          <p class="dt-question">Zjistil/a jsi datum výročí stávající smlouvy klienta?</p>
          <div class="dt-buttons">
            <button class="btn btn-primary" onclick="dtGo(2)">Ano, datum znám</button>
            <button class="btn btn-outline" onclick="dtGo('find-anniversary')">Ne, zjistím ho</button>
          </div>
        </div>
        <!-- Krok 2: 6 týdnů -->
        <div class="dt-step" id="dt-step-2">
          <p class="dt-question">Je výročí smlouvy za více než 6 týdnů od dnešního dne?</p>
          <div class="dt-buttons">
            <button class="btn btn-success" onclick="dtGo('ok-termination')">Ano – výročí je dál</button>
            <button class="btn btn-danger" onclick="dtGo(3)">Ne – výročí je brzy</button>
          </div>
        </div>
        <!-- Krok 3: Mimořádná výpověď -->
        <div class="dt-step" id="dt-step-3">
          <p class="dt-question">Existuje důvod pro mimořádnou výpověď? (pojistná událost v posledních 3 měsících, změna podmínek pojistitelem)</p>
          <div class="dt-buttons">
            <button class="btn btn-primary" onclick="dtGo('ok-extraordinary')">Ano – existuje důvod</button>
            <button class="btn btn-outline" onclick="dtGo('wait-next')">Ne – žádný důvod</button>
          </div>
        </div>
        <!-- Výsledky -->
        <div class="dt-step" id="dt-step-ok-termination">
          <div class="dt-result ok">
            <span class="dt-result-icon">✅</span>
            <div>
              <div class="dt-result-text">Lze podat výpověď ke konci pojistného období</div>
              <p class="dt-result-sub">Výpověď musí být doručena pojistiteli nejméně 6 týdnů před výročím. Podat písemně s dostatečnou rezervou. Novou smlouvu uzavřít tak, aby navázala bez mezery.</p>
            </div>
          </div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-ok-extraordinary">
          <div class="dt-result warn">
            <span class="dt-result-icon">⚠️</span>
            <div>
              <div class="dt-result-text">Mimořádná výpověď je možná – ověřit podmínky</div>
              <p class="dt-result-sub">Výpověď z důvodu pojistné události musí být podána do 1 měsíce od oznámení výše pojistného plnění. Nutné doložit důvod. Doporučit konzultaci s právníkem nebo interní podporou.</p>
            </div>
          </div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-wait-next">
          <div class="dt-result no">
            <span class="dt-result-icon">🔴</span>
            <div>
              <div class="dt-result-text">Výpověď nyní není možná – doporučit čekat na příští výročí</div>
              <p class="dt-result-sub">Informuj klienta o přesném výročním datu a nastav si připomínku 8 týdnů předem. Mezitím připrav nabídku a udržuj kontakt.</p>
            </div>
          </div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-no-intent">
          <div class="dt-result warn">
            <span class="dt-result-icon">⚠️</span>
            <div>
              <div class="dt-result-text">Záměr není jasný – vrátit se k potřebám klienta</div>
              <p class="dt-result-sub">Nejdřív zjisti, proč klient zvažuje přechod. Bez jasného záměru nemá smysl řešit lhůty.</p>
            </div>
          </div>
          <button class="btn btn-outline dt-reset" onclick="dtReset()">↺ Začít znovu</button>
        </div>
        <div class="dt-step" id="dt-step-find-anniversary">
          <div class="dt-result warn">
            <span class="dt-result-icon">📅</span>
            <div>
              <div class="dt-result-text">Zjisti datum výročí smlouvy</div>
              <p class="dt-result-sub">Požádej klienta o smlouvu nebo pojistku. Datum výročí je klíčové – bez něj nelze pokračovat. Po zjištění se vrať na krok 2.</p>
            </div>
          </div>
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
  {
    text: 'To je příliš drahé.',
    type: 'price',
    typeLabel: 'Cena',
    response: 'Rozumím, cena je důležitá. Pojďme se podívat, co za tyto peníze dostanete. Roční pojistné činí cca 4 800 Kč – to je 400 Kč měsíčně. Za to máte krytou škodu až 2 miliony korun. Srovnejte to s cenou jediné opravy po záplavě: průměrně 180 000 Kč. Jeden incident stačí na to, aby se pojistné mnohonásobně vrátilo.',
  },
  {
    text: 'U konkurence mám lepší cenu.',
    type: 'competition',
    typeLabel: 'Konkurence',
    response: 'To je možné. Podívejme se ale na to, co přesně ta nabídka kryje. Klíčové není jen cena, ale šíře krytí – například pojištění odpovědnosti, živelní škody nebo asistenční služby. Mohu vám ukázat konkrétní srovnání? Chci, abyste se rozhodl na základě faktů.',
  },
  {
    text: 'Pojištění nepotřebuji, nikdy se mi nic nestalo.',
    type: 'postpone',
    typeLabel: 'Odmítnutí',
    response: 'To je dobrá zpráva, že se vám nic nestalo. Pojištění funguje ale přesně tak – platíte za to, aby se nestalo, nebo abyste při nehodě nezůstal bez prostředků. Průměrná škoda při vloupání je 95 000 Kč, při požáru přes 400 000 Kč. Kolik byste byl ochoten okamžitě zaplatit z vlastní kapsy?',
  },
  {
    text: 'Manžel/ka to musí schválit.',
    type: 'authority',
    typeLabel: 'Autorita',
    response: 'To chápu, jde o společné rozhodnutí. Mohu vám připravit nabídku ve formě, kterou snadno ukážete partnerovi/ce? Shrnutí na jednu stranu s klíčovými body. Kdy byste mohl/a mít jeho/její stanovisko?',
  },
  {
    text: 'Zavolám vám příští týden.',
    type: 'postpone',
    typeLabel: 'Odkládání',
    response: 'Samozřejmě, nechci vás k ničemu tlačit. Mohu se zeptat – je něco konkrétního, co vás zastavuje od rozhodnutí dnes? Chci se ujistit, že máte všechny informace, které potřebujete. Pokud jde o termín, rád si rezervuji čas přímo teď.',
  },
];

function renderObjectionsMockup(blockId) {
  return `
    <div class="mockup-section" id="mockup-${blockId}">
      <div class="mockup-title">💬 Interaktivní mockup – Karta námitky</div>
      <div class="objection-mockup" data-current="0">
        <div class="objection-counter" id="objection-counter" aria-live="polite">Námitka 1 z ${objections.length}</div>
        ${objections.map((obj, i) => `
          <div class="objection-card" id="objection-${i}" style="${i > 0 ? 'display:none' : ''}">
            <span class="objection-type ${obj.type}">${obj.typeLabel}</span>
            <div class="objection-text">"${obj.text}"</div>
            <button
              class="btn btn-outline"
              onclick="revealObjection(${i})"
              id="objection-reveal-btn-${i}"
              aria-expanded="false"
              aria-controls="objection-response-${i}"
            >Zobrazit doporučenou reakci</button>
            <div class="objection-response" id="objection-response-${i}" aria-live="polite">
              ${obj.response}
            </div>
          </div>
        `).join('')}
        <div class="objection-nav">
          <button class="btn btn-outline" onclick="prevObjection()" aria-label="Předchozí námitka">← Předchozí</button>
          <button class="btn btn-primary" onclick="nextObjection()" aria-label="Další námitka">Další →</button>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   ACCORDION
   ========================================================================== */
function toggleBlock(blockId) {
  const card = document.getElementById(`block-${blockId}`);
  const body = document.getElementById(`block-body-${blockId}`);
  const header = document.getElementById(`block-header-${blockId}`);
  if (!card || !body) return;
  const isOpen = card.classList.contains('is-open');
  if (isOpen) {
    card.classList.remove('is-open');
    body.style.display = 'none';
    header.setAttribute('aria-expanded', 'false');
    state.openBlocks.delete(blockId);
  } else {
    card.classList.add('is-open');
    body.style.display = 'block';
    header.setAttribute('aria-expanded', 'true');
    state.openBlocks.add(blockId);
  }
}

function handleBlockKeydown(event, blockId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleBlock(blockId);
  }
}

document.addEventListener('click', function(e) {
  const btn = e.target.closest('#btn-expand-all');
  const btn2 = e.target.closest('#btn-collapse-all');
  if (btn) {
    agendaData.forEach(b => {
      const card = document.getElementById(`block-${b.id}`);
      const body = document.getElementById(`block-body-${b.id}`);
      const header = document.getElementById(`block-header-${b.id}`);
      if (card && body && !card.classList.contains('is-open')) {
        card.classList.add('is-open');
        body.style.display = 'block';
        if (header) header.setAttribute('aria-expanded', 'true');
        state.openBlocks.add(b.id);
      }
    });
  }
  if (btn2) {
    agendaData.forEach(b => {
      const card = document.getElementById(`block-${b.id}`);
      const body = document.getElementById(`block-body-${b.id}`);
      const header = document.getElementById(`block-header-${b.id}`);
      if (card && body && card.classList.contains('is-open')) {
        card.classList.remove('is-open');
        body.style.display = 'none';
        if (header) header.setAttribute('aria-expanded', 'false');
        state.openBlocks.delete(b.id);
      }
    });
  }
});

/* ==========================================================================
   ACTIVITY SWITCHER
   ========================================================================== */
function switchActivity(blockId, mode, btn) {
  const recommended = document.getElementById(`activity-recommended-${blockId}`);
  const all = document.getElementById(`activity-all-${blockId}`);
  const tabs = btn.closest('.activity-switcher-tabs').querySelectorAll('.activity-tab');
  tabs.forEach(t => {
    t.classList.remove('is-active');
    t.setAttribute('aria-selected', 'false');
  });
  btn.classList.add('is-active');
  btn.setAttribute('aria-selected', 'true');
  if (mode === 'recommended') {
    recommended.style.display = '';
    all.style.display = 'none';
  } else {
    recommended.style.display = 'none';
    all.style.display = '';
  }
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
      if (t.remaining <= 0) {
        clearInterval(t.interval);
        t.running = false;
        display.textContent = '00:00';
      }
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
   DONE CHECKBOX + PROGRESS BAR
   ========================================================================== */
function toggleDone(blockId, checked) {
  const card = document.getElementById(`block-${blockId}`);
  const badge = document.getElementById(`badge-done-${blockId}`);

  if (checked) {
    state.doneBlocks.add(blockId);
    if (card) card.classList.add('is-done');
    if (badge) badge.style.display = '';
  } else {
    state.doneBlocks.delete(blockId);
    if (card) card.classList.remove('is-done');
    if (badge) badge.style.display = 'none';
  }
  updateProgressBar();

  // TODO: Supabase – synchronizace stavu checkboxů mezi účastníky
}

function updateProgressBar() {
  const count = state.doneBlocks.size;
  const total = agendaData.length;
  const pct = Math.round((count / total) * 100);
  const fill = document.getElementById('progress-bar-fill');
  const label = document.getElementById('progress-label');
  if (fill) {
    fill.style.width = pct + '%';
    fill.setAttribute('aria-valuenow', pct);
  }
  if (label) label.textContent = `${count} / ${total} bloků splněno`;
}

/* ==========================================================================
   LECTURER NOTE
   ========================================================================== */
function toggleLecturerNote(blockId, btn) {
  const content = document.getElementById(`lecturer-note-content-${blockId}`);
  if (!content) return;
  const isVisible = content.classList.contains('is-visible');
  content.classList.toggle('is-visible', !isVisible);
  btn.setAttribute('aria-expanded', String(!isVisible));
  btn.textContent = isVisible ? '🔒 Lektorská poznámka' : '🔓 Skrýt lektorskou poznámku';
}

/* ==========================================================================
   DAMAGE SLIDER (Blok 1)
   ========================================================================== */
let currentDamageEvent = 0;

function selectDamageEvent(index) {
  currentDamageEvent = index;
  const btns = document.querySelectorAll('.damage-event-btn');
  btns.forEach((btn, i) => {
    btn.classList.toggle('is-active', i === index);
    btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
  });
  const desc = document.getElementById('damage-event-desc');
  if (desc) desc.textContent = damageEvents[index].desc;
  // Reset reveal
  const result = document.getElementById('damage-reveal-result');
  if (result) result.classList.remove('is-visible');
  // Reset slider
  const slider = document.getElementById('damage-slider');
  if (slider) {
    slider.value = 50000;
    updateDamageEstimate(50000);
  }
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
  const btn = document.querySelector('.damage-reveal-btn');
  if (btn) btn.setAttribute('aria-expanded', 'true');
}

/* ==========================================================================
   RESPONSIBILITY SITUATIONS (Blok 3)
   ========================================================================== */
let currentSituation = 0;

function showSituation(index) {
  situations.forEach((_, i) => {
    const el = document.getElementById(`situation-${i}`);
    if (el) el.style.display = i === index ? '' : 'none';
    // Reset answer visibility
    const ans = document.getElementById(`situation-answer-${i}`);
    if (ans) ans.classList.remove('is-visible');
    const revBtn = document.getElementById(`situation-reveal-btn-${i}`);
    if (revBtn) revBtn.setAttribute('aria-expanded', 'false');
    if (revBtn) revBtn.textContent = 'Zobrazit odpověď';
  });
  const counter = document.getElementById('situation-counter');
  if (counter) counter.textContent = `Situace ${index + 1} z ${situations.length}`;
  currentSituation = index;
}

function revealSituation(index) {
  const ans = document.getElementById(`situation-answer-${index}`);
  const btn = document.getElementById(`situation-reveal-btn-${index}`);
  if (!ans) return;
  ans.classList.add('is-visible');
  if (btn) {
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Odpověď zobrazena';
    btn.disabled = true;
  }
}

function nextSituation() {
  const next = (currentSituation + 1) % situations.length;
  showSituation(next);
}

function prevSituation() {
  const prev = (currentSituation - 1 + situations.length) % situations.length;
  showSituation(prev);
}

/* ==========================================================================
   DECISION TREE (Blok 6)
   ========================================================================== */
function dtGo(stepId) {
  // Hide all steps
  document.querySelectorAll('.dt-step').forEach(el => el.classList.remove('is-active'));
  // Show target step
  const target = document.getElementById(`dt-step-${stepId}`);
  if (target) target.classList.add('is-active');
}

function dtReset() {
  dtGo(0);
}

/* ==========================================================================
   OBJECTIONS (Blok 7)
   ========================================================================== */
let currentObjection = 0;

function showObjection(index) {
  objections.forEach((_, i) => {
    const el = document.getElementById(`objection-${i}`);
    if (el) el.style.display = i === index ? '' : 'none';
    const resp = document.getElementById(`objection-response-${i}`);
    if (resp) resp.classList.remove('is-visible');
    const btn = document.getElementById(`objection-reveal-btn-${i}`);
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = 'Zobrazit doporučenou reakci';
      btn.disabled = false;
    }
  });
  const counter = document.getElementById('objection-counter');
  if (counter) counter.textContent = `Námitka ${index + 1} z ${objections.length}`;
  currentObjection = index;
}

function revealObjection(index) {
  const resp = document.getElementById(`objection-response-${index}`);
  const btn = document.getElementById(`objection-reveal-btn-${index}`);
  if (!resp) return;
  resp.classList.add('is-visible');
  if (btn) {
    btn.setAttribute('aria-expanded', 'true');
    btn.textContent = 'Reakce zobrazena';
    btn.disabled = true;
  }
}

function nextObjection() {
  const next = (currentObjection + 1) % objections.length;
  showObjection(next);
}

function prevObjection() {
  const prev = (currentObjection - 1 + objections.length) % objections.length;
  showObjection(prev);
}

/* ==========================================================================
   ACTION PLAN (Závěr)
   ========================================================================== */
function initActionPlan() {
  const input = document.getElementById('action-plan-input');
  const saveBtn = document.getElementById('btn-save-plan');
  const clearBtn = document.getElementById('btn-clear-plan');
  const display = document.getElementById('saved-plan-display');
  const displayText = document.getElementById('saved-plan-text');

  // Load saved plan from localStorage
  const saved = localStorage.getItem('nzp_action_plan');
  if (saved && input && display && displayText) {
    input.value = saved;
    displayText.textContent = saved;
    display.hidden = false;
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const val = input ? input.value.trim() : '';
      if (!val) return;
      localStorage.setItem('nzp_action_plan', val);
      if (displayText) displayText.textContent = val;
      if (display) display.hidden = false;
      // TODO: Supabase – uložení akčního plánu per participant do DB
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('nzp_action_plan');
      if (input) input.value = '';
      if (display) display.hidden = true;
    });
  }
}

/* ==========================================================================
   VIEW SWITCHER (Host / Participant)
   ========================================================================== */
function initViewSwitcher() {
  const toggle = document.getElementById('toggle-view');
  const label = document.getElementById('view-label');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    state.isHostMode = toggle.checked;
    document.body.classList.toggle('participant-mode', !state.isHostMode);
    if (label) label.textContent = state.isHostMode ? 'Lektor' : 'Účastník';
    // TODO: Supabase – autentizace host mode vs participant mode
  });
  // Default: participant mode
  document.body.classList.add('participant-mode');
}

/* ==========================================================================
   PROJECTION MODE
   ========================================================================== */
function initProjectionMode() {
  const toggle = document.getElementById('toggle-projection');
  if (!toggle) return;
  toggle.addEventListener('change', () => {
    state.isProjectionMode = toggle.checked;
    document.body.classList.toggle('projection-mode', state.isProjectionMode);
  });
}

/* ==========================================================================
   TIMELINE ACTIVE BLOCK (update every minute)
   ========================================================================== */
function updateActiveBlock() {
  const activeId = getActiveBlockId();
  // Timeline cards
  document.querySelectorAll('.timeline-card').forEach((card, i) => {
    const blockId = agendaData[i] ? agendaData[i].id : null;
    const isActive = blockId === activeId;
    card.classList.toggle('is-active', isActive);
    const badge = card.querySelector('.timeline-badge-active');
    if (badge) badge.textContent = isActive ? '▶ Právě teď' : agendaData[i].activeRatio;
  });
  // Agenda block cards
  agendaData.forEach(block => {
    const card = document.getElementById(`block-${block.id}`);
    const badge = document.getElementById(`badge-now-${block.id}`);
    if (card) card.classList.toggle('is-active', block.id === activeId);
  });
}

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Render
  renderTimeline();
  renderAgenda();

  // Init features
  initActionPlan();
  initViewSwitcher();
  initProjectionMode();
  updateProgressBar();

  // Auto-open active block
  const activeId = getActiveBlockId();
  if (activeId) {
    toggleBlock(activeId);
    // Scroll to active block after a short delay
    setTimeout(() => {
      const activeCard = document.getElementById(`block-${activeId}`);
      if (activeCard) activeCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }

  // Update active block every 60 seconds
  setInterval(updateActiveBlock, 60000);
});
