"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const TICKETS_ENDPOINT = 'http://localhost:4000/tickets'
const PRODUCTS_ENDPOINT = 'http://localhost:4000/products'

type ProductOption = {
	id: number
	name: string
}
type TicketFormState = {
	description: string
	location: string
	product_id: string
}

export default function TicketsPage() {
	const [form, setForm] = useState<TicketFormState>({
		description: '',
		location: '',
		product_id: '',
	})
	const [products, setProducts] = useState<ProductOption[]>([])
	const [productsError, setProductsError] = useState<string | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)

	useEffect(() => {
		let isMounted = true

		const fetchProducts = async () => {
			try {
				setProductsError(null)
				const response = await fetch(PRODUCTS_ENDPOINT)
				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`)
				}

				const data = (await response.json()) as ProductOption[]
				if (isMounted) {
					setProducts(Array.isArray(data) ? data : [])
				}
			} catch (err) {
				if (isMounted) {
					setProductsError(err instanceof Error ? err.message : 'No se pudo cargar productos.')
					setProducts([])
				}
			}
		}

		fetchProducts()

		return () => {
			isMounted = false
		}
	}, [])

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target
		setForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSaving(true)
		setError(null)
		setSuccess(null)

		try {
			const payload = {
				description: form.description.trim(),
				location: form.location.trim(),
				status: 'pending',
				product_id: form.product_id ? Number.parseInt(form.product_id, 10) : null,
				requester_id: 1,
				technician_id: 1,
			}

			const response = await fetch(TICKETS_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			setForm({
				description: '',
				location: '',
				product_id: '',
			})
			setSuccess('Reporte enviado. Se agrego a la tabla de tickets.')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'No se pudo enviar el reporte.')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="p-8 max-w-2xl mx-auto space-y-6">
			<div>
				<h1 className="text-4xl font-bold text-foreground">Reporte publico</h1>
				<p className="text-muted-foreground mt-2">
					Completa el formulario y el reporte se registrara en la tabla de tickets.
				</p>
			</div>

			<form className="space-y-4 bg-card border border-border rounded-lg p-6" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="description">Descripcion</Label>
					<Textarea
						id="description"
						name="description"
						value={form.description}
						onChange={handleChange}
						placeholder="Describe el problema"
						rows={8}
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="location">Ubicacion</Label>
					<Input
						id="location"
						name="location"
						value={form.location}
						onChange={handleChange}
						placeholder="Ej: Almacen 2, pasillo B"
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="product_id">Producto (opcional)</Label>
					<select
						id="product_id"
						name="product_id"
						value={form.product_id}
						onChange={handleChange}
						className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value="">Seleccionar producto</option>
						{products.map((product) => (
							<option key={product.id} value={product.id}>
								{product.name}
							</option>
						))}
					</select>
					{productsError && <p className="text-sm text-destructive">{productsError}</p>}
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}
				{success && <p className="text-sm text-emerald-600">{success}</p>}

				<div className="flex justify-end">
					<Button type="submit" disabled={isSaving}>
						{isSaving ? 'Enviando...' : 'Enviar reporte'}
					</Button>
				</div>
			</form>
		</div>
	)
}
