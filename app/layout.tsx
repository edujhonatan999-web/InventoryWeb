/**
 * LAYOUT RAÍZ: RootLayout
 * 
 * PROPÓSITO:
 * - Define estructura HTML base de toda la aplicación
 * - Envuelve con AuthProvider (gestión de autenticación global)
 * - Importa estilos globales
 * - Configura metadatos
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ
 * - ✅ Agregar providers adicionales (Toaster, ThemeProvider, etc)
 * - ✅ Cambiar metadatos (title, description, icons)
 * - ❌ NO remover AuthProvider sin reemplazo (toda la app depende)
 * - ❌ NO remover globals.css (se pierde todo el diseño)
 * 
 * CONEXIONES:
 * - Envuelve: Todas las páginas (app/page.tsx, app/login/page.tsx, etc)
 * - Incluye: AuthProvider → controla acceso a /dashboard
 * - Estilos: globals.css → variables CSS, temas claro/oscuro
 * 
 * JERARQUÍA:
 * RootLayout (este archivo)
 *   ├── AuthProvider (lib/auth-context.tsx)
 *   │   ├── /page.tsx (redirige a login o dashboard)
 *   │   ├── /login/page.tsx
 *   │   └── /dashboard/layout.tsx (layout del dashboard)
 *   └── Analytics (solo en producción)
 */

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'InventoryIES',
  description: 'Gestión de inventario para la empresa',
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logoic.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {/* AuthProvider: Envuelve toda la app para gestionar autenticación */}
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Analytics: Solo en producción (Vercel) */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
