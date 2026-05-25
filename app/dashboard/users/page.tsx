"use client"

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import ButtonDelete from '@/components/button-delete'

interface Role {
	id: number
	name: string
	created_at: string
	updated_at: string
}

interface User {
	id: number
	username: string
	password: string
	role_id: number
	created_at: string
	updated_at: string
}
const API_URL= process.env.NEXT_PUBLIC_BACKEND_URL
const ROLES_ENDPOINT = `${API_URL}/rol`
const USERS_ENDPOINT = `${API_URL}/auth/register`

const getAuthToken = () => {
	const tokenPair = document.cookie
		.split('; ')
		.find((row) => row.startsWith('authToken='))
	return tokenPair ? decodeURIComponent(tokenPair.split('=')[1]) : null
}

export default function UsersPage() {
	const [roles, setRoles] = useState<Role[]>([])
	const [users, setUsers] = useState<User[]>([])
	const [rolesError, setRolesError] = useState<string | null>(null)
	const [usersError, setUsersError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const [roleName, setRoleName] = useState('')
	const [editingRoleId, setEditingRoleId] = useState<number | null>(null)
	const [editingRoleName, setEditingRoleName] = useState('')

	const [userForm, setUserForm] = useState({
		username: '',
		password: '',
		role_id: '',
	})
	const [editingUserId, setEditingUserId] = useState<number | null>(null)
	const [editingUserForm, setEditingUserForm] = useState({
		username: '',
		password: '',
		role_id: '',
	})

	const [searchTerm, setSearchTerm] = useState('')
	const [filterRole, setFilterRole] = useState('all')

	useEffect(() => {
		let isMounted = true

		const loadData = async () => {
			setIsLoading(true)
			setRolesError(null)
			setUsersError(null)

			try {
				const [rolesResponse, usersResponse] = await Promise.all([
					fetch(ROLES_ENDPOINT),
					fetch(USERS_ENDPOINT),
				])

				if (!rolesResponse.ok) {
					throw new Error(`Error ${rolesResponse.status}: ${rolesResponse.statusText}`)
				}
				if (!usersResponse.ok) {
					throw new Error(`Error ${usersResponse.status}: ${usersResponse.statusText}`)
				}

				const rolesData = (await rolesResponse.json()) as Role[]
				const usersData = (await usersResponse.json()) as User[]

				if (isMounted) {
					setRoles(Array.isArray(rolesData) ? rolesData : [])
					setUsers(Array.isArray(usersData) ? usersData : [])
				}
			} catch (error) {
				if (isMounted) {
					const message = error instanceof Error ? error.message : 'Error al cargar datos.'
					setRolesError(message)
					setUsersError(message)
					setRoles([])
					setUsers([])
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadData()

		return () => {
			isMounted = false
		}
	}, [])

	const roleOptions = useMemo(() => ['all', ...roles.map((role) => role.id.toString())], [roles])

	const filteredUsers = users.filter((user) => {
		const normalized = searchTerm.toLowerCase().trim()
		const roleName = roles.find((role) => role.id === user.role_id)?.name ?? ''

		const matchesSearch =
			user.username.toLowerCase().includes(normalized) ||
			user.id.toString().includes(normalized) ||
			roleName.toLowerCase().includes(normalized)

		const matchesRole = filterRole === 'all' || user.role_id.toString() === filterRole

		return matchesSearch && matchesRole
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

	const handleCreateRole = async () => {
		const trimmed = roleName.trim()
		if (!trimmed) {
			return
		}

		try {
			const response = await fetch(ROLES_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: trimmed }),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const created = (await response.json()) as Role
			setRoles((prev) => [created, ...prev])
			setRoleName('')
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo crear el rol.')
		}
	}

	const handleUpdateRole = async (roleId: number) => {
		const trimmed = editingRoleName.trim()
		if (!trimmed) {
			return
		}

		try {
			const response = await fetch(`${ROLES_ENDPOINT}/${roleId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: trimmed }),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const updated = (await response.json()) as Role
			setRoles((prev) => prev.map((role) => (role.id === roleId ? updated : role)))
			setEditingRoleId(null)
			setEditingRoleName('')
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo actualizar el rol.')
		}
	}

	const handleDeleteRole = async (roleId: number) => {
		try {
			const response = await fetch(`${ROLES_ENDPOINT}/${roleId}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			setRoles((prev) => prev.filter((role) => role.id !== roleId))
			setUsers((prev) => prev.filter((user) => user.role_id !== roleId))
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo eliminar el rol.')
		}
	}

	const handleCreateUser = async () => {
		const trimmedUsername = userForm.username.trim()
		const trimmedPassword = userForm.password.trim()
		const roleId = Number.parseInt(userForm.role_id, 10)
		const token = getAuthToken()

		if (!trimmedUsername || !trimmedPassword || !roleId) {
			return
		}

		if (!token) {
			window.alert('No se encontro el token de autenticacion.')
			return
		}

		try {
			const response = await fetch(USERS_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					username: trimmedUsername,
					password: trimmedPassword,
					role_id: roleId,
				}),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const created = (await response.json()) as User
			setUsers((prev) => [created, ...prev])
			setUserForm({ username: '', password: '', role_id: '' })
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo crear el usuario.')
		}
	}

	const handleUpdateUser = async (userId: number) => {
		const trimmedUsername = editingUserForm.username.trim()
		const roleId = Number.parseInt(editingUserForm.role_id, 10)

		if (!trimmedUsername || !roleId) {
			return
		}

		const payload = {
			username: trimmedUsername,
			role_id: roleId,
			...(editingUserForm.password.trim()
				? { password: editingUserForm.password.trim() }
				: {}),
		}

		try {
			const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			const updated = (await response.json()) as User
			setUsers((prev) => prev.map((user) => (user.id === userId ? updated : user)))
			setEditingUserId(null)
			setEditingUserForm({ username: '', password: '', role_id: '' })
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo actualizar el usuario.')
		}
	}

	const handleDeleteUser = async (userId: number) => {
		try {
			const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
				method: 'DELETE',
			})

			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`)
			}

			setUsers((prev) => prev.filter((user) => user.id !== userId))
		} catch (error) {
			window.alert(error instanceof Error ? error.message : 'No se pudo eliminar el usuario.')
		}
	}

	return (
		<div className="p-8 space-y-6">
			<div>
				<h1 className="text-4xl font-bold text-foreground">Usuarios y Roles</h1>
				<p className="text-muted-foreground mt-2">Administracion de accesos y permisos</p>
			</div>

			{/* Roles Section */}
			<div className="bg-card border border-border rounded-lg p-6 space-y-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold text-foreground">Roles</h2>
						<p className="text-sm text-muted-foreground">Gestiona los roles disponibles</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-2">
						<input
							type="text"
							placeholder="Nombre del rol"
							value={roleName}
							onChange={(e) => setRoleName(e.target.value)}
							className="w-full sm:w-64 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						/>
						
					</div>
				</div>

				{rolesError && <p className="text-destructive">{rolesError}</p>}

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-border bg-muted">
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Creado</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actualizado</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{roles.map((role) => (
								<tr key={role.id} className="border-b border-border hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 text-sm text-foreground">{role.id}</td>
									<td className="px-6 py-4 text-sm text-foreground">
										{editingRoleId === role.id ? (
											<input
												value={editingRoleName}
												onChange={(e) => setEditingRoleName(e.target.value)}
												className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
											/>
										) : (
											role.name
										)}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{formatDate(role.created_at)}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{formatDate(role.updated_at)}
									</td>
									<td className="px-6 py-4 text-sm">
										<div className="flex gap-2">
											{editingRoleId === role.id ? (
												<>
													<button
														onClick={() => handleUpdateRole(role.id)}
														className="px-3 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium"
													>
														Guardar
													</button>
													<button
														onClick={() => {
															setEditingRoleId(null)
															setEditingRoleName('')
														}}
														className="px-3 py-1 text-muted-foreground hover:bg-muted rounded transition-colors text-xs font-medium"
													>
														Cancelar
													</button>
												</>
											) : (
												<button
													onClick={() => {
														setEditingRoleId(role.id)
														setEditingRoleName(role.name)
													}}
													className="px-3 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium"
												>
													Editar
												</button>
											)}
											<ButtonDelete
												title="Eliminar rol"
												description="Esta seguro de eliminar el rol? Los usuarios con este rol quedaran sin rol."
												onConfirm={() => handleDeleteRole(role.id)}
											/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{roles.length === 0 && !isLoading && (
					<p className="text-muted-foreground">No hay roles registrados.</p>
				)}
			</div>

			{/* Users Section */}
			<div className="bg-card border border-border rounded-lg p-6 space-y-4">
				<div>
					<h2 className="text-2xl font-semibold text-foreground">Usuarios</h2>
					<p className="text-sm text-muted-foreground">Crea, edita y elimina usuarios</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					<div className="lg:col-span-2">
						<label className="block text-sm font-medium text-foreground mb-2">Usuario</label>
						<input
							type="text"
							placeholder="Nombre de usuario"
							value={userForm.username}
							onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value }))}
							className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">Contrasena</label>
						<input
							type="password"
							placeholder="Contrasena"
							value={userForm.password}
							onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
							className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-foreground mb-2">Rol</label>
						<select
							value={userForm.role_id}
							onChange={(e) => setUserForm((prev) => ({ ...prev, role_id: e.target.value }))}
							className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						>
							<option value="">Seleccionar</option>
							{roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div>
					<button
						onClick={handleCreateUser}
						className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
					>
						Agregar usuario
					</button>
				</div>

				<div className="flex flex-col md:flex-row gap-4 items-end">
					<div className="flex-1 min-w-0">
						<label className="block text-sm font-medium text-foreground mb-2">Buscar</label>
						<div className="relative">
							<input
								type="text"
								placeholder="Buscar por usuario o rol"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full px-4 py-2 pl-10 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
						</div>
					</div>
					<div className="w-full md:w-48">
						<label className="block text-sm font-medium text-foreground mb-2">Filtrar rol</label>
						<select
							value={filterRole}
							onChange={(e) => setFilterRole(e.target.value)}
							className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
						>
							{roleOptions.map((roleId) => (
								<option key={roleId} value={roleId}>
									{roleId === 'all'
										? 'Todos'
										: roles.find((role) => role.id.toString() === roleId)?.name ?? roleId}
								</option>
							))}
						</select>
					</div>
				</div>

				{usersError && <p className="text-destructive">{usersError}</p>}

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-border bg-muted">
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">ID</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Usuario</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Rol</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Creado</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actualizado</th>
								<th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Acciones</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((user) => (
								<tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
									<td className="px-6 py-4 text-sm text-foreground">{user.id}</td>
									<td className="px-6 py-4 text-sm text-foreground">
										{editingUserId === user.id ? (
											<input
												value={editingUserForm.username}
												onChange={(e) =>
													setEditingUserForm((prev) => ({ ...prev, username: e.target.value }))
												}
												className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
											/>
										) : (
											user.username
										)}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{editingUserId === user.id ? (
											<select
												value={editingUserForm.role_id}
												onChange={(e) =>
													setEditingUserForm((prev) => ({ ...prev, role_id: e.target.value }))
												}
												className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
											>
												{roles.map((role) => (
													<option key={role.id} value={role.id}>
														{role.name}
													</option>
												))}
											</select>
										) : (
											roles.find((role) => role.id === user.role_id)?.name ?? '-'
										)}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{formatDate(user.created_at)}
									</td>
									<td className="px-6 py-4 text-sm text-muted-foreground">
										{formatDate(user.updated_at)}
									</td>
									<td className="px-6 py-4 text-sm">
										<div className="flex gap-2 items-center">
											{editingUserId === user.id ? (
												<div className="flex flex-col sm:flex-row gap-2">
													<input
														type="password"
														placeholder="Nueva contrasena"
														value={editingUserForm.password}
														onChange={(e) =>
															setEditingUserForm((prev) => ({ ...prev, password: e.target.value }))
														}
														className="w-40 px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
													/>
													<button
														onClick={() => handleUpdateUser(user.id)}
														className="px-3 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium"
													>
														Guardar
													</button>
													<button
														onClick={() => {
															setEditingUserId(null)
															setEditingUserForm({ username: '', password: '', role_id: '' })
														}}
														className="px-3 py-1 text-muted-foreground hover:bg-muted rounded transition-colors text-xs font-medium"
													>
														Cancelar
													</button>
												</div>
											) : (
												<button
													onClick={() => {
														setEditingUserId(user.id)
														setEditingUserForm({
															username: user.username,
															password: '',
															role_id: user.role_id.toString(),
														})
													}}
													className="px-3 py-1 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium"
												>
													Editar
												</button>
											)}
											<ButtonDelete
												title="Eliminar usuario"
												description="Esta seguro de eliminar el usuario? Esta accion no se puede deshacer."
												onConfirm={() => handleDeleteUser(user.id)}
											/>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredUsers.length === 0 && !isLoading && (
					<p className="text-muted-foreground">No hay usuarios que coincidan con tus filtros.</p>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-card border border-border rounded-lg p-4">
					<p className="text-sm text-muted-foreground mb-1">Total Roles</p>
					<p className="text-2xl font-bold text-foreground">{roles.length}</p>
				</div>
				<div className="bg-card border border-border rounded-lg p-4">
					<p className="text-sm text-muted-foreground mb-1">Total Usuarios</p>
					<p className="text-2xl font-bold text-foreground">{users.length}</p>
				</div>
				<div className="bg-card border border-border rounded-lg p-4">
					<p className="text-sm text-muted-foreground mb-1">Usuarios Administradores</p>
					<p className="text-2xl font-bold text-foreground">
						{
							users.filter(
								(user) =>
									roles.find((role) => role.id === user.role_id)?.name.toLowerCase() === 'admin'
							).length
						}
					</p>
				</div>
			</div>
		</div>
	)
}
