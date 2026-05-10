import React, { useEffect, useMemo, useState, useCallback } from "react";

/* ════════════════════════════════════════════════════════════════════
   SYNCHRONISATION ATLAS — v4.1
   Braun/Rams aesthetic · fully responsive
   ════════════════════════════════════════════════════════════════════ */

// ── RESPONSIVE HOOK ───────────────────────────────────────────────

function useBreakpoint() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { w, isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024 };
}

// ── DATA ──────────────────────────────────────────────────────────

const states = {
  beginning: { id: "beginning", short: "01", name: "Beginning", region: "OPEN", zone: "Zn-1", gate: "Gt-01", color: "#E8590C", x: 500, y: 92, function: "Initiates continuity", signature: "Pre-capture ignition · room-tone before the day hardens", body: ["small delicate movements","light alertness","sense of impending start","easily broken by overthinking"], cues: ["first sip","morning ignition","empty theatre","before the task becomes a task"], demons: ["Lurgo","Duoddod","Ixix","Tchakki","Puppo","Minommo","Uttunul","Tchu"], likelyNext: [{ target: "captured", weight: 88, label: "Strong" },{ target: "catastrophic", weight: 34, label: "Medium" },{ target: "beginning", weight: 16, label: "Weak self-loop" }], corruption: "Briefing, doomscrolling, over-explaining, turning ignition into admin.", grace: "Pure ignition before demand.", howToExit: "Pick one small real action. Do not explain the day before beginning it." },
  captured: { id: "captured", short: "02", name: "Captured", region: "LOCK", zone: "Zn-2/3", gate: "Gt-03", color: "#D97706", x: 816, y: 220, function: "Assigns continuity", signature: "Possibility collapses into assignment", body: ["body recruited by schedule","clock becomes operant","track / groove feeling","used by time"], cues: ["notification","uniform","door as capture","being needed","deadline with shape"], demons: ["Doogu","Ixigool","Ixidod","Sukugool","Skoodu","Djuddha","Tchakki","Nammamad","Numko"], likelyNext: [{ target: "maintaining", weight: 62, label: "Medium" },{ target: "friction", weight: 58, label: "Medium" },{ target: "catastrophic", weight: 46, label: "Medium" },{ target: "liminal", weight: 40, label: "Medium" },{ target: "warp", weight: 22, label: "Weak" }], corruption: "Zombie flow, dead work, socially rewarded self-erasure.", grace: "Meaningful pressure, capture for love, art, or real responsibility.", howToExit: "Ask whether the sequence is meaningful or dead. If dead, contaminate the pattern or step it down." },
  maintaining: { id: "maintaining", short: "03", name: "Maintaining", region: "LOCK", zone: "Zn-4/5", gate: "Gt-10", color: "#059669", x: 892, y: 452, function: "Reproduces continuity", signature: "Routine basin · stable repetition held above collapse", body: ["held posture","moderate vigilance","not late","right-speed feeling"], cues: ["same soup","same route","calendar breath","quiet admin","craft repetition"], demons: ["Skarkix","Tukkamu","Kuttadid","Papatakoo","Bubbamu","Ababbatok"], likelyNext: [{ target: "friction", weight: 78, label: "Strong" },{ target: "captured", weight: 44, label: "Medium" },{ target: "threshold", weight: 38, label: "Medium" }], corruption: "Comfort becoming carpeted deadness.", grace: "Quiet coherence. Life moving at the exact speed it asks.", howToExit: "Protect the basin. Exclude novelty unless you deliberately want mutation." },
  threshold: { id: "threshold", short: "04", name: "Threshold", region: "OPEN", zone: "Zn-5", gate: "Gt-15", color: "#7C3AED", x: 816, y: 684, function: "Tests continuity", signature: "Meaning density without event", body: ["skin sensitivity","unstable breath","butterflies","startle readiness"], cues: ["outside the door","green room","waiting room","omens","tiny symbolic meal"], demons: ["Katak","Tchattuk","Oddubb","Pabbakis","Ababbatok","Mur Mur","Mummumix","Tutagool","Unnunddo"], likelyNext: [{ target: "captured", weight: 42, label: "Medium" },{ target: "regressive", weight: 42, label: "Medium" },{ target: "catastrophic", weight: 42, label: "Medium" },{ target: "warp", weight: 42, label: "Medium" },{ target: "plex", weight: 18, label: "Weak" }], corruption: "Panic-interpretation spiral. Treating signs as verdicts.", grace: "Charged passage without over-reading.", howToExit: "Reduce noise. Make tiny movements. Do not force a total answer." },
  regressive: { id: "regressive", short: "05", name: "Regressive", region: "NULL", zone: "Zn-7", gate: "Gt-28", color: "#2563EB", x: 500, y: 820, function: "Retreats from continuity", signature: "Larval return · soft descent below demand", body: ["heavy limbs","lowered initiative","desire for enclosure","pre-verbal softness"], cues: ["blankets","soup","old films","bath-haze","one thing only"], demons: ["Puppo","Minommo","Mur Mur","Tokhatto","Tchu"], likelyNext: [{ target: "plex", weight: 76, label: "Strong" },{ target: "beginning", weight: 46, label: "Medium" }], corruption: "Shame-burial. Scrolling tomb.", grace: "Pre-verbal holding and retreat from edges.", howToExit: "One meal, one blanket, one text, one enclosure. Do less, not more." },
  warp: { id: "warp", short: "06", name: "Warp", region: "LOCK", zone: "Zn-3/6", gate: "Gt-06 / Gt-21", color: "#DB2777", x: 184, y: 684, function: "Recursively generates continuity", signature: "Alien clock · recursive vortex · pattern-world capture", body: ["time dilation","sleep scramble","appetite scramble","shaking hands / ideas breathing you"], cues: ["5am again","diagram loop","coincidences ramping","night-world","one safe food"], demons: ["Ixix","Tchu","Djynxx","Ununuttix","Unnutchi"], likelyNext: [{ target: "warp", weight: 55, label: "Medium self-loop" },{ target: "plex", weight: 44, label: "Medium" },{ target: "threshold", weight: 20, label: "Weak" },{ target: "captured", weight: 20, label: "Weak" },{ target: "maintaining", weight: 64, label: "Re-entry strong" },{ target: "regressive", weight: 64, label: "Re-entry strong" }], corruption: "Non-reintegration, endless loop, isolation.", grace: "Revelation, art, forbidden linkage, live contact with pattern.", howToExit: "Bring back imprints. Use cockpit, alarm, simple food, hot shower, dumb warm meal." },
  plex: { id: "plex", short: "07", name: "Plex", region: "NULL", zone: "Zn-0/9", gate: "Gt-45", color: "#64748B", x: 108, y: 452, function: "Suspends continuity", signature: "Null suspension · root-time · fearful stillness", body: ["near motionless awareness","glacial breath","gravity without direction","atonal stillness"], cues: ["ritual silence","tea and water","nothing moving","body like wood","universe holding breath"], demons: ["Uttunul","Mur Mur"], likelyNext: [{ target: "beginning", weight: 52, label: "Medium" },{ target: "catastrophic", weight: 18, label: "Weak" }], corruption: "Theatrical dissociation mistaken for depth.", grace: "Sacred numbness. Root-time without ordinary demand.", howToExit: "Thaw, not wake. Re-enter via sound, gravity, coffee, salt, egg, breakfast-scale reality." },
  friction: { id: "friction", short: "08", name: "Friction", region: "LOCK", zone: "Zn-8", gate: "Gt-36", color: "#EA580C", x: 184, y: 220, function: "Scrapes continuity forward", signature: "Near-unison grind · socially passable internal abrasion", body: ["jaw tension","thirst","quick breath","dry eyes","micro-irritation"], cues: ["deadline stretch","noise-density","petrol station snacks","hot face","running on fumes"], demons: ["Bobobja","Muntuk","Mombbo","Nuttubab","Ummnu"], likelyNext: [{ target: "threshold", weight: 84, label: "Strong" },{ target: "catastrophic", weight: 48, label: "Medium" },{ target: "regressive", weight: 22, label: "Weak" },{ target: "plex", weight: 40, label: "Emergency dive" }], corruption: "Mistaking self-destruction for discipline.", grace: "The final push, hidden extremis, last 20 percent combustion.", howToExit: "Finish the stretch, then water, shower, silence, offline, stretch, food, floor." },
  liminal: { id: "liminal", short: "09", name: "Liminal", region: "OPEN", zone: "Zn-mixed", gate: "Gt-mixed", color: "#0D9488", x: 500, y: 292, function: "Hybridises continuity", signature: "Inter-systemic overlap · xenogenesis · A + B generating C", body: ["toggling rhythms","uncertain temperature","awkward self-perception","fertile weirdness"], cues: ["3am walk","worlds touching","uncanny but not yet panic","strange music","contamination"], demons: ["Tchakki","Mommoljo","Pabbakis","Mummumix","Ununuttix"], likelyNext: [{ target: "captured", weight: 42, label: "Medium" },{ target: "warp", weight: 42, label: "Medium" },{ target: "catastrophic", weight: 18, label: "Weak" }], corruption: "Premature sense-making, spooky cliché, steering the weird too hard.", grace: "Mutation, translation, strange fertility.", howToExit: "Let unlike things coexist. Do not purify too early." },
  catastrophic: { id: "catastrophic", short: "10", name: "Catastrophic", region: "NULL", zone: "Zn-4/9", gate: "Gt-10 / Gt-45", color: "#DC2626", x: 500, y: 572, function: "Ruptures continuity", signature: "Slip cascade · topology rupture · the nervous system becomes the only clock", body: ["shock","sweat","full-body alarm","time shattering","all signals at once"], cues: ["hull breach","dropped glass","question in wrong tone","car crash in the room","pure decision hunger"], demons: ["Krako","Katak","Ununak","Tukutu","Tokhatto","Tchu"], likelyNext: [{ target: "regressive", weight: 76, label: "Strong" },{ target: "plex", weight: 48, label: "Medium" },{ target: "beginning", weight: 20, label: "Weak" },{ target: "threshold", weight: 20, label: "Weak" }], corruption: "Glamorising breakdown. Taking intensity itself as truth.", grace: "Truth under fire, but only after survival.", howToExit: "Reduce input. Floor. Cold water. Shut devices. Interpret later." },
};

const demons = {
  Lurgo:{mesh:"00",role:"Initiator",native:["beginning"],bridge:[],note:"Door of doors. Opening and handoff from Plex thaw."},Duoddod:{mesh:"01",role:"Duplicitous Redoubler",native:["beginning"],bridge:[],note:"Early redoubling and exactitude pressure."},Doogu:{mesh:"02",role:"Original-Schism",native:["captured"],bridge:[],note:"Hooks, traps, first operant split."},Ixix:{mesh:"03",role:"Abductor",native:["warp"],bridge:["beginning"],note:"Swirl, outside edge, abductive pull."},Ixigool:{mesh:"04",role:"Over-Ghoul",native:["captured"],bridge:[],note:"Implication scaling, tridentity, captured ascent."},Ixidod:{mesh:"05",role:"Zombie-Maker",native:["captured"],bridge:[],note:"Illusion of progress. Dead flow."},Krako:{mesh:"06",role:"Croaking Curse",native:["catastrophic"],bridge:[],note:"Burning hail, fatality pressure."},Sukugool:{mesh:"07",role:"Sucking-Ghoul",native:["captured"],bridge:[],note:"Deluge and implosion inside capture."},Skoodu:{mesh:"08",role:"Fashioner",native:["captured"],bridge:[],note:"Formatting and cyclic reconstitution."},Skarkix:{mesh:"09",role:"Buzz-Cutter",native:["maintaining"],bridge:[],note:"Cycle seal, pattern preservation."},Tokhatto:{mesh:"10",role:"Decimal Camouflage",native:["catastrophic"],bridge:["regressive"],note:"Talismanic camouflage at null edges."},Tukkamu:{mesh:"11",role:"Occulturation",native:["maintaining"],bridge:[],note:"Maturation / deterioration duality."},Kuttadid:{mesh:"12",role:"Ticking Machines",native:["maintaining"],bridge:[],note:"Calendric conservatism, vigilance."},Tikkitix:{mesh:"13",role:"Clicking Menaces",native:[],bridge:["threshold"],note:"Swirl patterns and carried-away phenomena."},Katak:{mesh:"14",role:"Desolator",native:["catastrophic"],bridge:["threshold","friction"],note:"Cataclysmic convergence. Crisis abductor."},Tchu:{mesh:"15",role:"Source of Subnothingness",native:[],bridge:["beginning","regressive","warp","catastrophic"],note:"Extreme outside. Appears wherever the map tears."},Djungo:{mesh:"16",role:"Infiltrator",native:[],bridge:["liminal"],note:"Subtle involvements and contamination logic."},Djuddha:{mesh:"17",role:"Decentred Threat",native:["captured"],bridge:[],note:"Artificial turbulence inside assignment."},Djynxx:{mesh:"18",role:"Child Stealer",native:["warp"],bridge:[],note:"Warp sovereign. Time-lapse recursive seal."},Tchakki:{mesh:"19",role:"Bag of Tricks",native:["liminal"],bridge:["captured","beginning","warp"],note:"Combustion, translation, doorway demon."},Tchattuk:{mesh:"20",role:"Pseudo-Basis",native:["threshold"],bridge:[],note:"Seeming-ground in unstable crossings."},Puppo:{mesh:"21",role:"Break-Outs",native:["regressive"],bridge:["beginning"],note:"Larval regression and return below demand."},Bubbamu:{mesh:"22",role:"After Babylon",native:["maintaining"],bridge:[],note:"Relapse pressure inside continuity."},Oddubb:{mesh:"23",role:"Broken Mirror",native:["threshold"],bridge:[],note:"Loops, glamour, splintered perception."},Pabbakis:{mesh:"24",role:"Dabbler",native:["threshold"],bridge:["liminal"],note:"Interference, hesitation, soft contamination."},Ababbatok:{mesh:"25",role:"Regenerator",native:[],bridge:["maintaining","threshold"],note:"Healing and suspended decay; leaves when maintenance dries out."},Papatakoo:{mesh:"26",role:"Upholder",native:["maintaining"],bridge:[],note:"Rituals becoming nature."},Bobobja:{mesh:"27",role:"Heavy Atmosphere",native:["friction"],bridge:[],note:"The classic dry-grind invader."},Minommo:{mesh:"28",role:"Webmaker",native:["regressive"],bridge:["beginning"],note:"Submergence, dream-webbing."},"Mur Mur":{mesh:"29",role:"Dream-Serpent",native:["plex"],bridge:["threshold","regressive"],note:"Oceanic humidity between omen, drift, and suspension."},Nammamad:{mesh:"30",role:"Mirroracle",native:["captured"],bridge:[],note:"Subterranean commerce, collapse, mirrored completion."},Mummumix:{mesh:"31",role:"Mist-Crawler",native:[],bridge:["threshold","liminal"],note:"Insidious fog and clue-density."},Numko:{mesh:"32",role:"Keeper of Old Terrors",native:["captured"],bridge:[],note:"Old terror and depth-memory in locked systems."},Muntuk:{mesh:"33",role:"Desert Swimmer",native:["friction"],bridge:[],note:"Arid seabed tension and oppressive dryness."},Mommoljo:{mesh:"34",role:"Alien Mother",native:["liminal"],bridge:[],note:"Xenogenesis, mixed-system birth."},Mombbo:{mesh:"35",role:"Fishy-princess",native:["friction"],bridge:[],note:"Hybridity under exhausted conditions."},Uttunul:{mesh:"36",role:"Seething Void",native:["plex"],bridge:["beginning"],note:"Atonality, root-time, handoff into ignition."},Tutagool:{mesh:"37",role:"Tattered Ghoul",native:["threshold"],bridge:[],note:"Punctual omen incision."},Unnunddo:{mesh:"38",role:"Double-Undoing",native:["threshold"],bridge:[],note:"Uncasing, peelback, horror grids."},Ununuttix:{mesh:"39",role:"Particle Clocks",native:[],bridge:["liminal","warp"],note:"Absolute coincidence at the edge of hardening pattern."},Ununak:{mesh:"40",role:"Blind Catastrophe",native:["catastrophic"],bridge:[],note:"Convulsive collapse after slip cascade."},Tukutu:{mesh:"41",role:"Cosmotraumatics",native:["catastrophic"],bridge:[],note:"Crash-signals and body-shock."},Unnutchi:{mesh:"42",role:"Tachyonic Immobility",native:["warp"],bridge:[],note:"Slow vortex and coiling outsideness."},Nuttubab:{mesh:"43",role:"Mimetic Anorganism",native:["friction"],bridge:[],note:"Metaloid unlife under scrape conditions."},Ummnu:{mesh:"44",role:"Ultimate Inconsequence",native:["friction"],bridge:[],note:"Crust-friction, near-unison scrape, ultimate inconsequence."},
};

const routeOracle = {Lurgo:[{code:"1890",title:"Spinal-voyage",text:"Programming, fate-line ignition, the first threading of the body into a path."}],Duoddod:[{code:"271890",title:"Pineal-regression",text:"Rear vision, datacomb exactitude, doubled initiation that immediately starts counting."},{code:"27541890",title:"Datacomb searches",text:"Search, recursion, and exactitude as the first corruption of the open field."}],Doogu:[{code:"1872",title:"Primordial breath",text:"The first split that still feels alive — capture through inhalation, hook, and bait."},{code:"271",title:"Ambivalent capture",text:"Hooks, traps, plot-twists. The world catches you by giving you shape."},{code:"27541",title:"Slow pull to stasis",text:"Protection from drowning that is also the beginning of assignment."}],Ixix:[{code:"?",title:"Occult terrestrial history",text:"Abduction by a larger pattern — the Earth thinking through you rather than the reverse."}],Ixigool:[{code:"18723",title:"Unimpeded ascent",text:"Capture rising into implication, prophecy, and escalated identity."},{code:"1872563",title:"Ultimate implications",text:"As above so below: assignment becoming worldview."}],Ixidod:[{code:"23",title:"Crises through excess",text:"Micropause abuse, overspeed, the fake propulsion of being unable to stop."},{code:"27563",title:"Illusion of progress",text:"Out of the frying pan into the fire — dead flow mistaken for momentum."}],Krako:[{code:"41890",title:"Subsidence",text:"Heaviness of fatality, collapse with heat still inside it."}],Sukugool:[{code:"187254",title:"Cycle of creation and destruction",text:"Deluge, implosion, and capture by submersion."},{code:"41",title:"Submersion",text:"Gravedigging, deluge, being pulled under the assigned world."}],Skoodu:[{code:"2754",title:"Historical time",text:"Formatting, switch-crazes, historical sequence becoming real."},{code:"41872",title:"Passage through the deep",text:"Depth traversal under form."},{code:"451872",title:"Cyclic reconstitution",text:"Stability through re-making."}],Skarkix:[{code:"418723",title:"Hermetic abbreviations",text:"Pattern cut down into repeatable signs."},{code:"4518723",title:"Sacred seal of time",text:"Triadic reconfirmation of the cycle."},{code:"4563",title:"Apocalyptic rapture",text:"Maintained order fraying toward jagged turbulence."}],Tokhatto:[{code:"541890",title:"Number as destiny",text:"Digital convergence, camouflage, symbolic fatality."}],Tukkamu:[{code:"18725",title:"Optimal maturation",text:"Diffuse healing, medicine, growth that may also rot."},{code:"541",title:"Rapid deterioration",text:"Maintenance tipping toward putrefaction."}],Kuttadid:[{code:"275",title:"Maintaining balance",text:"Calendric conservatism, the machine of vigilance."},{code:"541872",title:"Exhaustive vigilance",text:"The strain hidden within upkeep."}],Tikkitix:[{code:"5418723",title:"Swirl-patterns",text:"Wind-voices, vortical menaces, disappearing things."},{code:"563",title:"Mysterious disappearances",text:"Carried-away phenomena."}],Katak:[{code:"X",title:"Tail-chasing",text:"Rabid loops, catastrophic convergence, blind chase."},{code:"418725",title:"Panic",text:"Slasher pulp, religious fervour, all signals becoming verdict."}],Tchu:[{code:"?",title:"Cosmic deletions",text:"Real impossibilities, subnothingness, the outside beyond narration."}],Djungo:[{code:"187236",title:"Turbular fluids",text:"Involvement by maelstrom, contamination by subtle contact."},{code:"187256",title:"Surreptitious invasions",text:"Fish-falls and inexplicable insertions."}],Djuddha:[{code:"236",title:"Machine-vortex",text:"Artificial turbulence, seething skin, simulation storm."},{code:"256",title:"Storm peripheries",text:"Threat that never fully centres but never leaves."}],Djynxx:[{code:"X",title:"Abstract cyclones",text:"Dust spirals, nomad war-machine, recursive loop-weather."}],Tchakki:[{code:"4187236",title:"Quenching accidents",text:"Combustion, misfire, translation through spark and damage."},{code:"45187236",title:"Mappings between incompatible time-systems",text:"Cross-system translation, Herakleitean fire-cycle, doorway logic."},{code:"456",title:"Conflagrations",text:"Spontaneous combustion, shrieking deliria."}],Tchattuk:[{code:"54187236",title:"Zero-gravity",text:"Pseudo-basis, unscreened matrix, floating ground."},{code:"56",title:"Cut-outs",text:"UFO cover-ups, absented basis, holes in the real."}],Puppo:[{code:"71890",title:"Dissolving into slime",text:"Larval regression, masked horror, return below personhood."},{code:"72541890",title:"Chthonic swallowings",text:"Submergence deeper than softness."}],Bubbamu:[{code:"187",title:"Hypersea",text:"Relapse into marine life on land, fluid return of the old basin."},{code:"71",title:"Aquassassins",text:"Relapse through black-atlantean strike."},{code:"72541",title:"Seawalls",text:"Dry-time taboo and defensive retention."}],Oddubb:[{code:"X",title:"Time loops",text:"Glamour, glosses, broken mirrors, recursive doubling of perception."}],Pabbakis:[{code:"723",title:"Batrachian mutations",text:"Dabbling, frog-plagues, unstable metamorphosis."},{code:"72563",title:"Cans of worms",text:"Propagation by division, interference that breeds more interference."}],Ababbatok:[{code:"4187",title:"Frankensteinian experimentation",text:"Reanimation and suspended decay as healing-technology."},{code:"45187",title:"Purifications",text:"Wound-healing and amphibious cycles."},{code:"7254",title:"Sustenance",text:"Smoke visions, nourishment inside suspension."}],Papatakoo:[{code:"54187",title:"Ultimate success",text:"Perseverance, blood sacrifice, upheld continuity."},{code:"725",title:"Rituals becoming nature",text:"Repetition hardening into world."}],Bobobja:[{code:"7236",title:"Strange lights in the swamp",text:"Pestilence atmosphere, hovering irritation, insect-light logic."},{code:"7256",title:"Swarmachines",text:"Lost harvests, multiplicity as abrasion."}],Minommo:[{code:"890",title:"Shamanic voyage",text:"Dream sorcery, mitochondrial chatter, submergent weaving."}],"Mur Mur":[{code:"X",title:"Oceanic sensation",text:"Deep ones hum, spinal regression, dream-serpent humidity."}],Nammamad:[{code:"2718",title:"Voodoo in cyberspace",text:"Traffic under the world, mirrored commerce, occult exchange."},{code:"275418",title:"Completion as final collapse",text:"Heat-death and degenerative closure."},{code:"8172",title:"Emergences",text:"Things washed up from below."}],Mummumix:[{code:"81723",title:"Ocean storms",text:"Mist-crawl, bacterial communication, clue weather."},{code:"8172563",title:"Diseases from outer-space",text:"Fog as alien contact and contamination."}],Numko:[{code:"418",title:"Necrospeleology",text:"Old terrors kept by depth patience."},{code:"4518",title:"Subduction",text:"Downward pull into carnivorous depths."},{code:"817254",title:"Vulcanism",text:"Bacterial intelligence and buried heat."}],Muntuk:[{code:"5418",title:"Ancient rivers",text:"Arid seabeds remembering flow."},{code:"81725",title:"Cloud-vaults and oppressive tension",text:"Monsoon pressure that never quite breaks."}],Mommoljo:[{code:"817236",title:"Cosmobacterial exogermination",text:"Xenogenesis, alien birth, growth by mixed residues."},{code:"817256",title:"Extraterrestrial residues",text:"Foreign trace becoming new form."}],Mombbo:[{code:"718",title:"Ophidian transmutation",text:"Hybridity through serpent shift."},{code:"725418",title:"Surreptitious colonization",text:"The hybrid enters quietly."},{code:"817",title:"Surface-amnesia",text:"Fishwives tales, forgetting through emergence."}],Uttunul:[{code:"X",title:"Crossing the iron-ocean",text:"Atonality, void, plutonic passage through suspension."}],Tutagool:[{code:"189",title:"Dark arts, rusting iron, tattooing",text:"Punctual incision and mark-making as omen."}],Unnunddo:[{code:"27189",title:"Crypt-traffic",text:"Onion-skin horror, endless uncasing, underground communications."},{code:"2754189",title:"Communication-grids",text:"Telecom webs and metallist shamanics."}],Ununuttix:[{code:"?",title:"Absolute coincidence",text:"Numerical connection through the absence of any obvious link."}],Ununak:[{code:"4189",title:"Secrets of the blacksmiths",text:"Convulsive catastrophe forged under pressure."},{code:"45189",title:"Subterranean impulses",text:"Blind deep movement erupting upward."}],Tukutu:[{code:"54189",title:"Crash-signals",text:"Scarring, death-strokes, impact that keeps echoing."}],Unnutchi:[{code:"?",title:"Asymmetric zygopoise",text:"Slow vortex, tachyonic immobility, coiling outside."}],Nuttubab:[{code:"7189",title:"Lunacies",text:"Iron in the blood, metallic mimicry, dragon-line disorder."},{code:"7254189",title:"Dragon-lines",text:"Terrestrial electromagnetism becoming organism."}],Ummnu:[{code:"89",title:"Crust-friction",text:"Anorganic tension, near-unison scrape, ultimate inconsequence."}]};

const demonGraph=[{id:"Lurgo",mesh:"00",state:"beginning",links:["Doogu","Ixigool","Uttunul","Duoddod"],type:"native"},{id:"Duoddod",mesh:"01",state:"beginning",links:["Lurgo","Doogu","Ixix"],type:"support"},{id:"Doogu",mesh:"02",state:"captured",links:["Lurgo","Ixigool","Ixidod","Skoodu"],type:"native"},{id:"Ixix",mesh:"03",state:"warp",links:["Duoddod","Tchakki","Djynxx","Tchu"],type:"bridge"},{id:"Ixigool",mesh:"04",state:"captured",links:["Lurgo","Doogu","Ixidod","Sukugool"],type:"native"},{id:"Ixidod",mesh:"05",state:"captured",links:["Doogu","Ixigool","Tchakki","Djuddha"],type:"native"},{id:"Krako",mesh:"06",state:"catastrophic",links:["Katak","Ununak","Tokhatto"],type:"support"},{id:"Sukugool",mesh:"07",state:"captured",links:["Ixigool","Skoodu","Numko"],type:"support"},{id:"Skoodu",mesh:"08",state:"captured",links:["Doogu","Sukugool","Skarkix","Kuttadid"],type:"support"},{id:"Skarkix",mesh:"09",state:"maintaining",links:["Skoodu","Kuttadid","Papatakoo","Ababbatok"],type:"native"},{id:"Tokhatto",mesh:"10",state:"catastrophic",links:["Krako","Tchu","Puppo"],type:"bridge"},{id:"Tukkamu",mesh:"11",state:"maintaining",links:["Kuttadid","Bubbamu","Papatakoo"],type:"support"},{id:"Kuttadid",mesh:"12",state:"maintaining",links:["Skarkix","Tukkamu","Papatakoo","Bobobja"],type:"native"},{id:"Tikkitix",mesh:"13",state:"threshold",links:["Katak","Tchattuk","Pabbakis"],type:"shadow"},{id:"Katak",mesh:"14",state:"catastrophic",links:["Tchattuk","Bobobja","Ununak","Tukutu","Krako"],type:"bridge"},{id:"Tchu",mesh:"15",state:"warp",links:["Ixix","Tokhatto","Djynxx","Uttunul","Ununak"],type:"bridge"},{id:"Djungo",mesh:"16",state:"liminal",links:["Tchakki","Mummumix","Pabbakis"],type:"shadow"},{id:"Djuddha",mesh:"17",state:"captured",links:["Ixidod","Tchakki","Bobobja"],type:"support"},{id:"Djynxx",mesh:"18",state:"warp",links:["Ixix","Tchu","Ununuttix","Unnutchi","Tchakki"],type:"native"},{id:"Tchakki",mesh:"19",state:"liminal",links:["Ixidod","Ixix","Djynxx","Pabbakis","Mommoljo","Djuddha"],type:"bridge"},{id:"Tchattuk",mesh:"20",state:"threshold",links:["Katak","Oddubb","Pabbakis","Tikkitix"],type:"native"},{id:"Puppo",mesh:"21",state:"regressive",links:["Minommo","Tokhatto","Mur Mur","Uttunul"],type:"native"},{id:"Bubbamu",mesh:"22",state:"maintaining",links:["Tukkamu","Ababbatok","Papatakoo"],type:"support"},{id:"Oddubb",mesh:"23",state:"threshold",links:["Tchattuk","Pabbakis","Mur Mur","Mummumix"],type:"native"},{id:"Pabbakis",mesh:"24",state:"threshold",links:["Oddubb","Tchattuk","Tchakki","Mummumix","Djungo"],type:"bridge"},{id:"Ababbatok",mesh:"25",state:"maintaining",links:["Skarkix","Kuttadid","Bubbamu","Pabbakis","Bobobja"],type:"bridge"},{id:"Papatakoo",mesh:"26",state:"maintaining",links:["Skarkix","Kuttadid","Tukkamu","Bubbamu"],type:"native"},{id:"Bobobja",mesh:"27",state:"friction",links:["Kuttadid","Ababbatok","Muntuk","Ummnu","Katak"],type:"native"},{id:"Minommo",mesh:"28",state:"regressive",links:["Puppo","Mur Mur","Uttunul","Tchu"],type:"native"},{id:"Mur Mur",mesh:"29",state:"plex",links:["Puppo","Minommo","Oddubb","Mummumix","Uttunul","Katak"],type:"bridge"},{id:"Nammamad",mesh:"30",state:"captured",links:["Numko","Ixidod","Skoodu"],type:"support"},{id:"Mummumix",mesh:"31",state:"liminal",links:["Oddubb","Pabbakis","Mur Mur","Mommoljo","Djungo"],type:"bridge"},{id:"Numko",mesh:"32",state:"captured",links:["Nammamad","Sukugool","Muntuk"],type:"support"},{id:"Muntuk",mesh:"33",state:"friction",links:["Bobobja","Mombbo","Numko","Ummnu"],type:"support"},{id:"Mommoljo",mesh:"34",state:"liminal",links:["Tchakki","Pabbakis","Mummumix","Ununuttix","Djungo"],type:"native"},{id:"Mombbo",mesh:"35",state:"friction",links:["Muntuk","Nuttubab","Ummnu"],type:"support"},{id:"Uttunul",mesh:"36",state:"plex",links:["Mur Mur","Puppo","Minommo","Lurgo","Tchu"],type:"native"},{id:"Tutagool",mesh:"37",state:"threshold",links:["Unnunddo","Tchattuk","Oddubb"],type:"support"},{id:"Unnunddo",mesh:"38",state:"threshold",links:["Tutagool","Oddubb","Pabbakis"],type:"support"},{id:"Ununuttix",mesh:"39",state:"warp",links:["Djynxx","Unnutchi","Mommoljo","Tchakki"],type:"bridge"},{id:"Ununak",mesh:"40",state:"catastrophic",links:["Katak","Tukutu","Krako","Tchu"],type:"native"},{id:"Tukutu",mesh:"41",state:"catastrophic",links:["Katak","Ununak","Krako"],type:"native"},{id:"Unnutchi",mesh:"42",state:"warp",links:["Djynxx","Ununuttix","Tchu"],type:"support"},{id:"Nuttubab",mesh:"43",state:"friction",links:["Mombbo","Ummnu","Bobobja"],type:"support"},{id:"Ummnu",mesh:"44",state:"friction",links:["Bobobja","Muntuk","Mombbo","Nuttubab","Katak"],type:"native"}];

const transitions=[{from:"beginning",to:"captured",strength:3},{from:"beginning",to:"catastrophic",strength:2},{from:"captured",to:"maintaining",strength:2},{from:"captured",to:"friction",strength:2},{from:"captured",to:"catastrophic",strength:2},{from:"captured",to:"liminal",strength:2},{from:"captured",to:"warp",strength:1},{from:"maintaining",to:"friction",strength:3},{from:"maintaining",to:"captured",strength:2},{from:"maintaining",to:"threshold",strength:2},{from:"friction",to:"threshold",strength:3},{from:"friction",to:"catastrophic",strength:2},{from:"friction",to:"regressive",strength:1},{from:"friction",to:"plex",strength:1},{from:"threshold",to:"captured",strength:2},{from:"threshold",to:"regressive",strength:2},{from:"threshold",to:"catastrophic",strength:2},{from:"threshold",to:"warp",strength:2},{from:"threshold",to:"plex",strength:1},{from:"regressive",to:"plex",strength:3},{from:"regressive",to:"beginning",strength:2},{from:"warp",to:"warp",strength:2},{from:"warp",to:"plex",strength:2},{from:"warp",to:"threshold",strength:1},{from:"warp",to:"captured",strength:1},{from:"warp",to:"maintaining",strength:3},{from:"warp",to:"regressive",strength:3},{from:"plex",to:"beginning",strength:2},{from:"plex",to:"catastrophic",strength:1},{from:"liminal",to:"captured",strength:2},{from:"liminal",to:"warp",strength:2},{from:"liminal",to:"catastrophic",strength:1},{from:"catastrophic",to:"regressive",strength:3},{from:"catastrophic",to:"plex",strength:2},{from:"catastrophic",to:"beginning",strength:1},{from:"catastrophic",to:"threshold",strength:1}];

const stateWeights={beginning:{"small delicate movements":3,"light alertness":3,"sense of impending start":3,"easily broken by overthinking":2},captured:{"body recruited by schedule":3,"clock becomes operant":3,"track / groove feeling":2,"used by time":3},maintaining:{"held posture":2,"moderate vigilance":3,"not late":2,"right-speed feeling":3},threshold:{"skin sensitivity":3,"unstable breath":3,butterflies:2,"startle readiness":3},regressive:{"heavy limbs":3,"lowered initiative":3,"desire for enclosure":3,"pre-verbal softness":2},warp:{"time dilation":3,"sleep scramble":3,"appetite scramble":2,"shaking hands / ideas breathing you":3},plex:{"near motionless awareness":3,"glacial breath":3,"gravity without direction":2,"atonal stillness":3},friction:{"jaw tension":3,thirst:2,"quick breath":2,"dry eyes":2,"micro-irritation":3},liminal:{"toggling rhythms":3,"uncertain temperature":2,"awkward self-perception":2,"fertile weirdness":3},catastrophic:{shock:3,sweat:2,"full-body alarm":3,"time shattering":3,"all signals at once":3}};

 
 
const routeDigitAnchors = {
  "0": { x: 500, y: 1920 },
  "1": { x: 540, y: 1180 },
  "2": { x: 720, y: 580 },
  "3": { x: 380, y: 240 },
  "4": { x: 175, y: 870 },
  "5": { x: 320, y: 740 },
  "6": { x: 545, y: 240 },
  "7": { x: 770, y: 770 },
  "8": { x: 545, y: 1465 },
  "9": { x: 545, y: 1700 },
};

// Filled-wedge currents — the shaded "rivers" between zones.
// Each wedge has two endpoints; we draw it as a quadrilateral
// path widening in the middle, filled with the stipple pattern.
// Format: [from, to, fromWidth, toWidth, bend, pointer (which end has arrowhead)]

 
// Build a wedge path: from one endpoint widening to the other,
// curved by `bend`. Uses two cubic curves forming a leaf/tongue shape.

const allSymptoms = Array.from(new Set(Object.values(states).flatMap(s => s.body)));

// ── UTILITIES ─────────────────────────────────────────────────────

function normalizeName(n){return n.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();}
function scoreStates(sel,q){const qn=normalizeName(q);const sc=Object.values(states).map(st=>{let s=0;sel.forEach(x=>{s+=stateWeights[st.id]?.[x]||0;});if(qn){const t=[st.name,st.region,st.function,st.signature,...st.body,...st.cues,...st.demons,st.corruption,st.grace].join(" ").toLowerCase();if(t.includes(qn))s+=4;if(st.name.toLowerCase().includes(qn))s+=4;if(st.demons.some(d=>d.toLowerCase().includes(qn)))s+=3;}return{stateId:st.id,score:s};});sc.sort((a,b)=>b.score-a.score);return{best:sc[0]?.score>0?sc[0]:null,second:sc[1]?.score>0?sc[1]:null,confidence:sc[0]?.score?Math.min(100,Math.round((sc[0].score/16)*100)):0};}
function getCurvePath(from,to,bend=26){if(from.id===to.id){const r=34;return`M ${from.x-16} ${from.y-34} A ${r} ${r} 0 1 1 ${from.x+16} ${from.y-34}`;}const dx=to.x-from.x,dy=to.y-from.y,dist=Math.sqrt(dx*dx+dy*dy),nx=dx/dist,ny=dy/dist;return`M ${from.x+nx*42} ${from.y+ny*42} Q ${(from.x+nx*42+to.x-nx*42)/2-ny*bend} ${(from.y+ny*42+to.y-ny*42)/2+nx*bend} ${to.x-nx*42} ${to.y-ny*42}`;}
function parseRouteCode(c){if(!c||c==="X"||c==="?")return[];return String(c).split("").filter(x=>routeDigitAnchors[x]).map(d=>({digit:d,...routeDigitAnchors[d]}));}
function getAllRouteEntries(){
  return Object.entries(routeOracle).flatMap(([demon, routes]) =>
    routes.map(route => ({
      demon,
      code: route.code,
      title: route.title,
      text: route.text,
      mesh: demons[demon]?.mesh || "—",
      state: demonGraph.find(d => d.id === demon)?.state || "—",
    }))
  );
}

function analyzeRouteInput(input){
  const raw = String(input || "").trim();
  const cleaned = raw.replace(/[^0-9X?]/g, "");
  const entries = getAllRouteEntries();

  if(!cleaned){
    return {
      cleaned: "",
      exact: [],
      contains: [],
      containedBy: [],
      sameTerminal: [],
      fragments: []
    };
  }

  const exact = entries.filter(e => e.code === cleaned);

  const contains = entries.filter(e =>
    e.code !== cleaned &&
    e.code !== "X" &&
    e.code !== "?" &&
    cleaned.includes(e.code)
  ).sort((a,b) => b.code.length - a.code.length);

  const containedBy = entries.filter(e =>
    e.code !== cleaned &&
    e.code !== "X" &&
    e.code !== "?" &&
    e.code.includes(cleaned)
  ).sort((a,b) => a.code.length - b.code.length);

  const terminal = cleaned.slice(-4);
  const sameTerminal = terminal.length >= 2
    ? entries.filter(e =>
        e.code !== cleaned &&
        e.code !== "X" &&
        e.code !== "?" &&
        e.code.endsWith(terminal)
      )
    : [];

  const fragments = [];
  for(let i=0;i<cleaned.length;i++){
    for(let j=i+2;j<=cleaned.length;j++){
      const frag = cleaned.slice(i,j);
      const matches = entries.filter(e => e.code === frag);
      if(matches.length){
        fragments.push({ frag, start:i, end:j, matches });
      }
    }
  }

  fragments.sort((a,b) => b.frag.length - a.frag.length || a.start - b.start);

  return {
    cleaned,
    exact,
    contains,
    containedBy,
    sameTerminal,
    fragments
  };
}
function resolveRouteInput(input){
  const raw = String(input || "").trim();

  if(!raw){
    return {
      raw:"",
      mode:"empty",
      routes:[],
      demons:[],
      codes:[],
      stateFlow:[]
    };
  }

  const allEntries = getAllRouteEntries();

  // Chain mode: Tokhatto → Puppo → Uttunul → Lurgo
  if(raw.includes("→") || raw.includes("->")){
    const parts = raw
      .replaceAll("->","→")
      .split("→")
      .map(x=>x.trim())
      .filter(Boolean);

    const demonsFound = parts
      .map(name => {
        const exact = Object.keys(demons).find(d => normalizeName(d) === normalizeName(name));
        return exact || null;
      })
      .filter(Boolean);

    const routesFound = demonsFound.flatMap(demon =>
      (routeOracle[demon] || []).map(route => ({
        demon,
        code:route.code,
        title:route.title,
        text:route.text,
        mesh:demons[demon]?.mesh || "—",
        state:demonGraph.find(x=>x.id===demon)?.state || "—"
      }))
    );

    const stateFlow = demonsFound.map(demon => {
      const gr = demonGraph.find(x=>x.id===demon);
      const st = gr ? states[gr.state] : null;
      return {
        demon,
        state:gr?.state || "—",
        stateName:st?.name || "—",
        color:st?.color || c.dim
      };
    });

    return {
      raw,
      mode:"chain",
      routes:routesFound,
      demons:demonsFound,
      codes:routesFound.map(r=>r.code),
      stateFlow
    };
  }

  // Demon name mode
  const demonName = Object.keys(demons).find(d => normalizeName(d) === normalizeName(raw));
  if(demonName){
    const routesFound = (routeOracle[demonName] || []).map(route => ({
      demon:demonName,
      code:route.code,
      title:route.title,
      text:route.text,
      mesh:demons[demonName]?.mesh || "—",
      state:demonGraph.find(x=>x.id===demonName)?.state || "—"
    }));

    const gr = demonGraph.find(x=>x.id===demonName);
    const st = gr ? states[gr.state] : null;

    return {
      raw,
      mode:"demon",
      routes:routesFound,
      demons:[demonName],
      codes:routesFound.map(r=>r.code),
      stateFlow:[{
        demon:demonName,
        state:gr?.state || "—",
        stateName:st?.name || "—",
        color:st?.color || c.dim
      }]
    };
  }

  // Number route mode
  const cleaned = raw.replace(/[^0-9X?]/g,"");
  const exact = allEntries.filter(e => e.code === cleaned);

  return {
    raw,
    mode:"route",
    routes: exact.length ? exact : [{
      demon:"Custom",
      code:cleaned,
      title:"Unregistered route",
      text:"No exact demon route registered. Compare Lab can still detect shared fragments.",
      mesh:"—",
      state:"—"
    }],
    demons: exact.map(e=>e.demon),
    codes:[cleaned],
    stateFlow: exact.map(e=>{
      const st = states[e.state];
      return {
        demon:e.demon,
        state:e.state,
        stateName:st?.name || "—",
        color:st?.color || c.dim
      };
    })
  };
}

function getRouteFragments(code){
  const cleaned = String(code || "").replace(/[^0-9]/g,"");
  const frags = new Set();

  for(let i=0;i<cleaned.length;i++){
    for(let j=i+2;j<=cleaned.length;j++){
      frags.add(cleaned.slice(i,j));
    }
  }

  return Array.from(frags);
}

function getSharedFragments(aCodes,bCodes){
  const allEntries = getAllRouteEntries().filter(e => e.code !== "X" && e.code !== "?");

  const aFrags = new Set(aCodes.flatMap(getRouteFragments));
  const bFrags = new Set(bCodes.flatMap(getRouteFragments));

  const shared = Array.from(aFrags)
    .filter(f => bFrags.has(f))
    .sort((a,b)=>b.length-a.length || a.localeCompare(b));

  return shared.map(frag => ({
    frag,
    demons: allEntries.filter(e => e.code === frag)
  }));
}

function getSharedTerminals(aCodes,bCodes){
  const terminals = [];

  aCodes.forEach(a=>{
    bCodes.forEach(b=>{
      const ac = String(a).replace(/[^0-9]/g,"");
      const bc = String(b).replace(/[^0-9]/g,"");
      const max = Math.min(ac.length,bc.length);
      let shared = "";

      for(let i=1;i<=max;i++){
        if(ac.slice(-i) === bc.slice(-i)) shared = ac.slice(-i);
      }

      if(shared.length >= 2){
        terminals.push(shared);
      }
    });
  });

  return Array.from(new Set(terminals)).sort((a,b)=>b.length-a.length);
}

function getPrefixDifference(code,sharedTerminal){
  const cleaned = String(code || "").replace(/[^0-9]/g,"");
  if(!sharedTerminal || !cleaned.endsWith(sharedTerminal)) return cleaned;
  return cleaned.slice(0, cleaned.length - sharedTerminal.length) || "naked kernel";
}

function compareInputs(aInput,bInput){
  const A = resolveRouteInput(aInput);
  const B = resolveRouteInput(bInput);

  const sharedDemons = A.demons.filter(d => B.demons.includes(d));
  const sharedFragments = getSharedFragments(A.codes,B.codes);
  const sharedTerminals = getSharedTerminals(A.codes,B.codes);
  const primaryTerminal = sharedTerminals[0] || "";

  const exactSharedRoutes = A.routes.filter(ar =>
    B.routes.some(br => br.code === ar.code && br.demon === ar.demon)
  );

  return {
    A,
    B,
    sharedDemons,
    sharedFragments,
    sharedTerminals,
    primaryTerminal,
    exactSharedRoutes,
    aPrefix:A.codes.map(code=>({code,prefix:getPrefixDifference(code,primaryTerminal)})),
    bPrefix:B.codes.map(code=>({code,prefix:getPrefixDifference(code,primaryTerminal)}))
  };
}
function buildRoutePath(pts){if(!pts.length)return"";if(pts.length===1)return`M ${pts[0].x} ${pts[0].y}`;let r=`M ${pts[0].x} ${pts[0].y}`;for(let i=1;i<pts.length;i++){r+=` Q ${(pts[i-1].x+pts[i].x)/2} ${(pts[i-1].y+pts[i].y)/2} ${pts[i].x} ${pts[i].y}`;}return r;}
function buildDemonPositions(){const by={};Object.values(states).forEach(s=>{by[s.id]=demonGraph.filter(d=>d.state===s.id);});const pos={};Object.values(states).forEach(s=>{const c=by[s.id]||[];const r=s.id==="liminal"?88:76;c.forEach((d,i)=>{const a=(Math.PI*2/Math.max(c.length,1))*i-Math.PI/2;pos[d.id]={x:s.x+Math.cos(a)*r,y:s.y+Math.sin(a)*r+40};});});return pos;}
function getNetSpanFromMesh(m){const n=Number(m);if(isNaN(n))return"—";if(n===0)return"1::0";if(n<=2)return`2::${n-1}`;if(n<=5)return`3::${n-3}`;if(n<=9)return`4::${n-6}`;if(n<=14)return`5::${n-10}`;if(n<=20)return`6::${n-15}`;if(n<=27)return`7::${n-21}`;if(n<=35)return`8::${n-28}`;return`9::${n-36}`;}

function getDemonRouteEntries(demonName){
  return (routeOracle[demonName] || []).map(route => ({
    demon:demonName,
    code:route.code,
    title:route.title,
    text:route.text,
    mesh:demons[demonName]?.mesh || "—",
    state:demonGraph.find(x=>x.id===demonName)?.state || "—"
  }));
}

function getDemonStateInfo(demonName){
  const gr=demonGraph.find(x=>x.id===demonName);
  const st=gr ? states[gr.state] : null;

  return {
    demon:demonName,
    mesh:demons[demonName]?.mesh || "—",
    state:gr?.state || "—",
    stateName:st?.name || "—",
    color:st?.color || c.dim,
    role:demons[demonName]?.role || "—",
    note:demons[demonName]?.note || "—"
  };
}

function analyzeDemonChain(chain){
  const demonsInChain=(chain || []).filter(Boolean);
  const routeEntries=demonsInChain.flatMap(getDemonRouteEntries);
  const codes=routeEntries.map(r=>r.code).filter(code=>code && code !== "X" && code !== "?");
  const stateFlow=demonsInChain.map(getDemonStateInfo);

  const fragmentCounts={};
  codes.forEach(code=>{
    getRouteFragments(code).forEach(frag=>{
      fragmentCounts[frag]=(fragmentCounts[frag] || 0) + 1;
    });
  });

  const sharedFragments=Object.entries(fragmentCounts)
    .filter(([frag,count])=>count >= 2)
    .map(([frag,count])=>({
      frag,
      count,
      demons:getAllRouteEntries().filter(e=>e.code===frag)
    }))
    .sort((a,b)=>b.frag.length-a.frag.length || b.count-a.count);

  const terminalCounts={};
  codes.forEach(code=>{
    const clean=String(code).replace(/[^0-9]/g,"");
    for(let i=2;i<=clean.length;i++){
      const terminal=clean.slice(-i);
      terminalCounts[terminal]=(terminalCounts[terminal] || 0) + 1;
    }
  });

  const sharedTerminals=Object.entries(terminalCounts)
    .filter(([terminal,count])=>count >= 2)
    .map(([terminal,count])=>({terminal,count}))
    .sort((a,b)=>b.terminal.length-a.terminal.length || b.count-a.count);

  const primaryKernel=sharedTerminals[0]?.terminal || sharedFragments[0]?.frag || "";
  const stateNames=stateFlow.map(x=>x.stateName).filter(x=>x && x !== "—");

  return {
    demons:demonsInChain,
    routeEntries,
    codes,
    stateFlow,
    sharedFragments,
    sharedTerminals,
    primaryKernel,
    stateSentence:stateNames.join(" → ")
  };
}

function makeChainExport(name,analysis){
  const title=name?.trim() || "Untitled Chain";
  const chain=analysis.demons.join(" → ");

  const routes=analysis.routeEntries.length
    ? analysis.routeEntries.map(r=>`${r.demon} — ${r.code} — ${r.title}`).join("\n")
    : "No registered route entries.";

  const states=analysis.stateFlow.length
    ? analysis.stateFlow.map(x=>`${x.demon} — ${x.stateName}`).join("\n")
    : "No state-flow.";

  const shared=analysis.sharedFragments.length
    ? analysis.sharedFragments.slice(0,10).map(x=>`${x.frag} (${x.count} hits)`).join("\n")
    : "No shared fragments.";

  const terminals=analysis.sharedTerminals.length
    ? analysis.sharedTerminals.slice(0,10).map(x=>`${x.terminal} (${x.count} hits)`).join("\n")
    : "No shared terminal kernels.";

  return `CHAIN: ${title}

DEMON SENTENCE:
${chain || "—"}

ROUTE STACK:
${routes}

STATE-FLOW:
${states}

PRIMARY KERNEL:
${analysis.primaryKernel || "—"}

SHARED FRAGMENTS:
${shared}

SHARED TERMINALS:
${terminals}

DIRTY READING:
${chain || "This chain"} moves through ${analysis.stateSentence || "unregistered state-flow"}. ${analysis.primaryKernel ? `Its primary shared kernel is ${analysis.primaryKernel}.` : "No dominant shared kernel has been detected yet."}`;
}
const GRIMOIRE_STORAGE_KEY="synchronisation_atlas_grimoire_v1";

function loadSavedReadings(){
  try{
    const raw=localStorage.getItem(GRIMOIRE_STORAGE_KEY);
    if(!raw) return [];
    const parsed=JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  }catch(e){
    return [];
  }
}

function saveReadingsToStorage(readings){
  try{
    localStorage.setItem(GRIMOIRE_STORAGE_KEY,JSON.stringify(readings));
  }catch(e){
    console.warn("Could not save grimoire readings",e);
  }
}

function createSavedReading({name,chain,tags,notes,analysis}){
  return {
    id:`reading_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
    name:name?.trim() || "Untitled Reading",
    chain:[...(chain || [])],
    tags:[...(tags || [])].map(t=>String(t).trim()).filter(Boolean),
    notes:notes || "",
    routeEntries:analysis?.routeEntries || [],
    stateFlow:analysis?.stateFlow || [],
    primaryKernel:analysis?.primaryKernel || "",
    sharedFragments:analysis?.sharedFragments || [],
    sharedTerminals:analysis?.sharedTerminals || [],
    exportText:makeChainExport(name,analysis)
  };
}

function parseTagsInput(input){
  return String(input || "")
    .split(",")
    .map(x=>x.trim())
    .filter(Boolean);
}

function uniqueTagsFromReadings(readings){
  return Array.from(new Set(readings.flatMap(r=>r.tags || []))).sort((a,b)=>a.localeCompare(b));
}

function analyzeSavedPatterns(readings){
  const kernelCounts={};
  const fragmentCounts={};
  const demonCounts={};
  const stateCounts={};
  const stateEndingCounts={};
  const tagCounts={};
  const routeCounts={};

  readings.forEach(r=>{
    if(r.primaryKernel){
      kernelCounts[r.primaryKernel]=(kernelCounts[r.primaryKernel] || 0)+1;
    }

    (r.sharedFragments || []).forEach(f=>{
      if(f.frag) fragmentCounts[f.frag]=(fragmentCounts[f.frag] || 0)+1;
    });

    (r.chain || []).forEach(d=>{
      demonCounts[d]=(demonCounts[d] || 0)+1;
    });

    (r.stateFlow || []).forEach(s=>{
      if(s.stateName && s.stateName !== "—"){
        stateCounts[s.stateName]=(stateCounts[s.stateName] || 0)+1;
      }
    });

    const ending=(r.stateFlow || []).slice(-3).map(s=>s.stateName).filter(Boolean).join(" → ");
    if(ending){
      stateEndingCounts[ending]=(stateEndingCounts[ending] || 0)+1;
    }

    (r.tags || []).forEach(t=>{
      tagCounts[t]=(tagCounts[t] || 0)+1;
    });

    (r.routeEntries || []).forEach(e=>{
      if(e.code && e.code !== "X" && e.code !== "?"){
        const key=`${e.code} · ${e.demon}`;
        routeCounts[key]=(routeCounts[key] || 0)+1;
      }
    });
  });

  function sorted(obj){
    return Object.entries(obj)
      .map(([name,count])=>({name,count}))
      .sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name));
  }

  return {
    kernels:sorted(kernelCounts),
    fragments:sorted(fragmentCounts),
    demons:sorted(demonCounts),
    states:sorted(stateCounts),
    endings:sorted(stateEndingCounts),
    tags:sorted(tagCounts),
    routes:sorted(routeCounts)
  };
}

function readingMatchesSearch(reading,query,tagFilter){
  const q=normalizeName(query || "");
  const tagOk=!tagFilter || tagFilter==="all" || (reading.tags || []).includes(tagFilter);
  if(!tagOk) return false;
  if(!q) return true;

  const hay=[
    reading.name,
    reading.notes,
    reading.primaryKernel,
    ...(reading.chain || []),
    ...(reading.tags || []),
    ...(reading.routeEntries || []).flatMap(e=>[e.demon,e.code,e.title,e.text]),
    ...(reading.stateFlow || []).flatMap(s=>[s.demon,s.stateName])
  ].join(" ").toLowerCase();

  return hay.includes(q);
}
// ── STYLE SYSTEM ──────────────────────────────────────────────────

const fontUrl="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap";
const f={serif:{fontFamily:'"Instrument Serif",Georgia,serif'},mono:{fontFamily:'"DM Mono","SF Mono",monospace',fontWeight:400},monoLight:{fontFamily:'"DM Mono","SF Mono",monospace',fontWeight:300}};
const c={bg:"#0C0C0B",surface:"#141413",raised:"#1A1A18",border:"#262624",borderS:"#1E1E1C",text:"#E8E6E1",muted:"#9C9A93",dim:"#5C5A55",indicator:"#C8C5BD"};

// ── MICRO COMPONENTS ──────────────────────────────────────────────

function Label({children,style:s}){return<span style={{...f.mono,fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:c.dim,...s}}>{children}</span>;}
function Mono({children,style:s,...props}){return<span style={{...f.mono,color:c.muted,fontSize:14,...s}}{...props}>{children}</span>;}
function Pill({children,active,color,onClick,style:s}){return<button onClick={onClick}style={{...f.mono,fontSize:12,letterSpacing:"0.04em",padding:"7px 16px",borderRadius:100,border:`1px solid ${active?(color||c.text):c.border}`,background:active?(color||c.text):"transparent",color:active?c.bg:c.muted,cursor:"pointer",transition:"all 0.2s",whiteSpace:"nowrap",...s}}>{children}</button>;}
function Bar({value,color}){return<div style={{height:2,width:"100%",background:c.border,borderRadius:1}}><div style={{height:"100%",width:`${Math.min(100,value)}%`,background:color||c.indicator,borderRadius:1,transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)"}}/></div>;}
function Section({label,children,style:s}){return<div style={s}>{label&&<Label style={{display:"block",marginBottom:14}}>{label}</Label>}{children}</div>;}
function Panel({children,style:s,onClick}){return<div onClick={onClick}style={{background:c.surface,border:`1px solid ${c.borderS}`,borderRadius:20,overflow:"hidden",...s,cursor:onClick?"pointer":undefined}}>{children}</div>;}
function InnerPanel({children,style:s}){return<div style={{background:c.bg,borderRadius:14,padding:"20px 22px",...s}}>{children}</div>;}

// ── TAB BAR ───────────────────────────────────────────────────────

const tabDefs=[

  {id:"atlas",label:"States"},

  {id:"demons",label:"Demons"},

  {id:"routes",label:"Routes"},

  {id:"cipher",label:"Cipher Lab"},

  {id:"compare",label:"Compare Lab"},

  {id:"chain",label:"Chain Builder"},

  {id:"grimoire",label:"Grimoire"},

  {id:"patterns",label:"Patterns"},

  {id:"diagnosis",label:"Locate"}

];
function TabBar({active,onChange,bp}){return<div style={{display:"flex",gap:2,background:c.surface,border:`1px solid ${c.borderS}`,borderRadius:14,padding:4,flexWrap:bp.isMobile?"wrap":"nowrap"}}>{tabDefs.map(t=><button key={t.id}onClick={()=>onChange(t.id)}style={{...f.mono,fontSize:bp.isMobile?12:13,letterSpacing:"0.06em",padding:bp.isMobile?"10px 16px":"14px 28px",borderRadius:11,border:"none",background:active===t.id?c.text:"transparent",color:active===t.id?c.bg:c.dim,cursor:"pointer",transition:"all 0.25s",flex:bp.isMobile?"1 1 40%":1}}>{t.label}</button>)}</div>;}

// ── STATE MAP ─────────────────────────────────────────────────────

function StateMap({activeState,onSelect,bp}){
  const stateList=Object.values(states);const eo={3:0.6,2:0.35,1:0.15};const ew={3:2.5,2:1.5,1:0.8};const pad=bp.isMobile?16:28;
  return<Panel><div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}><div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>Temporal topology</div><div style={{...f.monoLight,fontSize:bp.isMobile?13:14,color:c.dim,marginTop:8}}>Ten states of local time production. Select to inspect.</div></div>
  <div style={{padding:`0 ${pad*0.6}px ${pad*0.6}px`}}><svg viewBox="0 0 1000 900"style={{width:"100%",display:"block",borderRadius:14,background:c.bg}}>
  <defs>{stateList.map(s=><marker key={s.id}id={`a4-${s.id}`}markerWidth="6"markerHeight="6"refX="4.5"refY="3"orient="auto"><polygon points="0 0,6 3,0 6"fill={s.color}opacity="0.6"/></marker>)}</defs>
  {transitions.map((e,i)=>{const from=states[e.from],to=states[e.to],act=activeState===e.from||activeState===e.to,dim=activeState&&!act;return<path key={i}d={getCurvePath(from,to,e.strength===1?18:30)}fill="none"stroke={act?from.color:c.border}strokeWidth={act?ew[e.strength]*1.3:ew[e.strength]}strokeOpacity={dim?0.06:act?0.8:eo[e.strength]}strokeDasharray={e.strength===1?"4 4":"none"}markerEnd={`url(#a4-${from.id})`}style={{transition:"all 0.4s ease"}}/>;})}
  {stateList.map(s=>{const isA=activeState===s.id,conn=activeState&&transitions.some(t=>(t.from===activeState&&t.to===s.id)||(t.to===activeState&&t.from===s.id)||s.id===activeState),dim=activeState&&!isA&&!conn;return<g key={s.id}transform={`translate(${s.x},${s.y})`}onClick={()=>onSelect(s.id)}style={{cursor:"pointer"}}>{isA&&<circle r={62}fill="none"stroke={s.color}strokeOpacity={0.12}/>}<circle r={isA?50:42}fill={isA?`${s.color}10`:c.surface}stroke={s.color}strokeWidth={isA?2:1}opacity={dim?0.15:1}style={{transition:"all 0.35s ease"}}/><text x="0"y="-8"textAnchor="middle"fontSize="10"fill={dim?c.borderS:s.color}style={{...f.mono,letterSpacing:"0.18em",fontWeight:500}}>{s.name.toUpperCase()}</text><text x="0"y="8"textAnchor="middle"fontSize="9"fill={dim?c.borderS:c.dim}style={f.monoLight}>{s.zone}</text><text x="0"y="22"textAnchor="middle"fontSize="8.5"fill={dim?c.borderS:c.dim}style={f.monoLight}opacity={0.5}>{s.short}</text></g>;})}
  </svg></div></Panel>;
}

// ── STATE INSPECTOR ───────────────────────────────────────────────

function StateInspector({stateId,onJump,onOpenDemon,bp}){
  const s=states[stateId];const pad=bp.isMobile?18:28;const sub=bp.isMobile?"1fr":"1fr 1fr";const tri=bp.isMobile?"1fr":bp.isTablet?"1fr 1fr":"1fr 1fr 1fr";
  return<Panel><div style={{padding:`${pad}px ${pad}px 0`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><Label>{s.region} · {s.short}</Label><div style={{...f.serif,fontSize:bp.isMobile?32:40,color:c.text,marginTop:6,lineHeight:1.1}}>{s.name}</div></div><div style={{width:12,height:12,borderRadius:"50%",background:s.color,boxShadow:`0 0 24px ${s.color}40`,marginTop:8,flexShrink:0}}/></div><div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:14,lineHeight:1.7}}>{s.signature}</div></div>
  <div style={{padding:pad}}>
    <div style={{display:"grid",gridTemplateColumns:sub,gap:14}}><InnerPanel><Label>Zone / gate</Label><Mono style={{display:"block",marginTop:8}}>{s.zone} · {s.gate}</Mono></InnerPanel><InnerPanel><Label>Function</Label><Mono style={{display:"block",marginTop:8}}>{s.function}</Mono></InnerPanel></div>
    <div style={{display:"grid",gridTemplateColumns:sub,gap:14,marginTop:14}}><InnerPanel><Label>Body</Label><div style={{marginTop:10}}>{s.body.map(x=><div key={x}style={{...f.monoLight,fontSize:13,color:c.muted,padding:"4px 0"}}>{x}</div>)}</div></InnerPanel><InnerPanel><Label>Cues</Label><div style={{marginTop:10}}>{s.cues.map(x=><div key={x}style={{...f.monoLight,fontSize:13,color:c.muted,padding:"4px 0"}}>{x}</div>)}</div></InnerPanel></div>
    <InnerPanel style={{marginTop:14}}><Label>Demons</Label><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:12}}>{s.demons.map(d=><Pill key={d}onClick={()=>onOpenDemon(d)}>{d}</Pill>)}</div></InnerPanel>
    <div style={{display:"grid",gridTemplateColumns:tri,gap:14,marginTop:14}}><InnerPanel><Label>Corruption</Label><div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:8,lineHeight:1.6}}>{s.corruption}</div></InnerPanel><InnerPanel><Label>Grace</Label><div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:8,lineHeight:1.6}}>{s.grace}</div></InnerPanel><InnerPanel><Label>Handling</Label><div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:8,lineHeight:1.6}}>{s.howToExit}</div></InnerPanel></div>
    <Section label="Flow"style={{marginTop:24}}><div style={{display:"grid",gap:10}}>{s.likelyNext.map(n=>{const t=states[n.target];return<div key={n.target}onClick={()=>onJump(n.target)}style={{background:c.bg,borderRadius:12,padding:"16px 18px",cursor:"pointer",transition:"background 0.2s"}}onMouseEnter={e=>e.currentTarget.style.background=c.raised}onMouseLeave={e=>e.currentTarget.style.background=c.bg}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{...f.serif,fontSize:18,color:c.text}}>{t.name}</span><span style={{...f.mono,fontSize:11,color:c.dim}}>{n.label} · {n.weight}%</span></div><Bar value={n.weight}color={t.color}/></div>;})}</div></Section>
  </div></Panel>;
}

// ── DEMON CONSTELLATION ───────────────────────────────────────────

function DemonConstellation({selectedDemon,onSelectDemon,stateFilter,onStateJump,learnMode,bp}){
  const dPos=useMemo(()=>buildDemonPositions(),[]);const vis=demonGraph.filter(d=>stateFilter==="all"||d.state===stateFilter||d.type===stateFilter);const visSet=new Set(vis.map(d=>d.id));const cur=demonGraph.find(d=>d.id===selectedDemon)||demonGraph[0];const out=cur.links.filter(id=>visSet.has(id));const inc=demonGraph.filter(d=>visSet.has(d.id)&&d.links.includes(cur.id)).map(d=>d.id);const outS=new Set(out),inS=new Set(inc),biS=new Set(out.filter(id=>inS.has(id)));const click=new Set(learnMode?[cur.id,...out,...inc]:Array.from(visSet));const pad=bp.isMobile?16:28;const flowG=bp.isMobile?"1fr":"1fr 1fr 1fr";
  return<Panel><div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}><div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>Demon network</div><div style={{...f.monoLight,fontSize:bp.isMobile?13:14,color:c.dim,marginTop:8}}>45 demons. Warm = outgoing, cool = incoming, gold = reciprocal.</div></div>
 <div style={{padding:`0 ${pad*0.6}px ${pad*0.6}px`}}><svg viewBox="0 0 1000 1100" style={{
  width:"100%",
  display:"block",
  margin:"0 auto",
  borderRadius:14,
  background:c.bg
}}>
  <defs><marker id="a4-out"markerWidth="7"markerHeight="7"refX="5.5"refY="3.5"orient="auto"><polygon points="0 0,7 3.5,0 7"fill={c.text}opacity="0.7"/></marker><marker id="a4-in"markerWidth="7"markerHeight="7"refX="5.5"refY="3.5"orient="auto"><polygon points="0 0,7 3.5,0 7"fill="#7C8A9B"opacity="0.7"/></marker></defs>
  {demonGraph.flatMap(d=>{if(!visSet.has(d.id))return[];return d.links.filter(l=>visSet.has(l)).map(link=>{const tgt=demonGraph.find(x=>x.id===link);if(!tgt)return null;const p1=dPos[d.id],p2=dPos[tgt.id];const isO=d.id===cur.id,isI=link===cur.id;let st=c.borderS,w=0.6,op=0.3,mk;if(isO){st=c.indicator;w=2.2;op=0.7;mk="url(#a4-out)";}else if(isI){st="#7C8A9B";w=1.8;op=0.65;mk="url(#a4-in)";}return<line key={`${d.id}-${link}`}x1={p1.x}y1={p1.y}x2={p2.x}y2={p2.y}stroke={st}strokeWidth={w}strokeOpacity={op}markerEnd={mk}style={{transition:"all 0.3s ease"}}/>;});})}
  {Object.values(states).map(s=>{const fd=stateFilter!=="all"&&stateFilter!==s.id;return<g key={s.id}onClick={()=>onStateJump(s.id)}style={{cursor:"pointer"}}><circle cx={s.x}cy={s.y+40}r={28}fill="none"stroke={s.color}strokeOpacity={fd?0.1:0.25}strokeWidth={1}/><text x={s.x}y={s.y+43}textAnchor="middle"fontSize="8"fill={s.color}style={{...f.mono,letterSpacing:"0.14em",fontWeight:500}}opacity={fd?0.2:0.6}>{s.short}</text></g>;})}
  {vis.map(d=>{const pos=dPos[d.id];const col=states[d.state].color;const act=d.id===cur.id;const isO=outS.has(d.id),isI=inS.has(d.id),isBi=biS.has(d.id),isCl=click.has(d.id);let fill=c.surface,tc=col;if(act){fill=c.text;tc=c.bg;}else if(isBi){fill="#C9B06B";tc=c.bg;}else if(isO){fill=c.indicator;tc=c.bg;}else if(isI){fill="#7C8A9B";tc=c.bg;}return<g key={d.id}transform={`translate(${pos.x},${pos.y})`}onClick={()=>isCl&&onSelectDemon(d.id)}style={{cursor:isCl?"pointer":"default"}}opacity={isCl?1:learnMode?0.15:0.7}>{act&&<circle r={22}fill="none"stroke={c.text}strokeOpacity={0.2}/>}<circle r={act?15:10}fill={fill}stroke={act||isO||isI||isBi?"none":col}strokeWidth={0.8}style={{transition:"all 0.3s ease"}}/><text x="0"y={act?3.5:3}textAnchor="middle"fontSize={act?7.5:7}fill={tc}style={{...f.mono,fontWeight:500}}>{d.mesh}</text>{act&&<text x="0"y="-24"textAnchor="middle"fontSize="13"fill={c.text}style={f.serif}>{d.id}</text>}</g>;})}
  </svg></div>
  <div style={{padding:`0 ${pad}px ${pad}px`}}><div style={{display:"grid",gridTemplateColumns:flowG,gap:20}}>
    <Section label={`Incoming → ${cur.id}`}><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{inc.map(id=><Pill key={id}onClick={()=>onSelectDemon(id)}>{id}</Pill>)}{!inc.length&&<Mono style={{fontSize:12}}>—</Mono>}</div></Section>
    <Section label="Reciprocal"><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{Array.from(biS).map(id=><Pill key={id}onClick={()=>onSelectDemon(id)}color="#C9B06B"active>{id}</Pill>)}{!biS.size&&<Mono style={{fontSize:12}}>—</Mono>}</div></Section>
    <Section label={`${cur.id} → Outgoing`}><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{out.map(id=><Pill key={id}onClick={()=>onSelectDemon(id)}>{id}</Pill>)}{!out.length&&<Mono style={{fontSize:12}}>—</Mono>}</div></Section>
  </div></div></Panel>;
}

// ── DEMON INSPECTOR ───────────────────────────────────────────────

function DemonInspector({demonName,onOpenState,onOpenDemon,bp}){
  const dm=demons[demonName]||demons["Mur Mur"];const gr=demonGraph.find(d=>d.id===demonName)||demonGraph[0];const st=states[gr.state];const ns=getNetSpanFromMesh(dm.mesh);const outIds=gr.links;const inIds=demonGraph.filter(d=>d.links.includes(gr.id)).map(d=>d.id);const recip=outIds.filter(id=>inIds.includes(id));const pad=bp.isMobile?18:28;const metaG=bp.isMobile?"1fr 1fr":"repeat(4,1fr)";const flowG=bp.isMobile?"1fr":"1fr 1fr 1fr";
  return<div style={{display:"flex",flexDirection:"column",gap:20}}>
  <Panel><div style={{padding:`${pad}px ${pad}px 0`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><Label>{gr.type} · mesh {dm.mesh}</Label><div style={{...f.serif,fontSize:bp.isMobile?28:36,color:c.text,marginTop:6}}>{demonName}</div><div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:8}}>{dm.role}</div></div><div style={{width:10,height:10,borderRadius:"50%",background:st.color,boxShadow:`0 0 20px ${st.color}50`,marginTop:10,flexShrink:0}}/></div></div>
  <div style={{padding:`${pad*0.75}px ${pad}px ${pad}px`}}>
    <div style={{display:"grid",gridTemplateColumns:metaG,gap:14}}>{[["Mesh",dm.mesh],["Net-span",ns],["State",st.name],["Zone",st.zone]].map(([l,v])=><InnerPanel key={l}><Label>{l}</Label><Mono style={{display:"block",marginTop:6}}>{v}</Mono></InnerPanel>)}</div>
    <Pill onClick={()=>onOpenState(st.id)}color={st.color}active style={{marginTop:18}}>Open {st.name} state</Pill>
    <InnerPanel style={{marginTop:18}}><Label>Note</Label><div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:10,lineHeight:1.7}}>{dm.note}</div></InnerPanel>
    <div style={{display:"grid",gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr",gap:14,marginTop:14}}><InnerPanel><Label>Native</Label><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{(dm.native||[]).map(s=><Pill key={s}>{states[s]?.name}</Pill>)}{!(dm.native||[]).length&&<Mono style={{fontSize:12}}>—</Mono>}</div></InnerPanel><InnerPanel><Label>Bridge</Label><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{(dm.bridge||[]).map(s=><Pill key={s}>{states[s]?.name}</Pill>)}{!(dm.bridge||[]).length&&<Mono style={{fontSize:12}}>—</Mono>}</div></InnerPanel></div>
    <div style={{display:"grid",gridTemplateColumns:flowG,gap:14,marginTop:14}}><InnerPanel><Label>Incoming</Label><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{inIds.map(id=><Pill key={id}onClick={()=>onOpenDemon(id)}>{id}</Pill>)}</div></InnerPanel><InnerPanel><Label>Reciprocal</Label><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{recip.map(id=><Pill key={id}onClick={()=>onOpenDemon(id)}color="#C9B06B"active>{id}</Pill>)}{!recip.length&&<Mono style={{fontSize:12}}>—</Mono>}</div></InnerPanel><InnerPanel><Label>Outgoing</Label><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{outIds.map(id=><Pill key={id}onClick={()=>onOpenDemon(id)}>{id}</Pill>)}</div></InnerPanel></div>
  </div></Panel>
  <Panel><div style={{padding:`${pad*0.85}px ${pad}px ${pad*0.3}px`}}><div style={{...f.serif,fontSize:22,color:c.text}}>Routes</div></div><div style={{padding:`0 ${pad}px ${pad}px`}}>{(routeOracle[demonName]||[]).length?(routeOracle[demonName]||[]).map((item,i)=><InnerPanel key={`${item.code}-${i}`}style={{marginTop:i?12:0}}><Label>Route [{item.code}]</Label><div style={{...f.serif,fontSize:20,color:c.text,marginTop:8}}>{item.title}</div><div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:8,lineHeight:1.7}}>{item.text}</div></InnerPanel>):<InnerPanel><Mono style={{fontSize:13}}>No route fragments attached.</Mono></InnerPanel>}</div></Panel>
  </div>;
}

// ── NUMOGRAM ROUTES LAB ───────────────────────────────────────────

function NumogramRoutesLab({bp}){
  const dn=Object.keys(routeOracle).sort();const[sd,setSd]=useState(dn[0]||"Lurgo");const routes=routeOracle[sd]||[];const[src,setSrc]=useState(routes[0]?.code||null);useEffect(()=>{setSrc((routeOracle[sd]||[])[0]?.code||null);},[sd]);const sr=routes.find(r=>r.code===src)||routes[0]||null;const pts=sr?parseRouteCode(sr.code):[];const rp=buildRoutePath(pts);const pad=bp.isMobile?16:28;
 return<div style={{
  display:"grid",
  gridTemplateColumns:bp.isDesktop?"620px 1fr":"1fr",
  gap:20,
  alignItems:"start"
}}>
  <Panel><div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}><div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>Numogram</div><div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:8}}>Rites traced through zones, currents, gates, and channels.</div></div>
  <div style={{padding:`0 ${pad*0.6}px ${pad*0.6}px`}}><svg
  viewBox="0 0 1000 2050"
  preserveAspectRatio="xMidYMid meet"
  style={{
    width: "100%",
    display: "block",
    borderRadius: 14,
    background: "#000000",
  }}
>
  {/* The hand-drawn numogram as backdrop */}
  <image
    href="/Numogram-blackgreen.jpg"
    x="50"
    y="50"
    width="900"
    height="1950"
    preserveAspectRatio="xMidYMid meet"
  />
 
  {/* Active route overlay in orange, drawn on top */}
  {rp && (
    <>
      {/* Soft orange halo behind the route */}
      <path
        d={rp}
        fill="none"
        stroke="#FF6B1A"
        strokeWidth={22}
        strokeLinecap="round"
        strokeOpacity={0.18}
      />
      {/* Animated dashed line */}
      <path
        d={rp}
        fill="none"
        stroke="#FF8838"
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray="11 9"
        strokeOpacity={0.95}
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-40"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </path>
    </>
  )}
 
  {/* Route dots — bright orange, pulsing, numbered */}
  {pts.map((pt, i) => (
    <g key={`${pt.digit}-${i}`}>
      <circle cx={pt.x} cy={pt.y} r={28} fill="#FF6B1A" opacity={0.22}>
        <animate
          attributeName="r"
          values="24;34;24"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx={pt.x}
        cy={pt.y}
        r={14}
        fill="#FF8838"
        stroke="#FFFFFF"
        strokeWidth={2}
      />
      <text
        x={pt.x}
        y={pt.y + 5}
        textAnchor="middle"
        fontSize={14}
        fill="#0C0C0B"
        style={{ ...f.mono, fontWeight: 600 }}
      >
        {i + 1}
      </text>
    </g>
  ))}
</svg></div></Panel>
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    <Panel><div style={{padding:pad}}><Section label="Demon"><select value={sd}onChange={e=>setSd(e.target.value)}style={{...f.mono,fontSize:14,width:"100%",padding:"12px 16px",borderRadius:12,border:`1px solid ${c.border}`,background:c.bg,color:c.text,outline:"none",marginTop:4}}>{dn.map(n=><option key={n}value={n}>{n}</option>)}</select></Section><Section label="Routes"style={{marginTop:24}}><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>{routes.length?routes.map((it,i)=><Pill key={`${it.code}-${i}`}active={src===it.code}onClick={()=>setSrc(it.code)}>{it.code}</Pill>):<Mono style={{fontSize:12}}>No routes</Mono>}</div></Section></div></Panel>
    <Panel style={{flex:1}}><div style={{padding:pad}}>{sr?<><Label>Route [{sr.code}]</Label><div style={{...f.serif,fontSize:24,color:c.text,marginTop:10}}>{sr.title}</div><div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:14,lineHeight:1.8}}>{sr.text}</div><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:20}}>{String(sr.code).split("").map((ch,i)=><span key={i}style={{...f.mono,fontSize:14,width:34,height:34,display:"inline-flex",alignItems:"center",justifyContent:"center",border:`1px solid ${c.border}`,borderRadius:10,color:c.muted}}>{ch}</span>)}</div></>:<Mono style={{fontSize:13}}>No route selected.</Mono>}</div></Panel>
  </div></div>;
}
function CipherLab({bp}){
  const [input,setInput]=useState("541890");
  const result=useMemo(()=>analyzeRouteInput(input),[input]);
  const pts=parseRouteCode(result.cleaned);
  const rp=buildRoutePath(pts);
  const pad=bp.isMobile?18:28;

  function RouteCard({entry,label}){
    const st=states[entry.state];
    return (
      <InnerPanel style={{marginTop:10}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
          <div>
            <Label>{label} · Mesh {entry.mesh} · Route [{entry.code}]</Label>
            <div style={{...f.serif,fontSize:22,color:c.text,marginTop:8}}>
              {entry.demon}
            </div>
            <div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:6}}>
              {entry.title}
            </div>
          </div>
          {st && (
            <div style={{
              width:10,
              height:10,
              borderRadius:"50%",
              background:st.color,
              boxShadow:`0 0 18px ${st.color}55`,
              marginTop:5,
              flexShrink:0
            }}/>
          )}
        </div>
        <div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:12,lineHeight:1.7}}>
          {entry.text}
        </div>
      </InnerPanel>
    );
  }

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:bp.isDesktop?"620px 1fr":"1fr",
      gap:20,
      alignItems:"start"
    }}>
      <Panel>
        <div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}>
          <div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>
            Cipher Lab
          </div>
          <div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:8}}>
            Type a route number and reveal exact, embedded, terminal, and carrier demons.
          </div>
        </div>

        <div style={{padding:`0 ${pad}px ${pad}px`}}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            placeholder="541890"
            style={{
              ...f.mono,
              fontSize:18,
              width:"100%",
              padding:"16px 18px",
              borderRadius:14,
              border:`1px solid ${c.border}`,
              background:c.bg,
              color:c.text,
              outline:"none",
              letterSpacing:"0.08em"
            }}
          />

          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
            {["1890","541890","41890","71890","271890","72541890","89","890"].map(x=>(
              <Pill key={x} active={result.cleaned===x} onClick={()=>setInput(x)}>
                {x}
              </Pill>
            ))}
          </div>

          <div style={{marginTop:18}}>
            <svg
              viewBox="0 0 1000 2050"
              preserveAspectRatio="xMidYMid meet"
              style={{
                width:"100%",
                display:"block",
                borderRadius:14,
                background:"#000000"
              }}
            >
              <image
                href="/Numogram-blackgreen.jpg"
                x="50"
                y="50"
                width="900"
                height="1950"
                preserveAspectRatio="xMidYMid meet"
              />

              {rp && (
                <>
                  <path
                    d={rp}
                    fill="none"
                    stroke="#FF6B1A"
                    strokeWidth={22}
                    strokeLinecap="round"
                    strokeOpacity={0.18}
                  />
                  <path
                    d={rp}
                    fill="none"
                    stroke="#FF8838"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray="11 9"
                    strokeOpacity={0.95}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-40"
                      dur="1.6s"
                      repeatCount="indefinite"
                    />
                  </path>
                </>
              )}

              {pts.map((pt,i)=>(
                <g key={`${pt.digit}-${i}`}>
                  <circle cx={pt.x} cy={pt.y} r={28} fill="#FF6B1A" opacity={0.22}/>
                  <circle cx={pt.x} cy={pt.y} r={14} fill="#FF8838" stroke="#FFFFFF" strokeWidth={2}/>
                  <text
                    x={pt.x}
                    y={pt.y+5}
                    textAnchor="middle"
                    fontSize={14}
                    fill="#0C0C0B"
                    style={{...f.mono,fontWeight:600}}
                  >
                    {pt.digit}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </Panel>

      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <Panel>
          <div style={{padding:pad}}>
            <Label>Cleaned route</Label>
            <div style={{...f.serif,fontSize:34,color:c.text,marginTop:8}}>
              {result.cleaned || "—"}
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:16}}>
              {result.cleaned.split("").map((ch,i)=>(
                <span key={`${ch}-${i}`} style={{
                  ...f.mono,
                  fontSize:14,
                  width:36,
                  height:36,
                  display:"inline-flex",
                  alignItems:"center",
                  justifyContent:"center",
                  border:`1px solid ${c.border}`,
                  borderRadius:10,
                  color:c.muted
                }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="Exact match">
              {result.exact.length
                ? result.exact.map(e=><RouteCard key={`${e.demon}-${e.code}`} entry={e} label="Exact"/>)
                : <InnerPanel><Mono style={{fontSize:13}}>No exact match.</Mono></InnerPanel>
              }
            </Section>

            <Section label="Embedded inside this route" style={{marginTop:24}}>
              {result.contains.length
                ? result.contains.map(e=><RouteCard key={`${e.demon}-${e.code}`} entry={e} label="Embedded"/>)
                : <InnerPanel><Mono style={{fontSize:13}}>No embedded route found.</Mono></InnerPanel>
              }
            </Section>

            <Section label="Routes that contain this route" style={{marginTop:24}}>
              {result.containedBy.length
                ? result.containedBy.map(e=><RouteCard key={`${e.demon}-${e.code}`} entry={e} label="Carrier"/>)
                : <InnerPanel><Mono style={{fontSize:13}}>No larger carrier route found.</Mono></InnerPanel>
              }
            </Section>

            <Section label="Same terminal pattern" style={{marginTop:24}}>
              {result.sameTerminal.length
                ? result.sameTerminal.map(e=><RouteCard key={`${e.demon}-${e.code}`} entry={e} label="Terminal resonance"/>)
                : <InnerPanel><Mono style={{fontSize:13}}>No terminal resonance found.</Mono></InnerPanel>
              }
            </Section>
          </div>
        </Panel>
      </div>
    </div>
  );
}
function CompareLab({bp}){
  const [aInput,setAInput]=useState("541890");
  const [bInput,setBInput]=useState("71890");

  const result=useMemo(()=>compareInputs(aInput,bInput),[aInput,bInput]);
  const pad=bp.isMobile?18:28;

  const aRouteCode=result.A.codes.find(x=>/^[0-9]+$/.test(x)) || "";
  const bRouteCode=result.B.codes.find(x=>/^[0-9]+$/.test(x)) || "";

  const aPts=parseRouteCode(aRouteCode);
  const bPts=parseRouteCode(bRouteCode);
  const aPath=buildRoutePath(aPts);
  const bPath=buildRoutePath(bPts);

  function SmallRouteCard({entry,label}){
    const st=states[entry.state];
    return (
      <InnerPanel style={{marginTop:10}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
          <div>
            <Label>{label} · Mesh {entry.mesh} · [{entry.code}]</Label>
            <div style={{...f.serif,fontSize:20,color:c.text,marginTop:7}}>
              {entry.demon}
            </div>
            <div style={{...f.monoLight,fontSize:12,color:c.muted,marginTop:5}}>
              {entry.title}
            </div>
          </div>
          {st && (
            <div style={{
              width:9,
              height:9,
              borderRadius:"50%",
              background:st.color,
              boxShadow:`0 0 16px ${st.color}55`,
              marginTop:5,
              flexShrink:0
            }}/>
          )}
        </div>
      </InnerPanel>
    );
  }

  function StateFlow({flow}){
    if(!flow.length){
      return <Mono style={{fontSize:12}}>No state-flow registered.</Mono>;
    }

    return (
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
        {flow.map((x,i)=>(
          <div key={`${x.demon}-${i}`} style={{
            display:"flex",
            alignItems:"center",
            gap:8
          }}>
            <span style={{
              ...f.mono,
              fontSize:11,
              padding:"7px 10px",
              border:`1px solid ${c.border}`,
              borderRadius:10,
              color:c.muted,
              background:c.bg
            }}>
              {x.demon}
            </span>
            <span style={{
              ...f.mono,
              fontSize:11,
              padding:"7px 10px",
              borderRadius:10,
              color:c.bg,
              background:x.color
            }}>
              {x.stateName}
            </span>
            {i < flow.length-1 && (
              <span style={{...f.mono,color:c.dim,fontSize:12}}>→</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:bp.isDesktop?"620px 1fr":"1fr",
      gap:20,
      alignItems:"start"
    }}>
      <Panel>
        <div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}>
          <div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>
            Compare Lab
          </div>
          <div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:8,lineHeight:1.7}}>
            Compare two routes, demons, or demon chains. Finds shared kernels, terminal attractors, prefixes, and state-flow differences.
          </div>
        </div>

        <div style={{padding:`0 ${pad}px ${pad}px`}}>
          <div style={{display:"grid",gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr",gap:12}}>
            <div>
              <Label>A</Label>
              <textarea
                value={aInput}
                onChange={e=>setAInput(e.target.value)}
                placeholder="541890 or Tokhatto → Puppo → Uttunul → Lurgo"
                rows={4}
                style={{
                  ...f.mono,
                  fontSize:14,
                  width:"100%",
                  marginTop:8,
                  padding:"14px 16px",
                  borderRadius:14,
                  border:`1px solid ${c.border}`,
                  background:c.bg,
                  color:c.text,
                  outline:"none",
                  resize:"vertical",
                  lineHeight:1.5
                }}
              />
            </div>

            <div>
              <Label>B</Label>
              <textarea
                value={bInput}
                onChange={e=>setBInput(e.target.value)}
                placeholder="71890 or Tokhatto → Krako → Lurgo"
                rows={4}
                style={{
                  ...f.mono,
                  fontSize:14,
                  width:"100%",
                  marginTop:8,
                  padding:"14px 16px",
                  borderRadius:14,
                  border:`1px solid ${c.border}`,
                  background:c.bg,
                  color:c.text,
                  outline:"none",
                  resize:"vertical",
                  lineHeight:1.5
                }}
              />
            </div>
          </div>

          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
            <Pill onClick={()=>{setAInput("541890");setBInput("71890");}}>
              Tokhatto / Puppo
            </Pill>
            <Pill onClick={()=>{setAInput("541890");setBInput("271890");}}>
              Tokhatto / Duoddod
            </Pill>
            <Pill onClick={()=>{setAInput("Tokhatto → Puppo → Uttunul → Lurgo");setBInput("Tokhatto → Krako → Katak → Ummnu → Muntuk → Numko → Sukugool → Ixigool → Lurgo");}}>
              Deep / Ordeal
            </Pill>
          </div>

          <div style={{marginTop:18}}>
            <svg
              viewBox="0 0 1000 2050"
              preserveAspectRatio="xMidYMid meet"
              style={{
                width:"100%",
                display:"block",
                borderRadius:14,
                background:"#000000"
              }}
            >
              <image
                href="/Numogram-blackgreen.jpg"
                x="50"
                y="50"
                width="900"
                height="1950"
                preserveAspectRatio="xMidYMid meet"
              />

              {aPath && (
                <>
                  <path
                    d={aPath}
                    fill="none"
                    stroke="#FF6B1A"
                    strokeWidth={24}
                    strokeLinecap="round"
                    strokeOpacity={0.16}
                  />
                  <path
                    d={aPath}
                    fill="none"
                    stroke="#FF8838"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray="11 9"
                    strokeOpacity={0.9}
                  />
                </>
              )}

              {bPath && (
                <>
                  <path
                    d={bPath}
                    fill="none"
                    stroke="#69D2E7"
                    strokeWidth={16}
                    strokeLinecap="round"
                    strokeOpacity={0.18}
                  />
                  <path
                    d={bPath}
                    fill="none"
                    stroke="#A7F3FF"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray="5 8"
                    strokeOpacity={0.9}
                  />
                </>
              )}

              {aPts.map((pt,i)=>(
                <g key={`a-${pt.digit}-${i}`}>
                  <circle cx={pt.x} cy={pt.y} r={13} fill="#FF8838" stroke="#FFFFFF" strokeWidth={2}/>
                  <text x={pt.x} y={pt.y+5} textAnchor="middle" fontSize={13} fill="#0C0C0B" style={{...f.mono,fontWeight:600}}>
                    {pt.digit}
                  </text>
                </g>
              ))}

              {bPts.map((pt,i)=>(
                <g key={`b-${pt.digit}-${i}`}>
                  <circle cx={pt.x+24} cy={pt.y} r={12} fill="#A7F3FF" stroke="#FFFFFF" strokeWidth={2}/>
                  <text x={pt.x+24} y={pt.y+4} textAnchor="middle" fontSize={12} fill="#0C0C0B" style={{...f.mono,fontWeight:600}}>
                    {pt.digit}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </Panel>

      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <Panel>
          <div style={{padding:pad}}>
            <Label>Primary shared terminal</Label>
            <div style={{...f.serif,fontSize:36,color:c.text,marginTop:8}}>
              {result.primaryTerminal || "—"}
            </div>

            {result.primaryTerminal && (
              <div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:12,lineHeight:1.7}}>
                Both sides terminate through the same kernel. The difference is in the carrier-prefix.
              </div>
            )}

            <div style={{display:"grid",gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr",gap:12,marginTop:18}}>
              <InnerPanel>
                <Label>A prefixes</Label>
                <div style={{marginTop:10,display:"grid",gap:7}}>
                  {result.aPrefix.map((x,i)=>(
                    <Mono key={i} style={{fontSize:12}}>
                      {x.code} = <span style={{color:c.text}}>{x.prefix}</span> + {result.primaryTerminal || "—"}
                    </Mono>
                  ))}
                </div>
              </InnerPanel>

              <InnerPanel>
                <Label>B prefixes</Label>
                <div style={{marginTop:10,display:"grid",gap:7}}>
                  {result.bPrefix.map((x,i)=>(
                    <Mono key={i} style={{fontSize:12}}>
                      {x.code} = <span style={{color:c.text}}>{x.prefix}</span> + {result.primaryTerminal || "—"}
                    </Mono>
                  ))}
                </div>
              </InnerPanel>
            </div>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="A exact routes">
              {result.A.routes.length
                ? result.A.routes.map((e,i)=><SmallRouteCard key={`a-${e.demon}-${e.code}-${i}`} entry={e} label="A"/>)
                : <InnerPanel><Mono style={{fontSize:13}}>No route found.</Mono></InnerPanel>
              }
            </Section>

            <Section label="B exact routes" style={{marginTop:24}}>
              {result.B.routes.length
                ? result.B.routes.map((e,i)=><SmallRouteCard key={`b-${e.demon}-${e.code}-${i}`} entry={e} label="B"/>)
                : <InnerPanel><Mono style={{fontSize:13}}>No route found.</Mono></InnerPanel>
              }
            </Section>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="Shared demons">
              {result.sharedDemons.length
                ? <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                    {result.sharedDemons.map(d=><Pill key={d} active>{d}</Pill>)}
                  </div>
                : <InnerPanel><Mono style={{fontSize:13}}>No exact shared demons.</Mono></InnerPanel>
              }
            </Section>

            <Section label="Shared route fragments" style={{marginTop:24}}>
              {result.sharedFragments.length
                ? result.sharedFragments.slice(0,16).map(item=>(
                    <InnerPanel key={item.frag} style={{marginTop:10}}>
                      <Label>Fragment</Label>
                      <div style={{...f.serif,fontSize:24,color:c.text,marginTop:6}}>
                        {item.frag}
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
                        {item.demons.length
                          ? item.demons.map(e=>(
                              <Pill key={`${item.frag}-${e.demon}`}>
                                {e.demon}
                              </Pill>
                            ))
                          : <Mono style={{fontSize:12}}>Unregistered fragment</Mono>
                        }
                      </div>
                    </InnerPanel>
                  ))
                : <InnerPanel><Mono style={{fontSize:13}}>No shared fragments found.</Mono></InnerPanel>
              }
            </Section>

            <Section label="Shared terminal patterns" style={{marginTop:24}}>
              {result.sharedTerminals.length
                ? <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                    {result.sharedTerminals.map(t=><Pill key={t} active>{t}</Pill>)}
                  </div>
                : <InnerPanel><Mono style={{fontSize:13}}>No shared terminal pattern.</Mono></InnerPanel>
              }
            </Section>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="State-flow A">
              <StateFlow flow={result.A.stateFlow}/>
            </Section>

            <Section label="State-flow B" style={{marginTop:24}}>
              <StateFlow flow={result.B.stateFlow}/>
            </Section>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Label>Interpretive verdict</Label>
            <div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:12,lineHeight:1.8}}>
              {result.primaryTerminal
                ? <>These two inputs share <span style={{color:c.text}}>{result.primaryTerminal}</span> as a terminal kernel. Read the difference by their prefixes: A enters through <span style={{color:c.text}}>{result.aPrefix[0]?.prefix}</span>, while B enters through <span style={{color:c.text}}>{result.bPrefix[0]?.prefix}</span>. Same attractor, different carrier-world.</>
                : <>No strong terminal kernel was found. Read these as divergent route-families unless a smaller shared fragment appears above.</>
              }
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
function ChainBuilder({bp}){
  const allDemonNames=Object.keys(demons).sort((a,b)=>{
    const am=Number(demons[a]?.mesh ?? 999);
    const bm=Number(demons[b]?.mesh ?? 999);
    return am-bm;
  });

  const [chain,setChain]=useState(["Tokhatto","Puppo","Uttunul","Lurgo"]);
  const [selected,setSelected]=useState("Tokhatto");
  const [chainName,setChainName]=useState("Tokhatto Descent with Lurgo Seed");
  const [copied,setCopied]=useState(false);
  const [tagInput,setTagInput]=useState("Soft Control, Lurgo Kernel");
  const [notes,setNotes]=useState("");
  const [savedMsg,setSavedMsg]=useState("");

  const analysis=useMemo(()=>analyzeDemonChain(chain),[chain]);
  const pad=bp.isMobile?18:28;

  const firstNumericCode=analysis.codes[0] || "";
  const pts=parseRouteCode(firstNumericCode);
  const path=buildRoutePath(pts);

  function addDemon(name){
    setChain(prev=>[...prev,name]);
  }

  function removeAt(index){
    setChain(prev=>prev.filter((_,i)=>i!==index));
  }

  function move(index,dir){
    setChain(prev=>{
      const next=[...prev];
      const ni=index+dir;
      if(ni<0 || ni>=next.length) return prev;
      [next[index],next[ni]]=[next[ni],next[index]];
      return next;
    });
  }
function saveToGrimoire(){
  const existing=loadSavedReadings();
  const reading=createSavedReading({
    name:chainName,
    chain,
    tags:parseTagsInput(tagInput),
    notes,
    analysis
  });

  const next=[reading,...existing];
  saveReadingsToStorage(next);
  setSavedMsg("Saved to Grimoire");
  setTimeout(()=>setSavedMsg(""),1600);
}
  async function copyExport(){
    const text=makeChainExport(chainName,analysis);
    try{
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(()=>setCopied(false),1400);
    }catch(e){
      setCopied(false);
    }
  }

  function ChainRouteCard({entry}){
    const st=states[entry.state];
    return (
      <InnerPanel style={{marginTop:10}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
          <div>
            <Label>Mesh {entry.mesh} · Route [{entry.code}]</Label>
            <div style={{...f.serif,fontSize:21,color:c.text,marginTop:7}}>
              {entry.demon}
            </div>
            <div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:5}}>
              {entry.title}
            </div>
          </div>
          {st && (
            <div style={{
              width:9,
              height:9,
              borderRadius:"50%",
              background:st.color,
              boxShadow:`0 0 16px ${st.color}55`,
              marginTop:5,
              flexShrink:0
            }}/>
          )}
        </div>
        <div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:10,lineHeight:1.7}}>
          {entry.text}
        </div>
      </InnerPanel>
    );
  }

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:bp.isDesktop?"620px 1fr":"1fr",
      gap:20,
      alignItems:"start"
    }}>
      <Panel>
        <div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}>
          <div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>
            Chain Builder
          </div>
          <div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:8,lineHeight:1.7}}>
            Compose demon-process sentences. Build a chain, reveal route stack, state-flow, shared kernels, and copy the reading.
          </div>
        </div>

        <div style={{padding:`0 ${pad}px ${pad}px`}}>
          <Section label="Name">
            <input
              value={chainName}
              onChange={e=>setChainName(e.target.value)}
              placeholder="Name this chain"
              style={{
                ...f.mono,
                fontSize:14,
                width:"100%",
                padding:"14px 16px",
                borderRadius:14,
                border:`1px solid ${c.border}`,
                background:c.bg,
                color:c.text,
                outline:"none",
                marginTop:8
              }}
            />
          </Section>
<Section label="Tags" style={{marginTop:22}}>
  <input
    value={tagInput}
    onChange={e=>setTagInput(e.target.value)}
    placeholder="Soft Control, Luke, Charisma, 1890"
    style={{
      ...f.mono,
      fontSize:14,
      width:"100%",
      padding:"14px 16px",
      borderRadius:14,
      border:`1px solid ${c.border}`,
      background:c.bg,
      color:c.text,
      outline:"none",
      marginTop:8
    }}
  />
</Section>

<Section label="Notes" style={{marginTop:22}}>
  <textarea
    value={notes}
    onChange={e=>setNotes(e.target.value)}
    placeholder="What did this chain reveal?"
    rows={4}
    style={{
      ...f.monoLight,
      fontSize:14,
      width:"100%",
      padding:"14px 16px",
      borderRadius:14,
      border:`1px solid ${c.border}`,
      background:c.bg,
      color:c.text,
      outline:"none",
      resize:"vertical",
      lineHeight:1.6,
      marginTop:8
    }}
  />
</Section>
          <Section label="Add demon" style={{marginTop:22}}>
            <div style={{display:"grid",gridTemplateColumns:bp.isMobile?"1fr":"1fr auto",gap:10,marginTop:8}}>
              <select
                value={selected}
                onChange={e=>setSelected(e.target.value)}
                style={{
                  ...f.mono,
                  fontSize:14,
                  padding:"12px 14px",
                  borderRadius:12,
                  border:`1px solid ${c.border}`,
                  background:c.bg,
                  color:c.text,
                  outline:"none"
                }}
              >
                {allDemonNames.map(name=>(
                  <option key={name} value={name}>
                    {demons[name]?.mesh} · {name}
                  </option>
                ))}
              </select>

              <Pill active onClick={()=>addDemon(selected)}>
                Add
              </Pill>
            </div>
          </Section>

          <Section label="Current chain" style={{marginTop:24}}>
            <div style={{display:"grid",gap:8,marginTop:10}}>
              {chain.length ? chain.map((name,i)=>{
                const info=getDemonStateInfo(name);
                return (
                  <div key={`${name}-${i}`} style={{
                    display:"grid",
                    gridTemplateColumns:bp.isMobile?"1fr":"auto 1fr auto",
                    alignItems:"center",
                    gap:10,
                    background:c.bg,
                    border:`1px solid ${c.borderS}`,
                    borderRadius:14,
                    padding:"12px 14px"
                  }}>
                    <div style={{
                      ...f.mono,
                      fontSize:11,
                      width:34,
                      height:34,
                      borderRadius:10,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      background:info.color,
                      color:c.bg
                    }}>
                      {info.mesh}
                    </div>

                    <div>
                      <div style={{...f.serif,fontSize:20,color:c.text}}>
                        {name}
                      </div>
                      <div style={{...f.monoLight,fontSize:12,color:c.dim,marginTop:3}}>
                        {info.stateName} · {info.role}
                      </div>
                    </div>

                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <button
                        onClick={()=>move(i,-1)}
                        style={{
                          ...f.mono,
                          fontSize:11,
                          padding:"7px 9px",
                          borderRadius:9,
                          border:`1px solid ${c.border}`,
                          background:"transparent",
                          color:c.muted,
                          cursor:"pointer"
                        }}
                      >
                        ↑
                      </button>
                      <button
                        onClick={()=>move(i,1)}
                        style={{
                          ...f.mono,
                          fontSize:11,
                          padding:"7px 9px",
                          borderRadius:9,
                          border:`1px solid ${c.border}`,
                          background:"transparent",
                          color:c.muted,
                          cursor:"pointer"
                        }}
                      >
                        ↓
                      </button>
                      <button
                        onClick={()=>removeAt(i)}
                        style={{
                          ...f.mono,
                          fontSize:11,
                          padding:"7px 9px",
                          borderRadius:9,
                          border:`1px solid ${c.border}`,
                          background:"transparent",
                          color:c.dim,
                          cursor:"pointer"
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <InnerPanel>
                  <Mono style={{fontSize:13}}>No demons in chain yet.</Mono>
                </InnerPanel>
              )}
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:14}}>
              <Pill onClick={()=>setChain([])}>Clear</Pill>
              <Pill onClick={()=>setChain(["Tokhatto","Puppo","Uttunul","Lurgo"])}>
                Deep route
              </Pill>
              <Pill onClick={()=>setChain(["Tokhatto","Tchu","Ixix","Duoddod","Lurgo"])}>
                Warp shortcut
              </Pill>
              <Pill onClick={()=>setChain(["Tokhatto","Krako","Katak","Ummnu","Muntuk","Numko","Sukugool","Ixigool","Lurgo"])}>
                Ordeal route
              </Pill>
            </div>
          </Section>

          <Section label="First numeric route preview" style={{marginTop:24}}>
            <svg
              viewBox="0 0 1000 2050"
              preserveAspectRatio="xMidYMid meet"
              style={{
                width:"100%",
                display:"block",
                borderRadius:14,
                background:"#000000",
                marginTop:10
              }}
            >
              <image
                href="/Numogram-blackgreen.jpg"
                x="50"
                y="50"
                width="900"
                height="1950"
                preserveAspectRatio="xMidYMid meet"
              />

              {path && (
                <>
                  <path
                    d={path}
                    fill="none"
                    stroke="#FF6B1A"
                    strokeWidth={22}
                    strokeLinecap="round"
                    strokeOpacity={0.18}
                  />
                  <path
                    d={path}
                    fill="none"
                    stroke="#FF8838"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray="11 9"
                    strokeOpacity={0.95}
                  />
                </>
              )}

              {pts.map((pt,i)=>(
                <g key={`${pt.digit}-${i}`}>
                  <circle cx={pt.x} cy={pt.y} r={13} fill="#FF8838" stroke="#FFFFFF" strokeWidth={2}/>
                  <text
                    x={pt.x}
                    y={pt.y+5}
                    textAnchor="middle"
                    fontSize={13}
                    fill="#0C0C0B"
                    style={{...f.mono,fontWeight:600}}
                  >
                    {pt.digit}
                  </text>
                </g>
              ))}
            </svg>
          </Section>
        </div>
      </Panel>

      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <Panel>
          <div style={{padding:pad}}>
            <Label>Demon sentence</Label>
            <div style={{...f.serif,fontSize:bp.isMobile?26:34,color:c.text,marginTop:10,lineHeight:1.25}}>
              {chain.length ? chain.join(" → ") : "—"}
            </div>

            <div style={{marginTop:18}}>
              <Label>Primary shared kernel</Label>
              <div style={{...f.serif,fontSize:34,color:c.text,marginTop:6}}>
                {analysis.primaryKernel || "—"}
              </div>
            </div>

           <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>
  <Pill active onClick={copyExport}>
    {copied ? "Copied" : "Copy reading"}
  </Pill>
  <Pill active onClick={saveToGrimoire}>
    {savedMsg || "Save to Grimoire"}
  </Pill>
</div>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="State-flow">
              {analysis.stateFlow.length ? (
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                  {analysis.stateFlow.map((x,i)=>(
                    <div key={`${x.demon}-${i}`} style={{
                      display:"flex",
                      alignItems:"center",
                      gap:8,
                      flexWrap:"wrap"
                    }}>
                      <span style={{
                        ...f.mono,
                        fontSize:11,
                        padding:"7px 10px",
                        border:`1px solid ${c.border}`,
                        borderRadius:10,
                        color:c.muted,
                        background:c.bg
                      }}>
                        {x.demon}
                      </span>
                      <span style={{
                        ...f.mono,
                        fontSize:11,
                        padding:"7px 10px",
                        borderRadius:10,
                        color:c.bg,
                        background:x.color
                      }}>
                        {x.stateName}
                      </span>
                      {i < analysis.stateFlow.length-1 && (
                        <span style={{...f.mono,color:c.dim,fontSize:12}}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <InnerPanel><Mono style={{fontSize:13}}>No state-flow yet.</Mono></InnerPanel>
              )}
            </Section>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="Route stack">
              {analysis.routeEntries.length ? (
                analysis.routeEntries.map((entry,i)=>(
                  <ChainRouteCard key={`${entry.demon}-${entry.code}-${i}`} entry={entry}/>
                ))
              ) : (
                <InnerPanel><Mono style={{fontSize:13}}>No route stack yet.</Mono></InnerPanel>
              )}
            </Section>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Section label="Shared fragments">
              {analysis.sharedFragments.length ? (
                analysis.sharedFragments.slice(0,16).map(item=>(
                  <InnerPanel key={item.frag} style={{marginTop:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                      <div>
                        <Label>Fragment · {item.count} hits</Label>
                        <div style={{...f.serif,fontSize:26,color:c.text,marginTop:6}}>
                          {item.frag}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>
                      {item.demons.length ? item.demons.map(e=>(
                        <Pill key={`${item.frag}-${e.demon}`}>
                          {e.demon}
                        </Pill>
                      )) : (
                        <Mono style={{fontSize:12}}>Unregistered fragment</Mono>
                      )}
                    </div>
                  </InnerPanel>
                ))
              ) : (
                <InnerPanel><Mono style={{fontSize:13}}>No repeated fragments yet.</Mono></InnerPanel>
              )}
            </Section>

            <Section label="Shared terminal kernels" style={{marginTop:24}}>
              {analysis.sharedTerminals.length ? (
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                  {analysis.sharedTerminals.slice(0,16).map(x=>(
                    <Pill key={x.terminal} active>
                      {x.terminal} · {x.count}
                    </Pill>
                  ))}
                </div>
              ) : (
                <InnerPanel><Mono style={{fontSize:13}}>No shared terminal kernels yet.</Mono></InnerPanel>
              )}
            </Section>
          </div>
        </Panel>

        <Panel>
          <div style={{padding:pad}}>
            <Label>Dirty reading</Label>
            <div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:12,lineHeight:1.8}}>
              {chain.length ? (
                <>
                  This chain moves through <span style={{color:c.text}}>{analysis.stateSentence || "unregistered state-flow"}</span>.
                  {analysis.primaryKernel
                    ? <> Its primary shared kernel is <span style={{color:c.text}}>{analysis.primaryKernel}</span>, so read the sequence as different demons carrying or transforming the same buried route-pressure.</>
                    : <> No dominant shared kernel has appeared yet, so read this as a looser process-sentence rather than a tight route-family.</>
                  }
                </>
              ) : (
                <>Build a chain to generate a reading.</>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}function Grimoire({bp}){
  const [readings,setReadings]=useState([]);
  const [query,setQuery]=useState("");
  const [tagFilter,setTagFilter]=useState("all");
  const [activeId,setActiveId]=useState(null);
  const [copied,setCopied]=useState(false);
  const pad=bp.isMobile?18:28;

  useEffect(()=>{
    const loaded=loadSavedReadings();
    setReadings(loaded);
    if(loaded[0]) setActiveId(loaded[0].id);
  },[]);

  function persist(next){
    setReadings(next);
    saveReadingsToStorage(next);
  }

  function deleteReading(id){
    const next=readings.filter(r=>r.id!==id);
    persist(next);
    if(activeId===id) setActiveId(next[0]?.id || null);
  }

  async function copyReading(reading){
    try{
      await navigator.clipboard.writeText(reading.exportText || "");
      setCopied(true);
      setTimeout(()=>setCopied(false),1400);
    }catch(e){
      setCopied(false);
    }
  }

  function exportAll(){
    const text=readings.map(r=>r.exportText || "").join("\n\n---\n\n");
    const blob=new Blob([text],{type:"text/plain"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download="synchronisation-atlas-grimoire.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJsonFile(e){
    const file=e.target.files?.[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const parsed=JSON.parse(String(reader.result || "[]"));
        if(Array.isArray(parsed)){
          persist(parsed);
          setActiveId(parsed[0]?.id || null);
        }
      }catch(err){
        alert("Could not import JSON.");
      }
    };
    reader.readAsText(file);
  }

  function exportJson(){
    const blob=new Blob([JSON.stringify(readings,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download="synchronisation-atlas-grimoire.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const tags=uniqueTagsFromReadings(readings);
  const visible=readings.filter(r=>readingMatchesSearch(r,query,tagFilter));
  const active=readings.find(r=>r.id===activeId) || visible[0] || null;

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:bp.isDesktop?"0.9fr 1.1fr":"1fr",
      gap:20,
      alignItems:"start"
    }}>
      <Panel>
        <div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}>
          <div style={{...f.serif,fontSize:bp.isMobile?26:30,color:c.text}}>
            Grimoire
          </div>
          <div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:8,lineHeight:1.7}}>
            Saved chains, project tags, route kernels, and working notes.
          </div>
        </div>

        <div style={{padding:`0 ${pad}px ${pad}px`}}>
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder="Search readings, demons, tags, kernels…"
            style={{
              ...f.mono,
              fontSize:14,
              width:"100%",
              padding:"14px 16px",
              borderRadius:14,
              border:`1px solid ${c.border}`,
              background:c.bg,
              color:c.text,
              outline:"none"
            }}
          />

          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
            <Pill active={tagFilter==="all"} onClick={()=>setTagFilter("all")}>
              All tags
            </Pill>
            {tags.map(t=>(
              <Pill key={t} active={tagFilter===t} onClick={()=>setTagFilter(t)}>
                {t}
              </Pill>
            ))}
          </div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:16}}>
            <Pill onClick={exportAll}>Export TXT</Pill>
            <Pill onClick={exportJson}>Export JSON</Pill>
            <label style={{
              ...f.mono,
              fontSize:12,
              letterSpacing:"0.04em",
              padding:"7px 16px",
              borderRadius:100,
              border:`1px solid ${c.border}`,
              background:"transparent",
              color:c.muted,
              cursor:"pointer"
            }}>
              Import JSON
              <input type="file" accept="application/json" onChange={importJsonFile} style={{display:"none"}}/>
            </label>
          </div>

          <Section label={`Readings · ${visible.length}`} style={{marginTop:24}}>
            <div style={{display:"grid",gap:10,marginTop:10}}>
              {visible.length ? visible.map(r=>(
                <div
                  key={r.id}
                  onClick={()=>setActiveId(r.id)}
                  style={{
                    background:active?.id===r.id?c.raised:c.bg,
                    border:`1px solid ${active?.id===r.id?c.text:c.borderS}`,
                    borderRadius:16,
                    padding:"14px 16px",
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                >
                  <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                    <div>
                      <div style={{...f.serif,fontSize:21,color:c.text}}>
                        {r.name}
                      </div>
                      <div style={{...f.monoLight,fontSize:12,color:c.dim,marginTop:5}}>
                        Kernel: {r.primaryKernel || "—"} · {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{...f.mono,fontSize:11,color:c.dim}}>
                      {(r.chain || []).length} demons
                    </div>
                  </div>

                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
                    {(r.tags || []).map(t=>(
                      <span key={t} style={{
                        ...f.mono,
                        fontSize:10,
                        color:c.bg,
                        background:c.text,
                        padding:"5px 8px",
                        borderRadius:999
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )) : (
                <InnerPanel>
                  <Mono style={{fontSize:13}}>No saved readings yet. Save one from Chain Builder.</Mono>
                </InnerPanel>
              )}
            </div>
          </Section>
        </div>
      </Panel>

      <Panel>
        <div style={{padding:pad}}>
          {active ? (
            <>
              <div style={{display:"flex",justifyContent:"space-between",gap:14,alignItems:"flex-start"}}>
                <div>
                  <Label>Saved reading</Label>
                  <div style={{...f.serif,fontSize:bp.isMobile?30:40,color:c.text,marginTop:8,lineHeight:1.1}}>
                    {active.name}
                  </div>
                  <div style={{...f.monoLight,fontSize:13,color:c.dim,marginTop:10}}>
                    Created {new Date(active.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>
                <Pill active onClick={()=>copyReading(active)}>
                  {copied ? "Copied" : "Copy reading"}
                </Pill>
                <Pill onClick={()=>deleteReading(active.id)}>
                  Delete
                </Pill>
              </div>

              <Section label="Demon sentence" style={{marginTop:28}}>
                <InnerPanel>
                  <div style={{...f.serif,fontSize:24,color:c.text,lineHeight:1.35}}>
                    {(active.chain || []).join(" → ") || "—"}
                  </div>
                </InnerPanel>
              </Section>

              <Section label="Tags" style={{marginTop:22}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
                  {(active.tags || []).length ? active.tags.map(t=>(
                    <Pill key={t} active onClick={()=>setTagFilter(t)}>
                      {t}
                    </Pill>
                  )) : <Mono style={{fontSize:13}}>—</Mono>}
                </div>
              </Section>

              <Section label="Primary kernel" style={{marginTop:22}}>
                <div style={{...f.serif,fontSize:36,color:c.text,marginTop:8}}>
                  {active.primaryKernel || "—"}
                </div>
              </Section>

              <Section label="State-flow" style={{marginTop:22}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                  {(active.stateFlow || []).map((x,i)=>(
                    <div key={`${x.demon}-${i}`} style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{
                        ...f.mono,
                        fontSize:11,
                        padding:"7px 10px",
                        border:`1px solid ${c.border}`,
                        borderRadius:10,
                        color:c.muted,
                        background:c.bg
                      }}>
                        {x.demon}
                      </span>
                      <span style={{
                        ...f.mono,
                        fontSize:11,
                        padding:"7px 10px",
                        borderRadius:10,
                        color:c.bg,
                        background:x.color || c.text
                      }}>
                        {x.stateName}
                      </span>
                      {i < (active.stateFlow || []).length-1 && (
                        <span style={{...f.mono,color:c.dim,fontSize:12}}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>

              <Section label="Notes" style={{marginTop:22}}>
                <InnerPanel>
                  <div style={{...f.monoLight,fontSize:14,color:c.muted,lineHeight:1.8,whiteSpace:"pre-wrap"}}>
                    {active.notes || "—"}
                  </div>
                </InnerPanel>
              </Section>

              <Section label="Route stack" style={{marginTop:22}}>
                {(active.routeEntries || []).length ? active.routeEntries.map((e,i)=>(
                  <InnerPanel key={`${e.demon}-${e.code}-${i}`} style={{marginTop:10}}>
                    <Label>Mesh {e.mesh} · [{e.code}]</Label>
                    <div style={{...f.serif,fontSize:21,color:c.text,marginTop:7}}>
                      {e.demon}
                    </div>
                    <div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:6}}>
                      {e.title}
                    </div>
                  </InnerPanel>
                )) : (
                  <InnerPanel><Mono style={{fontSize:13}}>No route stack.</Mono></InnerPanel>
                )}
              </Section>

              <Section label="Shared fragments" style={{marginTop:22}}>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10}}>
                  {(active.sharedFragments || []).slice(0,16).map(frag=>(
                    <Pill key={frag.frag}>
                      {frag.frag} · {frag.count}
                    </Pill>
                  ))}
                </div>
              </Section>
            </>
          ) : (
            <InnerPanel>
              <div style={{...f.monoLight,fontSize:14,color:c.dim,lineHeight:1.7}}>
                No saved reading selected.
              </div>
            </InnerPanel>
          )}
        </div>
      </Panel>
    </div>
  );
}function PatternFinder({bp}){
  const [readings,setReadings]=useState([]);
  const [tagFilter,setTagFilter]=useState("all");
  const pad=bp.isMobile?18:28;

  useEffect(()=>{
    setReadings(loadSavedReadings());
  },[]);

  const tags=uniqueTagsFromReadings(readings);
  const filtered=tagFilter==="all" ? readings : readings.filter(r=>(r.tags || []).includes(tagFilter));
  const patterns=useMemo(()=>analyzeSavedPatterns(filtered),[filtered]);

  function RankingPanel({label,items,empty="No data yet."}){
    return (
      <Panel>
        <div style={{padding:pad}}>
          <Label>{label}</Label>
          <div style={{display:"grid",gap:10,marginTop:14}}>
            {items.length ? items.slice(0,12).map((item,i)=>(
              <div key={item.name} style={{
                background:c.bg,
                border:`1px solid ${c.borderS}`,
                borderRadius:14,
                padding:"13px 15px"
              }}>
                <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",minWidth:0}}>
                    <span style={{
                      ...f.mono,
                      fontSize:11,
                      width:28,
                      height:28,
                      borderRadius:9,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      background:c.raised,
                      color:c.dim,
                      flexShrink:0
                    }}>
                      {i+1}
                    </span>
                    <span style={{
                      ...f.serif,
                      fontSize:20,
                      color:c.text,
                      overflow:"hidden",
                      textOverflow:"ellipsis"
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <span style={{
                    ...f.mono,
                    fontSize:12,
                    color:c.bg,
                    background:c.text,
                    borderRadius:999,
                    padding:"5px 9px",
                    flexShrink:0
                  }}>
                    {item.count}
                  </span>
                </div>
                <div style={{marginTop:10}}>
                  <Bar value={Math.min(100,(item.count / Math.max(1,items[0].count))*100)} color={c.text}/>
                </div>
              </div>
            )) : (
              <InnerPanel>
                <Mono style={{fontSize:13}}>{empty}</Mono>
              </InnerPanel>
            )}
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <div>
      <Panel style={{marginBottom:20}}>
        <div style={{padding:pad}}>
          <div style={{...f.serif,fontSize:bp.isMobile?28:36,color:c.text}}>
            Pattern Finder
          </div>
          <div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:10,lineHeight:1.7}}>
            Attractor index across saved readings. Finds repeated kernels, demons, states, routes, tags, and state-endings.
          </div>

          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:18}}>
            <Pill active={tagFilter==="all"} onClick={()=>setTagFilter("all")}>
              All readings · {readings.length}
            </Pill>
            {tags.map(t=>(
              <Pill key={t} active={tagFilter===t} onClick={()=>setTagFilter(t)}>
                {t}
              </Pill>
            ))}
          </div>
        </div>
      </Panel>

      <div style={{
        display:"grid",
        gridTemplateColumns:bp.isDesktop?"repeat(3,1fr)":bp.isTablet?"1fr 1fr":"1fr",
        gap:20
      }}>
        <RankingPanel label="Kernels" items={patterns.kernels}/>
        <RankingPanel label="Demons" items={patterns.demons}/>
        <RankingPanel label="Route fragments" items={patterns.fragments}/>
        <RankingPanel label="States" items={patterns.states}/>
        <RankingPanel label="State endings" items={patterns.endings}/>
        <RankingPanel label="Routes" items={patterns.routes}/>
        <RankingPanel label="Tags" items={patterns.tags}/>
      </div>

      <Panel style={{marginTop:20}}>
        <div style={{padding:pad}}>
          <Label>Reading</Label>
          <div style={{...f.monoLight,fontSize:14,color:c.muted,marginTop:12,lineHeight:1.8}}>
            {filtered.length ? (
              <>
                Across <span style={{color:c.text}}>{filtered.length}</span> saved readings,
                the strongest kernel is <span style={{color:c.text}}>{patterns.kernels[0]?.name || "—"}</span>,
                the most recurring demon is <span style={{color:c.text}}>{patterns.demons[0]?.name || "—"}</span>,
                and the strongest state-ending is <span style={{color:c.text}}>{patterns.endings[0]?.name || "—"}</span>.
              </>
            ) : (
              <>Save readings in the Grimoire to generate an attractor index.</>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
// ── DIAGNOSIS WORKBENCH ───────────────────────────────────────────

function DiagnosisWorkbench({onJump,onOpenDemon,bp}){
  const[sel,setSel]=useState([]);const[query,setQuery]=useState("");const result=useMemo(()=>scoreStates(sel,query),[sel,query]);const cur=result.best?states[result.best.stateId]:null;const toggle=s=>setSel(p=>p.includes(s)?p.filter(x=>x!==s):[...p,s]);const pad=bp.isMobile?18:28;
  return<div style={{display:"grid",gridTemplateColumns:bp.isDesktop?"1.1fr 0.9fr":"1fr",gap:20}}>
  <Panel><div style={{padding:`${pad}px ${pad}px ${pad*0.6}px`}}><div style={{...f.serif,fontSize:bp.isMobile?26:28,color:c.text}}>Where am I?</div><div style={{...f.monoLight,fontSize:14,color:c.dim,marginTop:8}}>Mark body-signs and describe the field.</div></div>
  <div style={{padding:`0 ${pad}px ${pad}px`}}><input value={query}onChange={e=>setQuery(e.target.value)}placeholder="dry-eyed, brittle, on a deadline…"style={{...f.mono,fontSize:14,width:"100%",padding:"14px 18px",borderRadius:12,border:`1px solid ${c.border}`,background:c.bg,color:c.text,outline:"none",boxSizing:"border-box"}}/>
  <div style={{marginTop:18,maxHeight:400,overflowY:"auto",background:c.bg,borderRadius:14,padding:14,display:"grid",gridTemplateColumns:bp.isMobile?"1fr":"1fr 1fr",gap:8}}>{allSymptoms.map(s=>{const act=sel.includes(s);return<button key={s}onClick={()=>toggle(s)}style={{...f.monoLight,fontSize:13,padding:"10px 14px",borderRadius:10,textAlign:"left",border:`1px solid ${act?c.text:c.borderS}`,background:act?c.text:"transparent",color:act?c.bg:c.muted,cursor:"pointer",transition:"all 0.2s"}}>{s}</button>;})}</div>
  <button onClick={()=>{setSel([]);setQuery("");}}style={{...f.mono,fontSize:12,marginTop:14,padding:"10px 18px",borderRadius:10,border:`1px solid ${c.border}`,background:"transparent",color:c.dim,cursor:"pointer"}}>Reset</button></div></Panel>
  <Panel><div style={{padding:pad}}>{cur?<><InnerPanel><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><Label>{cur.region}</Label><div style={{...f.serif,fontSize:bp.isMobile?28:36,color:c.text,marginTop:4}}>{cur.name}</div><div style={{...f.monoLight,fontSize:13,color:c.muted,marginTop:8}}>{cur.signature}</div></div><div style={{width:12,height:12,borderRadius:"50%",background:cur.color,marginTop:8,flexShrink:0}}/></div><div style={{marginTop:18}}><Bar value={result.confidence}color={cur.color}/><Mono style={{fontSize:12,marginTop:8,display:"block"}}>Confidence: {result.confidence}%</Mono></div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:16}}>{cur.demons.slice(0,6).map(d=><Pill key={d}onClick={()=>onOpenDemon(d)}>{d}</Pill>)}</div><Pill onClick={()=>onJump(cur.id)}color={cur.color}active style={{marginTop:16}}>Open {cur.name}</Pill></InnerPanel>
  {result.second&&<InnerPanel style={{marginTop:12}}><Mono style={{fontSize:13}}>Secondary pull: <span style={{color:c.text}}>{states[result.second.stateId].name}</span></Mono></InnerPanel>}
  <Section label="Likely flow"style={{marginTop:24}}>{cur.likelyNext.slice(0,3).map(n=>{const t=states[n.target];return<div key={n.target}onClick={()=>onJump(n.target)}style={{background:c.bg,borderRadius:12,padding:"14px 16px",marginTop:8,cursor:"pointer",transition:"background 0.2s"}}onMouseEnter={e=>e.currentTarget.style.background=c.raised}onMouseLeave={e=>e.currentTarget.style.background=c.bg}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{...f.serif,fontSize:17,color:c.text}}>{t.name}</span><span style={{...f.mono,fontSize:11,color:c.dim}}>{n.label}</span></div></div>;})}</Section>
  </>:<InnerPanel><div style={{...f.monoLight,fontSize:14,color:c.dim,lineHeight:1.7}}>Select symptoms or describe the field and the atlas will estimate the state.</div></InnerPanel>}</div></Panel></div>;
}

// ── MAIN APP ──────────────────────────────────────────────────────

const footerSignals=[

  "Local Time",

  "Root-time active",

  "Signal before demand",

  "Interpret later",

  "Do not force total answer",

  "Thaw, not wake",

  "The basin is holding",

  "Grace before explanation"

];
export default function App(){
const bp=useBreakpoint();
const[activeState,setActiveState]=useState("beginning");
const[activeDemon,setActiveDemon]=useState("Lurgo");
const[stateFilter,setStateFilter]=useState("all");
const[learnMode,setLearnMode]=useState(false);
const[journey,setJourney]=useState(["Lurgo"]);
const[activeTab,setActiveTab]=useState("atlas");

const[mapView,setMapView]=useState("topology");
const[showStateFields,setShowStateFields]=useState(true);
const[hoverDemon,setHoverDemon]=useState(null);
const[traceDemon,setTraceDemon]=useState(null);
const[notes,setNotes]=useState([]);
const[constellationMode,setConstellationMode]=useState(false);
const[selectedConstellation,setSelectedConstellation]=useState([]);
const[footerIndex,setFooterIndex]=useState(0);  useEffect(()=>{if(learnMode)setJourney(p=>p[p.length-1]===activeDemon?p:[...p,activeDemon]);},[activeDemon,learnMode]);
  useEffect(()=>{if(learnMode)setJourney([activeDemon]);},[learnMode]);
  useEffect(()=>{

  const t=setInterval(()=>setFooterIndex(i=>(i+1)%footerSignals.length),5000);

  return()=>clearInterval(t);

},[]);

  const handleSelectDemon=useCallback((id,force=false)=>{if(!learnMode||force){setActiveDemon(id);return;}const cur=demonGraph.find(d=>d.id===activeDemon);if(!cur){setActiveDemon(id);return;}const inc=demonGraph.filter(d=>d.links.includes(cur.id)).map(d=>d.id);const allowed=new Set([cur.id,...cur.links,...inc]);if(allowed.has(id))setActiveDemon(id);},[activeDemon,learnMode]);
 const mainPad=bp.isMobile?14:bp.isTablet?24:48;
const mainGrid=bp.isDesktop?"1.1fr 0.9fr":"1fr";

  return<><link href={fontUrl}rel="stylesheet"/><style>{`*{box-sizing:border-box;margin:0;padding:0}body{background:${c.bg}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${c.border};border-radius:3px}::selection{background:${c.text}22}select option{background:${c.surface};color:${c.text}}`}</style>
  <div style={{minHeight:"100vh",color:c.text,background:c.bg,...f.monoLight}}>
    <div style={{position:"fixed",inset:0,pointerEvents:"none",opacity:0.025,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,backgroundRepeat:"repeat"}}/>
<div style={{maxWidth:activeTab==="demons"?1760:1440,margin:"0 auto",padding:`${mainPad*1.2}px ${mainPad}px`}}>
      {/* Header */}
      <div style={{marginBottom:bp.isMobile?32:56}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}><span style={{...f.mono,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:c.dim,padding:"5px 12px",border:`1px solid ${c.border}`,borderRadius:4}}>Synchronisation Atlas</span><span style={{...f.mono,fontSize:11,color:c.dim}}>v4</span></div>
        <h1 style={{...f.serif,fontSize:bp.isMobile?36:bp.isTablet?48:60,fontWeight:400,color:c.text,lineHeight:1.05,letterSpacing:"-0.02em",maxWidth:780}}>Temporal topology{bp.isMobile?" ":<br/>}& demon flow</h1>
        <p style={{...f.monoLight,fontSize:bp.isMobile?14:15,color:c.dim,marginTop:18,maxWidth:580,lineHeight:1.8}}>State fields, recursive routes, demon traffic, and numogram rite layers. Ten states of local time production. Forty-five demons.</p>
      </div>
      <div style={{marginBottom:bp.isMobile?24:36}}><TabBar active={activeTab}onChange={setActiveTab}bp={bp}/></div>

      {activeTab==="atlas"&&<div style={{display:"grid",gridTemplateColumns:mainGrid,gap:20}}><StateMap activeState={activeState}onSelect={setActiveState}bp={bp}/><StateInspector stateId={activeState}onJump={setActiveState}onOpenDemon={d=>{setActiveDemon(d);setActiveTab("demons");}}bp={bp}/></div>}

      {activeTab==="demons"&&<div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,flexWrap:"wrap"}}>
          <select value={stateFilter}onChange={e=>setStateFilter(e.target.value)}style={{...f.mono,fontSize:13,padding:"10px 16px",borderRadius:10,border:`1px solid ${c.border}`,background:c.surface,color:c.text,outline:"none"}}><option value="all">All demons</option><option value="native">Native</option><option value="bridge">Bridge</option><option value="support">Support</option><option value="shadow">Shadow</option>{Object.values(states).map(s=><option key={s.id}value={s.id}>{s.name}</option>)}</select>
          <Pill active={learnMode}onClick={()=>setLearnMode(v=>!v)}>{learnMode?"Learn mode":"Free roam"}</Pill>
          {learnMode&&journey.length>1&&<><Pill onClick={()=>{setJourney(p=>{const next=p.slice(0,-1);setActiveDemon(next[next.length-1]);return next;});}}>&larr; Back</Pill><Pill onClick={()=>{setJourney([journey[0]]);setActiveDemon(journey[0]);}}>Reset</Pill></>}
        </div>
        {learnMode&&<InnerPanel style={{marginBottom:24}}><Label>Journey</Label><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{journey.map((d,i)=><Pill key={`${d}-${i}`}active={i===journey.length-1}onClick={()=>handleSelectDemon(d,true)}>{d}</Pill>)}</div></InnerPanel>}
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
  <DemonConstellation
    selectedDemon={activeDemon}
    onSelectDemon={handleSelectDemon}
    stateFilter={stateFilter}
    onStateJump={setActiveState}
    learnMode={learnMode}
    bp={bp}
  />

  <DemonInspector
    demonName={activeDemon}
    onOpenState={id=>{setActiveState(id);setActiveTab("atlas");}}
    onOpenDemon={handleSelectDemon}
    bp={bp}
  />
</div>
      </div>}

{activeTab==="routes"&&<NumogramRoutesLab bp={bp}/>}
{activeTab==="cipher"&&<CipherLab bp={bp}/>}
{activeTab==="compare"&&<CompareLab bp={bp}/>}
{activeTab==="chain"&&<ChainBuilder bp={bp}/>}
{activeTab==="grimoire"&&<Grimoire bp={bp}/>}
{activeTab==="patterns"&&<PatternFinder bp={bp}/>}
{activeTab==="diagnosis"&&<DiagnosisWorkbench onJump={id=>{setActiveState(id);setActiveTab("atlas");}}onOpenDemon={d=>{setActiveDemon(d);setActiveTab("demons");}}bp={bp}/>}
      <div style={{marginTop:bp.isMobile?40:72,paddingTop:24,borderTop:`1px solid ${c.borderS}`,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}><Mono style={{fontSize:11,color:c.dim}}>Synchronisation Atlas · Pooh Sticks</Mono><Mono style={{fontSize:11,color:c.dim}}>{footerSignals[footerIndex]}</Mono></div>
    </div>
  </div></>;
}