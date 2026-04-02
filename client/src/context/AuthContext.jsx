import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api/auth'; // Ensure backend is running on 5000

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // We'll also store full user data in localStorage to simulate state persistence
        const userData = JSON.parse(localStorage.getItem('user'));
        
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser(userData);
        }
      } catch (err) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);

      if (data.needsPasswordChange) {
        navigate('/change-password');
      } else {
        navigate(`/${data.role}-dashboard`);
      }
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, { name, email, password });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ ...data, needsPasswordChange: false }));
      setUser({ ...data, needsPasswordChange: false });

      navigate('/client-dashboard');
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const changePassword = async (newPassword) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/change-password`, { newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedUser = { ...user, needsPasswordChange: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate(`/${user.role}-dashboard`);
    } catch (error) {
      throw error.response?.data?.message || 'Password change failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
