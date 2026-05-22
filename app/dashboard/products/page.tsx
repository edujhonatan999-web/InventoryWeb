'use client'

import { useEffect, useState } from 'react'
import { Search, Edit2, Eye } from 'lucide-react'

import ButtonDelete from '@/components/button-delete'
import ButtonExport from '@/components/button-export'
import ModalProd from '@/components/modal-prod'

interface ProductCategory {
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
  category: ProductCategory | null
}
const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL
const PRODUCTS_ENDPOINT = `${API_URL}/products`
const CATEGORIES_ENDPOINT = `${API_URL}/categories`


export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [productsData, setProductsData] = useState<Product[]>([])
  const [categoriesData, setCategoriesData] = useState<ProductCategory[]>([])
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(PRODUCTS_ENDPOINT)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as Product[]

        if (isMounted) {
          setProductsData(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unable to load products')
          setProductsData([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    const loadCategories = async () => {
      setCategoriesError(null)

      try {
        const response = await fetch(CATEGORIES_ENDPOINT)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = (await response.json()) as ProductCategory[]

        if (isMounted) {
          setCategoriesData(data)
        }
      } catch (err) {
        if (isMounted) {
          setCategoriesError(err instanceof Error ? err.message : 'Unable to load categories')
          setCategoriesData([])
        }
      }
    }

    loadProducts()
    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredData = productsData.filter((product) => {
    const normalizedSearch = searchTerm.toLowerCase()
    const categoryName = product.category?.name ?? 'Uncategorized'
    const matchesSearch =
      product.id.toString().includes(normalizedSearch) ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      categoryName.toLowerCase().includes(normalizedSearch) ||
      product.category_id.toString().includes(normalizedSearch)

    const matchesCategory = filterCategory === 'all' || categoryName === filterCategory

    return matchesSearch && matchesCategory
  })

  const categoryOptions = categoriesData.length
    ? categoriesData.map((category) => category.name)
    : [...new Set(productsData.map((p) => p.category?.name ?? 'Uncategorized'))]
  const categories = ['all', ...categoryOptions]

  const formatDate = (value: string) => {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
  }

  const exportColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'category_id', label: 'Category ID' },
    {
      key: 'category',
      label: 'Category',
      format: (_value: unknown, row: Product) => row.category?.name ?? 'Uncategorized',
    },
    { key: 'stock_quantity', label: 'Stock Qty' },
    { key: 'registered_at', label: 'Registered At', format: (value) => formatDate(String(value ?? '')) },
    { key: 'created_at', label: 'Created At', format: (value) => formatDate(String(value ?? '')) },
    { key: 'updated_at', label: 'Updated At', format: (value) => formatDate(String(value ?? '')) },
  ] satisfies Array<{ key: keyof Product | 'category'; label: string; format?: (value: unknown, row: Product) => string }>

  const handleProductSaved = (product: Product, mode: 'create' | 'edit') => {
    if (mode === 'edit') {
      setProductsData((prev) => prev.map((item) => (item.id === product.id ? product : item)))
      return
    }

    setProductsData((prev) => [product, ...prev])
  }

  const handleDeleteProduct = async (product: Product) => {
    try {
      const response = await fetch(`${PRODUCTS_ENDPOINT}/${product.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      setProductsData((prev) => prev.filter((item) => item.id !== product.id))
    } catch (err) {
      console.error(err)
      window.alert('No se pudo eliminar el producto.')
    }
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
              placeholder="Search by ID, product name, or category..."
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

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <ModalProd
            categories={categoriesData}
            categoriesError={categoriesError}
            onProductSaved={handleProductSaved}
          />
          <ButtonExport
            data={filteredData}
            columns={exportColumns}
            filename="products-export.xlsx"
            label="Export Excel"
          />
          <ButtonExport
            data={filteredData}
            columns={exportColumns}
            format="pdf"
            filename="products-export.pdf"
            label="Export PDF"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Category ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Stock Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Registered At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Updated At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((product) => (
                <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{product.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground text-right">{product.category_id}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {product.category?.name ?? 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right text-foreground">
                    {product.stock_quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(product.registered_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(product.created_at)}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {formatDate(product.updated_at)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <ModalProd
                        mode="edit"
                        product={product}
                        categories={categoriesData}
                        categoriesError={categoriesError}
                        onProductSaved={handleProductSaved}
                        trigger={
                          <button
                            className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        }
                      />
                      <ButtonDelete
                        title="Eliminar producto"
                        description="Esta seguro de eliminar el producto? Esta accion no se puede deshacer."
                        onConfirm={() => handleDeleteProduct(product)}
                      />
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
            {isLoading && <p className="text-muted-foreground">Loading products...</p>}
            {!isLoading && error && <p className="text-destructive">{error}</p>}
            {!isLoading && !error && (
              <p className="text-muted-foreground">No products found matching your filters.</p>
            )}
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
          <p className="text-sm text-muted-foreground mb-1">Total Stock</p>
          <p className="text-2xl font-bold text-foreground">
            {productsData.reduce((sum, p) => sum + p.stock_quantity, 0)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Categories</p>
          <p className="text-2xl font-bold text-foreground">
            {new Set(productsData.map((p) => p.category?.name ?? 'Uncategorized')).size}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-foreground">
            {productsData.filter((p) => p.stock_quantity === 0).length}
          </p>
        </div>
      </div>
    </div>
  )
}
