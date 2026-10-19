import type { ProjectArchive } from "@/types";

export const projects: ProjectArchive[] = [
  {
    id: "pixel-world",
    title: "Pixel World",
    oneLiner: "From a first idea to a world you can actually play: ten agents help shape the plan, while the creator keeps the final say.",
    category: "Multi-Agent Creation System · Playable AI Product",
    period: "Sep 2025–Feb 2026 · Independent Product",
    status: "Live · Iterating",
    featured: true,
    context:
      "Pixel World follows an idea beyond the first prompt. The creator sets its story and boundaries; ten specialist agents develop and review a shared GameSpec. Once approved, that specification guides the art, levels, runtime, saves, and export.",
    problem:
      "A generated game must keep its story, mechanics, art, levels, assets, costs, and runtime rules in sync. Creators also need to see conflicts, approve high-cost generation, retry failed tasks individually, and retain ownership of the result.",
    role:
      "I designed and built the product end to end, from user research and the agent review flow to model routing, asset generation, the 2D runtime, local saves, and offline export.",
    process: [
      "Shape the title, story, level count, and firm rules into an editable GameSpec V3.",
      "Let ten agents plan across narrative, mechanics, art, levels, integration, and quality checks.",
      "Show conflicts before generation and ask for the creator's approval before spending credits.",
      "Generate assets across model platforms while keeping one visual direction within each project.",
      "Build a playable level from the approved spec, then test saving, reopening, and offline ZIP export.",
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
      "The approved world becomes both the product's cover and a playable level. Creators can save their game locally or take it away as an offline ZIP.",
    screenshots: [
      "/map-preview/curated/pixel-world-01.webp",
      "/map-preview/curated/pixel-world-02.webp",
      "/map-preview/curated/pixel-world-03.webp",
      "/map-preview/curated/pixel-world-04.webp",
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
    oneLiner: "A Project Zomboid mod that helps food last longer without making survival free of consequence.",
    category: "Game Systems · Published Steam Workshop Mod",
    period: "Sep–Oct 2026 · Independent Mod",
    status: "Published · Build 42",
    featured: true,
    context:
      "Preservative adds another choice to Project Zomboid's food-survival loop. A bottle can protect food in inventories, vehicles, cold storage, and a configurable area on the ground. A separate world setting adjusts spoilage more broadly.",
    problem:
      "Preservation can easily erase survival pressure. The system needed to remain useful without becoming a free shortcut, communicate hidden time and efficiency rules, and turn accidental consumption into a readable, treatable risk.",
    role:
      "I designed and built the mod, tested its rules, wrote the Chinese and English guidance, created its visual identity, and published it on Steam Workshop. I continue to maintain its page and configuration notes.",
    process: [
      "Turn a familiar survival problem into local-container and world-wide preservation rules.",
      "Make strength, duration, spawn rate, refrigeration, and poisoning configurable in sandbox settings.",
      "Show remaining protection and danger where players need them: on hover, in status icons, and through a six-hour treatment countdown.",
      "Publish bilingual guidance and refine it in response to player questions.",
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
      "The released mod reached 4,431 unique visitors, 1,480 current subscribers, and 182 favorites. Workshop discussions and comments now inform its ongoing maintenance.",
    screenshots: [
      "/map-preview/curated/preservative-01.webp",
      "/map-preview/curated/preservative-02.webp",
      "/map-preview/curated/preservative-03.webp",
      "/map-preview/curated/preservative-04.webp",
    ],
    liveDemo: "https://just-pxmi.upma.site/",
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
    oneLiner: "Two very different stories live inside one rain-soaked arcade, with optional, locally stored play reports to support iteration.",
    category: "Narrative Game Design · Local Player Analytics",
    period: "Jun–Sep 2026 · Independent Game",
    status: "v0.7.0 · Two Complete Worlds",
    featured: true,
    context:
      "A late-night arcade holds the worlds together without asking them to feel alike. In Block City, players piece a home back together through roads, objects, and memories. In Rain City, a broken ticket and an unreliable set of rules turn observation into the way out.",
    problem:
      "The game must preserve emotional continuity as its mechanics change, while leaving useful evidence for playtest iteration. The entire project also needs to remain statically deployable and playable offline, with no account or server required.",
    role:
      "I led the narrative, puzzle, and interaction design; set the visual direction; integrated audio; and tested the game. For v0.7, I also designed and built the local play-report system.",
    process: [
      "Give each cabinet a distinct emotional question and way of playing, within one shared rainy-night frame.",
      "Build Block City around repaired roads, remembered objects, and spatial clues.",
      "Let Rain City's false rules, looping time, and torn ticket reward careful observation.",
      "Keep anonymous counts, stage entries, hints, retries, duration, and completion status in localStorage.",
      "Let players export a four-dimensional play profile; let developers combine anonymous reports on their own device.",
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
      "Block City and Rain City are playable offline, with saved progress, complete audio, and 22 regression checks. Players may export their own report; the developer view can compare anonymous reports locally.",
    screenshots: [
      "/map-preview/curated/rainy-arcade-01.webp",
      "/map-preview/curated/rainy-arcade-02.webp",
      "/map-preview/curated/rainy-arcade-03.webp",
      "/map-preview/curated/rainy-arcade-04.webp",
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
    oneLiner: "A demanding platformer where traps, boss battles, and a changeable hero carry a story about refusing other people's labels.",
    category: "Game Design · Hardcore 2D Platformer",
    period: "Apr–Sep 2025 · Master’s Graduation Project",
    status: "Playable Prototype · 7 Levels + 4 Boss Battles",
    featured: true,
    context:
      "Inspired by I Wanna Be the Guy and Plants vs. Zombies, this graduation project moves through childhood, school, social pressure, and self-acceptance. The challenge is deliberately sharp, but the story is personal: the player can rebuild the hero's appearance through DYOC rather than accept a fixed identity.",
    problem:
      "A hardcore platformer depends on precise control, readable failure, and a fair restart rhythm. The project also explores how generative AI can expand character variation without making the game dependent on a network connection.",
    role:
      "I shaped the concept, story, levels, boss behavior, progression, and difficulty. I built the game in GameMaker, added AI-assisted DYOC, organized playtests, and used the findings to revise the experience.",
    process: [
      "Carry a story of outside labels and self-acceptance through seven standard levels.",
      "Build four bosses whose attack patterns grow whenever their health falls by another 25%.",
      "Implement movement, rooms, saves, settings, audio, weather effects, and the interface in GameMaker.",
      "Offer both local randomization and online AI for DYOC, with a local fallback when offline.",
      "After playtesting, shorten the text, move essential story beats into the levels, and tighten the tutorial.",
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
      "The playable graduation prototype has seven standard levels, four bosses, varied environments, and saved character parts. Character creation still works without a network connection.",
    screenshots: [
      "/map-preview/curated/iwbtz-01.webp",
      "/map-preview/curated/iwbtz-02.webp",
      "/map-preview/curated/iwbtz-03.webp",
      "/map-preview/curated/iwbtz-04.webp",
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
    oneLiner: "A browser extension prototype that makes posting across three platforms easier, while keeping its limits plain to see.",
    category: "Browser Automation · Cross-Platform Prototype",
    period: "Jun–Sep 2026 · Independent Project",
    status: "Working Prototype · Chrome / Edge",
    context:
      "Auto Tune brings X, Facebook, and Instagram into one extension without pretending their editors work the same way. Drafts remain editable in Chinese or English, posting acts on the current tab, and delayed automatic replies are available only on X.",
    problem:
      "Each platform has a different editor and page lifecycle. If the copy promises more than the software can do, the automation itself becomes a risk.",
    role:
      "I defined what the tool should—and should not—promise, then built its shared extension core, platform adapters, local state, bilingual controls, and tests.",
    process: [
      "Share the extension's core logic while keeping each platform's page selectors in its own adapter.",
      "Show editable Chinese or English drafts before any action is taken.",
      "Use START to identify the current supported tab and submit the post.",
      "Keep AUTO REPLY specific to X, with fixed text and a random delay of 1–30 seconds.",
    ],
    keyDecisions: [
      "Clearly separate START from AUTO REPLY so the product never implies that every platform supports automatic replies.",
      "Store preferences and working state only in the local browser.",
      "State supported platforms and current limitations openly in both the interface and documentation.",
    ],
    technology: ["Chrome Extension MV3", "JavaScript", "Content scripts", "Service worker", "DOM adapters", "Local browser storage"],
    challenges: ["Platform DOM changes", "Editable-region detection", "Synchronization between background and page state", "Define responsible product boundaries for automation"],
    outcome:
      "The Chrome and Edge prototype shares posting logic across three sites, with delayed replies clearly marked as an X-only feature.",
    screenshots: [
      "/map-preview/curated/auto-tune-01.webp",
      "/map-preview/curated/auto-tune-02.webp",
      "/map-preview/curated/auto-tune-03.webp",
    ],
    github: "https://github.com/zbjgrhr/Auto_Tune",
    download: "/downloads/auto-tune-extension.zip",
    learned: [
      "Automation copy must be as precise as the capability it describes.",
      "Shared state reduces duplicate logic, but platform-specific failures still need explicit handling.",
    ],
  },
  {
    id: "study-assistant",
    title: "Literature Research Assistant",
    oneLiner: "A reading companion that keeps translations, highlights, notes, and mind maps close to the page that gave rise to them.",
    category: "Browser Product · Research Workflow",
    period: "Independent Project",
    status: "Working Extension · Chrome / Edge / Firefox",
    context:
      "Research rarely happens in one tab: a sentence is translated, a passage is marked, a note is written, and its source is easily lost. This extension keeps those actions beside the page in one isolated panel, with saved work linked back to where it began.",
    problem:
      "Highlights must survive refreshes and asynchronous DOM changes without breaking the host page. The same workflow also needs cross-browser support for local PDF, DOCX, HTML, and TXT files.",
    role:
      "I defined the reading workflow and built the extension, including its information architecture, highlight recovery, local document reader, translation routing, and cross-browser support.",
    process: [
      "Place selection, translation, highlights, saved phrases, notes, and a timer in one Shadow DOM panel.",
      "Save annotations locally with their source page, then restore them by DOM path or matching text.",
      "Watch for pages that change after loading and retry highlight restoration when needed.",
      "Support local PDF, DOCX, HTML, and TXT reading alongside page-linked mind maps.",
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
      "The working extension brings reading, translation, notes, focus time, local documents, and mind maps into one place, without asking readers to leave their source behind.",
    screenshots: [
      "/portfolio/literature-installed.png",
      "/map-preview/curated/study-assistant-01.webp",
      "/portfolio/literature-reading-loop.png",
      "/map-preview/curated/study-assistant-02.webp",
      "/portfolio/literature-saved-library.png",
      "/portfolio/literature-saved-notes.png",
      "/map-preview/curated/study-assistant-03.webp",
      "/map-preview/curated/study-assistant-04.webp",
    ],
    github: "https://github.com/zbjgrhr/Literature_Research_Assistant_-",
    download: "https://github.com/zbjgrhr/Literature_Research_Assistant_-/archive/refs/heads/main.zip",
    learned: [
      "Persistence is part of the reading experience, not merely a storage problem.",
      "Browser tools earn trust when users can see, undo, and restore the changes made to a page.",
    ],
  },
];

export function getProject(id: string) {
  return projects.find((project) => project.id === id);
}
