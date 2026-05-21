/**
 * COMPONENTE: ProductTable
 * 
 * PROPÓSITO:
 * - Tabla que muestra los productos más valiosos del inventario
 * - Muestra: Nombre, SKU, Categoría, Cantidad, Precio, Valor Total, Estado
 * - Acciones: Ver, Editar, Eliminar (placeholders)
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Cambiar datos (reemplazar mock data con API)
 * - ✅ Agregar/remover columnas
 * - ✅ Implementar acciones
 * - ✅ Agregar paginación
 * 
 * CONEXIONES:
 * - Usado en: app/dashboard/page.tsx
 * - Data: Mock data (líneas 4-55) → REEMPLAZAR con API
 * 
 * TODO FUTURO:
 * - Conectar a API real
 * - Agregar paginación
 * - Implementar búsqueda/filtros
 * - Hacer acciones (Edit, Delete) funcionales
 * - Agregar loader mientras carga
 * 
 * NOTA:
 * - Los datos están mockeados, edita el array "products" para cambiar
 * - Los botones de acción no hacen nada (placeholders)
 */

import { ChartCard } from './chart-card'

export interface ProductRow {
	id: number
	name: string
	category: string
	quantity: number
	status: string
	updatedAt: string
}

interface ProductTableProps {
	rows: ProductRow[]
	isLoading?: boolean
}

export function ProductTable({ rows, isLoading = false }: ProductTableProps) {
  return (
    <ChartCard title="Productos" subtitle="Resumen de inventario">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Producto</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Categoria</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Stock</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Actualizado</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="py-4 px-4 text-muted-foreground" colSpan={5}>
                  Cargando productos...
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td className="py-4 px-4 text-muted-foreground" colSpan={5}>
                  No hay productos para mostrar.
                </td>
              </tr>
            )}
            {!isLoading && rows.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-medium">{product.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                <td className="py-3 px-4 text-right text-foreground">{product.quantity}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'En stock'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{product.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}
