/**
 * COMPONENTE: MetricCard
 * 
 * PROPÓSITO:
 * - Tarjeta que muestra una métrica clave del dashboard
 * - Muestra valor, cambio vs período anterior, descripción
 * - Indica tendencia (positiva/negativa) con color
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Cambiar colors, tamaños, layout
 * - ✅ Agregar nuevas props
 * - ✅ Cambiar íconos de tendencia
 * 
 * CONEXIONES:
 * - Usado en: app/dashboard/page.tsx
 * - Props: title, value, change, changeLabel, description, highlight
 * 
 * PROPS:
 * - title: string → Nombre de la métrica (ej: "Total Stock Value")
 * - value: string → Valor principal (ej: "$124,580")
 * - change: string → Cambio % o texto (ej: "+12.5%", "-3.2%", "+2 items")
 * - changeLabel: string → Contexto del cambio (ej: "vs last month")
 * - description: string → Descripción completa
 * - highlight: boolean → Si es true, borde naranja para alertas
 * 
 * EJEMPLO:
 * <MetricCard
 *   title="Low Stock Items"
 *   value="12"
 *   change="+2 items"
 *   changeLabel="needs restocking"
 *   description="Products below minimum threshold"
 *   highlight={true}
 * />
 */

import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeLabel: string
  description: string
  highlight?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  description,
  highlight = false,
}: MetricCardProps) {
  const isPositive = change.startsWith('+')
  
  return (
    <div className={`bg-card border ${highlight ? 'border-accent' : 'border-border'} rounded-xl p-6`}>
      {/* Header: Title + Icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
        {highlight && (
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-accent" />
          </div>
        )}
      </div>
      
      {/* Trend Indicator */}
      <div className="flex items-center gap-1 mb-2">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {change}
        </span>
        <span className="text-sm text-muted-foreground">{changeLabel}</span>
      </div>
      
      {/* Description */}
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
