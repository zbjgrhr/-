import * as Phaser from "phaser";
import { AudioEngine } from "@/game/audio/AudioEngine";
import {
  createLevelBeatmap,
  generateReactiveNotes,
} from "@/game/beatmap/reactive";
import { createMetronomeBeatmap } from "@/game/beatmap/loader";
import { RhythmSystem, normalizeAction } from "@/game/systems/RhythmSystem";
import { PianoStage, PIANO_TOP } from "@/game/entities/PianoStage";
import { NoteHighway } from "@/game/entities/NoteHighway";
import { AvatarController } from "@/game/entities/AvatarController";
import { MemoryScroll } from "@/game/systems/MemoryScroll";
import { ComboReveal } from "@/game/systems/ComboReveal";
import { SegmentDirector } from "@/game/systems/SegmentDirector";
import { getGameBridge, type BridgeCommand } from "@/game/bridge/GameBridge";
import type {
  BeatEvent,
  Beatmap,
  ChapterId,
  Locale,
  PitchLane,
  ProjectId,
  SegmentKind,
} from "@/types";
import { GAME_WIDTH } from "@/game/config/gameConfig";
import { getGameLevel, localize, type GameLevel } from "@/data/gameLevels";

export class WorldScene extends Phaser.Scene {
  private audio = new AudioEngine();
  private beatmap: Beatmap | null = null;
  private rhythm: RhythmSystem | null = null;
  private currentLevel: GameLevel | null = null;
  private locale: Locale = "en";
  private stage!: PianoStage;
  private highway!: NoteHighway;
  private avatar!: AvatarController;
  private memory!: MemoryScroll;
  private comboReveal!: ComboReveal;
  private segments = new SegmentDirector();
  private bridge = getGameBridge();
  private unsubCommand: (() => void) | null = null;

  private started = false;
  private assist = false;
  private autoplay = false;
  private reducedMotion = false;
  private lightweight = false;
  private soundEnabled = true;
  private chapter: ChapterId = "prologue";
  private holdingLanes = new Set<number>();
  private archiveReady: ProjectId | null = null;
  private lastAutoHitId: string | null = null;
  private lastProgressEmit = -1;
  private captionVersion = 0;

  private laneKeys: Phaser.Input.Keyboard.Key[] = [];
  private escKey!: Phaser.Input.Keyboard.Key;
  private eKey!: Phaser.Input.Keyboard.Key;
  private segmentHint!: Phaser.GameObjects.Text;

  constructor() {
    super("WorldScene");
  }

  async create() {
    this.cameras.main.setBackgroundColor(0xf3f0e9);
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, this.scale.height);

    this.memory = new MemoryScroll(this);
    this.memory.create();
    this.comboReveal = new ComboReveal(this.memory);

    this.stage = new PianoStage(this);
    this.stage.create();
    this.highway = new NoteHighway(this, this.stage);
    this.avatar = new AvatarController(this, this.stage);
    this.avatar.create();

    this.segmentHint = this.add
      .text(GAME_WIDTH / 2, PIANO_TOP + 20, "演奏", {
        fontFamily: "Courier New, monospace",
        fontSize: "11px",
        color: "#64748b",
        letterSpacing: 3,
      })
      .setOrigin(0.5)
      .setDepth(50);

    if (this.input.keyboard) {
      this.laneKeys = [
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
      ];
      this.escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    this.unsubCommand = this.bridge.onCommand((command) => void this.handleCommand(command));
    this.bridge.emit({ type: "loading", progress: 0.35 });
    this.bridge.emit({ type: "ready" });
  }

  private async handleCommand(command: BridgeCommand) {
    switch (command.type) {
      case "startLevel":
        await this.startLevel(command.levelId, command.locale);
        break;
      case "pause":
        this.audio.pause();
        break;
      case "resume":
        if (this.started) this.audio.resume();
        break;
      case "setAssist":
        this.assist = command.enabled;
        this.avatar.setAssist(command.enabled);
        this.rhythm?.setAssist(command.enabled);
        break;
      case "setAutoplay":
        this.autoplay = command.enabled;
        this.avatar.setAutoplay(command.enabled);
        break;
      case "setSound":
        this.soundEnabled = command.enabled;
        this.audio.setMuted(!command.enabled);
        break;
      case "setReducedMotion":
        this.reducedMotion = command.enabled;
        this.memory.setReducedMotion(command.enabled);
        this.highway.setReducedMotion(command.enabled);
        break;
      case "setLightweight":
        this.lightweight = command.enabled;
        this.memory.setLightweight(command.enabled);
        break;
      case "setLocale":
        this.locale = command.locale;
        this.memory.setLocale(command.locale);
        this.setSegment(this.segments.getKind());
        break;
      case "replay":
        this.restartLevel();
        break;
      case "hitLane":
        this.resolveHit(command.lane as PitchLane);
        break;
      case "releaseLane":
        this.releaseLane(command.lane);
        break;
      case "interact":
        if (this.archiveReady) {
          this.bridge.emit({ type: "openArchive", projectId: this.archiveReady });
        }
        break;
      case "skipChapter":
        this.finishLevel();
        break;
      default:
        break;
    }
  }

  private async startLevel(levelId: ProjectId, locale: Locale) {
    this.audio.stop();
    this.started = false;
    this.locale = locale;
    this.currentLevel = getGameLevel(levelId);
    this.beatmap = createLevelBeatmap(this.currentLevel);
    this.highway.clear();
    this.rhythm = null;
    this.archiveReady = null;
    this.lastAutoHitId = null;
    this.lastProgressEmit = -1;
    this.holdingLanes.clear();
    this.comboReveal.reset();
    this.segments.set("play");
    this.bridge.emit({ type: "loading", progress: 0.42 });

    await this.memory.beginLevel(this.currentLevel.id, locale);
    this.stage.setAccent(this.currentLevel.accentNumber);
    this.stage.setResonance(false);
    this.setChapter(this.currentLevel.chapter);
    this.setSegment("play");
    this.comboReveal.setProject(this.currentLevel.id);
    this.memory.reveal(1, this.currentLevel.id, false);
    this.bridge.emit({
      type: "revealProgress",
      level: 1,
      projectId: this.currentLevel.id,
    });
    this.bridge.emit({ type: "loading", progress: 0.5 });

    try {
      await this.audio.unlock();
      this.bridge.emit({ type: "audioUnlocked" });
      if (!this.audio.isLoaded(this.currentLevel.audio)) {
        await this.audio.load(this.currentLevel.audio, (progress) =>
          this.bridge.emit({ type: "loading", progress: 0.5 + progress * 0.45 }),
        );
      }
      const peaks = this.audio.analyzeOnsets(this.currentLevel.difficulty);
      const reactiveNotes = generateReactiveNotes(peaks, this.currentLevel);
      const notes = reactiveNotes.length >= 24
        ? reactiveNotes
        : this.fallbackNotes(this.currentLevel);
      this.beatmap.events = [...this.beatmap.events, ...notes].sort((a, b) => a.time - b.time);
      this.rhythm = new RhythmSystem(this.beatmap.events);
      this.rhythm.setAssist(this.assist);
      this.audio.setMuted(!this.soundEnabled);
      this.audio.setOffset(0);
      this.audio.play(0);
    } catch (error) {
      console.warn("Audio failed; continuing with a silent reactive fallback", error);
      const notes = this.fallbackNotes(this.currentLevel);
      this.beatmap.events = [...this.beatmap.events, ...notes].sort((a, b) => a.time - b.time);
      this.rhythm = new RhythmSystem(this.beatmap.events);
      this.rhythm.setAssist(this.assist);
      this.audio.startSilent(0);
    }

    this.rhythm.reset();
    this.started = true;
    this.bridge.emit({ type: "loading", progress: 1 });
    this.showNarrative(`${this.currentLevel.id}:0`);
  }

  private fallbackNotes(level: GameLevel) {
    const generated = createMetronomeBeatmap(level.bpm, level.duration, level.audio)
      .events.filter((event) => event.eventType === "note");
    const step = level.difficulty === "casual" ? 2 : 1;
    return generated
      .filter((_, index) => index % step === 0)
      .map((event, index) => ({ ...event, id: `${level.id}-fallback-${index}` }));
  }

  private restartLevel() {
    if (!this.currentLevel) return;
    void this.startLevel(this.currentLevel.id, this.locale);
  }

  private finishLevel() {
    if (!this.started) return;
    this.started = false;
    this.audio.stop();
    this.bridge.emit({ type: "levelProgress", progress: 1 });
    this.bridge.emit({ type: "songEnded" });
  }

  private setChapter(chapter: ChapterId) {
    this.chapter = chapter;
    this.memory.setChapter(chapter);
    if (this.currentLevel) this.comboReveal.setProject(this.currentLevel.id);
    this.bridge.emit({ type: "chapterChange", chapter });
  }

  private setSegment(kind: SegmentKind) {
    this.segments.set(kind);
    this.memory.setSegment(kind);
    this.bridge.emit({ type: "segmentChange", segment: kind });
    const labels: Record<SegmentKind, string> = {
      play: this.locale === "en" ? "Performance" : "演奏",
      showcase: this.locale === "en" ? "Memory Scroll · Press E to Open the Archive" : "记忆卷轴 · E 打开档案",
      climax: this.locale === "en" ? "Resonance Climax" : "共鸣高潮",
    };
    this.segmentHint.setText(labels[kind]);
  }

  private showNarrative(textId: string) {
    if (!this.currentLevel) return;
    const index = Number(textId.split(":")[1] ?? 0);
    const copy = this.currentLevel.narrative[Math.min(this.currentLevel.narrative.length - 1, index)];
    if (!copy) return;
    const line = localize(copy, this.locale);
    const version = ++this.captionVersion;
    this.bridge.emit({ type: "narrativeLine", textId });
    this.bridge.emit({ type: "caption", text: line });
    this.time.delayedCall(3600, () => {
      if (version === this.captionVersion) this.bridge.emit({ type: "caption", text: "" });
    });
  }

  update(_time: number, delta: number) {
    if (!this.avatar || !this.stage) return;
    this.handleInput();

    const segment = this.segments.get();
    this.avatar.updateScroll(delta, segment.showcaseMode);
    this.memory.update(delta, 0, segment.showcaseMode);

    if (!this.started || !this.rhythm || !this.beatmap || !this.currentLevel) return;
    const songTime = this.audio.getCurrentTime();
    this.memory.syncTime(songTime);
    const upcoming = this.rhythm.peekUpcomingNotes(songTime, 1.75);
    this.highway.update(songTime, upcoming, (id) => this.rhythm!.isJudged(id));

    this.stage.clearPrelight();
    const next = this.rhythm.getNextNote(songTime);
    if (next?.lane !== undefined) {
      if (this.assist || this.autoplay) this.stage.prelight(next.lane);
      if (this.autoplay && Math.abs(next.time - songTime) < 0.055 && this.lastAutoHitId !== next.id) {
        this.lastAutoHitId = next.id;
        this.resolveHit(next.lane as PitchLane);
      }
    }

    for (const event of this.rhythm.consumeDue(songTime)) this.handleTimelineEvent(event);
    for (const missed of this.rhythm.flushMisses(songTime)) {
      this.comboReveal.onJudgment(0, true);
      this.stage.setResonance(false);
      this.bridge.emit({ type: "judgment", judgment: "miss", combo: 0 });
      this.bridge.emit({
        type: "revealProgress",
        level: this.comboReveal.getRevealLevel(this.currentLevel.id),
        projectId: this.currentLevel.id,
      });
      void missed;
    }

    const state = this.rhythm.getState();
    this.memory.setSaturation(state.saturation);
    this.stage.setSaturation(state.saturation);
    this.stage.setResonance(state.combo >= 15);

    const progressTick = Math.floor(songTime * 5);
    if (progressTick !== this.lastProgressEmit) {
      this.lastProgressEmit = progressTick;
      this.bridge.emit({
        type: "levelProgress",
        progress: Math.min(1, songTime / this.beatmap.metadata.duration),
      });
    }
    if (songTime >= this.beatmap.metadata.duration - 0.12) this.finishLevel();
  }

  private handleInput() {
    if (!this.laneKeys.length) return;
    this.laneKeys.forEach((key, lane) => {
      if (Phaser.Input.Keyboard.JustDown(key)) this.resolveHit(lane as PitchLane);
      if (Phaser.Input.Keyboard.JustUp(key)) this.releaseLane(lane);
    });
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.bridge.emit({ type: "caption", text: "toggle-pause" });
    }
    if (Phaser.Input.Keyboard.JustDown(this.eKey) && this.archiveReady) {
      this.bridge.emit({ type: "openArchive", projectId: this.archiveReady });
    }
  }

  private releaseLane(lane: number) {
    this.holdingLanes.delete(lane);
    this.stage.holdEnd(lane);
    this.avatar.endHold();
  }

  private resolveHit(lane: PitchLane) {
    if (!this.rhythm || !this.started) return;
    this.avatar.setLane(lane, Math.abs(lane - this.avatar.lane) >= 2);
    const result = this.rhythm.tryHit(lane, this.audio.getCurrentTime());
    if (!result) {
      this.stage.ghostTap(lane);
      return;
    }

    const action = normalizeAction(result.event.action as string);
    this.avatar.playAction(result.event);
    this.highway.flashHit(result.event, result.judgment, result.combo);

    if (action === "hold") {
      this.holdingLanes.add(lane);
      this.stage.holdStart(lane);
    } else {
      this.stage.press(
        result.event.lane ?? lane,
        result.event.intensity ?? 0.75,
        action === "chord",
        result.judgment,
      );
    }

    if (!this.reducedMotion && result.judgment === "perfect") {
      this.cameras.main.shake(result.combo >= 15 ? 75 : 45, result.combo >= 15 ? 0.004 : 0.002);
      if (result.combo % 5 === 0) this.memory.burst(Math.min(1, 0.45 + result.combo / 40));
    }

    this.comboReveal.onJudgment(result.combo, false);
    this.bridge.emit({
      type: "judgment",
      judgment: result.judgment,
      combo: result.combo,
    });
    if (this.currentLevel) {
      this.bridge.emit({
        type: "revealProgress",
        level: this.comboReveal.getRevealLevel(this.currentLevel.id),
        projectId: this.currentLevel.id,
      });
    }
  }

  private handleTimelineEvent(event: BeatEvent) {
    switch (event.eventType) {
      case "chapter":
        if (event.chapter) this.setChapter(event.chapter);
        break;
      case "segment":
        if (event.segment) this.setSegment(event.segment);
        break;
      case "narrative":
        if (event.textId) this.showNarrative(event.textId);
        break;
      case "environment":
        if (event.portfolioEvent) this.memory.applyEnvironment(event.portfolioEvent);
        break;
      case "reveal":
        if (event.projectId && event.revealLevel !== undefined) {
          this.comboReveal.onScheduledReveal(
            event.revealLevel,
            event.projectId,
            this.rhythm?.getState().combo ?? 0,
          );
          this.bridge.emit({
            type: "revealProgress",
            level: event.revealLevel,
            projectId: event.projectId,
          });
        }
        break;
      case "synthesize":
        if (event.projectId) {
          this.comboReveal.onSynthesize(event.projectId);
          this.bridge.emit({ type: "phraseClear", perfect: this.comboReveal.getPhrasePerfect() });
        }
        break;
      case "archive":
        if (event.projectId) {
          this.archiveReady = event.projectId;
          this.bridge.emit({ type: "unlockProject", projectId: event.projectId });
        }
        break;
      case "particle":
        this.memory.burst(event.intensity ?? 0.5);
        break;
      case "camera":
        if (!this.reducedMotion) {
          this.cameras.main.flash(90, 94, 234, 212, false, undefined, 0.15);
        }
        break;
      default:
        break;
    }
  }

  shutdown() {
    this.unsubCommand?.();
    this.audio.stop();
  }
}
