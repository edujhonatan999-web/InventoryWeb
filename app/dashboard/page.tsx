'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MetricCard } from '@/components/metric-card'
import { ChartCard } from '@/components/chart-card'
import { ProductTable, type ProductRow } from '@/components/product-table'
import { StockAlerts, type StockAlertItem } from '@/components/stock-alerts'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  category_id: number
  stock_quantity: number
  registered_at: string
  created_at: string
  updated_at: string
  category?: Category | null
}

interface Movement {
  id: number
  product_id?: number
  quantity: number
  movement_type: 'in' | 'out'
  movement_date?: string
  created_at: string
}

interface Ticket {
  id: number
  status: string
  created_at: string
  updated_at: string
}
const API_URL= process.env.BACKEND_URL
const TICKETS_ENDPOINT = `${API_URL}/tickets`
const CATEGORIES_ENDPOINT = `${API_URL}/categories`
const PRODUCTS_ENDPOINT = `${API_URL}/products`
const MOVEMENTS_ENDPOINT = `${API_URL}/movements`

const LOW_STOCK_THRESHOLD = 10
const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  in_progress: '#3b82f6',
  resolved: '#10b981',
}

const getAuthToken = () => {
  const tokenPair = document.cookie
    .split('; ')
    .find((row) => row.startsWith('authToken='))
  return tokenPair ? decodeURIComponent(tokenPair.split('=')[1]) : null
}

const toArray = <T,>(payload: T[] | T | null | undefined) =>
  Array.isArray(payload) ? payload : payload ? [payload] : []

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

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [movements, setMovements] = useState<Movement[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const token = getAuthToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined

    const fetchAll = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const [ticketsResponse, categoriesResponse, productsResponse, movementsResponse] =
          await Promise.all([
            fetch(TICKETS_ENDPOINT, { headers }),
            fetch(CATEGORIES_ENDPOINT, { headers }),
            fetch(PRODUCTS_ENDPOINT, { headers }),
            fetch(MOVEMENTS_ENDPOINT, { headers }),
          ])

        if (!ticketsResponse.ok) {
          throw new Error(`Error ${ticketsResponse.status}: ${ticketsResponse.statusText}`)
        }
        if (!categoriesResponse.ok) {
          throw new Error(`Error ${categoriesResponse.status}: ${categoriesResponse.statusText}`)
        }
        if (!productsResponse.ok) {
          throw new Error(`Error ${productsResponse.status}: ${productsResponse.statusText}`)
        }
        if (!movementsResponse.ok) {
          throw new Error(`Error ${movementsResponse.status}: ${movementsResponse.statusText}`)
        }

        const ticketsData = (await ticketsResponse.json()) as Ticket[] | Ticket
        const categoriesData = (await categoriesResponse.json()) as Category[] | Category
        const productsData = (await productsResponse.json()) as Product[] | Product
        const movementsData = (await movementsResponse.json()) as Movement[] | Movement

        if (isMounted) {
          setTickets(toArray(ticketsData))
          setCategories(toArray(categoriesData))
          setProducts(toArray(productsData))
          setMovements(toArray(movementsData))
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : 'Error al cargar el dashboard.')
          setTickets([])
          setCategories([])
          setProducts([])
          setMovements([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchAll()

    return () => {
      isMounted = false
    }
  }, [])

  const categoryMap = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]))
  }, [categories])

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stock_quantity <= LOW_STOCK_THRESHOLD),
    [products]
  )

  const movementSeries = useMemo(() => {
    const dayCount = 12
    const today = new Date()
    const days = Array.from({ length: dayCount }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (dayCount - 1 - index))
      const key = date.toISOString().slice(0, 10)
      return {
        key,
        label: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
      }
    })

    const totals = new Map<string, number>()
    movements.forEach((movement) => {
      const dateValue = movement.movement_date ?? movement.created_at
      const parsed = new Date(dateValue)
      if (Number.isNaN(parsed.getTime())) {
        return
      }
      const key = parsed.toISOString().slice(0, 10)
      const delta = movement.movement_type === 'out' ? -movement.quantity : movement.quantity
      totals.set(key, (totals.get(key) ?? 0) + delta)
    })

    return days.map((day) => ({
      date: day.label,
      value: totals.get(day.key) ?? 0,
    }))
  }, [movements])

  const ticketStatusData = useMemo(() => {
    const statusCounts = new Map<string, number>()
    tickets.forEach((ticket) => {
      const status = ticket.status || 'pending'
      statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1)
    })

    const ordered = ['pending', 'in_progress', 'resolved']
    return ordered.map((status) => ({
      name: status,
      value: statusCounts.get(status) ?? 0,
      fill: STATUS_COLORS[status] ?? '#94a3b8',
    }))
  }, [tickets])

  const stockByCategory = useMemo(() => {
    const totals = new Map<string, number>()
    products.forEach((product) => {
      const name = product.category?.name ?? categoryMap.get(product.category_id) ?? 'Sin categoria'
      totals.set(name, (totals.get(name) ?? 0) + product.stock_quantity)
    })

    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [products, categoryMap])

  const stockAlerts = useMemo<StockAlertItem[]>(() => {
    return [...products]
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
      .slice(0, 5)
      .map((product) => {
        const quantity = product.stock_quantity
        const type = quantity <= 5 ? 'danger' : quantity <= LOW_STOCK_THRESHOLD ? 'warning' : 'success'
        const alert = type === 'danger' ? 'Stock critico' : type === 'warning' ? 'Stock bajo' : 'Stock saludable'
        return {
          id: product.id,
          product: product.name,
          alert,
          quantity,
          threshold: LOW_STOCK_THRESHOLD,
          type,
        }
      })
  }, [products])

  const productRows = useMemo<ProductRow[]>(() => {
    return [...products]
      .sort((a, b) => b.stock_quantity - a.stock_quantity)
      .slice(0, 8)
      .map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category?.name ?? categoryMap.get(product.category_id) ?? 'Sin categoria',
        quantity: product.stock_quantity,
        status: product.stock_quantity <= LOW_STOCK_THRESHOLD ? 'Bajo stock' : 'En stock',
        updatedAt: formatDate(product.updated_at),
      }))
  }, [products, categoryMap])

  return (
    <div className="p-8 space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
      </div>

      {loadError && (
        <div className="p-4 border border-destructive/40 bg-destructive/10 text-destructive rounded-lg text-sm">
          {loadError}
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Productos"
          value={products.length.toString()}
          change="+0"
          changeLabel="actual"
          description="Productos registrados en inventario"
        />
        <MetricCard
          title="Categorias"
          value={categories.length.toString()}
          change="+0"
          changeLabel="actual"
          description="Categorias activas"
        />
        <MetricCard
          title="Bajo stock"
          value={lowStockProducts.length.toString()}
          change="+0"
          changeLabel="por debajo del umbral"
          description="Productos que requieren reposicion"
          highlight={true}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Movimientos netos" subtitle="Ultimos 12 dias">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tickets por estado" subtitle="Distribucion actual">
          <div className="flex items-center justify-center h-80">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {ticketStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col gap-3 ml-8">
              {ticketStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock por categoria" subtitle="Unidades disponibles">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stockByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <StockAlerts alerts={stockAlerts} isLoading={isLoading} />
      </div>

      {/* Products Table */}
      <div>
        <ProductTable rows={productRows} isLoading={isLoading} />
      </div>
    </div>
  )
}
