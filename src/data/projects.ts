import type { ProjectArchive } from "@/types";

export const projects: ProjectArchive[] = [
  {
    id: "pixel-world",
    title: "Pixel World",
    oneLiner: "Begin with one creative premise and end with a reviewed specification, cohesive assets, playable levels, local saves, and a complete game you can take offline.",
    category: "Multi-Agent Creation System · Playable AI Product",
    period: "Sep 2025–Feb 2026 · Independent Product",
    status: "Live · Iterating",
    featured: true,
    context:
      "Pixel World treats game generation as a complete production pipeline, not a single prompt. Creators first define the premise and boundaries. Ten specialist agents then plan and cross-review the work, while one approved GameSpec drives the assets, levels, runtime rules, saves, and final delivery.",
    problem:
      "A generated game must keep its story, mechanics, art, levels, assets, costs, and runtime rules in sync. Creators also need to see conflicts, approve high-cost generation, retry failed tasks individually, and retain ownership of the result.",
    role:
      "I independently led product design and full-stack development: user research, GameSpec V3, agent roles and review contracts, model-platform routing, asset orchestration, interface design, a custom 2D runtime, local persistence, and offline export.",
    process: [
      "Turn the title, story, level count, and non-negotiable rules into an editable GameSpec V3.",
      "Ten agents collaborate across direction, narrative, mechanics, art, levels, integration, consistency, engine checks, revision, and asset coordination.",
      "Cross-review before generation, expose blocking issues, and wait for creator approval before spending credits.",
      "Generate assets across multiple model platforms while locking each project to one consistent visual model.",
      "Let the approved spec drive a playable runtime, then validate saving, reopening, and offline ZIP export.",
    ],
    keyDecisions: [
      "Agent output remains a proposal until the creator approves it.",
      "Agent and asset tasks can be retried independently without erasing completed work.",
      "Planning models and image models remain separate, while each project follows one locked visual direction.",
      "The finish line is inspectable, recoverable, playable, saveable, and portable—not merely a polished preview image.",
    ],
    technology: [
      "Next.js 15", "React 19", "TypeScript", "Zustand", "Multi-agent orchestration", "GameSpec V3",
      "OpenRouter", "OpenAI", "Alibaba DashScope", "Cloudflare Workers AI", "IndexedDB", "Web Audio", "Offline ZIP",
    ],
    challenges: [
      "Preserve explicit creator decisions across a ten-agent workflow.",
      "Unify regional settings, credentials, billing, and failure states across platforms.",
      "Maintain visual consistency across a large number of retryable assets.",
      "Turn generated rules and images into a stable keyboard-and-touch game.",
    ],
    outcome:
      "The generated world takes over the product cover and becomes a playable level. The game can be saved locally or exported as an offline ZIP.",
    screenshots: [
      "/portfolio/pixel-world-v5-platform-overview.png",
      "/portfolio/pixel-world-v5-agent-studio.png",
      "/portfolio/pixel-world-v5-asset-system.png",
      "/portfolio/pixel-world-v5-gameplay-level-1.png",
    ],
    github: "https://github.com/zbjgrhr/PIXEL-WORLD",
    liveDemo: "https://pixel-world-silk.vercel.app/",
    learned: [
      "A multi-agent workflow should make ownership, review order, cost, and failure visible.",
      "A generated world is not complete until it can be inspected, played, saved, and taken away.",
    ],
    metrics: [
      { value: "10", label: "specialist agents" },
      { value: "About 80", label: "survey responses" },
      { value: "About 15", label: "in-depth interviews" },
      { value: "20–30", label: "playtest participants" },
    ],
  },
  {
    id: "preservative",
    title: "Preservative",
    oneLiner: "A published Project Zomboid mod that turns food preservation into a configurable risk–reward system with visible poisoning and treatment feedback.",
    category: "Game Systems · Published Steam Workshop Mod",
    period: "Sep–Oct 2026 · Independent Mod",
    status: "Published · Build 42",
    featured: true,
    context:
      "Preservative extends Project Zomboid's food-survival loop. A bottle can protect food in inventories, nested containers, vehicle storage, refrigerators, freezers, or a configurable ground radius; a separate global setting can tune spoilage across the world.",
    problem:
      "Preservation can easily erase survival pressure. The system needed to remain useful without becoming a free shortcut, communicate hidden time and efficiency rules, and turn accidental consumption into a readable, treatable risk.",
    role:
      "I independently designed, implemented, tested, documented, localized, branded, and published the mod, then maintained its Steam Workshop page and player-facing configuration guidance.",
    process: [
      "Translate a real survival pain point into local-container and global-preservation rules.",
      "Expose efficiency, duration, spawn rate, refrigeration support, poisoning, and treatment guidance as sandbox settings.",
      "Add hover information, a red status icon, a six-hour countdown, and explicit antidote feedback.",
      "Publish a bilingual Workshop page and iterate against player questions and use.",
    ],
    keyDecisions: [
      "Consume duration only while food is actually being protected.",
      "Keep poisoning lethal but treatable, so convenience creates a clear survival trade-off.",
      "Make server and solo rules configurable instead of enforcing one balance profile.",
      "Show remaining duration, protection strength, and danger at the moment of decision.",
    ],
    technology: ["Project Zomboid Build 42", "Sandbox options", "Inventory and status UI", "Steam Workshop", "CN / EN documentation", "Post-launch community feedback"],
    challenges: [
      "Protect food across nested inventories and vehicle storage.",
      "Keep local and world-wide preservation settings understandable.",
      "Communicate poisoning urgency without replacing the game's visual language.",
    ],
    outcome:
      "The released mod reached 4,431 unique visitors, 1,480 current subscribers, and 182 favorites, with discussion and comment threads providing real post-launch feedback.",
    screenshots: [
      "/portfolio/preservative-01-concept-approved.png",
      "/portfolio/preservative-02-workshop.png",
      "/portfolio/preservative-03-sandbox.png",
    ],
    liveDemo: "https://steamcommunity.com/sharedfiles/filedetails/?id=3814649025",
    learned: [
      "A survival convenience remains interesting when its cost is legible, configurable, and recoverable through play.",
      "Publishing turns system design into an ongoing conversation with real players.",
    ],
    metrics: [
      { value: "4,431", label: "unique visitors" },
      { value: "1,480", label: "current subscribers" },
      { value: "182", label: "favorites" },
      { value: "14", label: "discussions + comments" },
    ],
  },
  {
    id: "rainy-arcade",
    title: "Rainy Night Arcade",
    oneLiner: "A narrative arcade that shifts between genres while quietly turning player behavior into a locally stored, exportable experience report.",
    category: "Narrative Game Design · Local Player Analytics",
    period: "Jun–Sep 2026 · Independent Game",
    status: "v0.7.0 · Two Complete Worlds",
    featured: true,
    context:
      "Rainy Night Arcade connects different worlds through one late-night frame. Block City combines path repair, object recognition, evidence checking, and spatial assembly. Rain City combines ticket reconstruction, watch repair, rule-based reasoning, failure loops, and departure.",
    problem:
      "The game must preserve emotional continuity as its mechanics change, while leaving useful evidence for playtest iteration. The entire project also needs to remain statically deployable and playable offline, with no account or server required.",
    role:
      "I led the game design, world and narrative structure, puzzle systems, and interaction flow. I also set the visual direction, integrated audio, verified implementation, ran regression checks, and designed and built the local analytics layer for v0.7.",
    process: [
      "Use one rainy-night arcade to frame every cabinet, while giving each world its own emotional question and interaction language.",
      "Block City begins by reconnecting a road, then reconstructs a home through objects, memories, and spatial clues.",
      "Rain City revolves around false rules, looping time, and a torn ticket. Observation is the only way out.",
      "Store only anonymous counts, stage entries, hints, retries, duration, and completion status in localStorage.",
      "Generate a four-dimensional entertainment profile, while letting the developer page aggregate anonymous JSON files entirely on-device.",
    ],
    keyDecisions: [
      "State the completed scope clearly: Block City and Rain City are playable; Library City and Sea-Island City remain planned.",
      "Preserve the original story and puzzles, adding analytics only as an optional layer.",
      "Collect no names, email addresses, IP addresses, device identifiers, or raw dialogue.",
      "Reports leave the device only when the player chooses to export them; developer aggregation also happens entirely on-device.",
    ],
    technology: ["HTML", "CSS", "Vanilla JavaScript", "LocalStorage", "Web Audio", "Anonymous JSON export", "CSV aggregation", "Static hosting"],
    challenges: [
      "Keep path repair, evidence reasoning, assembly, and rule-horror within one coherent atmosphere.",
      "Let music and rain shape the reading rhythm.",
      "Draw useful feedback from local behavioral signals without overreaching into pseudo-psychological assessment.",
    ],
    outcome:
      "An offline-ready, two-world narrative game with persistent progress, complete audio, 22 regression checks, optional player profiles, and a developer observatory that can import multiple anonymous reports.",
    screenshots: [
      "/portfolio/rain-arcade-hero.png",
      "/portfolio/rain-arcade-hall.png",
      "/portfolio/rain-player-profile.png",
      "/portfolio/rain-developer-analytics.png",
    ],
    liveDemo: "https://grid-wmkf.upma.site/",
    learned: [
      "A shared framework can hold very different mechanics—provided each world fulfills one clear emotional promise.",
      "When data stays local, minimal, and inspectable, analytics can support design without becoming surveillance.",
    ],
    metrics: [
      { value: "2", label: "complete playable worlds" },
      { value: "128", label: "Rain City confirmation texts" },
      { value: "22", label: "regression checks" },
      { value: "0", label: "pieces of personally identifiable information" },
    ],
  },
  {
    id: "iwbtz",
    title: "I Wanna Be the Zomboy",
    oneLiner: "A hardcore platformer that combines traps, bosses, and character customization—turning “refusing to be defined” into a series of obstacles the player crosses firsthand.",
    category: "Game Design · Hardcore 2D Platformer",
    period: "Apr–Sep 2025 · Master’s Graduation Project",
    status: "Playable Prototype · 7 Levels + 4 Boss Battles",
    featured: true,
    context:
      "Inspired by I Wanna Be the Guy and Plants vs. Zombies, the project traces a path through childhood, school, social pressure, and self-acceptance. Each jump carries both a mechanical challenge and an emotional metaphor, while DYOC lets players recombine the protagonist’s appearance.",
    problem:
      "A hardcore platformer depends on precise control, readable failure, and a fair restart rhythm. The project also explores how generative AI can expand character variation without making the game dependent on a network connection.",
    role:
      "I led the game concept, narrative and level planning, boss behaviors, progression systems, and dynamic difficulty. I implemented the game in GameMaker, integrated an AI-assisted DYOC workflow, organized playtests, and drove iteration.",
    process: [
      "Connect seven standard levels into a narrative arc from external labels to self-acceptance.",
      "Design four boss battles, adding a new attack language each time health drops by 25%.",
      "Implement platforms, room transitions, saves, settings, audio, weather particles, and interface systems.",
      "Give DYOC both a fully random local path and an online AI path, with automatic fallback to local generation when offline.",
      "Shorten text after playtesting, move essential narrative into the main levels, and make the tutorial more relevant to the core mechanics.",
    ],
    keyDecisions: [
      "Treat restart speed and attack readability as part of difficulty design.",
      "Escalate boss phases by layering patterns, not simply increasing damage.",
      "Let randomization, AI, saves, and previews share one character-part model.",
      "AI is an optional enhancement; the offline route always remains available.",
    ],
    technology: ["GameMaker", "GML", "2D platform systems", "Boss state machines", "Particle weather", "HTTP API", "Offline fallback", "Save system"],
    challenges: [
      "Balance precision and clarity across dense traps and bullet patterns.",
      "Connect narrative progression to the mechanical difficulty curve.",
      "Make AI-generated parts compatible with the existing character-asset library.",
    ],
    outcome:
      "A playable graduation-project prototype with seven standard levels, four boss battles, multiple themed environments, saved character parts, and AI-assisted customization—with character generation still available offline.",
    screenshots: [
      "/portfolio/iwbtz-menu.png",
      "/portfolio/iwbtz-stage-select.png",
      "/portfolio/iwbtz-level-city.png",
      "/portfolio/iwbtz-dyoc-result.png",
    ],
    learned: [
      "High difficulty feels fair only when failure is legible and control returns quickly.",
      "Customization becomes a real system when generation, validation, preview, and saving share the same data contract.",
    ],
    metrics: [
      { value: "7", label: "standard levels" },
      { value: "4", label: "boss battles" },
      { value: "15+", label: "playtesters" },
      { value: "+25%", label: "increase in willingness to keep playing after iteration" },
    ],
  },
  {
    id: "auto-tune",
    title: "Auto Tune",
    oneLiner: "A Manifest V3 extension that presents both the mechanics and the limits of browser-based social media automation honestly.",
    category: "Browser Automation · Cross-Platform Prototype",
    period: "Jun–Sep 2026 · Independent Project",
    status: "Working Prototype · Chrome / Edge",
    context:
      "Auto Tune explores how one extension can support X, Facebook, and Instagram while keeping platform-specific page logic inside separate adapters. It supports editable random drafts in Chinese and English, posting from the current tab, local state, and delayed automatic replies on X only.",
    problem:
      "Each platform has a different editor and page lifecycle. If the copy promises more than the software can do, the automation itself becomes a risk.",
    role:
      "I defined the product boundaries and built the extension architecture, shared state, platform adapters, local persistence, bilingual controls, and implementation tests.",
    process: [
      "Build a shared extension core while isolating each platform’s DOM selectors and activation rules.",
      "Generate editable random drafts in Chinese or English from the control panel.",
      "Let START detect the current supported tab and complete the post.",
      "Limit AUTO REPLY to X, using fixed text and a random delay of 1–30 seconds.",
    ],
    keyDecisions: [
      "Clearly separate START from AUTO REPLY so the product never implies that every platform supports automatic replies.",
      "Store preferences and working state only in the local browser.",
      "State supported platforms and current limitations openly in both the interface and documentation.",
    ],
    technology: ["Chrome Extension MV3", "JavaScript", "Content scripts", "Service worker", "DOM adapters", "Local browser storage"],
    challenges: ["Platform DOM changes", "Editable-region detection", "Synchronization between background and page state", "Define responsible product boundaries for automation"],
    outcome:
      "A working Chrome and Edge prototype showing that cross-platform posting logic can be shared, while clearly labeling delayed replies as an X-only feature.",
    screenshots: [
      "/portfolio/auto-tune-control-panel.png",
      "/portfolio/auto-tune-adapters.png",
      "/portfolio/auto-tune-x-reply.png",
    ],
    github: "https://github.com/zbjgrhr/Social-Media_Auto-Reply",
    learned: [
      "Automation copy must be as precise as the capability it describes.",
      "Shared state reduces duplicate logic, but platform-specific failures still need explicit handling.",
    ],
  },
  {
    id: "study-assistant",
    title: "Literature Research Assistant",
    oneLiner: "A cross-browser workspace that keeps translation, highlighting, notes, local documents, mind maps, and focus timing beside the source material.",
    category: "Browser Product · Research Workflow",
    period: "Independent Project",
    status: "Working Extension · Chrome / Edge / Firefox",
    context:
      "Literature review is easily fragmented across translators, note apps, timers, document readers, and mind-mapping tools. This extension brings the workflow into an isolated panel while preserving the relationship between every saved item and its source page.",
    problem:
      "Highlights must survive refreshes and asynchronous DOM changes without breaking the host page. The same workflow also needs cross-browser support for local PDF, DOCX, HTML, and TXT files.",
    role:
      "I led product definition, information architecture, extension development, highlight recovery, the local document reader, translation routing, and compatibility design.",
    process: [
      "Bring text selection, translation, highlighting, phrase collection, notes, and a timer into one Shadow DOM panel.",
      "Save page-linked data locally and restore annotations through DOM paths with text-based fallback.",
      "Watch for delayed page changes, then retry highlight restoration.",
      "Provide local readers for PDF, DOCX, HTML, and TXT, plus page-linked mind maps.",
    ],
    keyDecisions: [
      "Isolate interface styles with Shadow DOM.",
      "Keep page changes visible and reversible.",
      "Establish stable page identities for websites, file URLs, and the local reader.",
      "Support multiple translation services instead of locking the product to one API.",
    ],
    technology: ["Chrome / Edge / Firefox extensions", "Manifest V3", "Shadow DOM", "DOM Range", "MutationObserver", "PDF.js", "Mammoth", "Local storage"],
    challenges: ["Restore highlights after nodes are replaced.", "Prevent CSS and stacking-context conflicts.", "Unify local and remote page identity.", "Maintain cross-browser builds."],
    outcome:
      "A practical research-reading companion that connects reading, translation, annotation, phrase collection, notes, focus time, local documents, and knowledge structures—without making readers leave the source.",
    screenshots: [
      "/portfolio/literature-workspace.png",
      "/portfolio/literature-reading-loop.png",
      "/portfolio/literature-installed.png",
      "/portfolio/literature-search.png",
      "/portfolio/literature-saved-library.png",
      "/portfolio/literature-saved-notes.png",
      "/portfolio/literature-translation-highlight.png",
      "/portfolio/literature-mind-map.png",
    ],
    github: "https://github.com/zbjgrhr/web-translate-highlight-mind-map-notes-timer",
    learned: [
      "Persistence is part of the reading experience, not merely a storage problem.",
      "Browser tools earn trust when users can see, undo, and restore the changes made to a page.",
    ],
  },
];

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}
