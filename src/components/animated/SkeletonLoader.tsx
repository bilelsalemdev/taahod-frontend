import React from 'react';
import { motion } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'image' | 'circle';
  width?: string | number;
  height?: string | number;
  count?: number;
}

/**
 * Skeleton loader with shimmer effect
 * 
 * @example
 * <SkeletonLoader variant="text" count={3} />
 * <SkeletonLoader variant="card" />
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height,
  count = 1,
}) => {
  const { shouldAnimate } = useAnimation();

  const getHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'text':
        return 16;
      case 'card':
        return 200;
      case 'image':
        return 150;
      case 'circle':
        return 40;
      default:
        return 16;
    }
  };

  const getBorderRadius = () => {
    switch (variant) {
      case 'circle':
        return '50%';
      case 'card':
      case 'image':
        return '8px';
      default:
        return '4px';
    }
  };

  const shimmerAnimation = shouldAnimate
    ? {
        backgroundPosition: ['200% 0', '-200% 0'],
      }
    : {};

  const Skeleton = () => (
    <motion.div
      animate={shimmerAnimation}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        width,
        height: getHeight(),
        borderRadius: getBorderRadius(),
        background: shouldAnimate
          ? 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
          : '#f0f0f0',
        backgroundSize: '200% 100%',
        marginBottom: variant === 'text' ? '8px' : '0',
      }}
    />
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} />
      ))}
    </>
  );
};
