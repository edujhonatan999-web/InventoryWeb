/**
 * COMPONENTE: ChartCard
 * 
 * PROPÓSITO:
 * - Contenedor reutilizable para gráficos
 * - Proporciona header con título y subtítulo
 * - Acepta cualquier componente hijo (gráficos, tablas, etc)
 * - Permite acciones adicionales (botones, dropdown, etc)
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Cambiar estilos y layout
 * - ✅ Agregar acciones adicionales
 * - ✅ Cambiar tamaño de padding/margin
 * 
 * CONEXIONES:
 * - Usado en: app/dashboard/page.tsx, components/stock-alerts.tsx, components/product-table.tsx
 * - Children: Recharts gráficos, tablas, o cualquier componente
 * 
 * PROPS:
 * - title: string (requerido) → Título del card
 * - subtitle: string (opcional) → Subtítulo o descripción
 * - children: ReactNode (requerido) → Contenido del card
 * - action: ReactNode (opcional) → Botón o componente de acción
 * 
 * EJEMPLO:
 * <ChartCard 
 *   title="Inventory Value Trend" 
 *   subtitle="Last 12 months"
 *   action={<button>Export</button>}
 * >
 *   <LineChart data={data} />
 * </ChartCard>
 */

import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      
      {/* Content */}
      <div className="text-foreground">
        {children}
      </div>
    </div>
  )
}
