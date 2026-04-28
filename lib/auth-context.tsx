/**
 * CONTEXTO: AuthProvider & useAuth
 * 
 * PROPÓSITO:
 * - Gestiona estado global de autenticación
 * - Protege rutas redirigiendo usuarios no autenticados a /login
 * - Persiste credenciales en sessionStorage (no persistente entre tabs)
 * 
 * ⚠️ SEGURO PARA MODIFICAR: PARCIALMENTE
 * - ✅ SÍ: Agregar nuevas propiedades al contexto (ej: userRole)
 * - ✅ SÍ: Cambiar duración del check
 * - ❌ NO: Cambiar la estructura del reducer sin entender flujo completo
 * - ❌ NO: Mover a localStorage sin encriptación (datos sensibles)
 * 
 * CONEXIONES:
 * - Proveedor en: app/layout.tsx (envuelve toda la app)
 * - Usado en: app/page.tsx (redirigir a login/dashboard)
 * - Usado en: components/header.tsx y components/sidebar.tsx (logout)
 * - Usado en: app/dashboard/layout.tsx (protege rutas)
 * 
 * FLUJO DE AUTENTICACIÓN:
 * 1. Usuario abre app → app/page.tsx verifica isAuthenticated
 * 2. Si no autenticado → redirige a /login
 * 3. En /login → usuario ingresa credenciales
 * 4. Si válidas → se guardan en sessionStorage
 * 5. Se redirige a / → ahora isAuthenticated es true → va a /dashboard
 * 6. Logout → limpia sessionStorage → redirige a /login
 * 
 * DATOS ALMACENADOS:
 * - sessionStorage.isAuthenticated: "true" | no existe
 * - sessionStorage.userEmail: "email@example.com" | no existe
 * 
 * NOTA IMPORTANTE: 
 * El isLoading es crítico para evitar "hydration mismatch" en Next.js.
 * React renderiza undefined al servidor, pero al cliente detecta cambios
 * y causa error si no manejamos el loading state correctamente.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  logout: () => void;
  isLoading: boolean;  // ← Crítico para evitar hydration mismatch
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /**
   * EFECTO: Verificar autenticación al montar
   * - Lee datos de sessionStorage
   * - Redirige a /login si no está autenticado (excepto en rutas públicas)
   * - Se ejecuta 1 sola vez al montar el componente
   */
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      const email = sessionStorage.getItem('userEmail');

      setIsAuthenticated(authenticated);
      setUserEmail(email || null);
      setIsLoading(false);

      // Redirigir si no está autenticado y está en ruta protegida
      if (!authenticated && pathname !== '/' && !pathname?.startsWith('/login') && !pathname?.startsWith('/signup')) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  /**
   * FUNCIÓN: logout
   * - Limpia datos de sesión
   * - Redirige a /login
   * - Se usa en Header y Sidebar
   */
  const logout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * HOOK: useAuth
 * - Accede a contexto de autenticación
 * - Puede usarse en cualquier componente hijo de AuthProvider
 * - Lanza error si se usa fuera del Provider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
