import React from 'react';

interface CornerOrnamentProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'all';
  color?: string;
  size?: number;
  className?: string;
}

export const CornerOrnament: React.FC<CornerOrnamentProps> = ({
  position = 'all',
  color = '#d97706',
  size = 40,
  className = '',
}) => {
  const Ornament = ({ rotate = 0 }: { rotate?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M0 0 Q10 0 10 10 L10 0 M0 0 Q0 10 10 10 L0 10"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="10" cy="10" r="3" fill={color} />
      <path
        d="M5 0 L5 5 M0 5 L5 5"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  );

  const positions = {
    'top-left': (
      <div className="absolute top-0 left-0">
        <Ornament rotate={0} />
      </div>
    ),
    'top-right': (
      <div className="absolute top-0 right-0">
        <Ornament rotate={90} />
      </div>
    ),
    'bottom-right': (
      <div className="absolute bottom-0 right-0">
        <Ornament rotate={180} />
      </div>
    ),
    'bottom-left': (
      <div className="absolute bottom-0 left-0">
        <Ornament rotate={270} />
      </div>
    ),
    all: (
      <>
        <div className="absolute top-0 left-0">
          <Ornament rotate={0} />
        </div>
        <div className="absolute top-0 right-0">
          <Ornament rotate={90} />
        </div>
        <div className="absolute bottom-0 right-0">
          <Ornament rotate={180} />
        </div>
        <div className="absolute bottom-0 left-0">
          <Ornament rotate={270} />
        </div>
      </>
    ),
  };

  return <div className={`corner-ornaments ${className}`}>{positions[position]}</div>;
};
