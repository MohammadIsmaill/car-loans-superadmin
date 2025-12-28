'use client';

import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  title: string;
  showWelcome?: boolean;
}

export default function DashboardHeader({ title, showWelcome = false }: DashboardHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
        {showWelcome ? `Welcome Back, ${user?.name || 'User'}` : title}
      </h1>
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-gray-600 font-bold text-sm sm:text-base">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
