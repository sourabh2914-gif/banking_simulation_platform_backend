import { useState, useEffect } from 'react';

const BASE_URL = "http://localhost:8080";

export default function BankingApp({ loggedInUser, onLogout, initialView, onBackToLogin }) {
  const [activeView, setActiveView] = useState(initialView || 'create');
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    balance: ''
  });
  const [transactionData, setTransactionData] = useState({
    accNo: '',
    amount: '',
    fromAcc: '',
    toAcc: ''
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [viewAccountNumber, setViewAccountNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllAccounts();
  }, []);

  const fetchAllAccounts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/accounts/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      // Ensure data is an array
      if (Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.warn('Expected array but got:', data);
        setAccounts([]);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setMessage('Error loading accounts. Make sure your backend is running on port 8080.');
      setAccounts([]);
    }
  };

  const handleCreateAccount = async () => {
    if (!formData.name || !formData.email || !formData.balance) {
      setMessage('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/accounts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          balance: parseFloat(formData.balance)
        })
      });
      
      const data = await response.json();
      setMessage(`Account created successfully! Account Number: ${data.accountNumber}`);
      setFormData({ name: '', email: '', balance: '' });
      fetchAllAccounts();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!transactionData.accNo || !transactionData.amount) {
      setMessage('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/transactions/deposite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accNo: transactionData.accNo,
          amount: parseFloat(transactionData.amount)
        })
      });
      
      const result = await response.text();
      setMessage(result);
      setTransactionData({ ...transactionData, accNo: '', amount: '' });
      fetchAllAccounts();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!transactionData.accNo || !transactionData.amount) {
      setMessage('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/transactions/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accNo: transactionData.accNo,
          amount: parseFloat(transactionData.amount)
        })
      });
      
      const result = await response.text();
      setMessage(result);
      setTransactionData({ ...transactionData, accNo: '', amount: '' });
      fetchAllAccounts();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transactionData.fromAcc || !transactionData.toAcc || !transactionData.amount) {
      setMessage('Please fill all fields');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/transactions/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fromAcc: transactionData.fromAcc,
          toAcc: transactionData.toAcc,
          amount: parseFloat(transactionData.amount)
        })
      });
      
      const result = await response.text();
      setMessage(result);
      setTransactionData({ ...transactionData, fromAcc: '', toAcc: '', amount: '' });
      fetchAllAccounts();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAccount = async () => {
    if (!viewAccountNumber) {
      setMessage('Please enter an account number');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/accounts/${viewAccountNumber}`);
      if (!response.ok) {
        throw new Error(`Account not found. Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      if (data && typeof data === 'object' && data.accountNumber) {
        setSelectedAccount(data);
        setMessage('');
      } else {
        throw new Error('Invalid account data received');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setSelectedAccount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="app-header p-6 rounded-t-2xl shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Welcome to our Banking Application</h1>
            <div className="flex items-center gap-4">
              {loggedInUser ? (
                <>
                  <div className="text-sm">Signed in as <strong>{loggedInUser.holderName || loggedInUser.name || loggedInUser.email}</strong></div>
                  <button
                    onClick={onLogout}
                    className="btn btn-logout rounded-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-sm italic">Not signed in</div>
                  {onBackToLogin && (
                    <button onClick={onBackToLogin} className="btn btn-ghost rounded-full">
                      Back to Login
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white shadow-md p-4 flex flex-wrap gap-3 border-b-2 border-gray-200">
          {['create', 'deposit', 'withdraw', 'transfer', 'view', 'viewAll'].map((view) => (
            <button
              key={view}
              onClick={() => {
                setActiveView(view);
                setMessage('');
                setSelectedAccount(null);
              }}
              className={`nav-btn ${activeView === view ? 'active' : ''}`}
            >
              {view === 'create' && 'Create Account'}
              {view === 'deposit' && 'Deposit'}
              {view === 'withdraw' && 'Withdraw'}
              {view === 'transfer' && 'Transfer'}
              {view === 'view' && 'View Account'}
              {view === 'viewAll' && 'View All Account'}
            </button>
          ))}
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 ${message.includes('success') || message.includes('Successfully') || message.includes('Account Number') || message.includes('deposited') || message.includes('withdraw') || message.includes('Transfer') ? 'message-success' : 'message-error'}`}>
            <div>{message}</div>
            {message}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mt-4 p-4 loading-box flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-3"></div>
            Processing...
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white p-8 rounded-b-2xl shadow-lg min-h-96">
          {/* Create Account */}
          {activeView === 'create' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h2>
              <div className="space-y-5 max-w-md">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Initial Balance"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="input w-full"
                />
                <button
                  onClick={handleCreateAccount}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Creating...' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          {/* Deposit */}
          {activeView === 'deposit' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Deposit Money</h2>
              <div className="space-y-5 max-w-md">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={transactionData.accNo}
                  onChange={(e) => setTransactionData({ ...transactionData, accNo: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleDeposit}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </div>
          )}

          {/* Withdraw */}
          {activeView === 'withdraw' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Withdraw Money</h2>
              <div className="space-y-5 max-w-md">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={transactionData.accNo}
                  onChange={(e) => setTransactionData({ ...transactionData, accNo: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          )}

          {/* Transfer */}
          {activeView === 'transfer' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Transfer Money</h2>
              <div className="space-y-5 max-w-md">
                <input
                  type="text"
                  placeholder="From Account Number"
                  value={transactionData.fromAcc}
                  onChange={(e) => setTransactionData({ ...transactionData, fromAcc: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="text"
                  placeholder="To Account Number"
                  value={transactionData.toAcc}
                  onChange={(e) => setTransactionData({ ...transactionData, toAcc: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={transactionData.amount}
                  onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button
                  onClick={handleTransfer}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Processing...' : 'Transfer'}
                </button>
              </div>
            </div>
          )}

          {/* View Account */}
          {activeView === 'view' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">View Account Details</h2>
              <div className="max-w-md mb-6">
                <input
                  type="text"
                  placeholder="Enter Account Number"
                  value={viewAccountNumber}
                  onChange={(e) => setViewAccountNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && viewAccountNumber) {
                      handleViewAccount();
                    }
                  }}
                  className="w-full px-6 py-4 border-2 border-yellow-400 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
                />
                <button
                  onClick={handleViewAccount}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Loading...' : 'View Account'}
                </button>
              </div>
              {selectedAccount && (
                <div className="card max-w-2xl">
                  <h3 className="text-2xl font-bold mb-4">Account Information</h3>
                  <div className="space-y-2 text-lg">
                    <p><strong>Account Number:</strong> {selectedAccount.accountNumber}</p>
                    <p><strong>Name:</strong> {selectedAccount.holderName}</p>
                    <p><strong>Email:</strong> {selectedAccount.email}</p>
                    <p><strong>Balance:</strong> Rs.{selectedAccount.balance?.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View All Accounts */}
          {activeView === 'viewAll' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">All Accounts</h2>
                <button
                  onClick={fetchAllAccounts}
                  disabled={loading}
                  className="btn btn-accent"
                >
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {accounts.length === 0 ? (
                <p className="text-gray-500 text-lg">No accounts found. Create an account to get started!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.map(acc => (
                    <div key={acc.accountNumber} className="card">
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{acc.name}</h3>
                      <p className="text-gray-700 mb-2">{acc.email}</p>
                      <p className="text-3xl font-bold text-gray-900">${acc.balance?.toFixed(2)}</p>
                      <p className="text-sm text-gray-600 mt-2">Account #: {acc.accountNumber}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
