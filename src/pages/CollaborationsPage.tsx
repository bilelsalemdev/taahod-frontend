import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Empty,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  List,
  Tag,
  Avatar,
  Space,
} from 'antd';
import { PlusOutlined, TeamOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  useCollaborations,
  useCreateCollaboration,
  useLeaveCollaboration,
} from '../hooks/useCollaborations';
import { useBooks } from '../hooks/useBooks';
import type { Collaboration, Book } from '../types';

export function CollaborationsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useCollaborations();
  const { data: booksData } = useBooks();
  const createCollaboration = useCreateCollaboration();
  const leaveCollaboration = useLeaveCollaboration();

  const collaborations = data?.data?.collaborations || [];
  const books = booksData?.data?.books || [];

  const handleCreate = async (values: any) => {
    try {
      await createCollaboration.mutateAsync({
        name: values.name,
        bookId: values.bookId,
        targetCompletionDate: values.targetDate
          ? dayjs(values.targetDate).toISOString()
          : undefined,
      });
      message.success(t('collaboration.createSuccess'));
      setIsCreateModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  const handleLeave = async (id: string) => {
    Modal.confirm({
      title: t('collaboration.leaveCollaboration'),
      content: t('library.confirmDelete'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await leaveCollaboration.mutateAsync(id);
          message.success(t('collaboration.leaveSuccess'));
        } catch (error: any) {
          message.error(error.messageAr || error.message || t('common.error'));
        }
      },
    });
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>
          <TeamOutlined /> {t('collaboration.myCollaborations')}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          {t('collaboration.createCollaboration')}
        </Button>
      </div>

      {collaborations.length === 0 ? (
        <Empty description={t('collaboration.noCollaborations')}>
          <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
            {t('collaboration.createFirst')}
          </Button>
        </Empty>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2 }}
          dataSource={collaborations}
          renderItem={(collab: Collaboration) => {
            const book = collab.bookId as Book;
            const isActive = collab.isActive;

            return (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => navigate(`/collaborations/${collab._id}`)}
                  actions={[
                    <Button
                      type="link"
                      key="view"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/collaborations/${collab._id}`);
                      }}
                    >
                      {t('collaboration.viewProgress')}
                    </Button>,
                    <Button
                      type="link"
                      danger
                      key="leave"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeave(collab._id);
                      }}
                    >
                      {t('collaboration.leaveCollaboration')}
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    avatar={<TeamOutlined style={{ fontSize: '32px', color: '#1890ff' }} />}
                    title={collab.name}
                    description={
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <BookOutlined /> {book.titleAr}
                        </div>
                        <div>
                          <Tag color={isActive ? 'green' : 'default'}>
                            {isActive ? 'نشط' : 'غير نشط'}
                          </Tag>
                          <Tag color="blue">
                            {collab.participants.length} {t('collaboration.participants')}
                          </Tag>
                        </div>
                        {collab.targetCompletionDate && (
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            {t('collaboration.targetDate')}:{' '}
                            {new Date(collab.targetCompletionDate).toLocaleDateString('ar-SA')}
                          </div>
                        )}
                        <div style={{ marginTop: '8px' }}>
                          <Avatar.Group maxCount={5}>
                            {collab.participants.map((participant) => (
                              <Avatar
                                key={participant._id}
                                icon={<UserOutlined />}
                                style={{ backgroundColor: '#87d068' }}
                              >
                                {participant.name[0]}
                              </Avatar>
                            ))}
                          </Avatar.Group>
                        </div>
                      </Space>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      )}

      <Modal
        title={t('collaboration.createCollaboration')}
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="name"
            label={t('collaboration.collaborationName')}
            rules={[{ required: true, message: 'الرجاء إدخال اسم التعاون' }]}
          >
            <Input placeholder="مثال: مجموعة قراءة صحيح البخاري" />
          </Form.Item>

          <Form.Item
            name="bookId"
            label={t('collaboration.selectBook')}
            rules={[{ required: true, message: 'الرجاء اختيار كتاب' }]}
          >
            <Select
              placeholder={t('collaboration.selectBook')}
              showSearch
              optionFilterProp="children"
            >
              {books.map((book: Book) => (
                <Select.Option key={book._id} value={book._id}>
                  {book.titleAr}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="targetDate" label={t('collaboration.targetDate')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createCollaboration.isPending}
              block
            >
              {t('collaboration.createCollaboration')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
