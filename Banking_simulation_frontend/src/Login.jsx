import { useEffect, useState } from 'react';
import { loadUsers } from './authStorage';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function Login({ onLogin, onGoToRegister, initialMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    if (!message) return;
    if (!message.includes('successful')) return;
    if (pinned) return;

    const timer = setTimeout(() => setMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [message, pinned]);

  const handleLogin = async () => {
    if (!email) {
      setMessage('Please enter your email');
      return;
    }
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address');
      return;
    }
    if (!password) {
      setMessage('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const users = loadUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        setMessage('No account found. Please register first.');
        return;
      }
      if (user.password !== password) {
        setMessage('Incorrect password');
        return;
      }

      setMessage('Login successful');
      onLogin({ role: 'user', email: user.email, name: user.name });
    } catch (err) {
      console.error(err);
      setMessage('Error during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Login</h2>
        <p className="text-sm text-gray-500 mb-6">Welcome back. Please sign in with your user account.</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
          />
          <div className="text-xs text-gray-500">
            Passwords are case-sensitive.
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {message && (
            <div className={`${message.includes('successful') ? 'message-success' : 'message-error'}`}>
              <div className="flex items-start justify-between gap-3">
                <span>{message}</span>
                <div className="flex items-center gap-3">
                  {message.includes('successful') && (
                    <button
                      type="button"
                      onClick={() => setPinned((prev) => !prev)}
                      className="text-sm underline"
                    >
                      {pinned ? 'Unpin' : 'Pin'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('');
                      setPinned(false);
                    }}
                    className="text-sm underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-500 mt-3">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={onGoToRegister}
              className="ml-2 underline text-gray-800"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
