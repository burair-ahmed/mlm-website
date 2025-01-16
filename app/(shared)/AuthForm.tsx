'use client';

import { useState } from 'react';

const AuthForm = ({ type }: { type: 'register' | 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = type === 'register' ? '/api/auth/register' : '/api/auth/login';
  
    const body = type === 'register'
      ? JSON.stringify({ name, email, password, referralCode })
      : JSON.stringify({ email, password });
  
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
  
    const data = await res.json();
    console.log('Response Data:', data);  // Log the response to check if the token is present
  
    if (res.ok) {
      setMessage(data.message);
  
      // Redirect to dashboard on successful login
      if (type === 'login') {
        setMessage(data.message || 'Login Successful');
      }
    } else {
      setMessage(data.message || 'An error occurred. Please try again.');
    }
  };
  

  return (
    <div>
      <h1>{type === 'register' ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        {type === 'register' && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Referral Code (Optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{type === 'register' ? 'Sign Up' : 'Log In'}</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AuthForm;
