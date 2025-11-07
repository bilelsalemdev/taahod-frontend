import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export interface AnimationConfig {
  reducedMotion: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  enableParallax: boolean;
  enableComplexAnimations: boolean;
}

interface AnimationContextValue {
  config: AnimationConfig;
  updateConfig: (updates: Partial<AnimationConfig>) => void;
}

const AnimationContext = createContext<AnimationContextValue | undefined>(undefined);

interface AnimationProviderProps {
  children: ReactNode;
  config?: Partial<AnimationConfig>;
}

/**
 * Detects if user prefers reduced motion
 */
const detectReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

/**
 * Detects device performance capabilities
 */
const detectPerformanceMode = (): 'high' | 'medium' | 'low' => {
  if (typeof window === 'undefined') return 'high';
  
  // Check for performance API
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory < 4) return 'low';
    if (memory < 8) return 'medium';
  }
  
  // Check for hardware concurrency
  if ('hardwareConcurrency' in navigator) {
    const cores = navigator.hardwareConcurrency;
    if (cores < 4) return 'low';
    if (cores < 8) return 'medium';
  }
  
  return 'high';
};

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ 
  children, 
  config: initialConfig 
}) => {
  const [config, setConfig] = useState<AnimationConfig>(() => {
    const reducedMotion = detectReducedMotion();
    const performanceMode = detectPerformanceMode();
    
    return {
      reducedMotion,
      performanceMode,
      enableParallax: performanceMode !== 'low' && !reducedMotion,
      enableComplexAnimations: performanceMode === 'high' && !reducedMotion,
      ...initialConfig,
    };
  });

  useEffect(() => {
    // Listen for changes to reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setConfig(prev => ({
        ...prev,
        reducedMotion: e.matches,
        enableParallax: !e.matches && prev.performanceMode !== 'low',
        enableComplexAnimations: !e.matches && prev.performanceMode === 'high',
      }));
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const updateConfig = (updates: Partial<AnimationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  return (
    <AnimationContext.Provider value={{ config, updateConfig }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationContext = (): AnimationContextValue => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within AnimationProvider');
  }
  return context;
};
