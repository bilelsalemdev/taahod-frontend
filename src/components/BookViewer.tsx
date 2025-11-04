import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Space, InputNumber, Spin } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSaveProgress } from '../hooks/useProgress';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BookViewerProps {
  fileUrl: string;
  bookId: string;
  initialPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function BookViewer({
  fileUrl,
  bookId,
  initialPage = 1,
  totalPages: initialTotalPages,
  onPageChange,
}: BookViewerProps) {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(initialTotalPages || 0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);

  const saveProgress = useSaveProgress();

  useEffect(() => {
    setPageNumber(initialPage);
  }, [initialPage]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
      onPageChange?.(newPage);

      // Auto-save progress
      saveProgress.mutate({
        bookId,
        currentPage: newPage,
        totalPages: numPages,
      });
    }
  };

  const goToPrevPage = () => handlePageChange(pageNumber - 1);
  const goToNextPage = () => handlePageChange(pageNumber + 1);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Controls */}
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <Space>
          <Button
            icon={<LeftOutlined />}
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            {t('common.previous')}
          </Button>

          <Space>
            <InputNumber
              min={1}
              max={numPages}
              value={pageNumber}
              onChange={(value) => value && handlePageChange(value)}
              style={{ width: '80px' }}
            />
            <span>/ {numPages}</span>
          </Space>

          <Button
            icon={<RightOutlined />}
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            {t('common.next')}
          </Button>
        </Space>

        <Space>
          <Button icon={<ZoomOutOutlined />} onClick={zoomOut} disabled={scale <= 0.5} />
          <span>{Math.round(scale * 100)}%</span>
          <Button icon={<ZoomInOutlined />} onClick={zoomIn} disabled={scale >= 3.0} />
          <Button icon={<FullscreenOutlined />} onClick={toggleFullscreen} />
        </Space>
      </div>

      {/* PDF Viewer */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '16px',
          backgroundColor: '#525659',
        }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          }
          error={
            <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
              {t('common.error')}
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
}
