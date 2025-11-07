import React from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAnimation } from '../../hooks/useAnimation';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page transition wrapper for smooth route changes
 * 
 * @example
 * <PageTransition>
 *   <Outlet />
 * </PageTransition>
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const { shouldAnimate, getDuration } = useAnimation();

  if (!shouldAnimate) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{
          duration: getDuration(300) / 1000,
          ease: 'easeInOut',
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
