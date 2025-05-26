"use client"

import { useState } from "react"
import type { Publication } from "@/types/publication"
import RequireAuth from "@/modules/auth/components/RequireAuth"
import { PublicationList } from "@/components/PublicationList"
import { PublicationForm } from "@/components/PublicationForm"
import { ReportsSection } from "@/components/ReportsSection"

type ViewMode = "list" | "create" | "edit" | "reports"

export default function PublicationsDashboard() {
  const [currentView, setCurrentView] = useState<ViewMode>("list")
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication)
    setCurrentView("edit")
  }

  const handleCreateNew = () => {
    setSelectedPublication(null)
    setCurrentView("create")
  }

  const handleSuccess = () => {
    setCurrentView("list")
    setSelectedPublication(null)
  }

  const handleCancel = () => {
    setCurrentView("list")
    setSelectedPublication(null)
  }

  const renderNavigation = () => (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-8">
          <button
            onClick={() => setCurrentView("list")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentView === "list" || currentView === "edit" || currentView === "create"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Gestión de Publicaciones
          </button>
          <button
            onClick={() => setCurrentView("reports")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              currentView === "reports"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Reportes
          </button>
        </nav>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (currentView) {
      case "list":
        return <PublicationList onEdit={handleEdit} onCreateNew={handleCreateNew} />
      case "create":
        return <PublicationForm onSuccess={handleSuccess} onCancel={handleCancel} />
      case "edit":
        return (
          <PublicationForm
            publication={selectedPublication || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )
      case "reports":
        return <ReportsSection />
      default:
        return null
    }
  }

  return (
    <RequireAuth permissions={["MANAGE_PUBLICATION"]} requireAll>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo - Publicaciones</h1>
            <p className="mt-2 text-gray-600">
              Gestiona eventos, noticias y ofertas de la Plataforma Distrital de Juventudes
            </p>
          </div>
        </div>

        {renderNavigation()}

        <div className="container mx-auto px-4 py-6">{renderContent()}</div>
      </div>
    </RequireAuth>
  )
}
