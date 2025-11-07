import React, { Children } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { ANIMATION_VARIANTS, ANIMATION_DURATIONS, ANIMATION_DELAYS } from '../../config/animations';

export type StaggerAnimation = 'fade' | 'slide-up' | 'scale';

interface StaggeredListProps {
  children: ReactNode;
  staggerDelay?: number;
  animation?: StaggerAnimation;
  className?: string;
}

const animationMap: Record<StaggerAnimation, keyof typeof ANIMATION_VARIANTS> = {
  'fade': 'fadeIn',
  'slide-up': 'slideUp',
  'scale': 'scale',
};

/**
 * Component for staggered animations of list items
 * 
 * @example
 * <StaggeredList staggerDelay={100} animation="slide-up">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 *   <Card>Item 3</Card>
 * </StaggeredList>
 */
export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = ANIMATION_DELAYS.stagger,
  animation = 'fade',
  className = '',
}) => {
  const { getDuration, getDelay, shouldAnimate } = useAnimation();

  const variantKey = animationMap[animation];
  const variant = ANIMATION_VARIANTS[variantKey];

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  const childArray = Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => {
        const transition: Transition = {
          duration: getDuration(ANIMATION_DURATIONS.normal) / 1000,
          delay: getDelay(index * staggerDelay) / 1000,
          ease: 'easeOut' as any,
        };

        return (
          <motion.div
            key={index}
            initial={variant.initial}
            animate={variant.animate}
            exit={variant.exit}
            transition={transition}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};
