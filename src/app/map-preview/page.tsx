"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { projects } from "@/data/projects";
import { localizeProject } from "@/data/projectTranslations";
import { publicLinks } from "@/data/profile";
import type { ProjectArchive } from "@/types";
import { useUiStore } from "@/store/uiStore";
import "./preview.css";
import "./menu-overlay.css";
import "./capture.css";
import "./encounter.css";

type MenuView = "index" | "about" | "contact";
type CapturePoint = { key: number; x: number; y: number; throwX: number; throwY: number; midX: number; midY: number; hit: boolean; target?: Encounter };
type SpawnPoint = { x: number; y: number };
type Encounter = { projectId: string; point: SpawnPoint; key: number; createdAt: number; leavingAt?: number };
const tutorialEncounter: Encounter = { projectId: "pixel-world", point: { x: .52, y: .43 }, key: -100, createdAt: 0 };

function randomSpawnPoint(occupied: SpawnPoint[]): SpawnPoint | null {
  const sideMargin = window.innerWidth < 650 ? .2 : .11;
  const candidates: { point: SpawnPoint; distance: number }[] = [];
  for (let attempt = 0; attempt < 80; attempt++) {
    const point = {
      x: sideMargin + Math.random() * (1 - sideMargin * 2),
      y: .28 + Math.random() * .5,
    };
    const portal = window.innerWidth < 700 ? { x: .28, y: .76 } : { x: .17, y: .78 };
    if (Math.hypot((point.x - portal.x) * 1.45, point.y - portal.y) < .2) continue;
    const distance = occupied.length ? Math.min(...occupied.map((other) => Math.hypot((point.x - other.x) * 1.45, point.y - other.y))) : 1;
    if (distance > .19) candidates.push({ point, distance });
  }
  candidates.sort((a, b) => b.distance - a.distance);
  return candidates[Math.floor(Math.random() * Math.min(6, candidates.length))]?.point || null;
}
const creatureImages: Record<string, string> = {
  "pixel-world": "/map-preview/pixel-world-creature-concept-01.png",
  preservative: "/map-preview/preservative-creature.png",
  "rainy-arcade": "/map-preview/rainy-night-arcade-creature.png",
  iwbtz: "/map-preview/iwbtz-creature.png",
  "auto-tune": "/map-preview/auto-tune-creature.png",
  "study-assistant": "/map-preview/literature-research-assistant-creature.png",
};

const conceptName = (id: string) => id === "study-assistant" ? "literature-research-assistant" : id;
const conceptCard = (id: string) => `/map-preview/concepts/${conceptName(id)}-card.webp`;
const conceptDetail = (id: string) => `/map-preview/concepts/${conceptName(id)}-detail.webp`;
const galleryImage = (src: string) => src.startsWith("/map-preview/curated/") || src.endsWith(".gif") || src.startsWith("/portfolio/pixel-world-case-") || src === "/portfolio/pixel-world-concept-cover.png" || src.startsWith("/portfolio/preservative-") || src.startsWith("/portfolio/rainy-arcade-") ? src : src.replace("/portfolio/", "/map-preview/gallery/").replace(/\.[^.]+$/, ".webp");
const pixelWorldExpanded = [
  "/portfolio/pixel-world-concept-cover.png",
  "/portfolio/pixel-world-case-01-prompt-spec-agents.png",
  "/portfolio/pixel-world-case-02-model-routing.png",
  "/portfolio/pixel-world-case-03-agent-config.png",
  "/portfolio/pixel-world-case-04-asset-system.png",
  "/portfolio/pixel-world-case-05-cover-particles.png",
  "/portfolio/pixel-world-case-06-generated-world.png",
  "/portfolio/pixel-world-case-07-moonshadow-level.png",
  "/portfolio/pixel-world-case-08-playable-worlds.png",
];
const preservativeExpanded = [
  "/portfolio/preservative-01-concept-approved.png",
  "/portfolio/preservative-02-campaign.png",
  "/portfolio/preservative-03-visual-identity.png",
  "/portfolio/preservative-04-gameplay-evidence.png",
  "/portfolio/preservative-02-workshop.png",
  "/portfolio/preservative-02-report-evidence.png",
  "/portfolio/preservative-02-branded.gif",
  "/portfolio/preservative-02-ingame.gif",
];
const rainyArcadeExpanded = [
  "/portfolio/rainy-arcade-concept-cover.png",
  "/portfolio/rainy-arcade-overview.png",
  "/portfolio/rainy-arcade-character-ensemble.png",
  "/portfolio/rainy-arcade-character-turnarounds.png",
  "/portfolio/rainy-arcade-library-city.png",
  "/portfolio/rainy-arcade-framed-01.png",
  "/portfolio/rainy-arcade-framed-02.png",
  "/portfolio/rainy-arcade-framed-03.png",
];
const iwbtzMotion = [
  "/portfolio/iwbtz-case-03-multi-attack.gif",
  "/portfolio/iwbtz-case-04-core-loop.gif",
  "/portfolio/iwbtz-case-05-boss-pattern.gif",
];
const galleryCaptions: Record<string, { zh: string[]; en: string[] }> = {
  "pixel-world": {
    zh: ["从创意出发，交给十个 Agent 分工复核", "同一套生成流程，展开不同的可玩世界", "让关卡与游戏画面真正跑起来", "模型路由也由创作者清楚掌控", "像素世界制作器的主界面", "提示词、GameSpec 与十个 Agent 的工作流", "按任务与成本选择模型路线", "Agent 配置与分工复核", "素材系统将生成内容整理成可用资源", "封面粒子与世界氛围", "生成游戏的真实入口与菜单", "环境与移动规则随关卡变化", "同一提示词延展出的三种可玩世界"],
    en: ["An idea enters a ten-agent review", "One process, different playable worlds", "Levels and game scenes brought to life", "Model routing stays in the creator's hands", "The Pixel World creator interface", "Prompts, GameSpec, and the ten-agent workflow", "Model routes selected by task and cost", "Agent configuration and review", "The asset system turns generation into usable resources", "Cover particles and world atmosphere", "A real generated game's entry and menu", "Level-specific environments and movement rules", "Three playable worlds from one prompt"],
  },
  preservative: {
    zh: ["把保鲜规则交还给沙盒设置", "在物品信息里看清保护效果", "误食风险与治疗提示同时可见", "模组在游戏中的实际场景", "模组封面与核心视觉", "更轻松的传播视觉方案", "封面、物品与模组图标保持同一识别", "把保护效率与解毒提示放到游玩现场", "Steam 创意工坊的真实发布页面", "玩家访问、订阅与收藏的发布结果", "带品牌识别的动态模组图标", "游戏内的防腐剂物品动图"],
    en: ["Preservation rules in sandbox settings", "Protection details at the point of use", "Poisoning risk and treatment in view", "The mod in its game world", "The mod cover and core visual", "A lighter campaign direction", "One visual identity across cover, item, and mod icon", "Protection and antidote guidance in gameplay context", "The published Steam Workshop page", "Real visits, subscriptions, and favorites", "The animated branded mod icon", "The preservative item animated in-game"],
  },
  "rainy-arcade": {
    zh: ["《积木城》：从道路和记忆里拼回一个家", "《雨城》：在不可靠的规则中找出口", "只留在本地的游玩记录与分析", "从对话选择到线索核对的交互流程", "游戏厅的封面与整体氛围", "从同一大厅通往不同玩法世界", "主要角色与故事关系的视觉设定", "玩家与张华心的角色四视图", "《图书城》的视觉与交互概念（规划中）", "《积木城》可玩界面与章节入口", "《雨城》可玩界面与分段阅读", "《图书城》的界面概念（规划中）"],
    en: ["Block City: rebuilding a home from roads and memories", "Rain City: finding a way through unreliable rules", "Play reports and analysis kept on-device", "From dialogue choices to checking clues", "The arcade's cover and overall atmosphere", "Different ways to play from one shared lobby", "Visual direction for the main cast", "Player and Zhang Huaxin character turnarounds", "Library City visual and interaction concept (planned)", "Playable Block City interface and chapter entry", "Playable Rain City interface and segmented reading", "Library City interface concept (planned)"],
  },
  iwbtz: {
    zh: ["一张图里，看见不同关卡的世界", "Boss 战的攻击模式与躲避节奏", "明亮与阴暗并置的关卡环境", "在机关密布的场景中寻找前进路线", "多重攻击与持续收紧的安全空间", "跳跃、投掷与命中的核心循环", "追咬与陨落火球交织的 Boss 战"],
    en: ["Distinct worlds across the levels", "Attack patterns and timing in a boss fight", "Light and shadow across the game's environments", "Finding a route through the traps", "Layered attacks and a narrowing safe space", "The core loop: jump, throw, land a hit", "A boss encounter of pursuit and falling fire"],
  },
  "auto-tune": {
    zh: ["当前对话旁的可编辑回复面板", "共享核心与三平台页面适配", "仅在 X 私信可用的延迟自动回复"],
    en: ["Editable replies beside the current conversation", "A shared core with three platform adapters", "Delayed automatic replies for X direct messages only"],
  },
  "study-assistant": {
    zh: ["在 Edge 中安装并启用扩展", "阅读工具留在原文页面内", "从选中文字到翻译、高亮与保存", "选中文字后检索相关论文", "本地收藏生词、生句、思维导图与论文", "在原文旁查看已保存笔记", "在网页内翻译并使用多色高亮", "在本地思维导图中整理资料"],
    en: ["Installed and enabled in Edge", "Reading tools stay inside the source page", "From text selection to translation, highlighting, and saving", "Search related papers from selected text", "Vocabulary, sentences, mind maps, and papers saved locally", "Saved notes beside the source", "Translate and highlight in multiple colors on the page", "Organize research in a local mind map"],
  },
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
const englishWeekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function formatLocalDate(value: Date, locale: "zh" | "en") {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return year + "." + month + "." + day + " · " + (locale === "zh" ? weekdays[value.getDay()] : englishWeekdays[value.getDay()]);
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

function ProjectLivePreview({ project, locale }: { project: ProjectArchive; locale: "zh" | "en" }) {
  const [pixelView, setPixelView] = useState<"studio" | "finished">("studio");
  if (!project.liveDemo) return null;
  const pixelWorld = project.id === "pixel-world";
  const finished = pixelWorld && pixelView === "finished";
  const address = new URL(project.liveDemo).hostname;
  const description = project.id === "preservative"
    ? (locale === "zh" ? "在页面内阅读《Project Zomboid》国际化社群与营销分析。" : "Read the Project Zomboid community and marketing report here.")
    : project.id === "rainy-arcade"
      ? (locale === "zh" ? "直接进入雨夜游戏厅，探索可游玩的故事。" : "Step into the arcade and explore its playable stories.")
      : (locale === "zh" ? "在这里体验 Pixel World 制作器。" : "Explore the Pixel World creator here.");

  return (
    <section className={"project-detail__preview project-detail__preview--" + project.id} aria-label={locale === "zh" ? "在线项目预览" : "Live project preview"}>
      <div className="project-detail__preview-heading">
        <div>
          <span>{locale === "zh" ? "先进入作品" : "ENTER THE WORK"}</span>
          <h2>{locale === "zh" ? "在线项目" : "Live project"}</h2>
          <p>{description}</p>
        </div>
        <a className="project-detail__preview-open" href={project.liveDemo} target="_blank" rel="noopener noreferrer">
          {locale === "zh" ? "在新窗口打开 ↗" : "Open in new tab ↗"}
        </a>
      </div>
      {pixelWorld && (
        <div className="project-detail__preview-tabs" role="tablist" aria-label={locale === "zh" ? "Pixel World 体验选择" : "Pixel World experience"}>
          <button type="button" role="tab" aria-selected={!finished} onClick={() => setPixelView("studio")}>{locale === "zh" ? "制作器" : "Creator"}</button>
          <button type="button" role="tab" aria-selected={finished} onClick={() => setPixelView("finished")}>{locale === "zh" ? "成品游戏" : "Finished game"}</button>
        </div>
      )}
      <div className="project-detail__preview-window">
        <div className="project-detail__preview-chrome" aria-hidden="true"><span className="project-detail__preview-dots">•••</span><span>{finished ? (locale === "zh" ? "成品游戏 · 待接入" : "Finished game · coming soon") : address}</span></div>
        {finished ? (
          <div className="project-detail__preview-pending">
            <strong>{locale === "zh" ? "成品游戏入口" : "Finished game"}</strong>
            <p>{locale === "zh" ? "可玩成品收到后，会在这里与制作器一键切换。" : "The playable build will be added here for one-click switching with the creator."}</p>
          </div>
        ) : (
          <iframe key={project.liveDemo} src={project.liveDemo} title={project.title + (locale === "zh" ? "在线项目" : " live project")} loading="lazy" allow="fullscreen; autoplay" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        )}
      </div>
      {pixelWorld && <p className="project-detail__preview-note">{locale === "zh" ? "Pixel World 部署于 Vercel；若页面无法加载，请开启 VPN 后重试，或用右上角在新窗口打开。" : "Pixel World is hosted on Vercel. If it does not load, connect to your VPN or open it in a new tab."}</p>}
    </section>
  );
}

function AboutGameExperience({ locale }: { locale: "zh" | "en" }) {
  if (locale === "en") return (
    <div className="map-preview__game-experience">
      <h3>Game experience</h3>
      <section><h4>Mobile, competitive, and strategy games</h4><p>I placed 27th nationally in the 2022 NetEase Werewolf Masters tournament and reached King rank in Honor of Kings. Long-term play in Clash of Clans, plus Avalon and Last War, informs my understanding of resource growth, alliances, and cross-server competition. Gardenscapes and Merge Harbor add a casual and merge-game perspective.</p><p>Drawing on public material and simulated data, I built the <a href="https://lion-xsog.upma.site/" target="_blank" rel="noopener noreferrer">Merge Harbor · 14-day event analysis and Excel model ↗</a>: 14 sheets covering funnels, return behavior, rewards, experiments, and an operations calendar, with a companion PDF report.</p></section>
      <section><h4>PC, consoles, VR, and community</h4><p>I have played over 4,000 hours on Steam, including survival, open-world, narrative, and horror games. I have written breakdown notes on 13 games there, focusing on atmosphere, narrative rhythm, resource loops, and player motivation.</p><p>I independently designed, built, tested, and published the <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3814649025" target="_blank" rel="noopener noreferrer">Project Zomboid Preservative mod ↗</a>. My mods have drawn around 4,600 unique visitors, 1,490 subscriptions, and 190 favorites; I respond to player discussions and feedback as the work evolves.</p><p>I also completed the bilingual <a href="https://just-pxmi.upma.site/" target="_blank" rel="noopener noreferrer">Project Zomboid international community and marketing analysis ↗</a> and its presentation, 16 pages each. I follow Xbox, PlayStation, Meta Quest, and PICO, with hands-on motion-tracking experience.</p></section>
      <section><h4>Anime-style games and overseas communities</h4><p>I have spent 500+ hours in Genshin Impact and Honkai Impact 3rd, and regularly play Arknights and Identity V. I follow player sentiment, updates, events, and community discussions. I also participate in Steam and Discord communities and track international game publishing through industry research sources.</p></section>
    </div>
  );
  return (
    <div className="map-preview__game-experience">
      <h3>游戏经历</h3>
      <section><h4>多品类手游与竞技</h4><p>网易狼人杀 2022 年大师赛全国第 27 名、《王者荣耀》王者段位。长期游玩《部落冲突》，并体验《阿瓦隆之王》《Last War》等 SLG，熟悉资源发育、联盟集结与跨服对抗等社交留存机制；也体验《梦幻花园》《Merge Harbor》等休闲合成玩法，形成跨品类运营节奏与用户画像的对比视角。</p><p>结合合成类游戏的个人体验、公开资料与模拟数据，完成 <a href="https://lion-xsog.upma.site/" target="_blank" rel="noopener noreferrer">Merge Harbor · 14 天活动分析与 Excel 模型 ↗</a>。独立搭建 14 个工作表，覆盖漏斗、回流、奖励配置、实验与运营日历；分析中期流失，设计积分要求调整实验，并输出配套 PDF 报告，逐项核对数据口径与计算结果。</p></section>
      <section><h4>PC／多端经历与社区活跃</h4><p>Steam 累计游玩 4,000+ 小时，深度体验《七日杀》《方舟：生存进化》《塞尔达传说》《博德之门 3》等开放世界、生存与叙事作品，通关《生化危机》《行尸走肉》《逃生》等恐怖游戏系列；在 Steam 撰写 13 款游戏拆解笔记，从氛围营造、叙事节奏、资源循环与玩家参与动机分析玩法设计。</p><p><a href="https://steamcommunity.com/sharedfiles/filedetails/?id=3814649025" target="_blank" rel="noopener noreferrer">《Project Zomboid》模组《防腐剂》 ↗</a>由我独立完成设计、开发、测试和上线。个人开发的数款模组总计约 4,600 位不重复访客、1,490 次订阅、190 次收藏；逐条回复 4 个讨论帖与 30 条玩家留言，收集建议并持续更新。</p><p>完成 <a href="https://just-pxmi.upma.site/" target="_blank" rel="noopener noreferrer">《Project Zomboid》国际化社群与营销分析 ↗</a>中英双语报告及配套演示稿（各 16 页），研究商店页呈现、Discord 运营、本地化反馈与 UGC 传播，成果发表于 Steam 社区。长期活跃于 Xbox、PlayStation、Meta Quest 及 PICO 平台，配备体感追踪设备，熟悉主机与 VR 游戏生态。</p></section>
      <section><h4>二次元游戏与海外社区</h4><p>《原神》《崩坏 3》累计体验 500+ 小时，长期游玩《明日方舟》《第五人格》；关注二次元社区的版本、活动与玩家讨论，辨识社区热点、玩家情绪和争议信息。持续参与 Steam、Discord 社区讨论，跟踪 UGC、口碑与海外发行；通过游戏出海、罗斯基、白鲸出海、Sensor Tower、SteamDB 和 GamesIndustry.biz 等渠道关注市场与营销案例。</p></section>
    </div>
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
  const pointerLightRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const pointerPosition = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const spawnKey = useRef(0);
  const [ready, setReady] = useState(false);
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
  const [tutorialMode, setTutorialMode] = useState(false);
  const locale = useUiStore((state) => state.locale);
  const setLocale = useUiStore((state) => state.setLocale);
  const setMode = useUiStore((state) => state.setMode);

  useEffect(() => {
    const saved = window.localStorage.getItem("resonance-locale");
    setLocale(saved === "en" ? "en" : "zh");
  }, [setLocale]);

  useEffect(() => {
    const review = new URLSearchParams(window.location.search).get("review");
    if (review !== "iwbtz-detail" && review !== "pixel-world-detail" && review !== "preservative-detail" && review !== "rainy-arcade-detail" && review !== "auto-tune-detail" && review !== "study-assistant-detail") return;
    const projectId = review === "iwbtz-detail" ? "iwbtz" : review === "pixel-world-detail" ? "pixel-world" : review === "preservative-detail" ? "preservative" : review === "rainy-arcade-detail" ? "rainy-arcade" : review === "auto-tune-detail" ? "auto-tune" : "study-assistant";
    setReady(true);
    setSelectedEncounter({ projectId, point: { x: .5, y: .5 }, key: -1, createdAt: Date.now() });
    setCardOpen(true);
    setDetailOpen(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    for (const project of projects) {
      const image = new window.Image();
      image.src = conceptCard(project.id);
    }
  }, [ready]);

  useEffect(() => {
    const hovered = encounters.find((item) => item.key === hoveredKey);
    if (!hovered) return;
    const image = new window.Image();
    image.src = conceptDetail(hovered.projectId);
  }, [hoveredKey, encounters]);

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
    if (!ready || tutorialMode || menuOpen || cardOpen || detailOpen || capture) return;
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
      const availableIds = shuffledProjectIds().filter((id) => !occupiedIds.has(id));
      // Keep at least four visible encounters; a fifth appears before the oldest leaves.
      const targetCount = current.length === 0 ? 4 : 5;
      while (next.filter((item) => !item.leavingAt).length < targetCount && availableIds.length) {
        const projectId = availableIds.pop()!;
        const point = randomSpawnPoint(next.filter((item) => !item.leavingAt).map((item) => item.point));
        if (!point) break;
        next.push({ projectId, point, key: ++spawnKey.current, createdAt: now });
      }
      return next;
    });
    rotate();
    const timer = window.setInterval(rotate, 1250);
    return () => window.clearInterval(timer);
  }, [ready, tutorialMode, menuOpen, cardOpen, detailOpen, capture, hoveredKey]);

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
        if (!tutorialMode) window.dispatchEvent(new CustomEvent("portfolio:project-discovered", { detail: capture.target.projectId }));
      } else {
        setFeedback(locale === "zh" ? "很遗憾，你没抓住，再抓一次~" : "It slipped away — try again!");
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
  }, [capture, locale, tutorialMode]);

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

  useEffect(() => {
    const handleTutorial = (event: Event) => {
      const action = (event as CustomEvent<string>).detail;
      if (action === "setup" || action === "map") {
        setTutorialMode(true);
        setReady(true);
        setCapture(null);
        setSelectedEncounter(null);
        setCardOpen(false);
        setDetailOpen(false);
        setMenuOpen(false);
        setEncounters([tutorialEncounter]);
      } else if (action === "card" || action === "detail") {
        setTutorialMode(true);
        setReady(true);
        setSelectedEncounter(tutorialEncounter);
        setCardOpen(true);
        setDetailOpen(action === "detail");
        setMenuOpen(false);
      } else if (action === "capture") {
        const bounds = stageRef.current?.getBoundingClientRect();
        if (bounds) showCapture(bounds.width * tutorialEncounter.point.x, bounds.height * tutorialEncounter.point.y, tutorialEncounter);
      } else if (action === "detail") {
        setDetailOpen(true);
      } else if (action === "menu") {
        setTutorialMode(true);
        setReady(true);
        setMenuView("index");
        setMenuOpen(true);
      } else if (action === "end") {
        setTutorialMode(false);
        setMenuOpen(false);
        setCardOpen(false);
        setDetailOpen(false);
        setSelectedEncounter(null);
        setEncounters([]);
      }
    };
    window.addEventListener("portfolio:tutorial", handleTutorial);
    return () => window.removeEventListener("portfolio:tutorial", handleTutorial);
  });

  const clickMap = (event: React.MouseEvent<HTMLElement>) => {
    if (tutorialMode) return;
    if (!ready || menuOpen || (event.target as HTMLElement).closest(".map-preview__header, .map-preview__footer, .map-preview__menu, .map-preview__rhythm-portal, .map-preview__creature, .encounter-card, .project-detail")) return;
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
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pointerPosition.current = { x, y, width: bounds.width, height: bounds.height };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = window.requestAnimationFrame(() => {
      pointerFrame.current = null;
      const position = pointerPosition.current;
      if (!position) return;
      pointerLightRef.current?.style.setProperty("transform", `translate3d(${position.x - 250}px, ${position.y - 250}px, 0)`);
      stageRef.current?.style.setProperty("--drift-x", (position.x / position.width - 0.5) * -14 + "px");
      stageRef.current?.style.setProperty("--drift-y", (position.y / position.height - 0.5) * -10 + "px");
    });
  };

  const openMenu = () => {
    setMenuView("index");
    setShowQr(false);
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const discoveredCount = Math.min(discoveredIds.length, projects.length);
  const encounter = selectedEncounter;
  const hoveredEncounter = encounters.find((item) => item.key === hoveredKey && !item.leavingAt);
  const hoveredProject = projects.find((project) => project.id === hoveredEncounter?.projectId);
  const hoveredConcept = hoveredProject && conceptCard(hoveredProject.id);
  const activeProject = projects.find((project) => project.id === encounter?.projectId);
  const activeCopy = activeProject && localizeProject(activeProject, locale);
  const activeConcept = activeProject && conceptCard(activeProject.id);
  const activeDetailImage = activeProject && conceptDetail(activeProject.id);

  return (
    <main
      ref={stageRef}
      className={"map-preview map-preview--immersive" + (ready ? " is-ready" : "") + (menuOpen ? " menu-open" : "")}
      onPointerMove={movePointer}
      onClick={clickMap}
      onKeyDown={keyMap}
      tabIndex={0}
      aria-label={locale === "zh" ? "个人互动作品集探索地图" : "Interactive portfolio world map"}
    >
      <div className="map-preview__scene" aria-hidden="true" />
      <div className="map-preview__color" aria-hidden="true" />
      <div className="map-preview__sunlight" aria-hidden="true" />
      <div className="map-preview__mist" aria-hidden="true" />
      <div className="map-preview__grain" aria-hidden="true" />
      <div className="map-preview__scanlines" aria-hidden="true" />
      <div className="map-preview__sweep" aria-hidden="true" />
      <div className="map-preview__vignette" aria-hidden="true" />
      <div ref={pointerLightRef} className="map-preview__pointer-light" aria-hidden="true" />
      <div className="map-preview__glint map-preview__glint--one" aria-hidden="true">✦</div>
      <div className="map-preview__glint map-preview__glint--two" aria-hidden="true">✧</div>
      <div className="map-preview__glint map-preview__glint--three" aria-hidden="true">✦</div>
      <div className="map-preview__glint map-preview__glint--four" aria-hidden="true">✧</div>

      {ready && !cardOpen && !detailOpen && (
        <Link
          className="map-preview__rhythm-portal"
          href="/play"
          onClick={(event) => { event.stopPropagation(); setMode("entry"); }}
          aria-label={locale === "zh" ? "进入音游体验" : "Enter the rhythm experience"}
        >
          <span className="map-preview__rhythm-eggs" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((egg) => (
              <span className={`map-preview__rhythm-egg map-preview__rhythm-egg--${egg}`} key={egg}>
                <Image src="/map-preview/capture-egg.png" alt="" width={62} height={66} unoptimized />
              </span>
            ))}
          </span>
          <span className="map-preview__rhythm-label">
            <strong>{locale === "zh" ? "音游入口" : "RHYTHM GAME"}</strong>
          </span>
        </Link>
      )}

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
          <button className="encounter-card__main" type="button" onClick={() => setDetailOpen(true)} aria-label={(locale === "zh" ? "查看 " : "Open ") + activeProject.title + (locale === "zh" ? " 项目详情" : " project details")}>
            <Image src={activeConcept} alt={activeProject.title + " 项目图片"} width={560} height={320} unoptimized />
            <span className="encounter-card__text"><strong>{activeProject.title.toUpperCase()}</strong></span>
          </button>
          <span className="encounter-card__creature" role="img" aria-label={activeProject.title + " 小怪兽"}><CreatureArt projectId={encounter.projectId} /></span>
        </div>
      )}

      {detailOpen && activeProject && activeCopy && activeDetailImage && (
        <div
          className={"project-detail" + (["iwbtz", "pixel-world", "preservative", "rainy-arcade", "auto-tune", "study-assistant"].includes(activeProject.id) ? " project-detail--iwbtz-review" : "") + (activeProject.id === "pixel-world" ? " project-detail--pixel-world-review" : "") + (activeProject.id === "preservative" ? " project-detail--preservative-review" : "") + (activeProject.id === "rainy-arcade" ? " project-detail--rainy-arcade-review" : "") + (activeProject.id === "auto-tune" ? " project-detail--auto-tune-review" : "") + (activeProject.id === "study-assistant" ? " project-detail--study-assistant-review" : "")}
          role="dialog"
          aria-modal="true"
          aria-label={activeProject.title + " 项目详情"}
        >
          <div className="project-detail__panel">
            <button className="project-detail__back" type="button" onClick={closeCard}>{locale === "zh" ? "← 返回地图" : "← Back to map"}</button>
            <ProjectLivePreview project={activeProject} locale={locale} />
            <div className="project-detail__hero">
              <div><span>{activeCopy.category}</span><h1>{activeCopy.title}</h1><p>{activeCopy.oneLiner}</p></div>
              <Image src={activeDetailImage} alt={activeProject.title + " 项目图片"} width={1280} height={720} unoptimized priority />
            </div>
            <div className="project-detail__grid">
              <section><h2>{locale === "zh" ? "项目背景" : "Context"}</h2><p>{activeCopy.context}</p></section>
              <section><h2>{locale === "zh" ? "我的角色" : "My Role"}</h2><p>{activeCopy.role}</p></section>
              <section><h2>{locale === "zh" ? "设计与实现" : "Design & Implementation"}</h2><ul>{activeCopy.process.map((step) => <li key={step}>{step}</li>)}</ul></section>
              <section><h2>{locale === "zh" ? "结果" : "Outcome"}</h2><p>{activeCopy.outcome}</p></section>
            </div>
            <div className="project-detail__gallery">
              {(activeProject.id === "iwbtz" ? [...activeProject.screenshots, ...iwbtzMotion] : activeProject.id === "pixel-world" ? [...activeProject.screenshots, ...pixelWorldExpanded] : activeProject.id === "preservative" ? [...activeProject.screenshots, ...preservativeExpanded] : activeProject.id === "rainy-arcade" ? [...activeProject.screenshots, ...rainyArcadeExpanded] : activeProject.screenshots).map((src, index) => (
                <figure key={src} className={src.endsWith(".gif") ? "project-detail__motion" : undefined}>
                  <a href={src} target="_blank" rel="noreferrer" aria-label={(locale === "zh" ? "放大查看图片 " : "Open image ") + (index + 1)}>
                    <Image src={galleryImage(src)} alt={activeProject.title + " 项目图片 " + (index + 1)} width={960} height={540} loading="lazy" unoptimized />
                  </a>
                  <figcaption>{galleryCaptions[activeProject.id]?.[locale][index]}</figcaption>
                </figure>
              ))}
            </div>
            <div className="project-detail__links">
              {activeProject.download && <a className="project-detail__link project-detail__link--download" href={activeProject.download} download>{locale === "zh" ? "下载可安装扩展包 ↓" : "Download installable extension ↓"}</a>}
              {activeProject.github && !activeProject.download && <a className="project-detail__link project-detail__link--code" href={activeProject.github} target="_blank" rel="noopener noreferrer">{locale === "zh" ? "查看项目代码 ↗" : "View source code ↗"}</a>}
              {activeProject.download && <p className="project-detail__download-help">{locale === "zh" ? "下载后解压，在 Chrome / Edge 扩展程序中开启开发者模式，再选择“加载已解压的扩展程序”。" : "Unzip, enable Developer mode in Chrome / Edge extensions, then choose Load unpacked."}</p>}
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
          <button
            className="map-preview__locale"
            type="button"
            onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
            aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
          >{locale === "zh" ? "EN" : "中文"}</button>
          <time className="map-preview__clock" dateTime={localTime?.toISOString()}>
            <span>{locale === "zh" ? "本地时间" : "LOCAL TIME"}</span>
            <strong>{localTime ? formatLocalDate(localTime, locale) : "----.--.--"}</strong>
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
            <>{locale === "zh" ? <>已发现 <strong>0/{projects.length}</strong> 个项目 · 寻找地图上的 Pokémon</> : <><strong>0/{projects.length}</strong> projects found · Find the Pokémon on the map</>}</>
          ) : discoveredCount < projects.length ? (
            <>{locale === "zh" ? <>已发现 <strong>{discoveredCount}/{projects.length}</strong> 个项目 · 继续捕捉 Pokémon</> : <><strong>{discoveredCount}/{projects.length}</strong> projects found · Keep catching Pokémon</>}</>
          ) : (
            <>
              <strong>{projects.length}/{projects.length}</strong> {locale === "zh" ? "个项目已发现，点击右上角" : "projects found · Open"}
              <button type="button" className="map-preview__inline-menu" aria-label="打开目录" onClick={openMenu}>
                <NineDots size={21} />
              </button>
              {locale === "zh" ? "查看其他功能。" : "for more."}
            </>
          )}
        </div>
      </footer>

      {menuOpen && (
        <div className="map-preview__menu" role="dialog" aria-modal="true" aria-label="作品集目录">
          <div className="map-preview__menu-backdrop" onClick={closeMenu} />
          <div className={"map-preview__menu-window" + (menuView === "about" ? " map-preview__menu-window--about" : "")}>
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
                    <span>01</span><strong>{locale === "zh" ? "关于我" : "ABOUT"} <small>{locale === "zh" ? "ABOUT" : "张铧心"}</small></strong><em>{locale === "zh" ? "张铧心" : "Huaxin Zhang"}</em><b aria-hidden="true">↗</b>
                  </button>
                  <button type="button" className="map-preview__menu-card" onClick={() => setMenuView("contact")}>
                    <span>02</span><strong>{locale === "zh" ? "联系我" : "CONTACT"} <small>{locale === "zh" ? "CONTACT" : "联系我"}</small></strong><em>{locale === "zh" ? "邮箱 · GitHub · 微信" : "Email · GitHub · WeChat"}</em><b aria-hidden="true">↗</b>
                  </button>
                  <button type="button" className="map-preview__menu-card" onClick={() => { closeMenu(); window.dispatchEvent(new Event("portfolio:tutorial-replay")); }}>
                    <span>03</span><strong>{locale === "zh" ? "重看教程" : "REPLAY GUIDE"} <small>{locale === "zh" ? "GUIDE" : "教程"}</small></strong><em>{locale === "zh" ? "操作指引" : "How to explore"}</em><b aria-hidden="true">↗</b>
                  </button>
                </nav>
              )}

              {menuView === "about" && (
                <section className="map-preview__menu-detail">
                  <span>01</span>
                  <h2>{locale === "zh" ? "关于我" : "ABOUT"} <small>{locale === "zh" ? "ABOUT" : "张铧心"}</small></h2>
                  <p>{locale === "zh" ? "我喜欢把一个念头做成可以亲自走进去的世界，也喜欢把复杂的工具做得顺手。游戏策划、AI 产品、互动原型与用户研究，是我持续往返的几条路。" : "I like turning an idea into a world someone can enter, and making complicated tools feel natural to use. Game design, AI products, interactive prototypes, and user research are the paths I keep crossing."}</p>
                  <AboutGameExperience locale={locale} />
                </section>
              )}

              {menuView === "contact" && (
                <section className="map-preview__menu-detail">
                  <span>02</span>
                  <h2>{locale === "zh" ? "联系我" : "CONTACT"} <small>{locale === "zh" ? "CONTACT" : "联系我"}</small></h2>
                  <p>{locale === "zh" ? "如果你对某个项目好奇，或想一起做点什么，欢迎给我写信。" : "Curious about a project, or thinking of making something together? I'd be glad to hear from you."}</p>
                  <div className="map-preview__contact-links">
                    <a className="map-preview__contact-email" href={"mailto:" + publicLinks.email}>
                      <span>{locale === "zh" ? "发送邮件 · 常用邮箱" : "Send email · Primary"}<b aria-hidden="true">↗</b></span>
                      <small>{publicLinks.email}</small>
                    </a>
                    <a className="map-preview__contact-email" href={"mailto:" + publicLinks.alumniEmail}>
                      <span>{locale === "zh" ? "校友邮箱" : "Alumni email"}<b aria-hidden="true">↗</b></span>
                      <small>{publicLinks.alumniEmail}</small>
                    </a>
                    <a href={publicLinks.github} target="_blank" rel="noreferrer">{locale === "zh" ? "查看 GitHub ↗" : "View GitHub ↗"}</a>
                    <button type="button" aria-expanded={showQr} onClick={() => setShowQr((current) => !current)}>{locale === "zh" ? "微信二维码 ↗" : "WeChat QR ↗"}</button>
                  </div>
                  {showQr && <Image className="map-preview__qr" src="/contact/wechat-qr.jpg" alt="微信二维码" width={176} height={176} unoptimized />}
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
