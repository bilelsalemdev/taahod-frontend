import React, { useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import type { ButtonProps } from 'antd';
import { useAnimation } from '../../hooks/useAnimation';
import { LoadingOutlined } from '@ant-design/icons';

interface RippleButtonProps extends ButtonProps {
  children: ReactNode;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

/**
 * Button component with ripple effect and animations
 * 
 * @example
 * <RippleButton type="primary" onClick={handleClick}>
 *   Click Me
 * </RippleButton>
 */
export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  loading,
  ...props
}) => {
  const { shouldAnimate, getDuration } = useAnimation();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (shouldAnimate) {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple: Ripple = {
        x,
        y,
        id: Date.now(),
      };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.div
      style={{ position: 'relative', display: 'inline-block', width: '100%' }}
      whileHover={
        shouldAnimate
          ? {
              scale: 1.02,
              filter: 'brightness(1.1)',
            }
          : {}
      }
      whileTap={shouldAnimate ? { scale: 0.98 } : {}}
      transition={{
        duration: getDuration(200) / 1000,
      }}
    >
      <Button
        {...props}
        onClick={handleClick}
        loading={loading}
        icon={loading ? <LoadingOutlined spin /> : props.icon}
        style={{
          position: 'relative',
          overflow: 'hidden',
          transition: `all ${getDuration(300)}ms var(--ease-smooth)`,
          ...props.style,
        }}
      >
        {children}

        {/* Ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{
                scale: 0,
                opacity: 0.5,
              }}
              animate={{
                scale: 4,
                opacity: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: ripple.x,
                top: ripple.y,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.6)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            />
          ))}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};
