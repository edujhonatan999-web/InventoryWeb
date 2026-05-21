/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, type ReactNode } from 'react'
import { Trash2 } from 'lucide-react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface ButtonDeleteProps {
	title?: string
	description?: string
	confirmLabel?: string
	cancelLabel?: string
	trigger?: ReactNode
	onConfirm: () => void | Promise<void>
}

export default function ButtonDelete({
	title = 'Eliminar registro',
	description = 'Esta seguro de eliminar el registro? Esta accion no se puede deshacer.',
	confirmLabel = 'Eliminar',
	cancelLabel = 'Cancelar',
	trigger,
	onConfirm,
}: ButtonDeleteProps) {
	const [isBusy, setIsBusy] = useState(false)

	const handleConfirm = async () => {
		setIsBusy(true)
		try {
			await onConfirm()
		} finally {
			setIsBusy(false)
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				{trigger ?? (
					<button
						className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
						title="Delete"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isBusy}>{cancelLabel}</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-white hover:bg-destructive/90"
						onClick={handleConfirm}
						disabled={isBusy}
					>
						{isBusy ? 'Eliminando...' : confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
