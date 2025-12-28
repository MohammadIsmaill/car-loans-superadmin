'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import SearchInput from '@/components/SearchInput';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import { banksAPI, Bank } from '@/lib/api';
import { TableSkeleton } from '@/components/Skeleton';

export default function Banks() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchBanks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await banksAPI.getAll({
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      setBanks(response.data.banks || response.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalItems(response.data.pagination?.total || response.data.length || 0);
    } catch (err) {
      console.error('Failed to fetch banks:', err);
      setError('Failed to load banks');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, currentPage]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const columns = [
    {
      key: '_id',
      label: 'ID',
      sortable: true,
      render: (bank: Bank) => `#${bank._id.slice(-8).toUpperCase()}`,
    },
    {
      key: 'name',
      label: 'Bank Name',
      sortable: true,
    },
    {
      key: 'contactPerson',
      label: 'Contact Phone Number',
      sortable: true,
      render: (bank: Bank) => (
        <div>
          <div>{bank.contactPerson?.phone || '-'}</div>
          <div className="text-gray-400 text-xs">{bank.contactPerson?.name || ''}</div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joining Date',
      sortable: true,
      render: (bank: Bank) => formatDate(bank.createdAt),
    },
  ];

  return (
    <>
      <DashboardHeader title="Bank Management" />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for banks"
        />
        <Button
          onClick={() => router.push('/banks/new')}
          className="w-full sm:w-auto px-4 sm:px-6 whitespace-nowrap"
        >
          Add New
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      {loading ? (
        <TableSkeleton rows={8} columns={4} />
      ) : (
        <Table
          columns={columns}
          data={banks}
          onRowClick={(bank) => router.push(`/banks/${bank._id}`)}
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
