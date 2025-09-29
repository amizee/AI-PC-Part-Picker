import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './styling/LoginPage.css';
import axios from 'axios';
import Button from '../components/Button';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const {setUserId } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/users/login', {
            username,
            password,
        });

        if (response.status === 200) {
            const token = parseInt(response.data, 10);
            setUserId(token); // Set the token in the context
            navigate('/search-parts'); // Redirect to search part
        }
    } catch (error) {
        alert('Invalid username or password');
    }
};


  return (
    <div className="flex flex-col items-center gap-4">
        <h2>PC Parts Picker</h2>
      <h1>Login</h1>
      <form className='flex flex-col gap-4' onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          className='p-4 border w-98 border-gray-300 rounded-md'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className='p-4 border border-gray-300 rounded-md'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="">
          Login
        </Button>
        <Button
        type="button"
        className="w-full"
        onClick={() => navigate('/create-account')}
      >
        Create Account
      </Button>
      </form>
    </div>
  );
};

export default LoginPage;
