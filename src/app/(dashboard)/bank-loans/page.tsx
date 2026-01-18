'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Tabs from '@/components/Tabs';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { bankLoansAPI, BankLoan } from '@/lib/api';
import { LoanCardsSkeleton } from '@/components/Skeleton';

const tabs = [
  { label: 'All Loans', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function BankLoans() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loans, setLoans] = useState<BankLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bankLoansAPI.getAll({
        status: activeTab === 'all' ? undefined : activeTab,
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      setLoans(response.data.loans || response.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalItems(response.data.pagination?.total || response.data.length || 0);
    } catch (err) {
      console.error('Failed to fetch loans:', err);
      setError('Failed to load loans');
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, currentPage]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Helper to extract loan amount from phases if not directly available
  const getLoanAmount = (loan: BankLoan): number | null => {
    if (loan.loanAmount) return loan.loanAmount;

    // Try to get from bank_offers phase
    const bankOffersPhase = loan.phases?.find((p: any) => p.type === 'bank_offers');
    if (bankOffersPhase?.data?.selectedOffer?.totalAmount) {
      return bankOffersPhase.data.selectedOffer.totalAmount;
    }

    // Try to get from pricing phase
    const pricingPhase = loan.phases?.find((p: any) => p.type === 'dealership_pricing');
    if (pricingPhase?.data?.salePrice) {
      return pricingPhase.data.salePrice;
    }

    return null;
  };

  // Helper to extract customer name from phases if not directly available
  const getCustomerName = (loan: BankLoan): string => {
    if (loan.customer?.name) return loan.customer.name;

    // Try to get from client_personal_info phase
    const personalInfoPhase = loan.phases?.find((p: any) => p.type === 'client_personal_info');
    if (personalInfoPhase?.data?.name) {
      return personalInfoPhase.data.name;
    }

    return 'Unknown';
  };

  // Helper to extract dealership name from phases if not directly available
  const getDealershipName = (loan: BankLoan): string => {
    if (loan.dealership?.name) return loan.dealership.name;

    // Try to get from dealership_selection phase
    const dealershipPhase = loan.phases?.find((p: any) => p.type === 'dealership_selection');
    if (dealershipPhase?.data?.dealership?.name) {
      return dealershipPhase.data.dealership.name;
    }

    return '';
  };

  return (
    <>
      <DashboardHeader title="Bank Loans" />

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mb-6">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Type loan ID to search"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>
      )}

      {loading ? (
        <LoanCardsSkeleton count={4} />
      ) : loans.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">No loans found</div>
        </div>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div
              key={loan._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(loan.status)}`}>
                    {capitalizeFirst(loan.status)}
                  </span>
                  <span className="text-sm text-gray-500">Sent on {formatDate(loan.applicationDate)}</span>
                  <span className="text-sm text-gray-500">ID:{loan.loanNumber}</span>
                </div>
                <Link
                  href={`/bank-loans/${loan._id}`}
                  className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  View
                </Link>
              </div>

              <div className="flex items-center gap-6">
                {/* Vehicle Image */}
                <div className="w-32 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>

                {/* Vehicle Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-primary">
                    {loan.vehicle?.year} {loan.vehicle?.make} {loan.vehicle?.model}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {(() => {
                      const amount = getLoanAmount(loan);
                      return amount ? `Amount: SAR ${amount.toLocaleString()}` : '';
                    })()}
                    {loan.tenure && <span className="mx-2">•</span>}
                    {loan.tenure && `${loan.tenure} months`}
                    {loan.interestRate && <span className="mx-2">•</span>}
                    {loan.interestRate && `${loan.interestRate}% APR`}
                  </p>
                </div>

                {/* Parties */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <span className="text-sm font-medium">{getCustomerName(loan)}</span>
                  </div>
                  {getDealershipName(loan) && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <span className="text-sm font-medium">{getDealershipName(loan)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <span className="text-sm font-medium">{loan.bank?.name || 'Unknown Bank'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
