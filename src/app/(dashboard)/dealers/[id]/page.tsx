'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { dealersAPI, Dealer } from '@/lib/api';

export default function DealerDetail() {
  const router = useRouter();
  const params = useParams();
  const dealerId = params.id as string;

  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [deleteReason, setDeleteReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        setLoading(true);
        const response = await dealersAPI.getById(dealerId);
        if (response.success) {
          setDealer(response.data.dealer);
        }
      } catch (err) {
        console.error('Failed to fetch dealer:', err);
      } finally {
        setLoading(false);
      }
    };

    if (dealerId) {
      fetchDealer();
    }
  }, [dealerId]);

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await dealersAPI.approve(dealerId);
      setShowApproveModal(false);
      router.push('/dealers');
    } catch (err) {
      console.error('Failed to approve dealer:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async () => {
    try {
      setActionLoading(true);
      await dealersAPI.block(dealerId, blockReason);
      setShowBlockModal(false);
      router.push('/dealers');
    } catch (err) {
      console.error('Failed to block dealer:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async () => {
    try {
      setActionLoading(true);
      await dealersAPI.unblock(dealerId);
      router.push('/dealers');
    } catch (err) {
      console.error('Failed to unblock dealer:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await dealersAPI.delete(dealerId, deleteReason);
      setShowDeleteModal(false);
      router.push('/dealers');
    } catch (err) {
      console.error('Failed to delete dealer:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setActionLoading(true);
      await dealersAPI.restore(dealerId);
      router.push('/dealers');
    } catch (err) {
      console.error('Failed to restore dealer:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Dealer Management" />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dealer details...</div>
        </div>
      </>
    );
  }

  if (!dealer) {
    return (
      <>
        <DashboardHeader title="Dealer Management" />
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Dealer not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Dealer Management" />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-4 sm:mb-6 hover:text-primary text-sm sm:text-base"
      >
        Back
      </button>

      {/* Status Badge */}
      <div className="mb-4 sm:mb-6">
        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
          dealer.status === 'active' ? 'bg-green-100 text-green-800' :
          dealer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          dealer.status === 'blocked' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {dealer.status.charAt(0).toUpperCase() + dealer.status.slice(1)}
        </span>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Basic Details */}
        <div>
          <h3 className="font-semibold text-primary text-sm sm:text-base mb-3 sm:mb-4">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Dealership Name</p>
              <p className="text-primary text-sm sm:text-base">{dealer.name || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Dealership Code</p>
              <p className="text-primary text-sm sm:text-base">{dealer.code || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Phone Number</p>
              <p className="text-primary text-sm sm:text-base">{dealer.contactPhone || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Email Address</p>
              <p className="text-primary text-sm sm:text-base break-all">{dealer.contactEmail || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Contact Person</p>
              <p className="text-primary text-sm sm:text-base">{dealer.contactPerson || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Rating</p>
              <p className="text-primary text-sm sm:text-base">{dealer.rating ? `${dealer.rating}/5` : '-'}</p>
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div>
          <h3 className="font-semibold text-primary text-sm sm:text-base mb-3 sm:mb-4">Business Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Commercial Reg. Number</p>
              <p className="text-primary text-sm sm:text-base">{dealer.commercialRegNumber || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">VAT Number</p>
              <p className="text-primary text-sm sm:text-base">{dealer.vatNumber || '-'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Country</p>
              <p className="text-primary text-sm sm:text-base">{dealer.address?.country || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">City</p>
              <p className="text-primary text-sm sm:text-base">{dealer.address?.city || '-'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Address</p>
              <p className="text-primary text-sm sm:text-base">{dealer.address?.street || '-'}</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        {dealer.bankDetails && (
          <div>
            <h3 className="font-semibold text-primary text-sm sm:text-base mb-3 sm:mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs text-gray-400 mb-1">Bank Name</p>
                <p className="text-primary text-sm sm:text-base">{dealer.bankDetails.bankName || '-'}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs text-gray-400 mb-1">Account Number</p>
                <p className="text-primary text-sm sm:text-base">{dealer.bankDetails.accountNumber || '-'}</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs text-gray-400 mb-1">IBAN</p>
                <p className="text-primary text-sm sm:text-base break-all">{dealer.bankDetails.iban || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Documents */}
        {dealer.documents && dealer.documents.length > 0 && (
          <div>
            <h3 className="font-semibold text-primary text-sm sm:text-base mb-3 sm:mb-4">Business Documents</h3>
            <div className="space-y-2 sm:space-y-3">
              {dealer.documents.map((doc, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs sm:text-sm text-gray-600 truncate block">{doc.name || doc.type}</span>
                      <p className="text-xs text-gray-400">{doc.type}</p>
                    </div>
                  </div>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs sm:text-sm ml-2 flex-shrink-0">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loan Statistics */}
        <div>
          <h3 className="font-semibold text-primary text-sm sm:text-base mb-3 sm:mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Total Loans</p>
              <p className="text-primary text-xl sm:text-2xl font-bold">{dealer.totalLoans || 0}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs text-gray-400 mb-1">Approved Loans</p>
              <p className="text-primary text-xl sm:text-2xl font-bold">{dealer.totalApprovedLoans || 0}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          {dealer.status === 'pending' && (
            <Button onClick={() => setShowApproveModal(true)}>
              Approve Dealer
            </Button>
          )}
          {dealer.status === 'active' && (
            <Button variant="secondary" onClick={() => setShowBlockModal(true)}>
              Block Account
            </Button>
          )}
          {dealer.status === 'blocked' && (
            <Button onClick={handleUnblock} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Unblock Account'}
            </Button>
          )}
          {dealer.status === 'deleted' && (
            <Button onClick={handleRestore} disabled={actionLoading}>
              {actionLoading ? 'Processing...' : 'Restore Account'}
            </Button>
          )}
          {dealer.status !== 'deleted' && (
            <Button variant="secondary" onClick={() => setShowDeleteModal(true)}>
              Delete Account
            </Button>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Approve this dealer?">
        <p className="text-gray-600 mb-6">
          This will activate the dealer account and allow them to submit loan applications.
        </p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={actionLoading}>
            {actionLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </Modal>

      {/* Block Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title="Block this dealer?">
        <p className="text-gray-600 mb-4">
          Please provide a reason for blocking this dealer.
        </p>
        <textarea
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          rows={3}
        />
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleBlock} disabled={actionLoading || !blockReason.trim()}>
            {actionLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete this dealer?">
        <p className="text-gray-600 mb-4">
          Please provide a reason for deleting this dealer.
        </p>
        <textarea
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          placeholder="Enter reason..."
          className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black"
          rows={3}
        />
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={actionLoading}>
            {actionLoading ? 'Processing...' : 'Confirm'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
