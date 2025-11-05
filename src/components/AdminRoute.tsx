import React from 'react';
import { Result, Button } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import ProtectedRoute from './ProtectedRoute';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <ProtectedRoute>
      {user?.role === 'admin' ? (
        <>{children}</>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle={t('common.error') || 'Access Denied'}
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              {t('common.back')}
            </Button>
          }
        />
      )}
    </ProtectedRoute>
  );
};

export default AdminRoute;
