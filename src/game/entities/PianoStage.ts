import * as Phaser from "phaser";
import { COLORS, GAME_WIDTH, GAME_HEIGHT } from "@/game/config/gameConfig";
import { LANE_COUNT, type Judgment } from "@/types";

export const PIANO_TOP = Math.floor(GAME_HEIGHT * 0.55);
export const HIT_LINE_Y = PIANO_TOP + 48;
export const KEY_Y = GAME_HEIGHT - 72;

/** Fixed 5-lane artistic piano at the bottom of the canvas. */
export class PianoStage {
  private scene: Phaser.Scene;
  private keys: Phaser.GameObjects.Rectangle[] = [];
  private blackKeys: Phaser.GameObjects.Rectangle[] = [];
  private labels: Phaser.GameObjects.Text[] = [];
  private hitLine!: Phaser.GameObjects.Rectangle;
  private glow: Phaser.GameObjects.Rectangle[] = [];
  private laneRails: Phaser.GameObjects.Rectangle[] = [];
  private accent = COLORS.cyan;
  private resonance = false;
  readonly laneXs: number[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    const margin = 120;
    const usable = GAME_WIDTH - margin * 2;
    const keyW = usable / LANE_COUNT - 10;

    // Soft blend into memory scroll
    this.scene.add
      .rectangle(GAME_WIDTH / 2, PIANO_TOP - 20, GAME_WIDTH, 80, COLORS.deepBlue, 0.55)
      .setDepth(5);

    this.scene.add
      .rectangle(
        GAME_WIDTH / 2,
        (PIANO_TOP + GAME_HEIGHT) / 2,
        GAME_WIDTH,
        GAME_HEIGHT - PIANO_TOP,
        0x46475f,
        0.92,
      )
      .setDepth(6);

    for (let i = 0; i < LANE_COUNT; i++) {
      const x = margin + (i + 0.5) * (usable / LANE_COUNT);
      this.laneXs.push(x);

      const laneRail = this.scene.add
        .rectangle(x, (40 + HIT_LINE_Y) / 2, 1, HIT_LINE_Y - 40, COLORS.cyan, 0.09)
        .setDepth(7);
      this.laneRails.push(laneRail);

      const key = this.scene.add
        .rectangle(x, KEY_Y, keyW, 56, COLORS.keyWhite, 0.95)
        .setStrokeStyle(1, 0xcabed0, 0.8)
        .setDepth(12);
      this.keys.push(key);

      const glow = this.scene.add
        .rectangle(x, HIT_LINE_Y, keyW * 0.7, 6, COLORS.cyan, 0)
        .setDepth(14);
      this.glow.push(glow);

      const label = this.scene.add
        .text(x, KEY_Y + 28, ["D", "F", "SPACE", "J", "K"][i], {
          fontFamily: "Courier New, monospace",
          fontSize: i === 2 ? "11px" : "13px",
          color: "#625c72",
        })
        .setOrigin(0.5)
        .setDepth(13);
      this.labels.push(label);
    }

    // Decorative black keys between lanes
    for (const i of [0, 1, 3]) {
      const x = (this.laneXs[i] + this.laneXs[i + 1]) / 2;
      const bk = this.scene.add
        .rectangle(x, KEY_Y - 18, keyW * 0.45, 32, COLORS.keyBlack, 0.95)
        .setDepth(13);
      this.blackKeys.push(bk);
    }

    this.hitLine = this.scene.add
      .rectangle(GAME_WIDTH / 2, HIT_LINE_Y, GAME_WIDTH - 80, 2, COLORS.cyan, 0.55)
      .setDepth(11);
  }

  laneToX(lane: number) {
    const i = Phaser.Math.Clamp(Math.round(lane), 0, LANE_COUNT - 1);
    return this.laneXs[i];
  }

  press(lane: number, intensity = 0.8, chord = false, judgment: Judgment = "great") {
    const i = Phaser.Math.Clamp(Math.round(lane), 0, LANE_COUNT - 1);
    const key = this.keys[i];
    this.scene.tweens.killTweensOf(key);
    this.scene.tweens.add({
      targets: key,
      scaleY: 0.88,
      y: KEY_Y + 4,
      duration: 70,
      yoyo: true,
    });
    const hitColor = judgment === "perfect" ? COLORS.moonlight : this.accent;
    key.setFillStyle(hitColor, 1);
    key.setStrokeStyle(2, hitColor, 1);
    this.glow[i].setAlpha(0.3 + intensity * 0.7);
    this.glow[i].setFillStyle(hitColor, 1);
    this.pulseHitLine(judgment === "perfect" ? 1 : 0.65);

    if (chord) {
      for (const j of [i - 1, i + 1]) {
        if (j >= 0 && j < LANE_COUNT) {
          this.keys[j].setFillStyle(COLORS.magenta, 0.85);
          this.glow[j].setAlpha(0.5);
          this.scene.time.delayedCall(220, () => this.release(j));
        }
      }
    }

    this.scene.time.delayedCall(200, () => this.release(i));
  }

  holdStart(lane: number) {
    const i = Phaser.Math.Clamp(Math.round(lane), 0, LANE_COUNT - 1);
    this.keys[i].setFillStyle(COLORS.moonlight, 1);
    this.glow[i].setAlpha(0.9);
  }

  holdEnd(lane: number) {
    this.release(Phaser.Math.Clamp(Math.round(lane), 0, LANE_COUNT - 1));
  }

  prelight(lane: number) {
    const i = Phaser.Math.Clamp(Math.round(lane), 0, LANE_COUNT - 1);
    this.glow[i].setAlpha(0.45);
    this.keys[i].setStrokeStyle(2, COLORS.moonlight, 0.9);
  }

  clearPrelight() {
    this.keys.forEach((k) => k.setStrokeStyle(1, 0xcabed0, 0.8));
    this.glow.forEach((g) => {
      if (g.alpha < 0.6) g.setAlpha(0);
    });
  }

  private release(i: number) {
    this.keys[i]?.setFillStyle(COLORS.keyWhite, 0.95);
    this.keys[i]?.setStrokeStyle(1, 0xcabed0, 0.8);
    this.glow[i]?.setAlpha(0);
  }

  ghostTap(lane: number) {
    const index = Phaser.Math.Clamp(Math.round(lane), 0, LANE_COUNT - 1);
    const key = this.keys[index];
    this.scene.tweens.add({
      targets: key,
      y: KEY_Y + 2,
      scaleY: 0.94,
      duration: 45,
      yoyo: true,
    });
    this.glow[index].setFillStyle(this.accent, 0.3).setAlpha(0.22);
    this.scene.time.delayedCall(90, () => this.release(index));
  }

  pulseHitLine(intensity = 1) {
    this.hitLine.setFillStyle(this.accent, 1).setAlpha(0.7);
    this.scene.tweens.add({
      targets: this.hitLine,
      scaleY: 1 + intensity * 3,
      alpha: this.resonance ? 0.8 : 0.38,
      duration: 90,
      yoyo: true,
    });
  }

  setAccent(accent: number) {
    this.accent = accent;
    this.hitLine.setFillStyle(accent, 0.7);
    this.laneRails.forEach((rail) => rail.setFillStyle(accent, 0.1));
    this.glow.forEach((glow) => glow.setFillStyle(accent, 1));
  }

  setResonance(active: boolean) {
    if (this.resonance === active) return;
    this.resonance = active;
    this.hitLine.setAlpha(active ? 0.85 : 0.55);
    this.laneRails.forEach((rail) => rail.setAlpha(active ? 0.2 : 0.09));
  }

  setSaturation(amount: number) {
    const alpha = 0.7 + amount * 0.25;
    this.keys.forEach((k) => k.setAlpha(alpha));
    this.hitLine.setAlpha(0.35 + amount * 0.35);
  }
}
