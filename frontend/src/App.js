import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Instructions from './components/Instructions';
import API_URL from './config/api';
import './App.css';

function App() {
  const [view, setView] = useState('instructions');
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    window.showLogin = () => setView('login');
    window.showRegister = () => setView('register');

    axios.get(`${API_URL}/auth/user`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, [setCurrentUser]);

  return (
    <div>
      <header style={{ background: '#2c3e50', color: 'white', padding: 20, textAlign: 'center' }}>
        <h1>React.js & Node.js Authentication System</h1>
        <p>Complete login and logout flow with session management</p>
      </header>
      <div className='container'>
        <Instructions />
        <div style={{ flex: 2 }}>
          {!currentUser && view === 'login' && <Login />}
          {!currentUser && view === 'register' && <Register />}
          {currentUser && <Dashboard />}
        </div>
      </div>
    </div>
  );
}

export default App;
