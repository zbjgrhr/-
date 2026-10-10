import type { Locale } from "@/types";

export interface ExperienceItem {
  organization: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  evidence: string[];
}

export interface CapabilityGroup {
  title: string;
  skills: string[];
}

interface TimelineItem {
  period: string;
  title: string;
  detail: string;
}

interface ProfileCopy {
  role: string;
  headline: string;
  summary: string;
  proofLabel: string;
  experienceLabel: string;
  experienceIntro: string;
  availability: string;
  focus: string;
  capabilityLabel: string;
  capabilityIntro: string;
  capabilities: CapabilityGroup[];
  experiences: ExperienceItem[];
  timelineLabel: string;
  timeline: TimelineItem[];
}

const profileCopy: Record<Locale, ProfileCopy> = {
  en: {
    role: "Game Design × AI Products",
    headline: "I make the worlds I imagine playable, and the tools I build useful.",
    summary:
      "I work across game design and AI products. Whether it's a level, a rule, or a browser tool, I want someone outside the project to understand it and make it their own.",
    proofLabel: "Evidence in the Work",
    experienceLabel: "Selected Experience",
    experienceIntro:
      "Before these independent projects, I worked with museum visitors, community members, and media audiences. Those encounters still shape how I design and deliver interactive work.",
    availability: "Open to opportunities in game design, AI products, and interactive experiences.",
    focus: "Game Systems · AI Product Design · Interactive Prototyping · User Research",
    capabilityLabel: "One Practice, Four Perspectives",
    capabilityIntro:
      "I move between research, rules, prototypes, and the people who use them. Each perspective helps me see what the others miss.",
    capabilities: [
      { title: "Game Design", skills: ["Systems Design", "Level Design", "Narrative Design", "Boss Mechanics", "Balance", "Playtest Iteration"] },
      { title: "AI Products", skills: ["Multi-Agent Workflows", "Product Architecture", "Prompt Systems", "Model Routing", "Human Approval", "Evaluation"] },
      { title: "Interactive Development", skills: ["GameMaker / GML", "Next.js", "TypeScript", "Browser Extensions", "Local Data", "Static Deployment"] },
      { title: "Users & Market", skills: ["User Interviews", "Surveys", "Community Operations", "Event Planning", "Content Planning", "Iterative Validation"] },
    ],
    experiences: [
      {
        organization: "Gansu Bamboo Slips Museum",
        role: "Digital Exhibitions & Cultural Product Support",
        period: "2022.12–2023.11",
        location: "Gansu, China",
        summary:
          "At a public cultural institution, I contributed to digital exhibitions, artifact storytelling, interactive delivery, and cultural-product concepts.",
        evidence: [
          "Supported the content and interactive launch of online exhibitions",
          "Contributed to an award-winning exhibition project",
          "Designed three sticker packs; the most popular surpassed 6,000 downloads",
        ],
      },
      {
        organization: "Social Dubai",
        role: "Community Operations & Event Planning",
        period: "2023–2024",
        location: "Dubai, UAE",
        summary:
          "Built and operated Chinese-speaking communities around local social life, events, and merchant partnerships.",
        evidence: [
          "Operated three communities reaching more than 700 members",
          "Planned and delivered over 30 offline events, with peak attendance above 80",
          "Grew a Xiaohongshu audience to about 1,000 followers and completed more than 10 merchant collaborations",
        ],
      },
      {
        organization: "Gansu Television",
        role: "Program Planning & New Media Operations",
        period: "2021.08–2022.04",
        location: "Gansu, China",
        summary:
          "Contributed to program development, content production, and channel operations in a broadcast environment.",
        evidence: [
          "Supported topic development and production coordination",
          "Adapted program content and promotional assets for new-media channels",
          "Coordinated across editorial, production, and release timelines",
        ],
      },
    ],
    timelineLabel: "Additional Experience",
    timeline: [
      { period: "2023.11–2024.08", title: "YEE AU CARRÉ DMCC · HR Specialist", detail: "Managed recruitment, employee coordination, and cross-cultural operations in Dubai." },
      { period: "2023–2026", title: "Independent Yacht & Sea-Fishing Service", detail: "Managed customer acquisition, conversion, service coordination, and per-booking profit calculations in the UAE." },
    ],
  },
  zh: {
    role: "游戏策划 × AI 产品",
    headline: "让想象中的世界可以游玩，让做出来的工具真正好用。",
    summary:
      "我在游戏策划与 AI 产品之间工作。无论是一关游戏、一套规则，还是一个浏览器工具，我都希望第一次接触它的人能看懂、上手，并按自己的方式使用。",
    proofLabel: "作品中的证据",
    experienceLabel: "精选经历",
    experienceIntro:
      "做独立项目以前，我面对过博物馆观众、社群成员和媒体受众。那些具体的人和现场，至今仍影响我设计互动作品的方式。",
    availability: "关注游戏策划、AI 产品与互动体验相关机会。",
    focus: "游戏系统 · AI 产品设计 · 互动原型 · 用户研究",
    capabilityLabel: "一条实践，四个观察角度",
    capabilityIntro:
      "研究、规则、原型和真实使用者，是我看同一个问题的不同角度。换一个角度，往往就能看到上一眼遗漏的东西。",
    capabilities: [
      { title: "游戏策划", skills: ["系统设计", "关卡设计", "叙事设计", "Boss 机制", "数值平衡", "试玩迭代"] },
      { title: "AI 产品", skills: ["多 Agent 工作流", "产品架构", "提示系统", "模型路由", "人工审批", "效果评估"] },
      { title: "互动实现", skills: ["GameMaker / GML", "Next.js", "TypeScript", "浏览器扩展", "本地数据", "静态部署"] },
      { title: "用户与市场", skills: ["用户访谈", "问卷", "社群运营", "活动策划", "内容规划", "迭代验证"] },
    ],
    experiences: [
      {
        organization: "甘肃简牍博物馆",
        role: "数字展览与文化产品支持",
        period: "2022.12–2023.11",
        location: "甘肃，中国",
        summary: "在公共文化机构参与数字展览、文物叙事、互动交付，也做过文创构想。",
        evidence: ["支持线上展览内容与交互上线", "参与获奖展览项目", "设计三套表情包，其中下载量最高的一套超过 6,000 次"],
      },
      {
        organization: "Social Dubai（社交迪拜）",
        role: "社群运营与活动策划",
        period: "2023–2024",
        location: "迪拜，阿联酋",
        summary: "围绕本地社交、活动与商家合作，搭建并运营中文社群。",
        evidence: ["运营 3 个社群，覆盖 700+ 成员", "策划并落地 30+ 场线下活动，单场峰值超过 80 人", "小红书积累约 1,000 名关注者，并完成 10+ 次商家合作"],
      },
      {
        organization: "甘肃电视台",
        role: "节目策划与新媒体运营",
        period: "2021.08–2022.04",
        location: "甘肃，中国",
        summary: "在广电环境中参与节目选题、内容制作与频道运营。",
        evidence: ["参与选题策划与制作协调", "将节目内容与宣传素材适配新媒体渠道", "在编辑、制作与发布时间线间协同"],
      },
    ],
    timelineLabel: "补充实践",
    timeline: [
      { period: "2023.11–2024.08", title: "YEE AU CARRÉ DMCC · HR Specialist（人力资源专员）", detail: "在迪拜负责招聘、员工协调与跨文化运营。" },
      { period: "2023–2026", title: "独立游艇与海钓服务实践", detail: "在阿联酋负责获客、转化、服务协调与单笔收益核算。" },
    ],
  },
};

export function getProfileCopy(locale: Locale) {
  return profileCopy[locale];
}

export const publicLinks = {
  email: "18193156575@163.com",
  alumniEmail: "hxz439@alumni.bham.ac.uk",
  github: "https://github.com/zbjgrhr",
} as const;
