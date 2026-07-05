"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "motion/react";
import { EASE } from "../lib/motion";

/**
 * Animates a number from 0 to `target` when scrolled into view.
 */
export default function Counter({
  target,
  decimals = 1,
  duration = 1.1,
  style,
  className,
}) {
  const numeric = typeof target === "number" ? target : parseFloat(target);
  const isNumber = Number.isFinite(numeric);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const prefersReduced = useReducedMotion();
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => {
    if (!isNumber) return target;
    return decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
  });

  useEffect(() => {
    if (!isNumber) return;
    if (prefersReduced) {
      mv.set(numeric);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, numeric, { duration: duration / 1000, ease: EASE });
    return () => controls.stop();
  }, [inView, numeric, isNumber, duration, prefersReduced, mv]);

  if (!isNumber) {
    return (
      <span ref={ref} className={className} style={style}>
        {target}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className} style={style}>
      {display}
    </motion.span>
  );
}
