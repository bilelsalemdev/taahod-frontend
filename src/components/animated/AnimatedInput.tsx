import React, { useState } from 'react';
import type { FocusEvent } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { CheckCircleFilled } from '@ant-design/icons';
import type { InputRef } from 'antd';

interface AnimatedInputProps extends InputProps {
  error?: boolean;
  success?: boolean;
  errorMessage?: string;
}

/**
 * Input component with focus animations, validation states, and effects
 * 
 * @example
 * <AnimatedInput 
 *   placeholder="Email" 
 *   error={hasError}
 *   errorMessage="Invalid email"
 * />
 */
export const AnimatedInput = React.forwardRef<InputRef, AnimatedInputProps>(
  ({ error, success, errorMessage, onFocus, onBlur, ...props }, ref) => {
    const { shouldAnimate, getDuration } = useAnimation();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <motion.div
          animate={
            shouldAnimate && isFocused
              ? {
                  scale: 1.01,
                }
              : {
                  scale: 1,
                }
          }
          transition={{
            duration: getDuration(300) / 1000,
          }}
        >
          <Input
            {...props}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            status={error ? 'error' : undefined}
            style={{
              transition: `all ${getDuration(300)}ms var(--ease-smooth)`,
              borderColor: isFocused
                ? 'var(--color-primary)'
                : error
                ? 'var(--color-error)'
                : undefined,
              boxShadow: isFocused
                ? '0 0 0 3px rgba(4, 120, 87, 0.1)'
                : undefined,
              ...props.style,
            }}
            suffix={
              success ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <CheckCircleFilled style={{ color: 'var(--color-success)' }} />
                </motion.div>
              ) : (
                props.suffix
              )
            }
          />
        </motion.div>

        {/* Error message with shake animation */}
        <AnimatePresence>
          {error && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: 1,
                y: 0,
                x: shouldAnimate ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                opacity: { duration: 0.2 },
                y: { duration: 0.2 },
                x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
              }}
              style={{
                color: 'var(--color-error)',
                fontSize: '12px',
                marginTop: '4px',
              }}
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';

/**
 * Password input with animations
 */
export const AnimatedPasswordInput = React.forwardRef<InputRef, AnimatedInputProps>(
  (props, ref) => {
    const { shouldAnimate, getDuration } = useAnimation();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <motion.div
        animate={
          shouldAnimate && isFocused
            ? {
                scale: 1.01,
              }
            : {
                scale: 1,
              }
        }
        transition={{
          duration: getDuration(300) / 1000,
        }}
      >
        <Input.Password
          {...props}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          status={props.error ? 'error' : undefined}
          style={{
            transition: `all ${getDuration(300)}ms var(--ease-smooth)`,
            borderColor: isFocused
              ? 'var(--color-primary)'
              : props.error
              ? 'var(--color-error)'
              : undefined,
            boxShadow: isFocused
              ? '0 0 0 3px rgba(4, 120, 87, 0.1)'
              : undefined,
            ...props.style,
          }}
        />
      </motion.div>
    );
  }
);

AnimatedPasswordInput.displayName = 'AnimatedPasswordInput';
