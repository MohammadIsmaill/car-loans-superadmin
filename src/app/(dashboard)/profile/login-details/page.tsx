'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function LoginDetails() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('+971 829 819 219');

  const handleSave = () => {
    // API call to save phone number
    router.push('/profile');
  };

  return (
    <>
      <DashboardHeader title="Profile Settings" />

      {/* Header Card */}
      <Card className="bg-[#333] text-white mb-6 md:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-500 rounded-lg flex items-center justify-center hover:bg-gray-700 flex-shrink-0"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">Login Details</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Login details, Password and Security</p>
          </div>
        </div>
      </Card>

      {/* Form */}
      <div className="max-w-xl">
        <h4 className="font-semibold text-primary text-sm sm:text-base mb-3 sm:mb-4">Login Details</h4>
        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-xs text-gray-400 mb-1">Phone Number</p>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full text-primary text-sm sm:text-base focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button onClick={handleSave} className="sm:w-auto sm:px-8">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => router.back()} className="sm:w-auto sm:px-8">
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}
