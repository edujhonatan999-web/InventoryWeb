/**
 * COMPONENTE: StockAlerts
 * 
 * PROPÓSITO:
 * - Muestra alertas de inventario con diferentes estados
 * - Tipos: warning (amarillo), danger (rojo), success (verde), info (azul)
 * - Barra de progreso visual del stock
 * - Información de umbral mínimo
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Cambiar datos (reemplazar mock con API)
 * - ✅ Cambiar colores o íconos
 * - ✅ Agregar nuevas alertas
 * - ✅ Implementar acciones
 * 
 * CONEXIONES:
 * - Usado en: app/dashboard/page.tsx
 * - Data: Mock data (líneas 4-41) → REEMPLAZAR con API
 * 
 * TIPOS DE ALERTA:
 * - warning: Stock bajo pero disponible
 * - danger: Stock crítico, reorden urgente
 * - success: Stock saludable
 * - info: Pedido pendiente
 * 
 * TODO FUTURO:
 * - Conectar a API real
 * - Agregar acciones (Reorder button)
 * - Filtrar alertas por tipo
 * - Agregar timestamps
 */

import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { ChartCard } from './chart-card'

export interface StockAlertItem {
	id: number
	product: string
	alert: string
	quantity: number
	threshold: number
	type: 'warning' | 'danger' | 'success' | 'info'
}

interface StockAlertsProps {
	alerts: StockAlertItem[]
	isLoading?: boolean
}

export function StockAlerts({ alerts, isLoading = false }: StockAlertsProps) {
  return (
    <ChartCard title="Alertas de stock" subtitle="Estado actual del inventario">
      <div className="space-y-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Cargando alertas...</p>
        )}
        {!isLoading && alerts.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin alertas por el momento.</p>
        )}
        {!isLoading && alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            {/* Icon */}
            <div className="pt-1">
              {alert.type === 'warning' && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
              {alert.type === 'danger' && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              {alert.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {alert.type === 'info' && (
                <Clock className="w-5 h-5 text-blue-500" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">{alert.product}</p>
              <p className="text-xs text-muted-foreground">{alert.alert}</p>
              
              {/* Progress Bar */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-muted rounded-full h-1.5">
                  <div
                    className={`h-full rounded-full ${
                      alert.type === 'danger'
                        ? 'bg-red-500'
                        : alert.type === 'warning'
                        ? 'bg-yellow-500'
                        : alert.type === 'success'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${(alert.quantity / (alert.threshold * 2)) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {alert.quantity}/{alert.threshold}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  )
}
