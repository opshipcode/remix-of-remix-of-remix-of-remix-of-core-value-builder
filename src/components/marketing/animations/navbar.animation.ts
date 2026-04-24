import { Variants } from "framer-motion";

/**
 * Root stagger container (used for both desktop + mobile)
 */
export const container: Variants = {
  open: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

/**
 * Clean, mature motion (no bounce, just smooth settle)
 */
export const item: Variants = {
  open: {
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.8, 0.25, 1], // smooth professional easing
    },
  },
  closed: (i: number) => ({
    y: 10,
    x: 20,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.25,
    },
  }),
};

/**
 * Slight fade + slide for navbar shell
 */
export const navShell: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  closed: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};