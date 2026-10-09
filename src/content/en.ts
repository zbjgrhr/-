export interface ContentShape {
  brand: string;
  brandZh: string;
  name: string;
  nameZh: string;
  tagline: string;
  profile: string;
  coreAreas: string[];
  entry: {
    play: string;
    explore: string;
    continue: string;
    soundOn: string;
    soundOff: string;
    reducedMotion: string;
    howToPlay: string;
    credits: string;
    hint: string;
  };
  howToPlay: { title: string; body: string[] };
  credits: { title: string; body: string[] };
  hud: {
    pause: string;
    resume: string;
    sound: string;
    archive: string;
    skip: string;
    assist: string;
    explore: string;
    combo: string;
    memory: string;
  };
  chapters: {
    prologue: string;
    "movement-i": string;
    "movement-ii": string;
    "movement-iii": string;
    "movement-iv": string;
    coda: string;
  };
  narrative: Record<string, string>;
  explore: {
    title: string;
    subtitle: string;
    about: string;
    projects: string;
    contact: string;
    downloadCv: string;
    playInstead: string;
  };
  contact: {
    email: string;
    github: string;
    linkedin?: string;
    cvPath: string;
    portfolioPath: string;
  };
  coda: {
    title: string;
    line: string;
    replay: string;
    explore: string;
    autoplay: string;
  };
  archive: {
    close: string;
    context: string;
    problem: string;
    role: string;
    process: string;
    decisions: string;
    tech: string;
    challenges: string;
    outcome: string;
    learned: string;
    links: string;
  };
  pauseMenu: {
    title: string;
    resume: string;
    settings: string;
    exitExplore: string;
  };
}

export const en: ContentShape = {
  brand: "Resonance Archive",
  brandZh: "共鸣档案",
  name: "Huaxin Zhang",
  nameZh: "张铧心",
  tagline: "I turn complex workflows into products people can use and validate.",
  profile:
    "Game designer × AI product builder. I use user research, systems design, and working prototypes to turn an initial idea into something ready to ship.",
  coreAreas: [
    "Game Systems & Level Design",
    "AI Agent Workflows",
    "Interactive Prototyping & User Research",
    "Content Operations & Cross-Cultural Communication",
  ],
  entry: {
    play: "Start Playing",
    explore: "Explore Work",
    continue: "Continue",
    soundOn: "Turn Sound On",
    soundOff: "Turn Sound Off",
    reducedMotion: "Reduce Motion",
    howToPlay: "How to Play",
    credits: "Credits",
    hint: "Five projects, five standalone levels—all unlocked from the start.",
  },
  howToPlay: {
    title: "How to Play",
    body: [
      "D / F / Space / J / K — one key for each of the five lanes",
      "Hit each key on the beat. The character no longer needs to move in advance.",
      "Hold the matching key for long notes.",
      "Press E during a Memory section to open the project archive.",
      "Esc to pause",
      "The character moves after each successful hit as visual feedback.",
      "A miss only fades the world; it never interrupts the music.",
      "Build a combo to gradually reveal the memory scroll above.",
    ],
  },
  credits: {
    title: "Credits",
    body: [
      "Resonance Archive · An Interactive Portfolio by Huaxin Zhang",
      "Five public-domain piano pieces shape five distinct watercolor memories",
      "Built with Next.js, Phaser 3, and Web Audio",
    ],
  },
  hud: {
    pause: "Pause",
    resume: "Continue",
    sound: "Sound",
    archive: "Archive",
    skip: "Skip Chapter",
    assist: "Accessibility",
    explore: "Explore",
    combo: "Combo",
    memory: "Memory",
  },
  chapters: {
    prologue: "Prologue",
    "movement-i": "Movement I · Pixel World",
    "movement-ii": "Movement II · Rainy Night Arcade",
    "movement-iii": "Movement III · IWBTZ",
    "movement-iv": "Movement IV · Creative Tools",
    coda: "Coda",
  },
  narrative: {
    "prologue-1": "Every project begins with a signal.",
    "prologue-2": "Some become systems.",
    "prologue-3": "Some become worlds.",
    "prologue-4": "I turn complex systems into experiences people can feel, use, and put to the test.",
    "pixel-1": "Stories become executable production specs without losing the strange, honest ideas that made them worth telling.",
    "pixel-2": "Ten agents divide the work, review one another, and surface every conflict before generation begins.",
    "pixel-3": "Once a world is generated, its vivid cover takes over the creator’s default background.",
    "pixel-4": "The result can truly be played, saved locally, reopened at any time, and taken away as an offline game.",
    "browser-1": "You cleared the noise.",
    "browser-2": "The useful signal was there all along.",
    "browser-3":
      "I design browser tools that turn repetitive actions into purposeful workflows.",
    "emotion-1": "Not every signal needs to be corrected.",
    "emotion-2": "Some need to be heard.",
    "emotion-3":
      "A considerate system knows when to respond—and when to leave space.",
    "research-1": "Raw signals rarely explain themselves.",
    "research-2": "Patterns emerge through careful questions.",
    "research-3": "Research taught me to look beyond the interface.",
    "coda-1": "Every clue returns to the same instrument.",
    "coda-2": "If this experience gives you something to talk about, I’d love to hear from you.",
  },
  explore: {
    title: "Selected Work",
    subtitle: "Six projects. Six ways of turning ideas into products.",
    about: "About",
    projects: "Projects",
    contact: "Contact",
    downloadCv: "Download Résumé",
    playInstead: "Play the Portfolio",
  },
  contact: {
    email: "hxz439@alumni.bham.ac.uk",
    github: "https://github.com/zbjgrhr",
    cvPath: "/downloads/Huaxin_Zhang_CV_English.pdf",
    portfolioPath: "/downloads/Zhang_Huaxin_Creative_Portfolio.pdf",
  },
  coda: {
    title: "Let’s Make Something Meaningful",
    line: "If this experience gives you something to talk about, I’d love to hear from you.",
    replay: "Play Again",
    explore: "Explore Projects",
    autoplay: "Enable Autoplay",
  },
  archive: {
    close: "Close Archive",
    context: "Context",
    problem: "Problem",
    role: "My Role",
    process: "Process",
    decisions: "Key Decisions",
    tech: "Technology",
    challenges: "Challenges",
    outcome: "Outcome",
    learned: "What I Learned",
    links: "Links",
  },
  pauseMenu: {
    title: "Paused",
    resume: "Continue",
    settings: "Settings",
    exitExplore: "Exit to Explore",
  },
};
