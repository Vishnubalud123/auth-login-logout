import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function Dashboard() {
  const { currentUser, setCurrentUser } = useAuth();
  const [serverResponse, setServerResponse] = useState('');

  const handleLogout = async () => {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    setCurrentUser(null);
  };

  const testProtected = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, { withCredentials: true });
      setServerResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setServerResponse(JSON.stringify(err.response?.data || { error: 'Failed' }, null, 2));
    }
  };

  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <div className='dashboard-content'>
        <h3>Welcome, {currentUser?.email}!</h3>
        <div className='user-info'>
          <p><strong>User ID:</strong> {currentUser?.id}</p>
          <p><strong>Email:</strong> {currentUser?.email}</p>
        </div>
        <div style={{ marginTop: 30 }}>
          <h3>Test Protected Route</h3>
          <button onClick={testProtected} style={{ width: 'auto', marginTop: 10 }}>Test Protected Route</button>
          {serverResponse && <div className='server-response'><strong>Server Response:</strong><div>{serverResponse}</div></div>}
        </div>
      </div>
    </div>
  );
}
