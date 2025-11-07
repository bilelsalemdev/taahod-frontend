import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';

interface ProgressBarProps {
  percent: number;
  showInfo?: boolean;
  color?: string;
  height?: number;
  indeterminate?: boolean;
}

/**
 * Animated progress bar with smooth fill
 * 
 * @example
 * <ProgressBar percent={75} showInfo />
 * <ProgressBar indeterminate />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  percent = 0,
  showInfo = false,
  color = 'var(--color-primary)',
  height = 8,
  indeterminate = false,
}) => {
  const { shouldAnimate, getDuration } = useAnimation();

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height,
          background: '#f0f0f0',
          borderRadius: height / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {indeterminate ? (
          <motion.div
            animate={
              shouldAnimate
                ? {
                    x: ['-100%', '200%'],
                  }
                : {}
            }
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: '50%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            }}
          />
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
            transition={{
              duration: getDuration(800) / 1000,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${color}, var(--color-primary-light))`,
              borderRadius: height / 2,
            }}
          />
        )}
      </div>
      {showInfo && !indeterminate && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            textAlign: 'right',
          }}
        >
          {Math.round(percent)}%
        </div>
      )}
    </div>
  );
};
