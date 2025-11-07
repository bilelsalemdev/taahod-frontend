/**
 * Animation Configuration
 * Central configuration for all animations in the application
 */

export const ANIMATION_DURATIONS = {
  // Micro-interactions (100-200ms)
  fast: 150,
  // Component transitions (200-400ms)
  normal: 300,
  // Page transitions (300-500ms)
  slow: 500,
  // Complex animations (500-1500ms)
  complex: 1000,
  // Background effects (10-60s)
  ambient: 60000,
} as const;

export const ANIMATION_EASINGS = {
  // User-initiated actions
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  // System-initiated actions
  easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  // Continuous animations
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  // Natural motion
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  // Smooth
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const ANIMATION_DELAYS = {
  none: 0,
  short: 100,
  medium: 200,
  long: 300,
  stagger: 80,
  staggerShort: 50,
} as const;

export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
} as const;

export const PERFORMANCE_CONFIG = {
  maxConcurrentAnimations: 10,
  fpsThreshold: 30,
  useGPUAcceleration: true,
  debounceDelay: 16, // ~60fps
} as const;

export const ACCESSIBILITY_CONFIG = {
  reducedMotionDuration: 0.01,
  respectReducedMotion: true,
  maintainFocusVisibility: true,
} as const;

export type AnimationDuration = keyof typeof ANIMATION_DURATIONS;
export type AnimationEasing = keyof typeof ANIMATION_EASINGS;
export type AnimationDelay = keyof typeof ANIMATION_DELAYS;
export type AnimationVariant = keyof typeof ANIMATION_VARIANTS;
