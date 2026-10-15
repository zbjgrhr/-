"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUiStore } from "@/store/uiStore";

type TutorialStep = { selector: string; zh: string; en: string; noteZh: string; noteEn: string };
type TargetBox = { left: number; top: number; width: number; height: number; x: number; y: number };

const steps: TutorialStep[] = [
  { selector: ".map-preview__creature", zh: "点击地图上的小怪兽，投出捕捉蛋。", en: "Tap a creature to throw a capture egg.", noteZh: "捕捉成功后，会出现对应的项目卡。", noteEn: "A successful capture reveals its project card." },
  { selector: ".encounter-card__main", zh: "点击项目卡，打开真实的作品详情。", en: "Tap the card to open the full project.", noteZh: "项目背景、设计过程和成果都在这里。", noteEn: "Explore the context, process, and results." },
  { selector: ".project-detail__back", zh: "看完后，点击“返回地图”继续探索。", en: "Use Back to Map when you're ready to explore more.", noteZh: "详情页还可以向下滚动，查看图片和项目链接。", noteEn: "Scroll the detail page for images and project links." },
  { selector: ".map-preview__rhythm-portal", zh: "点击左下角“音游入口”，进入演奏作品集。", en: "Tap the rhythm portal to enter the playable portfolio.", noteZh: "接下来会在音游界面演示选关和演奏。", noteEn: "Next, learn the controls on the rhythm pages." },
  { selector: ".level-option[data-active='true']", zh: "在左侧点击想体验的乐章。", en: "Choose a movement from the level list.", noteZh: "五个关卡都已开放，可以自由选择。", noteEn: "All five levels are unlocked." },
  { selector: ".level-start", zh: "点击“开始”，进入选中的乐章。", en: "Tap Start to play the selected movement.", noteZh: "接下来用真实音游画面逐键演示，不必等待加载。", noteEn: "The next guide uses real game frames, without a loading wait." },
  { selector: ".portfolio-tutorial__rhythm-key--active", zh: "音符到达判定线时，按对应琴键。", en: "Press the matching key as the note reaches the judgment line.", noteZh: "跟着画面，依次体验 D、F、空格、J、K。", noteEn: "Try D, F, Space, J, and K in order." },
  { selector: ".portfolio-tutorial__rhythm-return", zh: "点击“返回地图”，回到探索世界。", en: "Tap Back to Map to return to the world.", noteZh: "正式体验时，你也可以随时从音游返回地图。", noteEn: "You can return to the map from the real game, too." },
  { selector: ".map-preview__menu-trigger", zh: "点击右上角九点图标，打开作品集目录。", en: "Tap the nine-dot icon to open the portfolio menu.", noteZh: "这里可以找到“关于我”和“联系我”。", noteEn: "Find About and Contact here." },
  { selector: ".map-preview__menu-card", zh: "点击“关于我”，了解作品集作者。", en: "Tap About to learn about the creator.", noteZh: "以后也可以随时从目录重看教程。", noteEn: "You can replay this guide from the menu later." },
];

const laneNames = ["D", "F", "空格", "J", "K"];
const laneNamesEn = ["D", "F", "Space", "J", "K"];
const laneCodes = ["KeyD", "KeyF", "Space", "KeyJ", "KeyK"];
const keyX = [29.1, 38.55, 50, 61.3, 70.8];
const dispatchMap = (action: string) => window.dispatchEvent(new CustomEvent("portfolio:tutorial", { detail: action }));
const delay = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function PortfolioTutorial() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useUiStore((state) => state.locale);
  const setMode = useUiStore((state) => state.setMode);
  const [step, setStep] = useState<number | null>(null);
  const [rhythmFrame, setRhythmFrame] = useState(0);
  const [finished, setFinished] = useState(false);
  const [target, setTarget] = useState<TargetBox | null>(null);
  const [busy, setBusy] = useState(false);
  const syncedRoute = useRef("");
  const isMap = pathname === "/";

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("tutorial") === "1";
    const stored = window.sessionStorage.getItem("portfolio-tutorial-step");
    if (stored !== null) {
      const number = Number(stored);
      if (Number.isInteger(number) && number >= 0 && number < steps.length) setStep(number);
    } else if (isMap && (forced || window.localStorage.getItem("portfolio-tutorial-done") !== "1")) {
      window.sessionStorage.setItem("portfolio-tutorial-step", "0");
      setStep(0);
    }
  }, [isMap]);

  useEffect(() => {
    const replay = () => {
      syncedRoute.current = "";
      setFinished(false);
      setRhythmFrame(0);
      setStep(0);
      window.sessionStorage.setItem("portfolio-tutorial-step", "0");
    };
    window.addEventListener("portfolio:tutorial-replay", replay);
    return () => window.removeEventListener("portfolio:tutorial-replay", replay);
  }, []);

  useEffect(() => {
    if (step === null) return;
    window.sessionStorage.setItem("portfolio-tutorial-step", String(step));
    if (isMap) {
      const key = `${pathname}:${step}`;
      if (syncedRoute.current !== key) {
        syncedRoute.current = key;
        const action = step === 1 ? "card" : step === 2 ? "detail" : step === 9 ? "menu" : "setup";
        const timer = window.setTimeout(() => dispatchMap(action), 30);
        return () => window.clearTimeout(timer);
      }
    }
    if (!isMap && step === 4) setMode("entry");
  }, [isMap, pathname, setMode, step]);

  useEffect(() => {
    if (finished) return;
    if (step !== null && step >= 4 && step <= 7 && isMap) router.push("/play/");
    if (step !== null && step >= 8 && !isMap) router.push("/");
  }, [finished, isMap, router, step]);

  useEffect(() => {
    if (step === null || finished) return;
    let frame = 0;
    let scrolled = false;
    const update = () => {
      const element = document.querySelector<HTMLElement>(steps[step].selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          if (!scrolled && step !== 6 && step !== 7 && (rect.top < 72 || rect.bottom > window.innerHeight - 170) && document.documentElement.scrollHeight > window.innerHeight + 20) {
            element.scrollIntoView({ block: "center", behavior: "smooth" });
            scrolled = true;
          }
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          setTarget((old) => old && Math.abs(old.x - x) < 1 && Math.abs(old.y - y) < 1 && Math.abs(old.width - rect.width) < 1 ? old : { left: rect.left, top: rect.top, width: rect.width, height: rect.height, x, y });
        } else setTarget(null);
      } else setTarget(null);
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [finished, rhythmFrame, step]);

  const endTutorial = useCallback(() => {
    dispatchMap("end");
    setMode("entry");
    window.localStorage.setItem("portfolio-tutorial-done", "1");
    window.sessionStorage.removeItem("portfolio-tutorial-step");
    setStep(null);
    setFinished(false);
    setTarget(null);
    if (isMap) router.replace("/");
    else router.push("/");
  }, [isMap, router, setMode]);

  const advance = useCallback(async () => {
    if (step === null || busy) return;
    setBusy(true);
    setTarget(null);
    try {
      if (step === 0) { dispatchMap("capture"); await delay(1700); }
      if (step === 1) dispatchMap("detail");
      if (step === 2) dispatchMap("map");
      if (step === 3) setMode("entry");
      if (step === 5) setRhythmFrame(0);
      if (step === 6 && rhythmFrame < laneNames.length - 1) { setRhythmFrame(rhythmFrame + 1); return; }
      if (step === 7) setMode("entry");
      if (step === 8) dispatchMap("menu");
      if (step === steps.length - 1) { dispatchMap("map"); setFinished(true); }
      else setStep(step + 1);
    } finally {
      setBusy(false);
    }
  }, [busy, rhythmFrame, setMode, step]);

  useEffect(() => {
    if (step !== 6 || finished || isMap) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.code !== laneCodes[rhythmFrame]) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      void advance();
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [advance, finished, isMap, rhythmFrame, step]);

  if (step === null || (finished && !isMap) || (!finished && ((step >= 4 && step <= 7 && isMap) || (step >= 8 && !isMap)))) return null;
  const copy = steps[step];
  const showingRhythm = (step === 6 || step === 7) && !finished;
  const keyName = locale === "zh" ? laneNames[rhythmFrame] : laneNamesEn[rhythmFrame];
  return (
    <div className={`portfolio-tutorial portfolio-tutorial--step-${step}`} role={finished ? "presentation" : "button"} tabIndex={finished ? undefined : 0} aria-label={finished ? undefined : locale === "zh" ? "点击任意位置继续教程" : "Tap anywhere to continue the guide"} onClick={finished ? undefined : advance} onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || (step !== 6 && event.key === " "))) { event.preventDefault(); void advance(); } }}>
      {showingRhythm && (
        <div className="portfolio-tutorial__rhythm-stage" aria-hidden="true">
          <div className="portfolio-tutorial__rhythm-screen">
            <Image src={`/tutorial/rhythm-frame-${rhythmFrame + 1}.png?v=real-notes`} alt="" fill sizes="100vw" unoptimized priority />
            {step === 6 && (
              <>
                <Image key={`before-${rhythmFrame}`} className="portfolio-tutorial__rhythm-before" src={`/tutorial/rhythm-before-${rhythmFrame + 1}.png?v=real-notes`} alt="" fill sizes="100vw" unoptimized priority />
                <span key={`key-${rhythmFrame}`} className={`portfolio-tutorial__rhythm-key portfolio-tutorial__rhythm-key--active ${rhythmFrame === 2 ? "portfolio-tutorial__rhythm-key--space" : ""}`} style={{ left: `${keyX[rhythmFrame]}%` }} />
              </>
            )}
            <span className="portfolio-tutorial__rhythm-return" />
          </div>
        </div>
      )}
      {finished ? (
        <div className="portfolio-tutorial__finish">
          <span>{locale === "zh" ? "操作指引完成" : "GUIDE COMPLETE"}</span>
          <h2>{locale === "zh" ? "现在，亲自走进这张地图。" : "Now explore the map for yourself."}</h2>
          <button type="button" onClick={(event) => { event.stopPropagation(); endTutorial(); }}>{locale === "zh" ? "开始体验" : "Start Exploring"}</button>
        </div>
      ) : (
        <>
          {target && (
            <>
              <span className="portfolio-tutorial__outline" style={{ left: target.left - 7, top: target.top - 7, width: target.width + 14, height: target.height + 14 }} />
              <span key={`ring-${step}-${rhythmFrame}`} className="portfolio-tutorial__ripple" style={{ left: target.x, top: target.y }} />
              <Image key={`hand-${step}-${rhythmFrame}`} className="portfolio-tutorial__hand" src="/map-preview/thumb-guide.svg" alt="" width={90} height={109} unoptimized style={{ left: target.x - 53, top: step === 6 ? target.y - 102 : target.y - 9 }} />
            </>
          )}
          <div className="portfolio-tutorial__caption" aria-live="polite">
            <span>{locale === "zh" ? "操作指引" : "GUIDE"} {String(step + 1).padStart(2, "0")} / {steps.length}{step === 6 ? ` · ${rhythmFrame + 1} / 5` : ""}</span>
            <h2>{step === 6 ? locale === "zh" ? `音符到达判定线时，按 ${keyName}。` : `When the note reaches the line, press ${keyName}.` : locale === "zh" ? copy.zh : copy.en}</h2>
            <p>{locale === "zh" ? copy.noteZh : copy.noteEn}</p>
            <small>{step === 6 ? locale === "zh" ? `按 ${keyName} 或点击任意位置继续` : `Press ${keyName} or tap anywhere to continue` : locale === "zh" ? "点击任意位置继续" : "Tap anywhere to continue"}</small>
          </div>
          <button className="portfolio-tutorial__skip" type="button" onClick={(event) => { event.stopPropagation(); if (!isMap) { setMode("entry"); router.push("/"); } else dispatchMap("map"); setFinished(true); }}>{locale === "zh" ? "跳过教程" : "Skip guide"}</button>
        </>
      )}
    </div>
  );
}
