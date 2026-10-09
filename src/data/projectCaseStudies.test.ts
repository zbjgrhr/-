import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  caseStudyProjectIds,
  projectCaseStudies,
} from "@/data/projectCaseStudies";

describe("project case studies", () => {
  it("provides ordered bilingual chapters for every project", () => {
    for (const projectId of caseStudyProjectIds) {
      for (const locale of ["en", "zh"] as const) {
        const sections = projectCaseStudies[projectId][locale];
        const expectedCount = {
          "pixel-world": 9,
          preservative: 5,
          "rainy-arcade": 9,
          iwbtz: 7,
          "auto-tune": 3,
          "study-assistant": 9,
        }[projectId];
        expect(sections).toHaveLength(expectedCount);
        expect(sections.map((section) => section.step)).toEqual(
          Array.from({ length: expectedCount }, (_, index) =>
            String(index + 1).padStart(2, "0"),
          ),
        );
        for (const section of sections) {
          expect(section.title.trim()).not.toBe("");
          expect(section.body.trim()).not.toBe("");
        }
      }
    }
  });

  it("keeps English and Chinese editorial copy distinct", () => {
    for (const projectId of caseStudyProjectIds) {
      const english = projectCaseStudies[projectId].en;
      const chinese = projectCaseStudies[projectId].zh;
      for (let index = 0; index < english.length; index += 1) {
        expect(chinese[index].title).not.toBe(english[index].title);
        expect(chinese[index].body).not.toBe(english[index].body);
      }
    }
  });

  it("references image assets that exist in the public directory", () => {
    for (const projectId of caseStudyProjectIds) {
      for (const locale of ["en", "zh"] as const) {
        for (const section of projectCaseStudies[projectId][locale]) {
          const images =
            section.visual.kind === "image"
              ? [section.visual]
              : section.visual.kind === "gallery"
                ? section.visual.images
                : section.visual.kind === "asset-board"
                  ? [section.visual.hero, ...section.visual.assets]
                : [];
          for (const image of images) {
            const relativePath = image.src.replace(/^\/+/, "");
            expect(
              existsSync(path.resolve(process.cwd(), "public", relativePath)),
              `${projectId}/${locale}/${section.step}: ${image.src}`,
            ).toBe(true);
            expect(image.alt.trim()).not.toBe("");
          }
        }
      }
    }
  });

  it("puts the approved Pixel World concept cover before the eight case-study graphics", () => {
    for (const locale of ["en", "zh"] as const) {
      const imagePaths = projectCaseStudies["pixel-world"][locale]
        .flatMap((section) =>
          section.visual.kind === "image"
            ? [section.visual.src]
            : section.visual.kind === "gallery"
              ? section.visual.images.map((image) => image.src)
              : [],
        );

      expect(imagePaths).toHaveLength(9);
      expect(imagePaths).toEqual([
        "/portfolio/pixel-world-concept-cover.png",
        ...Array.from({ length: 8 }, (_, index) =>
          `/portfolio/pixel-world-case-${String(index + 1).padStart(2, "0")}-${[
            "prompt-spec-agents",
            "model-routing",
            "agent-config",
            "asset-system",
            "cover-particles",
            "generated-world",
            "moonshadow-level",
            "playable-worlds",
          ][index]}.png`,
        ),
      ]);
    }
  });

  it("uses all nine approved Rainy Night Arcade graphics in narrative order", () => {
    const expected = [
      "/portfolio/rainy-arcade-concept-cover.png",
      "/portfolio/rainy-arcade-overview.png",
      "/portfolio/rainy-arcade-character-ensemble.png",
      "/portfolio/rainy-arcade-character-turnarounds.png",
      "/portfolio/rainy-arcade-interaction-flow.png",
      "/portfolio/rainy-arcade-block-city.png",
      "/portfolio/rainy-arcade-rain-city.png",
      "/portfolio/rainy-arcade-library-city.png",
      "/portfolio/rainy-arcade-playtest-telemetry.png",
    ];

    for (const locale of ["en", "zh"] as const) {
      const imagePaths = projectCaseStudies["rainy-arcade"][locale].map((section) => {
        expect(section.visual.kind).toBe("image");
        return section.visual.kind === "image" ? section.visual.src : "";
      });

      expect(imagePaths).toEqual(expected);
    }
  });

  it("uses the seven approved IWBTZ graphics in narrative order", () => {
    const expected = [
      "/portfolio/iwbtz-case-01-concept.png",
      "/portfolio/iwbtz-case-02-level-atlas.png",
      "/portfolio/iwbtz-case-03-multi-attack.gif",
      "/portfolio/iwbtz-case-04-core-loop.gif",
      "/portfolio/iwbtz-case-05-boss-pattern.gif",
      "/portfolio/iwbtz-case-06-memory-forest.png",
      "/portfolio/iwbtz-case-07-school-pressure.png",
    ];

    for (const locale of ["en", "zh"] as const) {
      const sections = projectCaseStudies.iwbtz[locale];
      expect(sections.map((section) => {
        expect(section.presentation).toBe("framed");
        expect(section.visual.kind).toBe("image");
        return section.visual.kind === "image" ? section.visual.src : "";
      })).toEqual(expected);
    }
  });

  it("uses the approved Preservative concept and three reviewed evidence boards in order", () => {
    const expected = [
      "/portfolio/preservative-01-concept-approved.png",
      "/portfolio/preservative-02-report-evidence.png",
      "/portfolio/preservative-03-visual-identity.png",
      "/portfolio/preservative-04-gameplay-evidence.png",
    ];

    for (const locale of ["en", "zh"] as const) {
      const sections = projectCaseStudies.preservative[locale];
      expect(sections[0].visual.kind).toBe("image");
      expect(sections.at(-1)?.visual.kind).toBe("report");
      const imagePaths = sections.slice(0, 4).map((section) => {
        expect(section.visual.kind).toBe("image");
        return section.visual.kind === "image" ? section.visual.src : "";
      });
      expect(imagePaths).toEqual(expected);
      if (sections[0].visual.kind === "image") expect(sections[0].visual.frame).toBeDefined();
    }
  });

  it("keeps the Preservative PDF and PowerPoint available from the report viewer", () => {
    for (const locale of ["en", "zh"] as const) {
      const visual = projectCaseStudies.preservative[locale].at(-1)?.visual;
      expect(visual?.kind).toBe("report");
      if (!visual || visual.kind !== "report") continue;

      for (const src of [visual.pdfSrc, visual.pptxSrc]) {
        expect(existsSync(path.resolve(process.cwd(), "public", src.replace(/^\/+/, "")))).toBe(true);
      }
    }
  });
});
