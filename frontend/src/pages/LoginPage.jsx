import React, { useEffect } from 'react';
import Login from '../components/Login/Login';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]); // Include isAuthenticated to ensure re-checking if it changes

  return (
    <div>
      <Login />
    </div>
  );
};

export default LoginPage;
