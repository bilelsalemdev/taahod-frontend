import { useAnimationContext } from '../contexts/AnimationContext';
import { ACCESSIBILITY_CONFIG } from '../config/animations';

export interface UseAnimationReturn {
  config: {
    reducedMotion: boolean;
    performanceMode: 'high' | 'medium' | 'low';
    enableParallax: boolean;
    enableComplexAnimations: boolean;
  };
  shouldAnimate: boolean;
  getDuration: (baseDuration: number) => number;
  getDelay: (baseDelay: number) => number;
  prefersReducedMotion: boolean;
}

/**
 * Custom hook for accessing animation utilities and configuration
 * 
 * @example
 * const { shouldAnimate, getDuration } = useAnimation();
 * const duration = getDuration(300); // Returns 0.01 if reduced motion is enabled
 */
export const useAnimation = (): UseAnimationReturn => {
  const { config } = useAnimationContext();

  const shouldAnimate = !config.reducedMotion;
  const prefersReducedMotion = config.reducedMotion;

  /**
   * Get adjusted duration based on reduced motion preference
   */
  const getDuration = (baseDuration: number): number => {
    if (config.reducedMotion) {
      return ACCESSIBILITY_CONFIG.reducedMotionDuration;
    }
    
    // Adjust duration based on performance mode
    if (config.performanceMode === 'low') {
      return baseDuration * 0.7; // 30% faster on low-end devices
    }
    
    return baseDuration;
  };

  /**
   * Get adjusted delay based on reduced motion preference
   */
  const getDelay = (baseDelay: number): number => {
    if (config.reducedMotion) {
      return 0; // No delays when reduced motion is enabled
    }
    
    // Reduce delays on low-end devices
    if (config.performanceMode === 'low') {
      return baseDelay * 0.5;
    }
    
    return baseDelay;
  };

  return {
    config,
    shouldAnimate,
    getDuration,
    getDelay,
    prefersReducedMotion,
  };
};
