import type { ChapterId, Locale, ProjectId } from "@/types";

export type LevelDifficulty = "casual" | "hard" | "expert" | "nightmare";
export interface LocalizedText { en: string; zh: string }
export interface LevelScrollPanel { eyebrow: LocalizedText; title: LocalizedText; body: LocalizedText; image: string }
export interface GameLevel {
  id: ProjectId; order: number; chapter: ChapterId; difficulty: LevelDifficulty;
  title: LocalizedText; shortTitle: LocalizedText; description: LocalizedText; mood: LocalizedText;
  track: string; artist: string; audio: string; bpm: number; duration: number;
  environment: string; accent: string; accentNumber: number; cover: string;
  mechanic: LocalizedText; narrative: LocalizedText[]; panels: LevelScrollPanel[]; ending: LocalizedText;
}
const t = (en: string, zh: string): LocalizedText => ({ en, zh });
const panel = (eyebrow: LocalizedText, title: LocalizedText, body: LocalizedText, image: string): LevelScrollPanel => ({ eyebrow, title, body, image });

export const GAME_LEVELS: GameLevel[] = [
  {
    id: "pixel-world", order: 1, chapter: "movement-i", difficulty: "hard",
    title: t("Pixel World", "PIXEL WORLD（像素世界）"), shortTitle: t("Agent Studio", "Agent 制作室"),
    description: t("A ten-agent workflow turns one creative premise into a complete world that can be inspected, played, and taken away.", "通过十 Agent 工作流，把一个创意原点变成可检查、能游玩、能带走的完整世界。"),
    mood: t("A sunlit departure into a new world", "向着新世界出发的明亮旅程"),
    track: "Piano Sonata No. 15 ‘Pastoral’ · III. Scherzo", artist: "L. van Beethoven · Karine Gilanyan", audio: "/audio/watercolor/beethoven-pastoral-scherzo.ogg", bpm: 132, duration: 118.596,
    environment: "pixel-world", accent: "#c988a9", accentNumber: 0xc988a9, cover: "/portfolio/pixel-world-v5-platform-overview.png",
    mechanic: t("Creative Brief · Agent Review · Playable Delivery", "创意简报 · Agent 互审 · 可玩交付"),
    narrative: [
      t("Before production begins, the creative brief protects the creator’s core premise.", "制作开始前，创意简报先保护创作者的核心设定。"),
      t("Ten agents divide the work and cross-review one another, surfacing conflicts early.", "十个 Agent 分工并交叉评审，让冲突提前显现。"),
      t("Approved rules become assets, levels, and a genuinely playable world.", "获批规则会变成素材、关卡，以及一个真正可玩的世界。"),
      t("Local saves and offline packages return control of the work to the creator.", "本地存档与离线包，把作品的控制权交还创作者。"),
    ],
    panels: [
      panel(t("01 / Concept → Specification", "01 / 构想 → 规格"), t("Start from Creative Intent, Not a Template", "从创作意图出发，而不是套模板"), t("A guided brief organizes the story, level structure, and constraints into GameSpec V3 while preserving the original idea.", "引导式简报把故事、关卡结构与限制条件整理为 GameSpec V3，同时保留原始创意。"), "/portfolio/pixel-world-v5-dynamic-home.png"),
      panel(t("02 / Agents → Cross-Review", "02 / 智能体 → 互审"), t("Make the Workflow Visible", "让工作流被看见"), t("Ten specialist agents plan and review through one progress panel. Failed tasks can be retried locally without erasing completed results.", "十个专业 Agent 在统一进度面板中规划与复核；失败任务可局部重试，不会抹掉已完成结果。"), "/portfolio/pixel-world-v5-agent-studio.png"),
      panel(t("03 / Rules → Assets", "03 / 规则 → 素材"), t("Turn Generation into a Recoverable Production Pipeline", "让生成成为可恢复的生产管线"), t("The approved specification expands into parallel asset tasks. Even the generated cover transforms the creation interface into a real entrance to this world.", "获批规格展开为并行素材任务；生成封面也会把创作器变成这个世界的真实入口。"), "/portfolio/pixel-world-v5-asset-system.png"),
      panel(t("04 / Build → Play", "04 / 构建 → 游玩"), t("A World Is Complete When It Can Be Played", "能被游玩，世界才算完成"), t("Creators can define different level structures and goals, then save locally and export an offline game after playtesting.", "创作者可定义不同的关卡结构与目标，并在游玩后本地存档、导出离线游戏。"), "/portfolio/pixel-world-v5-gameplay-boss.png"),
    ],
    ending: t("A prompt opens the world. Inspection, play, and ownership make it complete.", "Prompt 开启世界；检查、游玩与拥有它，才让世界完整。"),
  },
  {
    id: "rainy-arcade", order: 2, chapter: "movement-ii", difficulty: "hard",
    title: t("Rainy Night Arcade", "雨夜游戏厅"), shortTitle: t("Rainy Night Arcade", "雨夜游戏厅"),
    description: t("A narrative arcade on a rainy night, where player behavior becomes locally stored design evidence that players may choose to export.", "一座雨夜叙事街机厅：玩家行为在这里变成只存本地、可自行导出的设计线索。"),
    mood: t("A quiet mystery slowly surfacing in the rain", "雨声里缓慢浮现的谜题"),
    track: "Gnossienne No. 2", artist: "Erik Satie · La Pianista", audio: "/audio/watercolor/satie-gnossienne-2.ogg", bpm: 72, duration: 101.579,
    environment: "rainy-arcade", accent: "#7ea8bf", accentNumber: 0x7ea8bf, cover: "/portfolio/rain-arcade-hero.png",
    mechanic: t("Explore · Choose · Reflect", "探索 · 选择 · 回望"),
    narrative: [
      t("Rain slows players down—just enough to notice a story.", "雨让玩家慢下来，刚好有时间看见一段故事。"),
      t("Two completed worlds unfold through different rhythms, choices, and emotional temperatures.", "两个已完成世界用不同节奏、选择与情绪温度展开。"),
      t("Hints, retries, and time spent leave useful design evidence without becoming surveillance.", "提示、重试和停留时间都会留下设计线索，却不会变成监控。"),
      t("Whether an anonymous report ever leaves the device is always the player’s choice.", "匿名报告是否离开设备，始终由玩家自己决定。"),
    ],
    panels: [
      panel(t("01 / Player → Rhythm", "01 / 玩家 → 节奏"), t("Designed for Curious Night Wanderers", "为好奇的夜行玩家设计"), t("The player profile prioritizes short sessions, curiosity, and emotional aftertaste—not only score.", "用户画像优先考虑短时体验、探索欲与情绪余韵，而不只追求分数。"), "/portfolio/rain-arcade-hall.png"),
      panel(t("02 / World → Choice", "02 / 世界 → 选择"), t("Every Cabinet Changes the Emotional Rules", "每台街机都改变情绪规则"), t("Block City and Rain City combine narrative, interaction, and sound into two playable worlds with distinct personalities.", "《积木城》和《雨城》把叙事、交互和声音组合成两个气质不同的可玩世界。"), "/portfolio/rain-city.png"),
      panel(t("03 / Behavior → Profile", "03 / 行为 → 画像"), t("Profiles for Reflection, Not Diagnosis", "这些画像用来回望，而不是诊断"), t("The four-dimensional entertainment profile explains its evidence and confidence, while stating clearly that it is not a psychological diagnosis.", "四维娱乐画像会解释依据与可信程度，并明确声明不构成心理诊断。"), "/portfolio/rain-player-profile.png"),
      panel(t("04 / Export → Insight", "04 / 导出 → 洞察"), t("A Consent-Respecting Developer View", "尊重同意的开发者视角"), t("Anonymous JSON is exported only when the player acts. Developers then import it locally to review completion, duration, hints, and retries.", "匿名 JSON 仅在玩家主动操作时导出，再由开发者本地导入，查看完成率、时长、提示与重试。"), "/portfolio/rain-developer-analytics.png"),
    ],
    ending: t("A good data tool helps designers listen without making players feel watched.", "好的数据工具，应帮助设计者倾听，而不让玩家感到被注视。"),
  },
  {
    id: "iwbtz", order: 3, chapter: "movement-iii", difficulty: "nightmare",
    title: t("I Wanna Be the Zomboy", "I Wanna Be the Zomboy"), shortTitle: t("IWBTZ", "IWBTZ"),
    description: t("A hardcore platformer about misunderstanding, persistence, and accepting an imperfect self.", "一款关于误解、坚持与接纳不完美自我的硬核平台游戏。"),
    mood: t("Bright, precise, and always pressing forward", "明亮、精准、不断向前"),
    track: "Invention No. 8 in F Major, BWV 779", artist: "J. S. Bach · Public-domain performance", audio: "/audio/watercolor/bach-invention-8.ogg", bpm: 152, duration: 61.78,
    environment: "iwbtz", accent: "#d08d73", accentNumber: 0xd08d73, cover: "/portfolio/iwbtz-menu.png",
    mechanic: t("Precision Platforming · Escalating Bosses", "精密跳跃 · 递进式 Boss"),
    narrative: [
      t("Seven standard levels turn the pressures of growing up into spaces players can cross.", "七个标准关卡，把成长压力变成玩家可以穿过的空间。"),
      t("Four bosses layer new attacks as their health falls, changing the solution throughout each fight.", "四个 Boss 会随血量下降叠加攻击，让解法在战斗中不断改变。"),
      t("The DYOC system gives this difficult journey an appearance of the player’s own.", "DYOC 系统让这段艰难旅程拥有玩家自己的外观。"),
      t("Playtesting moved the story into the action itself and made the opening easier to understand.", "测试把叙事推进到行动本身，也让开场更容易理解。"),
    ],
    panels: [
      panel(t("01 / Theme → Level", "01 / 主题 → 关卡"), t("Turn Inner Conflict into Playable Space", "把内在冲突变成可玩的空间"), t("Seven standard levels map childhood, school, social pressure, and self-acceptance onto platforming challenges.", "七个标准关卡把童年、校园、社会压力与自我和解映射为平台挑战。"), "/portfolio/iwbtz-stage-select.png"),
      panel(t("02 / System → Identity", "02 / 系统 → 身份"), t("DYOC: Design Your Own Character", "DYOC：设计自己的角色"), t("Local and randomized routes combine clothing, body parts, and colors into a character that truly belongs to the player.", "本地和随机化路径把服装、身体和配色组合成真正属于玩家的角色。"), "/portfolio/iwbtz-dyoc-flow.png"),
      panel(t("03 / Boss → Escalation", "03 / Boss → 递进"), t("The Fight Rewrites Itself", "战斗会重写自己"), t("Every 25% of health a boss loses adds another attack pattern, creating pressure through combination rather than speed alone.", "Boss 每损失 25% 血量就叠加一种攻击，靠组合变化制造压力，而不只是提速。"), "/portfolio/iwbtz-level-boss.png"),
      panel(t("04 / Testing → Rewrite", "04 / 测试 → 重写"), t("Let Player Behavior Rewrite the Design", "让玩家行为改写设计"), t("More than 15 playtesters exposed problems with skipped tutorials and missed story context, leading to shorter text, in-level narrative, and a clearer opening flow.", "15 名以上测试者暴露了跳过教程和错过剧情的问题，促成短文本、关卡内叙事与更清晰的开场流程。"), "/portfolio/iwbtz-level-industrial.png"),
    ],
    ending: t("Difficulty becomes meaningful when every retry teaches players more about the level—and about themselves.", "当每次重试都让玩家更懂关卡、也更懂自己时，困难才真正有意义。"),
  },
  {
    id: "auto-tune", order: 4, chapter: "movement-iv", difficulty: "casual",
    title: t("Auto Tune", "Auto Tune"), shortTitle: t("Auto Tune", "Auto Tune"),
    description: t("A browser extension that brings multilingual posting across three platforms into one compact control panel.", "一款把三平台多语言发帖操作收进小型控制面板的浏览器扩展。"),
    mood: t("A nimble studio rhythm, light on its feet", "轻快运转的工作室节奏"),
    track: "Scenes from Childhood · V. Happiness", artist: "Robert Schumann · Musopen performance", audio: "/audio/watercolor/schumann-happiness.ogg", bpm: 104, duration: 89.94,
    environment: "auto-tune", accent: "#c2a06d", accentNumber: 0xc2a06d, cover: "/portfolio/auto-reply-control.webp",
    mechanic: t("Draft · Detect · Post", "草稿 · 识别 · 发布"),
    narrative: [
      t("One control panel recognizes the current social platform.", "一个控制面板会识别当前社交平台。"),
      t("Random Chinese and English drafts remain visible before they are posted.", "中英文随机草稿在发布前始终可见。"),
      t("Platform-specific selectors stay isolated at the edges of the system.", "平台专属选择器被隔离在系统边缘。"),
      t("Small-scale automation becomes useful when its boundaries are clear.", "边界足够清楚，小型自动化才真正有用。"),
    ],
    panels: [
      panel(t("01 / Tab → Context", "01 / 标签页 → 语境"), t("Help Users Where Posting Happens", "在发帖发生的地方帮助用户"), t("The extension recognizes X, Facebook, and Instagram tabs while preserving one compact interaction model.", "扩展识别 X、Facebook 与 Instagram 标签页，同时保持一套紧凑交互模型。"), "/portfolio/auto-reply-control.webp"),
      panel(t("02 / Draft → Action", "02 / 草稿 → 行动"), t("Keep Generated Content Editable", "生成内容保持可编辑"), t("Random Chinese and English drafts appear first; START then acts on the current page, keeping the workflow understandable.", "中英文随机草稿会先出现，再由 START 操作当前页面，工作流始终可理解。"), "/portfolio/auto-reply-x-zh.png"),
      panel(t("03 / Shared → Adapted", "03 / 共用 → 适配"), t("Share the Shell, Isolate the Fragile Parts", "共享外壳，隔离脆弱部分"), t("Common state and controls share one implementation, while fast-changing page selectors are maintained separately for each platform.", "通用状态和控件复用同一套；易变化的页面选择器则按平台独立维护。"), "/portfolio/auto-reply-facebook-en.png"),
      panel(t("04 / Scope → Trust", "04 / 范围 → 信任"), t("Describe Automation Capabilities Precisely", "准确说明自动化能做什么"), t("START supports three posting interfaces. Delayed AUTO REPLY is clearly limited to X.", "START 支持三个发帖界面；延时 AUTO REPLY 则被明确限定为 X 专属能力。"), "/portfolio/auto-reply-control.webp"),
    ],
    ending: t("Clear capability boundaries turn a fragile script into a product users can understand.", "清楚的能力边界，能把脆弱脚本变成用户可理解的产品。"),
  },
  {
    id: "study-assistant", order: 5, chapter: "movement-iv", difficulty: "expert",
    title: t("Literature Research Assistant", "文献查阅辅助工具"), shortTitle: t("Literature Research Assistant", "文献查阅辅助工具"),
    description: t("Keep translation, highlighting, notes, mind maps, and focus timing beside the source instead of scattering them across separate tools.", "把翻译、高亮、笔记、思维导图与专注计时留在原文旁边，不再分散到多个工具。"),
    mood: t("A slow afternoon settling into concentration", "安静沉入阅读的午后"),
    track: "Scenes from Childhood · XII. Child Falling Asleep", artist: "Robert Schumann · Musopen performance", audio: "/audio/watercolor/schumann-child-falling-asleep.ogg", bpm: 68, duration: 121.469,
    environment: "study-assistant", accent: "#809e8c", accentNumber: 0x809e8c, cover: "/portfolio/web-study-workspace.webp",
    mechanic: t("Read · Connect · Retain", "阅读 · 连接 · 留存"),
    narrative: [
      t("Understanding breaks whenever every thought requires switching applications.", "每个念头都要切换应用时，理解就会断裂。"),
      t("Translation and highlighting remain anchored to the original context.", "翻译与高亮始终依附于原文语境。"),
      t("Notes grow into a mind map instead of another pile of forgotten text.", "笔记会生长成思维导图，而不是另一堆被遗忘的文本。"),
      t("The focus timer protects the reading loop without obscuring the material itself.", "专注计时器保护阅读循环，却不会遮住真正的材料。"),
    ],
    panels: [
      panel(t("01 / Source → Context", "01 / 原文 → 语境"), t("Understand Without Leaving the Page", "不离开页面也能读懂"), t("Selection translation and highlighting reduce the friction of reading unfamiliar passages.", "划词翻译与高亮降低了查阅陌生段落的操作成本。"), "/portfolio/web-study-workspace.webp"),
      panel(t("02 / Notes → Connections", "02 / 笔记 → 连接"), t("Turn Fragments into Structure", "把碎片变成结构"), t("In-page notes can be organized into a mind map that preserves the relationship between evidence and ideas.", "页内笔记可以整理成思维导图，保留证据和观点之间的关系。"), "/portfolio/web-study-map.webp"),
      panel(t("03 / Time → Focus", "03 / 时间 → 专注"), t("Protect Uninterrupted Reading Time", "保护连续阅读时间"), t("The integrated timer supports intentional reading sessions without pulling attention away from the source.", "集成计时器支持有意识的阅读时段，同时不把注意力带离原文。"), "/portfolio/web-study-workspace.webp"),
      panel(t("04 / Browser → Workbench", "04 / 浏览器 → 工作台"), t("One Local Interface for the Complete Learning Loop", "一块本地界面，容纳完整学习循环"), t("The tool combines reading support and knowledge organization in a browser-native workbench.", "工具把阅读辅助与知识整理合并为浏览器原生工作台。"), "/portfolio/web-study-map.webp"),
    ],
    ending: t("A learning tool earns attention by returning it to the material itself.", "学习工具赢得注意力的方式，是把注意力还给材料本身。"),
  },
];

export const DEFAULT_LEVEL_ID: ProjectId = "pixel-world";
export function getGameLevel(id: ProjectId | string | null | undefined) { return GAME_LEVELS.find((level) => level.id === id) ?? GAME_LEVELS[0]; }
export function localize(text: LocalizedText, locale: Locale) { return text[locale]; }
export const DIFFICULTY_LABELS: Record<LevelDifficulty, LocalizedText> = { casual: t("Casual", "休闲"), hard: t("Hard", "困难"), expert: t("Expert", "专家"), nightmare: t("Nightmare", "噩梦") };
export const DIFFICULTY_STARS: Record<LevelDifficulty, number> = { casual: 2, hard: 3, expert: 4, nightmare: 5 };
