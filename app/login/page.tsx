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
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validación
    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      setIsLoading(false);
      return;
    }

    if (username.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      setIsLoading(false);
      return;
    }

    if (password.trim().length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        setError('Nombre de usuario o contraseña incorrectos');
        setIsLoading(false);
        return;
      }

      const data = (await response.json());
      const token = data.access_token;
      if (!token) {
        setError('Error: ntr');
        setIsLoading(false);
        return;
      }

      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `authToken=${encodeURIComponent(token)}; Path=/; SameSite=Strict${secureFlag}`;

      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userEmail', username.trim());
      router.push('/');
    } catch (err) {
      setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2 bg-primary rounded-lg p-2">
            <Boxes className="w-6 h-6 text-primary-foreground" />
            <span className="font-bold text-primary-foreground">Inventory.IES</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Bienvenido</h1>
            <p className="text-muted-foreground text-sm">
              Ingresese sus credenciales para acceder a su panel de control de inventario.
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
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ejemplo123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Contraseña
                </Label>
               
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

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground mb-3">Nota:</p>
            <p className="text-xs text-muted-foreground">
           Este software se creo para ser usado por el personal de TI de la insitucion educativa, por lo que necesitas tener una cuenta para poder ingresar. Si no tienes una cuenta, por favor contacta al administrador del sistema para obtener acceso.
            </p>
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
