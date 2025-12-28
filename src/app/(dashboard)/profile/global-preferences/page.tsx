'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function GlobalPreferences() {
  const router = useRouter();
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('Saudi Arabian Riyal - SAR');
  const [timezone, setTimezone] = useState('(GMT+05:00) KSA');
  const [country, setCountry] = useState('Saudi Arabia');

  const handleSave = () => {
    // API call to save preferences
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
            <h3 className="text-lg sm:text-xl font-bold text-white">Global preferences</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Setup currency and language</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-400 mb-2">Preferred language</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full text-primary text-sm sm:text-base focus:outline-none bg-transparent"
            >
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 mb-1">Preferred currency</p>
              <p className="font-medium text-primary text-sm sm:text-base truncate">{currency}</p>
            </div>
            <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-primary ml-2 flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 mb-1">Time zone</p>
              <p className="font-medium text-primary text-sm sm:text-base">{timezone}</p>
            </div>
            <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-primary ml-2 flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          </div>

          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-400 mb-1">Primary country</p>
              <p className="font-medium text-primary text-sm sm:text-base">{country}</p>
            </div>
            <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-primary ml-2 flex-shrink-0">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="border border-gray-200 rounded-xl p-4 sm:p-6 order-first lg:order-last">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h4 className="font-bold text-primary text-sm sm:text-base mb-2">Global preferences</h4>
          <p className="text-xs sm:text-sm text-gray-500">
            Lorem ipsum Lorem Ipsum Lorem Ipsum Lorem ipsum Lorem Ispum. Lorem ipsum Lorem Ipsum Lorem Ispum.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
        <Button onClick={handleSave} className="sm:w-auto sm:px-8">
          Save Changes
        </Button>
        <Button variant="secondary" onClick={() => router.back()} className="sm:w-auto sm:px-8">
          Cancel
        </Button>
      </div>
    </>
  );
}
