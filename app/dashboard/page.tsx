'use client';

import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You are not logged in.');
      setLoading(false);
      console.log('No token found in localStorage');
      return;
    }

    console.log('Token found in localStorage:', token); // Log token found

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/referrals/stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,  // Send token as Authorization header
          },
          credentials: 'include',  // Ensure cookies are sent with the request if needed
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
