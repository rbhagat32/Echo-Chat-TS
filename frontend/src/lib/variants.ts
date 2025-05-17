import { Variants } from "motion/react";

interface CustomProps {
  isMyMessage: boolean;
}

export const messageVariants: Variants = {
  initial: ({ isMyMessage }: CustomProps) => ({
    opacity: 0,
    x: isMyMessage ? 50 : -50,
    scale: 0.95,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 150,
    },
  },
  exit: ({ isMyMessage }: CustomProps) => ({
    opacity: 0,
    x: isMyMessage ? 50 : -50,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  }),
};
