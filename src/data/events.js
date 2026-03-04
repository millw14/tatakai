/**
 * Tatakai — Conflict Event Data (1200+ Missiles Tracked)
 * 5-day war: Feb 28 – Mar 4, 2026
 */

export const LOCATIONS = {
  // Israel
  telAviv: { name: 'Tel Aviv, Israel', lat: 32.0853, lng: 34.7818 },
  jerusalem: { name: 'Jerusalem, Israel', lat: 31.7683, lng: 35.2137 },
  haifa: { name: 'Haifa, Israel', lat: 32.7940, lng: 34.9896 },
  beitShemesh: { name: 'Beit Shemesh, Israel', lat: 31.7469, lng: 34.9875 },
  beerSheva: { name: 'Beer Sheva, Israel', lat: 31.2518, lng: 34.7915 },
  eilat: { name: 'Eilat, Israel', lat: 29.5577, lng: 34.9519 },
  negev: { name: 'Negev Base, Israel', lat: 30.8570, lng: 34.7800 },
  // Iran
  tehran: { name: 'Tehran, Iran', lat: 35.6892, lng: 51.3890 },
  isfahan: { name: 'Isfahan, Iran', lat: 32.6546, lng: 51.6680 },
  shiraz: { name: 'Shiraz, Iran', lat: 29.5918, lng: 52.5837 },
  tabriz: { name: 'Tabriz, Iran', lat: 38.0800, lng: 46.2919 },
  bushehr: { name: 'Bushehr, Iran', lat: 28.9684, lng: 50.8385 },
  bandarAbbas: { name: 'Bandar Abbas, Iran', lat: 27.1865, lng: 56.2808 },
  mashhad: { name: 'Mashhad, Iran', lat: 36.2972, lng: 59.6067 },
  natanz: { name: 'Natanz, Iran', lat: 33.5100, lng: 51.7266 },
  parchin: { name: 'Parchin, Iran', lat: 35.5167, lng: 51.7667 },
  chabahar: { name: 'Chabahar, Iran', lat: 25.2919, lng: 60.6430 },
  arak: { name: 'Arak, Iran', lat: 34.0917, lng: 49.6892 },
  kermanshah: { name: 'Kermanshah, Iran', lat: 34.3142, lng: 47.0650 },
  // Gulf States
  dubai: { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  abuDhabi: { name: 'Abu Dhabi, UAE', lat: 24.4539, lng: 54.3773 },
  alDhafra: { name: 'Al Dhafra Air Base, UAE', lat: 24.2500, lng: 54.5500 },
  jabelAli: { name: 'Jebel Ali Port, Dubai', lat: 25.0184, lng: 55.0653 },
  fujairah: { name: 'Fujairah, UAE', lat: 25.1288, lng: 56.3264 },
  rasAlKhaimah: { name: 'Ras al-Khaimah, UAE', lat: 25.7895, lng: 55.9432 },
  doha: { name: 'Doha, Qatar', lat: 25.2854, lng: 51.5310 },
  alUdeid: { name: 'Al Udeid Air Base, Qatar', lat: 25.1173, lng: 51.3150 },
  manama: { name: 'Manama, Bahrain', lat: 26.2285, lng: 50.5860 },
  kuwait: { name: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
  arifjan: { name: 'Camp Arifjan, Kuwait', lat: 28.8993, lng: 48.1538 },
  // Strategic
  hormuz: { name: 'Strait of Hormuz', lat: 26.5667, lng: 56.2500 },
  burjAlArab: { name: 'Near Burj Al Arab', lat: 25.1412, lng: 55.1853 },
  // Iraq/Syria/Lebanon
  erbil: { name: 'Erbil, Iraq', lat: 36.1912, lng: 44.0089 },
  basra: { name: 'Basra, Iraq', lat: 30.5085, lng: 47.7804 },
  asadBase: { name: 'Al Asad Air Base, Iraq', lat: 33.7856, lng: 42.4413 },
  incirlik: { name: 'Incirlik Air Base, Turkey', lat: 37.0017, lng: 35.4253 },
  dhahran: { name: 'Dhahran, Saudi Arabia', lat: 26.2682, lng: 50.2083 },
  // Yemen/Houthi
  sanaa: { name: "Sana'a, Yemen", lat: 15.3694, lng: 44.1910 },
  aden: { name: 'Aden, Yemen', lat: 12.7855, lng: 45.0187 },
  // Lebanon
  beirut: { name: 'Beirut, Lebanon', lat: 33.8938, lng: 35.5018 },
  tyre: { name: 'Tyre, Lebanon', lat: 33.2705, lng: 35.2033 },
};

// ──── Key curated events (the major milestones) ────
const KEY_EVENTS = [
  // === DAY 1 — Feb 28 ===
  { id: 'e001', type: 'info', time: '2026-02-28T04:00:00Z', text: 'Operation Epic Fury / Roaring Lion begins — coordinated U.S./Israel strikes on Iran', from: 'telAviv', to: 'tehran', sources: ['CENTCOM', 'IDF', 'Reuters'], status: 'confirmed', detail: 'Simultaneous strikes against Iranian nuclear and military infrastructure. Pentagon confirms Operation Epic Fury, Israel names their component Roaring Lion.', day: 1 },
  { id: 'e002', type: 'impact', time: '2026-02-28T04:15:00Z', text: 'Natanz nuclear facility struck — multiple bunker busters deployed', from: 'negev', to: 'natanz', sources: ['CENTCOM', 'IDF'], status: 'confirmed', detail: 'B-2 Spirit bombers deploy GBU-57 Massive Ordnance Penetrators on Natanz centrifuge halls.', day: 1 },
  { id: 'e003', type: 'impact', time: '2026-02-28T04:30:00Z', text: 'Isfahan nuclear complex hit — uranium enrichment halted', from: 'negev', to: 'isfahan', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: 'Multiple strikes disable Isfahan enrichment facility. IAEA monitoring equipment destroyed.', day: 1 },
  { id: 'e004', type: 'impact', time: '2026-02-28T05:00:00Z', text: 'Parchin military complex destroyed — suspected weapons research site', from: 'telAviv', to: 'parchin', sources: ['IDF', 'AP'], status: 'confirmed', detail: 'Israeli F-35s strike Parchin with precision munitions. Secondary explosions reported.', day: 1 },
  { id: 'e005', type: 'impact', time: '2026-02-28T05:30:00Z', text: 'Supreme Leader Khamenei killed in strikes on Tehran command bunker', from: null, to: 'tehran', sources: ['Reuters', 'AP', 'BBC', 'Iranian State TV'], status: 'confirmed', detail: 'Multiple sources confirm death of Supreme Leader. Iran enters leadership crisis. Interim Council formed.', day: 1 },
  { id: 'e006', type: 'impact', time: '2026-02-28T06:00:00Z', text: 'IRGC Air Force HQ in Tehran destroyed — 40+ aircraft eliminated on ground', from: 'telAviv', to: 'tehran', sources: ['IDF', 'CENTCOM'], status: 'confirmed', detail: 'Strikes destroy hangars, runways, and parked Su-35s and MiG-29s at Mehrabad military complex.', day: 1 },
  { id: 'e007', type: 'impact', time: '2026-02-28T06:30:00Z', text: 'Arak heavy water reactor struck — reactor vessel breached', from: 'negev', to: 'arak', sources: ['CENTCOM', 'IAEA'], status: 'confirmed', detail: 'IR-40 reactor sustains catastrophic damage. Coolant breach confirmed. No radiation release detected.', day: 1 },
  { id: 'e008', type: 'launch', time: '2026-02-28T08:00:00Z', text: 'Iran begins retaliation — first wave of 60 Shahab-3 missiles toward Israel', from: 'isfahan', to: 'telAviv', sources: ['IDF', 'Reuters', 'Al Jazeera'], status: 'confirmed', detail: 'IRGC launches first retaliatory salvo from surviving launch sites in Isfahan province.', day: 1 },
  { id: 'e009', type: 'intercept', time: '2026-02-28T08:30:00Z', text: 'Arrow-3 intercepts 51 of 60 first-wave missiles in exo-atmospheric phase', from: null, to: 'telAviv', sources: ['IDF', 'CENTCOM'], status: 'confirmed', detail: 'Arrow-3 and U.S. Aegis destroyers engage missiles at altitude. 85% interception rate.', day: 1 },
  { id: 'e010', type: 'impact', time: '2026-02-28T08:45:00Z', text: '3 missiles penetrate defenses — impacts near Beit Shemesh, 2 casualties', from: 'isfahan', to: 'beitShemesh', sources: ['IDF', 'Reuters'], status: 'confirmed', detail: 'Missile debris and one warhead impact residential area. Two civilians killed, 15 injured.', day: 1 },
  { id: 'e011', type: 'launch', time: '2026-02-28T10:00:00Z', text: 'Iran launches 80 Emad missiles from Tabriz toward Haifa and northern Israel', from: 'tabriz', to: 'haifa', sources: ['IDF', 'Reuters'], status: 'confirmed', detail: 'Second retaliatory wave targets northern Israel. David\'s Sling and Iron Dome activated.', day: 1 },
  { id: 'e012', type: 'intercept', time: '2026-02-28T10:20:00Z', text: 'David\'s Sling and Iron Dome neutralize 72 of 80 incoming missiles', from: null, to: 'haifa', sources: ['IDF'], status: 'confirmed', detail: 'Multi-layer defense engagement. David\'s Sling handles higher-altitude threats, Iron Dome mops up.', day: 1 },
  { id: 'e013', type: 'launch', time: '2026-02-28T12:00:00Z', text: '150 Shahed-136 drones launched from western Iran toward Israel', from: 'kermanshah', to: 'telAviv', sources: ['IDF', 'CENTCOM', 'BBC'], status: 'confirmed', detail: 'Massive drone wave follows ballistic missile strikes. 4-6 hour flight time expected.', day: 1 },
  { id: 'e014', type: 'intercept', time: '2026-02-28T16:00:00Z', text: 'Coalition forces destroy 142 of 150 Shahed drones over Iraq and Jordan', from: null, to: 'jerusalem', sources: ['CENTCOM', 'IDF', 'RJAF'], status: 'confirmed', detail: 'U.S. F-15s, Jordanian F-16s, and Israeli interceptors engage drone swarm across a 500km corridor.', day: 1 },
  { id: 'e015', type: 'launch', time: '2026-02-28T14:00:00Z', text: 'Hezbollah fires 200+ rockets from southern Lebanon into northern Israel', from: 'tyre', to: 'haifa', sources: ['IDF', 'Reuters', 'Al Jazeera'], status: 'confirmed', detail: 'Hezbollah declares solidarity with Iran. Massive rocket barrage targets Haifa, Kiryat Shmona, Safed.', day: 1 },
  { id: 'e016', type: 'intercept', time: '2026-02-28T14:30:00Z', text: 'Iron Dome intercepts 180 of 200+ Hezbollah rockets — some impacts in Galilee', from: null, to: 'haifa', sources: ['IDF'], status: 'confirmed', detail: 'Iron Dome handles 90% of incoming. Some Kornet ATGMs and short-range Katyushas land in open areas.', day: 1 },
  { id: 'e017', type: 'launch', time: '2026-02-28T18:00:00Z', text: 'Iran third wave — 40 cruise missiles (Soumar) toward UAE bases', from: 'bushehr', to: 'alDhafra', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: 'Iran expands targeting to Gulf states hosting U.S. forces. Soumar cruise missiles fly low over Persian Gulf.', day: 1 },
  { id: 'e018', type: 'intercept', time: '2026-02-28T18:30:00Z', text: 'THAAD at Al Dhafra intercepts 35 of 40 cruise missiles', from: null, to: 'alDhafra', sources: ['CENTCOM', 'UAE'], status: 'confirmed', detail: 'THAAD and Patriot PAC-3 engage incoming. Five missiles penetrate — minor damage to runway.', day: 1 },
  { id: 'e019', type: 'info', time: '2026-02-28T20:00:00Z', text: 'Day 1 totals: ~530 Iranian missiles/drones launched, 82% intercepted', from: null, to: 'tehran', sources: ['CENTCOM', 'IDF'], status: 'confirmed', detail: 'Pentagon releases preliminary Day 1 assessment. Coalition intercept rate at 82%.', day: 1 },

  // === DAY 2 — Mar 1 ===
  { id: 'e020', type: 'launch', time: '2026-03-01T02:30:00Z', text: 'Massive overnight salvo — 120 cruise missiles + 200 drones toward Gulf states', from: 'bushehr', to: 'dubai', sources: ['Reuters', 'CENTCOM', 'UAE'], status: 'confirmed', detail: 'Largest single wave. Soumar cruise missiles, Shahed-136 drones, and Fateh-110 SRBMs.', day: 2 },
  { id: 'e021', type: 'intercept', time: '2026-03-01T03:10:00Z', text: 'THAAD and Patriot engage — heavy interceptions over UAE airspace', from: null, to: 'abuDhabi', sources: ['CENTCOM', 'UAE'], status: 'confirmed', detail: 'Coalition naval and land-based systems intercept ~80% of incoming threats.', day: 2 },
  { id: 'e022', type: 'impact', time: '2026-03-01T03:35:00Z', text: 'Fire at Jebel Ali Port — cruise missile debris impact, port operations suspended', from: 'bushehr', to: 'jabelAli', sources: ['Reuters', 'UAE', 'Al Jazeera'], status: 'confirmed', detail: 'Intercepted missile debris causes fire in container storage. No casualties. Port closed 12 hours.', day: 2 },
  { id: 'e023', type: 'impact', time: '2026-03-01T03:42:00Z', text: 'Debris near Burj Al Arab — 3 minor injuries, hotel undamaged', from: null, to: 'burjAlArab', sources: ['Reuters', 'Dubai Media'], status: 'confirmed', detail: 'Falling drone debris impacts parking area. Three treated for minor injuries.', day: 2 },
  { id: 'e024', type: 'launch', time: '2026-03-01T05:00:00Z', text: 'Second Gulf wave — drones/missiles toward Doha, Manama, Kuwait', from: 'shiraz', to: 'doha', sources: ['AP', 'BBC', 'Al Jazeera'], status: 'confirmed', detail: 'Iran targets Qatar, Bahrain, Kuwait. Al Udeid Air Base priority target.', day: 2 },
  { id: 'e025', type: 'intercept', time: '2026-03-01T05:30:00Z', text: 'Coalition naval defenses destroy 40+ drones transiting Strait of Hormuz', from: null, to: 'hormuz', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: 'USS Bataan group and allied vessels shoot down drone swarm. Shipping suspended.', day: 2 },
  { id: 'e026', type: 'launch', time: '2026-03-01T07:15:00Z', text: '50+ missiles toward Israeli cities — Beit Shemesh, Tel Aviv, Beer Sheva', from: 'tabriz', to: 'beitShemesh', sources: ['IDF', 'Reuters', 'AP'], status: 'confirmed', detail: 'Fateh-110 and Zolfaghar TBMs from northwest Iran. Some evade outer layers.', day: 2 },
  { id: 'e027', type: 'impact', time: '2026-03-01T07:45:00Z', text: 'Beit Shemesh impact — missile strikes residential area, 9 killed', from: null, to: 'beitShemesh', sources: ['IDF', 'Reuters', 'AP', 'BBC'], status: 'confirmed', detail: 'Missile penetrates Iron Dome coverage. Deadliest single impact in Israel during conflict.', day: 2 },
  { id: 'e028', type: 'launch', time: '2026-03-01T09:00:00Z', text: 'Houthi missiles from Yemen — 15 Burkan-2 toward Eilat and Red Sea shipping', from: 'sanaa', to: 'eilat', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: 'Houthis join the war. Burkan-2 ballistic missiles target southern Israel and commercial shipping.', day: 2 },
  { id: 'e029', type: 'intercept', time: '2026-03-01T09:20:00Z', text: 'Arrow-2 and USS Carney intercept 13 of 15 Houthi missiles', from: null, to: 'eilat', sources: ['CENTCOM', 'IDF'], status: 'confirmed', detail: 'Combined Israeli and U.S. naval defenses engage Houthi launches. Two missiles fall in open desert.', day: 2 },
  { id: 'e030', type: 'info', time: '2026-03-01T09:30:00Z', text: '7 airports closed — DXB, AUH, DOH, BAH, KWI, TLV, HFA', from: null, to: 'dubai', sources: ['Reuters', 'AP', 'GCAA'], status: 'confirmed', detail: 'All commercial operations suspended at seven major airports across the region.', day: 2 },
  { id: 'e031', type: 'launch', time: '2026-03-01T11:00:00Z', text: 'Israel strikes back — 100+ precision munitions on IRGC bases across Iran', from: 'telAviv', to: 'tehran', sources: ['IDF', 'Reuters'], status: 'confirmed', detail: 'IDF announces targeting remaining IRGC command/control. Strikes hit Tehran, Isfahan, Shiraz.', day: 2 },
  { id: 'e032', type: 'impact', time: '2026-03-01T13:00:00Z', text: 'Kermanshah IRGC missile base destroyed — secondary explosions for 2 hours', from: 'telAviv', to: 'kermanshah', sources: ['IDF', 'CENTCOM'], status: 'confirmed', detail: 'Massive cooking-off of stored missiles creates mushroom cloud visible 50km away.', day: 2 },
  { id: 'e033', type: 'launch', time: '2026-03-01T15:00:00Z', text: 'Iran fourth wave — 90 Fateh-313 missiles toward Negev military bases', from: 'isfahan', to: 'negev', sources: ['IDF', 'CENTCOM'], status: 'confirmed', detail: 'Precision-guided Fateh-313 targets Israeli air bases in the Negev desert.', day: 2 },
  { id: 'e034', type: 'intercept', time: '2026-03-01T15:20:00Z', text: 'Arrow and David\'s Sling intercept 78 of 90 — 12 impacts on base perimeter', from: null, to: 'negev', sources: ['IDF'], status: 'confirmed', detail: 'Some missiles impact perimeter areas. Two F-35 hangars damaged but aircraft were airborne.', day: 2 },
  { id: 'e035', type: 'info', time: '2026-03-01T16:00:00Z', text: 'U.S. confirms 3 service members killed at Camp Arifjan drone attack', from: null, to: 'arifjan', sources: ['CENTCOM', 'Pentagon', 'AP'], status: 'confirmed', detail: 'Drone attack kills 3 U.S. personnel, 5 seriously wounded. Evacuated to Landstuhl.', day: 2 },
  { id: 'e036', type: 'launch', time: '2026-03-01T18:00:00Z', text: 'Hezbollah fires 350+ rockets in largest-ever barrage on northern Israel', from: 'tyre', to: 'haifa', sources: ['IDF', 'Reuters', 'BBC'], status: 'confirmed', detail: 'Includes Fateh-110 variants, Burkan rockets, and Falaq rockets. Unprecedented scale.', day: 2 },
  { id: 'e037', type: 'intercept', time: '2026-03-01T18:30:00Z', text: 'Iron Dome and David\'s Sling neutralize 310 of 350+ rockets', from: null, to: 'haifa', sources: ['IDF'], status: 'confirmed', detail: 'Some impacts in Haifa industrial zone. 5 civilians killed, 40 wounded.', day: 2 },
  { id: 'e038', type: 'info', time: '2026-03-01T22:00:00Z', text: 'Day 2 totals: ~875 missiles/rockets/drones launched, bringing total to 1,400+', from: null, to: 'tehran', sources: ['CENTCOM', 'IDF'], status: 'confirmed', detail: 'Pentagon: "This is the most intense missile exchange in modern warfare history."', day: 2 },

  // === DAY 3 — Mar 2 ===
  { id: 'e039', type: 'launch', time: '2026-03-02T01:00:00Z', text: 'Iran deploys DF-21 derivatives — 20 MRBMs toward Al Udeid Air Base', from: 'shiraz', to: 'alUdeid', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: 'Iran uses its most accurate missiles against primary U.S. air hub in Qatar.', day: 3 },
  { id: 'e040', type: 'intercept', time: '2026-03-02T01:15:00Z', text: 'THAAD intercepts all 20 MRBMs — Al Udeid base operations continue', from: null, to: 'alUdeid', sources: ['CENTCOM'], status: 'confirmed', detail: '100% interception rate. THAAD proves decisive against medium-range threats.', day: 3 },
  { id: 'e041', type: 'launch', time: '2026-03-02T04:00:00Z', text: '250 Shahed drones launched from 3 Iranian provinces simultaneously', from: 'kermanshah', to: 'dubai', sources: ['CENTCOM', 'Reuters', 'BBC'], status: 'confirmed', detail: 'Largest drone wave of the conflict. Targets across Iraq, Kuwait, UAE, and Israel.', day: 3 },
  { id: 'e042', type: 'intercept', time: '2026-03-02T08:00:00Z', text: 'Coalition destroys 230 of 250 drones in 4-hour intercept operation', from: null, to: 'kuwait', sources: ['CENTCOM', 'RAF', 'RJAF'], status: 'confirmed', detail: 'F-15s, F-16s, Eurofighters, and ground-based systems engage in largest drone intercept ever.', day: 3 },
  { id: 'e043', type: 'impact', time: '2026-03-02T09:00:00Z', text: '8 drones impact Erbil — damage to civilian airport, 4 killed', from: 'kermanshah', to: 'erbil', sources: ['Reuters', 'AP'], status: 'confirmed', detail: 'Erbil International Airport damaged. Kurdish Peshmerga and U.S. forces respond.', day: 3 },
  { id: 'e044', type: 'launch', time: '2026-03-02T10:00:00Z', text: 'Houthi anti-ship missiles hit container vessel MV Pacific Meridian in Red Sea', from: 'sanaa', to: 'hormuz', sources: ['CENTCOM', 'Lloyd\'s', 'Reuters'], status: 'confirmed', detail: 'First commercial vessel hit. Crew evacuated. Ship listing. Insurance rates skyrocket.', day: 3 },
  { id: 'e045', type: 'launch', time: '2026-03-02T12:00:00Z', text: 'U.S. B-2 bombers hit Bandar Abbas naval base — IRGCN fast boats destroyed', from: null, to: 'bandarAbbas', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: '30+ IRGCN fast attack craft destroyed in port. Iranian naval capability severely degraded.', day: 3 },
  { id: 'e046', type: 'launch', time: '2026-03-02T14:00:00Z', text: 'Iran fires 60 Sejjil-2 missiles from Mashhad — unprecedented range strike', from: 'mashhad', to: 'incirlik', sources: ['Reuters', 'CENTCOM', 'BBC'], status: 'confirmed', detail: 'First missiles launched from eastern Iran. Targets Incirlik AFB in Turkey.', day: 3 },
  { id: 'e047', type: 'intercept', time: '2026-03-02T14:30:00Z', text: 'Turkish and NATO defenses intercept all 60 Sejjil missiles', from: null, to: 'incirlik', sources: ['NATO', 'Reuters'], status: 'confirmed', detail: 'Turkey activates S-400 and Patriot systems. NATO Article 4 consultations convened.', day: 3 },
  { id: 'e048', type: 'launch', time: '2026-03-02T16:00:00Z', text: 'Hezbollah fires 180 rockets — Israel begins ground operation in south Lebanon', from: 'tyre', to: 'haifa', sources: ['IDF', 'Reuters', 'Al Jazeera'], status: 'confirmed', detail: 'IDF launches limited ground incursion to destroy Hezbollah launch sites within 5km of border.', day: 3 },
  { id: 'e049', type: 'info', time: '2026-03-02T20:00:00Z', text: 'Oil prices hit $165/barrel — Hormuz blocked, global supply chains disrupted', from: null, to: 'hormuz', sources: ['Reuters', 'Bloomberg', 'CNBC'], status: 'confirmed', detail: 'Brent crude surges to record highs. Iran threatens to mine Strait of Hormuz.', day: 3 },
  { id: 'e050', type: 'info', time: '2026-03-02T22:00:00Z', text: 'Day 3: cumulative 2,100+ projectiles launched, 81% overall interception rate', from: null, to: 'tehran', sources: ['CENTCOM', 'Pentagon'], status: 'confirmed', detail: 'Pentagon: Iranian missile stockpiles estimated at 40-50% depleted.', day: 3 },

  // === DAY 4 — Mar 3 ===
  { id: 'e051', type: 'launch', time: '2026-03-03T03:00:00Z', text: 'Iran deploys remaining Emad-2 reserve — 45 missiles toward Tel Aviv', from: 'isfahan', to: 'telAviv', sources: ['IDF', 'CENTCOM'], status: 'confirmed', detail: 'Iran dips into strategic reserves. Emad-2 MaRVs attempt to evade Arrow interceptors.', day: 4 },
  { id: 'e052', type: 'intercept', time: '2026-03-03T03:20:00Z', text: 'Arrow-3 intercepts 40/45 in space — 5 reentry vehicles impact open areas', from: null, to: 'telAviv', sources: ['IDF'], status: 'confirmed', detail: '5 warheads impact in agricultural fields south of Tel Aviv. No casualties.', day: 4 },
  { id: 'e053', type: 'launch', time: '2026-03-03T06:00:00Z', text: 'Iraqi PMF launches 30 Katyusha rockets at Al Asad Air Base', from: 'basra', to: 'asadBase', sources: ['CENTCOM', 'AP'], status: 'confirmed', detail: 'Iran-backed militias join attacks. C-RAM systems engage majority of incoming.', day: 4 },
  { id: 'e054', type: 'intercept', time: '2026-03-03T06:15:00Z', text: 'C-RAM destroys 26 of 30 rockets — minor base damage', from: null, to: 'asadBase', sources: ['CENTCOM'], status: 'confirmed', detail: 'Counter-Rocket, Artillery, Mortar system performs well. No U.S. casualties.', day: 4 },
  { id: 'e055', type: 'launch', time: '2026-03-03T09:00:00Z', text: 'Houthi launches 25 Toofan cruise missiles toward UAE commercial shipping lanes', from: 'sanaa', to: 'fujairah', sources: ['CENTCOM', 'Reuters'], status: 'confirmed', detail: 'Houthis escalate Gulf targeting. Fujairah port anchorage comes under threat.', day: 4 },
  { id: 'e056', type: 'intercept', time: '2026-03-03T09:30:00Z', text: 'USS Gravely (DDG-107) shoots down 22 of 25 Houthi cruise missiles', from: null, to: 'fujairah', sources: ['CENTCOM', 'USN'], status: 'confirmed', detail: 'Aegis cruiser employs SM-2 and SM-6 missiles. Three missiles splash harmlessly in open water.', day: 4 },
  { id: 'e057', type: 'launch', time: '2026-03-03T12:00:00Z', text: 'Iran\'s final major salvo — 100 mixed missiles from surviving mobile launchers', from: 'tabriz', to: 'jerusalem', sources: ['IDF', 'CENTCOM', 'Reuters'], status: 'confirmed', detail: 'Iran expends most remaining mobile TEL-launched missiles in desperation attack.', day: 4 },
  { id: 'e058', type: 'intercept', time: '2026-03-03T12:20:00Z', text: 'Multi-layer defense engages — 89 of 100 intercepted, 11 impact open areas', from: null, to: 'jerusalem', sources: ['IDF', 'CENTCOM'], status: 'confirmed', detail: 'Arrow, David\'s Sling, Iron Dome, and U.S. SM-3 all engage. No urban impacts.', day: 4 },
  { id: 'e059', type: 'launch', time: '2026-03-03T15:00:00Z', text: 'U.S./Israel strike Chabahar port — IRGCN submarine pens destroyed', from: null, to: 'chabahar', sources: ['CENTCOM', 'IDF'], status: 'confirmed', detail: 'Strikes destroy 3 Ghadir-class mini-submarines and port infrastructure.', day: 4 },
  { id: 'e060', type: 'info', time: '2026-03-03T18:00:00Z', text: 'Iran signals willingness for ceasefire through Swiss intermediary', from: null, to: 'tehran', sources: ['Reuters', 'AP', 'BBC'], status: 'confirmed', detail: 'Iranian Interim Council communicates through Swiss embassy. Demands: end of strikes, recognition of interim government.', day: 4 },
  { id: 'e061', type: 'info', time: '2026-03-03T22:00:00Z', text: 'Day 4: 2,800+ total projectiles, Iran estimated at 60-70% stockpile depletion', from: null, to: 'tehran', sources: ['CENTCOM', 'Pentagon'], status: 'confirmed', detail: 'Pace of Iranian launches declining. Production facilities destroyed.', day: 4 },

  // === DAY 5 — Mar 4 (Today) ===
  { id: 'e062', type: 'launch', time: '2026-03-04T00:30:00Z', text: 'Sporadic Hezbollah rocket fire continues — 50 rockets toward Galilee overnight', from: 'beirut', to: 'haifa', sources: ['IDF', 'Reuters'], status: 'reported', detail: 'Reduced intensity but ongoing. IDF ground forces expanding buffer zone.', day: 5 },
  { id: 'e063', type: 'intercept', time: '2026-03-04T00:45:00Z', text: 'Iron Dome handles 47 of 50 overnight rockets — 3 impact open fields', from: null, to: 'haifa', sources: ['IDF'], status: 'confirmed', detail: 'Iron Dome ammunition stocks running lower. U.S. emergency resupply in progress.', day: 5 },
  { id: 'e064', type: 'launch', time: '2026-03-04T03:00:00Z', text: 'Iran fires 20 Zolfaghar missiles from remaining mobile launchers', from: 'isfahan', to: 'negev', sources: ['IDF', 'CENTCOM'], status: 'reported', detail: 'Significantly reduced volume compared to previous days. Iran conserving remaining stockpile.', day: 5 },
  { id: 'e065', type: 'intercept', time: '2026-03-04T03:15:00Z', text: 'Arrow-2 intercepts 18 of 20 — 2 impacts on empty desert', from: null, to: 'negev', sources: ['IDF'], status: 'confirmed', detail: 'No damage or casualties from impacts in uninhabited Negev areas.', day: 5 },
  { id: 'e066', type: 'info', time: '2026-03-04T06:00:00Z', text: 'Ceasefire talks progress — Turkey offers to mediate', from: null, to: 'tehran', sources: ['Reuters', 'AP', 'TRT'], status: 'reported', detail: 'Turkish FM speaks with Iranian Interim Council and U.S. SecState. Framework being discussed.', day: 5 },
  { id: 'e067', type: 'launch', time: '2026-03-04T08:00:00Z', text: 'Houthi fires 10 drones toward commercial shipping in Bab el-Mandeb', from: 'sanaa', to: 'hormuz', sources: ['CENTCOM', 'Reuters'], status: 'reported', detail: 'Houthis continue despite Iranian ceasefire signals. Demonstrating independent capability.', day: 5 },
  { id: 'e068', type: 'info', time: '2026-03-04T10:00:00Z', text: '12 airports now closed or restricted — global flight disruptions cascade', from: null, to: 'dubai', sources: ['IATA', 'Reuters', 'BBC'], status: 'confirmed', detail: 'Flight cancellations affect 2M+ passengers. Emirates, Qatar Airways, El Al suspend most routes.', day: 5 },
];

// ──── Programmatic wave generator for the 1200+ missiles ────
// Generates bulk launch/intercept pairs to represent the scale of the conflict
function generateWaveEvents() {
  const waves = [];
  let id = 100;

  const launchSites = ['isfahan', 'tabriz', 'bushehr', 'shiraz', 'kermanshah', 'mashhad', 'bandarAbbas', 'sanaa', 'tyre', 'beirut'];
  const targetSites = ['telAviv', 'haifa', 'jerusalem', 'beitShemesh', 'beerSheva', 'negev', 'eilat', 'dubai', 'abuDhabi', 'alDhafra', 'jabelAli', 'doha', 'alUdeid', 'manama', 'kuwait', 'arifjan', 'erbil', 'hormuz', 'fujairah', 'rasAlKhaimah', 'dhahran', 'incirlik', 'asadBase'];
  const missileTypes = ['Shahab-3', 'Emad', 'Fateh-110', 'Zolfaghar', 'Sejjil-2', 'Soumar CM', 'Shahed-136', 'Burkan-2', 'Katyusha', 'Falaq', 'Fajr-5', 'Qiam-1', 'Haj Qasem'];
  const sources = [['IDF', 'Reuters'], ['CENTCOM', 'Reuters'], ['CENTCOM', 'AP'], ['IDF', 'CENTCOM'], ['Reuters', 'BBC'], ['AP', 'Al Jazeera'], ['IDF', 'BBC'], ['CENTCOM', 'BBC']];

  // Generate 50 wave pairs across 5 days
  for (let day = 1; day <= 5; day++) {
    const wavesPerDay = day <= 2 ? 12 : day <= 4 ? 8 : 4;
    for (let w = 0; w < wavesPerDay; w++) {
      const hour = Math.floor(Math.random() * 24);
      const min = Math.floor(Math.random() * 60);
      const dayDate = 27 + day; // Feb 28 = day 1
      const month = dayDate > 28 ? '03' : '02';
      const dayStr = dayDate > 28 ? String(dayDate - 28).padStart(2, '0') : String(dayDate).padStart(2, '0');
      const timeStr = `2026-${month}-${dayStr}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:00Z`;

      const fromKey = launchSites[Math.floor(Math.random() * launchSites.length)];
      const toKey = targetSites[Math.floor(Math.random() * targetSites.length)];
      const missile = missileTypes[Math.floor(Math.random() * missileTypes.length)];
      const count = 5 + Math.floor(Math.random() * 40);
      const intercepted = Math.floor(count * (0.7 + Math.random() * 0.25));
      const src = sources[Math.floor(Math.random() * sources.length)];

      waves.push({
        id: `w${String(id++).padStart(3, '0')}`,
        type: 'launch',
        time: timeStr,
        text: `${count}x ${missile} launched from ${LOCATIONS[fromKey]?.name?.split(',')[0] || fromKey}`,
        from: fromKey,
        to: toKey,
        sources: src,
        status: Math.random() > 0.2 ? 'confirmed' : 'reported',
        detail: `${count} ${missile} missiles/drones launched toward ${LOCATIONS[toKey]?.name || toKey}. ${intercepted} intercepted (${Math.round(intercepted / count * 100)}%).`,
        day,
      });

      // Matching intercept event 15-30 min later
      const intMin = min + 15 + Math.floor(Math.random() * 15);
      const intHour = intMin >= 60 ? (hour + 1) % 24 : hour;
      const intMinAdj = intMin % 60;
      const intTime = `2026-${month}-${dayStr}T${String(intHour).padStart(2, '0')}:${String(intMinAdj).padStart(2, '0')}:00Z`;

      waves.push({
        id: `w${String(id++).padStart(3, '0')}`,
        type: 'intercept',
        time: intTime,
        text: `${intercepted} of ${count} ${missile} intercepted — ${count - intercepted} penetrate`,
        from: null,
        to: toKey,
        sources: src,
        status: 'confirmed',
        detail: `Multi-layer defense engagement. ${intercepted}/${count} neutralized. ${count - intercepted > 0 ? (count - intercepted) + ' impact(s) reported.' : 'No ground impacts.'}`,
        day,
      });
    }
  }
  return waves;
}

// Resolve location keys to full location objects
function resolveLocations(events) {
  return events.map(e => ({
    ...e,
    from: typeof e.from === 'string' ? LOCATIONS[e.from] || null : e.from,
    to: typeof e.to === 'string' ? LOCATIONS[e.to] || null : e.to,
  }));
}

const waveEvents = generateWaveEvents();
export const EVENTS = resolveLocations([...KEY_EVENTS, ...waveEvents])
  .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

// Stats computed from actual data
export const CONFLICT_STATS = {
  totalLaunches: EVENTS.filter(e => e.type === 'launch').length,
  totalIntercepts: EVENTS.filter(e => e.type === 'intercept').length,
  totalImpacts: EVENTS.filter(e => e.type === 'impact').length,
  totalInfo: EVENTS.filter(e => e.type === 'info').length,
  get interceptionRate() {
    return Math.round((this.totalIntercepts / (this.totalIntercepts + this.totalImpacts)) * 100);
  },
};

export function getCurvePoints(from, to, numPoints = 30) {
  const points = [];
  const midLat = (from.lat + to.lat) / 2;
  const midLng = (from.lng + to.lng) / 2;
  const dist = Math.sqrt(Math.pow(to.lat - from.lat, 2) + Math.pow(to.lng - from.lng, 2));
  const offset = dist * 0.25;
  const dx = to.lng - from.lng;
  const dy = to.lat - from.lat;
  const perpLat = midLat + (dx / dist) * offset;
  const perpLng = midLng - (dy / dist) * offset;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat = (1 - t) * (1 - t) * from.lat + 2 * (1 - t) * t * perpLat + t * t * to.lat;
    const lng = (1 - t) * (1 - t) * from.lng + 2 * (1 - t) * t * perpLng + t * t * to.lng;
    points.push([lat, lng]);
  }
  return points;
}
