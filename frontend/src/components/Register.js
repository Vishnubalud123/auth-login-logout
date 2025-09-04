import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password !== confirmPassword) return setError('Passwords do not match');
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, password }, { withCredentials: true });
      setCurrentUser(res.data.user);
      setSuccess('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>Sign Up</h2>
        {error && <div className='error-message'>{error}</div>}
        {success && <div className='success-message'>{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Confirm Password</label>
            <input type='password' value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} required />
          </div>
          <button type='submit'>Create Account</button>
        </form>
        <div className='auth-link'>Have an account? <a href='#' onClick={()=>window.showLogin()}>Log In</a></div>
      </div>
    </div>
  );
}
