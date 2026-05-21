'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

interface NewProductForm {
	name: string
	category_id: string
	stock_quantity: string
}

type ModalMode = 'create' | 'edit'

interface ModalProdProps {
	categories: ProductCategory[]
	categoriesError: string | null
	mode?: ModalMode
	product?: Product
	trigger?: ReactNode
	onProductSaved: (product: Product, mode: ModalMode) => void
}

const PRODUCTS_ENDPOINT = 'http://localhost:4000/products'

export default function ModalProd({
	categories,
	categoriesError,
	mode = 'create',
	product,
	trigger,
	onProductSaved,
}: ModalProdProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [addError, setAddError] = useState<string | null>(null)
	const [newProduct, setNewProduct] = useState<NewProductForm>({
		name: '',
		category_id: '',
		stock_quantity: '',
	})

	useEffect(() => {
		if (!isOpen) {
			return
		}

		if (mode === 'edit' && product) {
			setNewProduct({
				name: product.name,
				category_id: product.category_id.toString(),
				stock_quantity: product.stock_quantity.toString(),
			})
			return
		}

		setNewProduct({
			name: '',
			category_id: '',
			stock_quantity: '',
		})
		setAddError(null)
	}, [isOpen, mode, product])

	const handleNewProductChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setNewProduct((prev) => ({ ...prev, [name]: value }))
	}

	const handleCategorySelect = (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value
		setNewProduct((prev) => ({
			...prev,
			category_id: value,
		}))
	}

	const resetNewProduct = () => {
		setNewProduct({
			name: '',
			category_id: '',
			stock_quantity: '',
		})
		setAddError(null)
	}

	const handleSaveProduct = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSaving(true)
		setAddError(null)

		if (mode === 'edit' && !product) {
			setAddError('No product selected for editing')
			setIsSaving(false)
			return
		}

		const categoryId = Number.parseInt(newProduct.category_id, 10) || 0
		const stockQuantity = Number.parseInt(newProduct.stock_quantity, 10) || 0
		const selectedCategory = categories.find((category) => category.id === categoryId) || null

		const payload = {
			name: newProduct.name.trim() || 'Unnamed product',
			category_id: categoryId,
			stock_quantity: stockQuantity,
		}

		const now = new Date().toISOString()
		const optimisticProduct: Product = {
			id: mode === 'edit' ? product!.id : Date.now(),
			name: payload.name,
			category_id: categoryId,
			stock_quantity: stockQuantity,
			registered_at: product?.registered_at ?? now,
			created_at: product?.created_at ?? now,
			updated_at: now,
			category: selectedCategory,
		}

		try {
			const endpoint = mode === 'edit'
				? `${PRODUCTS_ENDPOINT}/${product!.id}`
				: PRODUCTS_ENDPOINT
			const method = mode === 'edit' ? 'PUT' : 'POST'
			const response = await fetch(endpoint, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const createdProduct = (await response.json()) as Product
			const normalizedProduct = createdProduct ?? optimisticProduct
			const resolvedCategory =
				normalizedProduct.category ??
				categories.find((category) => category.id === normalizedProduct.category_id) ??
				null

			onProductSaved(
				{
					...optimisticProduct,
					...normalizedProduct,
					category: resolvedCategory,
				},
				mode,
			)
			resetNewProduct()
			setIsOpen(false)
		} catch (err) {
			setAddError(err instanceof Error ? err.message : 'Unable to save product')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open)
				if (!open) {
					resetNewProduct()
				}
			}}
		>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button className="flex-1 md:flex-none">
						<Plus className="w-5 h-5" />
						Add Product
					</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{mode === 'edit' ? 'Editar producto' : 'Anadir nuevo producto'}
					</DialogTitle>
					<DialogDescription>
						{mode === 'edit'
							? 'Actualiza los datos basicos del producto.'
							: 'Completa la informacion basica y se agregara al listado local.'}
					</DialogDescription>
				</DialogHeader>
				<form className="space-y-4" onSubmit={handleSaveProduct}>
					<div className="space-y-2">
						<Label htmlFor="name">Product name</Label>
						<Input
							id="name"
							name="name"
							placeholder="Wireless Headphones"
							value={newProduct.name}
							onChange={handleNewProductChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="category_id">Category</Label>
						<select
							id="category_id"
							name="category_id"
							value={newProduct.category_id}
							onChange={handleCategorySelect}
							className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							required
						>
							<option value="">Select category</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						{categoriesError && <p className="text-xs text-destructive">{categoriesError}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="stock_quantity">Cantidad en stock</Label>
						<Input
							id="stock_quantity"
							name="stock_quantity"
							type="number"
							placeholder="120"
							value={newProduct.stock_quantity}
							onChange={handleNewProductChange}
							min="0"
							required
						/>
					</div>
					{addError && <p className="text-sm text-destructive">{addError}</p>}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								resetNewProduct()
								setIsOpen(false)
							}}
							disabled={isSaving}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSaving}>
							{isSaving ? 'Saving...' : mode === 'edit' ? 'Update product' : 'Save product'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
