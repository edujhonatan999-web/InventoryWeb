'use client'

import { useState } from 'react'
import { Search, Download, Plus, Edit2, Trash2, Eye } from 'lucide-react'

interface Product {
  id: string
  sku: string
  name: string
  category: string
  price: number
  cost: number
  stock: number
  supplier: string
  createdAt: string
  status: 'active' | 'inactive'
}

const productsData: Product[] = [
  {
    id: '1',
    sku: 'ELEC-001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 89.99,
    cost: 35.00,
    stock: 156,
    supplier: 'TechSupply Co',
    createdAt: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    sku: 'ELEC-002',
    name: 'USB-C Cable',
    category: 'Electronics',
    price: 12.99,
    cost: 3.50,
    stock: 45,
    supplier: 'CableWorld',
    createdAt: '2024-01-20',
    status: 'active',
  },
  {
    id: '3',
    sku: 'CLTH-001',
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: 24.99,
    cost: 8.00,
    stock: 312,
    supplier: 'Fashion Hub',
    createdAt: '2024-02-01',
    status: 'active',
  },
  {
    id: '4',
    sku: 'CLTH-002',
    name: 'Denim Jeans',
    category: 'Clothing',
    price: 59.99,
    cost: 20.00,
    stock: 0,
    supplier: 'Fashion Hub',
    createdAt: '2024-02-05',
    status: 'active',
  },
  {
    id: '5',
    sku: 'FOOD-001',
    name: 'Organic Coffee Beans',
    category: 'Food',
    price: 18.50,
    cost: 6.00,
    stock: 89,
    supplier: 'Green Beans Inc',
    createdAt: '2024-02-10',
    status: 'active',
  },
  {
    id: '6',
    sku: 'BOOK-001',
    name: 'Web Development Guide',
    category: 'Books',
    price: 39.99,
    cost: 12.00,
    stock: 234,
    supplier: 'Publishers Plus',
    createdAt: '2024-02-15',
    status: 'active',
  },
  {
    id: '7',
    sku: 'ELEC-003',
    name: 'Portable Speaker',
    category: 'Electronics',
    price: 79.99,
    cost: 25.00,
    stock: 12,
    supplier: 'TechSupply Co',
    createdAt: '2024-03-01',
    status: 'active',
  },
  {
    id: '8',
    sku: 'FOOD-002',
    name: 'Green Tea',
    category: 'Food',
    price: 14.99,
    cost: 4.00,
    stock: 5,
    supplier: 'Green Beans Inc',
    createdAt: '2024-03-05',
    status: 'inactive',
  },
  {
    id: '9',
    sku: 'CLTH-003',
    name: 'Wool Sweater',
    category: 'Clothing',
    price: 79.99,
    cost: 30.00,
    stock: 87,
    supplier: 'Fashion Hub',
    createdAt: '2024-03-10',
    status: 'active',
  },
  {
    id: '10',
    sku: 'BOOK-002',
    name: 'JavaScript Masterclass',
    category: 'Books',
    price: 49.99,
    cost: 15.00,
    stock: 156,
    supplier: 'Publishers Plus',
    createdAt: '2024-03-15',
    status: 'active',
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredData = productsData.filter((product) => {
    const matchesSearch =
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = ['all', ...new Set(productsData.map((p) => p.category))]
  const statuses = ['all', 'active', 'inactive']

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const profit = (price: number, cost: number) => {
    return ((price - cost) / price * 100).toFixed(1)
  }

  return (
    <div className="p-8 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Products Catalog</h1>
        <p className="text-muted-foreground mt-2">Manage your product catalog and pricing</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-foreground mb-2">Search</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by SKU, product name, or supplier..."
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
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Product
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Price</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Cost</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Profit %</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Supplier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{product.sku}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground text-right">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                    ${product.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right">
                    <span className="text-green-600">{profit(product.price, product.cost)}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right text-foreground">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{product.supplier}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
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
            <p className="text-muted-foreground">No products found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Products</p>
          <p className="text-2xl font-bold text-foreground">{productsData.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Value</p>
          <p className="text-2xl font-bold text-foreground">
            ${(productsData.reduce((sum, p) => sum + p.price * p.stock, 0)).toFixed(0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Products</p>
          <p className="text-2xl font-bold text-green-600">
            {productsData.filter((p) => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg. Profit Margin</p>
          <p className="text-2xl font-bold text-foreground">
            {(
              productsData.reduce((sum, p) => sum + parseFloat(profit(p.price, p.cost)), 0) /
              productsData.length
            ).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}
