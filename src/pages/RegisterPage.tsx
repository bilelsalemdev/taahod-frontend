import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterData } from '../types/auth';

const { Title, Text } = Typography;
const { Option } = Select;

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterData & { confirmPassword: string }) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        password: values.password,
        name: values.name,
        language: values.language || 'ar',
      });
      navigate('/');
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            {t('app.name')}
          </Title>
          <Text type="secondary">{t('auth.register')}</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
          initialValues={{ language: 'ar' }}
        >
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: t('auth.name'),
              },
              {
                min: 2,
                message: t('auth.name'),
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={t('auth.name')}
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: t('auth.email'),
              },
              {
                type: 'email',
                message: t('auth.email'),
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder={t('auth.email')}
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: t('auth.password'),
              },
              {
                min: 6,
                message: t('auth.password'),
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.password')}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: t('auth.confirmPassword'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('auth.confirmPassword')));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t('auth.confirmPassword')}
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item name="language" label={t('common.language') || 'Language'}>
            <Select>
              <Option value="ar">العربية</Option>
              <Option value="en">English</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {t('auth.register')}
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">{t('auth.alreadyHaveAccount')} </Text>
            <Link to="/login">{t('auth.login')}</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
