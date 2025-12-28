'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import { authAPI } from '@/lib/api';

const countryCodes = [
  { code: '+966', country: 'KSA' },
  { code: '+971', country: 'UAE' },
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
];

export default function Login() {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);

    try {
      // Store phone in session for OTP verification
      const fullPhone = `${countryCode}${phone}`;
      sessionStorage.setItem('phone', fullPhone);

      // Call API to send OTP
      await authAPI.sendOtp(fullPhone);

      router.push('/otp');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          CarTIBI
        </Link>
        <Link
          href="/login"
          className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Login
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-primary mb-4">CarTIBI</h2>
            <h1 className="text-3xl font-bold text-primary">
              Welcome Back! Sign in to your account
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="px-4 py-4 bg-white border-r border-gray-200 text-primary font-medium focus:outline-none"
              >
                {countryCodes.map((cc) => (
                  <option key={cc.code} value={cc.code}>
                    {cc.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-4 py-4 focus:outline-none text-primary placeholder:text-gray-400"
                disabled={loading}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        CarTibi Admin Portal — Authorized Access Only
      </footer>
    </div>
  );
}
