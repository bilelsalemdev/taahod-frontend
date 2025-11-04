import { useState } from 'react';
import {
  Card,
  Button,
  Empty,
  Spin,
  Modal,
  Form,
  Input,
  Upload,
  message,
  List,
  Space,
  Tag,
} from 'antd';
import { PlusOutlined, InboxOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTasjil, useUploadTasjil, useDeleteTasjil } from '../hooks/useTasjil';
import { tasjilService } from '../services';
import { AudioPlayer } from '../components/AudioPlayer';
import type { UploadFile } from 'antd';
import type { Tasjil } from '../types';

const { Dragger } = Upload;

export function TasjilPage() {
  const { t } = useTranslation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<Tasjil | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useTasjil();
  const uploadTasjil = useUploadTasjil();
  const deleteTasjil = useDeleteTasjil();

  const recordings = data?.data?.recordings || [];

  const handleUpload = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Please select an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('audio', fileList[0].originFileObj as File);
    formData.append('title', values.title);
    formData.append('surah', values.surah);
    formData.append('ayahRange', values.ayahRange || '');

    try {
      await uploadTasjil.mutateAsync(formData);
      message.success(t('audio.uploadSuccess'));
      form.resetFields();
      setFileList([]);
      setIsUploadModalOpen(false);
    } catch (error: any) {
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: t('audio.deleteRecording'),
      content: t('library.confirmDelete'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteTasjil.mutateAsync(id);
          message.success(t('library.deleteSuccess'));
          if (selectedRecording?._id === id) {
            setSelectedRecording(null);
          }
        } catch (error: any) {
          message.error(error.messageAr || error.message || t('common.error'));
        }
      },
    });
  };

  const uploadProps = {
    fileList,
    beforeUpload: (file: File) => {
      const isAudio = file.type.startsWith('audio/');
      if (!isAudio) {
        message.error('You can only upload audio files!');
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
        <h1>{t('audio.myRecordings')}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          {t('audio.uploadRecording')}
        </Button>
      </div>

      {selectedRecording && (
        <div style={{ marginBottom: '24px' }}>
          <AudioPlayer
            src={tasjilService.getStreamUrl(selectedRecording._id)}
            title={selectedRecording.title}
            subtitle={`${selectedRecording.surah} ${selectedRecording.ayahRange ? `- ${selectedRecording.ayahRange}` : ''}`}
          />
        </div>
      )}

      {recordings.length === 0 ? (
        <Empty description={t('audio.noRecordings')}>
          <Button type="primary" onClick={() => setIsUploadModalOpen(true)}>
            {t('audio.uploadRecording')}
          </Button>
        </Empty>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={recordings}
          renderItem={(recording: Tasjil) => (
            <List.Item>
              <Card
                hoverable
                actions={[
                  <PlayCircleOutlined
                    key="play"
                    onClick={() => setSelectedRecording(recording)}
                  />,
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDelete(recording._id)}
                  />,
                ]}
              >
                <Card.Meta
                  title={recording.title}
                  description={
                    <Space direction="vertical" size="small">
                      <Tag color="blue">{recording.surah}</Tag>
                      {recording.ayahRange && <div>{recording.ayahRange}</div>}
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(recording.uploadedAt).toLocaleDateString('ar-SA')}
                      </div>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title={t('audio.uploadRecording')}
        open={isUploadModalOpen}
        onCancel={() => {
          setIsUploadModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            name="title"
            label={t('audio.recordingTitle')}
            rules={[{ required: true, message: 'الرجاء إدخال عنوان التسجيل' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="surah"
            label={t('audio.surah')}
            rules={[{ required: true, message: 'الرجاء إدخال اسم السورة' }]}
          >
            <Input placeholder="مثال: الفاتحة" />
          </Form.Item>

          <Form.Item name="ayahRange" label={t('audio.ayahRange')}>
            <Input placeholder="مثال: 1-7" />
          </Form.Item>

          <Form.Item label={t('audio.selectAudio')} required>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag audio file to this area</p>
              <p className="ant-upload-hint">Support for MP3, WAV, and other audio formats. Maximum: 50MB</p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploadTasjil.isPending} block>
              {t('audio.uploadRecording')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
