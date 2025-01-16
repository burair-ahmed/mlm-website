'use client';

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        return;
      }
    
      // Clean the token string
      const cleanToken = token.split('=')[1];
    
      try {
        const res = await fetch('/api/referrals/stats', {
          method: 'GET',
          credentials: 'include',  // Ensure cookies are sent with the request
        });
    
        if (!res.ok) {
          throw new Error(await res.text());
        }
    
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load stats.');
      } finally {
        setLoading(false);
      }
    };
    

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Referral Dashboard</h1>
      <p>Your Referral Code: <strong>{stats.referralCode}</strong></p>
      <button onClick={() => navigator.clipboard.writeText(stats.referralCode)}>
        Copy Referral Code
      </button>
      <h2>Your Stats</h2>
      <p>Total Referrals: {stats.referralsCount}</p>
      <h2>Referred Users</h2>
      {stats.referredUsers.length > 0 ? (
        <ul>
          {stats.referredUsers.map((user: any, index: number) => (
            <li key={index}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Joined: {new Date(user.joined).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No referrals yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
