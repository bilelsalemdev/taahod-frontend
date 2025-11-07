import React from 'react';

interface BorderPatternProps {
  position?: 'top' | 'bottom' | 'left' | 'right' | 'all';
  color?: string;
  thickness?: number;
  className?: string;
}

export const BorderPattern: React.FC<BorderPatternProps> = ({
  position = 'all',
  color = '#d97706',
  thickness = 2,
  className = '',
}) => {
  const borderStyle = {
    borderColor: color,
    borderWidth: `${thickness}px`,
    borderStyle: 'solid',
  };

  const positionStyles = {
    top: { borderTop: `${thickness}px solid ${color}` },
    bottom: { borderBottom: `${thickness}px solid ${color}` },
    left: { borderLeft: `${thickness}px solid ${color}` },
    right: { borderRight: `${thickness}px solid ${color}` },
    all: borderStyle,
  };

  return (
    <div
      className={`islamic-border ${className}`}
      style={{
        ...positionStyles[position],
        borderImage: `repeating-linear-gradient(
          45deg,
          ${color},
          ${color} 10px,
          transparent 10px,
          transparent 20px
        ) 1`,
      }}
    />
  );
};
