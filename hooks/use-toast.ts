/**
 * HOOK: useToast
 * 
 * PROPÓSITO:
 * - Gestiona notificaciones toast en la aplicación
 * - Almacena estado global de toasts (máximo 1 visible)
 * - Proporciona funciones para crear, actualizar y cerrar toasts
 * 
 * SEGURO PARA MODIFICAR: SÍ (con cuidado)
 * - Cambiar TOAST_LIMIT es seguro (controla cuántos toasts mostrar simultáneamente)
 * - NO cambiar la estructura interna de reducer sin conocer las implicaciones
 * 
 * CONEXIONES:
 * - Se conecta con: <Toaster /> en componentes UI
 * - Usado en: cualquier componente que necesite mostrar notificaciones
 * - Ejemplo: const { toast } = useToast(); toast({title: 'Éxito'})
 * 
 * FLUJO:
 * 1. Hook lee estado global de toasts
 * 2. Dispatch actualiza estado global y notifica listeners
 * 3. Toasts se eliminan después de TOAST_REMOVE_DELAY (1000000ms = no auto-remove)
 * 4. Se puede cerrar manualmente con toast.dismiss()
 * 
 * NOTA: Este es un sistema global, NO un Context de React.
 * Usa listeners para notificar cambios a todos los componentes que usan el hook.
 */

'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1  // Máximo 1 toast visible a la vez
const TOAST_REMOVE_DELAY = 1000000  // No se auto-elimina

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * REDUCER: Gestiona transiciones de estado de toasts
 * - ADD_TOAST: Agrega nuevo toast (respeta TOAST_LIMIT)
 * - UPDATE_TOAST: Modifica props de un toast existente
 * - DISMISS_TOAST: Marca toast como cerrado (dispara auto-remove)
 * - REMOVE_TOAST: Elimina definitivamente de la lista
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Sistema global: listeners notificados cuando estado cambia
const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

/**
 * FUNCIÓN: toast()
 * - Crea y abre un nuevo toast
 * - Retorna objeto con: id, dismiss(), update()
 * - Usable fuera de componentes React
 */
function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * HOOK: useToast()
 * - Suscribe componente a cambios de estado global
 * - Retorna estado y funciones para manipular toasts
 * - Se desuscribe automáticamente al desmontar
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
