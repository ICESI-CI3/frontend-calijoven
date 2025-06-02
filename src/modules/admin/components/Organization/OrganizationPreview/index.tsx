"use client";

import { Avatar } from "@/components/Avatar"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { ROUTES } from "@/lib/constants/routes";
import { OrganizationPreviewDto } from "@/types/organization";
import { Cog6ToothIcon, DocumentTextIcon, EyeIcon, UsersIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation";

export default function OrganizationPreview(org: OrganizationPreviewDto) {
    const router = useRouter();
    
    const handleViewDetails = () => {
        const url = ROUTES.ADMIN.ORGANIZATION_DETAIL(org.id).PATH;
        router.push(url);
    }

    const handleEditOrganization = () => {
        const url = ROUTES.ADMIN.ORGANIZATION_EDIT(org.id).PATH;
        router.push(url);
    }

    return (
      <div className="bg-white shadow rounded-lg p-4 max-w" key={org.id}>
            <div className="flex items-center justify-between gap-4">
                {/* Organization Header */}
              <div className="flex items-center space-x-4 min-w-0 flex-[2]">
                <Avatar 
                  name={org.acronym}
                  size="lg"
                  className="bg-blue-100 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">{org.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge>{org.public ? "Pública" : "Privada"}</Badge>
                  </div>
                </div>
              </div>

              {/* Organization Metadata */}
              <div className="flex flex-row gap-4 text-sm flex-[1.5] justify-center">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <UsersIcon className="w-4 h-4 text-gray-400" />
                  <span>{org.membersCount} miembros</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                  <span>{org.documentsCount} documentos</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Cog6ToothIcon className="w-4 h-4 text-gray-400" />
                  <span>{org.committeesCount} comités</span>
                </div>
              </div>

              {/* Actions Buttons */}
              <div className="flex space-x-2 flex-[1] justify-end">
                <Button variant="outline" size="sm" onClick={handleEditOrganization}>
                  <Cog6ToothIcon className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button variant="primary" size="sm" onClick={handleViewDetails}>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  Ver Detalles  
                </Button>
              </div>
            </div>
          </div>
    );
    }