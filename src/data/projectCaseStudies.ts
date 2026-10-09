import type { Locale, ProjectId } from "@/types";

export type ProjectCaseStudyVisual =
  | {
      kind: "image";
      src: string;
      alt: string;
      fit?: "contain" | "cover";
      frame?: {
        variant: "launch" | "proof" | "system";
        eyebrow: string;
        title: string;
        meta: string[];
      };
    }
  | { kind: "gallery"; images: Array<{ src: string; alt: string; fit?: "contain" | "cover" }> }
  | {
      kind: "asset-board";
      eyebrow: string;
      title: string;
      note: string;
      hero: { src: string; alt: string; label: string };
      assets: Array<{ src: string; alt: string; label: string; caption: string }>;
    }
  | {
      kind: "report";
      eyebrow: string;
      title: string;
      note: string;
      pdfSrc: string;
      pptxSrc: string;
      pdfLabel: string;
      pptxLabel: string;
      iframeTitle: string;
    }
  | { kind: "flow"; eyebrow: string; nodes: string[]; note?: string }
  | { kind: "code"; eyebrow: string; lines: string[]; note?: string };

export interface ProjectCaseStudySection {
  step: string;
  title: string;
  body: string;
  visual: ProjectCaseStudyVisual;
  layout?: "standard" | "wide";
  presentation?: "framed";
}

type LocalizedCaseStudy = Record<Locale, ProjectCaseStudySection[]>;

export const caseStudyProjectIds = [
  "pixel-world", "preservative", "rainy-arcade", "iwbtz", "auto-tune", "study-assistant",
] as const satisfies readonly ProjectId[];

export const projectCaseStudies: Record<ProjectId, LocalizedCaseStudy> = {
  "pixel-world": {
    en: [
      {
        step: "01", title: "A Prompt Becomes a World You Can Enter",
        body: "The concept cover establishes Pixel World's promise before the production details begin: write a world, generate it, then cross the threshold and play it.",
        visual: { kind: "image", src: "/portfolio/pixel-world-concept-cover.png", alt: "Pixel World concept cover introducing a prompt-driven pixel game creation platform" }, layout: "wide",
      },
      {
        step: "02", title: "A Few Prompts Become a Production Plan",
        body: "The creator defines the premise; ten specialist agents turn it into a reviewed GameSpec, production tasks, assets, and playable levels.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-01-prompt-spec-agents.png", alt: "Pixel World prompt, GameSpec, and ten-agent production workflow" }, layout: "wide", presentation: "framed",
      },
      {
        step: "03", title: "Model Routing Is Visible and Replaceable",
        body: "Text agents and image generation can use different providers. The product explains each route, its credential format, regional access, and practical strengths.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-02-model-routing.png", alt: "Pixel World model provider routing and credential guidance" }, layout: "wide", presentation: "framed",
      },
      {
        step: "04", title: "The Creator Keeps Approval Control",
        body: "A locked agent model keeps the review coherent, while explicit approval remains required before image generation begins and credits are consumed.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-03-agent-config.png", alt: "Pixel World agent model configuration and creator approval controls" }, layout: "wide", presentation: "framed",
      },
      {
        step: "05", title: "Approved Rules Expand into a Recoverable Asset System",
        body: "Characters, enemies, effects, sound, behavior, and level assignments remain inspectable. Individual tasks can be retried without discarding completed work.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-04-asset-system.png", alt: "Pixel World asset system and level assignment overview" }, layout: "wide", presentation: "framed",
      },
      {
        step: "06", title: "The Interface Changes with the World",
        body: "Generated cover art and particles transform the creation workspace so each project begins to feel like its own game before playtesting starts.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-05-cover-particles.png", alt: "Pixel World cover and particle effects adapting to the generated game style" }, layout: "wide", presentation: "framed",
      },
      {
        step: "07", title: "The Same GameSpec Drives the Complete Game Entry",
        body: "One approved specification continues from cover to levels and saves, producing a title, story, controls, settings, and a playable entry point.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-06-generated-world.png", alt: "Pixel World generated game entry driven by ten specialist agents" }, layout: "wide", presentation: "framed",
      },
      {
        step: "08", title: "Generated Rules Run in a Real Level",
        body: "The Moonshadow Forest playtest demonstrates movement, combat, collectibles, enemies, health states, and an exit that responds to the level objective.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-07-moonshadow-level.png", alt: "Pixel World Moonshadow Forest playable level" }, layout: "wide", presentation: "framed",
      },
      {
        step: "09", title: "Different Worlds, Consistently Playable",
        body: "The same generation pipeline can produce a bright garden, a night castle, or a tidal cave while keeping character silhouettes, HUD information, and gameplay readable.",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-08-playable-worlds.png", alt: "Three distinct playable Pixel World environments with consistent visual clarity" }, layout: "wide", presentation: "framed",
      },
    ],
    zh: [
      {
        step: "01", title: "从一句提示词，走进一个可玩的世界",
        body: "概念图先确立 Pixel World 的核心承诺：写下世界、生成世界，再真正进入其中游玩；后续设计与制作流程都围绕这条体验主线展开。",
        visual: { kind: "image", src: "/portfolio/pixel-world-concept-cover.png", alt: "以提示词驱动像素游戏创作的 Pixel World 概念图" }, layout: "wide",
      },
      {
        step: "02", title: "几句提示词进入完整生产流程",
        body: "创作者定义原点，十个专业 Agent 再把它整理为获批 GameSpec、生产任务、素材与可玩关卡。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-01-prompt-spec-agents.png", alt: "Pixel World 从提示词、GameSpec 到十 Agent 制作流程" }, layout: "wide", presentation: "framed",
      },
      {
        step: "03", title: "模型路线清楚，也可以替换",
        body: "文字 Agent 与图片生成可以使用不同平台；界面直接说明凭证格式、地区访问条件和各路线的实际优势。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-02-model-routing.png", alt: "Pixel World 模型平台路线与凭证说明" }, layout: "wide", presentation: "framed",
      },
      {
        step: "04", title: "创作者始终保留审批权",
        body: "本次运行锁定统一 Agent 模型保持复核一致；正式生图和消耗额度前，仍必须由创作者明确批准。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-03-agent-config.png", alt: "Pixel World Agent 模型配置与创作者审批" }, layout: "wide", presentation: "framed",
      },
      {
        step: "05", title: "获批规则展开为可恢复的素材系统",
        body: "角色、敌人、特效、音频、行为与逐关分配保持可检查；单个任务可以独立重试，不会抹掉已经完成的工作。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-04-asset-system.png", alt: "Pixel World 素材系统与关卡分配总览" }, layout: "wide", presentation: "framed",
      },
      {
        step: "06", title: "界面会随生成世界一起变化",
        body: "生成封面与粒子效果会改造创作工作区，让每个项目在正式试玩前就具有自己的游戏气质。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-05-cover-particles.png", alt: "随游戏风格变化的 Pixel World 封面与粒子效果" }, layout: "wide", presentation: "framed",
      },
      {
        step: "07", title: "同一份 GameSpec 持续驱动完整游戏入口",
        body: "获批规格从封面继续进入关卡与存档，生成标题、故事、操作、设置和真实可进入的游戏入口。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-06-generated-world.png", alt: "由十个专业 Agent 共同完成的 Pixel World 游戏入口" }, layout: "wide", presentation: "framed",
      },
      {
        step: "08", title: "生成规则在真实关卡中运行",
        body: "月影森林试玩呈现移动、战斗、收集物、敌人、生命状态，以及随关卡目标变化的出口。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-07-moonshadow-level.png", alt: "Pixel World 月影森林真实可玩关卡" }, layout: "wide", presentation: "framed",
      },
      {
        step: "09", title: "世界不同，依然稳定可玩",
        body: "同一条生成流程可以产出明亮花园、暗夜城堡和潮汐洞窟，同时维持角色轮廓、HUD 信息和游玩画面的清晰度。",
        visual: { kind: "image", src: "/portfolio/pixel-world-case-08-playable-worlds.png", alt: "三种视觉路线清晰稳定的 Pixel World 可玩世界" }, layout: "wide", presentation: "framed",
      },
    ],
  },
  preservative: {
    en: [
      {
        step: "01",
        title: "Preservation Buys Time, Not Safety",
        body: "A rain-soaked storeroom establishes the mod's core tension before any interface appears: preserved food keeps a shelter alive, while the bottle protecting it remains a lethal survival risk.",
        visual: {
          kind: "image",
          src: "/portfolio/preservative-01-concept-approved.png",
          alt: "Isometric rainy survival storeroom with preserved food, zombies outside, and a dangerous preservative bottle on the worktable",
          frame: {
            variant: "launch",
            eyebrow: "SURVIVAL FILE 01 · CONCEPT",
            title: "PRESERVATION BUYS TIME / DANGER SETS THE PRICE",
            meta: ["SHELTER", "FOOD", "RISK"],
          },
        },
        layout: "wide",
      },
      {
        step: "02",
        title: "The Report Connects Market Research to Live Workshop Results",
        body: "The marketing report is shown beside real Workshop evidence. The published mod reached 4,431 unique visitors, 1,480 current subscribers, and 182 favorites, turning the analysis into a measurable release outcome.",
        visual: { kind: "image", src: "/portfolio/preservative-02-report-evidence.png", alt: "Portfolio board pairing the Project Zomboid marketing report with Steam Workshop performance data" },
        layout: "wide",
        presentation: "framed",
      },
      {
        step: "03",
        title: "The Cover and Logo Form One Recognizable Mod Identity",
        body: "The final cover, bottle illustration, and IA signature use the same hazard symbol, amber glass, cyan edge light, and magenta accent so the project stays recognizable at every scale.",
        visual: { kind: "image", src: "/portfolio/preservative-03-visual-identity.png", alt: "Portfolio board showing the final Preservative mod cover, bottle artwork, and IA logo system" },
        layout: "wide",
        presentation: "framed",
      },
      {
        step: "04",
        title: "Food Decay Timing, Poison Alerts, and Antidotes Stay Readable",
        body: "The in-game evidence shows the complete feedback chain: remaining preservation time in the inventory, a six-hour lethal countdown, a persistent status icon, and clear Lemongrass or Antibiotics guidance.",
        visual: { kind: "image", src: "/portfolio/preservative-04-gameplay-evidence.png", alt: "Portfolio board showing Preservative inventory timing, poisoning countdown, status icon, and antidote guidance in Project Zomboid" },
        layout: "wide",
        presentation: "framed",
      },
      {
        step: "05",
        title: "The Full Report Is Available Without Leaving the Case Study",
        body: "Read the PDF inside the page, open it in a dedicated tab, or download the original PowerPoint file for a closer review of the research and launch strategy.",
        visual: {
          kind: "report",
          eyebrow: "PROJECT ZOMBOID / RESEARCH ARCHIVE",
          title: "Steam Store Page and Community Marketing Analysis",
          note: "Scroll inside the document frame. The source PDF and editable PowerPoint remain available from the toolbar.",
          pdfSrc: "/portfolio/reports/project-zomboid-marketing-report.pdf",
          pptxSrc: "/portfolio/reports/project-zomboid-marketing-report.pptx",
          pdfLabel: "Open PDF",
          pptxLabel: "Download PPTX",
          iframeTitle: "Project Zomboid Steam store page and community marketing analysis report",
        },
        layout: "wide",
      },
    ],
    zh: [
      {
        step: "01",
        title: "保鲜延长时间，却不等于绝对安全",
        body: "雨夜储藏间先于界面建立模组的核心矛盾：被保护的食物维持避难所生存，而提供保护的药瓶本身也是足以致命的风险。",
        visual: {
          kind: "image",
          src: "/portfolio/preservative-01-concept-approved.png",
          alt: "雨夜等距生存储藏间，室外有丧尸，工作台上摆放被保护食物与危险防腐剂",
          frame: {
            variant: "launch",
            eyebrow: "生存档案 01 · 概念图",
            title: "保鲜争取时间，危险决定代价",
            meta: ["避难所", "食物", "风险"],
          },
        },
        layout: "wide",
      },
      {
        step: "02",
        title: "报告分析与真实 Workshop 数据相互印证",
        body: "营销拆解报告与真实发布数据并置呈现：模组获得 4,431 位不重复访客、1,480 位当前订阅者与 182 次收藏，让研究过程最终落到可验证的发行结果。",
        visual: { kind: "image", src: "/portfolio/preservative-02-report-evidence.png", alt: "并列展示 Project Zomboid 营销报告与 Steam Workshop 成果数据的作品集页面" },
        layout: "wide",
        presentation: "framed",
      },
      {
        step: "03",
        title: "封面与 Logo 建立统一、可识别的模组形象",
        body: "终稿封面、药瓶视觉与 IA 标识统一使用危险符号、琥珀玻璃、青色轮廓光和洋红点缀，在不同尺寸下保持同一项目身份。",
        visual: { kind: "image", src: "/portfolio/preservative-03-visual-identity.png", alt: "展示防腐剂模组封面终稿、药瓶视觉与 IA Logo 系统的作品集页面" },
        layout: "wide",
        presentation: "framed",
      },
      {
        step: "04",
        title: "食物腐坏计时与中毒警报和解毒方法始终可读",
        body: "游戏内证据完整呈现反馈链路：背包中的剩余保鲜时间、六小时致命倒计时、持续显示的状态图标，以及明确的香茅草或抗生素解毒提示。",
        visual: { kind: "image", src: "/portfolio/preservative-04-gameplay-evidence.png", alt: "展示防腐剂剩余时间、中毒倒计时、状态图标与解毒提示的 Project Zomboid 游戏内证据页面" },
        layout: "wide",
        presentation: "framed",
      },
      {
        step: "05",
        title: "完整报告可以直接阅读，也可以带走原文件",
        body: "在页面内滚动查看 PDF，也可以在新窗口打开；需要演示或继续编辑时，可直接下载 PPTX 原文件。",
        visual: {
          kind: "report",
          eyebrow: "PROJECT ZOMBOID / 研究档案",
          title: "Steam 商店页与社群营销拆解报告",
          note: "文档框内可以独立滚动；工具栏同时保留 PDF 原文与可编辑 PowerPoint 文件。",
          pdfSrc: "/portfolio/reports/project-zomboid-marketing-report.pdf",
          pptxSrc: "/portfolio/reports/project-zomboid-marketing-report.pptx",
          pdfLabel: "新窗口打开 PDF",
          pptxLabel: "下载 PPTX 原文件",
          iframeTitle: "Project Zomboid Steam 商店页与社群营销拆解报告",
        },
        layout: "wide",
      },
    ],
  },
  "rainy-arcade": {
    en: [
      {
        step: "01", title: "Three Figures Hold the Story Together",
        body: "The concept image introduces Zhang Huaxin, Xiaoman and the faceless player as one rain-soaked ensemble. Warm reflections connect their separate silhouettes, while the crescent-and-joystick mark frames the arcade as a place where unfinished memories become playable.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-concept-cover.png", alt: "Rainy Night Arcade concept cover with Zhang Huaxin, Xiaoman, the faceless player, and the crescent joystick logo" }, layout: "wide",
      },
      {
        step: "02", title: "One Arcade Connects Four Playable Worlds",
        body: "The arcade is both the emotional center and the navigation hub. Four cabinets lead to different genres and moods, while progress, sound, choices and saves remain local so the entire night can be played offline as one continuous experience.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-overview.png", alt: "Rainy Night Arcade project overview showing four worlds, multiple play styles, local saves, and offline play" }, layout: "wide",
      },
      {
        step: "03", title: "The Cast Shares One Night, Not One Identity",
        body: "Zhang Huaxin's red headphones and soft pink knitwear, Xiaoman's repaired yellow raincoat and cat, and the faceless player's dark waterproof silhouette create three immediately distinct roles without breaking the same wet, nocturnal material language.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-character-ensemble.png", alt: "Rainy Night Arcade character ensemble in the rain: Zhang Huaxin, Xiaoman with a cat, and the faceless player" }, layout: "wide",
      },
      {
        step: "04", title: "Turnarounds Keep Narrative Silhouettes Consistent",
        body: "Front, back and side views lock the player's raincoat, backpack and hidden face, alongside Zhang Huaxin's headphones, cardigan and loose trousers. The sheet preserves recognition when camera angle and scene lighting change.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-character-turnarounds.png", alt: "Rainy Night Arcade character turnaround sheet for the faceless player and Zhang Huaxin" }, layout: "wide",
      },
      {
        step: "05", title: "Story, Puzzle and Archive Use One Interaction Loop",
        body: "The player enters a chapter, chooses a response, operates the scene, and checks the resulting clue. Dialogue, spatial puzzles and saved evidence therefore accumulate along one readable path instead of behaving like disconnected mini-games.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-interaction-flow.png", alt: "Rainy Night Arcade interaction flow from chapter entry and dialogue choice to scene operation and clue verification" }, layout: "wide",
      },
      {
        step: "06", title: "Block City Rebuilds the Road Home",
        body: "Players reconnect broken routes, identify old belongings, compare memory with physical evidence, recognize the correct house, and restore it piece by piece. Each spatial action moves Xiaoman from isolation toward reunion.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-block-city.png", alt: "Block City design board showing road reconnection, object search, house verification, and the restored home" }, layout: "wide",
      },
      {
        step: "07", title: "Rain City Turns Reversed Time into Evidence",
        body: "At a terminal where the train waits in the rain, players revisit dialogue, compare the backward clock with the scene, and order four sound-wave fragments. Observation—not speed—reveals the sequence hidden inside the city's loop.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-rain-city.png", alt: "Rain City design board showing chapter progress, reversed chronology, dialogue review, and sound-wave ordering" }, layout: "wide",
      },
      {
        step: "08", title: "Library City Lets Silence Carry Meaning",
        body: "Four page fragments advance by turning pages, listening for their sound order and choosing what remains unwritten. The quietest city turns blank space into an active part of the story rather than an absence to be filled.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-library-city.png", alt: "Library City design board showing page fragments, page-turn progression, sound ordering, and a deliberately blank ending" }, layout: "wide",
      },
      {
        step: "09", title: "Playtests Become Evidence the Design Can Revisit",
        body: "Anonymous, on-device reports summarize chapter completion, hints, retries, calibration and playtime. A clearly labeled entertainment profile reflects observed play patterns without presenting them as a psychological diagnosis.",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-playtest-telemetry.png", alt: "Rainy Night Arcade playtest and telemetry board with anonymous local reports and an entertainment-oriented player profile" }, layout: "wide",
      },
    ],
    zh: [
      {
        step: "01", title: "三个人物，共同撑起同一个雨夜",
        body: "概念图先让张铧心、小满与无面玩家作为一个完整群像出现。暖色倒影串联三种不同轮廓，月牙摇杆标志则把游戏厅定义为让未完成记忆重新变得可玩的入口。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-concept-cover.png", alt: "包含张铧心、小满、无面玩家与月牙摇杆标志的雨夜游戏厅概念图" }, layout: "wide",
      },
      {
        step: "02", title: "一间游戏厅，连接四个可玩世界",
        body: "游戏厅既是情绪中心，也是导航中心。四台街机分别通往不同玩法与气质的世界；章节进度、声音、选择与存档都保留在本地，让整个雨夜可以离线连续体验。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-overview.png", alt: "展示四个世界、多类型玩法、本地存档与离线游玩的雨夜游戏厅项目总览" }, layout: "wide",
      },
      {
        step: "03", title: "角色共享同一场雨，却拥有清楚的身份边界",
        body: "张铧心的红色耳机与粉色针织衫、小满打满补丁的黄色雨衣和怀中小猫，以及无面玩家的深色防雨轮廓，构成三种一眼可辨的角色语言，同时保持统一的潮湿夜色质感。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-character-ensemble.png", alt: "雨中的雨夜游戏厅人物群像：张铧心、抱猫的小满与无面玩家" }, layout: "wide",
      },
      {
        step: "04", title: "四视图让叙事轮廓在镜头切换中保持一致",
        body: "正面、背面与两侧视图锁定无面玩家的雨衣、背包和面部留白，也明确张铧心的耳机、针织衫与宽松长裤；即使镜头角度和场景光线变化，角色依然能被迅速认出。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-character-turnarounds.png", alt: "无面玩家与张铧心的雨夜游戏厅人物四视图设定板" }, layout: "wide",
      },
      {
        step: "05", title: "剧情、谜题与存档沿同一条交互链推进",
        body: "玩家进入章节、选择回应、操作场景，再核对由行动产生的线索。对话、空间谜题与已保存证据因此不断累积，而不是彼此割裂的小游戏。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-interaction-flow.png", alt: "从进入章节、选择回应到操作场景和核对线索的雨夜游戏厅交互流程" }, layout: "wide",
      },
      {
        step: "06", title: "《积木城》把回家的路一块块接起来",
        body: "玩家重接道路、寻找旧物、用现场证据校准记忆、认出正确房屋，再逐步完成复原。每一次空间操作都推动小满从孤立走向重逢。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-block-city.png", alt: "展示重接道路、寻找旧物、核对房屋与完成复原的积木城设计板" }, layout: "wide",
      },
      {
        step: "07", title: "《雨城》把倒流的时间变成可核对的证据",
        body: "列车停在雨中的站台，玩家回看对话，把倒走的时钟与现场细节对照，再依次锁定四段声音波形。离开的条件不是速度，而是从循环中听出正确顺序。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-rain-city.png", alt: "展示章节进度、倒序叙事、对话回看与声音排序的雨城设计板" }, layout: "wide",
      },
      {
        step: "08", title: "《图书城》让空白本身承担意义",
        body: "四幕书页通过翻页、聆听声音顺序和选择留白逐步推进。最安静的一座城把未写完的部分变成叙事动作，而不是等待被填满的缺口。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-library-city.png", alt: "展示四幕书页、翻页推进、声音排序与结局留白的图书城设计板" }, layout: "wide",
      },
      {
        step: "09", title: "让试玩行为成为可以回看的设计证据",
        body: "匿名报告只在本地汇总章节完成率、提示、重试、校对次数与体验时长；娱乐向玩家画像依据实际操作生成，同时明确不用于心理诊断。",
        visual: { kind: "image", src: "/portfolio/rainy-arcade-playtest-telemetry.png", alt: "展示本地匿名报告与娱乐向玩家画像的雨夜游戏厅测试数据板" }, layout: "wide",
      },
    ],
  },
  iwbtz: {
    en: [
      {
        step: "01", title: "A Bright Platformer with a Darker Silhouette",
        body: "The opening concept establishes Zomboy between an overgrown childhood world and a city shaped by pressure, introducing the project’s central tension before play begins.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-01-concept.png", alt: "I Wanna Be the Zomboy concept art with Zomboy crossing from a bright overgrown world into an industrial city" }, layout: "wide", presentation: "framed",
      },
      {
        step: "02", title: "One Movement Language, Several Emotional Climates",
        body: "The level atlas shifts from living ruins to school corridors, industrial pressure, neon isolation, and a fragile return to warmth while preserving readable platform silhouettes.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-02-level-atlas.png", alt: "IWBTZ level atlas moving through overgrown ruins, school spaces, industrial districts, neon city, and a warm final landscape" }, layout: "wide", presentation: "framed",
      },
      {
        step: "03", title: "Multiple Threats Remain Legible in Motion",
        body: "Watermelon projectiles, a lunging flower, horizontal hazards, and falling fireballs occupy distinct lanes so difficulty comes from combining patterns rather than hiding information.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-03-multi-attack.gif", alt: "Animated IWBTZ boss encounter combining projectiles, a biting flower, floor hazards, and falling fireballs" }, layout: "wide", presentation: "framed",
      },
      {
        step: "04", title: "Jump, Read, Correct, Repeat",
        body: "The core loop keeps the player’s single life, jump arc, projectile timing, and restart rhythm visible at once, making each failure readable enough to support the next attempt.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-04-core-loop.gif", alt: "Animated IWBTZ gameplay loop showing Zomboy jumping and reacting to a boss attack with one life" }, layout: "wide", presentation: "framed",
      },
      {
        step: "05", title: "The Boss Pattern Escalates without Breaking Its Grammar",
        body: "The health bar stays attached to the boss while the flower’s bite and vertical fireballs announce separate timing windows, preserving fairness as the encounter becomes denser.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-05-boss-pattern.gif", alt: "Animated IWBTZ boss phase showing a lunging flower, a boss health bar, and vertical fireball attacks" }, layout: "wide", presentation: "framed",
      },
      {
        step: "06", title: "Childhood Misunderstanding Becomes a Pursuing Shadow",
        body: "Familiar mushrooms and flowers shift from warm scenery into pointing silhouettes. The route narrows as Zomboy advances, turning a misread childhood memory into playable pressure.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-06-memory-forest.png", alt: "IWBTZ childhood-memory level with Zomboy jumping through a mushroom forest beneath pursuing silhouettes" }, layout: "wide", presentation: "framed",
      },
      {
        step: "07", title: "Repeated Rules Compress the Safe Space",
        body: "Clocks, homework sheets, rigid platforms, and mechanical obstacles impose a relentless rhythm. Persistence is communicated through the player’s shrinking decision window rather than exposition alone.",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-07-school-pressure.png", alt: "IWBTZ school-pressure level with clocks, homework pages, machinery, and a pursuing flower hazard" }, layout: "wide", presentation: "framed",
      },
    ],
    zh: [
      {
        step: "01", title: "明亮平台世界里，藏着一条更暗的成长线",
        body: "概念图把 Zomboy 放在葱郁童年与压力城市之间，在游戏开始前便交代“拒绝被他人定义”的核心矛盾。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-01-concept.png", alt: "Zomboy 从明亮植物世界走向工业城市的 IWBTZ 概念图" }, layout: "wide", presentation: "framed",
      },
      {
        step: "02", title: "同一套移动语言，穿过五种情绪气候",
        body: "关卡从植物废墟、校园空间一路进入工业压力与霓虹孤独，最后回到微弱暖意；平台轮廓始终保持清晰，让视觉变化服务于操作节奏。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-02-level-atlas.png", alt: "展示植物废墟、校园、工业区、霓虹城市与温暖终章的 IWBTZ 关卡视觉总览" }, layout: "wide", presentation: "framed",
      },
      {
        step: "03", title: "多重攻击同时发生，危险仍然可以读懂",
        body: "西瓜弹、追咬花、横向特效和垂直火球各自占据清楚的运动轨道；难度来自攻击组合，而不是用混乱遮蔽信息。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-03-multi-attack.gif", alt: "西瓜弹、追咬花、地面特效与垂直火球共同出现的 IWBTZ 动态 Boss 战" }, layout: "wide", presentation: "framed",
      },
      {
        step: "04", title: "跳跃、观察、修正，再立刻重来",
        body: "单条生命、跳跃弧线、弹道时机与快速重试同时保持可见，让每次失败都足够清楚，并能直接转化为下一次操作判断。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-04-core-loop.gif", alt: "Zomboy 以单条生命跳跃并躲避 Boss 攻击的 IWBTZ 核心循环动图" }, layout: "wide", presentation: "framed",
      },
      {
        step: "05", title: "Boss 升级模式，却不破坏原有攻击语法",
        body: "血条始终绑定在 Boss 上方，追咬与垂直火球分别给出独立预警；战斗密度增加时，玩家仍能判断风险来源和安全落点。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-05-boss-pattern.gif", alt: "展示追咬花、Boss 血条与垂直火球的 IWBTZ 动态 Boss 阶段" }, layout: "wide", presentation: "framed",
      },
      {
        step: "06", title: "童年森林把“被误解”变成会追赶玩家的影子",
        body: "熟悉的蘑菇与花朵从温暖景物逐渐变成指向主角的轮廓；跳跃路线越往前越收窄，让一段被误读的童年通过操作被重新穿过。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-06-memory-forest.png", alt: "Zomboy 在追赶般的剪影下穿过蘑菇森林的 IWBTZ 童年记忆关卡" }, layout: "wide", presentation: "framed",
      },
      {
        step: "07", title: "重复的规则持续压缩安全空间",
        body: "时钟、作业纸和整齐平台共同构成机械节奏；追咬花与移动障碍迫使玩家缩短犹豫时间，也让“坚持”从文字主题变成真实的操作压力。",
        visual: { kind: "image", src: "/portfolio/iwbtz-case-07-school-pressure.png", alt: "由时钟、作业纸、机械障碍与追咬花构成的 IWBTZ 校园压力关卡" }, layout: "wide", presentation: "framed",
      },
    ],
  },
  "auto-tune": {
    en: [
      { step: "01", title: "One Extension, Three Posting Interfaces", body: "The extension identifies the current supported tab and keeps drafts visible before any action. The control panel makes language, local state, selection, and START explicit.", visual: { kind: "image", src: "/portfolio/auto-tune-control-panel.png", alt: "Auto Tune Control Panel Beside an X Direct-Message Thread", fit: "cover" }, layout: "wide" },
      { step: "02", title: "Keep Platform Differences at the Edges", body: "X, Facebook, and Instagram share draft generation, language controls, runtime state, and local storage. Each platform keeps its own DOM and editor adapter.", visual: { kind: "image", src: "/portfolio/auto-tune-adapters.png", alt: "Auto Tune Shared Core and Three Platform Adapters", fit: "cover" }, layout: "wide" },
      { step: "03", title: "AUTO REPLY Has a Deliberately Narrow Boundary", body: "On X direct messages only, the extension waits a random 1–30 seconds before sending the fixed opt-out reply. The interface also exposes STOP, local state, and the unsupported platforms.", visual: { kind: "image", src: "/portfolio/auto-tune-x-reply.png", alt: "Auto Tune X-Only Delayed Auto Reply", fit: "cover" }, layout: "wide" },
    ],
    zh: [
      { step: "01", title: "草稿先可见，动作再发生", body: "扩展识别当前受支持标签页，并在任何动作发生前保持草稿可见；语言、本地状态、当前选择与 START 都在同一控制面板中明确呈现。", visual: { kind: "image", src: "/portfolio/auto-tune-control-panel.png", alt: "X 私信旁的 Auto Tune 统一控制台", fit: "cover" }, layout: "wide" },
      { step: "02", title: "平台差异留在边缘层", body: "X、Facebook 与 Instagram 共用草稿生成、语言控制、运行状态和本地存储，各平台只维护自己的 DOM 与编辑区适配器。", visual: { kind: "image", src: "/portfolio/auto-tune-adapters.png", alt: "Auto Tune 共享核心与三平台适配结构", fit: "cover" }, layout: "wide" },
      { step: "03", title: "AUTO REPLY 有意保持窄边界", body: "只有 X 私信支持延迟自动回复：系统随机等待 1–30 秒，再发送固定退订文本；界面同时公开 STOP、本地状态和不支持的平台。", visual: { kind: "image", src: "/portfolio/auto-tune-x-reply.png", alt: "Auto Tune 仅限 X 的延迟自动回复", fit: "cover" }, layout: "wide" },
    ],
  },
  "study-assistant": {
    en: [
      { step: "01", title: "Installation Status and Version", body: "Edge’s extension manager shows Literature Research Assistant v1.2.0 loaded in developer mode and currently enabled.", visual: { kind: "image", src: "/portfolio/literature-installed.png", alt: "Literature Research Assistant Installed and Enabled in Edge", fit: "contain" }, layout: "wide" },
      { step: "02", title: "Research Tools Beside the Source", body: "Search, translation, highlighting, phrase collection, notes, mind maps, and focus timing remain beside the source material inside one panel.", visual: { kind: "image", src: "/portfolio/literature-workspace.png", alt: "Literature Research Assistant Working Inside the Source Page", fit: "contain" }, layout: "wide" },
      { step: "03", title: "Translate, Highlight, and Save", body: "Selected text can be translated, highlighted, or saved locally while the source article remains visible.", visual: { kind: "image", src: "/portfolio/literature-reading-loop.png", alt: "Selection, Translation, Highlighting, and Saving Beside an Article", fit: "contain" }, layout: "wide" },
      { step: "04", title: "Search Papers from Selected Text", body: "Selected text can be used to search for related papers with one click across multiple supported research platforms.", visual: { kind: "image", src: "/portfolio/literature-search.png", alt: "Search for related papers from selected text across supported platforms", fit: "contain" }, layout: "wide" },
      { step: "05", title: "Save Research Material Locally", body: "Vocabulary, sentences, mind maps, and saved papers are stored locally and can be reviewed from the extension panel.", visual: { kind: "image", src: "/portfolio/literature-saved-library.png", alt: "Locally saved vocabulary sentences mind maps and papers", fit: "contain" }, layout: "wide" },
      { step: "06", title: "Review Saved Notes Beside the Article", body: "The saved-notes panel remains visible beside the current article and supports sorting and label filters.", visual: { kind: "image", src: "/portfolio/literature-saved-notes.png", alt: "Saved notes displayed beside the source article", fit: "contain" }, layout: "wide" },
      { step: "07", title: "Translation and Multi-color Highlighting", body: "Selected text can be translated, highlighted with multiple colors, or saved to local vocabulary, sentence, and note collections.", visual: { kind: "image", src: "/portfolio/literature-translation-highlight.png", alt: "Literature Research Assistant translation and multi-color highlighting interface", fit: "contain" }, layout: "wide" },
      { step: "08", title: "Mind-map Workspace", body: "The built-in editor supports topics, branches, subtopics, leaf nodes, color and shape settings, and local saving.", visual: { kind: "image", src: "/portfolio/literature-mind-map.png", alt: "Literature Research Assistant mind-map editor", fit: "contain" }, layout: "wide" },
      { step: "09", title: "Restore Highlights on Changing Pages", body: "Stable page identity, DOM paths, text fallback, and batched MutationObserver recovery work together across refreshes and asynchronous node replacement.", visual: { kind: "flow", eyebrow: "Annotation Recovery Flow", nodes: ["Selection Range", "DOM Path", "Local Record", "Text Fallback", "Change Recovery"], note: "Page changes remain visible and reversible, while extension styles stay contained instead of leaking into the host page." } },
    ],
    zh: [
      { step: "01", title: "安装状态与版本信息", body: "Edge 扩展管理页显示文献查阅辅助工具 v1.2.0，当前通过开发者模式加载并处于启用状态。", visual: { kind: "image", src: "/portfolio/literature-installed.png", alt: "文献查阅辅助工具在 Edge 中安装并启用", fit: "contain" }, layout: "wide" },
      { step: "02", title: "原文旁的研究工具", body: "面板提供论文搜索、翻译、高亮、词句收藏、笔记、思维导图与专注计时，原始页面保持可见。", visual: { kind: "image", src: "/portfolio/literature-workspace.png", alt: "文献查阅辅助工具在原始页面中工作", fit: "contain" }, layout: "wide" },
      { step: "03", title: "翻译、高亮与保存", body: "选中文本后可以执行翻译和高亮，也可以保存到本地生词本或生句本。", visual: { kind: "image", src: "/portfolio/literature-reading-loop.png", alt: "原文旁的选区、翻译、高亮与保存流程", fit: "contain" }, layout: "wide" },
      { step: "04", title: "选中文字即可搜索相关论文", body: "选中文字即可一键搜索相关论文，支持多平台查询。", visual: { kind: "image", src: "/portfolio/literature-search.png", alt: "选中文字后跨平台搜索相关论文", fit: "contain" }, layout: "wide" },
      { step: "05", title: "本地保存研究资料", body: "本地保存生词、生句、思维导图与收藏论文，并可在扩展面板中查看。", visual: { kind: "image", src: "/portfolio/literature-saved-library.png", alt: "本地保存生词生句思维导图与收藏论文", fit: "contain" }, layout: "wide" },
      { step: "06", title: "在原文旁查看已保存笔记", body: "笔记面板与当前文章同时显示，支持按时间排序、标签筛选与详情查看。", visual: { kind: "image", src: "/portfolio/literature-saved-notes.png", alt: "在原文旁查看已保存笔记", fit: "contain" }, layout: "wide" },
      { step: "07", title: "翻译与多色高亮", body: "选中文本后可以翻译、设置多种高亮颜色，并保存到生词本、生句本或笔记。", visual: { kind: "image", src: "/portfolio/literature-translation-highlight.png", alt: "文献查阅辅助工具翻译与多色高亮界面", fit: "contain" }, layout: "wide" },
      { step: "08", title: "思维导图工作区", body: "内置编辑器支持中心主题、分支、子主题和叶子节点，并提供颜色、形状与本地保存设置。", visual: { kind: "image", src: "/portfolio/literature-mind-map.png", alt: "文献查阅辅助工具思维导图编辑器", fit: "contain" }, layout: "wide" },
      { step: "09", title: "页面变化后的高亮恢复", body: "稳定页面身份、DOM 路径、文本回退与 MutationObserver 批量恢复共同应对刷新和异步节点替换。", visual: { kind: "flow", eyebrow: "标注恢复流程", nodes: ["选区 Range", "DOM 路径", "本地记录", "文本回退", "变更恢复"], note: "页面变化保持可见与可撤回，扩展样式也不会泄漏到宿主页面。" } },
    ],
  },
};

export function getProjectCaseStudy(projectId: ProjectId, locale: Locale) {
  return projectCaseStudies[projectId][locale];
}
