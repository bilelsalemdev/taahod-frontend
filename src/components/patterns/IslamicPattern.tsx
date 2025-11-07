import React from 'react';

interface IslamicPatternProps {
  type?: 'arabesque' | 'geometric' | 'star';
  opacity?: number;
  color?: string;
  className?: string;
}

export const IslamicPattern: React.FC<IslamicPatternProps> = ({
  type = 'arabesque',
  opacity = 0.05,
  color = '#047857',
  className = '',
}) => {
  const patterns = {
    arabesque: (
      <svg
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="arabesque-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M50 10 Q60 20 50 30 Q40 20 50 10 M50 30 Q60 40 50 50 Q40 40 50 30 M50 50 Q60 60 50 70 Q40 60 50 50 M50 70 Q60 80 50 90 Q40 80 50 70"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
            <path
              d="M10 50 Q20 60 30 50 Q20 40 10 50 M30 50 Q40 60 50 50 Q40 40 30 50 M50 50 Q60 60 70 50 Q60 40 50 50 M70 50 Q80 60 90 50 Q80 40 70 50"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arabesque-pattern)" />
      </svg>
    ),
    geometric: (
      <svg
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="geometric-pattern"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <rect x="10" y="10" width="60" height="60" fill="none" stroke={color} strokeWidth="1" />
            <rect x="20" y="20" width="40" height="40" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="40" cy="40" r="15" fill="none" stroke={color} strokeWidth="1" />
            <line x1="40" y1="10" x2="40" y2="70" stroke={color} strokeWidth="1" />
            <line x1="10" y1="40" x2="70" y2="40" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric-pattern)" />
      </svg>
    ),
    star: (
      <svg
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="star-pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M50 20 L55 40 L75 45 L60 55 L65 75 L50 65 L35 75 L40 55 L25 45 L45 40 Z"
              fill="none"
              stroke={color}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#star-pattern)" />
      </svg>
    ),
  };

  return patterns[type];
};
