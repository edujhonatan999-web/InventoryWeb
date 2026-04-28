/**
 * HOOK: useIsMobile
 * 
 * PROPÓSITO:
 * - Detecta si la pantalla es móvil (< 768px)
 * - Usa media queries para detectar cambios responsivos en tiempo real
 * - Retorna boolean para mostrar/ocultar componentes en móvil
 * 
 * SEGURO PARA MODIFICAR: SÍ
 * - No tiene efectos secundarios críticos
 * - Cambiar el breakpoint (768) es seguro
 * 
 * CONEXIONES:
 * - Usado en componentes para renderizado condicional
 * - Ejemplo: {useIsMobile() && <MobileMenu />}
 * 
 * NOTA TÉCNICA:
 * - Estado inicial es undefined para evitar hydration mismatch
 * - Se actualiza en useEffect después del mount
 * - Limpia el listener al desmontar
 */

import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
