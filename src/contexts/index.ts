import { useContext } from 'react';
import { MissionsContext } from './MissionsContext';

/**
 * Hook personalizado para acceder al contexto de misiones.
 * Debe usarse dentro de un MissionsProvider.
 * 
 * @throws Error si se usa fuera del MissionsProvider
 * @returns El contexto de misiones con el estado y setter
 */
export function useMissionsContext() {
    const context = useContext(MissionsContext);
    if (context === undefined) {
        throw new Error('useMissionsContext must be used within a MissionsProvider');
    }
    return context;
}

// Exportar el provider
export { MissionsProvider } from './MissionsProvider';

// Exportar tipos si son necesarios
export type { MissionsContextType } from './MissionsContext';
