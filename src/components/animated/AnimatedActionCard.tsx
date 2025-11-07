import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../hooks/useAnimation';
import { CornerOrnament } from '../patterns/CornerOrnament';

const { Title, Paragraph } = Typography;

interface AnimatedActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Animated action card with lift effect and animated border
 * 
 * @example
 * <AnimatedActionCard 
 *   title="Subjects"
 *   description="Browse Islamic books"
 *   icon={<BookOutlined />}
 *   onClick={() => navigate('/subjects')}
 * />
 */
export const AnimatedActionCard: React.FC<AnimatedActionCardProps> = ({
  title,
  description,
  icon,
  onClick,
  style = {},
}) => {
  const { shouldAnimate, getDuration } = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={
        shouldAnimate
          ? {
            y: -4,
          }
          : {}
      }
      transition={{
        duration: getDuration(300) / 1000,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        onClick={onClick}
        style={{
          height: '100%',
          minHeight: '200px',
          borderRadius: '12px',
          border: '2px solid var(--color-warm-gray)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: `box-shadow ${getDuration(300)}ms var(--ease-smooth)`,
          boxShadow: isHovered
            ? '0 10px 30px rgba(0,0,0,0.15)'
            : '0 2px 8px rgba(0,0,0,0.08)',
          ...style,
        }}
      >
        {/* Animated border gradient on hover */}
        <AnimatePresence>
          {isHovered && shouldAnimate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: -2,
                background:
                  'linear-gradient(45deg, var(--color-accent-gold), var(--color-primary), var(--color-accent-gold))',
                borderRadius: '12px',
                zIndex: -1,
              }}
            />
          )}
        </AnimatePresence>

        {/* Corner ornament with fade-in on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.3,
                type: 'spring',
              }}
            >
              <CornerOrnament
                position="top-left"
                color="var(--color-accent-gold)"
                size={25}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div>{icon}</div>

          <Title
            level={4}
            style={{
              margin: '8px 0',
              fontFamily: "'Amiri', serif",
              color: 'var(--color-text-primary)',
              textAlign: 'center',
              width: '100%',
              whiteSpace: 'normal',
              wordBreak: 'keep-all',
            }}
          >
            {title}
          </Title>

          <Paragraph
            type="secondary"
            style={{
              textAlign: 'center',
              margin: 0,
              fontSize: '14px',
              width: '100%',
              whiteSpace: 'normal',
              wordBreak: 'keep-all',
            }}
          >
            {description}
          </Paragraph>
        </div>
      </Card>
    </motion.div>
  );
};
