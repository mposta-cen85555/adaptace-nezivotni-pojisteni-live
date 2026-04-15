/**
 * data.js — Agenda blocks, activity definitions, versioned content data layer
 * All business content with metadata: source, validation status, confidence
 * Architecture: UI reads from contentData[key], business team edits data only
 */

/* ==========================================================================
   CONTENT METADATA SCHEMA — every content item should carry:
   {
     _source_url:    string | null     // public URL of the source
     _source_name:   string            // e.g. "ČAP Výroční zpráva 2024"
     _retrieved_at:  string            // ISO date
     _validated:     boolean           // business team confirmed
     _confidence:    'high'|'medium'|'low'|'draft'
     _product_area:  string            // e.g. "majetek", "odpovědnost"
     _competitor:    string | null      // e.g. "Kooperativa"
     _tags:          string[]
     _valid_from:    string | null      // date from which data is valid
     _needs_legal:   boolean
     _needs_business: boolean
     _notes:         string | null
   }
   ========================================================================== */

/* ==========================================================================
   ARENA ARCHETYPES — each block is a distinct experience genre
   ========================================================================== */
export const arenaArchetypes = {
  1: { type: 'damage-reveal',     accent: '#C62828', gradientFrom: '#1A1A2E', gradientTo: '#3A1A1A', motif: 'flood',       displayLayout: 'big-number',   revealStyle: 'dramatic-counter' },
  2: { type: 'case-board',        accent: '#1A6B4B', gradientFrom: '#0D2818', gradientTo: '#1A3A2A', motif: 'family',      displayLayout: 'grid-cards',   revealStyle: 'expand-card' },
  3: { type: 'decision-arena',    accent: '#E65100', gradientFrom: '#1A1A2E', gradientTo: '#2E1A00', motif: 'courtroom',   displayLayout: 'split-vote',   revealStyle: 'color-burst' },
  4: { type: 'conversation-sim',  accent: '#008080', gradientFrom: '#001A1A', gradientTo: '#0D2D2D', motif: 'meeting',     displayLayout: 'dialogue',     revealStyle: 'slide-in' },
  5: { type: 'modeling-sim',      accent: '#5C6BC0', gradientFrom: '#1A1A2E', gradientTo: '#1A1A3E', motif: 'laptop',      displayLayout: 'builder',      revealStyle: 'build-up' },
  6: { type: 'timeline-branch',   accent: '#6B4BA6', gradientFrom: '#1A1020', gradientTo: '#2A1A3A', motif: 'documents',   displayLayout: 'timeline',     revealStyle: 'step-reveal' },
  7: { type: 'objection-battle',  accent: '#D32F2F', gradientFrom: '#1A1A2E', gradientTo: '#2E1A1A', motif: 'negotiation', displayLayout: 'battle-cards', revealStyle: 'clash' },
  8: { type: 'commitment-arena',  accent: '#A4D233', gradientFrom: '#0D2818', gradientTo: '#1A3520', motif: 'horizon',     displayLayout: 'wall',         revealStyle: 'fade-cascade' },
};

/* ==========================================================================
   HERO VISUALS — per-block thematic image descriptors
   Actual image URLs should be added by the team; architecture is ready
   ========================================================================== */
export const heroVisuals = {
  1: { label: 'Vytopený byt po havárii',         placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #1a1a2e 0%, #3a1a1a 50%, #5a2020 100%)', overlay: 0.7 },
  2: { label: 'Rodina v obývacím pokoji',         placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #0d2818 0%, #1a6b4b 50%, #2d8a6a 100%)', overlay: 0.65 },
  3: { label: 'Poškozená nemovitost – vloupání',  placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #1a1a2e 0%, #2e1a00 50%, #4a3010 100%)', overlay: 0.7 },
  4: { label: 'Obchodní schůzka v pobočce',       placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #001a1a 0%, #008080 50%, #00a0a0 100%)', overlay: 0.65 },
  5: { label: 'Práce se systémem Hades',          placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #1a1a2e 0%, #3a3a6e 50%, #5c6bc0 100%)', overlay: 0.65 },
  6: { label: 'Dokumenty a termíny smluv',        placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #1a1020 0%, #3a2050 50%, #6b4ba6 100%)', overlay: 0.65 },
  7: { label: 'Rozhodovací moment při námitce',   placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #1a1a2e 0%, #4a1a1a 50%, #d32f2f 100%)', overlay: 0.7 },
  8: { label: 'Výhled – nový začátek',            placeholder: 'gradient', cssGradient: 'linear-gradient(135deg, #0d2818 0%, #2d6a1e 50%, #a4d233 100%)', overlay: 0.6 },
};

/* ==========================================================================
   AGENDA — 8 training blocks with arena archetype metadata
   ========================================================================== */
export const agendaData = [
  { id: 1, time: '09:00–09:45', name: 'Úvod do reality škod a mindset', durationMin: 45, activeRatio: '80 %', goal: 'Ukázat finanční dopad pojistných událostí a navázat na principy POSTOJ.', icon: 'shield-alert', arenaType: 'damage-reveal',    tagline: 'Kolik stojí realita?' },
  { id: 2, time: '09:45–10:30', name: 'Mapa rizik a parametrů v praxi', durationMin: 45, activeRatio: '70 %', goal: 'Orientace v parametrech pojištění a práce s modelovými rodinami.', icon: 'map',          arenaType: 'case-board',       tagline: 'Tři rodiny, tři světy' },
  { id: 3, time: '10:45–11:30', name: 'Kdo nese odpovědnost?',          durationMin: 45, activeRatio: '85 %', goal: 'Rozlišit občanskou odpovědnost, odpovědnost z nemovitosti a výluky.', icon: 'scale',   arenaType: 'decision-arena',   tagline: 'Rozhodněte správně' },
  { id: 4, time: '11:30–12:00', name: 'Přechod k nabídce (FIT → Hades)', durationMin: 30, activeRatio: '90 %', goal: 'Natrénovat přechodovou frázi a přirozený vstup do nabídky.', icon: 'arrow-right-circle', arenaType: 'conversation-sim', tagline: 'Najděte přirozený moment' },
  { id: 5, time: '12:45–13:45', name: 'Modelování nabídek v systému',   durationMin: 60, activeRatio: '95 %', goal: 'Tvořit reálné nabídky pro klientské rodiny a odbourat strach ze systému.', icon: 'laptop', arenaType: 'modeling-sim',     tagline: 'Stavíte reálnou nabídku' },
  { id: 6, time: '13:45–14:30', name: 'Práce se stávajícími smlouvami', durationMin: 45, activeRatio: '75 %', goal: 'Pochopit lhůty, výročí, výpovědi a bezpečný přechod klienta.', icon: 'file-text',        arenaType: 'timeline-branch',  tagline: 'Lhůty rozhodují' },
  { id: 7, time: '14:45–15:45', name: 'Obchodní rozhovor a námitky',    durationMin: 60, activeRatio: '90 %', goal: 'Trénovat argumentaci a reagovat na námitky cena/konkurence.', icon: 'message-circle',     arenaType: 'objection-battle', tagline: 'Obstojíte?' },
  { id: 8, time: '15:45–16:00', name: 'Závěrečná reflexe a akční plán', durationMin: 15, activeRatio: '100 %', goal: 'Uzavřít den konkrétním cílem pro praxi.', icon: 'target',                              arenaType: 'commitment-arena', tagline: 'Váš závazek pro praxi' },
];

/* ==========================================================================
   ACTIVITIES — 40 activity definitions (5 per block)
   Each maps to a reusable template with specific config
   ========================================================================== */
export const activities = [
  // ── Block 1: Úvod do reality škod ──
  { id: 'b1a1', blockId: 1, idx: 0, name: 'Slider na odhad škod', recommended: true, template: 'estimate',
    config: { items: 'damageScenarios', unit: 'Kč', min: 0, max: 500000, step: 5000, revealMode: 'host', showDistribution: true },
    brief: 'Každý tipuje výši škody. Host odhalí realitu.' },
  { id: 'b1a2', blockId: 1, idx: 1, name: 'Týmová aukce oprav', template: 'auction',
    config: { items: 'repairItems', budget: 300000, teamBased: true },
    brief: 'Týmy draží rozpočet na opravy a skládají správné řešení.' },
  { id: 'b1a3', blockId: 1, idx: 2, name: 'Pexeso událost / dopad', template: 'matching',
    config: { pairs: 'eventImpactPairs', timeLimit: 90 },
    brief: 'Matching hra – spáruj událost s finančním dopadem.' },
  { id: 'b1a4', blockId: 1, idx: 3, name: 'Obhajoba platby ze svého', template: 'vote',
    config: { items: 'selfPayScenarios', options: ['Zaplatím sám', 'Pojistím se'], revealMode: 'host' },
    brief: 'U každého scénáře rozhodněte – platit, nebo pojistit?' },
  { id: 'b1a5', blockId: 1, idx: 4, name: 'Rychlý kvíz s daty', template: 'quiz',
    config: { questions: 'damageQuizQuestions', timePerQuestion: 15, showLeaderboard: true },
    brief: 'Realtime multiple choice s leaderboardem.' },

  // ── Block 2: Mapa rizik a parametrů ──
  { id: 'b2a1', blockId: 2, idx: 0, name: 'Klientské složky 3 rodin', recommended: true, template: 'scenario',
    config: { cases: 'familyCases', mode: 'workspace' },
    brief: 'Interaktivní case workspace – analyzujte rizika 3 rodin.' },
  { id: 'b2a2', blockId: 2, idx: 1, name: 'Hledání argumentů pro likvidátora', template: 'sort',
    config: { items: 'liquidatorArguments', categories: 'argumentCategories', mode: 'drag-drop' },
    brief: 'Roztřiďte argumenty a důkazy do správných kategorií.' },
  { id: 'b2a3', blockId: 2, idx: 2, name: 'Časovka s definicemi', template: 'quiz',
    config: { questions: 'definitionQuestions', timePerQuestion: 10, showLeaderboard: true },
    brief: 'Rapid-fire quiz – definice pojištění na čas.' },
  { id: 'b2a4', blockId: 2, idx: 3, name: 'Vizuální mapa z kartiček', template: 'sort',
    config: { items: 'riskCards', categories: 'riskMapCategories', mode: 'collaborative' },
    brief: 'Společně roztřiďte rizika do vizuální mapy.' },
  { id: 'b2a5', blockId: 2, idx: 4, name: 'Terče krytí a výluk', template: 'sort',
    config: { items: 'coverageItems', categories: 'coverageBuckets', mode: 'bucket' },
    brief: 'Přiřaďte rizika do správných bucketů krytí.' },

  // ── Block 3: Kdo nese odpovědnost? ──
  { id: 'b3a1', blockId: 3, idx: 0, name: 'Swipe classifier', recommended: true, template: 'classify',
    config: { items: 'responsibilitySituations', categories: ['Občanská odpovědnost', 'Odpovědnost z nemovitosti', 'Výluka'], mode: 'swipe' },
    brief: 'Klasifikujte situace swipem – odpovědnost nebo výluka?' },
  { id: 'b3a2', blockId: 3, idx: 1, name: 'Kinetická hra v rozích', template: 'classify',
    config: { items: 'cornerSituations', categories: ['Roh A – Občanská', 'Roh B – Nemovitost', 'Roh C – Výluka', 'Roh D – Nejasné'], mode: 'corners' },
    brief: 'Digitální varianta se 4 rohy – kam patří situace?' },
  { id: 'b3a3', blockId: 3, idx: 2, name: 'Barevné hlasování', template: 'vote',
    config: { items: 'votingSituations', options: ['Ano, kryto', 'Ne, výluka', 'Záleží na podmínkách'], revealMode: 'instant' },
    brief: 'Instant reveal – skupina hlasuje, výsledky ihned.' },
  { id: 'b3a4', blockId: 3, idx: 3, name: 'Tvorba hraničních případů', template: 'freeInput',
    config: { prompt: 'Vytvořte scénář, kde není jasné, kdo nese odpovědnost.', mode: 'team-create', votable: true },
    brief: 'Týmy skládají tricky scénáře pro ostatní.' },
  { id: 'b3a5', blockId: 3, idx: 4, name: 'Analýza vůči konkurenci', template: 'scenario',
    config: { cases: 'competitorComparisons', mode: 'comparison' },
    brief: 'Srovnání nad konkrétní situací – ČS vs. konkurence.' },

  // ── Block 4: Přechod k nabídce ──
  { id: 'b4a1', blockId: 4, idx: 0, name: 'Buddy drill přechodové věty', recommended: true, template: 'roleplay',
    config: { mode: 'pairs', rounds: 3, timePerRound: 60, roles: ['Bankéř', 'Klient'], prompts: 'transitionPrompts' },
    brief: 'Párový režim s rychlým střídáním rolí.' },
  { id: 'b4a2', blockId: 4, idx: 1, name: 'Ping-pong frází', template: 'roleplay',
    config: { mode: 'pairs', rounds: 5, timePerRound: 30, roles: ['Iniciátor', 'Reaktor'], prompts: 'phrasePrompts' },
    brief: 'Krátké formulace a reakce – přirozený ping-pong.' },
  { id: 'b4a3', blockId: 4, idx: 2, name: 'Pospíchající klient', template: 'roleplay',
    config: { mode: 'pairs', rounds: 3, timePerRound: 45, roles: ['Bankéř', 'Pospíchající klient'], prompts: 'rushingClientPrompts', pressure: true },
    brief: 'Timed objection simulator – klient nemá čas.' },
  { id: 'b4a4', blockId: 4, idx: 3, name: 'Slepý rozhovor bez monitoru', template: 'roleplay',
    config: { mode: 'pairs', rounds: 2, timePerRound: 120, roles: ['Bankéř (bez systému)', 'Klient'], prompts: 'blindConvoPrompts', noScreen: true },
    brief: 'Conversational confidence mode – bez opory systému.' },
  { id: 'b4a5', blockId: 4, idx: 4, name: 'Analýza videoukázek', template: 'review',
    config: { items: 'videoExamples', mode: 'critique', criteria: 'transitionCriteria' },
    brief: 'Structured critique board – hodnoťte přechody.' },

  // ── Block 5: Modelování nabídek ──
  { id: 'b5a1', blockId: 5, idx: 0, name: 'Modelování zadání 3 rodin', recommended: true, template: 'scenario',
    config: { cases: 'familyModelCases', mode: 'guided-build' },
    brief: 'Guided model builder – krok za krokem.' },
  { id: 'b5a2', blockId: 5, idx: 1, name: 'Štafeta s prohozením rolí', template: 'roleplay',
    config: { mode: 'rotation', rounds: 3, timePerRound: 180, roles: ['Tvůrce nabídky', 'Kontrolor'], prompts: 'handoffPrompts' },
    brief: 'Handoff challenge – předej rozdělanou nabídku kolegovi.' },
  { id: 'b5a3', blockId: 5, idx: 2, name: 'Audit hotových nabídek', template: 'review',
    config: { items: 'completedOffers', mode: 'peer-review', criteria: 'offerAuditCriteria' },
    brief: 'Peer review mode – najdi chyby v nabídkách.' },
  { id: 'b5a4', blockId: 5, idx: 3, name: 'Poskládání řešení do rozpočtu', template: 'estimate',
    config: { items: 'budgetScenarios', unit: 'Kč', min: 0, max: 10000, step: 100, mode: 'budget-allocation' },
    brief: 'Trade-off simulator – vejděte se do rozpočtu klienta.' },
  { id: 'b5a5', blockId: 5, idx: 4, name: 'Modelování s náhlou změnou', template: 'scenario',
    config: { cases: 'changeEventCases', mode: 'live-change', hostInjected: true },
    brief: 'Live change event – host injektuje změnu zadání.' },

  // ── Block 6: Práce se stávajícími smlouvami ──
  { id: 'b6a1', blockId: 6, idx: 0, name: 'Časová osa výpovědí', recommended: true, template: 'sort',
    config: { items: 'timelineEvents', categories: 'timelinePositions', mode: 'timeline' },
    brief: 'Timeline puzzle – seřaďte kroky výpovědi.' },
  { id: 'b6a2', blockId: 6, idx: 1, name: 'Lhůty ve starých smlouvách', template: 'quiz',
    config: { questions: 'deadlineQuestions', timePerQuestion: 20, showLeaderboard: true },
    brief: 'Deadline checker – znáte zákonné lhůty?' },
  { id: 'b6a3', blockId: 6, idx: 2, name: 'Rozhodovací strom digitálně', template: 'scenario',
    config: { cases: 'terminationDecisionTree', mode: 'branching' },
    brief: 'Guided branching simulator – rozhodněte správně.' },
  { id: 'b6a4', blockId: 6, idx: 3, name: 'Pohotovostní dotazy', template: 'quiz',
    config: { questions: 'emergencyQuestions', timePerQuestion: 12, showLeaderboard: true, mode: 'rapid-fire' },
    brief: 'Fast-response drill – rychlé odpovědi na dotazy klientů.' },
  { id: 'b6a5', blockId: 6, idx: 4, name: 'Navigace klienta po telefonu', template: 'roleplay',
    config: { mode: 'pairs', rounds: 2, timePerRound: 180, roles: ['Bankéř', 'Klient (telefon)'], prompts: 'phoneNavPrompts', phoneMode: true },
    brief: 'Conversational decision support – veďte klienta telefonem.' },

  // ── Block 7: Obchodní rozhovor a námitky ──
  { id: 'b7a1', blockId: 7, idx: 0, name: 'Rozhovory ve trojicích', template: 'roleplay',
    config: { mode: 'triples', rounds: 3, timePerRound: 300, roles: ['Bankéř', 'Klient', 'Pozorovatel'], prompts: 'tripleRoleplayPrompts' },
    brief: 'Structured roleplay – tři role, checklist.' },
  { id: 'b7a2', blockId: 7, idx: 1, name: 'Speed-dating s námitkami', recommended: true, template: 'roleplay',
    config: { mode: 'speed-dating', rounds: 6, timePerRound: 90, roles: ['Bankéř', 'Námitka'], prompts: 'objectionPrompts', rotation: true },
    brief: 'Rotation engine – projdi min. 3 námitky.' },
  { id: 'b7a3', blockId: 7, idx: 2, name: 'Vyjednávání nad kartami argumentů', template: 'review',
    config: { items: 'argumentCards', mode: 'card-battle', criteria: 'argumentStrength' },
    brief: 'Card battle – obhaj svůj argument.' },
  { id: 'b7a4', blockId: 7, idx: 3, name: 'Obhajoba nabídky před skupinou', template: 'vote',
    config: { items: 'offerDefenseScenarios', options: ['Přesvědčivé', 'Částečně', 'Nepřesvědčivé'], revealMode: 'host', presentationMode: true },
    brief: 'Prezentace + hlasování skupiny.' },
  { id: 'b7a5', blockId: 7, idx: 4, name: 'Řešení námitek od lektora', template: 'roleplay',
    config: { mode: 'host-challenge', rounds: 5, timePerRound: 60, roles: ['Bankéř'], prompts: 'hostObjectionPrompts', hostInjected: true },
    brief: 'Live challenge injection – lektor hází námitky.' },

  // ── Block 8: Závěrečná reflexe ──
  { id: 'b8a1', blockId: 8, idx: 0, name: 'Sdílení 1 klíčové věci', recommended: true, template: 'freeInput',
    config: { prompt: 'Co je ta jedna věc, kterou si z dnešního dne odnášíte?', mode: 'circle-share', charLimit: 200 },
    brief: 'Kruhové sdílení – jedna věc od každého.' },
  { id: 'b8a2', blockId: 8, idx: 1, name: 'Písemný akční plán', template: 'freeInput',
    config: { prompt: 'Co konkrétně zítra uděláte jinak u klienta?', mode: 'action-plan', charLimit: 300, structured: true },
    brief: 'Konkrétní, měřitelný závazek.' },
  { id: 'b8a3', blockId: 8, idx: 2, name: 'Párový závazek', template: 'freeInput',
    config: { prompt: 'Řekněte kolegovi svůj závazek. Kolega ho zapíše.', mode: 'partner-commit', paired: true },
    brief: 'Vzájemný závazek mezi kolegy.' },
  { id: 'b8a4', blockId: 8, idx: 3, name: 'Digitální výstup', template: 'freeInput',
    config: { prompt: 'Zapište svůj akční plán – pošleme vám ho e-mailem.', mode: 'digital-export', exportable: true },
    brief: 'Záznam plánu k odeslání.' },
  { id: 'b8a5', blockId: 8, idx: 4, name: 'Skupinový závazkový wall', template: 'freeInput',
    config: { prompt: 'Přidejte svůj závazek na společnou zeď.', mode: 'group-wall', anonymous: false, votable: true },
    brief: 'Společná zeď závazků celé skupiny.' },
];

/** Get activities for a specific block */
export function getBlockActivities(blockId) {
  return activities.filter(a => a.blockId === blockId);
}

/** Get the recommended activity for a block */
export function getRecommendedActivity(blockId) {
  return activities.find(a => a.blockId === blockId && a.recommended);
}

/* ==========================================================================
   CONTENT DATA LAYER — structured content for activities
   All items marked _validated: false need business team review
   ========================================================================== */

export const contentData = {
  /* ── Damage scenarios (B1A1) ── */
  damageScenarios: [
    { id: 'ds1', label: 'Záplava bytu', desc: 'Přízemní byt 2+kk – havárie potrubí, voda v celém bytě.', realValue: 180000, _validated: false },
    { id: 'ds2', label: 'Požár garsonky', desc: 'Garsonka 28 m² – vadná elektronika, kompletní vyhoření.', realValue: 420000, _validated: false },
    { id: 'ds3', label: 'Krádež vybavení', desc: 'Vloupání do 3+1 – elektronika, šperky, hotovost.', realValue: 95000, _validated: false },
    { id: 'ds4', label: 'Vichřice – střecha', desc: 'Rodinný dům – stržená část střechy po vichřici.', realValue: 280000, _validated: false },
    { id: 'ds5', label: 'Poškození vodou ze střechy', desc: 'Byt 4+1 – zatečení přes střechu při dešti.', realValue: 120000, _validated: false },
  ],

  /* ── Repair items for auction (B1A2) ── */
  repairItems: [
    { id: 'ri1', name: 'Podlahy – výměna', cost: 85000, _validated: false },
    { id: 'ri2', name: 'Elektroinstalace', cost: 45000, _validated: false },
    { id: 'ri3', name: 'Vysoušení zdí', cost: 35000, _validated: false },
    { id: 'ri4', name: 'Výmalba', cost: 15000, _validated: false },
    { id: 'ri5', name: 'Nový nábytek', cost: 60000, _validated: false },
    { id: 'ri6', name: 'Spotřebiče', cost: 40000, _validated: false },
  ],

  /* ── Event-impact pairs for matching (B1A3) ── */
  eventImpactPairs: [
    { event: 'Záplava bytu', impact: '180 000 Kč', _validated: false },
    { event: 'Požár garsonky', impact: '420 000 Kč', _validated: false },
    { event: 'Vloupání', impact: '95 000 Kč', _validated: false },
    { event: 'Vichřice – střecha', impact: '280 000 Kč', _validated: false },
    { event: 'Vandalismus', impact: '45 000 Kč', _validated: false },
    { event: 'Zkrat – požár', impact: '350 000 Kč', _validated: false },
  ],

  /* ── Self-pay scenarios (B1A4) ── */
  selfPayScenarios: [
    { id: 'sp1', text: 'Soused vám vytopil byt – škoda 180 000 Kč.', _validated: false },
    { id: 'sp2', text: 'Dětem se rozbila televize – 25 000 Kč.', _validated: false },
    { id: 'sp3', text: 'Požár v kuchyni – škoda 350 000 Kč.', _validated: false },
    { id: 'sp4', text: 'Ukradli vám kolo ze sklepa – 15 000 Kč.', _validated: false },
    { id: 'sp5', text: 'Vichřice poškodila fasádu – 120 000 Kč.', _validated: false },
  ],

  /* ── Quiz questions (B1A5) ── */
  damageQuizQuestions: [
    { q: 'Jaká je průměrná škoda při záplavě bytu v ČR?', options: ['80 000 Kč', '180 000 Kč', '350 000 Kč', '50 000 Kč'], correct: 1, _validated: false },
    { q: 'Kolik stojí kompletní obnova garsonky po požáru?', options: ['200 000 Kč', '420 000 Kč', '150 000 Kč', '600 000 Kč'], correct: 1, _validated: false },
    { q: 'Jaká je průměrná hodnota odcizených věcí při vloupání?', options: ['30 000 Kč', '95 000 Kč', '200 000 Kč', '15 000 Kč'], correct: 1, _validated: false },
  ],

  /* ── Family cases (B2A1, B5A1) ── */
  familyCases: [
    { id: 'fam1', name: 'Novákovi', type: 'Panelák 3+1', members: '2 dospělí, 2 děti', risks: ['záplava', 'vloupání', 'odpovědnost za děti'], _validated: false },
    { id: 'fam2', name: 'Svobodovi', type: 'Rodinný dům se zahradou', members: '2 dospělí, pes', risks: ['vichřice', 'požár', 'odpovědnost za psa', 'strom na souseda'], _validated: false },
    { id: 'fam3', name: 'Horáčkovi', type: 'Chalupa + pronájem bytu', members: '2 dospělí (senioři)', risks: ['odpovědnost pronajímatele', 'pojištění nájemníků', 'živelní rizika na chalupě'], _validated: false },
  ],

  /* ── Responsibility situations (B3A1) ── */
  responsibilitySituations: [
    { id: 'rs1', text: 'Přetekla vám vana – voda zatekla k sousedovi.', correct: 'Občanská odpovědnost', explanation: 'Pojištění občanské odpovědnosti v rámci pojištění domácnosti.', _validated: false },
    { id: 'rs2', text: 'Pes pokousal sousedovo dítě na zahradě.', correct: 'Občanská odpovědnost', explanation: 'Odpovídáte jako vlastník psa – krytí v pojištění domácnosti.', _validated: false },
    { id: 'rs3', text: 'Strom z vašeho pozemku padl na auto souseda.', correct: 'Odpovědnost z nemovitosti', explanation: 'Jako vlastník pozemku – pojištění odpovědnosti vlastníka nemovitosti.', _validated: false },
    { id: 'rs4', text: 'Dítě (10 let) rozbilo okno souseda.', correct: 'Občanská odpovědnost', explanation: 'Rodičovská odpovědnost – pojištění odpovědnosti v domácnosti.', _validated: false },
    { id: 'rs5', text: 'Z vaší střechy spadla taška na chodce.', correct: 'Odpovědnost z nemovitosti', explanation: 'Odpovědnost vlastníka nemovitosti za stav budovy.', _validated: false },
    { id: 'rs6', text: 'Váš zaměstnanec poškodil majetek klienta.', correct: 'Výluka', explanation: 'Odpovědnost zaměstnavatele – řeší se přes pojištění profesní odpovědnosti.', _validated: false },
  ],

  /* ── Objection cards (B7A2, B7A5) ── */
  objectionCards: [
    { id: 'oc1', text: 'To je příliš drahé.', type: 'price', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc2', text: 'U konkurence mám lepší cenu.', type: 'competition', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc3', text: 'Pojištění nepotřebuji.', type: 'rejection', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc4', text: 'Manžel/ka to musí schválit.', type: 'authority', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc5', text: 'Zavolám vám příští týden.', type: 'postpone', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc6', text: 'Mám pojištění jinde, stačí mi.', type: 'status-quo', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc7', text: 'Nikdy se mi nic nestalo.', type: 'rejection', suggestedResponse: 'TODO: Validated response needed', _validated: false },
    { id: 'oc8', text: 'Nemám na to rozpočet.', type: 'price', suggestedResponse: 'TODO: Validated response needed', _validated: false },
  ],

  /* ── Definition questions (B2A3) ── */
  definitionQuestions: [
    { q: 'Co kryje pojištění domácnosti?', options: ['Movité věci v bytě', 'Stavbu budovy', 'Auto v garáži', 'Pozemek'], correct: 0, _validated: false },
    { q: 'Co je spoluúčast?', options: ['Částka, kterou platí pojištěný', 'Sleva na pojistném', 'Bonus za bezškodní průběh', 'Limit plnění'], correct: 0, _validated: false },
    { q: 'Co je pojistná hodnota?', options: ['Hodnota pojištěného majetku', 'Výše pojistného', 'Limit plnění', 'Cena pojistky'], correct: 0, _validated: false },
  ],

  /* ── Deadline questions (B6A2) ── */
  deadlineQuestions: [
    { q: 'Kolik týdnů před výročím musí být doručena výpověď?', options: ['4 týdny', '6 týdnů', '8 týdnů', '2 týdny'], correct: 1, _validated: false },
    { q: 'Do kdy lze podat mimořádnou výpověď po pojistné události?', options: ['1 měsíc', '3 měsíce', '6 měsíců', '14 dní'], correct: 0, _validated: false },
  ],

  /* ── Transition prompts (B4A1-A4) ── */
  transitionPrompts: [
    { round: 1, context: 'Klient právě popsal svou bytovou situaci.', task: 'Přirozeně přejděte k nabídce pojištění.', _validated: false },
    { round: 2, context: 'Klient říká, že už má pojištění jinde.', task: 'Nabídněte srovnání bez tlaku.', _validated: false },
    { round: 3, context: 'Klient se ptá na hypotéku, ne na pojištění.', task: 'Navažte na téma bydlení a přejděte k pojištění.', _validated: false },
  ],

  /* ── Termination decision tree (B6A3) ── */
  terminationDecisionTree: [
    { id: 'td-start', question: 'Chce klient přejít k pojištění ČS?', options: [{ text: 'Ano', next: 'td-anniversary' }, { text: 'Ne / Nejasné', next: 'td-no-intent' }] },
    { id: 'td-anniversary', question: 'Znáte datum výročí stávající smlouvy?', options: [{ text: 'Ano', next: 'td-6weeks' }, { text: 'Ne', next: 'td-find' }] },
    { id: 'td-6weeks', question: 'Je výročí za více než 6 týdnů?', options: [{ text: 'Ano', next: 'td-ok' }, { text: 'Ne', next: 'td-extraordinary' }] },
    { id: 'td-extraordinary', question: 'Existuje důvod pro mimořádnou výpověď?', options: [{ text: 'Ano', next: 'td-ok-extra' }, { text: 'Ne', next: 'td-wait' }] },
    { id: 'td-ok', result: 'success', text: 'Lze podat výpověď ke konci pojistného období.' },
    { id: 'td-ok-extra', result: 'warning', text: 'Mimořádná výpověď je možná – ověřit podmínky.' },
    { id: 'td-wait', result: 'danger', text: 'Výpověď nyní není možná – čekat na příští výročí.' },
    { id: 'td-no-intent', result: 'warning', text: 'Záměr není jasný – vrátit se k potřebám klienta.' },
    { id: 'td-find', result: 'info', text: 'Zjistit datum výročí smlouvy.' },
  ],

  // Placeholder for all other content – to be filled by business team
  // Each key matches the config reference in activities above
  liquidatorArguments: [],      // TODO: needs validation
  argumentCategories: [],       // TODO: needs validation
  riskCards: [],                // TODO: needs validation
  riskMapCategories: [],        // TODO: needs validation
  coverageItems: [],            // TODO: needs validation
  coverageBuckets: [],          // TODO: needs validation
  cornerSituations: [],         // TODO: needs validation
  votingSituations: [],         // TODO: needs validation
  competitorComparisons: [],    // TODO: needs validation
  phrasePrompts: [],            // TODO: needs validation
  rushingClientPrompts: [],     // TODO: needs validation
  blindConvoPrompts: [],        // TODO: needs validation
  videoExamples: [],            // TODO: needs validation
  transitionCriteria: [],       // TODO: needs validation
  familyModelCases: [],         // TODO: needs validation
  handoffPrompts: [],           // TODO: needs validation
  completedOffers: [],          // TODO: needs validation
  offerAuditCriteria: [],       // TODO: needs validation
  budgetScenarios: [],          // TODO: needs validation
  changeEventCases: [],         // TODO: needs validation
  timelineEvents: [],           // TODO: needs validation
  timelinePositions: [],        // TODO: needs validation
  emergencyQuestions: [],       // TODO: needs validation
  phoneNavPrompts: [],          // TODO: needs validation
  tripleRoleplayPrompts: [],    // TODO: needs validation
  objectionPrompts: [],         // TODO: needs validation
  argumentCards: [],            // TODO: needs validation
  argumentStrength: [],         // TODO: needs validation
  offerDefenseScenarios: [],    // TODO: needs validation
  hostObjectionPrompts: [],     // TODO: needs validation
};

/* ==========================================================================
   VERSIONED MARKET DATA — ČAP and public industry statistics
   Source: ČAP annual reports and public communications
   ========================================================================== */
export const marketData = {
  cap2024: {
    _source_name: 'ČAP – Česká asociace pojišťoven',
    _source_url: 'https://www.cap.cz',
    _retrieved_at: '2025-03-01',
    _validated: true,
    _confidence: 'high',
    _product_area: 'majetek',
    _tags: ['trh', 'statistika', 'škody', '2024'],
    _valid_from: '2024-01-01',
    _notes: 'Data za rok 2024 dle veřejných zpráv ČAP',
    totalClaimCosts_mld: 37.4,
    floodClaims_mld: 19.7,
    totalClaimEvents: 576000,
    displayTexts: {
      headline: '37,4 mld. Kč',
      subline: 'Náklady na pojistná plnění v majetku za rok 2024',
      floodLine: '19,7 mld. Kč hlášených povodňových škod',
      eventsLine: '576 tisíc pojistných událostí v majetku',
    },
  },
};

/* ==========================================================================
   COMPETITOR DATA — Kooperativa public product information
   Source: Official Kooperativa.cz public pages
   ========================================================================== */
export const competitorData = {
  kooperativa: {
    _source_name: 'Kooperativa pojišťovna – veřejná komunikace',
    _source_url: 'https://www.koop.cz',
    _retrieved_at: '2025-03-01',
    _validated: true,
    _confidence: 'high',
    _competitor: 'Kooperativa',
    _tags: ['konkurence', 'produkty', 'majetek'],
    _needs_legal: false,
    _needs_business: true,
    _notes: 'Veřejně dostupné informace z webu Kooperativy',

    rodinnyDum: {
      variants: ['PRIMA', 'KOMFORT'],
      prima: {
        label: 'PRIMA',
        covers: ['základní rizika', 'asistence'],
        _notes: 'Základní varianta',
      },
      komfort: {
        label: 'KOMFORT',
        covers: ['základní rizika', 'asistence', 'krádež', 'vandalismus', 'havárie rozvodů', 'zatečení vodou střechou/oknem', 'poškození zateplení a oplocení zvířetem'],
        _notes: 'Rozšířená varianta s nadstandardním krytím',
      },
    },

    domacnost: {
      risks: ['krádež/loupež', 'vandalismus', 'asistenční služby', 'náhradní ubytování', 'přepětí/podpětí v síti', 'zatečení atmosférických srážek', 'únik vody', 'havárie rozvodů', 'výměna zámků', 'rozbití skel a sanity', 'benefit OBNOVA při velké škodě'],
      _notes: 'Souhrnný přehled komunikovaných rizik',
    },

    novinky: [
      { text: 'Kontinuálně pojištěné věci v autě', _validated: true },
      { text: 'Krádež a vandalismus dostupný i v PRIMA', _validated: true },
      { text: 'Odpovědnost v běžném občanském životě – možnost sjednat samostatně', _validated: true },
      { text: 'Limit po každé pojistné události místo za rok', _validated: true },
    ],
  },
};
