import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Progress, Spin, Empty, Tabs, Space } from 'antd';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  BookOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useBook } from '../hooks/useBooks';
import { useBookProgress } from '../hooks/useProgress';
import { bookService } from '../services';
import { BookViewer } from '../components/BookViewer';
import { CornerOrnament } from '../components/patterns';
import type { Book } from '../types';

export function BookDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('read');

  const { data: bookData, isLoading: bookLoading } = useBook(id!);
  const { data: progressData } = useBookProgress(id!);

  const book = bookData?.data?.book as Book;
  const progress = progressData?.data?.progress;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = async () => {
    try {
      const blob = await bookService.downloadFile(id!);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${book.titleAr || book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (bookLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={t('library.noBooks')} />
      </div>
    );
  }

  const subjectId = typeof book.subjectId === 'string' ? book.subjectId : book.subjectId._id;

  return (
    <div style={{ height: 'calc(100vh - 48px)' }}>
      <Space style={{ marginBottom: '16px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`/subjects/${subjectId}`)}
          size="large"
          style={{
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)',
          }}
        >
          {t('common.back')}
        </Button>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          size="large"
          type="primary"
        >
          {t('library.downloadBook')}
        </Button>
      </Space>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'read',
            label: (
              <span>
                <BookOutlined />
                {t('library.readBook')}
              </span>
            ),
            children: (
              <div style={{ height: 'calc(100vh - 200px)' }}>
                <BookViewer
                  bookId={id!}
                  initialPage={progress?.currentPage || 1}
                  totalPages={book.totalPages}
                />
              </div>
            ),
          },
          {
            key: 'details',
            label: (
              <span>
                <FileTextOutlined />
                {t('library.bookDetails')}
              </span>
            ),
            children: (
              <Card
                style={{
                  borderRadius: '12px',
                  border: '2px solid var(--color-accent-gold)',
                  position: 'relative',
                }}
              >
                <CornerOrnament position="all" color="var(--color-accent-gold)" size={30} />
                <Descriptions bordered column={1}>
                  <Descriptions.Item label={t('library.bookTitle') + ' (عربي)'}>
                    {book.titleAr}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.bookTitle') + ' (English)'}>
                    {book.title}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.bookAuthor') + ' (عربي)'}>
                    {book.authorAr}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.bookAuthor') + ' (English)'}>
                    {book.author}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.bookDescription') + ' (عربي)'}>
                    {book.descriptionAr || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.bookDescription') + ' (English)'}>
                    {book.description || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.totalPages')}>
                    {book.totalPages}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.fileSize')}>
                    {formatFileSize(book.fileSize)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.uploadedBy')}>
                    {book.uploadedBy?.name || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('library.uploadDate')}>
                    {new Date(book.createdAt).toLocaleDateString('ar-SA')}
                  </Descriptions.Item>
                  {progress && (
                    <Descriptions.Item label="Progress">
                      <Progress
                        percent={Math.round(progress.percentComplete)}
                        status="active"
                      />
                      <div style={{ marginTop: '8px' }}>
                        Page {progress.currentPage} of {progress.totalPages}
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
}
