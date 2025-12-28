'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { navigationConfig, NavItem } from '@/config/navigation';

// Icon imports
import DashboardIcon from './icons/DashboardIcon';
import BankLoansIcon from './icons/BankLoansIcon';
import DealersIcon from './icons/DealersIcon';
import UsersIcon from './icons/UsersIcon';
import BanksIcon from './icons/BanksIcon';
import StaffRolesIcon from './icons/StaffRolesIcon';
import ContentIcon from './icons/ContentIcon';
import SupportIcon from './icons/SupportIcon';
import SettingsIcon from './icons/SettingsIcon';
import IncomeIcon from './icons/IncomeIcon';
import ProfileIcon from './icons/ProfileIcon';

// Icon component mapping
const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  DashboardIcon,
  BankLoansIcon,
  DealersIcon,
  UsersIcon,
  BanksIcon,
  StaffRolesIcon,
  ContentIcon,
  SupportIcon,
  SettingsIcon,
  IncomeIcon,
  ProfileIcon,
};

interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}

function NavItemComponent({ item, pathname, onClick }: NavItemComponentProps) {
  const isActive = item.useStartsWith
    ? pathname?.startsWith(item.href)
    : pathname === item.href;

  const IconComponent = iconComponents[item.icon];

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-4 rounded-lg font-bold transition-all ${
        isActive
          ? 'bg-gray-100 text-black'
          : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
      }`}
    >
      {IconComponent && <IconComponent className="w-5 h-5 mx-3" />}
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, isLoading } = useAuth();
  const { isOpen, isMobile, close } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      close();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 p-6 flex-col fixed h-screen">
          <div className="mx-3 px-5">
            <Header />
          </div>
          <nav className="mt-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </nav>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed h-screen bg-white border-r border-gray-200 p-4 flex flex-col z-50
          transition-transform duration-300 ease-in-out
          w-72 lg:w-64
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          lg:translate-x-0
        `}
      >
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mx-3 px-3 py-4">
            <Header />
            {/* Mobile close button */}
            {isMobile && (
              <button
                onClick={close}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navigationConfig.map((section, sectionIndex) => (
            <div key={sectionIndex} className={section.title ? 'pt-4' : ''}>
              {section.title && (
                <p className="px-5 text-xs text-gray-400 font-semibold mb-2 mx-3 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  onClick={handleNavClick}
                />
              ))}
            </div>
          ))}
        </nav>

        <div className="flex-shrink-0 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium border border-red-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
