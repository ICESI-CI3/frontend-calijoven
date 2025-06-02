'use client';

import OrganizationsList from '@/modules/admin/components/Organization/OrganizationList';
import OrganizationsHeader from '@/modules/admin/components/Organization/OrganizationsHeader';

export default function OrganizationsPage() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            <OrganizationsHeader/>
            <OrganizationsList/>
        </div>
    );
}