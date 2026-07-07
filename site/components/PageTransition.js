"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { pageEnter, DURATION, scrollTransition } from "../lib/motion";

/**
 * Soft page-enter animation. Used by app/template.js on route changes.
 * Opacity stays at 1 so back/forward navigation never leaves a blank page.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const controls = useAnimation();

  useEffect(() => {
    controls.start(pageEnter.animate);
  }, [pathname, controls]);

  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted) {
        controls.set(pageEnter.animate);
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [controls]);

  if (prefersReduced) return children;

  return (
    <motion.div
      key={pathname}
      initial={pageEnter.initial}
      animate={controls}
      transition={scrollTransition(0, DURATION)}
    >
      {children}
    </motion.div>
  );
}
