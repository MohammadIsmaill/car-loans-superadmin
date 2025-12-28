'use client';

import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';

export default function Income() {
  return (
    <>
      <DashboardHeader title="Income" />
      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Income Overview</h2>
          <p className="text-gray-500">Track platform revenue and financial reports</p>
        </div>
      </Card>
    </>
  );
}
