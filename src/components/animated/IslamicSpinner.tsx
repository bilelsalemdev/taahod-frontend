import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';

interface IslamicSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 64,
};

const speedMap = {
  slow: 2,
  normal: 1.5,
  fast: 1,
};

/**
 * Islamic geometric spinner with rotating layers
 * 
 * @example
 * <IslamicSpinner size="large" color="var(--color-primary)" />
 */
export const IslamicSpinner: React.FC<IslamicSpinnerProps> = ({
  size = 'medium',
  color = 'var(--color-primary)',
  speed = 'normal',
}) => {
  const { shouldAnimate } = useAnimation();
  const dimension = sizeMap[size];
  const duration = speedMap[speed];

  if (!shouldAnimate) {
    return (
      <div
        style={{
          width: dimension,
          height: dimension,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: dimension * 0.8,
            height: dimension * 0.8,
            border: `3px solid ${color}`,
            borderRadius: '50%',
            opacity: 0.3,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Outer rotating square */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          border: `2px solid ${color}`,
          borderRadius: '4px',
          opacity: 0.6,
        }}
      />

      {/* Middle rotating circle */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: duration * 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: '15%',
          border: `2px solid var(--color-accent-gold)`,
          borderRadius: '50%',
          opacity: 0.8,
        }}
      />

      {/* Inner rotating diamond */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          inset: '30%',
          border: `2px solid ${color}`,
          borderRadius: '2px',
          transform: 'rotate(45deg)',
          opacity: 1,
        }}
      />

      {/* Center dot */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '20%',
          height: '20%',
          background: 'var(--color-accent-gold)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
