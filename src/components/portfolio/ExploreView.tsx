"use client";

import Link from "next/link";
import { useState } from "react";
import { ProjectCaseStudy } from "@/components/portfolio/ProjectCaseStudy";
import { getContent } from "@/content";
import { getProfileCopy, publicLinks } from "@/data/profile";
import { projects } from "@/data/projects";
import { localizeProjects } from "@/data/projectTranslations";
import { useUiStore } from "@/store/uiStore";

export function ExploreView() {
  const locale = useUiStore((state) => state.locale);
  const setMode = useUiStore((state) => state.setMode);
  const setLocale = useUiStore((state) => state.setLocale);
  const [showWechat, setShowWechat] = useState(false);
  const content = getContent(locale);
  const profile = getProfileCopy(locale);
  const projectList = localizeProjects(projects, locale);

  return (
    <main className="explore-page" id="main-content">
      <header className="explore-header">
        <Link href="/" className="explore-wordmark" onClick={() => setMode("entry")}>
          <span>HZ</span>
          <strong>Resonance Archive</strong>
        </Link>
        <nav className="explore-nav" aria-label={locale === "en" ? "Portfolio navigation" : "作品集导航"}>
          <a href="#work">{locale === "en" ? "Work" : "作品"}</a>
          <a href="#experience">{locale === "en" ? "Experience" : "经历"}</a>
          <a href="#contact">{locale === "en" ? "Contact" : "联系"}</a>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
          <Link href="/play" className="portfolio-play-cta" onClick={() => setMode("entry")}>
            <span className="play-cta-eq" aria-hidden><i /><i /><i /><i /></span>
            {content.explore.playInstead}
          </Link>
        </nav>
      </header>

      <section className="explore-hero" aria-labelledby="portfolio-title">
        <div className="explore-dream-cluster" aria-hidden>
          <i />
          <i />
          <span>✦</span>
        </div>
        <div className="explore-hero-copy">
          <p className="entry-eyebrow">{profile.role}</p>
          <h1 id="portfolio-title">{profile.headline}</h1>
          <p className="explore-lead">{profile.summary}</p>
          <div className="explore-actions">
            <Link href="/play" className="btn-primary portfolio-hero-play" onClick={() => setMode("entry")}>
              <span aria-hidden>▶</span>
              {locale === "en" ? "Play the Portfolio" : "进入演奏作品集"}
            </Link>
            <a className="btn-primary" href="#work">
              {locale === "en" ? "View Selected Work" : "查看精选作品"}
            </a>
            <a className="btn-secondary" href={publicLinks.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="explore-identity-card">
          <span className="explore-monogram">HZ</span>
          <div>
            <strong>{content.name}</strong>
            <p>{content.nameZh}</p>
          </div>
          <dl>
            <div>
              <dt>{locale === "en" ? "Education" : "教育"}</dt>
              <dd>
                {locale === "en"
                  ? "University of Birmingham · MSc AI & CS · 30% Merit Scholarship"
                  : "University of Birmingham（伯明翰大学） · MSc AI & CS（人工智能与计算机科学硕士） · 30% Merit Scholarship"}
              </dd>
            </div>
            <div>
              <dt>{locale === "en" ? "Focus" : "方向"}</dt>
              <dd>{profile.focus}</dd>
            </div>
            <div>
              <dt>{locale === "en" ? "Location" : "所在地"}</dt>
              <dd>{locale === "en" ? "China · Open to Global Opportunities" : "中国 · 接受全球机会"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rhythm-invitation" aria-label={locale === "en" ? "Enter the Interactive Portfolio" : "进入互动作品集"}>
        <div className="rhythm-invitation-score" aria-hidden>
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ height: `${18 + (index % 5) * 11}px` }} />)}
        </div>
        <div>
          <p>INTERACTIVE MODE / 互动模式</p>
          <h2>{locale === "en" ? "Don’t just read the projects—play them." : "不只阅读项目，也亲自演奏它们。"}</h2>
          <span>{locale === "en" ? "Six projects · Five playable arrangements · Every current level unlocked" : "六个项目 · 五种可玩编曲 · 现有全部关卡开放"}</span>
        </div>
        <Link href="/play" className="rhythm-invitation-button" onClick={() => setMode("entry")}>
          <span>{locale === "en" ? "Play the Portfolio" : "进入演奏作品集"}</span>
          <i aria-hidden>▶</i>
        </Link>
      </section>

      <section className="proof-strip" aria-label={profile.proofLabel}>
        <div><strong>6</strong><span>{locale === "en" ? "featured projects" : "个重点项目"}</span></div>
        <div><strong>2</strong><span>{locale === "en" ? "playable game worlds" : "组可玩游戏世界"}</span></div>
        <div><strong>10</strong><span>{locale === "en" ? "collaborating agents" : "个 Agent 协作"}</span></div>
        <div><strong>CN / EN</strong><span>{locale === "en" ? "bilingual communication" : "双语沟通"}</span></div>
      </section>

      <section className="capability-section" aria-labelledby="capability-heading">
        <div className="section-heading capability-heading">
          <div>
            <p className="section-index">00 / {profile.capabilityLabel}</p>
            <h2 id="capability-heading">{profile.capabilityLabel}</h2>
          </div>
          <p>{profile.capabilityIntro}</p>
        </div>
        <div className="capability-grid">
          {profile.capabilities.map((group, index) => (
            <article key={group.title} className="capability-card">
              <span>0{index + 1}</span>
              <h3>{group.title}</h3>
              <p>{group.skills.join(" / ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-section explore-work" id="work" aria-labelledby="projects-heading">
        <div className="section-heading">
          <div>
            <p className="section-index">01 / {content.explore.projects}</p>
            <h2 id="projects-heading">{content.explore.title}</h2>
          </div>
          <p>{content.explore.subtitle}</p>
        </div>

        <div className="project-list">
          {projectList.map((project, index) => (
            <article
              key={project.id}
              className={`project-article ${project.featured ? "project-featured" : ""}`}
              id={project.id}
            >
              <div className="project-overview">
                <div className={`project-media ${project.id === "auto-tune" ? "project-media-auto-tune" : ""}`}>
                  {project.id === "auto-tune" && project.screenshots.length >= 3 ? (
                    <div className="auto-tune-overview" aria-label={locale === "en" ? "Auto Tune feature overview" : "Auto Tune 功能总览"}>
                      <div className="auto-tune-overview-images">
                        {project.screenshots.slice(0, 3).map((screenshot, screenshotIndex) => (
                          <figure key={screenshot} className={`auto-tune-overview-shot shot-${screenshotIndex + 1}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={screenshot}
                              alt={`${project.title} ${locale === "en" ? "feature view" : "功能画面"} ${screenshotIndex + 1}`}
                              width={1600}
                              height={900}
                            />
                          </figure>
                        ))}
                      </div>
                      <div className="auto-tune-overview-caption">
                        <strong>{locale === "en" ? "One panel, three platform adapters" : "一个控制面板，三套平台适配"}</strong>
                        <span>{locale === "en" ? "Draft and post on X, Facebook and Instagram; delayed auto-reply is limited to X." : "支持 X、Facebook 与 Instagram 草稿发布；延迟自动回复仅限 X。"}</span>
                      </div>
                    </div>
                  ) : project.screenshots[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.screenshots[0]}
                      alt={`${project.title} interface or system view`}
                      width={1600}
                      height={900}
                    />
                  ) : (
                    <div className="project-media-placeholder">{project.title}</div>
                  )}
                  <span className="project-number">{String(index + 1).padStart(2, "0")}</span>
                </div>

                <div className="project-copy">
                <div className="project-meta">
                  <span>{project.category}</span>
                  <span>{project.period}</span>
                  <span>{project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="archive-oneliner">{project.oneLiner}</p>
                <p className="project-context">{project.context}</p>

                {project.metrics?.length ? (
                  <div className="project-metrics" aria-label={`${project.title} evidence`}>
                    {project.metrics.map((metric) => (
                      <div key={`${metric.value}-${metric.label}`}>
                        <strong>{metric.value}</strong>
                        <span>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="project-brief">
                  <div>
                    <span>{content.archive.problem}</span>
                    <p>{project.problem}</p>
                  </div>
                  <div>
                    <span>{content.archive.role}</span>
                    <p>{project.role}</p>
                  </div>
                  <div>
                    <span>{content.archive.outcome}</span>
                    <p>{project.outcome}</p>
                  </div>
                </div>

                <details className="project-details">
                  <summary>{locale === "en" ? "Process, Decisions & Technology" : "过程、决策与技术"}</summary>
                  <div className="project-details-grid">
                    <div>
                      <h4>{content.archive.process}</h4>
                      <ol>{project.process.map((item) => <li key={item}>{item}</li>)}</ol>
                    </div>
                    <div>
                      <h4>{content.archive.decisions}</h4>
                      <ul>{project.keyDecisions.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  </div>
                  <p className="project-tech">{project.technology.join(" · ")}</p>
                </details>

                <div className="project-links">
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noreferrer">
                      {locale === "en" ? "View Live Project ↗" : "查看线上成品 ↗"}
                    </a>
                  )}
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                </div>
                </div>
              </div>

              <ProjectCaseStudy
                projectId={project.id}
                projectTitle={project.title}
                locale={locale}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="explore-section experience-section" id="experience" aria-labelledby="experience-heading">
        <div className="section-heading">
          <div>
            <p className="section-index">02 / {profile.experienceLabel}</p>
            <h2 id="experience-heading">{profile.experienceLabel}</h2>
          </div>
          <p>{profile.experienceIntro}</p>
        </div>
        <div className="experience-list">
          {profile.experiences.map((item) => (
            <article key={`${item.organization}-${item.role}`} className="experience-card">
              <div className="experience-meta">
                <span>{item.period}</span>
                <span>{item.location}</span>
              </div>
              <h3>{item.organization}</h3>
              <p className="experience-role">{item.role}</p>
              <p>{item.summary}</p>
              <ul>{item.evidence.map((evidence) => <li key={evidence}>{evidence}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="experience-timeline" aria-label={profile.timelineLabel}>
          <p className="section-index">{profile.timelineLabel}</p>
          {profile.timeline.map((item) => (
            <article key={`${item.period}-${item.title}`}>
              <time>{item.period}</time>
              <div><strong>{item.title}</strong><p>{item.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-heading">
        <p className="section-index">03 / {content.explore.contact}</p>
        <h2 id="contact-heading">
          {locale === "en" ? "Turn a complex idea into a clear, usable product." : "让一个复杂想法，变成清晰可用的作品。"}
        </h2>
        <p>{profile.availability}</p>
        <div className="contact-links">
          <Link className="btn-primary" href="/play" onClick={() => setMode("entry")}>
            {locale === "en" ? "Play the Portfolio" : "演奏作品集"}
          </Link>
          <a className="btn-primary" href={`mailto:${publicLinks.email}`}>{publicLinks.email}</a>
          <a className="btn-secondary" href={publicLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <button type="button" className="btn-secondary" onClick={() => setShowWechat(true)}>
            {locale === "en" ? "WeChat / 微信" : "微信联系"}
          </button>
        </div>
      </section>

      {showWechat && (
        <div className="wechat-backdrop" role="presentation" onMouseDown={() => setShowWechat(false)}>
          <section
            className="wechat-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wechat-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="wechat-close"
              aria-label={locale === "en" ? "Close WeChat Contact" : "关闭微信联系方式"}
              onClick={() => setShowWechat(false)}
            >
              ×
            </button>
            <p className="section-index">WeChat / 微信</p>
            <h2 id="wechat-title">{locale === "en" ? "We can also continue the conversation on WeChat." : "也可以在微信继续聊。"}</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/contact/wechat-qr.jpg" alt={locale === "en" ? "Huaxin Zhang’s WeChat QR Code" : "张铧心微信二维码"} width={800} height={1067} />
            <div className="wechat-id">
              <span>{locale === "en" ? "WeChat ID" : "微信号"}</span>
              <strong>yuelaiyuehao86768</strong>
            </div>
            <p>{locale === "en" ? "Scan the QR code or search the WeChat ID above to add me." : "扫描二维码，或搜索上方微信号添加好友。"}</p>
          </section>
        </div>
      )}
    </main>
  );
}
