'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface Session {
  id: string;
  location: string;
  date: string;
  time: string;
  browser: string;
  device: string;
  employee: string;
  isCurrent: boolean;
}

// Mock data
const mockSessions: Session[] = [
  {
    id: '1',
    location: 'London',
    date: '20 Oct 2020',
    time: '04:32AM',
    browser: 'Windows 10 Chrome',
    device: 'desktop',
    employee: 'Employee Name',
    isCurrent: true,
  },
  {
    id: '2',
    location: 'London',
    date: '01 Apr 2020',
    time: '06:25PM',
    browser: 'Windows 10 Chrome',
    device: 'desktop',
    employee: 'Employee Name',
    isCurrent: false,
  },
  {
    id: '3',
    location: 'Berlin',
    date: '20 Oct 2020',
    time: '04:32AM',
    browser: 'Windows 10 Chrome',
    device: 'desktop',
    employee: 'Employee Name',
    isCurrent: false,
  },
  {
    id: '4',
    location: 'London',
    date: '06 Sep 2020',
    time: '00:59PM',
    browser: 'Windows 10 Chrome',
    device: 'mobile',
    employee: 'Employee Name',
    isCurrent: false,
  },
  {
    id: '5',
    location: 'Madrid',
    date: '20 Oct 2020',
    time: '04:32AM',
    browser: 'Windows 10 Chrome',
    device: 'mobile',
    employee: 'Employee Name',
    isCurrent: false,
  },
];

export default function SecuritySettings() {
  const router = useRouter();
  const [sessions] = useState(mockSessions);

  const handleRemoveDevice = (sessionId: string) => {
    // API call to remove device
    console.log('Remove device:', sessionId);
  };

  const handleSave = () => {
    // API call to save settings
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
            <h3 className="text-lg sm:text-xl font-bold text-white">Security</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Your last activity and credentials</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-3 sm:py-4 border-b border-gray-100 gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {session.device === 'desktop' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    {session.location} • {session.date} at {session.time}
                  </p>
                  <p className="font-semibold text-primary text-sm sm:text-base truncate">{session.browser}</p>
                  <p className="font-semibold text-primary text-sm sm:text-base">{session.employee}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 ml-11 sm:ml-0">
                {session.isCurrent && (
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">Current session</span>
                )}
                <button
                  onClick={() => handleRemoveDevice(session.id)}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 hover:text-red-500 whitespace-nowrap"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="border border-gray-200 rounded-xl p-4 sm:p-6 order-first lg:order-last">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="font-bold text-primary text-sm sm:text-base mb-2">Security credentials</h4>
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
