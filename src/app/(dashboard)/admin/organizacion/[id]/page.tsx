import OrganizationDetails from "@/modules/admin/components/Organization/OrganizationDetails";
import { useAdminOrganizationDetails } from "@/modules/admin/hooks/useAdminOrganizationDetails";
import { useParams, useRouter } from "next/navigation";

export default function OrganizationsDetailPage() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
            <OrganizationDetails />
        </div>
    );
}