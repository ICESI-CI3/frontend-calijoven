'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { CommitteeForm } from '@/modules/committee/components/CommitteeForm';
import { CommitteeService } from '@/modules/committee/services/committee.service';
import type { CreateCommitteeDto } from '@/types/committee';

export default function NewCommitteePage() {
  const router = useRouter();
  // TODO: Obtener el organizationId del contexto o configuración
  const organizationId = process.env.NEXT_PUBLIC_ORGANIZATION_ID || '';

  const handleSubmit = async (data: CreateCommitteeDto) => {
    await CommitteeService.createCommittee(organizationId, data);
    router.push('/comites');
  };

  const handleCancel = () => {
    router.push('/comites');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <a
          href="/comites"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver a Comités
        </a>
      </div>

      <Card title="Crear Nuevo Comité">
        <div className="p-6">
          <div className="prose max-w-none mb-6">
            <p>
              Complete el formulario para crear un nuevo comité. Los comités son grupos de trabajo
              especializados que ayudan a coordinar y desarrollar diferentes aspectos de nuestra
              organización.
            </p>
          </div>

          <CommitteeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </Card>
    </div>
  );
} 