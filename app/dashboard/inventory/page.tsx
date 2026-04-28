'use client'

import { useState } from 'react'
import { Search, Download, Plus, Filter } from 'lucide-react'

interface InventoryItem {
  id: string
  sku: string
  product: string
  category: string
  quantity: number
  minStock: number
  maxStock: number
  location: string
  lastUpdated: string
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
}

const inventoryData: InventoryItem[] = [
  {
    id: '1',
    sku: 'ELEC-001',
    product: 'Wireless Headphones',
    category: 'Electronics',
    quantity: 156,
    minStock: 50,
    maxStock: 500,
    location: 'A-12',
    lastUpdated: '2024-04-15',
    status: 'in-stock',
  },
  {
    id: '2',
    sku: 'ELEC-002',
    product: 'USB-C Cable',
    category: 'Electronics',
    quantity: 45,
    minStock: 100,
    maxStock: 1000,
    location: 'B-05',
    lastUpdated: '2024-04-14',
    status: 'low-stock',
  },
  {
    id: '3',
    sku: 'CLTH-001',
    product: 'Cotton T-Shirt',
    category: 'Clothing',
    quantity: 312,
    minStock: 50,
    maxStock: 1000,
    location: 'C-08',
    lastUpdated: '2024-04-15',
    status: 'in-stock',
  },
  {
    id: '4',
    sku: 'CLTH-002',
    product: 'Denim Jeans',
    category: 'Clothing',
    quantity: 0,
    minStock: 30,
    maxStock: 200,
    location: 'D-02',
    lastUpdated: '2024-04-10',
    status: 'out-of-stock',
  },
  {
    id: '5',
    sku: 'FOOD-001',
    product: 'Organic Coffee Beans',
    category: 'Food',
    quantity: 89,
    minStock: 50,
    maxStock: 300,
    location: 'E-15',
    lastUpdated: '2024-04-15',
    status: 'in-stock',
  },
  {
    id: '6',
    sku: 'BOOK-001',
    product: 'Web Development Guide',
    category: 'Books',
    quantity: 234,
    minStock: 20,
    maxStock: 500,
    location: 'F-10',
    lastUpdated: '2024-04-15',
    status: 'in-stock',
  },
  {
    id: '7',
    sku: 'ELEC-003',
    product: 'Portable Speaker',
    category: 'Electronics',
    quantity: 12,
    minStock: 30,
    maxStock: 150,
    location: 'A-18',
    lastUpdated: '2024-04-12',
    status: 'low-stock',
  },
  {
    id: '8',
    sku: 'FOOD-002',
    product: 'Green Tea',
    category: 'Food',
    quantity: 5,
    minStock: 50,
    maxStock: 200,
    location: 'E-20',
    lastUpdated: '2024-04-13',
    status: 'low-stock',
  },
]

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['all', ...new Set(inventoryData.map((item) => item.category))]
  const statuses = ['all', 'in-stock', 'low-stock', 'out-of-stock']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'In Stock'
      case 'low-stock':
        return 'Low Stock'
      case 'out-of-stock':
        return 'Out of Stock'
      default:
        return status
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Inventory Management</h1>
        <p className="text-muted-foreground mt-2">Track and manage your product inventory levels</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by SKU, product name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Item
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 border border-border bg-card text-foreground rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Min Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Updated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{item.sku}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{item.product}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    <span className={item.quantity === 0 ? 'text-red-600' : ''}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.minStock}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.location}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.lastUpdated}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium">
                        Edit
                      </button>
                      <button className="px-2 py-1 text-destructive hover:bg-destructive/10 rounded transition-colors text-xs font-medium">
                        Delete
                      </button>
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
            <p className="text-muted-foreground">No inventory items found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Items</p>
          <p className="text-2xl font-bold text-foreground">{inventoryData.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-600">
            {inventoryData.filter((i) => i.status === 'in-stock').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">
            {inventoryData.filter((i) => i.status === 'low-stock').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {inventoryData.filter((i) => i.status === 'out-of-stock').length}
          </p>
        </div>
      </div>
    </div>
  )
}
