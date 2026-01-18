'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { bankLoansAPI } from '@/lib/api';

export default function BankLoanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLoan = async () => {
      if (!id) {
        setError('No loan ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await bankLoansAPI.getById(id);
        if (response.success && response.data) {
          setLoan(response.data);
          setError('');
        } else {
          setError('Failed to load loan details');
        }
      } catch (err: any) {
        console.error('Failed to fetch loan:', err);
        setError(err.response?.data?.error?.message || err.response?.data?.message || 'Failed to load loan details');
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [id]);

  // Calculate time left from deadline
  const getTimeLeft = (deadline?: string): string => {
    if (!deadline) return 'No deadline';
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) return `${hours}h ${minutes}mins ${seconds}sec`;
    if (minutes > 0) return `${minutes}mins ${seconds}sec`;
    return `${seconds}sec`;
  };

  // Get phase status
  const getPhaseStatus = (phase: any): string => {
    if (!phase) return 'not_started';
    return phase.status || 'not_started';
  };

  // Get progress percentage
  const getPhaseProgress = (phase: any): number => {
    if (!phase) return 0;
    if (phase.status === 'completed' || phase.status === 'approved') return 100;
    if (phase.status === 'in_progress') return 50;
    if (phase.status === 'edits_required') return 50;
    return 0;
  };

  // Get progress bar color
  const getProgressColor = (progress: number, phase: any) => {
    if (!phase || progress === 0 || phase.status === 'not_started') {
      return 'bg-gray-200';
    }
    if (phase.status === 'rejected' || phase.status === 'edits_required') {
      return 'bg-red-500';
    }
    if (progress === 100 && (phase.status === 'completed' || phase.status === 'approved')) {
      return 'bg-green-500';
    }
    return 'bg-yellow-500';
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-900">Loading loan application...</div>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600">{error || 'Loan not found'}</div>
          <button
            onClick={() => router.push('/bank-loans')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg"
          >
            Back to Bank Loans
          </button>
        </div>
      </div>
    );
  }

  // Sort phases by order from backend
  const sortedPhases = loan.phases
    ? [...loan.phases].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-8 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">CarTIBI</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/bank-loans')}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white">
        {/* Title */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-gray-900">Loan Application Overview</h2>
          <p className="text-gray-500 mt-2">Loan ID: {loan.loanNumber} | Status: <span className="font-semibold capitalize">{loan.status}</span></p>
        </div>

        {/* Bank and Client Info */}
        <div className="flex flex-col items-center pb-8">
          <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full px-4">
            {/* Bank Info */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-500 mb-3">Financing Bank</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{loan.bank?.name || 'Not Selected'}</p>
                  {loan.bank?.code && (
                    <p className="text-sm text-gray-500">Code: {loan.bank.code}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex-1 bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-500 mb-3">Client Information</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{loan.customer?.name || loan.clientInfo?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{loan.customer?.phone || loan.clientInfo?.phone || 'No phone'}</p>
                  {(loan.customer?.nationalId || loan.clientInfo?.nationalId) && (
                    <p className="text-xs text-gray-400">ID: {loan.customer?.nationalId || loan.clientInfo?.nationalId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dealership Info */}
            {(loan.dealership || loan.phases?.find((p: any) => p.type === 'dealership_selection')?.data?.dealershipName) && (
              <div className="flex-1 bg-gray-50 rounded-xl p-6">
                <p className="text-sm text-gray-500 mb-3">Dealership</p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {loan.dealership?.name ||
                       loan.phases?.find((p: any) => p.type === 'dealership_selection')?.data?.dealershipName ||
                       'N/A'}
                    </p>
                    {loan.phases?.find((p: any) => p.type === 'dealership_selection')?.data?.dealershipCode && (
                      <p className="text-sm text-gray-500">
                        Code: {loan.phases.find((p: any) => p.type === 'dealership_selection')?.data?.dealershipCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* All Phases */}
        {sortedPhases.map((phase: any, index: number) => (
          <div key={phase.type || index} className="flex flex-col items-center py-8">
            <div className="w-full max-w-2xl border-t border-gray-200 mb-8"></div>
            <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
              <h3 className="text-xl font-bold text-gray-900">{phase.title || phase.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h3>

              {/* Always show description */}
              {phase.description && (
                <p className="text-gray-500">{phase.description}</p>
              )}

              {/* Status indicator */}
              {getPhaseStatus(phase) === 'completed' || getPhaseStatus(phase) === 'approved' ? (
                <p className="text-green-600 font-medium">Complete</p>
              ) : getPhaseStatus(phase) === 'in_progress' ? (
                <>
                  <p className="text-yellow-600 font-medium">In Progress</p>
                  {phase.deadline && (
                    <p className="text-sm text-gray-500">Time Left: <span className="font-medium">{getTimeLeft(phase.deadline)}</span></p>
                  )}
                </>
              ) : getPhaseStatus(phase) === 'edits_required' ? (
                <p className="text-orange-600 font-medium">Edits Required</p>
              ) : getPhaseStatus(phase) === 'rejected' ? (
                <p className="text-red-600 font-medium">Rejected</p>
              ) : (
                <p className="text-gray-400">Pending</p>
              )}

              {/* Assigned Users */}
              {phase.assignedUsers && phase.assignedUsers.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {phase.assignedUsers.map((user: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                      <div className="text-left">
                        <p className="text-base font-semibold text-gray-900">{user.userName || user.user?.name || 'User'}</p>
                        <p className="text-sm text-gray-500">{user.role || 'Assigned'}</p>
                        {user.status && user.status !== 'pending' && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            user.status === 'complete' || user.status === 'approved' ? 'bg-green-100 text-green-700' :
                            user.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status === 'complete' ? 'Approved' : user.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              <div className="w-full max-w-xs">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(getPhaseProgress(phase), phase)}`}
                    style={{ width: `${getPhaseProgress(phase)}%` }}
                  ></div>
                </div>
              </div>

              {/* Rejection Info */}
              {(phase.status === 'edits_required' || phase.status === 'rejected' || phase.rejectionInfo) && (
                <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4 mt-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-red-700">
                        {phase.status === 'rejected' ? 'Rejected' : 'Changes Requested'}
                      </p>
                      {phase.rejectionInfo?.reason && (
                        <p className="text-sm text-red-600 mt-1">{phase.rejectionInfo.reason}</p>
                      )}
                      {phase.rejectionInfo?.changesRequested && (
                        <p className="text-sm text-red-600 mt-1">{phase.rejectionInfo.changesRequested}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Vehicle Details Section */}
        {loan.vehicle && (
          <div className="flex flex-col items-center py-8">
            <div className="w-full max-w-2xl border-t border-gray-200 mb-8"></div>
            <div className="w-full max-w-4xl px-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vehicle Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Image */}
                <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '250px' }}>
                  {loan.vehicle?.images?.[0]?.url ? (
                    <img
                      src={loan.vehicle.images[0].url}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Make</p>
                      <p className="text-lg font-bold text-gray-900">{loan.vehicle?.make || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="text-lg font-bold text-gray-900">{loan.vehicle?.model || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="text-lg font-bold text-gray-900">{loan.vehicle?.year || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="text-lg font-bold text-gray-900">{loan.vehicle?.mileage ? `${loan.vehicle.mileage.toLocaleString()} km` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">VIN</p>
                      <p className="text-base text-gray-700">{loan.vehicle?.vin || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Color</p>
                      <p className="text-base text-gray-700">{loan.vehicle?.exteriorColor || 'N/A'}</p>
                    </div>
                  </div>
                  {loan.vehicle?.pricing?.salePrice && (
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="text-2xl font-bold text-gray-900">SAR {loan.vehicle.pricing.salePrice.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loan Financial Details */}
        {(loan.loanAmount || loan.downPayment || loan.tenure) && (
          <div className="flex flex-col items-center py-8">
            <div className="w-full max-w-2xl border-t border-gray-200 mb-8"></div>
            <div className="w-full max-w-4xl px-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Loan Financial Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {loan.loanAmount && (
                  <div>
                    <p className="text-sm text-gray-500">Loan Amount</p>
                    <p className="text-xl font-bold text-gray-900">SAR {loan.loanAmount.toLocaleString()}</p>
                  </div>
                )}
                {loan.downPayment && (
                  <div>
                    <p className="text-sm text-gray-500">Down Payment</p>
                    <p className="text-xl font-bold text-gray-900">SAR {loan.downPayment.toLocaleString()}</p>
                  </div>
                )}
                {loan.interestRate && (
                  <div>
                    <p className="text-sm text-gray-500">Interest Rate</p>
                    <p className="text-xl font-bold text-gray-900">{loan.interestRate}%</p>
                  </div>
                )}
                {loan.tenure && (
                  <div>
                    <p className="text-sm text-gray-500">Tenure</p>
                    <p className="text-xl font-bold text-gray-900">{loan.tenure} months</p>
                  </div>
                )}
                {loan.monthlyPayment && (
                  <div>
                    <p className="text-sm text-gray-500">Monthly Payment</p>
                    <p className="text-xl font-bold text-gray-900">SAR {loan.monthlyPayment.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
