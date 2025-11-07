import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  BookOutlined,
  CalendarOutlined,
  AudioOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  BarChartOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAnimation } from '../hooks/useAnimation';
import { IslamicPattern } from './patterns';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

export function MainLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { shouldAnimate, getDuration } = useAnimation();
  const [collapsed, setCollapsed] = useState(false);


  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: t('nav.home'),
      onClick: () => navigate('/'),
    },
    {
      key: '/subjects',
      icon: <BookOutlined />,
      label: t('nav.subjects'),
      onClick: () => navigate('/subjects'),
    },
    {
      key: '/books',
      icon: <ReadOutlined />,
      label: t('nav.books'),
      onClick: () => navigate('/books'),
    },
    {
      key: '/schedule',
      icon: <CalendarOutlined />,
      label: t('nav.schedule'),
      onClick: () => navigate('/schedule'),
    },
    {
      key: 'audio',
      icon: <AudioOutlined />,
      label: 'Audio',
      children: [
        {
          key: '/tasjil',
          icon: <SoundOutlined />,
          label: t('nav.tasjil'),
          onClick: () => navigate('/tasjil'),
        },
        {
          key: '/podcasts',
          icon: <AudioOutlined />,
          label: t('nav.podcasts'),
          onClick: () => navigate('/podcasts'),
        },
      ],
    },
    {
      key: '/adhkar',
      icon: <ReadOutlined />,
      label: t('nav.adhkar'),
      onClick: () => navigate('/adhkar'),
    },
    {
      key: '/collaborations',
      icon: <TeamOutlined />,
      label: t('nav.collaborations'),
      onClick: () => navigate('/collaborations'),
    },
    {
      key: '/progress',
      icon: <BarChartOutlined />,
      label: t('profile.progressDashboard'),
      onClick: () => navigate('/progress'),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile'),
      onClick: () => navigate('/profile'),
    },
    {
      key: 'language',
      label: language === 'ar' ? 'English' : 'العربية',
      onClick: () => changeLanguage(language === 'ar' ? 'en' : 'ar'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('auth.logout'),
      danger: true,
      onClick: logout,
    },
  ];

  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/subjects')) return '/subjects';
    if (path.startsWith('/books')) return '/books';
    if (path.startsWith('/schedule')) return '/schedule';
    if (path.startsWith('/tasjil')) return '/tasjil';
    if (path.startsWith('/podcasts')) return '/podcasts';
    if (path.startsWith('/adhkar')) return '/adhkar';
    if (path.startsWith('/collaborations')) return '/collaborations';
    if (path.startsWith('/progress')) return '/progress';
    if (path.startsWith('/profile')) return 'profile';
    return '/';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--color-bg-beige)' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(true);
        }}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #047857 0%, #065f46 100%)',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          transition: `width ${getDuration(300)}ms var(--ease-in-out)`,
        }}
      >
        <motion.div
          animate={{
            scale: collapsed ? 0.9 : 1,
            opacity: collapsed ? 0.8 : 1,
          }}
          transition={{
            duration: getDuration(300) / 1000,
          }}
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: collapsed ? '18px' : '24px',
            fontWeight: 'bold',
            padding: '0 16px',
            fontFamily: "'Amiri', serif",
            borderBottom: '2px solid rgba(217, 119, 6, 0.3)',
            position: 'relative',
          }}
        >
          <IslamicPattern type="geometric" opacity={0.1} color="#d97706" />
          <AnimatePresence mode="wait">
            <motion.span
              key={collapsed ? 'collapsed' : 'expanded'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: getDuration(200) / 1000 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              {collapsed ? 'تعاهد' : t('app.name')}
            </motion.span>
          </AnimatePresence>
        </motion.div>
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
          }}
          theme="dark"
        />
      </Sider>
      <Layout style={{ marginRight: collapsed ? 80 : 200, transition: 'margin-right 0.2s' }}>
        <Header
          style={{
            padding: '0',
            background: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <IslamicPattern type="arabesque" opacity={0.08} color="#ffffff" />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: getDuration(200) / 1000 }}
            style={{
              position: 'absolute',
              right: collapsed ? '60px' : '180px',
              transition: 'right 0.3s ease',
              zIndex: 10,
            }}
          >
            <Button
              type="text"
              icon={
                <motion.div
                  animate={{ rotate: collapsed ? 180 : 0 }}
                  transition={{ duration: getDuration(300) / 1000 }}
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </motion.div>
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 48,
                height: 48,
                color: 'white',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            />
          </motion.div>
          <div style={{ flex: 1 }} />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft">
            <div
              style={{
                cursor: 'pointer',
                position: 'relative',
                zIndex: 1,
                padding: '0 24px',
              }}
            >
              <Space size="middle">
                <span style={{ color: 'white', fontWeight: 500 }}>
                  {user?.name}
                </span>
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#d97706',
                    border: '2px solid white',
                  }}
                >
                  {user?.name[0]}
                </Avatar>
              </Space>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <motion.div
            key={location.pathname}
            initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: getDuration(300) / 1000,
              ease: 'easeInOut',
            }}
          >
            <Outlet />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}
