'use client';

import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface SettingCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  hasArrow?: boolean;
}

const settingCards: SettingCard[] = [
  {
    title: 'Security',
    description: 'Your credentials',
    href: '/profile/security',
    icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Login details',
    description: 'Password & security',
    href: '/profile/login-details',
    icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    title: 'Notifications',
    description: 'Your email notifications',
    href: '/profile/notifications',
    icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    hasArrow: true,
  },
  {
    title: 'Global preferences',
    description: 'Currency and language',
    href: '/profile/global-preferences',
    icon: (
      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function ProfileSettings() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Profile Settings" />
        <div className="space-y-6 animate-pulse">
          <div className="bg-gray-200 rounded-lg h-32"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Profile Settings" />

      {/* Profile Header */}
      <Card className="bg-[#333] text-white mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold mb-1 text-white">
              {user?.name || 'Dealership Name'}
            </h3>
            <p className="text-gray-300 text-sm sm:text-base break-all">{user?.email || 'emaildealershipregistration@gmail.com'}</p>
          </div>
        </div>
      </Card>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {settingCards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow flex items-start gap-3 sm:gap-4"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-primary text-sm sm:text-base mb-1">{card.title}</h4>
              <p className="text-xs sm:text-sm text-gray-500">{card.description}</p>
            </div>
            {card.hasArrow && (
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </>
  );
}
