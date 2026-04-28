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

import { Eye, Edit, Trash2 } from 'lucide-react'
import { ChartCard } from './chart-card'

// TODO: Reemplazar con datos de API real
const products = [
  {
    id: 1,
    name: 'Wireless Mouse',
    sku: 'SKU-001',
    category: 'Electronics',
    quantity: 342,
    price: '$24.99',
    value: '$8,543',
    status: 'In Stock',
  },
  {
    id: 2,
    name: 'USB-C Cable',
    sku: 'SKU-002',
    category: 'Electronics',
    quantity: 85,
    price: '$12.99',
    value: '$1,104',
    status: 'Low Stock',
  },
  {
    id: 3,
    name: 'Laptop Stand',
    sku: 'SKU-003',
    category: 'Electronics',
    quantity: 156,
    price: '$49.99',
    value: '$7,799',
    status: 'In Stock',
  },
  {
    id: 4,
    name: 'Desk Lamp',
    sku: 'SKU-004',
    category: 'Office',
    quantity: 23,
    price: '$35.99',
    value: '$828',
    status: 'Low Stock',
  },
  {
    id: 5,
    name: 'Office Chair',
    sku: 'SKU-005',
    category: 'Furniture',
    quantity: 42,
    price: '$189.99',
    value: '$7,980',
    status: 'In Stock',
  },
]

export function ProductTable() {
  return (
    <ChartCard title="Top Products" subtitle="Most valuable items in inventory">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Product</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">SKU</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Category</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Qty</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Price</th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Value</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 text-foreground font-medium">{product.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{product.sku}</td>
                <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                <td className="py-3 px-4 text-right text-foreground">{product.quantity}</td>
                <td className="py-3 px-4 text-right text-foreground">{product.price}</td>
                <td className="py-3 px-4 text-right font-medium text-foreground">{product.value}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'In Stock'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    {/* View Button */}
                    <button className="p-1.5 hover:bg-muted rounded transition-colors">
                      <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    
                    {/* Edit Button */}
                    <button className="p-1.5 hover:bg-muted rounded transition-colors">
                      <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    
                    {/* Delete Button */}
                    <button className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600 dark:hover:text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  )
}
