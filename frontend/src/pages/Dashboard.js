import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [ctc, setCtc] = useState('');
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    axios.get('http://debtlens-backend.onrender.com/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data.user))
    .catch(() => { localStorage.removeItem('token'); navigate('/login'); });
  }, [navigate]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBreakdown(null);
    setAdvice('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://debtlens-backend.onrender.com/api/salary/calculate',
        { ctc: parseFloat(ctc) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBreakdown(res.data.breakdown);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    setAdviceLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://debtlens-backend.onrender.com/api/ai/advice',
        { ctc: parseFloat(ctc), breakdown },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdvice(res.data.advice);
    } catch (err) {
      setAdvice('Sorry, could not get advice right now. Please try again.');
    } finally {
      setAdviceLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">DebtLens</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Welcome, {user.email}</span>
          <button onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto mt-10 px-4 pb-12">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Salary Breakdown Calculator</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your CTC to see your actual in-hand salary</p>

          <form onSubmit={handleCalculate} className="flex gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="Enter your CTC (e.g. 1000000 for 10 LPA)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <button type="submit" disabled={loading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* Results Card */}
        {breakdown && (
          <div className="bg-white rounded-2xl shadow p-8 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              Your Salary Breakdown for CTC: {formatINR(ctc)}
            </h3>

            {/* Monthly In-Hand Hero */}
            <div className="bg-indigo-50 rounded-xl p-6 text-center mb-6">
              <p className="text-gray-500 text-sm">Monthly In-Hand Salary</p>
              <p className="text-4xl font-bold text-indigo-600 mt-1">
                {formatINR(breakdown.monthlyInHand)}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {formatINR(breakdown.annualInHand)} per year
              </p>
            </div>

            {/* Breakdown Table */}
            <div className="space-y-3">
              {[
                { label: 'Basic Salary', value: breakdown.basicSalary, color: 'text-green-600' },
                { label: 'HRA', value: breakdown.hra, color: 'text-green-600' },
                { label: 'Special Allowance', value: breakdown.specialAllowance, color: 'text-green-600' },
                { label: 'Provident Fund (deduction)', value: breakdown.providentFund, color: 'text-red-500' },
                { label: 'Income Tax (deduction)', value: breakdown.incomeTax, color: 'text-red-500' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{item.label}</span>
                  <span className={`font-semibold text-sm ${item.color}`}>
                    {item.color.includes('red') ? '- ' : '+ '}{formatINR(item.value)}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Advice Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleGetAdvice}
                disabled={adviceLoading}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {adviceLoading ? '✨ Getting AI Advice...' : '✨ Get AI Financial Advice'}
              </button>
            </div>

            {/* AI Advice Result */}
            {advice && (
              <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-6">
                <h4 className="font-bold text-green-800 mb-4">✨ Your Personal Financial Plan</h4>
                <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {advice}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;