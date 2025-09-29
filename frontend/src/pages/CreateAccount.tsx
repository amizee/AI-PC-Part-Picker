import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api/UserApi.ts'; // Import the service
import { User } from '../types/User';
import './styling/CreateAccountPage.css'; // Import CSS

const CreateAccountPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const newUser: User = { username, email, password, firstname, lastname };

    try {
      await createUser(newUser);
      alert('Account created successfully!');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      alert('Error creating account. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="form-title">CREATE ACCOUNT</h1>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="create-account-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
          <label>Retype Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            CREATE ACCOUNT
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountPage;
