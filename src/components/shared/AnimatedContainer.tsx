import React from "react";
import * as Motion from "motion/react-client";
import { cn } from "@/lib/utils";

type AnimationProps = {
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
};

const getAnimationProperties = (
  direction: string,
  distance: number,
): [AnimationProps, AnimationProps] => {
  let initial: AnimationProps = {};
  let animate: AnimationProps = {};

  // New variables for scale-related initial values
  const scaleFactorIn = 1 - distance / 100; // e.g., if distance=20, scaleFactorIn=0.8
  const scaleFactorOut = 1 + distance / 100; // e.g., if distance=20, scaleFactorOut=1.2

  switch (direction) {
    case "left":
      initial = { x: -distance, opacity: 0 };
      animate = { x: 0, opacity: 1 };
      break;
    case "right":
      initial = { x: distance, opacity: 0 };
      animate = { x: 0, opacity: 1 };
      break;
    case "up":
      initial = { y: distance, opacity: 0 };
      animate = { y: 0, opacity: 1 };
      break;
    case "down":
      initial = { y: -distance, opacity: 0 };
      animate = { y: 0, opacity: 1 };
      break;
    case "scale-in": // Fade in while scaling up from a smaller size
      initial = { scale: scaleFactorIn, opacity: 0 };
      animate = { scale: 1, opacity: 1 };
      break;
    case "scale-out": // Fade in while scaling down from a larger size
      initial = { scale: scaleFactorOut, opacity: 0 };
      animate = { scale: 1, opacity: 1 };
      break;
    case "none":
    default:
      initial = { opacity: 0 };
      animate = { opacity: 1 };
      break;
  }

  return [initial, animate];
};

const AnimatedContainer = ({
  children,
  className,
  direction = "up",
  distance = 50, // This is now used for both translation (px) and scale (percentage)
  delay = 0,
  duration = 0.7,
  once = true,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  direction?: string;
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}) => {
  // Note: The 'distance' prop is now repurposed for scale factors in 'scale-in/out'
  // For 'scale-in/out', a distance of 20 means a scale of 0.8 or 1.2
  const [initial, animate] = getAnimationProperties(direction, distance);

  const transition = {
    duration,
    delay,
    ease: "easeOut" as const,
  };

  return (
    <Motion.div
      className={cn("w-full", className)}
      initial={initial}
      // animate={animate} // Commented out, as you are using whileInView
      transition={transition}
      whileInView={animate}
      viewport={{ once: once }} // Using the 'once' prop here
      {...rest}
    >
      {children}
    </Motion.div>
  );
};

export default AnimatedContainer;
