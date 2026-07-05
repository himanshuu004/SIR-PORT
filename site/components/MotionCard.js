"use client";
import { motion, useReducedMotion } from "motion/react";
import { DURATION_FAST, EASE } from "../lib/motion";

function resolveMotionComponent(As) {
  if (typeof As === "string") return motion[As] || motion.div;
  return motion.create(As);
}

/**
 * Hover-lift wrapper for cards and clickable tiles.
 */
export default function MotionCard({
  children,
  className = "",
  style = {},
  as: As = "div",
  lift = -5,
  scale = 1.015,
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = resolveMotionComponent(As);

  if (prefersReduced) {
    const Tag = As;
    return (
      <Tag className={className} style={style} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        rest: { y: 0, scale: 1 },
        hover: { y: lift, scale },
        tap: { scale: 0.99 },
      }}
      transition={{ duration: DURATION_FAST, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
