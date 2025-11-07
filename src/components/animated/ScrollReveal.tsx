import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { ANIMATION_VARIANTS, ANIMATION_DURATIONS } from '../../config/animations';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'scale';
  threshold?: number;
  className?: string;
}

/**
 * Component for scroll-triggered animations using Intersection Observer
 * 
 * @example
 * <ScrollReveal animation="slide-up" threshold={0.2}>
 *   <Section>Content</Section>
 * </ScrollReveal>
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade',
  threshold = 0.1,
  className = '',
}) => {
  const { getDuration, shouldAnimate } = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldAnimate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after animation triggers
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [shouldAnimate, threshold]);

  const animationMap: Record<string, keyof typeof ANIMATION_VARIANTS> = {
    'fade': 'fadeIn',
    'slide-up': 'slideUp',
    'scale': 'scale',
  };

  const variantKey = animationMap[animation];
  const variant = ANIMATION_VARIANTS[variantKey];

  const transition: Transition = {
    duration: getDuration(ANIMATION_DURATIONS.slow) / 1000,
    ease: 'easeOut' as any,
  };

  if (!shouldAnimate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={variant.initial}
      animate={isVisible ? variant.animate : variant.initial}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};
