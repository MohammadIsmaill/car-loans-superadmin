export interface NavItem {
  href: string;
  label: string;
  icon: string;
  useStartsWith?: boolean;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const navigationConfig: NavSection[] = [
  {
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: 'DashboardIcon' },
      { href: '/bank-loans', label: 'Bank Loans', icon: 'BankLoansIcon', useStartsWith: true },
    ],
  },
  {
    title: 'Management & Configuration',
    items: [
      { href: '/dealers', label: 'Dealers', icon: 'DealersIcon', useStartsWith: true },
      { href: '/users', label: 'Users', icon: 'UsersIcon', useStartsWith: true },
      { href: '/banks', label: 'Banks', icon: 'BanksIcon', useStartsWith: true },
      { href: '/staff-roles', label: 'Staff Roles', icon: 'StaffRolesIcon', useStartsWith: true },
      { href: '/content', label: 'Content', icon: 'ContentIcon', useStartsWith: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { href: '/support-center', label: 'Support Center', icon: 'SupportIcon', useStartsWith: true },
    ],
  },
  {
    title: 'Personal',
    items: [
      { href: '/system-settings', label: 'System Settings', icon: 'SettingsIcon', useStartsWith: true },
      { href: '/income', label: 'Income', icon: 'IncomeIcon', useStartsWith: true },
      { href: '/profile', label: 'Profile', icon: 'ProfileIcon', useStartsWith: true },
    ],
  },
];
