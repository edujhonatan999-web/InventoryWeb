'use client'

import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Edit2, Plus, Search } from 'lucide-react'

import ButtonDelete from '@/components/button-delete'

interface Category {
	id: number
	name: string
	created_at?: string
	updated_at?: string
}
const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL
const CATEGORIES_ENDPOINT = `${API_URL}/categories`

export default function CategoriesPage() {
	const [searchTerm, setSearchTerm] = useState('')
	const [categoriesData, setCategoriesData] = useState<Category[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [formName, setFormName] = useState('')
	const [isSaving, setIsSaving] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)

	useEffect(() => {
		let isMounted = true

		const loadCategories = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const response = await fetch(CATEGORIES_ENDPOINT)

				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`)
				}

				const data = (await response.json()) as Category[]

				if (isMounted) {
					setCategoriesData(data)
				}
			} catch (err) {
				if (isMounted) {
					setError(err instanceof Error ? err.message : 'Unable to load categories')
					setCategoriesData([])
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadCategories()

		return () => {
			isMounted = false
		}
	}, [])

	const filteredData = useMemo(() => {
		const normalizedSearch = searchTerm.toLowerCase()

		return categoriesData.filter((category) => {
			return (
				category.id.toString().includes(normalizedSearch) ||
				category.name.toLowerCase().includes(normalizedSearch)
			)
		})
	}, [categoriesData, searchTerm])

	const formatDate = (value?: string) => {
		if (!value) return '-'
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
	}

	const resetForm = () => {
		setFormName('')
		setEditingCategory(null)
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		const trimmedName = formName.trim()

		if (!trimmedName) {
			window.alert('Ingresa un nombre de categoria.')
			return
		}

		setIsSaving(true)

		try {
			const isEditing = Boolean(editingCategory)
			const targetUrl = isEditing
				? `${CATEGORIES_ENDPOINT}/${editingCategory?.id}`
				: CATEGORIES_ENDPOINT
			const response = await fetch(targetUrl, {
				method: isEditing ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: trimmedName }),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const savedCategory = (await response.json()) as Category

			setCategoriesData((prev) => {
				if (isEditing) {
					return prev.map((item) => (item.id === savedCategory.id ? savedCategory : item))
				}

				return [savedCategory, ...prev]
			})

			resetForm()
		} catch (err) {
			console.error(err)
			window.alert('No se pudo guardar la categoria.')
		} finally {
			setIsSaving(false)
		}
	}

	const handleEdit = (category: Category) => {
		setEditingCategory(category)
		setFormName(category.name)
	}

	const handleDelete = async (category: Category) => {
		try {
			const response = await fetch(`${CATEGORIES_ENDPOINT}/${category.id}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			setCategoriesData((prev) => prev.filter((item) => item.id !== category.id))
			if (editingCategory?.id === category.id) {
				resetForm()
			}
		} catch (err) {
			console.error(err)
			window.alert('No se pudo eliminar la categoria.')
		}
	}

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-4xl font-bold text-foreground">Product Categories</h1>
				<p className="text-muted-foreground mt-2">Add and manage categories used by your products.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">Search</label>
						<div className="relative">
							<input
								type="text"
								placeholder="Search by ID or name..."
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
						</div>
					</div>

					<div className="bg-card border border-border rounded-lg overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted">
										<th className="px-6 py-3 text-right text-sm font-semibold text-foreground">ID</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Updated</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredData.map((category) => (
										<tr
											key={category.id}
											className="border-b border-border hover:bg-muted/50 transition-colors"
										>
											<td className="px-6 py-4 text-sm font-medium text-foreground text-right">{category.id}</td>
											<td className="px-6 py-4 text-sm text-foreground">{category.name}</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{formatDate(category.created_at)}
											</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{formatDate(category.updated_at)}
											</td>
											<td className="px-6 py-4 text-sm">
												<div className="flex gap-2">
													<button
														className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
														title="Edit"
														onClick={() => handleEdit(category)}
													>
														<Edit2 className="w-4 h-4" />
													</button>
													<ButtonDelete
														title="Eliminar categoria"
														description="Esta seguro de eliminar la categoria? Esta accion no se puede deshacer."
														onConfirm={() => handleDelete(category)}
													/>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{filteredData.length === 0 && (
							<div className="p-12 text-center">
								{isLoading && <p className="text-muted-foreground">Loading categories...</p>}
								{!isLoading && error && <p className="text-destructive">{error}</p>}
								{!isLoading && !error && (
									<p className="text-muted-foreground">No categories found matching your search.</p>
								)}
							</div>
						)}
					</div>
				</div>

				<div className="bg-card border border-border rounded-lg p-6 h-fit">
					<h2 className="text-xl font-semibold text-foreground">
						{editingCategory ? 'Edit category' : 'Add new category'}
					</h2>
					<p className="text-sm text-muted-foreground mt-2">
						{editingCategory
							? 'Update the selected category name.'
							: 'Create a category to group your products.'}
					</p>

					<form onSubmit={handleSubmit} className="mt-6 space-y-4">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">Category name</label>
							<input
								type="text"
								value={formName}
								onChange={(event) => setFormName(event.target.value)}
								placeholder="Example: Electronics"
								className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							<button
								type="submit"
								className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
								disabled={isSaving}
							>
								<Plus className="w-4 h-4" />
								{editingCategory ? 'Update category' : 'Create category'}
							</button>
							{editingCategory && (
								<button
									type="button"
									onClick={resetForm}
									className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
								>
									Cancel
								</button>
							)}
						</div>
					</form>

					<div className="mt-8 grid grid-cols-1 gap-3">
						<div className="border border-border rounded-lg p-4">
							<p className="text-sm text-muted-foreground mb-1">Total categories</p>
							<p className="text-2xl font-bold text-foreground">{categoriesData.length}</p>
						</div>
						<div className="border border-border rounded-lg p-4">
							<p className="text-sm text-muted-foreground mb-1">Last updated</p>
							<p className="text-2xl font-bold text-foreground">
								{formatDate(
									categoriesData
										.map((item) => item.updated_at)
										.filter(Boolean)
										.sort()
										.at(-1)
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
