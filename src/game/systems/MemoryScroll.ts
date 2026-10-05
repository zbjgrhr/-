import * as Phaser from "phaser";
import { COLORS, GAME_WIDTH } from "@/game/config/gameConfig";
import { PIANO_TOP } from "@/game/entities/PianoStage";
import type { ChapterId, Locale, ProjectId, SegmentKind } from "@/types";
import { getGameLevel, localize } from "@/data/gameLevels";

interface Layer {
  root: Phaser.GameObjects.Container;
  projectId?: ProjectId;
  level: number;
  frameId?: string;
  synthesized: boolean;
}

/**
 * Top memory scroll — reveals the current project's authored showcase panels.
 */
export class MemoryScroll {
  private scene: Phaser.Scene;
  private bg!: Phaser.GameObjects.Rectangle;
  private scrollRoot!: Phaser.GameObjects.Container;
  private layers: Layer[] = [];
  private skin: string = "pixel-void";
  private scrollOffset = 0;
  private reducedMotion = false;
  private lightweight = false;
  private saturation = 1;
  private chapter: ChapterId = "prologue";
  private segment: SegmentKind = "play";
  private revealLevels = new Map<ProjectId, number>();
  private loadedKeys = new Set<string>();
  private activeLevelId: ProjectId | null = null;
  private stageLocale: Locale = "en";
  private activeStagePanel: Phaser.GameObjects.Container | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  async beginLevel(projectId: ProjectId, locale: Locale) {
    this.activeLevelId = projectId;
    this.stageLocale = locale;
    this.activeStagePanel = null;
    this.revealLevels.clear();
    this.layers.forEach((layer) => layer.root.destroy(true));
    this.layers = [];
    this.scrollRoot.removeAll(true);
    this.scrollOffset = 0;
    this.spawnStars();

    const level = getGameLevel(projectId);
    const sources = Array.from(new Set(level.panels.map((panel) => panel.image)));
    let queued = 0;
    for (const src of sources) {
      const key = this.imageTextureKey(src);
      if (this.scene.textures.exists(key) || this.loadedKeys.has(key)) continue;
      this.loadedKeys.add(key);
      this.scene.load.image(key, src);
      queued += 1;
    }
    if (queued) {
      await new Promise<void>((resolve) => {
        this.scene.load.once(Phaser.Loader.Events.COMPLETE, () => resolve());
        if (!this.scene.load.isLoading()) this.scene.load.start();
      });
    }
    this.applyEnvironment(level.environment);
  }

  setLocale(locale: Locale) {
    this.stageLocale = locale;
  }

  setReducedMotion(v: boolean) {
    this.reducedMotion = v;
  }

  setLightweight(v: boolean) {
    this.lightweight = v;
  }

  setSegment(segment: SegmentKind) {
    this.segment = segment;
  }

  create() {
    if (this.scene.textures.exists("watercolor-memory-bg")) {
      this.scene.add
        .image(GAME_WIDTH / 2, PIANO_TOP / 2, "watercolor-memory-bg")
        .setDisplaySize(GAME_WIDTH, PIANO_TOP + 40)
        .setAlpha(0.25)
        .setDepth(-1);
    }
    this.bg = this.scene.add
      .rectangle(
        GAME_WIDTH / 2,
        PIANO_TOP / 2,
        GAME_WIDTH,
        PIANO_TOP + 40,
        COLORS.deepBlue,
        0.82,
      )
      .setDepth(0);
    this.scrollRoot = this.scene.add.container(0, 0).setDepth(2);
    this.scene.add
      .rectangle(GAME_WIDTH / 2, PIANO_TOP - 10, GAME_WIDTH, 60, COLORS.deepBlue, 0.35)
      .setDepth(4);
    this.spawnStars();
  }

  private spawnStars() {
    const n = this.lightweight ? 10 : 28;
    for (let i = 0; i < n; i++) {
      this.scrollRoot.add(
        this.scene.add
          .ellipse(
            Phaser.Math.Between(20, GAME_WIDTH - 20),
            Phaser.Math.Between(20, PIANO_TOP - 80),
            Phaser.Math.Between(3, 8),
            Phaser.Math.Between(7, 16),
            COLORS.moonlight,
            Phaser.Math.FloatBetween(0.12, 0.42),
          )
          .setRotation(Phaser.Math.FloatBetween(-0.9, 0.9))
          .setScrollFactor(0),
      );
    }
  }

  setChapter(chapter: ChapterId) {
    this.chapter = chapter;
  }

  applyEnvironment(id: string) {
    this.skin = id;
    const colors: Record<string, number> = {
      "pixel-void": COLORS.deepBlue,
      "pixel-generate": 0x665f7f,
      "pixel-world": 0x5c5d7b,
      "rainy-arcade": 0x536b82,
      "iwbtz": 0x725c68,
      "auto-tune": 0x74675b,
      "study-assistant": 0x586d68,
      "browser-city": 0x586d68,
      "reply-pulse": 0x526d70,
      "emotion-quiet": 0x6d5d70,
      "research-wave": 0x58677e,
      "coda-merge": COLORS.midnightPurple,
    };
    if (id === "pixel-generate") this.ensureBaseGrid();
    if (id === "browser-clear") {
      this.layers.forEach((l) => {
        if (l.projectId === "study-assistant") {
          this.scene.tweens.add({
            targets: l.root,
            alpha: 0.95,
            duration: this.reducedMotion ? 0 : 500,
          });
        }
      });
    }
    if (colors[id] !== undefined) this.bg.setFillStyle(colors[id], 0.82);
  }

  private ensureBaseGrid() {
    if (this.layers.some((l) => l.level === 0 && l.projectId === "pixel-world")) return;
    const root = this.scene.add.container(160, 120);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        root.add(
          this.scene.add
            .rectangle(c * 22, r * 22, 18, 18, COLORS.cyan, 0.12)
            .setStrokeStyle(1, COLORS.cyan, 0.35),
        );
      }
    }
    this.scrollRoot.add(root);
    this.layers.push({ root, projectId: "pixel-world", level: 0, synthesized: false });
  }

  reveal(level: number, projectId: ProjectId, slow = false) {
    const prev = this.revealLevels.get(projectId) ?? 0;
    this.revealLevels.set(projectId, Math.max(prev, level));

    if (this.activeLevelId === projectId) {
      this.mountStagePanel(projectId, level, slow);
      return;
    }

    if (this.layers.some((l) => l.projectId === projectId && l.level === level && !l.frameId)) {
      return;
    }
    const root = this.buildLegacyLayer(level, projectId);
    root.setAlpha(0);
    this.scrollRoot.add(root);
    this.layers.push({ root, projectId, level, synthesized: false });
    this.scene.tweens.add({
      targets: root,
      alpha: this.saturation,
      duration: this.reducedMotion ? 0 : slow ? 1600 : 500,
      ease: "Sine.easeOut",
    });
  }

  syncTime(songTime: number) {
    void songTime;
  }

  private mountStagePanel(projectId: ProjectId, levelNumber: number, slow: boolean) {
    const frameId = `stage-${projectId}-${levelNumber}`;
    if (this.layers.some((layer) => layer.frameId === frameId)) return;
    const level = getGameLevel(projectId);
    const panelIndex = Math.min(level.panels.length - 1, Math.max(0, levelNumber - 1));
    if (!level.panels[panelIndex]) return;

    const previous = this.activeStagePanel;
    if (previous) {
      this.scene.tweens.add({
        targets: previous,
        x: -GAME_WIDTH * 0.22,
        alpha: 0,
        duration: this.reducedMotion ? 0 : 420,
        ease: "Cubic.easeIn",
        onComplete: () => {
          previous.destroy(true);
          this.layers = this.layers.filter((layer) => layer.root !== previous);
        },
      });
    }

    const root = this.buildStagePanel(projectId, levelNumber);
    root.setPosition(this.reducedMotion ? 0 : GAME_WIDTH * 0.48, 0).setAlpha(0);
    this.scrollRoot.add(root);
    this.activeStagePanel = root;
    this.layers.push({
      root,
      projectId,
      level: levelNumber,
      frameId,
      synthesized: false,
    });
    this.scene.tweens.add({
      targets: root,
      x: 0,
      alpha: this.saturation,
      duration: this.reducedMotion ? 0 : slow ? 1100 : 520,
      ease: "Cubic.easeOut",
    });
  }

  private buildStagePanel(projectId: ProjectId, levelNumber: number) {
    const level = getGameLevel(projectId);
    const panelIndex = Math.min(level.panels.length - 1, Math.max(0, levelNumber - 1));
    const panel = level.panels[panelIndex];
    const root = this.scene.add.container(0, 0);
    const panelHeight = PIANO_TOP - 74;
    const panelTop = 54;
    const frame = this.scene.add
      .rectangle(
        GAME_WIDTH / 2,
        panelTop + panelHeight / 2,
        GAME_WIDTH - 112,
        panelHeight,
        0xfff7e6,
        0.94,
      )
      .setStrokeStyle(1, level.accentNumber, 0.72);
    const rail = this.scene.add.rectangle(
      76,
      panelTop + panelHeight / 2,
      3,
      panelHeight - 34,
      level.accentNumber,
      0.9,
    );
    const step = this.scene.add.text(94, panelTop + 24, `0${level.order} / 0${levelNumber}`, {
      fontFamily: "Courier New, monospace",
      fontSize: "12px",
      color: level.accent,
      letterSpacing: 2,
    });
    const eyebrow = this.scene.add.text(
      94,
      panelTop + 61,
      localize(panel.eyebrow, this.stageLocale),
      {
        fontFamily: "Courier New, monospace",
        fontSize: "13px",
        color: level.accent,
        wordWrap: { width: 420 },
      },
    );
    const title = this.scene.add.text(94, panelTop + 94, localize(panel.title, this.stageLocale), {
      fontFamily: "Georgia, serif",
      fontSize: "27px",
      color: "#26383b",
      wordWrap: { width: 430 },
      lineSpacing: 5,
    });
    const body = this.scene.add.text(94, panelTop + 176, localize(panel.body, this.stageLocale), {
      fontFamily: "Trebuchet MS, sans-serif",
      fontSize: "15px",
      color: "#52625d",
      wordWrap: { width: 430 },
      lineSpacing: 7,
    });
    const divider = this.scene.add.rectangle(
      568,
      panelTop + panelHeight / 2,
      1,
      panelHeight - 48,
      level.accentNumber,
      0.25,
    );
    const tape = this.scene.add
      .rectangle(GAME_WIDTH / 2, panelTop + 3, 86, 17, 0xe8bf65, 0.7)
      .setRotation(-0.035);
    const stamp = this.scene.add
      .circle(GAME_WIDTH - 92, panelTop + 28, 17, level.accentNumber, 0.08)
      .setStrokeStyle(2, level.accentNumber, 0.45);
    root.add([frame, tape, stamp, rail, step, eyebrow, title, body, divider]);

    const key = this.ensureImageTexture(panel.image);
    if (key && this.scene.textures.exists(key)) {
      const image = this.scene.add.image(900, panelTop + panelHeight / 2, key);
      const scale = Math.min(590 / image.width, (panelHeight - 52) / image.height);
      image.setDisplaySize(image.width * scale, image.height * scale);
      const imageFrame = this.scene.add
        .rectangle(
          900,
          panelTop + panelHeight / 2,
          image.displayWidth + 14,
          image.displayHeight + 14,
          0x000000,
          0,
        )
        .setStrokeStyle(1, level.accentNumber, 0.44);
      root.add([imageFrame, image]);
    }

    for (let index = 0; index < 4; index += 1) {
      root.add(
        this.scene.add.circle(
          94 + index * 22,
          panelTop + panelHeight - 22,
          index + 1 === levelNumber ? 4 : 2.5,
          level.accentNumber,
          index + 1 === levelNumber ? 1 : 0.28,
        ),
      );
    }
    return root;
  }

  private ensureImageTexture(src?: string): string | null {
    if (!src) return null;
    const key = this.imageTextureKey(src);
    if (this.scene.textures.exists(key) || this.loadedKeys.has(key)) return key;
    this.loadedKeys.add(key);
    this.scene.load.image(key, src);
    if (!this.scene.load.isLoading()) this.scene.load.start();
    return key;
  }

  private imageTextureKey(src: string) {
    return `content-${src.replace(/[^a-zA-Z0-9]/g, "_")}`;
  }

  synthesize(projectId: ProjectId) {
    this.layers
      .filter((l) => l.projectId === projectId)
      .forEach((l) => {
        l.synthesized = true;
        this.scene.tweens.add({
          targets: l.root,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: this.reducedMotion ? 0 : 280,
          yoyo: true,
        });
      });
    const banner = this.scene.add
      .text(GAME_WIDTH / 2, 80, projectId.replace(/-/g, " ").toUpperCase(), {
        fontFamily: "Courier New, monospace",
        fontSize: "16px",
        color: "#a8d5d5",
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setDepth(30);
    this.scene.tweens.add({
      targets: banner,
      alpha: 1,
      duration: 400,
      hold: 1200,
      yoyo: true,
      onComplete: () => banner.destroy(),
    });
  }

  private buildLegacyLayer(level: number, projectId: ProjectId): Phaser.GameObjects.Container {
    const x = 200 + level * 160;
    const y = 90 + (level % 3) * 55;
    const root = this.scene.add.container(x, y);
    root.add(
      this.scene.add.text(0, 0, `${projectId} · L${level}`, {
        fontFamily: "Courier New, monospace",
        fontSize: "13px",
        color: "#a8d5d5",
      }),
    );
    return root;
  }

  setSaturation(amount: number) {
    this.saturation = amount;
    this.layers.forEach((l) => {
      if (!l.synthesized) l.root.setAlpha(0.45 + amount * 0.55);
    });
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      Phaser.Display.Color.ValueToColor(0x8da7a2),
      Phaser.Display.Color.ValueToColor(COLORS.deepBlue),
      100,
      Math.floor(amount * 100),
    );
    this.bg.setFillStyle(
      Phaser.Display.Color.GetColor(color.r, color.g, color.b),
      0.82,
    );
  }

  update(delta: number, pitchBias: number, showcase: boolean) {
    const speed = showcase ? 0.008 : 0.02;
    this.scrollOffset += delta * speed;
    this.scrollRoot.y = -Math.sin(this.scrollOffset * 0.01) * 3 - pitchBias * 3;
    if (!this.activeLevelId) {
      this.scrollRoot.x = -((this.scrollOffset * 0.15) % 40);
    }
  }

  burst(intensity: number) {
    if (this.reducedMotion || this.lightweight) return;
    if (!this.scene.textures.exists("particle-dot")) {
      const g = this.scene.make.graphics({ x: 0, y: 0 });
      g.fillStyle(0xffffff, 1);
      g.fillRect(0, 0, 3, 3);
      g.generateTexture("particle-dot", 3, 3);
      g.destroy();
    }
    const emitter = this.scene.add.particles(GAME_WIDTH / 2, PIANO_TOP / 2, "particle-dot", {
      speed: { min: 30, max: 90 + intensity * 60 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      quantity: Math.floor(3 + intensity * 6),
      tint: [COLORS.cyan, COLORS.magenta, COLORS.moonlight],
      emitting: false,
    });
    emitter.setDepth(40);
    emitter.explode();
    this.scene.time.delayedCall(500, () => emitter.destroy());
  }

  getChapter() {
    return this.chapter;
  }

  getSkin() {
    return this.skin;
  }
}
