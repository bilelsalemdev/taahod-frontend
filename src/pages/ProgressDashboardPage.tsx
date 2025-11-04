import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Empty,
  Spin,
  Progress,
  List,
  Tag,
  Button,
  Row,
  Col,
  Statistic,
  Select,
} from 'antd';
import { BookOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useProgress, useProgressStats } from '../hooks/useProgress';
import type { Progress as ProgressType, Book } from '../types';

export function ProgressDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'recent' | 'progress'>('recent');

  const { data: progressData, isLoading: progressLoading } = useProgress();
  const { data: statsData, isLoading: statsLoading } = useProgressStats();

  const progress = progressData?.data?.progress || [];
  const stats = statsData?.data?.stats;

  const isLoading = progressLoading || statsLoading;

  const sortedProgress = [...progress].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.lastReadAt).getTime() - new Date(a.lastReadAt).getTime();
    } else {
      return b.percentComplete - a.percentComplete;
    }
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1>{t('profile.progressDashboard')}</h1>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.totalBooksRead')}
                value={stats.totalBooks}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.completedBooks')}
                value={stats.completedBooks}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.booksInProgress')}
                value={stats.inProgressBooks}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.averageProgress')}
                value={Math.round(stats.averageProgress)}
                suffix="%"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Sort Options */}
      <Card style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{t('common.filter')}:</span>
          <Select value={sortBy} onChange={setSortBy} style={{ width: '200px' }}>
            <Select.Option value="recent">{t('profile.recentActivity')}</Select.Option>
            <Select.Option value="progress">{t('profile.readingProgress')}</Select.Option>
          </Select>
        </div>
      </Card>

      {/* Progress List */}
      {sortedProgress.length === 0 ? (
        <Empty description={t('profile.noProgress')}>
          <Button type="primary" onClick={() => navigate('/subjects')}>
            {t('profile.startReading')}
          </Button>
        </Empty>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3 }}
          dataSource={sortedProgress}
          renderItem={(item: ProgressType) => {
            const book = item.bookId as Book;
            const isCompleted = item.percentComplete >= 100;

            return (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => navigate(`/books/${book._id}`)}
                  actions={[
                    <Button type="link" key="continue">
                      {isCompleted ? t('library.readBook') : t('profile.continueReading')}
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    avatar={<BookOutlined style={{ fontSize: '32px', color: '#1890ff' }} />}
                    title={book.titleAr}
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>{book.authorAr}</div>
                        <Progress
                          percent={Math.round(item.percentComplete)}
                          status={isCompleted ? 'success' : 'active'}
                          strokeColor={isCompleted ? '#52c41a' : '#1890ff'}
                        />
                        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span>
                            {item.currentPage} / {item.totalPages} صفحة
                          </span>
                          <Tag color={isCompleted ? 'green' : 'blue'}>
                            {isCompleted ? 'مكتمل' : 'قيد القراءة'}
                          </Tag>
                        </div>
                        <div style={{ marginTop: '4px', fontSize: '12px', color: '#888' }}>
                          {t('profile.lastRead')}: {new Date(item.lastReadAt).toLocaleDateString('ar-SA')}
                        </div>
                        {item.notes && (
                          <div style={{ marginTop: '8px', fontSize: '12px', fontStyle: 'italic' }}>
                            "{item.notes.substring(0, 50)}..."
                          </div>
                        )}
                      </div>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}
