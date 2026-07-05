"use client";
import { motion, useReducedMotion } from "motion/react";
import { pageEnter, DURATION, scrollTransition } from "../lib/motion";

/**
 * Soft page-enter animation. Used by app/template.js on route changes.
 */
export default function PageTransition({ children }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return children;

  return (
    <motion.div
      initial={pageEnter.initial}
      animate={pageEnter.animate}
      transition={scrollTransition(0, DURATION)}
    >
      {children}
    </motion.div>
  );
}
