import React from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { IslamicPattern } from '../patterns/IslamicPattern';
import { CornerOrnament } from '../patterns/CornerOrnament';

interface AnimatedWelcomeBannerProps {
  title: ReactNode;
  subtitle?: ReactNode;
  gradient?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animated welcome banner with slide-down animation and rotating background
 * 
 * @example
 * <AnimatedWelcomeBanner 
 *   title="Welcome, User!"
 *   subtitle="Your learning platform"
 * />
 */
export const AnimatedWelcomeBanner: React.FC<AnimatedWelcomeBannerProps> = ({
  title,
  subtitle,
  gradient = 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
  className = '',
  style = {},
}) => {
  const { shouldAnimate, getDuration } = useAnimation();

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: -50 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: getDuration(500) / 1000,
        ease: 'easeOut',
      }}
      className={className}
      style={{
        marginBottom: '32px',
        padding: '32px',
        background: gradient,
        borderRadius: '16px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Animated Islamic Pattern Background */}
      <motion.div
        animate={
          shouldAnimate
            ? {
                rotate: [0, 360],
              }
            : {}
        }
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        <IslamicPattern type="geometric" opacity={0.1} color="#d97706" />
      </motion.div>

      {/* Corner Ornaments */}
      <CornerOrnament position="all" color="rgba(217, 119, 6, 0.5)" size={40} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: getDuration(600) / 1000,
            delay: 0.2,
          }}
        >
          {title}
        </motion.div>

        {subtitle && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{
              duration: getDuration(600) / 1000,
              delay: 0.4,
            }}
          >
            {subtitle}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
