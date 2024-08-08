import React from 'react';
import { useLogout } from '../../hooks/auth.hook'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { mutate: logout, isLoading, isError, isSuccess } = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to the login page or home page after successful logout
      navigate('/login'); // Change '/login' to the path where you want to redirect
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle error
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`btn ${isLoading ? 'btn-disabled' : ''}`}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
