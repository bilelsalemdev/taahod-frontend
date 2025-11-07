import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Card, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useAnimation } from '../../hooks/useAnimation';
import { CornerOrnament } from '../patterns/CornerOrnament';

interface AnimatedStatCardProps {
  title: string;
  value: number;
  prefix?: ReactNode;
  suffix?: string;
  borderColor?: string;
  valueColor?: string;
  style?: React.CSSProperties;
}

/**
 * Animated statistics card with number counter and hover effects
 * 
 * @example
 * <AnimatedStatCard 
 *   title="Total Books"
 *   value={42}
 *   prefix={<BookOutlined />}
 *   borderColor="var(--color-primary)"
 * />
 */
export const AnimatedStatCard: React.FC<AnimatedStatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  borderColor = 'var(--color-primary)',
  valueColor = 'var(--color-primary)',
  style = {},
}) => {
  const { shouldAnimate, getDuration } = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animated number counter
  const { number } = useSpring({
    from: { number: 0 },
    number: hasAnimated ? value : 0,
    delay: 200,
    config: { duration: getDuration(1500) },
  });

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      whileHover={
        shouldAnimate
          ? {
              y: -4,
            }
          : {}
      }
      transition={{
        duration: getDuration(300) / 1000,
      }}
    >
      <Card
        style={{
          borderRadius: '12px',
          border: `2px solid ${borderColor}`,
          position: 'relative',
          transition: `box-shadow ${getDuration(300)}ms var(--ease-smooth)`,
          ...style,
        }}
      >
        <CornerOrnament
          position="top-right"
          color="var(--color-accent-gold)"
          size={20}
        />

        <Statistic
          title={title}
          value={shouldAnimate ? undefined : value}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{
            color: valueColor,
            fontWeight: 'bold',
          }}
          formatter={() =>
            shouldAnimate ? (
              <animated.span>
                {number.to((n) => Math.floor(n).toLocaleString())}
              </animated.span>
            ) : (
              value.toLocaleString()
            )
          }
        />
      </Card>
    </motion.div>
  );
};
