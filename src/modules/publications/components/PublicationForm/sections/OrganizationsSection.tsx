import React from 'react';
import { Select } from '@/components/Select';
import type { CreatePublicationDto } from '@/types/publication';
import type { OrganizationDto } from '@/types/organization';
import { Info } from '@/components/Info';

interface OrganizationsSectionProps {
  formData: CreatePublicationDto;
  userOrganizations: OrganizationDto[];
  onOrganizersChange: (orgId: string) => void;
}

export function OrganizationsSection({
  formData,
  userOrganizations,
  onOrganizersChange,
}: OrganizationsSectionProps) {
  if (userOrganizations.length === 0) {
    return null;
  }

  const organizationOptions = userOrganizations.map((org) => ({
    value: org.id,
    label: org.name || org.acronym || org.id,
  }));

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-lg font-medium text-primary">Organizaciones *</h3>

      <Info
        title=""
        description="Selecciona las organizaciones que están asociadas a esta publicación. Esto ayuda a categorizar y dar credibilidad al contenido. Puedes seleccionar una o más."
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {formData.organizers?.map((orgId) => {
          const org = userOrganizations.find((o) => o.id === orgId);
          return (
            <div
              key={orgId}
              className="flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1"
            >
              <span className="text-purple-700">{org ? org.name || org.acronym : orgId}</span>
              <button
                type="button"
                onClick={() => onOrganizersChange(orgId)}
                className="text-purple-500 transition-colors hover:text-red-500"
              >
                &times;
              </button>
            </div>
          );
        })}

        {(!formData.organizers || formData.organizers.length === 0) && (
          <p className="text-sm italic text-gray-500">No hay organizaciones seleccionadas</p>
        )}
      </div>

      <Select
        label="Agregar organización"
        options={organizationOptions.filter(
          (option) => !formData.organizers?.includes(option.value)
        )}
        value=""
        onChange={onOrganizersChange}
      />
    </div>
  );
}
