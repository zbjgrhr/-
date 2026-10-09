import { Fragment } from "react";
import {
  getProjectCaseStudy,
  type ProjectCaseStudyVisual,
} from "@/data/projectCaseStudies";
import type { Locale, ProjectId } from "@/types";

interface ProjectCaseStudyProps {
  projectId: ProjectId;
  projectTitle: string;
  locale: Locale;
}

function CaseStudyVisual({ visual }: { visual: ProjectCaseStudyVisual }) {
  if (visual.kind === "image") {
    if (visual.frame) {
      return (
        <div className={`case-study-visual preservative-frame preservative-frame--${visual.frame.variant}`}>
          <div className="preservative-frame-toolbar">
            <span className="preservative-frame-status" aria-hidden><i /><i /><i /></span>
            <span>{visual.frame.eyebrow}</span>
            <b>IA / ARCHIVE</b>
          </div>
          <div className="preservative-frame-stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visual.src}
              alt={visual.alt}
              width={1600}
              height={900}
              data-fit={visual.fit ?? "cover"}
            />
            <span className="preservative-frame-scan" aria-hidden />
          </div>
          <div className="preservative-frame-caption">
            <strong>{visual.frame.title}</strong>
            <div>
              {visual.frame.meta.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="case-study-visual case-study-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={visual.src}
          alt={visual.alt}
          width={1600}
          height={900}
          data-fit={visual.fit ?? "contain"}
        />
      </div>
    );
  }

  if (visual.kind === "gallery") {
    return (
      <div className="case-study-visual case-study-gallery">
        {visual.images.map((item) => (
          <div className="case-study-gallery-item" key={item.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              width={1200}
              height={1600}
              data-fit={item.fit ?? "contain"}
            />
          </div>
        ))}
      </div>
    );
  }

  if (visual.kind === "asset-board") {
    return (
      <div className="case-study-visual preservative-asset-board">
        <header className="preservative-asset-board__header">
          <span>{visual.eyebrow}</span>
          <strong>{visual.title}</strong>
        </header>
        <div className="preservative-asset-board__grid">
          <div className="preservative-asset-board__hero">
            <span className="preservative-asset-board__label">{visual.hero.label}</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={visual.hero.src} alt={visual.hero.alt} width={1200} height={1200} />
          </div>
          <div className="preservative-asset-board__stack">
            {visual.assets.map((asset, index) => (
              <div className="preservative-asset-board__asset" key={asset.src}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{asset.label}</strong>
                  <small>{asset.caption}</small>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.src} alt={asset.alt} width={620} height={620} />
              </div>
            ))}
          </div>
        </div>
        <p>{visual.note}</p>
      </div>
    );
  }

  if (visual.kind === "report") {
    return (
      <div className="case-study-visual preservative-report-viewer">
        <header className="preservative-report-viewer__header">
          <div>
            <span>{visual.eyebrow}</span>
            <strong>{visual.title}</strong>
            <p>{visual.note}</p>
          </div>
          <nav aria-label={visual.title}>
            <a href={visual.pdfSrc} target="_blank" rel="noreferrer">
              {visual.pdfLabel}
            </a>
            <a href={visual.pptxSrc} download>
              {visual.pptxLabel}
            </a>
          </nav>
        </header>
        <div className="preservative-report-viewer__document">
          <iframe
            src={`${visual.pdfSrc}#view=FitH&toolbar=1&navpanes=0`}
            title={visual.iframeTitle}
            loading="lazy"
          />
          <p>
            <a href={visual.pdfSrc} target="_blank" rel="noreferrer">
              {visual.pdfLabel}
            </a>
          </p>
        </div>
      </div>
    );
  }

  if (visual.kind === "flow") {
    return (
      <div className="case-study-visual case-study-system-visual">
        <span className="case-study-visual-label">{visual.eyebrow}</span>
        <div className="case-study-flow" aria-label={visual.nodes.join(" to ")}>
          {visual.nodes.map((node, index) => (
            <Fragment key={`${node}-${index}`}>
              <span className="case-study-flow-node">{node}</span>
              {index < visual.nodes.length - 1 ? (
                <span className="case-study-flow-arrow" aria-hidden>→</span>
              ) : null}
            </Fragment>
          ))}
        </div>
        {visual.note ? <p className="case-study-visual-note">{visual.note}</p> : null}
      </div>
    );
  }

  return (
    <div className="case-study-visual case-study-system-visual case-study-code-visual">
      <span className="case-study-visual-label">{visual.eyebrow}</span>
      <pre><code>{visual.lines.join("\n")}</code></pre>
      {visual.note ? <p className="case-study-visual-note">{visual.note}</p> : null}
    </div>
  );
}

export function ProjectCaseStudy({
  projectId,
  projectTitle,
  locale,
}: ProjectCaseStudyProps) {
  const sections = getProjectCaseStudy(projectId, locale);

  return (
    <section
      className={`project-case-study project-case-study--${projectId}`}
      aria-label={locale === "en" ? `${projectTitle} case study` : `${projectTitle} 项目案例`}
    >
      {sections.map((section) => (
        <figure
          key={section.step}
          className={`project-case-study-card${section.layout === "wide" ? " project-case-study-card--wide" : ""}${section.presentation === "framed" ? " project-case-study-card--framed" : ""}`}
        >
          <CaseStudyVisual visual={section.visual} />
          {section.presentation !== "framed" ? (
            <figcaption>
              <span>{section.step}</span>
              <div>
                <strong>{section.title}</strong>
                <p>{section.body}</p>
              </div>
            </figcaption>
          ) : null}
        </figure>
      ))}
    </section>
  );
}
