"use client"

import { Avatar } from "@/components/Avatar"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Tabs, TabsList, TabsTrigger } from "@/components/Tabs"
import { cn } from "@/lib/utils"
import {
  ArrowLeftIcon,
  BellIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  PencilIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline"
import { useState } from "react"

interface Member {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface Committee {
  id: string
  name: string
  description: string
  membersCount: number
}

interface Document {
  id: string
  title: string
  type: string
  createdAt: string
}

interface Publication {
  id: string
  title: string
  status: string
  publishedAt?: string
}

const mockMembers: Member[] = [
  { id: "1", name: "Ana García", email: "ana@ini.org", role: "Administrador" },
  { id: "2", name: "Carlos López", email: "carlos@ini.org", role: "Investigador" },
  { id: "3", name: "María Rodríguez", email: "maria@ini.org", role: "Coordinador" },
]

const mockCommittees: Committee[] = [
  { id: "1", name: "Comité de Ética", description: "Supervisión ética de investigaciones", membersCount: 5 },
  { id: "2", name: "Comité Técnico", description: "Revisión técnica de proyectos", membersCount: 8 },
]

const mockDocuments: Document[] = [
  { id: "1", title: "Reglamento Interno", type: "Normativo", createdAt: "2024-01-15" },
  { id: "2", title: "Plan Estratégico 2024", type: "Planificación", createdAt: "2024-02-01" },
]

const mockPublications: Publication[] = [
  { id: "1", title: "Avances en Investigación 2024", status: "Publicado", publishedAt: "2024-03-01" },
  { id: "2", title: "Informe Anual", status: "En Revisión" },
]

export default function OrganizationDetails() {
  const [isPublic, setIsPublic] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState("info")

  const organization = {
    id: "1",
    name: "Instituto Nacional de Investigación",
    acronym: "INI",
    public: isPublic,
    description: "Organización dedicada a la investigación científica y desarrollo tecnológico",
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">Detalles de la Organización</h1>
            <p className="text-muted-foreground">Información completa y gestión</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button variant="primary" size="md">
            <PencilIcon className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Detail Section */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-lg shadow text-center h-full">
          <Avatar name={organization.name} size="2xl" />
          <div className="text-center">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold leading-tight text-foreground">{organization.name}</h2>
            <p>{organization.acronym}</p>
          </div>
          <p className="text-muted-foreground">{organization.description}</p>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="members" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="members">Miembros</TabsTrigger>
              <TabsTrigger value="committees">Comités</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            {activeTab === "members" && (
              <div className="space-y-4 mt-4">
                <Card
                  title={`Miembros (${mockMembers.length})`}
                  icon={<UserGroupIcon className="w-5 h-5 text-primary" />}
                  color="primary"
                >
                  <div className="space-y-3">
                    {mockMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar name={member.name} size="md" />
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Badge variant="primary">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "committees" && (
              <div className="space-y-4 mt-4">
                <Card
                  title={`Comités (${mockCommittees.length})`}
                  icon={<Cog6ToothIcon className="w-5 h-5 text-primary" />}
                  color="primary"
                >
                  <div className="space-y-3">
                    {mockCommittees.map((committee) => (
                      <div key={committee.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{committee.name}</h4>
                          <span className="text-sm text-muted-foreground">{committee.membersCount} miembros</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{committee.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4 mt-4">
                <Card
                  title={`Documentos (${mockDocuments.length})`}
                  icon={<DocumentTextIcon className="w-5 h-5 text-primary" />}
                  color="primary"
                >
                  <div className="space-y-3">
                    {mockDocuments.map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{document.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Tipo: {document.type} • Creado: {document.createdAt}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
