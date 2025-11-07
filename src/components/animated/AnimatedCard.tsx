import React from 'react';
import type { ReactNode } from 'react';
import { Card } from 'antd';
import type { CardProps } from 'antd';
import { motion } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { CornerOrnament } from '../patterns/CornerOrnament';

interface AnimatedCardProps extends CardProps {
  children: ReactNode;
  showOrnament?: boolean;
  animatedBorder?: boolean;
}

/**
 * Enhanced card component with lift effect and animations
 * 
 * @example
 * <AnimatedCard hoverable showOrnament>
 *   <p>Card content</p>
 * </AnimatedCard>
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  showOrnament = false,
  animatedBorder = false,
  hoverable = true,
  ...props
}) => {
  const { shouldAnimate, getDuration } = useAnimation();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      whileHover={
        shouldAnimate && hoverable
          ? {
              y: -4,
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            }
          : {}
      }
      transition={{
        duration: getDuration(300) / 1000,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ height: '100%' }}
    >
      <Card
        {...props}
        hoverable={false}
        style={{
          height: '100%',
          transition: `all ${getDuration(300)}ms var(--ease-smooth)`,
          position: 'relative',
          overflow: 'hidden',
          ...props.style,
        }}
      >
        {/* Animated border gradient */}
        {animatedBorder && isHovered && shouldAnimate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: -2,
              background:
                'linear-gradient(45deg, var(--color-accent-gold), var(--color-primary), var(--color-accent-gold))',
              borderRadius: '12px',
              zIndex: -1,
            }}
          />
        )}

        {/* Corner ornament */}
        {showOrnament && isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.3,
              type: 'spring',
            }}
          >
            <CornerOrnament
              position="top-right"
              color="var(--color-accent-gold)"
              size={20}
            />
          </motion.div>
        )}

        {children}
      </Card>
    </motion.div>
  );
};
