import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Empty, Spin, Descriptions, Divider, Tag } from 'antd';
import { ArrowLeftOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubject, useSubjectBooks } from '../hooks/useSubjects';
import type { Book } from '../types';

export function SubjectDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: subjectData, isLoading: subjectLoading } = useSubject(id!);
  const { data: booksData, isLoading: booksLoading } = useSubjectBooks(id!);

  const subject = subjectData?.data?.subject;
  const books = booksData?.data?.books || [];

  if (subjectLoading || booksLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={t('library.noSubjects')} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/subjects')}
        style={{ marginBottom: '16px' }}
      >
        {t('common.back')}
      </Button>

      <Card>
        <h1>{subject.nameAr}</h1>
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('library.subjectName') + ' (English)'}>
            {subject.name}
          </Descriptions.Item>
          <Descriptions.Item label={t('library.subjectDescription') + ' (عربي)'}>
            {subject.descriptionAr || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('library.subjectDescription') + ' (English)'}>
            {subject.description || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('library.bookCount')}>
            <Tag color="blue">{books.length}</Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider orientation="left">
        <h2>{t('library.booksInSubject')}</h2>
      </Divider>

      {books.length === 0 ? (
        <Empty description={t('library.noBooks')} />
      ) : (
        <Row gutter={[16, 16]}>
          {books.map((book: Book) => (
            <Col xs={24} sm={12} md={8} lg={6} key={book._id}>
              <Card
                hoverable
                onClick={() => navigate(`/books/${book._id}`)}
                cover={
                  <div
                    style={{
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    <BookOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                  </div>
                }
              >
                <Card.Meta
                  title={book.titleAr}
                  description={
                    <>
                      <div>{book.authorAr}</div>
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#888' }}>
                        {book.totalPages} {t('library.totalPages')}
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
