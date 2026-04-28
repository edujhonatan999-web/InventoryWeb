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

// TODO: Reemplazar con datos de API real
const alerts = [
  {
    id: 1,
    product: 'USB-C Cable',
    alert: 'Low Stock Alert',
    quantity: 85,
    threshold: 100,
    type: 'warning',
    icon: AlertCircle,
  },
  {
    id: 2,
    product: 'Desk Lamp',
    alert: 'Reorder Recommended',
    quantity: 23,
    threshold: 50,
    type: 'danger',
    icon: AlertCircle,
  },
  {
    id: 3,
    product: 'Office Chair',
    alert: 'Stock Healthy',
    quantity: 42,
    threshold: 20,
    type: 'success',
    icon: CheckCircle,
  },
  {
    id: 4,
    product: 'Wireless Mouse',
    alert: 'Pending Reorder',
    quantity: 342,
    threshold: 300,
    type: 'info',
    icon: Clock,
  },
]

export function StockAlerts() {
  return (
    <ChartCard title="Stock Alerts" subtitle="Current inventory status">
      <div className="space-y-3">
        {alerts.map((alert) => {
          return (
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
                      style={{ width: `${(alert.quantity / (alert.threshold * 3)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {alert.quantity}/{alert.threshold * 2}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}
