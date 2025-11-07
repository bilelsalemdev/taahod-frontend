import { useState } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Empty,
  Row,
  Col,
  Statistic,
  Tag,
} from 'antd';
import { EditOutlined, UserOutlined, BookOutlined, TeamOutlined, AudioOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';
import { IslamicPattern, CornerOrnament } from '../components/patterns';

export function ProfilePage() {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const { data, isLoading, error } = useProfile();
  const updateProfile = useUpdateProfile();

  const profileData = data?.data;
  const user = profileData?.user;
  const stats = profileData?.stats;

  const handleUpdateProfile = async (values: any) => {
    try {
      await updateProfile.mutateAsync({
        name: values.name,
        email: values.email,
      });
      
      message.success(t('library.updateSuccess'));
      setIsEditModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  const handleChangePassword = async (values: any) => {
    if (values.newPassword !== values.confirmNewPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success(t('library.updateSuccess'));
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={(error as any)?.messageAr || (error as any)?.message || t('common.error')} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '32px',
          padding: '32px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          borderRadius: '16px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IslamicPattern type="geometric" opacity={0.1} color="#d97706" />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ color: 'white', fontFamily: "'Amiri', serif", fontSize: '32px', margin: 0 }}>
            <UserOutlined /> {t('profile.myProfile')}
          </h1>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsEditModalOpen(true)}
            size="large"
            style={{ background: 'var(--color-accent-gold)', border: 'none', color: 'white' }}
          >
            {t('profile.editProfile')}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: '12px', border: '2px solid var(--color-primary)', position: 'relative' }}>
              <CornerOrnament position="top-right" color="var(--color-accent-gold)" size={20} />
              <Statistic
                title={t('profile.totalBooksRead')}
                value={stats.totalBooksRead}
                prefix={<BookOutlined />}
                valueStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.averageProgress')}
                value={stats.totalProgress}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.activeCollaborations')}
                value={stats.activeCollaborations}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={t('profile.tasjilCount')}
                value={stats.tasjilCount}
                prefix={<AudioOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Personal Information */}
      <Card
        title={
          <span style={{ fontFamily: "'Amiri', serif", color: 'var(--color-primary)' }}>
            {t('profile.personalInfo')}
          </span>
        }
        style={{
          marginBottom: '16px',
          borderRadius: '12px',
          border: '2px solid var(--color-accent-gold)',
          position: 'relative',
        }}
      >
        <CornerOrnament position="all" color="var(--color-accent-gold)" size={25} />
        <Descriptions bordered column={1}>
          <Descriptions.Item label={t('auth.name')}>{user.name}</Descriptions.Item>
          <Descriptions.Item label={t('auth.email')}>{user.email}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
              {user.role === 'admin' ? 'Admin' : 'User'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('common.language')}>
            {user.language === 'ar' ? 'العربية' : 'English'}
          </Descriptions.Item>
        </Descriptions>
        <Button
          type="link"
          onClick={() => setIsPasswordModalOpen(true)}
          style={{ marginTop: '16px' }}
        >
          {t('profile.changePassword')}
        </Button>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        title={t('profile.editProfile')}
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={{
            name: user.name,
            email: user.email,
          }}
        >
          <Form.Item
            name="name"
            label={t('auth.name')}
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label={t('auth.email')}
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateProfile.isPending} block>
              {t('common.save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        title={t('profile.changePassword')}
        open={isPasswordModalOpen}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            label={t('profile.currentPassword')}
            rules={[{ required: true, message: 'Please enter current password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label={t('profile.newPassword')}
            rules={[
              { required: true, message: 'Please enter new password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmNewPassword"
            label={t('profile.confirmNewPassword')}
            rules={[{ required: true, message: 'Please confirm new password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateProfile.isPending} block>
              {t('common.save')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
