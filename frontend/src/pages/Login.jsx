import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/reset-password', {
        username,
        newPassword
      });
      alert('Password reset successfully! You can now log in.');
      setIsResetting(false);
      setPassword('');
      setNewPassword('');
    } catch (error) {
      alert('Reset failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Campus Portal</h2>
        
        {!isResetting ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
            <p style={{ marginTop: '15px', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsResetting(true)}>
              Forgot Password?
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <h3>Reset Password</h3>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="login-btn">Reset Password</button>
            <p style={{ marginTop: '15px', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsResetting(false)}>
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
