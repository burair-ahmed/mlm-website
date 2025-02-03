'use client';

import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
const ReferralTree = ({ tree }: { tree: any }) => {
  const [selectedUser, setSelectedUser] = useState<any>(null); // Store the selected user for the popover

  const handleClick = (user: any) => {
    setSelectedUser(user); // Set the selected user when a node is clicked
  };

  if (!tree) return null;

  return (
    <ul className="tree">
      <li>
        <div className="node">
          <Popover>
            <PopoverTrigger asChild>
              <button onClick={() => handleClick(tree)} className="referral-node">
                <strong>{tree.name}</strong> ({tree.email}) - Joined: {new Date(tree.joined).toLocaleDateString()}
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="popover-content">
                <h3>User Details</h3>
                <p><strong>Name:</strong> {selectedUser?.name}</p>
                <p><strong>Email:</strong> {selectedUser?.email}</p>
                <p><strong>Referral Code:</strong> {selectedUser?.referralCode}</p>
                {/* Add more user info here */}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {tree.referrals.length > 0 && (
          <ul>
            {tree.referrals.map((referral: any) => (
              <li key={referral.id}>
                <ReferralTree tree={referral} />
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  );
};

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);  // Store user details
  const [tree, setTree] = useState<any>(null);  // Store referral tree
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const resUser = await fetch('/api/user/details', { method: 'GET' });
        if (!resUser.ok) throw new Error(await resUser.text());

        const userData = await resUser.json();
        setUser(userData);

        // Fetch referral tree
        const resTree = await fetch('/api/referrals/tree', { method: 'GET' });
        if (!resTree.ok) throw new Error(await resTree.text());

        const treeData = await resTree.json();
        setTree(treeData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h1>Your Referral Dashboard</h1>

      {/* Display user details */}
      {user && (
        <div className="user-card">
          <h2>User Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Referral Code:</strong> {user.referralCode}</p>
        </div>
      )}

      {/* Display referral tree */}
      <h2>Your Referral Tree</h2>
      <ReferralTree tree={tree} />

      <style jsx>{`
        .dashboard {
          font-family: 'Arial', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f6f9;
          border-radius: 10px;
        }
        
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        h2 {
          color: #555;
          margin-top: 20px;
        }

        .user-card {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .user-card p {
          font-size: 16px;
          margin: 8px 0;
        }

        .tree {
          list-style-type: none;
          padding-left: 20px;
          margin-top: 10px;
        }

        .node {
          font-weight: bold;
          color: #444;
        }

        .referral-node {
          background: none;
          border: none;
          color: #333;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          text-align: left;
        }

        .popover-content {
          padding: 10px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .loading, .error {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          color: #e74c3c;
        }

        .loading {
          color: #3498db;
        }

        .error {
          color: #e74c3c;
        }
        
        .node {
          font-weight: bold;
          margin-bottom: 10px;
        }

        .tree li {
          margin-left: 20px;
        }
        
      `}</style>
    </div>
  );
};

export default Dashboard;
