import { useState, useRef, useEffect } from 'react';
import { Card, Slider, Button, Space } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { CornerOrnament } from './patterns';

interface AudioPlayerProps {
  src: string;
  title: string;
  subtitle?: string;
}

export function AudioPlayer({ src, title, subtitle }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = value;
    setVolume(value);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      style={{
        borderRadius: '12px',
        border: '2px solid var(--color-accent-gold)',
        background: 'var(--color-bg-cream)',
        position: 'relative',
      }}
    >
      <CornerOrnament position="all" color="var(--color-accent-gold)" size={25} />
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <div style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: 0, fontFamily: "'Amiri', serif", color: 'var(--color-primary)' }}>
          {title}
        </h3>
        {subtitle && (
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
            {subtitle}
          </div>
        )}
      </div>

      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
          />
          
          <div style={{ flex: 1 }}>
            <Slider
              value={currentTime}
              max={duration || 100}
              onChange={handleSeek}
              tooltip={{ formatter: (value) => formatTime(value || 0) }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '200px' }}>
          <SoundOutlined />
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={handleVolumeChange}
            style={{ flex: 1 }}
          />
        </div>
      </Space>
    </Card>
  );
}
