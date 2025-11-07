import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Space, Typography } from 'antd';
import {
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  AudioOutlined,
  ReadOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { AnimatedWelcomeBanner } from '../components/animated/AnimatedWelcomeBanner';
import { AnimatedStatCard } from '../components/animated/AnimatedStatCard';
import { AnimatedActionCard } from '../components/animated/AnimatedActionCard';
import { AnimatedContainer } from '../components/animated/AnimatedContainer';
import { ScrollReveal } from '../components/animated/ScrollReveal';

const { Title, Paragraph } = Typography;

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useProfile();

  const stats = data?.data?.stats;

  const quickActions = [
    {
      title: t('nav.subjects'),
      icon: <BookOutlined style={{ fontSize: '32px', color: 'var(--color-primary)' }} />,
      description: 'تصفح المواد والكتب الإسلامية',
      path: '/subjects',
    },
    {
      title: t('nav.schedule'),
      icon: <CalendarOutlined style={{ fontSize: '32px', color: 'var(--color-success)' }} />,
      description: 'إدارة جدول الدراسة',
      path: '/schedule',
    },
    {
      title: t('nav.adhkar'),
      icon: <ReadOutlined style={{ fontSize: '32px', color: 'var(--color-accent-gold)' }} />,
      description: 'الأذكار والأدعية اليومية',
      path: '/adhkar',
    },
    {
      title: t('nav.collaborations'),
      icon: <TeamOutlined style={{ fontSize: '32px', color: 'var(--color-info)' }} />,
      description: 'الانضمام لمجموعات القراءة',
      path: '/collaborations',
    },
    {
      title: t('nav.tasjil'),
      icon: <AudioOutlined style={{ fontSize: '32px', color: 'var(--color-accent-amber)' }} />,
      description: 'تسجيلات القرآن الكريم',
      path: '/tasjil',
    },
    {
      title: t('profile.progressDashboard'),
      icon: <BarChartOutlined style={{ fontSize: '32px', color: 'var(--color-primary-light)' }} />,
      description: 'تتبع تقدم القراءة',
      path: '/progress',
    },
  ];

  return (
    <div>
      <AnimatedWelcomeBanner
        title={
          <Title
            level={2}
            style={{
              color: 'white',
              fontFamily: "'Amiri', serif",
              marginBottom: '8px',
            }}
          >
            {t('app.welcome')}, {user?.name}!
          </Title>
        }
        subtitle={
          <Paragraph
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '18px',
              margin: 0,
            }}
          >
            مرحباً بك في تعاهد - منصتك الشاملة للتعلم الإسلامي
          </Paragraph>
        }
      />

      {/* Statistics */}
      {stats && (
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} md={6}>
            <AnimatedContainer animation="slide-up" delay={0}>
              <AnimatedStatCard
                title={t('profile.totalBooksRead')}
                value={stats.totalBooksRead}
                prefix={<BookOutlined />}
                borderColor="var(--color-primary)"
                valueColor="var(--color-primary)"
              />
            </AnimatedContainer>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AnimatedContainer animation="slide-up" delay={100}>
              <AnimatedStatCard
                title={t('profile.activeCollaborations')}
                value={stats.activeCollaborations}
                prefix={<TeamOutlined />}
                borderColor="var(--color-info)"
                valueColor="var(--color-info)"
              />
            </AnimatedContainer>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AnimatedContainer animation="slide-up" delay={200}>
              <AnimatedStatCard
                title={t('profile.tasjilCount')}
                value={stats.tasjilCount}
                prefix={<AudioOutlined />}
                borderColor="var(--color-accent-amber)"
                valueColor="var(--color-accent-amber)"
              />
            </AnimatedContainer>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <AnimatedContainer animation="slide-up" delay={300}>
              <AnimatedStatCard
                title={t('profile.averageProgress')}
                value={stats.totalProgress}
                suffix="%"
                borderColor="var(--color-success)"
                valueColor="var(--color-success)"
              />
            </AnimatedContainer>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Title
        level={3}
        style={{
          marginBottom: '24px',
          fontFamily: "'Amiri', serif",
          color: 'var(--color-primary)',
        }}
      >
        الإجراءات السريعة
      </Title>
      <Row gutter={[24, 24]}>
        {quickActions.map((action, index) => (
          <Col xs={24} sm={12} md={8} key={action.path}>
            <AnimatedContainer animation="slide-up" delay={index * 80}>
              <AnimatedActionCard
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={() => navigate(action.path)}
              />
            </AnimatedContainer>
          </Col>
        ))}
      </Row>

      {/* Call to Action */}
      <ScrollReveal animation="slide-up" threshold={0.2}>
        <AnimatedWelcomeBanner
          title={
            <Title
              level={3}
              style={{ color: 'white', fontFamily: "'Amiri', serif" }}
            >
              ابدأ رحلتك التعليمية اليوم
            </Title>
          }
          subtitle={
            <>
              <Paragraph
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '16px',
                }}
              >
                استكشف مجموعتنا من الكتب الإسلامية، أنشئ جداول دراسية، وانضم
                لمجموعات القراءة
              </Paragraph>
              <Space size="large" style={{ marginTop: '16px' }}>
                <Button
                  size="large"
                  onClick={() => navigate('/subjects')}
                  style={{
                    background: 'var(--color-accent-gold)',
                    border: 'none',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  تصفح الكتب
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate('/schedule')}
                  style={{
                    background: 'white',
                    color: 'var(--color-primary)',
                    fontWeight: 'bold',
                  }}
                >
                  إنشاء جدول
                </Button>
              </Space>
            </>
          }
          style={{ marginTop: '32px' }}
        />
      </ScrollReveal>
    </div>
  );
}
