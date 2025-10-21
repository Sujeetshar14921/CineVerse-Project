import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const backendURL = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/admin/login`, { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        navigate('/admin-dashboard');
      } else {
        setError('Invalid login response');
      }
    } catch (err) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
      <form onSubmit={handleSubmit} className="w-80">
        <input type="email" placeholder="Email" className="border p-2 rounded w-full mb-3"
               value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="border p-2 rounded w-full mb-3"
               value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button type="submit" className="bg-green-600 text-white py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}
