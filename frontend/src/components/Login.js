import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config/api';

export default function Login() {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
      setCurrentUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>Log In</h2>
        {error && <div className='error-message'>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type='submit'>Log In</button>
        </form>
        <div className='auth-link'>Don't have an account? <a href='#' onClick={()=>window.showRegister()}>Sign Up</a></div>
      </div>
    </div>
  );
}
