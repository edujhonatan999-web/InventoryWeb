/**
 * PÁGINA: Redireccionador de Inicio (/)
 * 
 * PROPÓSITO:
 * - Detecta estado de autenticación
 * - Redirige a /dashboard si está autenticado
 * - Redirige a /login si NO está autenticado
 * - Muestra spinner mientras carga
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - Cambiar destinos de redirección es seguro
 * - Cambiar mensaje de loading es seguro
 * - NO cambiar lógica de autenticación (está en AuthProvider)
 * 
 * CONEXIONES:
 * - Lee de: useAuth() → lib/auth-context.tsx
 * - Redirige a: /dashboard (usuarios autenticados)
 * - Redirige a: /login (usuarios no autenticados)
 * 
 * FLUJO:
 * 1. Cliente abre http://:3000/
 * 2. useAuth() lee de sessionStorage
 * 3. Si isLoading = true → muestra spinner
 * 4. Cuando carga → redirige según isAuthenticated
 */

'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isLoading, isAuthenticated, router])

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
