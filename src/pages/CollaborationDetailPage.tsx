import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Empty,
  Spin,
  Descriptions,
  List,
  Progress,
  Tag,
  Avatar,
  Space,
} from 'antd';
import { ArrowLeftOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useCollaboration, useCollaborationProgress } from '../hooks/useCollaborations';
import { CornerOrnament } from '../components/patterns';
import type { Book, Progress as ProgressType } from '../types';

export function CollaborationDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: collabData, isLoading: collabLoading } = useCollaboration(id!);
  const { data: progressData, isLoading: progressLoading } = useCollaborationProgress(id!);

  const collaboration = collabData?.data?.collaboration;
  const participantProgress = progressData?.data?.participantProgress || [];

  const isLoading = collabLoading || progressLoading;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!collaboration) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={t('collaboration.noCollaborations')} />
      </div>
    );
  }

  const book = collaboration.bookId as Book;

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/collaborations')}
        style={{ marginBottom: '16px' }}
      >
        {t('common.back')}
      </Button>

      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          border: '2px solid var(--color-accent-gold)',
          position: 'relative',
        }}
      >
        <CornerOrnament position="all" color="var(--color-accent-gold)" size={30} />
        <h1 style={{ fontFamily: "'Amiri', serif", color: 'var(--color-primary)' }}>
          {collaboration.name}
        </h1>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('library.bookTitle')}>
            <Space>
              <BookOutlined />
              {book.titleAr}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={t('collaboration.creator')}>
            {collaboration.creatorId}
          </Descriptions.Item>
          <Descriptions.Item label={t('collaboration.participants')}>
            <Avatar.Group maxCount={10}>
              {collaboration.participants.map((participant) => (
                <Avatar
                  key={participant._id}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#87d068' }}
                >
                  {participant.name[0]}
                </Avatar>
              ))}
            </Avatar.Group>
            <div style={{ marginTop: '8px' }}>
              {collaboration.participants.length} {t('collaboration.participants')}
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={collaboration.isActive ? 'green' : 'default'}>
              {collaboration.isActive ? 'نشط' : 'غير نشط'}
            </Tag>
          </Descriptions.Item>
          {collaboration.targetCompletionDate && (
            <Descriptions.Item label={t('collaboration.targetDate')}>
              {new Date(collaboration.targetCompletionDate).toLocaleDateString('ar-SA')}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title={t('collaboration.participantProgress')}>
        {participantProgress.length === 0 ? (
          <Empty description={t('profile.noProgress')} />
        ) : (
          <List
            dataSource={participantProgress}
            renderItem={(item: any) => {
              const progress = item.progress as ProgressType | null;
              const user = item.user;

              return (
                <List.Item>
                  <Card style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                          {user.name[0]}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>{user.email}</div>
                        </div>
                      </div>

                      {progress ? (
                        <>
                          <Progress
                            percent={Math.round(progress.percentComplete)}
                            status={progress.percentComplete >= 100 ? 'success' : 'active'}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span>
                              {progress.currentPage} / {progress.totalPages} صفحة
                            </span>
                            <span>
                              {t('profile.lastRead')}:{' '}
                              {new Date(progress.lastReadAt).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </>
                      ) : (
                        <Tag color="default">لم يبدأ القراءة بعد</Tag>
                      )}
                    </Space>
                  </Card>
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
}
