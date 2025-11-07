import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { ANIMATION_VARIANTS, ANIMATION_DURATIONS } from '../../config/animations';

export type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';

interface AnimatedContainerProps {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

const animationMap: Record<AnimationType, keyof typeof ANIMATION_VARIANTS> = {
  'fade': 'fadeIn',
  'slide-up': 'slideUp',
  'slide-down': 'slideDown',
  'slide-left': 'slideLeft',
  'slide-right': 'slideRight',
  'scale': 'scale',
};

/**
 * Wrapper component for fade-in and slide animations on mount
 * 
 * @example
 * <AnimatedContainer animation="slide-up" delay={200}>
 *   <div>Content</div>
 * </AnimatedContainer>
 */
export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade',
  delay = 0,
  duration = ANIMATION_DURATIONS.normal,
  className = '',
}) => {
  const { getDuration, getDelay, shouldAnimate } = useAnimation();

  const variantKey = animationMap[animation];
  const variant = ANIMATION_VARIANTS[variantKey];

  const transition: Transition = {
    duration: getDuration(duration) / 1000, // Convert to seconds
    delay: getDelay(delay) / 1000,
    ease: 'easeOut' as any,
  };

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};
