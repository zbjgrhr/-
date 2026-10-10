"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getContent } from "@/content";
import {
  DIFFICULTY_LABELS,
  getGameLevel,
  localize,
} from "@/data/gameLevels";
import { getGameBridge } from "@/game/bridge/GameBridge";
import { useUiStore } from "@/store/uiStore";

const KEY_LABELS = ["D", "F", "SPACE", "J", "K"];

export function GameHUD() {
  const mode = useUiStore((state) => state.mode);
  const locale = useUiStore((state) => state.locale);
  const selectedLevelId = useUiStore((state) => state.selectedLevelId);
  const segment = useUiStore((state) => state.segment);
  const combo = useUiStore((state) => state.combo);
  const revealLevel = useUiStore((state) => state.revealLevel);
  const lastJudgment = useUiStore((state) => state.lastJudgment);
  const levelProgress = useUiStore((state) => state.levelProgress);
  const loadingProgress = useUiStore((state) => state.loadingProgress);
  const paused = useUiStore((state) => state.paused);
  const soundEnabled = useUiStore((state) => state.soundEnabled);
  const assistMode = useUiStore((state) => state.assistMode);
  const caption = useUiStore((state) => state.caption);
  const unlockedProjects = useUiStore((state) => state.unlockedProjects);
  const chapter = useUiStore((state) => state.chapter);
  const setPaused = useUiStore((state) => state.setPaused);
  const setSoundEnabled = useUiStore((state) => state.setSoundEnabled);
  const setAssistMode = useUiStore((state) => state.setAssistMode);
  const setLocale = useUiStore((state) => state.setLocale);
  const setMode = useUiStore((state) => state.setMode);
  const openArchive = useUiStore((state) => state.openArchive);
  const level = getGameLevel(selectedLevelId);
  const content = getContent(locale);
  const resonance = combo >= 15;

  if (mode !== "play") return null;

  const togglePause = () => {
    const next = !paused;
    setPaused(next);
    getGameBridge().sendCommand({ type: next ? "pause" : "resume" });
  };

  const exitToLevels = () => {
    getGameBridge().sendCommand({ type: "pause" });
    setPaused(false);
    setMode("entry");
  };

  return (
    <>
      <div className="game-dream-overlay" aria-hidden>
        <i className="game-dream-glow game-dream-glow-left" />
        <i className="game-dream-glow game-dream-glow-right" />
        <i className="game-paper-fragment game-paper-fragment-one" />
        <i className="game-paper-fragment game-paper-fragment-two" />
        <i className="game-paper-fragment game-paper-fragment-three" />
      </div>
      {!paused && (
        <Link href="/" className="game-map-return game-map-return--play" onClick={exitToLevels}>
          <span aria-hidden>←</span>
          <span>{locale === "en" ? "Back to Map" : "返回地图"}</span>
        </Link>
      )}
      <div
        className={`game-hud game-hud-${level.difficulty}`}
        id="game-hud"
        tabIndex={-1}
        data-resonance={resonance}
        style={{ "--level-accent": level.accent } as React.CSSProperties}
        aria-live="polite"
      >
        <div className="hud-stage">
          <span>STAGE 0{level.order}</span>
          <div>
            <strong>{localize(level.shortTitle, locale)}</strong>
            <small className="hud-track">♪ {level.track}</small>
            <small className="hud-difficulty">{localize(DIFFICULTY_LABELS[level.difficulty], locale)} · {level.bpm} BPM</small>
          </div>
        </div>

        <div className="hud-performance">
          <span className="hud-segment">
            {segment === "showcase" ? (locale === "en" ? "Memory" : "记忆") : segment === "climax" ? (locale === "en" ? "Resonance" : "共鸣") : (locale === "en" ? "Performance" : "演奏")}
          </span>
          <span className="hud-memory">{String(revealLevel).padStart(2, "0")} / 04</span>
          <span className={`hud-combo ${resonance ? "is-resonant" : ""}`}>
            <strong>{combo}</strong>
            <small>{resonance ? (locale === "en" ? "Resonance Status" : "共鸣状态") : (locale === "en" ? "Combo" : "连击")}</small>
          </span>
          {lastJudgment && (
            <span className={`hud-judge hud-judge-${lastJudgment}`}>
              {locale === "en"
                ? lastJudgment
                : { perfect: "完美", great: "优秀", miss: "失误" }[lastJudgment]}
            </span>
          )}
        </div>

        <div className="hud-actions">
          <button type="button" onClick={togglePause}>{paused ? content.hud.resume : content.hud.pause}</button>
          <button
            type="button"
            aria-pressed={soundEnabled}
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              getGameBridge().sendCommand({ type: "setSound", enabled: !soundEnabled });
            }}
          >
            {locale === "en"
              ? soundEnabled ? "SOUND ON" : "SOUND OFF"
              : soundEnabled ? "声音：开" : "声音：关"}
          </button>
          <button
            type="button"
            aria-pressed={assistMode}
            onClick={() => {
              setAssistMode(!assistMode);
              getGameBridge().sendCommand({ type: "setAssist", enabled: !assistMode });
            }}
          >
            {locale === "en"
              ? assistMode ? "ASSIST ON" : "ASSIST"
              : assistMode ? "辅助：开" : "辅助：关"}
          </button>
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
          {unlockedProjects.includes(level.id) && (
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                getGameBridge().sendCommand({ type: "pause" });
                openArchive(level.id);
              }}
            >
              {locale === "en" ? "Archive" : "档案"}
            </button>
          )}
          <button type="button" onClick={exitToLevels}>{locale === "en" ? "Level Select" : "选关"}</button>
        </div>

        <div className="hud-progress" aria-label={`${Math.round(levelProgress * 100)}%`}>
          <i style={{ width: `${Math.max(0, Math.min(100, levelProgress * 100))}%` }} />
          {[
            [0.08, locale === "en" ? "Depart" : "启程"],
            [0.34, locale === "en" ? "Unfold" : "展开"],
            [0.66, locale === "en" ? "Reflect" : "回望"],
            [0.94, locale === "en" ? "Arrive" : "抵达"],
          ].map(([point, label]) => (
            <span
              key={String(label)}
              className="hud-progress-stop"
              data-active={levelProgress >= Number(point)}
              style={{ left: `${Number(point) * 100}%` }}
            >
              <b />
              <small>{label}</small>
            </span>
          ))}
          <strong>{Math.round(levelProgress * 100)}%</strong>
        </div>
      </div>

      {loadingProgress < 1 && (
        <div
          className="game-loading-screen"
          style={{ "--level-accent": level.accent } as React.CSSProperties}
          role="status"
          aria-live="polite"
        >
          <div>
            <p>{locale === "en" ? "LOADING" : "正在加载"} STAGE 0{level.order}</p>
            <h2>{localize(level.title, locale)}</h2>
            <div className="loading-track">
              <strong>♪ {level.track}</strong>
              <small>{level.artist}</small>
            </div>
            <span>{locale === "en" ? "Turning the recording into a playable memory…" : "正在把乐曲展开成一段可演奏的记忆…"}</span>
            <i><b style={{ width: `${Math.round(loadingProgress * 100)}%` }} /></i>
            <small>{Math.round(loadingProgress * 100)}%</small>
          </div>
        </div>
      )}

      {caption && !paused && <div className="caption-bar" role="status">{caption}</div>}

      {paused && chapter === "coda" && <CodaOverlay />}
      {paused && chapter !== "coda" && <PauseOverlay />}
      <PianoControls
        accent={level.accent}
        disabled={paused || loadingProgress < 1}
        locale={locale}
        judgment={lastJudgment}
      />
    </>
  );
}

function PauseOverlay() {
  const locale = useUiStore((state) => state.locale);
  const selectedLevelId = useUiStore((state) => state.selectedLevelId);
  const setPaused = useUiStore((state) => state.setPaused);
  const setMode = useUiStore((state) => state.setMode);
  const level = getGameLevel(selectedLevelId);

  return (
    <div className="overlay-panel game-pause-panel" role="dialog" aria-modal>
      <p>STAGE 0{level.order} · {localize(DIFFICULTY_LABELS[level.difficulty], locale)}</p>
      <h2>{locale === "en" ? "Performance Paused" : "演奏已暂停"}</h2>
      <small className="pause-track">♪ {level.track}<br />{level.artist}</small>
      <button
        type="button"
        className="btn-primary"
        onClick={() => {
          setPaused(false);
          getGameBridge().sendCommand({ type: "resume" });
        }}
      >
        {locale === "en" ? "Resume" : "继续演奏"}
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => {
          setPaused(false);
          getGameBridge().sendCommand({ type: "replay" });
        }}
      >
        {locale === "en" ? "Restart" : "重新开始"}
      </button>
      <button
        type="button"
        className="btn-ghost"
        onClick={() => {
          getGameBridge().sendCommand({ type: "pause" });
          setPaused(false);
          setMode("entry");
        }}
      >
        {locale === "en" ? "Back to Level Select" : "返回选关"}
      </button>
      <Link href="/" className="btn-ghost" onClick={() => { setPaused(false); setMode("entry"); }}>
        {locale === "en" ? "Back to Map" : "返回地图"}
      </Link>
    </div>
  );
}

function CodaOverlay() {
  const locale = useUiStore((state) => state.locale);
  const selectedLevelId = useUiStore((state) => state.selectedLevelId);
  const maxCombo = useUiStore((state) => state.maxCombo);
  const phrasePerfect = useUiStore((state) => state.phrasePerfect);
  const setPaused = useUiStore((state) => state.setPaused);
  const setMode = useUiStore((state) => state.setMode);
  const level = getGameLevel(selectedLevelId);

  return (
    <div
      className={`overlay-panel coda-panel coda-panel-${level.difficulty}`}
      style={{ "--level-accent": level.accent } as React.CSSProperties}
      role="dialog"
      aria-modal
    >
      <p>{locale === "en" ? "Level Complete" : "关卡完成"} · 0{level.order}</p>
      <h2>{localize(level.title, locale)}</h2>
      <blockquote>{localize(level.ending, locale)}</blockquote>
      <div className="coda-results">
        <div><strong>{maxCombo}</strong><span>{locale === "en" ? "Highest Combo" : "最高连击"}</span></div>
        <div><strong>{phrasePerfect ? "S" : "A"}</strong><span>{locale === "en" ? "Level Grade" : "关卡评级"}</span></div>
      </div>
      <div className="coda-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setPaused(false);
            getGameBridge().sendCommand({ type: "replay" });
          }}
        >
          {locale === "en" ? "Replay Level" : "重玩关卡"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setPaused(false);
            setMode("entry");
          }}
        >
          {locale === "en" ? "Choose Another Level" : "选择其他关卡"}
        </button>
        <Link href="/" className="btn-ghost" onClick={() => { setPaused(false); setMode("entry"); }}>
          {locale === "en" ? "Back to Map" : "返回地图"}
        </Link>
      </div>
    </div>
  );
}

function PianoControls({
  accent,
  disabled,
  locale,
  judgment,
}: {
  accent: string;
  disabled: boolean;
  locale: "en" | "zh";
  judgment: "perfect" | "great" | "miss" | null;
}) {
  const [pressedLanes, setPressedLanes] = useState<number[]>([]);

  useEffect(() => {
    const keyToLane: Record<string, number> = { KeyD: 0, KeyF: 1, Space: 2, KeyJ: 3, KeyK: 4 };
    const press = (event: KeyboardEvent) => {
      const lane = keyToLane[event.code];
      if (lane === undefined || event.repeat) return;
      setPressedLanes((current) => current.includes(lane) ? current : [...current, lane]);
    };
    const release = (event: KeyboardEvent) => {
      const lane = keyToLane[event.code];
      if (lane === undefined) return;
      setPressedLanes((current) => current.filter((value) => value !== lane));
    };
    const clear = () => setPressedLanes([]);

    window.addEventListener("keydown", press);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", press);
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", clear);
    };
  }, []);

  useEffect(() => {
    if (disabled) setPressedLanes([]);
  }, [disabled]);

  const releaseLane = (lane: number) => {
    setPressedLanes((current) => current.filter((value) => value !== lane));
    getGameBridge().sendCommand({ type: "releaseLane", lane });
  };

  return (
    <div
      className="rhythm-keyboard"
      aria-label={locale === "en" ? "Five clickable piano keys mapped to D, F, Space, J, and K" : "五个可点击的钢琴按键，分别对应 D、F、空格、J、K"}
      data-disabled={disabled}
      data-judgment={judgment ?? undefined}
      style={{ "--level-accent": accent } as React.CSSProperties}
    >
      <span className="rhythm-keyboard-label">
        {locale === "en" ? "Keyboard or Mouse" : "键盘或鼠标点击"}
      </span>
      {KEY_LABELS.map((label, lane) => (
        <button
          key={label}
          type="button"
          className="rhythm-piano-key"
          data-wide={label === "SPACE"}
          data-active={pressedLanes.includes(lane)}
          disabled={disabled}
          aria-label={locale === "en" ? `Lane ${lane + 1}, key ${label}` : `第 ${lane + 1} 轨，按键 ${label}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            setPressedLanes((current) => current.includes(lane) ? current : [...current, lane]);
            getGameBridge().sendCommand({ type: "hitLane", lane });
          }}
          onPointerUp={() => releaseLane(lane)}
          onPointerCancel={() => releaseLane(lane)}
          onLostPointerCapture={() => releaseLane(lane)}
        >
          <span>{label}</span>
          <i aria-hidden />
        </button>
      ))}
    </div>
  );
}
