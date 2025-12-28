'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

interface UserDetail {
  id: string;
  userName: string;
  phoneNumber: string;
  emailAddress: string;
}

// Mock data
const mockUser: UserDetail = {
  id: '20199880',
  userName: '',
  phoneNumber: '',
  emailAddress: '',
};

export default function UserDetail() {
  const router = useRouter();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const user = mockUser;

  const handleBlock = () => {
    // API call to block user
    setShowBlockModal(false);
    router.push('/users');
  };

  const handleDelete = () => {
    // API call to delete user
    setShowDeleteModal(false);
    router.push('/users');
  };

  return (
    <>
      <DashboardHeader title="User Management" />

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 mb-6 hover:text-primary"
      >
        Back
      </button>

      <div className="space-y-6">
        {/* User Details */}
        <div>
          <h3 className="font-semibold text-primary mb-4">Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">User Name</p>
                <p className="text-primary">{user.userName || '-'}</p>
              </div>
              <button className="text-gray-400 hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Phone Number</p>
                <p className="text-primary">{user.phoneNumber || '-'}</p>
              </div>
              <button className="text-gray-400 hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Email Address</p>
                <p className="text-primary">{user.emailAddress || '-'}</p>
              </div>
              <button className="text-gray-400 hover:text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBlockModal(true)}
                className="text-sm font-medium hover:underline"
              >
                Block Account
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-sm font-medium hover:underline"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Block Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title="Are you sure you want to block this user?">
        <p className="text-gray-600 mb-6">
          Please confirm that you are approving this step. It is not final and can be undone if needed.
        </p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowBlockModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleBlock}>
            Confirm
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Are you sure you want to delete this user?">
        <p className="text-gray-600 mb-6">
          This action cannot be undone. All data associated with this user will be permanently removed.
        </p>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>
            Confirm
          </Button>
        </div>
      </Modal>
    </>
  );
}
