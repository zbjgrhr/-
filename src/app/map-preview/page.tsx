"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "@/data/projects";
import { publicLinks } from "@/data/profile";
import "./preview.css";
import "./menu-overlay.css";
import "./capture.css";
import "./encounter.css";

type MenuView = "index" | "about" | "contact";
type CapturePoint = { key: number; x: number; y: number; throwX: number; throwY: number; midX: number; midY: number; hit: boolean; target?: Encounter };
type SpawnPoint = { x: number; y: number };
type Encounter = { projectId: string; point: SpawnPoint; key: number; createdAt: number; leavingAt?: number };

const spawnPoints: SpawnPoint[] = [
  { x: .27, y: .58 }, { x: .37, y: .69 }, { x: .49, y: .53 },
  { x: .63, y: .67 }, { x: .73, y: .48 }, { x: .45, y: .75 },
];
const creatureImages: Record<string, string> = {
  "pixel-world": "/map-preview/pixel-world-creature-concept-01.png",
  preservative: "/map-preview/preservative-creature.png",
  "rainy-arcade": "/map-preview/rainy-night-arcade-creature.png",
  iwbtz: "/map-preview/iwbtz-creature.png",
  "auto-tune": "/map-preview/auto-tune-creature.png",
  "study-assistant": "/map-preview/literature-research-assistant-creature.png",
};

const conceptImages: Record<string, string> = {
  "pixel-world": "/portfolio/pixel-world-concept-cover.png",
  preservative: "/map-preview/concepts/preservative.png",
  "rainy-arcade": "/map-preview/concepts/rainy-arcade.png",
  iwbtz: "/map-preview/concepts/iwbtz.png",
  "auto-tune": "/map-preview/concepts/auto-tune.png",
  "study-assistant": "/map-preview/concepts/literature-research-assistant.png",
};

function shuffledProjectIds(previous?: string) {
  const ids = projects.map((project) => project.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  if (ids.length > 1 && ids[0] === previous) [ids[0], ids[1]] = [ids[1], ids[0]];
  return ids;
}

const discoveryKey = "interactive-portfolio-discovered";
const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

function formatLocalDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return year + "." + month + "." + day + " · " + weekdays[value.getDay()];
}

function formatLocalTime(value: Date) {
  return [value.getHours(), value.getMinutes(), value.getSeconds()]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function NineDots({ size = 30 }: { size?: number }) {
  return (
    <Image
      src="/map-preview/nine-dots.svg"
      alt=""
      width={size}
      height={size}
      unoptimized
    />
  );
}

function CreatureArt({ projectId, className = "" }: { projectId: string; className?: string }) {
  const src = creatureImages[projectId];
  return (
    <span className={"creature-art creature-art--" + projectId + " " + className} aria-hidden="true">
      <Image className="creature-art__part creature-art__part--body" src={src} alt="" fill sizes="(max-width: 650px) 120px, 190px" unoptimized />
      <Image className="creature-art__part creature-art__part--accent-a" src={src} alt="" fill sizes="(max-width: 650px) 120px, 190px" unoptimized />
      <Image className="creature-art__part creature-art__part--accent-b" src={src} alt="" fill sizes="(max-width: 650px) 120px, 190px" unoptimized />
    </span>
  );
}

export default function MapPreviewPage() {
  const stageRef = useRef<HTMLElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const spawnKey = useRef(0);
  const [ready, setReady] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);
  const [localTime, setLocalTime] = useState<Date | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuView, setMenuView] = useState<MenuView>("index");
  const [showQr, setShowQr] = useState(false);
  const [capture, setCapture] = useState<CapturePoint | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [selectedEncounter, setSelectedEncounter] = useState<Encounter | null>(null);
  const [hoveredKey, setHoveredKey] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [cardOpen, setCardOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const introTimer = window.setTimeout(() => setReady(true), 1450);
    const updateTime = () => setLocalTime(new Date());
    updateTime();
    const clockTimer = window.setInterval(updateTime, 1000);

    const validIds = new Set<string>(projects.map((project) => project.id));
    try {
      const saved = JSON.parse(window.localStorage.getItem(discoveryKey) || "[]");
      if (Array.isArray(saved)) {
        setDiscoveredIds(saved.filter((id): id is string => typeof id === "string" && validIds.has(id)));
      }
    } catch {
      setDiscoveredIds([]);
    }

    const handleDiscovery = (event: Event) => {
      const projectId = (event as CustomEvent<string>).detail;
      if (!validIds.has(projectId)) return;
      setDiscoveredIds((current) => {
        const next = current.includes(projectId) ? current : [...current, projectId];
        window.localStorage.setItem(discoveryKey, JSON.stringify(next));
        return next;
      });
    };
    window.addEventListener("portfolio:project-discovered", handleDiscovery);

    return () => {
      window.clearTimeout(introTimer);
      window.clearInterval(clockTimer);
      window.removeEventListener("portfolio:project-discovered", handleDiscovery);
      if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
    };
  }, []);

  useEffect(() => {
    if (!ready || menuOpen || cardOpen || detailOpen || capture) return;
    const rotate = () => setEncounters((current) => {
      const now = Date.now();
      const next = current.filter((item) => !item.leavingAt || now - item.leavingAt < 550);
      const visible = next.filter((item) => !item.leavingAt);
      if (visible.length >= 4) {
        const oldest = [...visible].sort((a, b) => a.createdAt - b.createdAt)[0];
        if (oldest && now - oldest.createdAt > 3300 && oldest.key !== hoveredKey) {
          const index = next.findIndex((item) => item.key === oldest.key);
          next[index] = { ...oldest, leavingAt: now };
        }
      }
      const occupiedIds = new Set(next.map((item) => item.projectId));
      const occupiedPoints = new Set(next.map((item) => item.point));
      const availableIds = shuffledProjectIds().filter((id) => !occupiedIds.has(id));
      const availablePoints = spawnPoints.filter((point) => !occupiedPoints.has(point));
      // Keep at least four visible encounters; a fifth appears before the oldest leaves.
      const targetCount = current.length === 0 ? 4 : 5;
      while (next.filter((item) => !item.leavingAt).length < targetCount && availableIds.length && availablePoints.length) {
        const projectId = availableIds.pop()!;
        const point = availablePoints.splice(Math.floor(Math.random() * availablePoints.length), 1)[0];
        next.push({ projectId, point, key: ++spawnKey.current, createdAt: now });
      }
      return next;
    });
    rotate();
    const timer = window.setInterval(rotate, 1250);
    return () => window.clearInterval(timer);
  }, [ready, menuOpen, cardOpen, detailOpen, capture, hoveredKey]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!cardOpen && !detailOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDetailOpen(false);
      setCardOpen(false);
      setCapture(null);
      setSelectedEncounter(null);
      setHoveredKey(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [cardOpen, detailOpen]);

  useEffect(() => {
    if (!capture) return;
    const impact = window.setTimeout(() => {
      if (capture.hit && capture.target) {
        setFeedback("");
        setSelectedEncounter(capture.target);
        setCardOpen(true);
        window.dispatchEvent(new CustomEvent("portfolio:project-discovered", { detail: capture.target.projectId }));
      } else {
        setFeedback("很遗憾，你没抓住，再抓一次~");
      }
    }, capture.hit ? 1400 : 900);
    const finish = window.setTimeout(() => {
      if (!capture.hit) {
        setFeedback("");
        setHoveredKey(null);
      }
      setCapture(null);
    }, capture.hit ? 1650 : 2550);
    return () => {
      window.clearTimeout(impact);
      window.clearTimeout(finish);
    };
  }, [capture]);

  const showCapture = (x: number, y: number, preferred?: Encounter) => {
    if (capture || cardOpen || detailOpen) return;
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const targetX = Math.max(65, Math.min(bounds.width - 65, x));
    const targetY = Math.max(95, Math.min(bounds.height - 85, y));
    const throwX = bounds.width * .76 - targetX;
    const throwY = bounds.height + 70 - targetY;
    const target = preferred || encounters.filter((item) => !item.leavingAt).find((item) =>
      Math.hypot(targetX - item.point.x * bounds.width, targetY - item.point.y * bounds.height) < 78
    );
    const hit = !!target;
    setFeedback("");
    setCapture({
      key: Date.now(),
      x: targetX,
      y: targetY,
      throwX,
      throwY,
      midX: throwX * .43,
      midY: throwY * .42 - 115,
      hit,
      target,
    });
  };

  const clickMap = (event: React.MouseEvent<HTMLElement>) => {
    if (!ready || menuOpen || (event.target as HTMLElement).closest(".map-preview__header, .map-preview__footer, .map-preview__menu, .map-preview__creature, .encounter-card, .project-detail")) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    showCapture(event.clientX - bounds.left, event.clientY - bounds.top);
  };

  const keyMap = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!ready || menuOpen || !["Enter", " "].includes(event.key) || event.target !== event.currentTarget) return;
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    showCapture(bounds.width * .5, bounds.height * .5);
  };

  const clickCreature = (encounter: Encounter) => {
    if (!ready || capture || encounter.leavingAt) return;
    const bounds = stageRef.current?.getBoundingClientRect();
    if (bounds) showCapture(encounter.point.x * bounds.width, encounter.point.y * bounds.height, encounter);
  };

  const closeCard = () => {
    setDetailOpen(false);
    setCardOpen(false);
    setCapture(null);
    setSelectedEncounter(null);
    setHoveredKey(null);
    setEncounters((current) => current.filter((item) => item.key !== selectedEncounter?.key));
  };

  const movePointer = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || menuOpen) return;
    setHasPointer(true);
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (pointerFrame.current !== null) window.cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = window.requestAnimationFrame(() => {
      stageRef.current?.style.setProperty("--pointer-x", x + "px");
      stageRef.current?.style.setProperty("--pointer-y", y + "px");
      stageRef.current?.style.setProperty("--drift-x", (x / bounds.width - 0.5) * -14 + "px");
      stageRef.current?.style.setProperty("--drift-y", (y / bounds.height - 0.5) * -10 + "px");
    });
  };

  const openMenu = () => {
    setMenuView("index");
    setShowQr(false);
    setMenuOpen(true);
    setHasPointer(false);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const discoveredCount = Math.min(discoveredIds.length, projects.length);
  const encounter = selectedEncounter;
  const hoveredEncounter = encounters.find((item) => item.key === hoveredKey && !item.leavingAt);
  const hoveredProject = projects.find((project) => project.id === hoveredEncounter?.projectId);
  const hoveredConcept = hoveredProject && conceptImages[hoveredProject.id];
  const activeProject = projects.find((project) => project.id === encounter?.projectId);
  const activeConcept = activeProject && (conceptImages[activeProject.id] || activeProject.screenshots[0]);

  return (
    <main
      ref={stageRef}
      className={"map-preview map-preview--immersive" + (ready ? " is-ready" : "") + (hasPointer ? " has-pointer" : "") + (menuOpen ? " menu-open" : "")}
      onPointerMove={movePointer}
      onPointerLeave={() => setHasPointer(false)}
      onClick={clickMap}
      onKeyDown={keyMap}
      tabIndex={0}
      aria-label="个人互动作品集探索地图"
    >
      <div className="map-preview__scene" aria-hidden="true" />
      <div className="map-preview__color" aria-hidden="true" />
      <div className="map-preview__sunlight" aria-hidden="true" />
      <div className="map-preview__mist" aria-hidden="true" />
      <div className="map-preview__grain" aria-hidden="true" />
      <div className="map-preview__scanlines" aria-hidden="true" />
      <div className="map-preview__sweep" aria-hidden="true" />
      <div className="map-preview__vignette" aria-hidden="true" />
      <div className="map-preview__pointer-light" aria-hidden="true" />
      <div className="map-preview__glint map-preview__glint--one" aria-hidden="true">✦</div>
      <div className="map-preview__glint map-preview__glint--two" aria-hidden="true">✧</div>
      <div className="map-preview__glint map-preview__glint--three" aria-hidden="true">✦</div>
      <div className="map-preview__glint map-preview__glint--four" aria-hidden="true">✧</div>
      <div className="map-preview__cursor" aria-hidden="true"><span>✦</span></div>

      {ready && !cardOpen && !detailOpen && encounters.map((item) => (
        <button
          key={item.key}
          type="button"
          className={"map-preview__creature map-preview__creature--" + item.projectId + (capture?.target?.key === item.key ? " is-catching" : "") + (item.leavingAt ? " is-leaving" : "")}
          style={{ "--creature-x": item.point.x * 100 + "%", "--creature-y": item.point.y * 100 + "%" } as CSSProperties}
          onClick={() => clickCreature(item)}
          onPointerEnter={() => setHoveredKey(item.key)}
          onPointerLeave={() => setHoveredKey((current) => current === item.key ? null : current)}
          onFocus={() => setHoveredKey(item.key)}
          onBlur={() => setHoveredKey((current) => current === item.key ? null : current)}
          aria-label={"向 " + (projects.find((project) => project.id === item.projectId)?.title || "项目") + " 小怪兽投蛋"}
        >
          <CreatureArt projectId={item.projectId} />
        </button>
      ))}

      {hoveredEncounter && hoveredProject && hoveredConcept && !capture && !cardOpen && !detailOpen && (
        <div className="encounter-peek" aria-hidden="true" style={{ "--creature-x": hoveredEncounter.point.x * 100 + "%", "--creature-y": hoveredEncounter.point.y * 100 + "%" } as CSSProperties}>
          <Image src={hoveredConcept} alt="" width={390} height={220} unoptimized />
          <strong>{hoveredProject.title.toUpperCase()}</strong>
        </div>
      )}

      {feedback && <div className="encounter-feedback" role="status">{feedback}</div>}

      {capture && (
        <div
          key={capture.key}
          className="capture-sequence"
          aria-hidden="true"
          style={{
            "--capture-x": capture.x + "px",
            "--capture-y": capture.y + "px",
            "--throw-x": capture.throwX + "px",
            "--throw-y": capture.throwY + "px",
            "--mid-x": capture.midX + "px",
            "--mid-y": capture.midY + "px",
          } as CSSProperties}
        >
          <div className="capture-sequence__flash" />
          <div className="capture-sequence__halo" />
          <div className="capture-sequence__ring capture-sequence__ring--first" />
          <div className="capture-sequence__ring capture-sequence__ring--second" />
          <div className="capture-sequence__egg">
            <Image src="/map-preview/capture-egg.png" alt="" width={110} height={118} unoptimized />
          </div>
          <div className="capture-sequence__star">✦</div>
          <div className="capture-sequence__sparks">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</div>
        </div>
      )}

      {cardOpen && !detailOpen && encounter && activeProject && activeConcept && (
        <div className="encounter-card" style={{ "--creature-x": encounter.point.x * 100 + "%", "--creature-y": encounter.point.y * 100 + "%" } as CSSProperties}>
          <button className="encounter-card__close" type="button" aria-label="关闭项目卡" onClick={closeCard}>×</button>
          <button className="encounter-card__main" type="button" onClick={() => setDetailOpen(true)} aria-label={"查看 " + activeProject.title + " 项目详情"}>
            <Image src={activeConcept} alt={activeProject.title + " 项目图片"} width={560} height={320} unoptimized />
            <span className="encounter-card__text"><strong>{activeProject.title.toUpperCase()}</strong></span>
          </button>
          <span className="encounter-card__creature" role="img" aria-label={activeProject.title + " 小怪兽"}><CreatureArt projectId={encounter.projectId} /></span>
        </div>
      )}

      {detailOpen && activeProject && activeConcept && (
        <div className="project-detail" role="dialog" aria-modal="true" aria-label={activeProject.title + " 项目详情"}>
          <div className="project-detail__panel">
            <button className="project-detail__back" type="button" onClick={closeCard}>← 返回地图</button>
            <div className="project-detail__hero">
              <div><span>{activeProject.category}</span><h1>{activeProject.title}</h1><p>{activeProject.oneLiner}</p></div>
              <Image src={activeConcept} alt={activeProject.title + " 项目图片"} width={960} height={550} unoptimized />
            </div>
            <div className="project-detail__grid">
              <section><h2>项目背景</h2><p>{activeProject.context}</p></section>
              <section><h2>我的角色</h2><p>{activeProject.role}</p></section>
              <section><h2>设计与实现</h2><ul>{activeProject.process.map((step) => <li key={step}>{step}</li>)}</ul></section>
              <section><h2>结果</h2><p>{activeProject.outcome}</p></section>
            </div>
            <div className="project-detail__gallery">
              {activeProject.screenshots.filter((src) => src !== activeConcept).map((src, index) => (
                <Image key={src} src={src} alt={activeProject.title + " 项目图片 " + (index + 2)} width={960} height={540} />
              ))}
            </div>
            <div className="project-detail__links">
              {activeProject.liveDemo && <a className="project-detail__link" href={activeProject.liveDemo} target="_blank" rel="noreferrer">查看在线项目 ↗</a>}
              {activeProject.github && <a className="project-detail__link" href={activeProject.github} target="_blank" rel="noreferrer">查看项目代码 ↗</a>}
            </div>
          </div>
        </div>
      )}

      <div className="map-preview__intro" aria-hidden={ready}>
        <span className="map-preview__intro-mark">✦</span>
        <span className="map-preview__intro-line" />
      </div>

      <header className="map-preview__header">
        <div className="map-preview__identity">
          <Image
            className="map-preview__logo-lockup"
            src="/map-preview/interactive-portfolio-logo.svg"
            alt="个人互动作品集 / Interactive Portfolio"
            width={372}
            height={80}
            unoptimized
          />
          <span className="map-preview__owner">张铧心</span>
        </div>
        <div className="map-preview__header-right">
          <time className="map-preview__clock" dateTime={localTime?.toISOString()}>
            <span>本地时间</span>
            <strong>{localTime ? formatLocalDate(localTime) : "----.--.--"}</strong>
            <b>{localTime ? formatLocalTime(localTime) : "--:--:--"}</b>
          </time>
          <button
            ref={menuButtonRef}
            className="map-preview__menu-trigger"
            type="button"
            aria-label="打开目录"
            aria-expanded={menuOpen}
            onClick={openMenu}
          >
            <NineDots size={31} />
          </button>
        </div>
      </header>

      <footer className="map-preview__footer">
        <div className="map-preview__progress" aria-live="polite">
          {discoveredCount === 0 ? (
            <>已发现 <strong>0/{projects.length}</strong> 个项目 · 寻找地图上的 Pokémon</>
          ) : discoveredCount < projects.length ? (
            <>已发现 <strong>{discoveredCount}/{projects.length}</strong> 个项目 · 继续捕捉 Pokémon</>
          ) : (
            <>
              <strong>{projects.length}/{projects.length}</strong> 个项目已发现，点击右上角
              <button type="button" className="map-preview__inline-menu" aria-label="打开目录" onClick={openMenu}>
                <NineDots size={21} />
              </button>
              查看其他功能。
            </>
          )}
        </div>
      </footer>

      {menuOpen && (
        <div className="map-preview__menu" role="dialog" aria-modal="true" aria-label="作品集目录">
          <div className="map-preview__menu-backdrop" onClick={closeMenu} />
          <div className="map-preview__menu-window">
            <div className="map-preview__menu-art" aria-hidden="true" />
            <div className="map-preview__menu-content">
              <div className="map-preview__menu-actions">
                {menuView !== "index" && (
                  <button type="button" aria-label="返回目录" onClick={() => { setMenuView("index"); setShowQr(false); }}>←</button>
                )}
                <button type="button" aria-label="关闭目录" onClick={closeMenu}>×</button>
              </div>

              {menuView === "index" && (
                <nav className="map-preview__menu-list" aria-label="作品集目录">
                  <button type="button" className="map-preview__menu-card" onClick={() => setMenuView("about")}>
                    <span>01</span><strong>关于我 <small>ABOUT</small></strong><em>张铧心 · 游戏策划 × AI 产品</em><b aria-hidden="true">↗</b>
                  </button>
                  <button type="button" className="map-preview__menu-card" onClick={() => setMenuView("contact")}>
                    <span>02</span><strong>联系我 <small>CONTACT</small></strong><em>邮箱 · GitHub · 微信</em><b aria-hidden="true">↗</b>
                  </button>
                  <Link className="map-preview__menu-card" href="/play">
                    <span>03</span><strong>音游体验 <small>RHYTHM EXPERIENCE</small></strong><em>用另一种方式进入我的作品集</em><b aria-hidden="true">↗</b>
                  </Link>
                </nav>
              )}

              {menuView === "about" && (
                <section className="map-preview__menu-detail">
                  <span>01</span>
                  <h2>关于我 <small>ABOUT</small></h2>
                  <p>我设计世界、规则和 AI 工作流，也让人真正走进去。关注游戏系统、AI 产品设计、互动原型与用户研究。</p>
                </section>
              )}

              {menuView === "contact" && (
                <section className="map-preview__menu-detail">
                  <span>02</span>
                  <h2>联系我 <small>CONTACT</small></h2>
                  <p>想聊游戏策划、AI 产品或互动体验？欢迎联系我。</p>
                  <div className="map-preview__contact-links">
                    <a href={"mailto:" + publicLinks.email}>发送邮件 ↗</a>
                    <a href={publicLinks.github} target="_blank" rel="noreferrer">查看 GitHub ↗</a>
                    <button type="button" aria-expanded={showQr} onClick={() => setShowQr((current) => !current)}>微信二维码 ↗</button>
                  </div>
                  {showQr && <Image className="map-preview__qr" src="/contact/wechat-qr.jpg" alt="微信二维码" width={176} height={176} />}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
