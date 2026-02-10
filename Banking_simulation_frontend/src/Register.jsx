import { useState } from 'react';
import { loadUsers, saveUsers } from './authStorage';

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isStrongPassword = (value) =>
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value);

export default function Register({ onRegistered, onBackToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordIsStrong = isStrongPassword(password);

  const handleRegister = async () => {
    if (!name.trim()) {
      setMessage('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setMessage('Please enter your email');
      return;
    }
    if (!isValidEmail(email)) {
      setMessage('Please enter a valid email address');
      return;
    }
    if (!password) {
      setMessage('Please enter a password');
      return;
    }
    if (!isStrongPassword(password)) {
      setMessage('Password must be at least 8 characters and include upper, lower, and a number');
      return;
    }
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const users = loadUsers();
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setMessage('This email is already registered. Please log in.');
        return;
      }

      users.push({
        name: name.trim(),
        email: email.trim(),
        password
      });
      saveUsers(users);

      setMessage('Registration successful. Please log in.');
      setName('');
      setEmail('');
      setPassword('');
      setConfirm('');
      if (onRegistered) onRegistered('Registration successful. Please log in.');
    } catch (err) {
      console.error(err);
      setMessage('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Account</h2>
        <p className="text-sm text-gray-500 mb-6">Register to access the banking portal.</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input w-full"
          />

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
          <div className={`text-xs ${password && !passwordIsStrong ? 'text-red-600' : 'text-gray-500'}`}>
            {password && !passwordIsStrong
              ? 'Password must be at least 8 characters and include upper, lower, and a number.'
              : 'Use at least 8 characters with upper, lower, and a number.'}
          </div>

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input w-full"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>

          {message && (
            <div className={`${message.includes('successful') ? 'message-success' : 'message-error'}`}>{message}</div>
          )}

          <div className="text-center text-sm text-gray-500 mt-3">
            <span>Already have an account?</span>
            <button
              type="button"
              onClick={onBackToLogin}
              className="ml-2 underline text-gray-800"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
