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
import { usePodcasts, useCreatePodcast, useDeletePodcast } from '../hooks/usePodcasts';
import { podcastService } from '../services';
import { AudioPlayer } from '../components/AudioPlayer';
import { useAuth } from '../contexts/AuthContext';
import type { UploadFile } from 'antd';
import type { Podcast } from '../types';

const { Dragger } = Upload;
const { TextArea } = Input;

export function PodcastsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const { data, isLoading, error } = usePodcasts();
  const createPodcast = useCreatePodcast();
  const deletePodcast = useDeletePodcast();

  const podcasts = data?.data?.podcasts || [];
  const isAdmin = user?.role === 'admin';

  const handleUpload = async (values: any) => {
    if (fileList.length === 0) {
      message.error('Please select an audio file');
      return;
    }

    const formData = new FormData();
    formData.append('audio', fileList[0].originFileObj as File);
    formData.append('titleAr', values.titleAr);
    formData.append('title', values.title);
    formData.append('speaker', values.speaker);
    
    if (values.descriptionAr) {
      formData.append('descriptionAr', values.descriptionAr);
    }
    if (values.description) {
      formData.append('description', values.description);
    }

    try {
      await createPodcast.mutateAsync(formData);
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
      title: t('audio.deletePodcast'),
      content: t('library.confirmDelete'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deletePodcast.mutateAsync(id);
          message.success(t('library.deleteSuccess'));
          if (selectedPodcast?._id === id) {
            setSelectedPodcast(null);
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
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error('File must be smaller than 100MB!');
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
        <h1>{t('audio.allPodcasts')}</h1>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            {t('audio.uploadPodcast')}
          </Button>
        )}
      </div>

      {selectedPodcast && (
        <div style={{ marginBottom: '24px' }}>
          <AudioPlayer
            src={podcastService.getStreamUrl(selectedPodcast._id)}
            title={selectedPodcast.titleAr}
            subtitle={`${selectedPodcast.speaker} - ${selectedPodcast.descriptionAr?.substring(0, 100)}`}
          />
        </div>
      )}

      {podcasts.length === 0 ? (
        <Empty description={t('audio.noPodcasts')} />
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
          dataSource={podcasts}
          renderItem={(podcast: Podcast) => (
            <List.Item>
              <Card
                hoverable
                actions={[
                  <PlayCircleOutlined
                    key="play"
                    onClick={() => setSelectedPodcast(podcast)}
                  />,
                  ...(isAdmin
                    ? [
                        <DeleteOutlined
                          key="delete"
                          onClick={() => handleDelete(podcast._id)}
                        />,
                      ]
                    : []),
                ]}
              >
                <Card.Meta
                  title={podcast.titleAr}
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Tag color="green">{podcast.speaker}</Tag>
                      <div style={{ fontSize: '12px' }}>
                        {podcast.descriptionAr?.substring(0, 80)}...
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(podcast.createdAt).toLocaleDateString('ar-SA')}
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
        title={t('audio.uploadPodcast')}
        open={isUploadModalOpen}
        onCancel={() => {
          setIsUploadModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            name="titleAr"
            label={t('audio.podcastTitle') + ' (عربي)'}
            rules={[{ required: true, message: 'الرجاء إدخال عنوان البودكاست' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="title"
            label={t('audio.podcastTitle') + ' (English)'}
            rules={[{ required: true, message: 'Please enter podcast title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="speaker"
            label={t('audio.speaker')}
            rules={[{ required: true, message: 'الرجاء إدخال اسم المتحدث' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="descriptionAr" label={t('library.bookDescription') + ' (عربي)'}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item name="description" label={t('library.bookDescription') + ' (English)'}>
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item label={t('audio.selectAudio')} required>
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag audio file to this area</p>
              <p className="ant-upload-hint">Support for MP3, WAV, and other audio formats. Maximum: 100MB</p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createPodcast.isPending} block>
              {t('audio.uploadPodcast')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
