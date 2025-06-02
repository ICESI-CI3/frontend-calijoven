"use client"

import { Alert } from "@/components/Alert"
import { Avatar } from "@/components/Avatar"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Input } from "@/components/Input"
import { Modal } from "@/components/Modal"
import { SearchInput } from "@/components/SearchInput"
import { Spinner } from "@/components/Spinner"
import { Tabs, TabsList, TabsTrigger } from "@/components/Tabs"
import { useAdminOrganizationDetails } from "@/modules/admin/hooks/useAdminOrganizationDetails"
import { CommitteeCreateRequest } from "@/types/committee"
import { CommitteeDto } from "@/types/organization"
import {
    ArrowLeftIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UserGroupIcon,
    UserMinusIcon,
    UserPlusIcon
} from "@heroicons/react/24/outline"
import { useParams, useRouter } from "next/navigation"
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
  const [activeTab, setActiveTab] = useState("info")
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [memberEmail, setMemberEmail] = useState("")
  const [isCreateCommitteeModalOpen, setIsCreateCommitteeModalOpen] = useState(false)
  const [isAddCommitteeMemberModalOpen, setIsAddCommitteeMemberModalOpen] = useState(false)
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeDto | null>(null)
  const [newCommitteeData, setNewCommitteeData] = useState<CommitteeCreateRequest>({
    name: "",
    leaderEmail: "",
  })
  const [committeeMemberEmail, setCommitteeMemberEmail] = useState("")

  const router = useRouter();
  const params = useParams();
  const organizationId = params.id as string;

  const {
      organization,
      isLoading,
      isError,
      error,
      formData,
      setFormData,
      membersTabData,
      committeeTabData,
      documentTabData,
      setMembersTabData,
      setCommitteeTabData,
      setDocumentTabData,
      addMember,
      removeMember,  
      refetch,
      createCommittee,
      updateCommittee,
      deleteCommittee,
      addCommitteeMember,
      removeCommitteeMember,
      isCreatingCommittee,
      isUpdatingCommittee,
      isDeletingCommittee,
      isAddingCommitteeMember,
      isRemovingCommitteeMember,
  } = useAdminOrganizationDetails(organizationId);

  const handleAddMember = (userId: string) => {
      addMember(userId);
  };

  const handleRemoveMember = (userId: string) => {
      removeMember(userId);
  };

  const handleAddMemberSubmit = () => {
    if (memberEmail) {
      handleAddMember(memberEmail)
      setMemberEmail("")
      setIsAddMemberModalOpen(false)
    }
  }

  const handleCreateCommittee = () => {
    if (newCommitteeData.name && newCommitteeData.leaderEmail) {
      createCommittee(newCommitteeData)
      setNewCommitteeData({ name: "", leaderEmail: "" })
      setIsCreateCommitteeModalOpen(false)
    }
  }

  const handleAddCommitteeMember = () => {
    if (selectedCommittee && committeeMemberEmail) {
      addCommitteeMember({ committeeId: selectedCommittee.id, email: committeeMemberEmail })
      setCommitteeMemberEmail("")
      setIsAddCommitteeMemberModalOpen(false)
    }
  }

  const handleRemoveCommitteeMember = (committeeId: string, userId: string) => {
    removeCommitteeMember({ committeeId, userId })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (isError && !organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <Alert
            type="error"
            message={error instanceof Error ? error.message : 'Error al cargar la organización'}	
          />
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={() => refetch()}>Reintentar</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-12 text-center">
          <p className="mb-4 text-red-600">Organización no encontrada</p>
          <Button variant="outline" onClick={() => router.back()}>
            Volver
          </Button>
        </div>
      </div>
    );
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

      <div className="flex flex-col gap-4">
        {/* Organization Detail Section */}
        <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <Avatar name={organization.name} size="xl" />
          <div className="text-start">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold leading-tight text-foreground">{organization.name}</h2>
            <p>{organization.acronym}</p>
          </div>
        </div>

        <div className="">
          <Tabs defaultValue="members" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="members">Miembros</TabsTrigger>
              <TabsTrigger value="committees">Comités</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
            </TabsList>

            {activeTab === "members" && (
              
              <div className="space-y-2 mt-4">
                { /* Search Bar */ }
                <div className="flex flex-row gap-3">
                  <div className="flex-1">
                    <SearchInput
                      onSearch={(value) => console.log("Buscar:", value)}
                      placeholder="Buscar usuarios..."
                      className="h-12 w-full"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setIsAddMemberModalOpen(true)}
                    >
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      Agregar Miembro
                    </Button>
                  </div>
                </div>
                {membersTabData.members.map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="flex flex-row gap-3">
                      <Avatar src={ member.profilePicture } size="lg" />
                      <div>
                        <div className="font-medium">{ member.name }</div>
                        <div className="text-sm text-gray-500">{ member.email }</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                      <span className="sr-only">Eliminar miembro</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "committees" && (
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Comités</h2>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCreateCommitteeModalOpen(true)}
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Crear Comité
                  </Button>
                </div>

                <div className="grid gap-4">
                  {committeeTabData.committees.map((committee) => (
                    <Card
                      key={committee.id}
                      title={committee.name}
                      icon={<Cog6ToothIcon className="w-5 h-5 text-primary" />}
                      color="primary"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Líder: {committee.leader.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {committee.members.length} miembros
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCommittee(committee)
                                setIsAddCommitteeMemberModalOpen(true)
                              }}
                            >
                              <UserPlusIcon className="w-4 h-4 mr-2" />
                              Agregar Miembro
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteCommittee(committee.id)}
                              disabled={isDeletingCommittee}
                            >
                              <TrashIcon className="w-4 h-4 mr-2" />
                              Eliminar
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Miembros</h4>
                          <div className="space-y-2">
                            {committee.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    name={member.name}
                                    src={member.profilePicture}
                                    size="sm"
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                                {member.id !== committee.leader.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveCommitteeMember(committee.id, member.id)
                                    }
                                    disabled={isRemovingCommitteeMember}
                                  >
                                    <UserMinusIcon className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
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

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => {
          setIsAddMemberModalOpen(false)
          setMemberEmail("")
        }}
        title="Agregar Miembro"
      >
        <div className="space-y-4">
          <Input
            label="Email del usuario"
            type="email"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddMemberModalOpen(false)
                setMemberEmail("")
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMemberSubmit}
              disabled={!memberEmail}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Committee Modal */}
      <Modal
        isOpen={isCreateCommitteeModalOpen}
        onClose={() => setIsCreateCommitteeModalOpen(false)}
        title="Crear Nuevo Comité"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Comité"
            value={newCommitteeData.name}
            onChange={(e) =>
              setNewCommitteeData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <Input
            label="Email del Líder"
            value={newCommitteeData.leaderEmail}
            onChange={(e) =>
              setNewCommitteeData((prev) => ({ ...prev, leaderEmail: e.target.value }))
            }
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateCommitteeModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateCommittee}
              disabled={isCreatingCommittee}
            >
              Crear Comité
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Committee Member Modal */}
      <Modal
        isOpen={isAddCommitteeMemberModalOpen}
        onClose={() => setIsAddCommitteeMemberModalOpen(false)}
        title="Agregar Miembro al Comité"
      >
        <div className="space-y-4">
          <Input
            label="Email del Miembro"
            value={committeeMemberEmail}
            onChange={(e) => setCommitteeMemberEmail(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddCommitteeMemberModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleAddCommitteeMember}
              disabled={isAddingCommitteeMember}
            >
              Agregar Miembro
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
