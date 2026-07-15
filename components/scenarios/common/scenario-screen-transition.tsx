"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export type ScenarioTransitionDirection = "forward" | "backward" | "neutral";

export type ScenarioScreenTransitionProps = {
  readonly children: ReactNode;

  readonly direction?: ScenarioTransitionDirection;

  readonly className?: string;

  readonly testId?: string;
};

function getEntryOffset(direction: ScenarioTransitionDirection): number {
  switch (direction) {
    case "forward":
      return 28;

    case "backward":
      return -28;

    case "neutral":
      return 0;
  }
}

export function ScenarioScreenTransition({
  children,
  direction = "neutral",
  className = "",
  testId = "scenario-screen-transition",
}: ScenarioScreenTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  const useInstantTransition = prefersReducedMotion === true || process.env.NODE_ENV === "test";

  const entryOffset = getEntryOffset(direction);

  return (
    <motion.div
      data-testid={testId}
      data-transition-direction={direction}
      initial={
        useInstantTransition
          ? {
              opacity: 1,
            }
          : {
              opacity: 0,
              x: entryOffset,
              scale: 0.994,
            }
      }
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      exit={
        useInstantTransition
          ? {
              opacity: 1,
            }
          : {
              opacity: 0,
              scale: 0.996,
            }
      }
      transition={
        useInstantTransition
          ? {
              duration: 0,
            }
          : {
              duration: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }
      }
      className={["will-change-transform", className].join(" ")}
    >
      {children}
    </motion.div>
  );
}
