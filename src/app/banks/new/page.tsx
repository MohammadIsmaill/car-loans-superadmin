'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import { banksAPI } from '@/lib/api';

export default function AddNewBank() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await banksAPI.create({
        name: formData.name,
        contactPerson: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
      });

      if (response.success) {
        router.push('/banks/new/success');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Failed to create bank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <Link href="/dashboard" className="text-2xl font-extrabold text-primary">
          CarTIBI
        </Link>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-8">
          <h1 className="text-3xl font-bold text-primary text-center mb-12">
            Add New Bank
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="Bank Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-4 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg"
                required
              />
            </div>

            <div className="border border-gray-200 rounded-lg">
              <input
                type="text"
                placeholder="Contact Person Name"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-4 py-4 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg"
                required
              />
            </div>

            <div className="border border-gray-200 rounded-lg">
              <input
                type="email"
                placeholder="Contact Email Address"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-4 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg"
                required
              />
            </div>

            <div className="border border-gray-200 rounded-lg">
              <input
                type="tel"
                placeholder="Contact Phone Number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-4 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg"
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="secondary" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Next'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
