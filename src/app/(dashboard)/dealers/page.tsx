'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Tabs from '@/components/Tabs';
import SearchInput from '@/components/SearchInput';
import Table from '@/components/Table';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import { dealersAPI, Dealer } from '@/lib/api';
import { TableSkeleton } from '@/components/Skeleton';

interface DealerTableItem {
  _id: string;
  id: string;
  dealershipName: string;
  phoneNumber: string;
  country: string;
  joiningDate: string;
  lastActivity: string;
}

const tabs = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Deleted', value: 'deleted' },
];

export default function Dealers() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dealers, setDealers] = useState<DealerTableItem[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
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

  const fetchDealers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dealersAPI.getAll({
        status: activeTab,
        search: searchQuery || undefined,
        page: currentPage,
        limit: 10,
      });

      if (response.success) {
        const formattedDealers: DealerTableItem[] = response.data.dealers.map((dealer: Dealer) => ({
          _id: dealer._id,
          id: `#${dealer.code}`,
          dealershipName: dealer.name,
          phoneNumber: dealer.contactPhone || 'N/A',
          country: dealer.address?.country || 'KSA',
          joiningDate: formatDate(dealer.createdAt),
          lastActivity: formatDateTime(dealer.updatedAt),
        }));
        setDealers(formattedDealers);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch dealers:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, currentPage]);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'dealershipName', label: 'Dealership Name', sortable: true },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      sortable: true,
      render: (dealer: DealerTableItem) => (
        <div>
          <div>{dealer.phoneNumber}</div>
          <div className="text-gray-400 text-xs">{dealer.country}</div>
        </div>
      ),
    },
    { key: 'joiningDate', label: 'Joining Date', sortable: true },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      sortable: true,
      render: (dealer: DealerTableItem) => (
        <div>
          {dealer.lastActivity.split('\n').map((line, i) => (
            <div key={i} className={i === 1 ? 'text-gray-400 text-xs' : ''}>
              {line}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <DashboardHeader title="Dealer Management" />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for dealers"
        />
        <Button
          onClick={() => router.push('/dealers/new')}
          className="w-full sm:w-auto px-4 sm:px-6 whitespace-nowrap"
        >
          Add New
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : dealers.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No dealers found</div>
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={dealers}
            onRowClick={(dealer) => router.push(`/dealers/${dealer._id}`)}
          />

          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </>
  );
}
