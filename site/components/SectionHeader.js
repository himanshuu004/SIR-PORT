"use client";
import { motion, useReducedMotion } from "motion/react";
import s from "./SectionHeader.module.css";
import { SCROLL_DURATION, EASE, viewport, scrollTransition } from "../lib/motion";

export default function SectionHeader({ eyebrow, heading, align = "left", light = false, accent = true }) {
  const prefersReduced = useReducedMotion();

  const wrapProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: viewport.amount, margin: viewport.margin },
        transition: scrollTransition(0, SCROLL_DURATION),
      };

  const accentProps = prefersReduced
    ? {}
    : {
        initial: { scaleX: 0, opacity: 0 },
        whileInView: { scaleX: 1, opacity: 1 },
        viewport: { once: true, amount: 0.2, margin: viewport.margin },
        transition: { duration: 0.75, delay: 0.2, ease: EASE },
      };

  return (
    <motion.div
      className={`${s.wrap} ${align === "center" ? s.center : ""}`}
      {...wrapProps}
    >
      {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
      <h2 className={`${s.heading} ${light ? s.light : ""}`}>{heading}</h2>
      {accent && (
        <motion.span
          className={s.accent}
          aria-hidden="true"
          style={{ transformOrigin: align === "center" ? "center" : "left" }}
          {...accentProps}
        />
      )}
    </motion.div>
  );
}
