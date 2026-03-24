import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const usernameRef = useRef();
  const passwordRef = useRef();
  const roleRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/admin/register',
        {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
          role: roleRef.current.value,
        },
        config
      );

      setMessage(`Successfully registered ${data.role}: ${data.username}`);
      usernameRef.current.value = '';
      passwordRef.current.value = '';
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Register new Faculty or Students below.</p>

      {message && <div style={{ padding: '10px', backgroundColor: '#e2e3e5', marginBottom: '15px' }}>{message}</div>}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '15px' }}>
        <div>
          <label>Username</label><br />
          <input type="text" ref={usernameRef} required style={{ width: '100%', padding: '5px' }} />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" ref={passwordRef} required style={{ width: '100%', padding: '5px' }} />
        </div>
        <div>
          <label>Role</label><br />
          <select ref={roleRef} required style={{ width: '100%', padding: '5px' }}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>
        <button type="submit" style={{ padding: '10px', backgroundColor: '#8B4513', color: 'white', border: 'none', cursor: 'pointer' }}>
          Register User
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
