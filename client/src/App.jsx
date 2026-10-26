import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, TrendingUp, TrendingDown, Trash2, PlusCircle, LogOut } from 'lucide-react';
import AuthForm from './components/AuthForm';

const API_URL = 'http://localhost:5000/api/transactions';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthConfig());
      setTransactions(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      if (err.response?.status === 401) handleLogout();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setTransactions([]);
    localStorage.removeItem('user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      const res = await axios.post(
        API_URL,
        {
          title,
          amount: parseFloat(amount),
          type,
          category,
        },
        getAuthConfig()
      );

      setTransactions([res.data.data, ...transactions]);
      setTitle('');
      setAmount('');
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="text-indigo-400" size={28} />
            <h1 className="text-xl font-bold tracking-wide">Expense Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">
              Welcome, <strong className="text-indigo-400">{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl shadow-lg">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Balance</p>
            <p className={`text-2xl font-bold mt-2 ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Income</p>
              <p className="text-xl font-bold text-emerald-400 mt-2">
                +₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expense</p>
              <p className="text-xl font-bold text-rose-400 mt-2">
                -₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-full text-rose-400">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 p-5 rounded-xl h-fit shadow-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlusCircle size={20} className="text-indigo-400" />
              Add Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Salary, Grocery..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Food">Food</option>
                    <option value="Salary">Salary</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition text-sm shadow-md"
              >
                Save Transaction
              </button>
            </form>
          </div>

          <div className="md:col-span-3 bg-slate-800/80 border border-slate-700 p-5 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            
            {loading ? (
              <p className="text-center text-slate-500 py-6">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-slate-500 py-6">No transactions found.</p>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {transactions.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 hover:border-slate-600 transition"
                  >
                    <div>
                      <p className="font-medium text-sm text-slate-200">{t.title}</p>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">
                        {t.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-semibold text-sm ${
                          t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}