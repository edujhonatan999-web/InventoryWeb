/**
 * UTILIDAD: Combinador de clases Tailwind CSS
 * 
 * PROPÓSITO:
 * - Combina múltiples clases de Tailwind sin conflictos
 * - Resuelve conflictos entre clases (ej: w-full y w-1/2)
 * - Permite pasar clases condicionales fácilmente
 * 
 * SEGURO PARA MODIFICAR: SÍ
 * - Es una utilidad pura que no tiene dependencias de estado
 * - Se usa en componentes para construir clases dinámicas
 * 
 * CONEXIONES:
 * - Usado en: todos los componentes que necesitan clases condicionales
 * - Ejemplo: cn('bg-blue-500', isActive && 'opacity-50')
 * 
 * DEPENDENCIAS: clsx (condicionales), tailwind-merge (resolución de conflictos)
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
