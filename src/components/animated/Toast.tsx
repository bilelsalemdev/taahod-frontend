import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { useAnimation } from '../../hooks/useAnimation';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  visible: boolean;
}

/**
 * Toast notification with slide-in animation
 * 
 * @example
 * <Toast 
 *   message="Success!" 
 *   type="success" 
 *   visible={isVisible}
 *   onClose={handleClose}
 * />
 */
export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  visible,
}) => {
  const { shouldAnimate, getDuration } = useAnimation();

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleFilled style={{ color: 'var(--color-success)' }} />;
      case 'error':
        return <CloseCircleFilled style={{ color: 'var(--color-error)' }} />;
      case 'info':
        return <InfoCircleFilled style={{ color: 'var(--color-info)' }} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#f6ffed';
      case 'error':
        return '#fff2f0';
      case 'info':
        return '#e6f7ff';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'var(--color-success)';
      case 'error':
        return 'var(--color-error)';
      case 'info':
        return 'var(--color-info)';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: -50, scale: 0.9 } : false}
          animate={
            type === 'error' && shouldAnimate
              ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  x: [0, -10, 10, -10, 10, 0],
                }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            duration: getDuration(300) / 1000,
            x: type === 'error' ? { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } : {},
          }}
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            minWidth: 300,
            maxWidth: 500,
            padding: '12px 16px',
            background: getBackgroundColor(),
            border: `1px solid ${getBorderColor()}`,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            {getIcon()}
          </motion.div>
          <div style={{ flex: 1, fontSize: '14px', color: 'var(--color-text-primary)' }}>
            {message}
          </div>
          {duration > 0 && (
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: getBorderColor(),
                borderRadius: '0 0 8px 8px',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
