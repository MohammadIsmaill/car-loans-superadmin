'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Footer from '@/components/Footer';

export default function DealershipSuccess() {
  const router = useRouter();

  const handleSendNotification = () => {
    // API call to send notification
    router.push('/dealers');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <Link href="/dashboard" className="text-2xl font-extrabold text-primary">
          CarTIBI
        </Link>
        <button
          onClick={() => router.push('/dealers')}
          className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">
            Dealership Details Input Requested
          </h1>

          <p className="text-gray-500 mb-12">
            This dealership has been successfully registered and they are requested to complete details for profile setup.
          </p>

          <Button variant="secondary" onClick={handleSendNotification} className="max-w-xs mx-auto">
            Send Notification
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
