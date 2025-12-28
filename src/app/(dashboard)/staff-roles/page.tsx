'use client';

import DashboardHeader from '@/components/DashboardHeader';
import Card from '@/components/Card';

export default function StaffRoles() {
  return (
    <>
      <DashboardHeader title="Staff Roles" />
      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-400 mb-2">Staff Roles Management</h2>
          <p className="text-gray-500">Configure staff roles and permissions</p>
        </div>
      </Card>
    </>
  );
}
