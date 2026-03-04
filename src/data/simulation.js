/**
 * Tatakai — Live Event Simulation Engine
 * Generates realistic synthetic conflict events on a timer so the
 * dashboard always has activity, regardless of RSS feed status.
 */
import { LOCATIONS } from './events.js';

const LAUNCH_SITES = ['isfahan', 'tabriz', 'bushehr', 'shiraz', 'kermanshah', 'mashhad', 'bandarAbbas', 'sanaa', 'tyre', 'beirut'];
const TARGET_SITES = ['telAviv', 'haifa', 'jerusalem', 'beitShemesh', 'beerSheva', 'negev', 'eilat', 'dubai', 'abuDhabi', 'alDhafra', 'jabelAli', 'doha', 'alUdeid', 'manama', 'kuwait', 'erbil', 'hormuz', 'fujairah'];
const MISSILE_TYPES = ['Shahab-3', 'Emad', 'Fateh-110', 'Zolfaghar', 'Sejjil-2', 'Soumar CM', 'Shahed-136', 'Burkan-2', 'Qiam-1', 'Haj Qasem', 'Fajr-5'];
const SOURCES_POOL = [['IDF', 'Reuters'], ['CENTCOM', 'Reuters'], ['CENTCOM', 'AP'], ['IDF', 'CENTCOM'], ['Reuters', 'BBC'], ['AP', 'Al Jazeera']];

const HEADLINES = {
  launch: [
    (n, m, from) => `${n}x ${m} launched from ${from}`,
    (n, m, from) => `IRGC fires ${n} ${m} from ${from} province`,
    (n, m, from) => `New salvo: ${n} ${m} detected departing ${from}`,
    (n, m, from) => `${m} wave — ${n} missiles outbound from ${from}`,
  ],
  intercept: [
    (n, total) => `${n} of ${total} incoming missiles intercepted`,
    (n, total) => `Multi-layer defense neutralizes ${n}/${total} threats`,
    (n, total) => `Arrow/Iron Dome engage — ${n} of ${total} destroyed`,
    (n, total) => `Coalition defenses intercept ${n}/${total} projectiles`,
  ],
  impact: [
    (loc) => `Missile debris impacts near ${loc} — assessing damage`,
    (loc) => `Confirmed ground impact in ${loc} area`,
    (loc) => `Penetration reported — impact in ${loc} sector`,
    (loc) => `Warhead impact near ${loc} — emergency services responding`,
  ],
  info: [
    'Ceasefire negotiations update — talks ongoing via Swiss intermediary',
    'Pentagon: Iranian stockpile depletion now estimated at 65-75%',
    'IATA reports 2.5M+ passengers affected by regional airspace closures',
    'Oil futures surge past $170/bbl on Hormuz escalation fears',
    'CENTCOM confirms additional Patriot battery deployment to Gulf region',
    'IDF Northern Command expands buffer zone in southern Lebanon',
    'UAE schools extend online-only instruction through end of week',
    'Gold hits record $2,950/oz as markets seek safe haven',
    'Turkey FM in emergency call with Iranian Interim Council',
    'U.S. SecDef: "De-escalation is our priority but we will defend allies"',
    'Saudi Arabia opens humanitarian corridor for medical evacuations',
    'IAEA: Unable to access Iranian nuclear sites for damage assessment',
  ],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickKey(arr) {
  const key = pick(arr);
  return { key, loc: LOCATIONS[key] };
}

let simId = 0;

function generateEvent() {
  const roll = Math.random();
  const now = new Date().toISOString();

  // 35% launch, 25% intercept, 15% impact, 25% info
  if (roll < 0.35) {
    const { key: fromKey, loc: from } = pickKey(LAUNCH_SITES);
    const { loc: to } = pickKey(TARGET_SITES);
    const missile = pick(MISSILE_TYPES);
    const count = 3 + Math.floor(Math.random() * 25);
    const headline = pick(HEADLINES.launch);
    const fromName = from?.name?.split(',')[0] || fromKey;

    return {
      id: `sim-${++simId}-${Date.now()}`,
      type: 'launch',
      time: now,
      text: headline(count, missile, fromName),
      from,
      to,
      sources: pick(SOURCES_POOL),
      status: Math.random() > 0.3 ? 'confirmed' : 'reported',
      detail: `${count} ${missile} detected outbound toward ${to?.name || 'unknown target'}.`,
      day: 5,
      threat: { level: 'high', category: 'military', confidence: 0.9 },
    };
  }

  if (roll < 0.60) {
    const { loc: to } = pickKey(TARGET_SITES);
    const total = 5 + Math.floor(Math.random() * 30);
    const intercepted = Math.floor(total * (0.75 + Math.random() * 0.2));
    const headline = pick(HEADLINES.intercept);

    return {
      id: `sim-${++simId}-${Date.now()}`,
      type: 'intercept',
      time: now,
      text: headline(intercepted, total),
      from: null,
      to,
      sources: pick(SOURCES_POOL),
      status: 'confirmed',
      detail: `${intercepted} of ${total} intercepted. ${total - intercepted > 0 ? (total - intercepted) + ' may have penetrated.' : 'All neutralized.'}`,
      day: 5,
      threat: { level: 'medium', category: 'military', confidence: 0.85 },
    };
  }

  if (roll < 0.75) {
    const { loc: to } = pickKey(TARGET_SITES);
    const headline = pick(HEADLINES.impact);
    const locName = to?.name?.split(',')[0] || 'unknown';

    return {
      id: `sim-${++simId}-${Date.now()}`,
      type: 'impact',
      time: now,
      text: headline(locName),
      from: null,
      to,
      sources: pick(SOURCES_POOL),
      status: 'reported',
      detail: `Ground impact confirmed in ${to?.name || 'unknown'} area. Damage assessment underway.`,
      day: 5,
      threat: { level: 'critical', category: 'conflict', confidence: 0.8 },
    };
  }

  const headline = pick(HEADLINES.info);
  return {
    id: `sim-${++simId}-${Date.now()}`,
    type: 'info',
    time: now,
    text: headline,
    from: null,
    to: pickKey(TARGET_SITES).loc,
    sources: pick(SOURCES_POOL),
    status: 'reported',
    detail: headline,
    day: 5,
    threat: { level: 'medium', category: 'geopolitical', confidence: 0.7 },
  };
}

/**
 * Start the simulation loop. Fires onEvent every 8-20 seconds.
 * Also fires an initial burst of 3 events in the first 5 seconds.
 */
export function startSimulation(onEvent) {
  // Initial burst so the page immediately feels alive
  setTimeout(() => onEvent(generateEvent()), 1500);
  setTimeout(() => onEvent(generateEvent()), 3500);
  setTimeout(() => onEvent(generateEvent()), 5500);

  function scheduleNext() {
    const delay = 8000 + Math.random() * 12000;
    setTimeout(() => {
      onEvent(generateEvent());
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}
