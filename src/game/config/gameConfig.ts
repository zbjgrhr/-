import * as Phaser from "phaser";

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const COLORS = {
  deepBlue: 0x54536f,
  midnightPurple: 0x665a7a,
  cyan: 0x8eb7cb,
  magenta: 0xd88994,
  moonlight: 0xf1cf9c,
  keyWhite: 0xfffbf7,
  keyBlack: 0x55536b,
  keyLit: 0xc5a6d8,
  player: 0xde9485,
};

export function createGameConfig(
  parent: HTMLElement,
  scenes: Phaser.Types.Scenes.SceneType[],
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: "#f3f0e9",
    pixelArt: true,
    antialias: false,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 1200 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: scenes,
    audio: {
      disableWebAudio: true,
    },
    callbacks: {
      postBoot: (game) => {
        game.canvas.setAttribute("role", "img");
        game.canvas.setAttribute(
          "aria-label",
          "Resonance Archive（共鸣档案） · 互动钢琴世界",
        );
      },
    },
  };
}
