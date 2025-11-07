import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { IslamicPattern } from '../patterns/IslamicPattern';

interface AnimatedBackgroundProps {
  patternType?: 'arabesque' | 'geometric' | 'star';
  patternColor?: string;
  patternOpacity?: number;
  enableParallax?: boolean;
  enableRotation?: boolean;
  gradient?: string;
  className?: string;
}

/**
 * Animated background with Islamic patterns, parallax, and gradient effects
 * 
 * @example
 * <AnimatedBackground 
 *   patternType="geometric" 
 *   enableParallax 
 *   enableRotation 
 * />
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  patternType = 'geometric',
  patternColor = '#d97706',
  patternOpacity = 0.1,
  enableParallax = true,
  enableRotation = true,
  gradient = 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
  className = '',
}) => {
  const { config, shouldAnimate } = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!shouldAnimate || !enableParallax || !config.enableParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldAnimate, enableParallax, config.enableParallax]);

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        background: gradient,
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient overlay */}
      {shouldAnimate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(45deg, rgba(4, 120, 87, 0.1) 0%, rgba(6, 95, 70, 0.1) 100%)',
          }}
        />
      )}

      {/* Islamic Pattern with parallax and rotation */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          x: enableParallax && config.enableParallax ? mousePosition.x : 0,
          y: enableParallax && config.enableParallax ? mousePosition.y : 0,
        }}
        animate={
          shouldAnimate && enableRotation
            ? {
                rotate: [0, 360],
              }
            : {}
        }
        transition={{
          rotate: {
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        <IslamicPattern
          type={patternType}
          opacity={patternOpacity}
          color={patternColor}
        />
      </motion.div>

      {/* Floating particles effect */}
      {shouldAnimate && config.enableComplexAnimations && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: patternColor,
                opacity: 0.3,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
