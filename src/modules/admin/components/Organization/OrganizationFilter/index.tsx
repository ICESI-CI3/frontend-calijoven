import { SearchInput } from "@/components/SearchInput";

interface OrganizationFilterProps {
    onSearchChange: (value: string) => void
}

export default function OrganizationFilter({
    onSearchChange
}: OrganizationFilterProps) {
    return (
        <div className="flex flex-col gap-y-2">
            {/* Barra de búsqueda arriba */}
            <div className="w-full">
            <SearchInput
                onSearch={onSearchChange}
                placeholder="Buscar publicaciones..."
                className="h-12"
            />
            </div>
        </div>
    )
}