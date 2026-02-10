import { useState } from 'react'
import './App.css'
import BankingApp from './banking'
import Login from './Login'
import Register from './Register'

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [authMessage, setAuthMessage] = useState('');

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = () => {
    setUser(null);
    setAuthView('login');
    setAuthMessage('');
  };

  if (user) {
    return <BankingApp loggedInUser={user} onLogout={handleLogout} />;
  }

  if (authView === 'register') {
    return (
      <Register
        onRegistered={(message) => {
          setAuthMessage(message || 'Registration successful. Please log in.');
          setAuthView('login');
        }}
        onBackToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onGoToRegister={() => setAuthView('register')}
      initialMessage={authMessage}
    />
  );
}

export default App
