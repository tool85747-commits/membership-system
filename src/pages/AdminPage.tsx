import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminConsole } from '../components/admin/AdminConsole';

export const AdminPage: React.FC = () => {
  const { setIsAdmin } = useApp();

  useEffect(() => {
    setIsAdmin(true);
    return () => setIsAdmin(false);
  }, [setIsAdmin]);

  return <AdminConsole />;
};