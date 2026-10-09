export type Locale = "en" | "zh";

export type AppMode = "entry" | "play" | "explore";

export type ChapterId =
  | "prologue"
  | "movement-i"
  | "movement-ii"
  | "movement-iii"
  | "movement-iv"
  | "coda";

export type Judgment = "perfect" | "great" | "miss";

export type ProjectId =
  | "pixel-world"
  | "preservative"
  | "rainy-arcade"
  | "iwbtz"
  | "auto-tune"
  | "study-assistant";

/** Pitch lanes: 0 = Low … 4 = High */
export type PitchLane = 0 | 1 | 2 | 3 | 4;

export type NoteAction = "step" | "leap" | "hold" | "chord";

export type SegmentKind = "play" | "showcase" | "climax";

export interface BeatmapMetadata {
  title: string;
  artist: string;
  bpm: number;
  offset: number;
  duration: number;
  audio: string;
}

export type BeatEventType =
  | "note"
  | "segment"
  | "reveal"
  | "synthesize"
  | "narrative"
  | "environment"
  | "chapter"
  | "archive"
  | "camera"
  | "particle"
  // legacy (ignored by new highway if present)
  | "platform"
  | "key-light";

export interface BeatEvent {
  id: string;
  time: number;
  duration?: number;
  /** 0=Low … 4=High for note events */
  lane?: number;
  note?: string;
  action?: NoteAction | "jump" | "land" | "interact" | "hold";
  eventType: BeatEventType;
  portfolioEvent?: string;
  intensity?: number;
  textId?: string;
  chapter?: ChapterId;
  projectId?: ProjectId;
  segment?: SegmentKind;
  /** Combo threshold / layer index for memory reveal */
  revealLevel?: number;
}

export interface Beatmap {
  metadata: BeatmapMetadata;
  events: BeatEvent[];
}

export interface ProjectArchive {
  id: ProjectId;
  title: string;
  oneLiner: string;
  context: string;
  problem: string;
  role: string;
  process: string[];
  keyDecisions: string[];
  technology: string[];
  challenges: string[];
  outcome: string;
  screenshots: string[];
  github?: string;
  liveDemo?: string;
  learned: string[];
  category?: string;
  period?: string;
  status?: string;
  featured?: boolean;
  metrics?: { value: string; label: string }[];
}

export const LANE_COUNT = 5;
export const LANE_LABELS = ["Low", "Low-Mid", "Mid", "High-Mid", "High"] as const;
