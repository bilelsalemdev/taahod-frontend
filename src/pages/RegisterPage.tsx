import React, { useState } from 'react';
import { Form, Card, Typography, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CornerOrnament } from '../components/patterns';
import { AnimatedBackground } from '../components/animated/AnimatedBackground';
import { AnimatedContainer } from '../components/animated/AnimatedContainer';
import { RippleButton } from '../components/animated/RippleButton';
import { AnimatedInput, AnimatedPasswordInput } from '../components/animated/AnimatedInput';
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
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <AnimatedBackground
        patternType="arabesque"
        patternColor="#d97706"
        patternOpacity={0.1}
        enableParallax
        enableRotation
        gradient="linear-gradient(135deg, #047857 0%, #065f46 100%)"
      />

      <AnimatedContainer animation="scale" duration={600} delay={0}>
        <motion.div
          whileHover={{
            y: -4,
            boxShadow: '0 24px 70px rgba(0,0,0,0.4)',
          }}
          transition={{ duration: 0.3 }}
        >
          <Card
            style={{
              width: '100%',
              maxWidth: 400,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              borderRadius: '16px',
              border: '2px solid rgba(217, 119, 6, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            {[0, 1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.1,
                  duration: 0.4,
                  type: 'spring',
                }}
              >
                <CornerOrnament
                  position={
                    ['top-left', 'top-right', 'bottom-right', 'bottom-left'][
                      index
                    ] as any
                  }
                  color="#d97706"
                  size={30}
                />
              </motion.div>
            ))}
            <div
              style={{
                textAlign: 'center',
                marginBottom: 32,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Title
                  level={2}
                  style={{
                    marginBottom: 8,
                    fontFamily: "'Amiri', serif",
                    color: '#047857',
                  }}
                >
                  {t('app.name')}
                </Title>
              </motion.div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{
                  height: '2px',
                  width: '60px',
                  background:
                    'linear-gradient(90deg, transparent, #d97706, transparent)',
                  margin: '16px auto',
                }}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  {t('auth.register')}
                </Text>
              </motion.div>
            </div>

            <Form
              name="register"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
              initialValues={{ language: 'ar' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
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
                  <AnimatedInput
                    prefix={<UserOutlined />}
                    placeholder={t('auth.name')}
                    autoComplete="name"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
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
                  <AnimatedInput
                    prefix={<MailOutlined />}
                    placeholder={t('auth.email')}
                    autoComplete="email"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
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
                  <AnimatedPasswordInput
                    prefix={<LockOutlined />}
                    placeholder={t('auth.password')}
                    autoComplete="new-password"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
              >
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
                        return Promise.reject(
                          new Error(t('auth.confirmPassword'))
                        );
                      },
                    }),
                  ]}
                >
                  <AnimatedPasswordInput
                    prefix={<LockOutlined />}
                    placeholder={t('auth.confirmPassword')}
                    autoComplete="new-password"
                  />
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <Form.Item
                  name="language"
                  label={t('common.language') || 'Language'}
                >
                  <Select>
                    <Option value="ar">العربية</Option>
                    <Option value="en">English</Option>
                  </Select>
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <Form.Item>
                  <RippleButton
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                  >
                    {t('auth.register')}
                  </RippleButton>
                </Form.Item>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                style={{ textAlign: 'center' }}
              >
                <Text type="secondary">{t('auth.alreadyHaveAccount')} </Text>
                <Link to="/login">{t('auth.login')}</Link>
              </motion.div>
            </Form>
          </Card>
        </motion.div>
      </AnimatedContainer>
    </div>
  );
};

export default RegisterPage;
