'use client';

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You are not logged in. Please log in to access your dashboard.');
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/referrals/stats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorMessage = await res.text();
          throw new Error(errorMessage || 'Failed to fetch referral stats.');
        }

        const data = await res.json();
        setStats(data); // Set the stats received from the server
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Copy referral code to clipboard
  const handleCopyReferralCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      alert('Referral Code Copied to Clipboard!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Referral Dashboard</h1>

      {/* Referral Code Section */}
      <div style={{ marginBottom: '20px' }}>
        <p>Your Referral Code: <strong>{stats.referralCode}</strong></p>
        <button
          onClick={handleCopyReferralCode}
          style={{
            padding: '8px 12px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Copy Referral Code
        </button>
      </div>

      {/* Referral Stats Section */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Your Stats</h2>
        <p><strong>Total Referrals:</strong> {stats.referralsCount}</p>
      </div>

      {/* Referred Users Section */}
      <div>
        <h2>Referred Users</h2>
        {stats.referredUsers.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {stats.referredUsers.map((user: any, index: number) => (
              <li
                key={index}
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Joined:</strong> {new Date(user.joined).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No referrals yet. Share your referral code to get started!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
