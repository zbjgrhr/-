"use client";

import { useUiStore } from "@/store/uiStore";

/** Skip link + live region for screen readers outside the canvas. */
export function A11yChrome() {
  const caption = useUiStore((s) => s.caption);
  const chapter = useUiStore((s) => s.chapter);
  const mode = useUiStore((s) => s.mode);
  const locale = useUiStore((s) => s.locale);

  return (
    <>
      <a href={mode === "play" ? "#game-hud" : "#main-content"} className="skip-link">
        {locale === "en" ? "Skip to main content" : "跳到主要内容"}
      </a>
      <div className="sr-only" aria-live="polite">
        {mode === "play"
          ? locale === "en"
            ? `Chapter: ${chapter}. ${caption ?? ""}`
            : `章节：${chapter}。${caption ?? ""}`
          : ""}
      </div>
    </>
  );
}
