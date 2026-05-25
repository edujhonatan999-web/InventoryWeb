"use client"

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Search } from 'lucide-react'
import ButtonExport from '@/components/button-export'
import { Button } from '@/components/ui/button'
import ButtonDelete from '@/components/button-delete'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Ticket {
	id: number
	description: string
	product_id: number | null
	location: string
	status: string
	requester_id: number | null
	technician_id: number | null
	created_at: string
	updated_at: string
}

interface User {
	id: number
	username: string
}
const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL
const TICKETS_ENDPOINT = `${API_URL}/tickets`
const USERS_ENDPOINT = `${API_URL}/user`
const STATUS_OPTIONS = ['pending', 'in_progress', 'resolved'] as const

const toArray = (payload: Ticket[] | Ticket | null | undefined) =>
	Array.isArray(payload) ? payload : payload ? [payload] : []

export default function ReportsPage() {
	const [tickets, setTickets] = useState<Ticket[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [users, setUsers] = useState<User[]>([])
	const [usersError, setUsersError] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState('')
	const [filterStatus, setFilterStatus] = useState('all')
	const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isSavingEdit, setIsSavingEdit] = useState(false)
	const [editError, setEditError] = useState<string | null>(null)
	const [editForm, setEditForm] = useState({
		description: '',
		location: '',
		status: '',
	})
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isSavingCreate, setIsSavingCreate] = useState(false)
	const [createError, setCreateError] = useState<string | null>(null)
	const [createForm, setCreateForm] = useState({
		description: '',
		location: '',
		status: STATUS_OPTIONS[0],
		product_id: '',
		requester_id: '',
		technician_id: '',
	})

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				setIsLoading(true)
				setLoadError(null)

				const response = await fetch(TICKETS_ENDPOINT)
				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`)
				}

				const data = (await response.json()) as Ticket[] | Ticket
				setTickets(toArray(data))
			} catch (error) {
				setLoadError(error instanceof Error ? error.message : 'Error al cargar los reportes.')
				setTickets([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchTickets()
	}, [])

	useEffect(() => {
		let isMounted = true

		const fetchUsers = async () => {
			try {
				setUsersError(null)
				const response = await fetch(USERS_ENDPOINT)
				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`)
				}

				const data = (await response.json()) as User[]
				if (isMounted) {
					setUsers(Array.isArray(data) ? data : [])
				}
			} catch (error) {
				if (isMounted) {
					setUsersError(error instanceof Error ? error.message : 'Error al cargar usuarios.')
					setUsers([])
				}
			}
		}

		fetchUsers()

		return () => {
			isMounted = false
		}
	}, [])

	const statusOptions = useMemo(() => ['all', ...STATUS_OPTIONS], [])

	const userMap = useMemo(() => {
		return new Map(users.map((user) => [user.id, user.username]))
	}, [users])

	const filteredData = tickets.filter((ticket) => {
		const normalizedSearch = searchTerm.toLowerCase().trim()
		const matchesSearch =
			ticket.id.toString().includes(normalizedSearch) ||
			ticket.description.toLowerCase().includes(normalizedSearch) ||
			ticket.location.toLowerCase().includes(normalizedSearch) ||
			ticket.status.toLowerCase().includes(normalizedSearch) ||
			(ticket.product_id ?? '').toString().includes(normalizedSearch) ||
			(ticket.requester_id ?? '').toString().includes(normalizedSearch) ||
			(ticket.technician_id ?? '').toString().includes(normalizedSearch)

		const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus

		return matchesSearch && matchesStatus
	})

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

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'pending':
				return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
			case 'in_progress':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
			case 'resolved':
			case 'closed':
				return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
		}
	}

	const exportColumns = [
		{ key: 'id', label: 'ID' },
		{ key: 'description', label: 'Descripcion' },
		{ key: 'product_id', label: 'Producto ID' },
		{ key: 'location', label: 'Ubicacion' },
		{ key: 'status', label: 'Estado' },
		{
			key: 'requester_id',
			label: 'Solicitante',
			format: (_, row) => userMap.get(row.requester_id ?? 0) ?? '-',
		},
		{
			key: 'technician_id',
			label: 'Tecnico',
			format: (_, row) => userMap.get(row.technician_id ?? 0) ?? '-',
		},
		{ key: 'created_at', label: 'Creado', format: (value: unknown) => formatDate(String(value)) },
		{ key: 'updated_at', label: 'Actualizado', format: (value: unknown) => formatDate(String(value)) },
	] satisfies Array<{
		key: keyof Ticket
		label: string
		format?: (value: unknown, row: Ticket) => string
	}>

	const pendingCount = tickets.filter((ticket) => ticket.status.toLowerCase() === 'pending').length
	const lastUpdated = tickets[0]?.updated_at ? formatDate(tickets[0].updated_at) : '-'
	const editableStatusOptions = STATUS_OPTIONS

	const openEditModal = (ticket: Ticket) => {
		setEditingTicket(ticket)
		setEditForm({
			description: ticket.description,
			location: ticket.location,
			status: ticket.status,
		})
		setEditError(null)
		setIsEditOpen(true)
	}

	const openCreateModal = () => {
		setCreateForm({
			description: '',
			location: '',
			status: STATUS_OPTIONS[0],
			product_id: '',
			requester_id: '',
			technician_id: '',
		})
		setCreateError(null)
		setIsCreateOpen(true)
	}

	const handleEditChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = event.target
		setEditForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleEditSave = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!editingTicket) {
			setEditError('No hay ticket seleccionado para editar.')
			return
		}

		setIsSavingEdit(true)
		setEditError(null)

		try {
			const payload = {
				description: editForm.description.trim(),
				location: editForm.location.trim(),
				status: editForm.status,
			}

			const response = await fetch(`${TICKETS_ENDPOINT}/${editingTicket.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const updated = (await response.json()) as Ticket
			setTickets((prev) =>
				prev.map((ticket) => (ticket.id === editingTicket.id ? { ...ticket, ...updated } : ticket))
			)
			setIsEditOpen(false)
			setEditingTicket(null)
		} catch (error) {
			setEditError(error instanceof Error ? error.message : 'No se pudo actualizar el ticket.')
		} finally {
			setIsSavingEdit(false)
		}
	}

	const handleCreateChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = event.target
		setCreateForm((prev) => ({ ...prev, [name]: value }))
	}

	const handleCreateSave = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setIsSavingCreate(true)
		setCreateError(null)

		try {
			const payload = {
				description: createForm.description.trim(),
				location: createForm.location.trim(),
				status: createForm.status,
				product_id: createForm.product_id ? Number.parseInt(createForm.product_id, 10) : null,
				requester_id: createForm.requester_id
					? Number.parseInt(createForm.requester_id, 10)
					: null,
				technician_id: createForm.technician_id
					? Number.parseInt(createForm.technician_id, 10)
					: null,
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

			const created = (await response.json()) as Ticket
			setTickets((prev) => [created, ...prev])
			setIsCreateOpen(false)
		} catch (error) {
			setCreateError(error instanceof Error ? error.message : 'No se pudo crear el ticket.')
		} finally {
			setIsSavingCreate(false)
		}
	}

	const handleDeleteTicket = async (ticketId: number) => {
		try {
			const response = await fetch(`${TICKETS_ENDPOINT}/${ticketId}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId))
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo eliminar el ticket.')
		}
	}

	return (
		<div className="p-8 space-y-6">
			{/* Page Title */}
			<div>
				<h1 className="text-4xl font-bold text-foreground">Reportes</h1>
				<p className="text-muted-foreground mt-2">Seguimiento de tickets y solicitudes tecnicas</p>
			</div>

			{/* Controls */}
			<div className="flex flex-col md:flex-row gap-4 items-end">
				{/* Search */}
				<div className="flex-1 min-w-0">
					<label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
					<div className="relative">
						<input
							type="text"
							placeholder="Buscar por ID, descripcion o ubicacion"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full px-4 py-2 pl-10 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						<Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
					</div>
				</div>

				{/* Status Filter */}
				<div className="w-full md:w-48">
					<label className="block text-sm font-medium text-foreground mb-2">Estado</label>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
					>
						{statusOptions.map((status) => (
							<option key={status} value={status}>
								{status === 'all' ? 'Todos' : status}
							</option>
						))}
					</select>
				</div>

				<div className="flex gap-2 w-full md:w-auto">
					<Button onClick={openCreateModal}>Nuevo reporte</Button>
					<ButtonExport
						data={filteredData}
						columns={exportColumns}
						filename="tickets-export.xlsx"
						label="Export Excel"
					/>
					<ButtonExport
						data={filteredData}
						columns={exportColumns}
						format="pdf"
						filename="tickets-export.pdf"
						label="Export PDF"
					/>
				</div>
			</div>

			{/* Table */}
			<div className="bg-card border border-border rounded-lg overflow-hidden">
				{isLoading ? (
					<div className="p-12 text-center">
						<p className="text-muted-foreground">Cargando reportes...</p>
					</div>
				) : loadError ? (
					<div className="p-12 text-center">
						<p className="text-destructive">{loadError}</p>
					</div>
				) : (
					<>
						{usersError && (
							<div className="px-6 py-3 text-sm text-destructive border-b border-border">
								{usersError}
							</div>
						)}
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-border bg-muted">
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Descripcion</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Producto</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ubicacion</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Solicitante</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tecnico</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Creado</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actualizado</th>
										<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
									</tr>
								</thead>
								<tbody>
									{filteredData.map((ticket) => (
										<tr key={ticket.id} className="border-b border-border hover:bg-muted/50 transition-colors">
											<td className="px-6 py-4 text-sm font-medium text-foreground">{ticket.id}</td>
											<td className="px-6 py-4 text-sm text-foreground">{ticket.description}</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{ticket.product_id ?? '-'}
											</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">{ticket.location}</td>
											<td className="px-6 py-4 text-sm">
												<span
													className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
														ticket.status
													)}`}
												>
													{ticket.status}
												</span>
											</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{userMap.get(ticket.requester_id ?? 0) ?? '-'}
											</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{userMap.get(ticket.technician_id ?? 0) ?? '-'}
											</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{formatDate(ticket.created_at)}
											</td>
											<td className="px-6 py-4 text-sm text-muted-foreground">
												{formatDate(ticket.updated_at)}
											</td>
											<td className="px-6 py-4 text-sm">
												<div className="flex items-center gap-2">
													<Button variant="outline" size="sm" onClick={() => openEditModal(ticket)}>
														Editar
													</Button>
													<ButtonDelete
														title="Eliminar ticket"
														description="Esta seguro de eliminar el ticket? Esta accion no se puede deshacer."
														onConfirm={() => handleDeleteTicket(ticket.id)}
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
								<p className="text-muted-foreground">No hay reportes que coincidan con tus filtros.</p>
							</div>
						)}
					</>
				)}
			</div>

			<Dialog
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open)
					if (!open) {
						setEditingTicket(null)
						setEditError(null)
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Editar ticket</DialogTitle>
						<DialogDescription>Actualiza el estado, la descripcion y la ubicacion.</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleEditSave}>
						<div className="space-y-2">
							<Label htmlFor="description">Descripcion</Label>
							<Input
								id="description"
								name="description"
								value={editForm.description}
								onChange={handleEditChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="location">Ubicacion</Label>
							<Input
								id="location"
								name="location"
								value={editForm.location}
								onChange={handleEditChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status">Estado</Label>
							<select
								id="status"
								name="status"
								value={editForm.status}
								onChange={handleEditChange}
								className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								required
							>
								{editableStatusOptions.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
						{editError && <p className="text-sm text-destructive">{editError}</p>}
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditOpen(false)}
								disabled={isSavingEdit}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isSavingEdit}>
								{isSavingEdit ? 'Guardando...' : 'Actualizar ticket'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog
				open={isCreateOpen}
				onOpenChange={(open) => {
					setIsCreateOpen(open)
					if (!open) {
						setCreateError(null)
					}
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nuevo reporte</DialogTitle>
						<DialogDescription>Registra un nuevo ticket de soporte.</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleCreateSave}>
						<div className="space-y-2">
							<Label htmlFor="create_description">Descripcion</Label>
							<Input
								id="create_description"
								name="description"
								value={createForm.description}
								onChange={handleCreateChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create_location">Ubicacion</Label>
							<Input
								id="create_location"
								name="location"
								value={createForm.location}
								onChange={handleCreateChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create_status">Estado</Label>
							<select
								id="create_status"
								name="status"
								value={createForm.status}
								onChange={handleCreateChange}
								className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
								required
							>
								{STATUS_OPTIONS.map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create_product_id">Producto ID (opcional)</Label>
							<Input
								id="create_product_id"
								name="product_id"
								type="number"
								min="1"
								value={createForm.product_id}
								onChange={handleCreateChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create_requester_id">Solicitante ID (opcional)</Label>
							<Input
								id="create_requester_id"
								name="requester_id"
								type="number"
								min="1"
								value={createForm.requester_id}
								onChange={handleCreateChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="create_technician_id">Tecnico ID (opcional)</Label>
							<Input
								id="create_technician_id"
								name="technician_id"
								type="number"
								min="1"
								value={createForm.technician_id}
								onChange={handleCreateChange}
							/>
						</div>
						{createError && <p className="text-sm text-destructive">{createError}</p>}
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsCreateOpen(false)}
								disabled={isSavingCreate}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={isSavingCreate}>
								{isSavingCreate ? 'Guardando...' : 'Crear reporte'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Summary Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-card border border-border rounded-lg p-4">
					<p className="text-sm text-muted-foreground mb-1">Total Reportes</p>
					<p className="text-2xl font-bold text-foreground">{tickets.length}</p>
				</div>
				<div className="bg-card border border-border rounded-lg p-4">
					<p className="text-sm text-muted-foreground mb-1">Pendientes</p>
					<p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
				</div>
				<div className="bg-card border border-border rounded-lg p-4">
					<p className="text-sm text-muted-foreground mb-1">Ultima actualizacion</p>
					<p className="text-2xl font-bold text-foreground">{lastUpdated}</p>
				</div>
			</div>
		</div>
	)
}
