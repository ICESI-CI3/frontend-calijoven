import { Button } from '@/components/Button';
import { ROUTES } from '@/lib/constants/routes';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function OrganizationsHeader() {
  const router = useRouter();

  const handleNewOrganization = () => {
    const url = ROUTES.ADMIN.ORGANIZATION_CREATE.PATH;
    router.push(url);
  }

  return (
    <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold text-blue-600">Gestión de Organizaciones</h1>
        <p className="text-gray-600">Administra las organizaciones del sistema</p>
        </div>
        <Button variant="primary" size="md" onClick={handleNewOrganization}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Nueva Organización
        </Button>
    </div>
  );
}