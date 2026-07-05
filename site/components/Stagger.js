"use client";
import { motion, useReducedMotion } from "motion/react";
import {
  SCROLL_DURATION,
  EASE,
  staggerContainer,
  staggerItem,
  viewport,
} from "../lib/motion";

/**
 * Scroll-triggered stagger container. Wrap list/grid children in <StaggerItem>.
 */
export function Stagger({
  children,
  className = "",
  style = {},
  stagger = 0.14,
  delayChildren = 0.1,
  once = true,
  amount = viewport.amount,
  margin = viewport.margin,
  as: As = "div",
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[As] || motion.div;

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
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className = "",
  style = {},
  as: As = "div",
}) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[As] || motion.div;

  if (prefersReduced) {
    const Tag = As;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      style={style}
      variants={staggerItem}
      transition={{ duration: SCROLL_DURATION, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
