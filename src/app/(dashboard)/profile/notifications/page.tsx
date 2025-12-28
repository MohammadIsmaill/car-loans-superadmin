'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface NotificationSetting {
  id: string;
  category: string;
  label: string;
  enabled: boolean;
}

const initialSettings: NotificationSetting[] = [
  {
    id: '1',
    category: 'Allow',
    label: 'Allow receiving messages from our platform',
    enabled: true,
  },
  {
    id: '2',
    category: 'Allow',
    label: 'Allow receiving updates regarding orders and sales',
    enabled: false,
  },
  {
    id: '3',
    category: 'Policy and community',
    label: 'Allow receiving updates on our rules and regulations',
    enabled: true,
  },
  {
    id: '4',
    category: 'Account support',
    label: 'Allow receiving messages about personal accounts, legal alerts',
    enabled: false,
  },
];

export default function NotificationSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const handleSave = () => {
    // API call to save notification settings
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
            <h3 className="text-lg sm:text-xl font-bold text-white">Notifications</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Allow system email notifications</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Settings List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100 gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 mb-1">{setting.category}</p>
                <p className="font-medium text-primary text-sm sm:text-base">{setting.label}</p>
              </div>
              <button
                onClick={() => toggleSetting(setting.id)}
                className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                  setting.enabled ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                    setting.enabled ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="border border-gray-200 rounded-xl p-4 sm:p-6 order-first lg:order-last">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h4 className="font-bold text-primary text-sm sm:text-base mb-2">Updates and alerts</h4>
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
