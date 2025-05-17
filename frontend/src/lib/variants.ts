import { Variants } from "motion/react";

interface MessageVariantProps {
  isMyMessage: boolean;
}

const messageVariants: Variants = {
  initial: ({ isMyMessage }: MessageVariantProps) => ({
    opacity: 0,
    x: isMyMessage ? 50 : -50,
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 2500,
      duration: 0.025,
    },
  },
  exit: ({ isMyMessage }: MessageVariantProps) => ({
    opacity: 0,
    x: isMyMessage ? 50 : -50,
    transition: {
      duration: 0.15,
    },
  }),
};

export { messageVariants };
