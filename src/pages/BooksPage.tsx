import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Empty, Spin, Input, Pagination, Tag, message, App } from 'antd';
import { PlusOutlined, BookOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useBooks, useDeleteBook } from '../hooks/useBooks';
import { useAuth } from '../contexts/AuthContext';
import { BookUpload } from '../components/BookUpload';
import { CornerOrnament } from '../components/patterns';
import type { Book } from '../types';

const { Search } = Input;

export function BooksPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { modal } = App.useApp();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data, isLoading, error } = useBooks({ page, limit: 12 });

  const books = data?.data?.books || [];
  const pagination = data?.data?.pagination;
  const isAdmin = user?.role === 'admin';

  const deleteBook = useDeleteBook();

  const handleDelete = (bookId: string, bookTitle: string) => {
    modal.confirm({
      title: t('library.deleteBook'),
      icon: <ExclamationCircleOutlined />,
      content: `${t('library.confirmDelete')} "${bookTitle}"?`,
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteBook.mutateAsync(bookId);
          message.success(t('library.deleteSuccess'));
        } catch (error: any) {
          message.error(error.messageAr || error.message || t('common.error'));
        }
      },
    });
  };

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
    <div>
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Amiri', serif",
            color: 'var(--color-primary)',
            fontSize: '32px',
            margin: 0,
          }}
        >
          {t('library.allBooks')}
        </h1>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsUploadModalOpen(true)}
            size="large"
          >
            {t('library.uploadBook')}
          </Button>
        )}
      </div>
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent-gold), var(--color-primary))',
          marginBottom: '24px',
        }}
      />

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
          <Row gutter={[24, 24]}>
            {filteredBooks.map((book: Book) => (
              <Col xs={24} sm={12} md={8} lg={6} key={book._id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/books/${book._id}`)}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid var(--color-warm-gray)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  cover={
                    <div
                      style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, var(--color-bg-cream) 0%, var(--color-bg-beige) 100%)',
                        position: 'relative',
                      }}
                    >
                      <CornerOrnament position="top-right" color="var(--color-accent-gold)" size={25} />
                      <BookOutlined
                        style={{
                          fontSize: '64px',
                          color: 'var(--color-primary)',
                        }}
                      />
                    </div>
                  }
                  actions={
                    isAdmin
                      ? [
                          <Button
                            key="delete"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDelete(book._id, book.titleAr);
                            }}
                            loading={deleteBook.isPending}
                          >
                            {t('common.delete')}
                          </Button>,
                        ]
                      : undefined
                  }
                >
                  <Card.Meta
                    title={
                      <span
                        style={{
                          fontFamily: "'Amiri', serif",
                          fontSize: '16px',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {book.titleAr}
                      </span>
                    }
                    description={
                      <>
                        <div style={{ marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                          {book.authorAr}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '12px',
                            color: 'var(--color-text-light)',
                          }}
                        >
                          <Tag color="green">{book.totalPages} صفحة</Tag>
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
