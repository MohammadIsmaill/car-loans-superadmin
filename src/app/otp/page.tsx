'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';

export default function OTP() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(58);
  const [phone, setPhone] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Get phone number from sessionStorage
    const storedPhone = sessionStorage.getItem('phone');
    if (!storedPhone) {
      router.push('/login');
      return;
    }
    setPhone(storedPhone);
    inputRefs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (index === 3 && value) {
      const otpCode = [...newOtp.slice(0, 3), value.slice(-1)].join('');
      if (otpCode.length === 4) {
        handleVerify(otpCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode: string) => {
    setError('');
    setLoading(true);

    try {
      // Call API to verify OTP
      const response = await authAPI.verifyOtp(phone, otpCode);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Check if user is super_admin
        if (user.role !== 'super_admin') {
          setError('Access denied. Only super admins can access this portal.');
          return;
        }

        const userData = {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role as 'super_admin',
        };

        login(userData);
        localStorage.setItem('super_admin_token', token);
        sessionStorage.removeItem('phone');
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      setError('Please enter the complete 4-digit code');
      return;
    }
    handleVerify(otpCode);
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);

    try {
      // Call API to resend OTP
      await authAPI.sendOtp(phone);
      setOtp(['', '', '', '']);
      setCountdown(58);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      setError(error.response?.data?.error?.message || 'Failed to resend OTP. Please try again.');
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
        <div className="w-full max-w-md px-8 text-center">
          <h2 className="text-2xl font-extrabold mb-8 text-primary">CarTIBI</h2>

          <h1 className="text-3xl font-bold text-primary mb-12">
            Please enter the code<br />
            sent to your mobile.
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <div className="flex gap-4 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    placeholder='....'
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-20 h-20 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-primary"
                    disabled={loading}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            <div className="text-sm text-gray-600">
              Didn't receive code?{' '}
              {countdown > 0 ? (
                <span>Resend after 0:{countdown.toString().padStart(2, '0')}</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="font-semibold text-primary hover:underline disabled:opacity-50"
                >
                  Resend
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
