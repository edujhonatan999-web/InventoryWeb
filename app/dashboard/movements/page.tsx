'use client'

import { useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import ModalMov from '@/components/modal-mov'
import ButtonDelete from '@/components/button-delete'
import ButtonExport from '@/components/button-export'

interface MovementItem {
  id: number
  productId: number | null
  quantity: number
  movementType: 'in' | 'out'
  description: string
  movementDate: string
  createdAt: string
  updatedAt: string
  productName: string
  departmentId: number | null
  departmentName: string
}

interface ApiMovementItem {
  id: number
  product?: {
    id?: number
    name?: string
  } | null
  quantity: number
  movement_type: 'in' | 'out'
  description: string
  movement_date: string
  created_at: string
  updated_at: string
  department?: {
    id?: number
    name?: string
  } | null
}

const mapMovement = (item: ApiMovementItem): MovementItem => ({
  id: item.id,
  productId: item.product?.id ?? null,
  productName: item.product?.name ?? 'Sin nombre',
  quantity: item.quantity,
  movementType: item.movement_type,
  description: item.description,
  movementDate: item.movement_date,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
  departmentId: item.department?.id ?? null,
  departmentName: item.department?.name ?? 'Sin departamento',
})

const toApiMovement = (item: MovementItem): ApiMovementItem => ({
  id: item.id,
  product: {
    id: item.productId ?? undefined,
    name: item.productName,
  },
  quantity: item.quantity,
  movement_type: item.movementType,
  description: item.description,
  movement_date: item.movementDate,
  created_at: item.createdAt,
  updated_at: item.updatedAt,
  department: {
    id: item.departmentId ?? undefined,
    name: item.departmentName,
  },
})
const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL
export default function InventoryPage() {
  const [movementData, setMovementData] = useState<MovementItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMovementType, setFilterMovementType] = useState<string>('todas')

  const handleMovementSaved = (movement: ApiMovementItem, mode: 'create' | 'edit') => {
    const mapped = mapMovement(movement)
    if (mode === 'edit') {
      setMovementData((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)))
      return
    }

    setMovementData((prev) => [mapped, ...prev])
  }

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)

        const response = await fetch(`${API_URL}/movements`)
        if (!response.ok) {
          throw new Error('No se pudo cargar los movimientos.')
        }

          const data = (await response.json()) as ApiMovementItem[]
          const mappedData = Array.isArray(data) ? data.map(mapMovement) : []
          setMovementData(mappedData)
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Error inesperado.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovements()
  }, [])

  const filteredData = movementData.filter((item) => {
    const matchesSearch =
      item.id.toString().includes(searchTerm) ||
      (item.productId ? item.productId.toString().includes(searchTerm) : false) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterMovementType === 'todas' || item.movementType === filterMovementType

    return matchesSearch && matchesType
  })

  const movementTypes = ['todas', 'in', 'out']

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'out':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'in':
        return 'Entrada'
      case 'out':
        return 'Salida'
      default:
        return type
    }
  }

  const formatDate = (value: string) => {
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return value
    }

    return parsed.toLocaleString('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const handleDeleteMovement = async (id: number) => {
    try {
      if (!API_URL) {
        throw new Error('Falta configurar NEXT_PUBLIC_BACKEND_URL.')
      }

      const response = await fetch(`${API_URL}/movements/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      setMovementData((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      console.error(error)
      window.alert(error instanceof Error ? error.message : 'No se pudo eliminar el movimiento.')
    }
  }

  const exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'productName', label: 'Producto' },
    { key: 'departmentName', label: 'Departamento' },
    { key: 'quantity', label: 'Cantidad' },
    { key: 'movementType', label: 'Tipo', format: (value: unknown) => getMovementTypeLabel(String(value)) },
    { key: 'description', label: 'Descripcion' },
    { key: 'movementDate', label: 'Fecha', format: (value: unknown) => formatDate(String(value)) },
    { key: 'createdAt', label: 'Creado', format: (value: unknown) => formatDate(String(value)) },
    { key: 'updatedAt', label: 'Actualizado', format: (value: unknown) => formatDate(String(value)) },
  ] satisfies Array<{
    key: keyof MovementItem
    label: string
    format?: (value: unknown, row: MovementItem) => string
  }>

  return (
    <div className="p-8 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Movimientos </h1>
        <p className="text-muted-foreground mt-2">Gestion de entradas y salidas de inventario</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por ID, producto o descripcion"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Movement Type Filter */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-foreground mb-2">Tipo</label>
          <select
            value={filterMovementType}
            onChange={(e) => setFilterMovementType(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {movementTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'todas' ? 'Todos' : getMovementTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <ModalMov
            onMovementSaved={handleMovementSaved}
            trigger={
              <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Nuevo
              </button>
            }
          />
          <ButtonExport
            data={filteredData}
            columns={exportColumns}
            filename="movements-export.xlsx"
            label="Export Excel"
          />
          <ButtonExport
            data={filteredData}
            columns={exportColumns}
            format="pdf"
            filename="movements-export.pdf"
            label="Export PDF"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground">Cargando movimientos...</p>
          </div>
        ) : loadError ? (
          <div className="p-12 text-center">
            <p className="text-destructive">{loadError}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Departamento</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cantidad</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tipo de Movimiento</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Descripcion</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Creado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actualizado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.productName}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{item.departmentName}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getMovementTypeColor(
                            item.movementType
                          )}`}
                        >
                          {getMovementTypeLabel(item.movementType)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(item.movementDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <ModalMov
                            mode="edit"
                            movement={toApiMovement(item)}
                            onMovementSaved={handleMovementSaved}
                            trigger={
                              <button className="px-2 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium">
                                Edit
                              </button>
                            }
                          />
                          <ButtonDelete
                            onConfirm={() => handleDeleteMovement(item.id)}
                            trigger={
                              <button className="px-2 py-1 text-destructive hover:bg-destructive/10 rounded transition-colors text-xs font-medium">
                                Delete
                              </button>
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredData.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">
                  No hay movimientos que coincidan con tus filtros.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Movimientos</p>
          <p className="text-2xl font-bold text-foreground">{movementData.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Entradas</p>
          <p className="text-2xl font-bold text-green-600">
            {movementData.filter((i) => i.movementType === 'in').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Salidas</p>
          <p className="text-2xl font-bold text-red-600">
            {movementData.filter((i) => i.movementType === 'out').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Ultima fecha</p>
          <p className="text-2xl font-bold text-foreground">
            {movementData[0]?.movementDate ? formatDate(movementData[0].movementDate) : '-'}
          </p>
        </div>
      </div>
    </div>
  )
}
