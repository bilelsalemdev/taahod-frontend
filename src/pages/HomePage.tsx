import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Space, Typography } from 'antd';
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
      icon: <BookOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      description: 'Browse Islamic subjects and books',
      path: '/subjects',
    },
    {
      title: t('nav.schedule'),
      icon: <CalendarOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      description: 'Manage your study schedule',
      path: '/schedule',
    },
    {
      title: t('nav.adhkar'),
      icon: <ReadOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      description: 'Daily adhkar and supplications',
      path: '/adhkar',
    },
    {
      title: t('nav.collaborations'),
      icon: <TeamOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      description: 'Join reading groups',
      path: '/collaborations',
    },
    {
      title: t('nav.tasjil'),
      icon: <AudioOutlined style={{ fontSize: '32px', color: '#eb2f96' }} />,
      description: 'Your Quran recordings',
      path: '/tasjil',
    },
    {
      title: t('profile.progressDashboard'),
      icon: <BarChartOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />,
      description: 'Track your reading progress',
      path: '/progress',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <Title level={2}>
          {t('app.welcome')}, {user?.name}!
        </Title>
        <Paragraph>
          مرحباً بك في تعاهد - منصتك الشاملة للتعلم الإسلامي
        </Paragraph>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.totalBooksRead')}
                value={stats.totalBooksRead}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.activeCollaborations')}
                value={stats.activeCollaborations}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.tasjilCount')}
                value={stats.tasjilCount}
                prefix={<AudioOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.averageProgress')}
                value={stats.totalProgress}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Title level={3} style={{ marginBottom: '16px' }}>
        Quick Actions
      </Title>
      <Row gutter={[16, 16]}>
        {quickActions.map((action) => (
          <Col xs={24} sm={12} md={8} key={action.path}>
            <Card
              hoverable
              onClick={() => navigate(action.path)}
              style={{ height: '100%' }}
            >
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                {action.icon}
                <Title level={4} style={{ margin: '8px 0' }}>
                  {action.title}
                </Title>
                <Paragraph type="secondary" style={{ textAlign: 'center', margin: 0 }}>
                  {action.description}
                </Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Call to Action */}
      <Card style={{ marginTop: '32px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Title level={3} style={{ color: 'white' }}>
          Start Your Learning Journey Today
        </Title>
        <Paragraph style={{ color: 'white', fontSize: '16px' }}>
          Explore our collection of Islamic books, create study schedules, and join reading groups
        </Paragraph>
        <Space size="large">
          <Button size="large" type="primary" onClick={() => navigate('/subjects')}>
            Browse Books
          </Button>
          <Button size="large" onClick={() => navigate('/schedule')} style={{ background: 'white' }}>
            Create Schedule
          </Button>
        </Space>
      </Card>
    </div>
  );
}
