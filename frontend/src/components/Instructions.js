import React from 'react';

export default function Instructions() {
  return (
    <div className='instructions'>
      <h2>Authentication System</h2>
      <p>This demo shows registration, login, session cookies and a protected dashboard.</p>
      <button onClick={() => window.showLogin()}>Login</button>
      <button onClick={() => window.showRegister()}>Register</button>
    </div>
  );
}
