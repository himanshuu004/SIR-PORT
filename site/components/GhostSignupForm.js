"use client";
import { useEffect, useRef } from "react";

/**
 * Minimal Ghost signup-form embed — just a styled email input + button,
 * no title/description card. Used inside our own branded section so we
 * avoid duplicating headings and clashing themes.
 */
export default function GhostSignupForm() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (el.querySelector("iframe") || el.dataset.mounted === "1") return;
    el.dataset.mounted = "1";

    const script = document.createElement("script");
    script.async = true;
    script.src =
      "https://cdn.jsdelivr.net/ghost/signup-form@~0.2/umd/signup-form.min.js";
    script.setAttribute("data-button-color", "#14B8A6");
    script.setAttribute("data-button-text-color", "#FFFFFF");
    script.setAttribute("data-site", "https://cms.basavapurushottam.com/");
    script.setAttribute("data-locale", "en");
    el.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: 58, maxWidth: 440, width: "100%" }}
    />
  );
}
