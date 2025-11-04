import { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Progress, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubjects } from '../hooks/useSubjects';
import { useCreateBook } from '../hooks/useBooks';
import type { UploadFile } from 'antd';

const { TextArea } = Input;
const { Dragger } = Upload;

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

  const { data: subjectsData } = useSubjects();
  const createBook = useCreateBook();

  const subjects = subjectsData?.data?.subjects || [];

  const handleSubmit = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj as File);
    formData.append('titleAr', values.titleAr);
    formData.append('title', values.title);
    formData.append('authorAr', values.authorAr);
    formData.append('author', values.author);
    formData.append('subjectId', values.subjectId);
    
    if (values.descriptionAr) {
      formData.append('descriptionAr', values.descriptionAr);
    }
    if (values.description) {
      formData.append('description', values.description);
    }

    try {
      setUploadProgress(10);
      await createBook.mutateAsync(formData);
      setUploadProgress(100);
      message.success(t('library.createSuccess'));
      form.resetFields();
      setFileList([]);
      setUploadProgress(0);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      setUploadProgress(0);
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setUploadProgress(0);
    onClose();
  };

  const uploadProps = {
    fileList,
    beforeUpload: (file: File) => {
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
      setFileList([file as any]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
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
