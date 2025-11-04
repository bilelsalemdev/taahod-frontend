import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'large', tip, fullScreen = false }: LoadingSpinnerProps) {
  const spinner = (
    <Spin
      size={size}
      tip={tip}
      indicator={<LoadingOutlined style={{ fontSize: size === 'large' ? 48 : 24 }} spin />}
    />
  );

  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      {spinner}
    </div>
  );
}
