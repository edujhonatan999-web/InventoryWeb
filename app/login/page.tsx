/**
 * PÁGINA: Login (/login)
 * 
 * PROPÓSITO:
 * - Formulario de autenticación
 * - Valida email y contraseña
 * - Guarda credenciales en sessionStorage
 * - Redirige a dashboard después de login exitoso
 * 
 * ⚠️ SEGURO PARA MODIFICAR: SÍ (con notas)
 * - ✅ Cambiar estilos/diseño del formulario
 * - ✅ Agregar campos de validación
 * - ⚠️ Validación de credenciales es mock (no conectada a backend)
 * - ❌ NO cambiar dónde se guardan credenciales sin entender seguridad
 * 
 * CONEXIONES:
 * - Lee de: sessionStorage (login)
 * - Escribe a: sessionStorage → isAuthenticated, userEmail
 * - Redirige a: / (raíz) → luego va a /dashboard
 * - Usado por: useAuth() en contexto
 * 
 * VALIDACIÓN ACTUAL:
 * 1. Email debe tener formato válido (@, .)
 * 2. Contraseña mínimo 6 caracteres
 * 3. Ambos campos obligatorios
 * 4. NO valida contra backend (es mock)
 * 
 * CREDENCIALES DEMO:
 * - Email: admin@inventory.com
 * - Contraseña: password123 (cualquier contraseña de 6+ caracteres sirve)
 * 
 * TODO FUTURO:
 * - Conectar a API real de autenticación
 * - Usar JWT tokens en lugar de sessionStorage
 * - Implementar "Remember me" con cookies seguras
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Boxes } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Simula llamada a API (en producción: fetch a endpoint real)
    setTimeout(() => {
      // Guarda datos en sessionStorage (AuthProvider los leerá)
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userEmail', email);
      router.push('/');  // Redirige a / → AuthProvider redirige a /dashboard
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-primary rounded-lg p-2">
            <Boxes className="w-6 h-6 text-primary-foreground" />
            <span className="font-bold text-primary-foreground">InventoryHub</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">
              Sign in to manage your inventory
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@inventoryhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:text-primary/90 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-border text-primary cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Email: <code className="bg-secondary/50 px-2 py-1 rounded">admin@inventory.com</code></p>
              <p>Password: <code className="bg-secondary/50 px-2 py-1 rounded">password123</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:text-primary/90 font-medium transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
