import React from 'react';
import type { ReactNode } from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';

interface AnimatedModalProps extends Omit<ModalProps, 'children'> {
  children: ReactNode;
}

/**
 * Animated modal with scale and fade transitions
 * 
 * @example
 * <AnimatedModal open={isOpen} onCancel={handleClose}>
 *   <p>Modal content</p>
 * </AnimatedModal>
 */
export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  children,
  open,
  ...props
}) => {
  const { shouldAnimate, getDuration } = useAnimation();

  return (
    <Modal
      {...props}
      open={open}
      transitionName=""
      maskTransitionName=""
      modalRender={(modal) => (
        <AnimatePresence>
          {open && (
            <>
              {/* Animated backdrop */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: getDuration(200) / 1000,
                }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.45)',
                  zIndex: 1000,
                }}
                onClick={props.onCancel as any}
              />

              {/* Animated modal content */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, scale: 0.9 } : false}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: getDuration(300) / 1000,
                  ease: 'easeOut',
                }}
                style={{
                  position: 'relative',
                  zIndex: 1001,
                }}
              >
                {modal}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    >
      {children}
    </Modal>
  );
};
