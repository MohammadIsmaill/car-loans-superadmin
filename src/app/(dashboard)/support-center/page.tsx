'use client';

import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';

export default function SupportCenter() {
  return (
    <>
      <DashboardHeader title="Support Center" />
      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Support Center</h2>
          <p className="text-gray-500">Manage support tickets and customer inquiries</p>
        </div>
      </Card>
    </>
  );
}
