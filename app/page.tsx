'use client'

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/lib/auth-context'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { MetricCard } from '@/components/metric-card'
import { ChartCard } from '@/components/chart-card'
import { ProductTable } from '@/components/product-table'
import { StockAlerts } from '@/components/stock-alerts'

const revenueData = [
  { date: '01', value: 4000 },
  { date: '02', value: 3000 },
  { date: '03', value: 2000 },
  { date: '04', value: 2780 },
  { date: '05', value: 1890 },
  { date: '06', value: 2390 },
  { date: '07', value: 3490 },
  { date: '08', value: 2100 },
  { date: '09', value: 3800 },
  { date: '10', value: 4300 },
  { date: '11', value: 3200 },
  { date: '12', value: 2800 },
]

const orderTimeData = [
  { name: 'Morning', value: 28, fill: '#e0e7ff' },
  { name: 'Afternoon', value: 40, fill: '#8b5cf6' },
  { name: 'Evening', value: 32, fill: '#6366f1' },
]

const stockByCategory = [
  { name: 'Electronics', value: 2400 },
  { name: 'Clothing', value: 1398 },
  { name: 'Food', value: 9800 },
  { name: 'Books', value: 3908 },
  { name: 'Others', value: 4800 },
]

const COLORS = ['#8b5cf6', '#6366f1', '#0ea5e9', '#f59e0b', '#ef4444']

export default function Dashboard() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Stock Value"
                value="$124,580"
                change="+12.5%"
                changeLabel="vs last month"
                description="Current inventory value across all warehouses"
              />
              <MetricCard
                title="Items in Stock"
                value="2,847"
                change="-3.2%"
                changeLabel="vs last month"
                description="Total number of unique products"
              />
              <MetricCard
                title="Low Stock Items"
                value="12"
                change="+2 items"
                changeLabel="needs restocking"
                description="Products below minimum threshold"
                highlight={true}
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Inventory Value Trend" subtitle="Last 12 months">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
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

              <ChartCard title="Stock Distribution by Time" subtitle="Orders received">
                <div className="flex items-center justify-center h-80">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderTimeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {orderTimeData.map((entry, index) => (
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
                    {orderTimeData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name} {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Stock by Category" subtitle="Distribution">
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

              <StockAlerts />
            </div>

            {/* Products Table */}
            <div>
              <ProductTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
