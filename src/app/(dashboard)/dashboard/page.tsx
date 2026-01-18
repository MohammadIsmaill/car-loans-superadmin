'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';
import Link from 'next/link';
import { dashboardAPI } from '@/lib/api';
import { DashboardSkeleton } from '@/components/Skeleton';

interface DashboardStats {
  dealers: {
    total: number;
    active: number;
    pending: number;
    blocked: number;
  };
  users: {
    total: number;
    active: number;
  };
  banks: {
    total: number;
  };
  loans: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    totalAmount: number;
  };
  performance: Array<{
    _id: { year: number; month: number };
    count: number;
    approved: number;
    amount: number;
  }>;
}

interface RecentActivity {
  recentDealers: Array<{
    _id: string;
    name: string;
    status: string;
    createdAt: string;
  }>;
  recentLoans: Array<{
    _id: string;
    loanNumber: string;
    status: string;
    loanAmount: number;
    customer?: { name: string };
    bank?: { name: string };
    createdAt: string;
  }>;
  recentUsers: Array<{
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
}

const quickActions = [
  { label: 'Review New User Accounts', icon: '📋', href: '/users' },
  { label: 'Add a new Dealer', icon: '📋', href: '/dealers/new' },
  { label: 'Edit Landing Page Content', icon: '📋', href: '/content' },
];

export default function Dashboard() {
  const [timeRange] = useState('Last 7 days');
  const [performanceRange] = useState('Last 6 Months');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, activityResponse] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentActivity(5)
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        if (activityResponse.success) {
          setActivity(activityResponse.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const statistics = stats ? [
    { label: 'Total Dealers', value: stats.dealers.total.toString() },
    { label: 'Total Users', value: stats.users.total.toString() },
    { label: 'Total Registered Banks', value: stats.banks.total.toString() },
    { label: 'Blocked Accounts', value: stats.dealers.blocked.toString() },
  ] : [
    { label: 'Total Dealers', value: '—' },
    { label: 'Total Users', value: '—' },
    { label: 'Total Registered Banks', value: '—' },
    { label: 'Blocked Accounts', value: '—' },
  ];

  const performanceMetrics = stats ? [
    { label: 'Total Loan Applications', sublabel: 'All submitted applications', value: stats.loans.total.toString(), color: 'bg-green-500' },
    { label: 'Approved Applications', sublabel: 'Complete Applications', value: stats.loans.approved.toString(), color: 'bg-green-500' },
    { label: 'Rejected Applications', sublabel: 'Rejected by Banks or Users', value: stats.loans.rejected.toString(), color: 'bg-red-500' },
    { label: 'Pending Applications', sublabel: 'Awaiting Review', value: stats.loans.pending.toString(), color: 'bg-yellow-500' },
    { label: 'Total Loan Amount', sublabel: 'Approved Loan Value', value: formatCurrency(stats.loans.totalAmount), color: 'bg-blue-500' },
    { label: 'Active Dealers', sublabel: 'Currently Active', value: stats.dealers.active.toString(), color: 'bg-green-500' },
  ] : [];

  const activityLogsLeft = activity?.recentLoans.map(loan => ({
    type: 'loan',
    message: `Loan #${loan.loanNumber} - ${loan.customer?.name || 'Unknown'} (${loan.status})`,
    link: `/bank-loans/${loan._id}`,
  })) || [];

  const activityLogsRight = activity?.recentDealers.map(dealer => ({
    type: 'dealer',
    message: `Dealer "${dealer.name}" - ${dealer.status}`,
    link: `/dealers/${dealer._id}`,
    isHighlighted: dealer.status === 'pending',
  })) || [];

  if (loading) {
    return (
      <>
        <DashboardHeader title="Dashboard" showWelcome />
        <DashboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader title="Dashboard" showWelcome />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Dashboard" showWelcome />

      {/* Statistics Cards */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-primary">Statistics</h2>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {timeRange}
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statistics.map((stat, index) => (
            <Card key={index} className="text-center">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Report */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-primary">Performance report</h2>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-2 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-300 rounded-sm"></span>
                Total Loans
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-black rounded-sm"></span>
                Approved
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-200 rounded-sm"></span>
                Rejected
              </span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 w-fit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {performanceRange}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Chart Area */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <Card className="h-48 sm:h-64">
              {/* Chart placeholder */}
              <div className="h-full flex flex-col">
                <div className="flex-1 relative">
                  {/* Simple line chart visualization */}
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
                    <path
                      d="M 0 150 Q 100 120 150 100 T 300 80 T 450 120 T 600 60"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M 0 180 Q 100 160 150 140 T 300 100 T 450 130 T 600 90"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    <circle cx="150" cy="100" r="4" fill="#000" />
                    <text x="130" y="85" fontSize="10" fill="#666">February</text>
                    <text x="130" y="70" fontSize="10" fill="#666">{stats?.loans.total || 0} applications</text>
                  </svg>
                </div>
                <div className="flex justify-around pt-3 sm:pt-4 border-t border-gray-100 overflow-x-auto">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul'].map((month) => (
                    <span key={month} className="text-xs sm:text-sm text-gray-500 px-2 sm:px-4 py-1 border border-gray-200 rounded-lg whitespace-nowrap">
                      {month}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Metrics */}
          <div className="space-y-2 sm:space-y-3 order-1 lg:order-2">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between py-1.5 sm:py-2">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm text-primary truncate">{metric.label}</p>
                  <p className="text-xs text-gray-400 truncate">{metric.sublabel}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 ml-2">
                  <span className="font-bold text-sm sm:text-base text-primary">{metric.value}</span>
                  <div className={`w-10 sm:w-16 h-1 ${metric.color} rounded-full hidden sm:block`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Left Activity Log - Recent Loans */}
        <Card>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-primary">Recent Loan Activity</h3>
            <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              This Week
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {activityLogsLeft.length > 0 ? (
              activityLogsLeft.map((log, index) => (
                <div key={index} className="flex items-center justify-between py-1.5 sm:py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="text-gray-400 flex-shrink-0">📄</span>
                    <span className="text-xs sm:text-sm text-gray-700 truncate">{log.message}</span>
                  </div>
                  <Link href={log.link} className="text-xs sm:text-sm text-gray-500 hover:text-primary ml-2 flex-shrink-0">
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No recent loan activity</p>
            )}
          </div>
        </Card>

        {/* Right Activity Log - Recent Dealers */}
        <Card>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-sm sm:text-base text-primary">Recent Dealer Activity</h3>
            <button className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              This Week
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {activityLogsRight.length > 0 ? (
              activityLogsRight.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between py-1.5 sm:py-2 border-b last:border-0 ${
                    log.isHighlighted ? 'border-blue-400 border-2 rounded-lg px-2 -mx-2' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${log.isHighlighted ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
                    <span className="text-xs sm:text-sm text-gray-700 truncate">{log.message}</span>
                  </div>
                  <Link href={log.link} className="text-xs sm:text-sm text-gray-500 hover:text-primary ml-2 flex-shrink-0">
                    View
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No recent dealer activity</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl sm:text-2xl">{action.icon}</span>
              <span className="text-xs sm:text-sm font-medium text-primary">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
