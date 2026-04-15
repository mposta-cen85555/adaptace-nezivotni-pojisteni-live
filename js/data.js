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

  /* ── Liquidator arguments (B2A2) ── */
  liquidatorArguments: [
    { id: 'la1', text: 'Fotodokumentace škody z místa události', category: 'důkazy', _validated: false },
    { id: 'la2', text: 'Výpověď svědka – souseda', category: 'svědectví', _validated: false },
    { id: 'la3', text: 'Faktura za opravu od certifikované firmy', category: 'důkazy', _validated: false },
    { id: 'la4', text: 'Zápis hasičského záchranného sboru', category: 'úřední', _validated: false },
    { id: 'la5', text: 'Původní účtenka za poškozenou věc', category: 'důkazy', _validated: false },
    { id: 'la6', text: 'Protokol policie o vloupání', category: 'úřední', _validated: false },
  ],
  argumentCategories: [
    { id: 'ac1', label: 'Důkazy a dokumentace', key: 'důkazy', _validated: false },
    { id: 'ac2', label: 'Svědecké výpovědi', key: 'svědectví', _validated: false },
    { id: 'ac3', label: 'Úřední záznamy', key: 'úřední', _validated: false },
  ],

  /* ── Risk cards (B2A4) ── */
  riskCards: [
    { id: 'rc1', label: 'Požár', description: 'Oheň z vlastního nebo cizího zdroje', category: 'živel', _validated: false },
    { id: 'rc2', label: 'Záplava / povodeň', description: 'Voda z přírodních zdrojů nebo havárie', category: 'živel', _validated: false },
    { id: 'rc3', label: 'Vloupání', description: 'Neoprávněný vstup a odcizení věcí', category: 'krádež', _validated: false },
    { id: 'rc4', label: 'Vandalismus', description: 'Úmyslné poškození cizí osobou', category: 'krádež', _validated: false },
    { id: 'rc5', label: 'Odpovědnost za škodu dítětem', description: 'Dítě poškodí cizí majetek', category: 'odpovědnost', _validated: false },
    { id: 'rc6', label: 'Pád stromu na sousedův dům', description: 'Strom z vlastního pozemku', category: 'odpovědnost', _validated: false },
  ],
  riskMapCategories: [
    { id: 'rmc1', label: 'Živelní rizika', key: 'živel', _validated: false },
    { id: 'rmc2', label: 'Krádež a vandalismus', key: 'krádež', _validated: false },
    { id: 'rmc3', label: 'Odpovědnostní rizika', key: 'odpovědnost', _validated: false },
  ],

  /* ── Coverage items and buckets (B2A5) ── */
  coverageItems: [
    { id: 'ci1', label: 'Požár a výbuch', bucket: 'pojištění nemovitosti', _validated: false },
    { id: 'ci2', label: 'Krádež vloupáním', bucket: 'pojištění domácnosti', _validated: false },
    { id: 'ci3', label: 'Vichřice a krupobití', bucket: 'pojištění nemovitosti', _validated: false },
    { id: 'ci4', label: 'Odpovědnost za škodu způsobenou psem', bucket: 'odpovědnost', _validated: false },
    { id: 'ci5', label: 'Přepětí v elektroinstalaci', bucket: 'pojištění domácnosti', _validated: false },
    { id: 'ci6', label: 'Pád stromu na sousedovu zeď', bucket: 'odpovědnost', _validated: false },
  ],
  coverageBuckets: [
    { id: 'cb1', label: 'Pojištění nemovitosti', key: 'pojištění nemovitosti', _validated: false },
    { id: 'cb2', label: 'Pojištění domácnosti', key: 'pojištění domácnosti', _validated: false },
    { id: 'cb3', label: 'Pojištění odpovědnosti', key: 'odpovědnost', _validated: false },
  ],

  /* ── Corner situations (B3A2) ── */
  cornerSituations: [
    { id: 'cs1', text: 'Vytopili jste souseda pod vámi – prasklá hadička u pračky.', correct: 'Roh A – Občanská', explanation: 'Škoda způsobená vaší nedbalostí – občanská odpovědnost.', _validated: false },
    { id: 'cs2', text: 'Opadávající omítka z vašeho domu poškodila zaparkované auto.', correct: 'Roh B – Nemovitost', explanation: 'Odpovědnost vlastníka nemovitosti za stav budovy.', _validated: false },
    { id: 'cs3', text: 'Řidič taxíku způsobil nehodu s vaším autem při práci.', correct: 'Roh C – Výluka', explanation: 'Profesní odpovědnost zaměstnavatele – mimo běžné občanské pojištění.', _validated: false },
    { id: 'cs4', text: 'Váš pes utekl a pokousal cyklistu na veřejné cestě.', correct: 'Roh A – Občanská', explanation: 'Odpovědnost vlastníka zvířete v běžném občanském životě.', _validated: false },
    { id: 'cs5', text: 'Ze střechy vašeho domu sjel sníh na chodce.', correct: 'Roh B – Nemovitost', explanation: 'Povinnost vlastníka nemovitosti udržovat bezpečný stav.', _validated: false },
    { id: 'cs6', text: 'Klient si stěžuje na špatnou radu od finančního poradce.', correct: 'Roh D – Nejasné', explanation: 'Hraniční případ – může jít o profesní odpovědnost.', _validated: false },
  ],

  /* ── Voting situations (B3A3) ── */
  votingSituations: [
    { id: 'vs1', text: 'Klient má bazén a soused se v něm utopí – kryje to pojištění nemovitosti?', _validated: false },
    { id: 'vs2', text: 'Klient provozuje Airbnb v bytě – vztahuje se pojištění domácnosti?', _validated: false },
    { id: 'vs3', text: 'Dítě (5 let) hodí kámen a rozbije auto souseda – kryto odpovědností?', _validated: false },
    { id: 'vs4', text: 'Klient zapomene zavřít okno a déšť zničí nábytek – hradí pojistka?', _validated: false },
  ],

  /* ── Competitor comparisons (B3A5) ── */
  competitorComparisons: [
    { id: 'cc1', name: 'Záplava bytu – PRIMA vs. ČS', situation: 'Záplava přízemního bytu – škoda na domácnosti i nemovitosti.', csAdvantage: 'Širší krytí zatečení bez příplatku v základní variantě.', koopNote: 'PRIMA kryje základní živelní rizika, rozšíření v KOMFORT.', _validated: false },
    { id: 'cc2', name: 'Odpovědnost za psa – srovnání', situation: 'Pes pokouše souseda – klient potřebuje krytí odpovědnosti.', csAdvantage: 'Odpovědnost za zvíře součástí pojištění domácnosti.', koopNote: 'Odpovědnost v běžném občanském životě – možno sjednat samostatně.', _validated: false },
    { id: 'cc3', name: 'Limit plnění po události', situation: 'Klient má druhou pojistnou událost v roce – jak fungují limity?', csAdvantage: 'Standardní roční limity dle varianty.', koopNote: 'Novinka: limit po každé pojistné události místo za rok.', _validated: false },
  ],

  /* ── Phrase prompts (B4A2) ── */
  phrasePrompts: [
    { round: 1, context: 'Klient říká: „Přišel jsem kvůli spoření."', task: 'Reagujte jednou větou a přirozeně otevřete téma pojištění.', _validated: false },
    { round: 2, context: 'Klient říká: „Nedávno jsme se přestěhovali."', task: 'Navažte na stěhování a zjistěte stav pojištění.', _validated: false },
    { round: 3, context: 'Klient říká: „Máme malé děti, hodně toho ničí."', task: 'Přirozeně přejděte k pojištění odpovědnosti.', _validated: false },
    { round: 4, context: 'Klient říká: „Bydlíme v rodinném domě."', task: 'Zjistěte, zda má pojištění nemovitosti.', _validated: false },
    { round: 5, context: 'Klient říká: „Řešíme rekonstrukci koupelny."', task: 'Upozorněte na riziko pojistné události při rekonstrukci.', _validated: false },
  ],

  /* ── Rushing client prompts (B4A3) ── */
  rushingClientPrompts: [
    { round: 1, context: 'Klient: „Mám schůzku za 10 minut, pojďme to rychle."', task: 'Stručně a efektivně zjistěte klíčové potřeby.', _validated: false },
    { round: 2, context: 'Klient: „To pojištění teď neřeším, přišel jsem kvůli účtu."', task: 'Respektujte, ale zanechte zájem o budoucí schůzku.', _validated: false },
    { round: 3, context: 'Klient: „Nemám čas na detaily, řekněte mi jen cenu."', task: 'Sdělte orientační rozsah a nabídněte podrobnou schůzku.', _validated: false },
  ],

  /* ── Blind convo prompts (B4A4) ── */
  blindConvoPrompts: [
    { round: 1, context: 'Klient sedí před vámi – nemáte k dispozici žádný systém.', task: 'Zjistěte základní údaje pro pojištění pouze rozhovorem.', _validated: false },
    { round: 2, context: 'Klient popisuje svou životní situaci – vy si děláte poznámky na papír.', task: 'Identifikujte 3 hlavní rizika a navrhněte pokrytí.', _validated: false },
  ],

  /* ── Video examples (B4A5) ── */
  videoExamples: [
    { id: 've1', label: 'Ukázka A – příliš přímý přechod', description: 'Bankéř skočí rovnou k pojištění bez kontextu.', rating: 'slabé', _validated: false },
    { id: 've2', label: 'Ukázka B – přirozený přechod', description: 'Bankéř navazuje na klientovu zmínku o bydlení.', rating: 'silné', _validated: false },
    { id: 've3', label: 'Ukázka C – přechod přes životní událost', description: 'Bankéř využívá zmínku o narození dítěte.', rating: 'silné', _validated: false },
    { id: 've4', label: 'Ukázka D – zmeškaný moment', description: 'Klient sám zmíní riziko, bankéř nereaguje.', rating: 'slabé', _validated: false },
  ],
  transitionCriteria: [
    { id: 'tc1', label: 'Přirozenost přechodu', description: 'Byl přechod k nabídce plynulý a nenásilný?', weight: 3, _validated: false },
    { id: 'tc2', label: 'Navázání na kontext', description: 'Vycházel přechod z toho, co klient sám řekl?', weight: 3, _validated: false },
    { id: 'tc3', label: 'Zachování důvěry', description: 'Nenarušil přechod důvěru klienta?', weight: 2, _validated: false },
    { id: 'tc4', label: 'Jasnost sdělení', description: 'Bylo klientovi zřejmé, proč mluvíme o pojištění?', weight: 2, _validated: false },
  ],

  /* ── Family model cases (B5A1) ── */
  familyModelCases: [
    { id: 'fmc1', name: 'Novákovi – panelák', type: 'Byt 3+1 v panelovém domě', members: '2 dospělí, 2 děti (6 a 10 let)', budget: '500 Kč/měs.', needs: ['domácnost', 'odpovědnost za děti', 'pojištění bytu'], _validated: false },
    { id: 'fmc2', name: 'Svobodovi – rodinný dům', type: 'RD se zahradou a garáží', members: '2 dospělí, pes, kočka', budget: '800 Kč/měs.', needs: ['nemovitost', 'domácnost', 'odpovědnost za psa', 'garáž'], _validated: false },
    { id: 'fmc3', name: 'Horáčkovi – chalupa + byt', type: 'Pronájem bytu + rekreační chalupa', members: '2 senioři', budget: '600 Kč/měs.', needs: ['odpovědnost pronajímatele', 'pojištění chalupy', 'domácnost'], _validated: false },
  ],

  /* ── Handoff prompts (B5A2) ── */
  handoffPrompts: [
    { round: 1, context: 'Kolega rozdělaný model pro Novákovi – má vyplněnou nemovitost, chybí domácnost.', task: 'Převezměte model a doplňte pojištění domácnosti.', _validated: false },
    { round: 2, context: 'Kolega nastavil odpovědnost pro Svobodovi, ale zapomněl na psa.', task: 'Zkontrolujte a doplňte chybějící krytí.', _validated: false },
    { round: 3, context: 'Rozpracovaná nabídka pro Horáčkovi – pouze chalupa, chybí pronájem.', task: 'Doplňte pojištění odpovědnosti pronajímatele.', _validated: false },
  ],

  /* ── Completed offers for peer review (B5A3) ── */
  completedOffers: [
    { id: 'co1', label: 'Nabídka A – podpojištěná domácnost', description: 'Pojistná částka domácnosti 200 000 Kč pro byt 3+1 – pravděpodobně podpojištěno.', error: 'Nízká pojistná částka domácnosti', _validated: false },
    { id: 'co2', label: 'Nabídka B – chybějící odpovědnost', description: 'Pojištění nemovitosti i domácnosti OK, ale bez odpovědnosti – rodina s dětmi.', error: 'Chybí pojištění odpovědnosti', _validated: false },
    { id: 'co3', label: 'Nabídka C – správně sestavená', description: 'Kompletní pojištění RD + domácnost + odpovědnost, přiměřené limity.', error: null, _validated: false },
    { id: 'co4', label: 'Nabídka D – zbytečně drahá', description: 'Vysoké limity a nízká spoluúčast pro garsonku – předražená nabídka.', error: 'Nepřiměřený rozsah krytí k potřebám', _validated: false },
  ],
  offerAuditCriteria: [
    { id: 'oac1', label: 'Přiměřenost pojistných částek', description: 'Odpovídají pojistné částky reálné hodnotě majetku?', weight: 3, _validated: false },
    { id: 'oac2', label: 'Kompletnost krytí', description: 'Jsou pokryta všechna relevantní rizika klienta?', weight: 3, _validated: false },
    { id: 'oac3', label: 'Spoluúčast vs. pojistné', description: 'Je nastavení spoluúčasti optimální pro klienta?', weight: 2, _validated: false },
    { id: 'oac4', label: 'Rozpočet klienta', description: 'Vejde se nabídka do stanoveného rozpočtu?', weight: 2, _validated: false },
  ],

  /* ── Budget scenarios (B5A4) ── */
  budgetScenarios: [
    { id: 'bs1', label: 'Rodina, 500 Kč/měsíc', budget: 500, needs: ['domácnost', 'odpovědnost'], priorityOrder: ['domácnost', 'odpovědnost'], _validated: false },
    { id: 'bs2', label: 'Pár v RD, 800 Kč/měsíc', budget: 800, needs: ['nemovitost', 'domácnost', 'odpovědnost'], priorityOrder: ['nemovitost', 'domácnost', 'odpovědnost'], _validated: false },
    { id: 'bs3', label: 'Senior, 400 Kč/měsíc', budget: 400, needs: ['domácnost', 'odpovědnost'], priorityOrder: ['domácnost', 'odpovědnost'], _validated: false },
    { id: 'bs4', label: 'Pronajímatel, 700 Kč/měsíc', budget: 700, needs: ['nemovitost', 'odpovědnost pronajímatele', 'domácnost'], priorityOrder: ['nemovitost', 'odpovědnost pronajímatele', 'domácnost'], _validated: false },
  ],

  /* ── Change event cases (B5A5) ── */
  changeEventCases: [
    { id: 'cec1', name: 'Novákovi – nečekané dvojčata', initialSetup: 'Model pro 2+2 rodinu', change: 'Klientka otěhotněla s dvojčaty – mění se potřeby.', impact: 'Vyšší pojistné částky domácnosti, odpovědnost za 4 děti.', _validated: false },
    { id: 'cec2', name: 'Svobodovi – rekonstrukce', initialSetup: 'Model pro stávající RD', change: 'Klient oznamuje přístavbu patra za odhadovaných 1,5 mil. Kč.', impact: 'Přecenění nemovitosti, úprava pojistné částky.', _validated: false },
    { id: 'cec3', name: 'Horáčkovi – prodej chalupy', initialSetup: 'Model s chalupou + bytem', change: 'Senioři prodávají chalupu a kupují menší byt.', impact: 'Zrušení pojištění chalupy, nová smlouva pro druhý byt.', _validated: false },
  ],

  /* ── Timeline events and positions (B6A1) ── */
  timelineEvents: [
    { id: 'te1', label: 'Klient se rozhodne přejít k ČS', position: 1, description: 'Rozhodnutí o změně pojišťovny na základě nabídky.', _validated: false },
    { id: 'te2', label: 'Odeslání výpovědi stávající pojišťovně', position: 2, description: 'Písemná výpověď odeslaná doporučeně.', _validated: false },
    { id: 'te3', label: 'Doručení výpovědi (min. 6 týdnů před výročím)', position: 3, description: 'Výpověď musí být doručena min. 6 týdnů před výročím.', _validated: false },
    { id: 'te4', label: 'Konec pojistného období (výročí)', position: 4, description: 'Stará smlouva končí ke dni výročí.', _validated: false },
    { id: 'te5', label: 'Sjednání nové smlouvy u ČS', position: 5, description: 'Nová smlouva navazuje bez přerušení krytí.', _validated: false },
  ],
  timelinePositions: [
    { id: 'tp1', label: '8+ týdnů před výročím', position: 1, _validated: false },
    { id: 'tp2', label: '6–8 týdnů před výročím', position: 2, _validated: false },
    { id: 'tp3', label: '6 týdnů – výročí', position: 3, _validated: false },
    { id: 'tp4', label: 'Den výročí smlouvy', position: 4, _validated: false },
    { id: 'tp5', label: 'Po výročí – nová smlouva', position: 5, _validated: false },
  ],

  /* ── Emergency questions (B6A4) ── */
  emergencyQuestions: [
    { q: 'Klient volá: „Zítra mi končí smlouva, můžu ještě podat výpověď?"', options: ['Ano, stačí zavolat', 'Ne, je pozdě – min. 6 týdnů předem', 'Ano, stačí e-mail', 'Záleží na pojišťovně'], correct: 1, _validated: false },
    { q: 'Klient se ptá: „Měl jsem pojistnou událost – můžu odejít od pojišťovny?"', options: ['Ne, musí počkat na výročí', 'Ano, mimořádná výpověď do 1 měsíce', 'Ano, do 14 dní', 'Pouze pokud pojišťovna souhlasí'], correct: 1, _validated: false },
    { q: 'Klient říká: „Pojišťovna mi zvýšila pojistné – co s tím?"', options: ['Nic, musí zaplatit', 'Může podat výpověď do 1 měsíce od oznámení', 'Zvýšení je vždy nezákonné', 'Může to ignorovat'], correct: 1, _validated: false },
    { q: 'Kdy může klient vypovědět smlouvu bez udání důvodu?', options: ['Kdykoliv', 'Pouze do 2 měsíců od sjednání', 'K výročí s 6týdenní výpovědní lhůtou', 'Pouze po pojistné události'], correct: 2, _validated: false },
  ],

  /* ── Phone nav prompts (B6A5) ── */
  phoneNavPrompts: [
    { round: 1, context: 'Klient volá: „Chci zrušit pojistku u jiné pojišťovny a přejít k vám."', task: 'Proveďte klienta kroky výpovědi po telefonu.', _validated: false },
    { round: 2, context: 'Klient volá: „Nevím, kdy mi končí smlouva, nemám ji po ruce."', task: 'Poraďte, jak zjistit datum výročí, a domluvte postup.', _validated: false },
  ],

  /* ── Triple roleplay prompts (B7A1) ── */
  tripleRoleplayPrompts: [
    { round: 1, context: 'Klient s hypotékou – banka doporučuje pojištění nemovitosti.', bankéřTask: 'Představte nabídku a reagujte na dotazy.', klientTask: 'Ptejte se na cenu a srovnání s vaší stávající pojistkou.', pozorovatelTask: 'Sledujte, zda bankéř aktivně naslouchá a reaguje na potřeby.', _validated: false },
    { round: 2, context: 'Mladý pár kupuje první byt – nemají žádné pojištění.', bankéřTask: 'Vysvětlete potřebu pojištění domácnosti a odpovědnosti.', klientTask: 'Máte omezený rozpočet – ptejte se na minimum.', pozorovatelTask: 'Hodnoťte srozumitelnost a práci s rozpočtem klienta.', _validated: false },
    { round: 3, context: 'Senior s existující pojistkou u konkurence – nespokojený se službami.', bankéřTask: 'Nabídněte přechod a vysvětlete proces výpovědi.', klientTask: 'Bojíte se změny a složitosti přechodu.', pozorovatelTask: 'Sledujte, zda bankéř buduje důvěru a trpělivě vysvětluje.', _validated: false },
  ],

  /* ── Objection prompts for speed-dating (B7A2) ── */
  objectionPrompts: [
    { round: 1, context: 'Klient: „To je moc drahé, jinde platím míň."', task: 'Reagujte na cenovou námitku – srovnejte rozsah krytí.', _validated: false },
    { round: 2, context: 'Klient: „Nikdy se mi nic nestalo, nepotřebuji to."', task: 'Pracujte s argumentem pravděpodobnosti a dopadu.', _validated: false },
    { round: 3, context: 'Klient: „Musím se poradit s manželkou/manželem."', task: 'Respektujte, ale zanechte materiál a domluvte další krok.', _validated: false },
    { round: 4, context: 'Klient: „Zavolám vám, až to budu řešit."', task: 'Přeměňte vágní slib na konkrétní termín.', _validated: false },
    { round: 5, context: 'Klient: „Pojištění je zbytečný výdaj."', task: 'Ukažte poměr cena vs. potenciální škoda.', _validated: false },
    { round: 6, context: 'Klient: „Mám pojistku u Kooperativy a jsem spokojený."', task: 'Nabídněte srovnání bez kritiky konkurence.', _validated: false },
  ],

  /* ── Argument cards and strength criteria (B7A3) ── */
  argumentCards: [
    { id: 'argc1', label: 'Šíře krytí', argument: 'Naše pojištění kryje více rizik v základní variantě.', strength: 'silný', _validated: false },
    { id: 'argc2', label: 'Cena vs. hodnota', argument: 'Rozdíl v ceně je malý oproti rozsahu krytí navíc.', strength: 'silný', _validated: false },
    { id: 'argc3', label: 'Osobní přístup', argument: 'Máte osobního bankéře, kterého znáte – ne jen call centrum.', strength: 'střední', _validated: false },
    { id: 'argc4', label: 'Rychlost likvidace', argument: 'Škody řešíme rychle – průměrně do několika pracovních dní.', strength: 'střední', _validated: false },
    { id: 'argc5', label: 'Kompletní servis', argument: 'Pojištění, účet, hypotéka – vše na jednom místě.', strength: 'silný', _validated: false },
  ],
  argumentStrength: [
    { id: 'as1', label: 'Relevance pro klienta', description: 'Je argument relevantní pro konkrétní situaci klienta?', weight: 3, _validated: false },
    { id: 'as2', label: 'Ověřitelnost', description: 'Může si klient argument snadno ověřit?', weight: 2, _validated: false },
    { id: 'as3', label: 'Emocionální dopad', description: 'Oslovuje argument klienta i emočně, nejen racionálně?', weight: 2, _validated: false },
  ],

  /* ── Offer defense scenarios (B7A4) ── */
  offerDefenseScenarios: [
    { id: 'ods1', text: 'Nabídka pro mladou rodinu: 450 Kč/měsíc za domácnost + odpovědnost. Klient říká: „To je moc."', _validated: false },
    { id: 'ods2', text: 'Nabídka pro seniory: přechod z Kooperativy, cena srovnatelná. Klient říká: „Proč měnit?"', _validated: false },
    { id: 'ods3', text: 'Nabídka pro RD: 750 Kč/měsíc, kompletní balíček. Klient říká: „Soused platí polovinu."', _validated: false },
  ],

  /* ── Host objection prompts (B7A5) ── */
  hostObjectionPrompts: [
    { round: 1, context: 'Lektor jako klient: „Ukažte mi černé na bílém, proč je to lepší."', task: 'Prezentujte konkrétní srovnání výhod.', _validated: false },
    { round: 2, context: 'Lektor jako klient: „Kamarád mi řekl, že pojistky z banky jsou předražené."', task: 'Vyvrátit mýtus a argumentovat fakty.', _validated: false },
    { round: 3, context: 'Lektor jako klient: „A co když se mi nic nestane? Ty peníze jsou pryč."', task: 'Vysvětlete princip pojištění a porovnejte s rizikem.', _validated: false },
    { round: 4, context: 'Lektor jako klient: „Mám to v mobilu od Direct – je to jednodušší."', task: 'Zdůrazněte osobní servis a podporu při likvidaci.', _validated: false },
    { round: 5, context: 'Lektor jako klient: „OK, ale chci slevu."', task: 'Pracujte s hodnotou nabídky, ne jen s cenou.', _validated: false },
  ]
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

/* ==========================================================================
   INSIGHT DATA — educational/data brief content shown between blocks
   Per-block insight cards with statistics, context, and talking points
   ========================================================================== */
export const insightData = {
  block1: {
    dataBrief: {
      title: 'Realita škod v ČR',
      stats: [
        { label: 'Pojistná plnění v majetku', value: '37,4 mld. Kč', note: 'za rok 2024' },
        { label: 'Povodňové škody', value: '19,7 mld. Kč', note: 'hlášeno v roce 2024' },
        { label: 'Pojistných událostí v majetku', value: '~576 tisíc', note: 'za rok 2024' },
      ],
      source: 'ČAP 2024',
      _validated: false,
    },
    insightCards: [
      { title: 'Průměrná škoda roste', text: 'Průměrná škoda na pojistné události v majetku se meziročně zvyšuje – vliv inflace i klimatických jevů.', highlight: 'Průměrná škoda se meziročně zvyšuje', source: 'ČAP 2024', _validated: false },
      { title: 'Podpojištění je běžné', text: 'Odhadem 30–40 % domácností v ČR nemá dostatečné pojistné částky – reálná hodnota majetku převyšuje pojistnou částku.', highlight: 'Odhadem 30–40 % domácností je podpojištěno', source: 'Odhad ČAP / odborné články', _validated: false },
      { title: 'Záplavy jako hlavní hrozba', text: 'Povodňové a záplavové škody tvoří více než polovinu celkových pojistných plnění v majetku.', highlight: 'Povodně = více než polovina plnění', source: 'ČAP 2024', _validated: false },
    ],
  },

  block2: {
    dataBrief: {
      title: 'Parametry pojištění v praxi',
      stats: [
        { label: 'Nejčastější typ domácnosti', value: 'Byt 2+1 / 3+1', note: 'panelový dům' },
        { label: 'Kooperativa – varianty RD', value: 'PRIMA / KOMFORT', note: 'veřejně komunikované' },
        { label: 'Klíčový rozdíl variant', value: 'Rozsah krytí', note: 'KOMFORT přidává vandalismus, havárie rozvodů aj.' },
      ],
      source: 'ČAP 2024 / Kooperativa veřejné zdroje',
      _validated: false,
    },
    insightCards: [
      { title: 'Domácnost vs. nemovitost', text: 'Klienti často zaměňují pojištění domácnosti (movité věci) a nemovitosti (stavba). Správné vysvětlení je klíčové.', highlight: 'Nejčastější záměna pojmů', source: 'Interní zkušenost', _validated: false },
      { title: 'Kooperativa KOMFORT', text: 'Rozšířená varianta Kooperativy zahrnuje mj. vandalismus, havárii rozvodů a zatečení vodou střechou – srovnejte s naší nabídkou.', highlight: 'Vandalismus + havárie rozvodů v KOMFORT', source: 'Kooperativa.cz', _validated: false },
      { title: 'Spoluúčast jako nástroj', text: 'Vyšší spoluúčast snižuje pojistné, ale klient platí více při škodě. Správné nastavení šetří i chrání.', highlight: 'Spoluúčast = klíčový parametr', source: 'Obecný princip', _validated: false },
    ],
  },

  block3: {
    dataBrief: {
      title: 'Odpovědnost – co klienti netuší',
      stats: [
        { label: 'Typy odpovědnosti', value: '3 základní', note: 'občanská, z nemovitosti, profesní' },
        { label: 'Kooperativa – odpovědnost', value: 'Samostatně sjednatelná', note: 'novinka v produktové řadě' },
        { label: 'Nejčastější škody', value: 'Vytopení souseda', note: 'odhadem desítky tisíc případů ročně' },
      ],
      source: 'Kooperativa.cz / ČAP odhady',
      _validated: false,
    },
    insightCards: [
      { title: 'Odpovědnost za psa', text: 'Pokousání cizí osoby psem je jednou z nejčastějších odpovědnostních škod. Krytí je součástí pojištění domácnosti.', highlight: 'Pes = časté odpovědnostní škody', source: 'Praxe likvidace', _validated: false },
      { title: 'Odpovědnost vlastníka nemovitosti', text: 'Pád sněhu ze střechy, uvolněná omítka – vlastník nese odpovědnost za stav budovy vůči třetím osobám.', highlight: 'Vlastník ručí za stav budovy', source: 'Občanský zákoník', _validated: false },
      { title: 'Kooperativa – samostatná odpovědnost', text: 'Kooperativa nově umožňuje sjednat odpovědnost v běžném občanském životě samostatně, bez pojištění domácnosti.', highlight: 'Samostatné sjednání u konkurence', source: 'Kooperativa.cz', _validated: false },
    ],
  },

  block4: {
    dataBrief: {
      title: 'Přechod k nabídce – klíčový moment',
      stats: [
        { label: 'Úspěšnost přechodu', value: 'Závisí na přirozenosti', note: 'nácvik zvyšuje úspěšnost' },
        { label: 'Nejčastější chyba', value: 'Příliš přímý přechod', note: 'klient ztratí důvěru' },
        { label: 'Ideální moment', value: 'Životní událost', note: 'stěhování, dítě, hypotéka' },
      ],
      source: 'Interní metodika',
      _validated: false,
    },
    insightCards: [
      { title: 'Princip FIT', text: 'FIT = Fakta, Informace, Transformace. Nejprve zjistěte fakta o klientovi, pak informujte o rizicích a přirozeně transformujte do nabídky.', highlight: 'FIT = Fakta → Informace → Transformace', source: 'Interní metodika', _validated: false },
      { title: 'Životní události', text: 'Stěhování, narození dítěte, koupě nemovitosti – tyto momenty jsou přirozený vstup do tématu pojištění.', highlight: 'Životní událost = přirozený moment', source: 'Obchodní praxe', _validated: false },
      { title: 'Neprodávejte – řešte potřebu', text: 'Klient nechce slyšet „mám pro vás nabídku" – chce slyšet „to se dá jednoduše ošetřit".', highlight: 'Řešení potřeby > prodejní fráze', source: 'Interní metodika', _validated: false },
    ],
  },

  block5: {
    dataBrief: {
      title: 'Modelování nabídek – systém Hades',
      stats: [
        { label: 'Hlavní produkt', value: 'Pojištění majetku ČS', note: 'domácnost + nemovitost + odpovědnost' },
        { label: 'Kooperativa srovnání', value: 'PRIMA / KOMFORT', note: 'dvě varianty vs. modulární přístup ČS' },
        { label: 'Klíčový cíl', value: 'Nabídka na míru', note: 'odpovídající reálným potřebám klienta' },
      ],
      source: 'Kooperativa.cz / interní produktová dokumentace',
      _validated: false,
    },
    insightCards: [
      { title: 'Podpojištění zabíjí důvěru', text: 'Když klient zjistí při škodě, že má nízkou pojistnou částku, ztrácí důvěru v bankéře i pojišťovnu.', highlight: 'Správná pojistná částka = základ', source: 'Likvidační praxe', _validated: false },
      { title: 'Kooperativa – benefit OBNOVA', text: 'Kooperativa nabízí benefit OBNOVA při velké škodě na domácnosti – srovnejte s naším přístupem ke kompenzaci.', highlight: 'Benefit OBNOVA u konkurence', source: 'Kooperativa.cz', _validated: false },
      { title: 'Rozpočet klienta je reálný limit', text: 'Ideální nabídka musí respektovat rozpočet. Učte se prioritizovat: nejprve největší rizika, pak rozšiřovat.', highlight: 'Prioritizace rizik dle rozpočtu', source: 'Obchodní metodika', _validated: false },
    ],
  },

  block6: {
    dataBrief: {
      title: 'Lhůty a termíny – zákonný rámec',
      stats: [
        { label: 'Výpovědní lhůta', value: '6 týdnů', note: 'před koncem pojistného období' },
        { label: 'Mimořádná výpověď', value: 'Do 1 měsíce', note: 'po pojistné události nebo změně pojistného' },
        { label: 'Výpověď do 2 měsíců', value: 'Od sjednání', note: 'bez udání důvodu, 8denní výpovědní doba' },
      ],
      source: 'Zákon č. 89/2012 Sb., občanský zákoník',
      _validated: false,
    },
    insightCards: [
      { title: '6 týdnů je klíčová lhůta', text: 'Výpověď musí být doručena pojišťovně nejpozději 6 týdnů před koncem pojistného období. Nestačí odeslat – musí být doručena.', highlight: 'Doručení, ne odeslání!', source: 'Občanský zákoník § 2804', _validated: false },
      { title: 'Mimořádná výpověď po škodě', text: 'Po pojistné události může klient i pojistitel vypovědět smlouvu do 1 měsíce od ukončení šetření. Výpovědní doba je 1 měsíc.', highlight: 'Do 1 měsíce po ukončení šetření', source: 'Občanský zákoník § 2805', _validated: false },
      { title: 'Přerušení krytí = riziko', text: 'Mezi zrušením staré a sjednáním nové smlouvy nesmí být mezera – klient by byl bez krytí. Navazujte smlouvy k datu výročí.', highlight: 'Bez mezery v krytí', source: 'Obchodní praxe', _validated: false },
    ],
  },

  block7: {
    dataBrief: {
      title: 'Námitky – vzorce a reakce',
      stats: [
        { label: 'Nejčastější námitka', value: '„To je drahé"', note: 'cenová námitka v odhadovaných 40–50 % případů' },
        { label: 'Druhá nejčastější', value: '„Nepotřebuji to"', note: 'odmítnutí potřeby pojištění' },
        { label: 'Nejtěžší námitka', value: '„Mám jinde, jsem spokojený"', note: 'status quo – těžké překonat' },
      ],
      source: 'Interní obchodní data (odhad)',
      _validated: false,
    },
    insightCards: [
      { title: 'Cenová námitka ≠ problém s cenou', text: 'Když klient říká „je to drahé", často znamená „nevím, za co platím". Řešte hodnotu, ne slevu.', highlight: 'Námitka ceny = nedostatek hodnoty', source: 'Obchodní metodika', _validated: false },
      { title: '„Nikdy se mi nic nestalo"', text: 'Statisticky se pojistná událost majetku stane jednomu z pěti domácností během 10 let. To nejsou malá čísla.', highlight: 'Odhadem 1 z 5 domácností za 10 let', source: 'ČAP odhady', _validated: false },
      { title: 'Status quo je nejsilnější', text: 'Klient, který je „spokojený jinde", potřebuje důvod ke změně, ne kritiku konkurence. Nabídněte srovnání bez hodnocení.', highlight: 'Srovnání > kritika konkurence', source: 'Obchodní praxe', _validated: false },
      { title: 'Odložení ≠ odmítnutí', text: 'Když klient říká „zavolám příští týden", přeměňte na konkrétní termín: „Mohu vám zavolat ve středu v 10?"', highlight: 'Vágní slib → konkrétní termín', source: 'Obchodní metodika', _validated: false },
    ],
  },

  block8: {
    dataBrief: {
      title: 'Závěrečná reflexe – ukotvení dne',
      stats: [
        { label: 'Retence znalostí', value: 'Klesá bez akce', note: 'po 24 h se zapomene odhadem 50–70 % obsahu' },
        { label: 'Efekt závazku', value: 'Vyšší dodržení', note: 'veřejný závazek zvyšuje pravděpodobnost realizace' },
        { label: 'Klíč k úspěchu', value: '1 konkrétní akce', note: 'lépe 1 kroková změna než 10 předsevzetí' },
      ],
      source: 'Vzdělávací metodika',
      _validated: false,
    },
    insightCards: [
      { title: 'Jeden konkrétní krok', text: 'Nejúčinnější závazek je jeden konkrétní krok – např. „zítra u prvního klienta zmíním pojištění domácnosti".', highlight: '1 krok > 10 předsevzetí', source: 'Vzdělávací metodika', _validated: false },
      { title: 'Veřejný závazek funguje', text: 'Závazek sdílený s kolegou má vyšší šanci na dodržení než soukromé předsevzetí.', highlight: 'Sdílený závazek = vyšší dodržení', source: 'Behaviorální výzkum', _validated: false },
      { title: 'Follow-up je klíčový', text: 'Efekt školení se násobí, pokud do 2 týdnů proběhne krátký follow-up – telefonát, e-mail nebo schůzka s vedoucím.', highlight: 'Follow-up do 2 týdnů', source: 'Vzdělávací metodika', _validated: false },
    ],
  },
};


/* ==========================================================================
   BLOCK ILLUSTRATIONS — per-block SVG illustrations
   Rich editorial-style SVGs, stroke only, currentColor
   ViewBox 320×240, 12–20+ shapes per block with depth via opacity
   ========================================================================== */
export const blockIllustrations = {
  1: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M0 200 Q40 185 80 200 Q120 215 160 200 Q200 185 240 200 Q280 215 320 200" opacity="0.3"/><path d="M0 213 Q40 198 80 213 Q120 228 160 213 Q200 198 240 213 Q280 228 320 213" opacity="0.2"/><path d="M0 225 Q40 210 80 225 Q120 238 160 225 Q200 210 240 225 Q280 238 320 225" opacity="0.15"/><rect x="65" y="30" width="190" height="158" rx="2" opacity="0.6"/><line x1="55" y1="30" x2="265" y2="30" opacity="0.7"/><path d="M160 30 L155 48 L167 60 L158 78" opacity="0.5"/><rect x="85" y="55" width="42" height="35" opacity="0.5"/><line x1="85" y1="55" x2="127" y2="90" opacity="0.4"/><line x1="127" y1="55" x2="85" y2="90" opacity="0.4"/><rect x="193" y="55" width="42" height="35" opacity="0.45"/><line x1="214" y1="55" x2="214" y2="90" opacity="0.3"/><line x1="193" y1="73" x2="235" y2="73" opacity="0.3"/><rect x="95" y="130" width="48" height="8" rx="1" opacity="0.45" transform="rotate(-10 119 134)"/><line x1="100" y1="138" x2="97" y2="168" opacity="0.4"/><line x1="138" y1="138" x2="141" y2="168" opacity="0.4"/><rect x="200" y="120" width="18" height="5" rx="1" opacity="0.4" transform="rotate(12 209 122)"/><line x1="203" y1="125" x2="201" y2="158" opacity="0.35"/><line x1="215" y1="125" x2="217" y2="158" opacity="0.35"/><circle cx="152" cy="95" r="2.5" opacity="0.5"/><circle cx="146" cy="112" r="2" opacity="0.4"/><circle cx="158" cy="128" r="1.5" opacity="0.35"/><line x1="110" y1="175" x2="122" y2="173" opacity="0.3"/><circle cx="170" cy="178" r="3.5" opacity="0.25"/><path d="M148 105 L148 188 L175 183 L175 100" opacity="0.5"/></svg>',

  2: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M45 105 L120 55 L195 105" opacity="0.7"/><rect x="55" y="105" width="130" height="90" opacity="0.6"/><rect x="105" y="150" width="30" height="45" opacity="0.5"/><circle cx="130" cy="175" r="2" opacity="0.4"/><rect x="68" y="118" width="25" height="22" opacity="0.4"/><line x1="80" y1="118" x2="80" y2="140" opacity="0.3"/><rect x="148" y="118" width="25" height="22" opacity="0.4"/><line x1="160" y1="118" x2="160" y2="140" opacity="0.3"/><rect x="165" y="68" width="14" height="30" opacity="0.45"/><path d="M172 68 Q175 55 170 45 Q168 38 172 30" opacity="0.25"/><line x1="30" y1="210" x2="195" y2="210" opacity="0.3"/><line x1="40" y1="210" x2="40" y2="198" opacity="0.3"/><line x1="60" y1="210" x2="60" y2="198" opacity="0.3"/><line x1="80" y1="210" x2="80" y2="198" opacity="0.3"/><circle cx="218" cy="148" r="9" opacity="0.6"/><line x1="218" y1="157" x2="218" y2="195" opacity="0.6"/><line x1="206" y1="172" x2="230" y2="172" opacity="0.5"/><circle cx="243" cy="150" r="8" opacity="0.55"/><line x1="243" y1="158" x2="243" y2="195" opacity="0.55"/><line x1="233" y1="174" x2="253" y2="174" opacity="0.45"/><circle cx="265" cy="162" r="6" opacity="0.5"/><line x1="265" y1="168" x2="265" y2="195" opacity="0.5"/><path d="M275 98 L298 80 L318 98" opacity="0.45"/><rect x="278" y="98" width="38" height="35" opacity="0.35"/><rect x="290" y="108" width="14" height="12" opacity="0.3"/><path d="M298 145 C283 145 278 158 298 178 C318 158 313 145 298 145 Z" opacity="0.5"/><circle cx="298" cy="157" r="4" opacity="0.4"/><line x1="22" y1="195" x2="22" y2="130" opacity="0.4"/><path d="M22 130 Q8 118 14 105 Q20 95 22 88 Q24 95 30 105 Q36 118 22 130" opacity="0.35"/></svg>',

  3: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="160" y1="195" x2="160" y2="52" opacity="0.7"/><line x1="130" y1="195" x2="190" y2="195" opacity="0.6"/><path d="M140 195 L160 182 L180 195" opacity="0.5"/><line x1="60" y1="68" x2="260" y2="58" opacity="0.7"/><line x1="60" y1="68" x2="42" y2="100" opacity="0.5"/><line x1="60" y1="68" x2="78" y2="100" opacity="0.5"/><line x1="42" y1="100" x2="78" y2="100" opacity="0.5"/><path d="M45 100 L60 82 L75 100" opacity="0.55"/><rect x="48" y="88" width="24" height="12" opacity="0.45"/><line x1="260" y1="58" x2="242" y2="90" opacity="0.5"/><line x1="260" y1="58" x2="278" y2="90" opacity="0.5"/><line x1="242" y1="90" x2="278" y2="90" opacity="0.5"/><circle cx="260" cy="72" r="6" opacity="0.55"/><line x1="260" y1="78" x2="260" y2="90" opacity="0.55"/><line x1="100" y1="160" x2="220" y2="160" opacity="0.3"/><line x1="110" y1="160" x2="110" y2="150" opacity="0.3"/><line x1="130" y1="160" x2="130" y2="150" opacity="0.3"/><path d="M155 168 L178 168 L180 163 L178 160 L155 160 L152 163 Z" opacity="0.4"/><line x1="160" y1="168" x2="160" y2="178" opacity="0.35"/><line x1="174" y1="168" x2="174" y2="178" opacity="0.35"/><path d="M155 160 Q148 152 145 156" opacity="0.3"/><path d="M88 125 L108 138 L98 132 L118 148" opacity="0.4"/><path d="M108 138 L114 132 L110 140" opacity="0.3"/><path d="M225 128 Q228 118 235 116 Q242 114 245 120 Q248 126 240 132 L240 137" opacity="0.4"/><circle cx="240" cy="142" r="1.5" opacity="0.4"/><path d="M198 132 Q201 122 208 120 Q215 118 218 124 Q221 130 213 136 L213 141" opacity="0.35"/><circle cx="213" cy="146" r="1.5" opacity="0.35"/></svg>',

  4: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="95" y="125" width="130" height="8" rx="2" opacity="0.6"/><line x1="110" y1="133" x2="110" y2="178" opacity="0.4"/><line x1="210" y1="133" x2="210" y2="178" opacity="0.4"/><circle cx="75" cy="100" r="12" opacity="0.6"/><line x1="75" y1="112" x2="75" y2="162" opacity="0.55"/><line x1="75" y1="130" x2="95" y2="125" opacity="0.5"/><line x1="75" y1="162" x2="65" y2="198" opacity="0.4"/><line x1="75" y1="162" x2="85" y2="198" opacity="0.4"/><circle cx="245" cy="100" r="12" opacity="0.55"/><line x1="245" y1="112" x2="245" y2="162" opacity="0.5"/><line x1="245" y1="130" x2="225" y2="125" opacity="0.45"/><line x1="245" y1="162" x2="235" y2="198" opacity="0.38"/><line x1="245" y1="162" x2="255" y2="198" opacity="0.38"/><rect x="200" y="108" width="35" height="22" rx="2" opacity="0.5"/><line x1="197" y1="130" x2="238" y2="130" opacity="0.4"/><path d="M105 112 L108 125 L120 125 L123 112 Z" opacity="0.45"/><path d="M123 116 Q130 116 130 121 Q130 126 123 126" opacity="0.35"/><rect x="100" y="52" width="55" height="30" rx="8" opacity="0.4"/><path d="M118 82 L112 92 L128 82" opacity="0.4"/><circle cx="118" cy="64" r="2" opacity="0.3"/><circle cx="128" cy="64" r="2" opacity="0.3"/><circle cx="138" cy="64" r="2" opacity="0.3"/><rect x="168" y="42" width="55" height="30" rx="8" opacity="0.35"/><path d="M208 72 L214 82 L200 72" opacity="0.35"/><path d="M142 200 Q160 188 178 200" opacity="0.5"/><line x1="160" y1="215" x2="200" y2="215" opacity="0.4"/><path d="M195 210 L205 215 L195 220" opacity="0.4"/></svg>',

  5: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="55" y="22" width="150" height="108" rx="4" opacity="0.6"/><rect x="62" y="30" width="136" height="90" rx="1" opacity="0.3"/><path d="M45 130 L215 130 L220 142 L40 142 Z" opacity="0.5"/><line x1="130" y1="36" x2="130" y2="114" opacity="0.2"/><line x1="68" y1="72" x2="192" y2="72" opacity="0.2"/><line x1="75" y1="46" x2="120" y2="46" opacity="0.4"/><circle cx="100" cy="46" r="3" opacity="0.6"/><line x1="75" y1="58" x2="120" y2="58" opacity="0.4"/><circle cx="88" cy="58" r="3" opacity="0.55"/><rect x="140" y="82" width="10" height="28" opacity="0.5"/><rect x="155" y="68" width="10" height="42" opacity="0.55"/><rect x="170" y="76" width="10" height="34" opacity="0.45"/><rect x="185" y="58" width="10" height="52" opacity="0.6"/><rect x="75" y="80" width="20" height="10" rx="5" opacity="0.5"/><circle cx="90" cy="85" r="4" opacity="0.6"/><rect x="75" y="96" width="20" height="10" rx="5" opacity="0.4"/><circle cx="80" cy="101" r="4" opacity="0.5"/><rect x="235" y="48" width="60" height="82" rx="3" opacity="0.5"/><line x1="245" y1="66" x2="285" y2="66" opacity="0.35"/><line x1="245" y1="78" x2="280" y2="78" opacity="0.3"/><line x1="245" y1="90" x2="275" y2="90" opacity="0.3"/><line x1="245" y1="102" x2="270" y2="102" opacity="0.25"/><rect x="235" y="150" width="50" height="68" rx="3" opacity="0.45"/><rect x="240" y="155" width="40" height="16" rx="1" opacity="0.35"/><circle cx="250" cy="182" r="3" opacity="0.3"/><circle cx="265" cy="182" r="3" opacity="0.3"/><circle cx="250" cy="198" r="3" opacity="0.3"/><circle cx="265" cy="198" r="3" opacity="0.3"/></svg>',

  6: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="130" x2="300" y2="130" opacity="0.5"/><circle cx="60" cy="130" r="7" opacity="0.7"/><circle cx="130" cy="130" r="7" opacity="0.65"/><circle cx="200" cy="130" r="7" opacity="0.6"/><circle cx="270" cy="130" r="7" opacity="0.7"/><line x1="60" y1="123" x2="60" y2="92" opacity="0.4"/><line x1="130" y1="123" x2="130" y2="92" opacity="0.4"/><line x1="200" y1="123" x2="200" y2="92" opacity="0.4"/><line x1="270" y1="123" x2="270" y2="92" opacity="0.4"/><rect x="35" y="38" width="40" height="50" rx="2" opacity="0.35"/><rect x="42" y="32" width="40" height="50" rx="2" opacity="0.45"/><rect x="49" y="26" width="40" height="50" rx="2" opacity="0.55"/><line x1="55" y1="40" x2="82" y2="40" opacity="0.4"/><line x1="55" y1="50" x2="78" y2="50" opacity="0.35"/><line x1="55" y1="60" x2="75" y2="60" opacity="0.3"/><rect x="112" y="38" width="36" height="34" rx="2" opacity="0.5"/><line x1="112" y1="48" x2="148" y2="48" opacity="0.45"/><circle cx="122" cy="60" r="2" opacity="0.35"/><circle cx="138" cy="60" r="2" opacity="0.35"/><circle cx="200" cy="55" r="18" opacity="0.5"/><line x1="200" y1="55" x2="200" y2="42" opacity="0.6"/><line x1="200" y1="55" x2="212" y2="55" opacity="0.55"/><circle cx="270" cy="55" r="16" opacity="0.5"/><circle cx="270" cy="55" r="10" opacity="0.4"/><path d="M50 152 L78 152 Q82 152 84 156 L100 195" opacity="0.45"/><path d="M100 195 L103 190 L97 188 Z" opacity="0.5"/><rect x="155" y="148" width="35" height="48" rx="2" opacity="0.35"/><line x1="162" y1="162" x2="183" y2="162" opacity="0.3"/><line x1="162" y1="172" x2="180" y2="172" opacity="0.25"/><line x1="162" y1="182" x2="178" y2="182" opacity="0.2"/></svg>',

  7: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="90" y="120" width="140" height="10" rx="2" opacity="0.6"/><line x1="108" y1="130" x2="108" y2="180" opacity="0.4"/><line x1="212" y1="130" x2="212" y2="180" opacity="0.4"/><circle cx="62" cy="92" r="12" opacity="0.6"/><line x1="62" y1="104" x2="62" y2="158" opacity="0.55"/><line x1="62" y1="122" x2="90" y2="120" opacity="0.5"/><line x1="62" y1="158" x2="52" y2="198" opacity="0.4"/><line x1="62" y1="158" x2="72" y2="198" opacity="0.4"/><circle cx="258" cy="92" r="12" opacity="0.55"/><line x1="258" y1="104" x2="258" y2="158" opacity="0.5"/><line x1="258" y1="122" x2="230" y2="120" opacity="0.45"/><line x1="258" y1="158" x2="248" y2="198" opacity="0.38"/><line x1="258" y1="158" x2="268" y2="198" opacity="0.38"/><rect x="118" y="100" width="22" height="30" rx="2" opacity="0.4" transform="rotate(-8 129 115)"/><rect x="142" y="98" width="22" height="30" rx="2" opacity="0.45"/><rect x="168" y="100" width="22" height="30" rx="2" opacity="0.4" transform="rotate(8 179 115)"/><rect x="128" y="32" width="64" height="38" rx="10" opacity="0.4"/><path d="M155 70 L160 82 L165 70" opacity="0.4"/><line x1="160" y1="42" x2="160" y2="58" opacity="0.6"/><circle cx="160" cy="63" r="1.5" opacity="0.6"/><path d="M30 148 C30 148 20 140 20 160 C20 180 40 195 40 195 C40 195 60 180 60 160 C60 140 50 148 40 148 Z" opacity="0.35"/><line x1="265" y1="162" x2="295" y2="198" opacity="0.4"/><path d="M292 193 L300 202 L288 200" opacity="0.4"/><line x1="272" y1="158" x2="288" y2="158" opacity="0.35"/><path d="M152 86 L162 98 L148 98 L160 112" opacity="0.7"/></svg>',

  8: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="0" y1="160" x2="320" y2="160" opacity="0.4"/><path d="M195 160 A40 40 0 0 1 125 160" opacity="0.6"/><line x1="160" y1="115" x2="160" y2="105" opacity="0.35"/><line x1="180" y1="120" x2="188" y2="112" opacity="0.3"/><line x1="140" y1="120" x2="132" y2="112" opacity="0.3"/><line x1="192" y1="135" x2="202" y2="130" opacity="0.25"/><line x1="128" y1="135" x2="118" y2="130" opacity="0.25"/><path d="M140 230 L155 160 L165 160 L180 230" opacity="0.45"/><path d="M148 195 L155 160" opacity="0.25" stroke-dasharray="4 4"/><path d="M172 195 L165 160" opacity="0.25" stroke-dasharray="4 4"/><circle cx="80" cy="135" r="10" opacity="0.6"/><line x1="80" y1="145" x2="80" y2="185" opacity="0.55"/><line x1="68" y1="162" x2="92" y2="162" opacity="0.45"/><line x1="80" y1="185" x2="70" y2="210" opacity="0.4"/><line x1="80" y1="185" x2="90" y2="210" opacity="0.4"/><path d="M0 160 L45 110 L90 160" opacity="0.25"/><path d="M55 160 L120 85 L185 160" opacity="0.3"/><circle cx="262" cy="68" r="20" opacity="0.5"/><path d="M254 68 L260 74 L274 58" opacity="0.7"/><path d="M270 120 C270 112 262 108 258 114 C254 108 246 112 246 120 C246 130 258 140 258 140 C258 140 270 130 270 120 Z" opacity="0.4"/></svg>',
};

/* ==========================================================================
   ACTIVITY THUMBNAILS — mini SVG icons for activity template types
   ViewBox 64×64, stroke only, currentColor, 5–8 shapes each
   ========================================================================== */
export const activityThumbnails = {
  estimate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 44 A22 22 0 0 1 52 44" opacity="0.5"/><line x1="15" y1="38" x2="18" y2="42" opacity="0.6"/><line x1="32" y1="22" x2="32" y2="26" opacity="0.6"/><line x1="49" y1="38" x2="46" y2="42" opacity="0.6"/><line x1="32" y1="44" x2="43" y2="30" opacity="0.8"/><circle cx="32" cy="44" r="3" opacity="0.7"/><line x1="10" y1="52" x2="54" y2="52" opacity="0.4"/></svg>',

  auction: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="15" y="12" width="26" height="9" rx="2" opacity="0.7" transform="rotate(-30 28 16)"/><line x1="28" y1="22" x2="28" y2="42" opacity="0.6"/><line x1="18" y1="42" x2="38" y2="42" opacity="0.5"/><rect x="44" y="10" width="14" height="10" rx="1" opacity="0.5"/><line x1="51" y1="8" x2="51" y2="5" opacity="0.4"/><circle cx="51" cy="4" r="1.5" opacity="0.4"/><line x1="46" y1="15" x2="56" y2="15" opacity="0.4"/><line x1="18" y1="48" x2="38" y2="48" opacity="0.4"/></svg>',

  matching: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 18 L24 18 L24 24 C20 24 20 32 24 32 L24 46 L8 46 Z" opacity="0.7"/><path d="M40 18 L56 18 L56 46 L40 46 L40 32 C36 32 36 24 40 24 L40 18 Z" opacity="0.6"/><line x1="26" y1="28" x2="38" y2="28" opacity="0.5" stroke-dasharray="2 2"/><path d="M30 32 L34 28 L30 24" opacity="0.4"/><path d="M34 32 L38 28 L34 24" opacity="0.4"/></svg>',

  vote: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="24" width="36" height="30" rx="2" opacity="0.6"/><line x1="20" y1="24" x2="44" y2="24" opacity="0.7"/><rect x="24" y="20" width="16" height="4" rx="1" opacity="0.5"/><rect x="20" y="8" width="24" height="16" rx="2" opacity="0.4"/><path d="M26 16 L30 20 L38 10" opacity="0.8"/><line x1="32" y1="20" x2="32" y2="24" opacity="0.5" stroke-dasharray="1 2"/></svg>',

  quiz: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="28" cy="32" r="18" opacity="0.5"/><path d="M24 26 Q24 20 28 18 Q32 16 36 20 Q38 24 32 28 L32 32" opacity="0.8"/><circle cx="32" cy="36" r="1.5" opacity="0.7"/><circle cx="50" cy="14" r="10" opacity="0.5"/><line x1="50" y1="14" x2="50" y2="8" opacity="0.6"/><line x1="50" y1="14" x2="56" y2="14" opacity="0.6"/></svg>',

  scenario: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="32" r="5" opacity="0.6"/><line x1="21" y1="32" x2="34" y2="32" opacity="0.5"/><path d="M34 32 Q40 32 44 22" opacity="0.7"/><path d="M34 32 Q40 32 44 42" opacity="0.7"/><path d="M40 20 L46 22 L42 16" opacity="0.6"/><path d="M40 44 L46 42 L42 48" opacity="0.6"/><circle cx="52" cy="20" r="4" opacity="0.5"/><circle cx="52" cy="44" r="4" opacity="0.5"/></svg>',

  sort: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="28" width="8" height="22" rx="1" opacity="0.6"/><rect x="22" y="14" width="8" height="36" rx="1" opacity="0.7"/><rect x="34" y="22" width="8" height="28" rx="1" opacity="0.5"/><rect x="46" y="8" width="8" height="42" rx="1" opacity="0.8"/><path d="M14 54 L14 58 L50 58 L50 54" opacity="0.4"/><path d="M46 52 L50 56 L54 52" opacity="0.5"/></svg>',

  classify: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="6" width="22" height="22" rx="2" opacity="0.6"/><rect x="36" y="6" width="22" height="22" rx="2" opacity="0.5"/><rect x="6" y="36" width="22" height="22" rx="2" opacity="0.5"/><rect x="36" y="36" width="22" height="22" rx="2" opacity="0.7"/><path d="M28 14 L36 14" opacity="0.4"/><path d="M34 11 L38 14 L34 17" opacity="0.4"/><path d="M17 28 L17 36" opacity="0.4"/><path d="M14 34 L17 38 L20 34" opacity="0.4"/></svg>',

  roleplay: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 16 Q10 8 22 8 Q34 8 34 16 L34 30 Q34 40 22 40 Q10 40 10 30 Z" opacity="0.6"/><circle cx="17" cy="20" r="2" opacity="0.7"/><circle cx="27" cy="20" r="2" opacity="0.7"/><path d="M16 28 Q22 34 28 28" opacity="0.8"/><path d="M30 28 Q30 20 42 20 Q54 20 54 28 L54 42 Q54 52 42 52 Q30 52 30 42 Z" opacity="0.5"/><circle cx="37" cy="32" r="2" opacity="0.6"/><circle cx="47" cy="32" r="2" opacity="0.6"/><path d="M36 42 Q42 38 48 42" opacity="0.7"/></svg>',

  review: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M24 8 L27 18 L38 18 L29 24 L32 35 L24 28 L16 35 L19 24 L10 18 L21 18 Z" opacity="0.6"/><circle cx="42" cy="36" r="12" opacity="0.7"/><line x1="50" y1="44" x2="58" y2="54" opacity="0.8"/><circle cx="42" cy="36" r="6" opacity="0.4"/><line x1="42" y1="30" x2="42" y2="34" opacity="0.5"/></svg>',

  freeInput: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="40" height="30" rx="6" opacity="0.6"/><path d="M18 38 L14 48 L26 38" opacity="0.6"/><line x1="16" y1="18" x2="36" y2="18" opacity="0.4"/><line x1="16" y1="24" x2="32" y2="24" opacity="0.4"/><line x1="16" y1="30" x2="28" y2="30" opacity="0.3"/><line x1="44" y1="28" x2="56" y2="52" opacity="0.7"/><path d="M55 50 L58 56 L52 54" opacity="0.7"/><line x1="46" y1="32" x2="54" y2="48" opacity="0.5"/></svg>',
};

/* ==========================================================================
   VISUAL ASSETS REGISTRY — central catalogue for all visual resources
   ========================================================================== */
export const visualAssets = [
  // Hero visuals for each block
  { id: 'hero-b1', blockId: 1, type: 'hero', title: 'Vytopený byt po havárii', alt: 'Scéna vytopené domácnosti po havárii vody', style: 'editorial-illustration', theme: 'flood-damage', placeholderKey: 'blockIllustrations.1', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b2', blockId: 2, type: 'hero', title: 'Rodina v domě', alt: 'Rodina stojící před svým domem', style: 'editorial-illustration', theme: 'family-home', placeholderKey: 'blockIllustrations.2', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b3', blockId: 3, type: 'hero', title: 'Váhy odpovědnosti', alt: 'Symbolické váhy znázorňující občanskou odpovědnost', style: 'editorial-illustration', theme: 'responsibility-balance', placeholderKey: 'blockIllustrations.3', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b4', blockId: 4, type: 'hero', title: 'Konzultace s klientem', alt: 'Dvě osoby sedí u stolu a probírají nabídku', style: 'editorial-illustration', theme: 'client-meeting', placeholderKey: 'blockIllustrations.4', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b5', blockId: 5, type: 'hero', title: 'Systém Hades – modelování', alt: 'Obrazovka systému s formulářem a grafy', style: 'editorial-illustration', theme: 'system-modeling', placeholderKey: 'blockIllustrations.5', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b6', blockId: 6, type: 'hero', title: 'Smlouvy a termíny', alt: 'Časová osa s dokumenty a razítky', style: 'editorial-illustration', theme: 'contracts-timeline', placeholderKey: 'blockIllustrations.6', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b7', blockId: 7, type: 'hero', title: 'Obchodní vyjednávání', alt: 'Dvě strany jednají u stolu s kartami argumentů', style: 'editorial-illustration', theme: 'negotiation-battle', placeholderKey: 'blockIllustrations.7', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  { id: 'hero-b8', blockId: 8, type: 'hero', title: 'Reflexe a závazek', alt: 'Cesta směrem k horizontu s vycházejícím sluncem', style: 'editorial-illustration', theme: 'reflection-horizon', placeholderKey: 'blockIllustrations.8', loadingPriority: 'eager', fallback: 'cssGradient', usageContext: ['block-screen', 'map-tile'] },
  // Activity thumbnails
  ...['estimate','auction','matching','vote','quiz','scenario','sort','classify','roleplay','review','freeInput'].map(t => ({
    id: `thumb-${t}`, blockId: null, type: 'thumbnail', title: t, alt: `Ikona aktivity typu ${t}`, style: 'outline-icon', theme: t, placeholderKey: `activityThumbnails.${t}`, loadingPriority: 'lazy', fallback: 'icon', usageContext: ['activity-picker']
  })),
];
