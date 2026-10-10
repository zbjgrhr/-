"use client";

import dynamic from "next/dynamic";
import { A11yChrome } from "@/components/accessibility/A11yChrome";
import { ErrorBoundary } from "@/components/accessibility/ErrorBoundary";
import { ModalLayers } from "@/components/accessibility/ModalLayers";
import { ArchivePanel } from "@/components/archive/ArchivePanel";
import { GameHUD } from "@/components/game/GameHUD";
import { EntryGate } from "@/components/navigation/EntryGate";
import { getGameLevel } from "@/data/gameLevels";
import { useUiStore } from "@/store/uiStore";
import type { CSSProperties } from "react";

const GameCanvas = dynamic(
  () => import("@/components/game/GameCanvas").then((module) => module.GameCanvas),
  { ssr: false },
);

export function GameExperience() {
  const mode = useUiStore((state) => state.mode);
  const selectedLevelId = useUiStore((state) => state.selectedLevelId);
  const level = getGameLevel(selectedLevelId);
  const projectStyle = {
    "--project-background": `url("${level.backdrop}")`,
    "--project-background-size": level.backdropCropTop ? "auto 128%" : "cover",
    "--project-background-position": level.backdropCropTop ? "center bottom" : "center",
  } as CSSProperties;

  return (
    <ErrorBoundary>
      <div className="app-shell game-experience-shell" style={projectStyle}>
        <A11yChrome />
        {mode === "play" && <GameCanvas />}
        <EntryGate />
        <GameHUD />
        <ArchivePanel />
        <ModalLayers />
      </div>
    </ErrorBoundary>
  );
}
