import React, { useEffect } from 'react';

import AdminLogin from '../components/Admin/AdminLogin';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { admin, isAdmin, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isAdmin === true) {
      navigate(`/admin/${admin._id}`);
    }
  }, [isLoading, isAdmin, navigate, admin]);

  return (
    <div>
      <AdminLogin />
    </div>
  );
};

export default AdminLoginPage;
