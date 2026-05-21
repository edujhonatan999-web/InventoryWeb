'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ApiMovementItem {
  id: number
  product_id?: number
  department_id?: number
  quantity: number
  movement_type: 'in' | 'out'
  description: string
  movement_date: string
  created_at: string
  updated_at: string
  product?: {
    id?: number
    name?: string
  } | null
  department?: {
    id?: number
    name?: string
  } | null
}

interface ProductOption {
  id: number
  name: string
}

interface DepartmentOption {
  id: number
  name: string
}

interface NewMovementForm {
  product_id: string
  department_id: string
  quantity: string
  movement_type: 'in' | 'out'
  description: string
  movement_date: string
}

type ModalMode = 'create' | 'edit'

interface ModalMovProps {
  trigger?: ReactNode
  mode?: ModalMode
  movement?: ApiMovementItem
  onMovementSaved: (movement: ApiMovementItem, mode: ModalMode) => void
}

const MOVEMENTS_ENDPOINT = 'http://localhost:4000/movements'
const PRODUCTS_ENDPOINT = 'http://localhost:4000/products'
const DEPARTMENTS_ENDPOINT = 'http://localhost:4000/departments'

const toDateTimeLocal = (date: Date) => {
  const pad = (value: number) => value.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`
}

export default function ModalMov({
  trigger,
  mode = 'create',
  movement,
  onMovementSaved,
}: ModalMovProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [products, setProducts] = useState<ProductOption[]>([])
  const [productsError, setProductsError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<DepartmentOption[]>([])
  const [departmentsError, setDepartmentsError] = useState<string | null>(null)
  const [newMovement, setNewMovement] = useState<NewMovementForm>({
    product_id: '',
    department_id: '',
    quantity: '',
    movement_type: 'in',
    description: '',
    movement_date: toDateTimeLocal(new Date()),
  })

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const fetchProducts = async () => {
      try {
        setProductsError(null)
        const response = await fetch(PRODUCTS_ENDPOINT)
        if (!response.ok) {
          throw new Error('No se pudo cargar los productos.')
        }

        const data = (await response.json()) as ProductOption[]
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        setProductsError(error instanceof Error ? error.message : 'Error al cargar productos.')
      }
    }

    const fetchDepartments = async () => {
      try {
        setDepartmentsError(null)
        const response = await fetch(DEPARTMENTS_ENDPOINT)
        if (!response.ok) {
          throw new Error('No se pudo cargar los departamentos.')
        }

        const data = (await response.json()) as DepartmentOption[]
        setDepartments(Array.isArray(data) ? data : [])
      } catch (error) {
        setDepartmentsError(error instanceof Error ? error.message : 'Error al cargar departamentos.')
      }
    }

    fetchProducts()
    fetchDepartments()

    if (mode === 'edit' && movement) {
      setNewMovement({
        product_id: (movement.product_id ?? movement.product?.id ?? '').toString(),
        department_id: (movement.department_id ?? movement.department?.id ?? '').toString(),
        quantity: movement.quantity.toString(),
        movement_type: movement.movement_type,
        description: movement.description,
        movement_date: movement.movement_date
          ? toDateTimeLocal(new Date(movement.movement_date))
          : toDateTimeLocal(new Date()),
      })
    } else {
      setNewMovement({
        product_id: '',
        department_id: '',
        quantity: '',
        movement_type: 'in',
        description: '',
        movement_date: toDateTimeLocal(new Date()),
      })
    }
    setAddError(null)
  }, [isOpen, mode, movement])

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setNewMovement((prev) => ({ ...prev, [name]: value }))
  }

  const resetMovement = () => {
    setNewMovement({
      product_id: '',
      department_id: '',
      quantity: '',
      movement_type: 'in',
      description: '',
      movement_date: toDateTimeLocal(new Date()),
    })
    setAddError(null)
  }

  const handleSaveMovement = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setAddError(null)

    if (mode === 'edit' && !movement) {
      setAddError('No hay movimiento seleccionado para editar.')
      setIsSaving(false)
      return
    }

    const productId = Number.parseInt(newMovement.product_id, 10)
    const departmentId = Number.parseInt(newMovement.department_id, 10)
    const quantity = Number.parseInt(newMovement.quantity, 10)

    if (!productId || !departmentId || !quantity) {
      setAddError('Completa el producto, departamento y la cantidad.')
      setIsSaving(false)
      return
    }

    const payload = {
      product_id: productId,
      department_id: departmentId,
      quantity,
      movement_type: newMovement.movement_type,
      description: newMovement.description.trim(),
      movement_date: newMovement.movement_date
        ? new Date(newMovement.movement_date).toISOString()
        : undefined,
    }

    try {
      const endpoint = mode === 'edit' ? `${MOVEMENTS_ENDPOINT}/${movement!.id}` : MOVEMENTS_ENDPOINT
      const response = await fetch(endpoint, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const createdMovement = (await response.json()) as ApiMovementItem
      onMovementSaved(createdMovement, mode)
      resetMovement()
      setIsOpen(false)
    } catch (error) {
      setAddError(error instanceof Error ? error.message : 'No se pudo guardar el movimiento.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetMovement()
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="flex-1 md:flex-none">
            <Plus className="w-5 h-5" />
            Nuevo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Editar movimiento' : 'Agregar movimiento'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Actualiza los datos del movimiento.'
              : 'Registra una entrada o salida de inventario.'}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSaveMovement}>
          <div className="space-y-2">
            <Label htmlFor="product_id">Producto</Label>
            <select
              id="product_id"
              name="product_id"
              value={newMovement.product_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecciona un producto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            {productsError && <p className="text-xs text-destructive">{productsError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="department_id">Departamento</Label>
            <select
              id="department_id"
              name="department_id"
              value={newMovement.department_id}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            {departmentsError && <p className="text-xs text-destructive">{departmentsError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="10"
              value={newMovement.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="movement_type">Tipo</Label>
            <select
              id="movement_type"
              name="movement_type"
              value={newMovement.movement_type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="in">Entrada</option>
              <option value="out">Salida</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripcion</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ingreso de mercaderia"
              value={newMovement.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="movement_date">Fecha</Label>
            <Input
              id="movement_date"
              name="movement_date"
              type="datetime-local"
              value={newMovement.movement_date}
              readOnly
              disabled
            />
          </div>
          {addError && <p className="text-sm text-destructive">{addError}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetMovement()
                setIsOpen(false)
              }}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? 'Guardando...'
                : mode === 'edit'
                ? 'Actualizar movimiento'
                : 'Guardar movimiento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
