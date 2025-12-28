'use client';

import { useSidebar } from '@/contexts/SidebarContext';
import Header from './Header';

export default function MobileHeader() {
  const { toggle, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <button
        onClick={toggle}
        className="p-2 hover:bg-gray-100 rounded-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <Header />
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  );
}
