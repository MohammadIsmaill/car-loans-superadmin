'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';

// All available super admin users for debug authentication
const userPresets = [
  { id: "superadmin1", name: "Super Admin", email: "superadmin@carloan.com", phone: "+966500000000" },
  { id: "superadmin2", name: "Super Admin 2", email: "superadmin2@carloan.com", phone: "+966500000001" },
];

export default function DebugAuth() {
  const [selectedUserId, setSelectedUserId] = useState(userPresets[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const selectedUser = userPresets.find((u) => u.id === selectedUserId) || userPresets[0];

  const handleDebugLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.debugAuth({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
      });

      localStorage.setItem('super_admin_token', response.data.token);
      login(response.data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Debug auth failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-primary mb-6 text-center">Debug Auth</h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="user"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Super Admin
            </label>
            <select
              id="user"
              name="user"
              value={selectedUserId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white text-primary"
            >
              {userPresets.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Show selected user info */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Phone:</strong> {selectedUser.phone}</p>
            <p><strong>Role:</strong> super_admin</p>
          </div>

          <button
            onClick={handleDebugLogin}
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login as Super Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}
