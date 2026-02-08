import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({ onAuth, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return false;
    }
    if (password.trim().length < 6) {
      alert('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      onAuth(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={isLoading}>Submit</button>
      {error && <p>{error}</p>}
    </form>
  );
};

AuthForm.propTypes = {
  onAuth: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

export default AuthForm;