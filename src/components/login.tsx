import React, { useState } from 'react';
import './login.css';

type LoginProps = {
  onLogin: (username: string, password: string) => void;
  error: string;
};

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    onLogin(username, password);
  };

  const saveLoginCredentials = () => {
    // Save the username and password to local storage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  };

  const handleCredentialInput = () => {
    // Get saved credentials from local storage
    const savedUsername = localStorage.getItem('username');
    const savedPassword = localStorage.getItem('password');

    // If saved credentials exist, fill in the input fields
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
    }
  };

  // Call handleCredentialInput when the component mounts to check for saved credentials
  React.useEffect(() => {
    handleCredentialInput();
  }, []);

  return (
    <div className='login-container'>
      <div>
        <div className='login-wrapper'>
          <h2>Login</h2>
          <div className='login-item'>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='login-item'>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='login-item'>
            <button onClick={() => { handleLogin(); saveLoginCredentials(); }}>Login</button>
          </div>
        </div>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
