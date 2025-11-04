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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

export function MainLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { language, changeLanguage } = useLanguage();
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
    <Layout style={{ minHeight: '100vh' }}>
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
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: collapsed ? '16px' : '20px',
            fontWeight: 'bold',
            padding: '0 16px',
          }}
        >
          {collapsed ? 'تعاهد' : t('app.name')}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
                {user?.name[0]}
              </Avatar>
              <span>{user?.name}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: '8px',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
