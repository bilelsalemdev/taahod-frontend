import { motion } from 'framer-motion';
import { IslamicSpinner } from './animated/IslamicSpinner';
import { useAnimation } from '../hooks/useAnimation';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  tip,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const { shouldAnimate, getDuration } = useAnimation();

  const spinnerSize = size === 'large' ? 'large' : size === 'small' ? 'small' : 'medium';

  const spinner = (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: getDuration(400) / 1000,
        }}
      >
        <IslamicSpinner size={spinnerSize} />
      </motion.div>
      {tip && (
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: getDuration(400) / 1000,
            delay: 0.2,
          }}
          style={{
            marginTop: '16px',
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
          }}
        >
          {tip}
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={shouldAnimate ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{
          duration: getDuration(300) / 1000,
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {spinner}
      </motion.div>
    );
  }

  return <div style={{ padding: '50px' }}>{spinner}</div>;
}
