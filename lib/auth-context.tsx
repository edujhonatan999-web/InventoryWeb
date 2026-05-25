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
  userRole: UserRole | null;
  logout: () => void;
  isLoading: boolean;  // ← Crítico para evitar hydration mismatch
  canAccessPath: (path: string) => boolean;
  canDelete: boolean;
}

export type UserRole = 'admin' | 'user';

const ROLE_ACCESS = {
  admin: {
    allowedPaths: ['*'],
    canDelete: true,
  },
  user: {
    allowedPaths: ['/dashboard', '/dashboard/movements', '/dashboard/products', '/dashboard/reports'],
    canDelete: false,
  },
} satisfies Record<UserRole, { allowedPaths: string[]; canDelete: boolean }>;

const normalizeRole = (value: string | null) => {
  if (value === 'admin' || value === 'user') {
    return value;
  }
  return null;
};

const decodeJwtPayload = (token: string) => {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const getRoleFromToken = (token: string | null) => {
  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const rawRole = String(payload.role_name ?? payload.role ?? '').toLowerCase();
  return normalizeRole(rawRole) ?? null;
};

export const isPathAllowed = (role: UserRole, path: string) => {
  if (ROLE_ACCESS[role].allowedPaths.includes('*')) {
    return true;
  }

  return ROLE_ACCESS[role].allowedPaths.some((basePath) =>
    path === basePath || path.startsWith(`${basePath}/`)
  );
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
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
      const cookieToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('authToken='))
        ?.split('=')[1];

      const authenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      const email = sessionStorage.getItem('userEmail');
      const storedRole = normalizeRole(sessionStorage.getItem('userRole'));
      const tokenRole = getRoleFromToken(cookieToken ? decodeURIComponent(cookieToken) : null);

      const hasToken = Boolean(cookieToken);
      const hasAccess = authenticated || hasToken;
      const resolvedRole = hasAccess ? storedRole ?? tokenRole ?? 'user' : null;

      setIsAuthenticated(hasAccess);
      setUserEmail(email || null);
      setUserRole(resolvedRole);
      setIsLoading(false);

      // Redirigir si no está autenticado y está en ruta protegida
      if (!authenticated && !hasToken && pathname !== '/' && !pathname?.startsWith('/login') && !pathname?.startsWith('/signup')) {
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
    document.cookie = 'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        userRole,
        logout,
        isLoading,
        canAccessPath: (path) => (userRole ? isPathAllowed(userRole, path) : false),
        canDelete: userRole ? ROLE_ACCESS[userRole].canDelete : false,
      }}
    >
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
