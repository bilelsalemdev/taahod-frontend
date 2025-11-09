import { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Progress, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubjects } from '../hooks/useSubjects';
import { useCreateBook } from '../hooks/useBooks';
import type { UploadFile } from 'antd';
import { pdfjs } from 'react-pdf';
import { chunkedUploadService } from '../services/chunkUploadService';
import { api } from '../services/api';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const { TextArea } = Input;
const { Dragger } = Upload;

// File size threshold for chunked upload (10MB)
const CHUNKED_UPLOAD_THRESHOLD = 10 * 1024 * 1024;

interface BookUploadProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BookUpload({ open, onClose, onSuccess }: BookUploadProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { data: subjectsData } = useSubjects();
  const createBook = useCreateBook();

  const subjects = subjectsData?.data?.subjects || [];

  // Extract page count from PDF
  const extractPdfPageCount = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages;
    } catch (error) {
      console.error('Error extracting PDF page count:', error);
      return 0;
    }
  };

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Please select a file');
      return;
    }

    // Get the actual file object
    const file = fileList[0].originFileObj || fileList[0];
    
    if (!file) {
      message.error('File not found. Please select a file again.');
      return;
    }

    const fileObj = file as File;

    try {
      // Use chunked upload for large files
      if (fileObj.size > CHUNKED_UPLOAD_THRESHOLD) {
        message.loading({ content: 'Uploading file in chunks...', key: 'upload', duration: 0 });
        
        // Upload file in chunks
        const uploadId = await chunkedUploadService.uploadFile({
          file: fileObj,
          onProgress: (progress) => {
            setUploadProgress(progress.percentage);
            message.loading({ 
              content: `Uploading: ${progress.percentage}%`, 
              key: 'upload',
              duration: 0 
            });
          },
        });

        // Create book from chunks
        message.loading({ content: 'Finalizing upload...', key: 'upload', duration: 0 });
        
        await api.post('/books/from-chunks', {
          uploadId,
          titleAr: values.titleAr,
          title: values.title,
          authorAr: values.authorAr,
          author: values.author,
          subjectId: values.subjectId,
          totalPages: totalPages,
          descriptionAr: values.descriptionAr || '',
          description: values.description || '',
        });

        message.success({ content: t('library.createSuccess'), key: 'upload' });
      } else {
        // Use regular upload for small files
        const formData = new FormData();
        formData.append('file', fileObj, fileObj.name);
        formData.append('titleAr', values.titleAr);
        formData.append('title', values.title);
        formData.append('authorAr', values.authorAr);
        formData.append('author', values.author);
        formData.append('subjectId', values.subjectId);
        formData.append('totalPages', totalPages.toString());
        
        if (values.descriptionAr) {
          formData.append('descriptionAr', values.descriptionAr);
        }
        if (values.description) {
          formData.append('description', values.description);
        }

        setUploadProgress(10);
        await createBook.mutateAsync(formData);
        setUploadProgress(100);
        message.success(t('library.createSuccess'));
      }

      // Reset form
      form.resetFields();
      setFileList([]);
      setUploadProgress(0);
      setTotalPages(0);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setUploadProgress(0);
      message.error({ content: error.messageAr || error.message || t('common.error'), key: 'upload' });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setUploadProgress(0);
    setTotalPages(0);
    onClose();
  };

  const uploadProps = {
    fileList,
    beforeUpload: async (file: File) => {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('You can only upload PDF files!');
        return false;
      }
      const isLt50M = file.size / 1024 / 1024 < 50;
      if (!isLt50M) {
        message.error('File must be smaller than 50MB!');
        return false;
      }
      
      // Extract page count from PDF
      message.loading({ content: 'Analyzing PDF...', key: 'pdf-analysis' });
      const pageCount = await extractPdfPageCount(file);
      setTotalPages(pageCount);
      message.success({ content: `PDF has ${pageCount} pages`, key: 'pdf-analysis', duration: 2 });
      
      setFileList([file as any]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
      setTotalPages(0);
    },
    maxCount: 1,
  };

  return (
    <Modal
      title={t('library.uploadBook')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="subjectId"
          label={t('library.selectSubject')}
          rules={[{ required: true, message: 'Please select a subject' }]}
        >
          <Select
            placeholder={t('library.selectSubject')}
            showSearch
            optionFilterProp="children"
          >
            {subjects.map((subject: any) => (
              <Select.Option key={subject._id} value={subject._id}>
                {subject.nameAr}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="titleAr"
          label={t('library.bookTitle') + ' (عربي)'}
          rules={[{ required: true, message: 'الرجاء إدخال عنوان الكتاب' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="title"
          label={t('library.bookTitle') + ' (English)'}
          rules={[{ required: true, message: 'Please enter book title' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="authorAr"
          label={t('library.bookAuthor') + ' (عربي)'}
          rules={[{ required: true, message: 'الرجاء إدخال اسم المؤلف' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="author"
          label={t('library.bookAuthor') + ' (English)'}
          rules={[{ required: true, message: 'Please enter author name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="descriptionAr"
          label={t('library.bookDescription') + ' (عربي)'}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('library.bookDescription') + ' (English)'}
        >
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label={t('library.selectFile')}
          required
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag PDF file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for PDF files only. Maximum file size: 50MB
            </p>
          </Dragger>
        </Form.Item>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <Progress percent={uploadProgress} status="active" />
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={createBook.isPending}
            block
            icon={<UploadOutlined />}
          >
            {t('library.uploadBook')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
