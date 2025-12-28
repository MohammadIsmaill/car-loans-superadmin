'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Tabs from '@/components/Tabs';
import SearchInput from '@/components/SearchInput';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import { usersAPI, User } from '@/lib/api';
import { TableSkeleton } from '@/components/Skeleton';

const tabs = [
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Deleted', value: 'deleted' },
];

export default function Users() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await usersAPI.getAll({
        search: searchQuery || undefined,
        isActive: activeTab === 'active' ? 'true' : activeTab === 'blocked' ? 'false' : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      setUsers(response.data.users || response.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalItems(response.data.pagination?.total || response.data.length || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeTab, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatLastActivity = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr}\n${timeStr}`;
  };

  const columns = [
    {
      key: '_id',
      label: 'ID',
      sortable: true,
      render: (user: User) => `#${user._id.slice(-8).toUpperCase()}`,
    },
    {
      key: 'name',
      label: 'User Name',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      sortable: true,
      render: (user: User) => (
        <div>
          <div>{user.phone}</div>
          <div className="text-gray-400 text-xs">{user.globalPreferences?.country || 'KSA'}</div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joining Date',
      sortable: true,
      render: (user: User) => formatDate(user.createdAt),
    },
    {
      key: 'lastLogin',
      label: 'Last Activity',
      sortable: true,
      render: (user: User) => (
        <div>
          {user.lastLogin ? (
            formatLastActivity(user.lastLogin).split('\n').map((line, i) => (
              <div key={i} className={i === 1 ? 'text-gray-400 text-xs' : ''}>
                {line}
              </div>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="User Management" />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mb-4 sm:mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for users"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      {loading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : (
        <Table
          columns={columns}
          data={users}
          onRowClick={(user) => router.push(`/users/${user._id}`)}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
