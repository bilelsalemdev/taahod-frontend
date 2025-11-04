import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Empty, Spin, Input, Pagination, Tag } from 'antd';
import { PlusOutlined, BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../contexts/AuthContext';
import { BookUpload } from '../components/BookUpload';
import type { Book } from '../types';

const { Search } = Input;

export function BooksPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data, isLoading, error } = useBooks({ page, limit: 12 });

  const books = data?.data?.books || [];
  const pagination = data?.data?.pagination;
  const isAdmin = user?.role === 'admin';

  const filteredBooks = books.filter((book: Book) =>
    book.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.authorAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={(error as any).messageAr || (error as any).message || t('common.error')} />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t('library.allBooks')}</h1>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            {t('library.uploadBook')}
          </Button>
        )}
      </div>

      <Search
        placeholder={t('common.search')}
        allowClear
        size="large"
        style={{ marginBottom: '24px' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredBooks.length === 0 ? (
        <Empty description={t('library.noBooks')} />
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {filteredBooks.map((book: Book) => (
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
                        <div style={{ marginBottom: '8px' }}>{book.authorAr}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888' }}>
                          <Tag>{book.totalPages} صفحة</Tag>
                          <span>{formatFileSize(book.fileSize)}</span>
                        </div>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>

          {pagination && pagination.pages > 1 && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Pagination
                current={page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={setPage}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}

      <BookUpload
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          // Refresh the list
          setPage(1);
        }}
      />
    </div>
  );
}
