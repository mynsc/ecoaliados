import { useContext } from 'react';
import { MissionsContext } from './MissionsContext';
import { ProfileContext } from './ProfileContext';

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

/**
 * Hook personalizado para acceder al contexto de perfil.
 * Debe usarse dentro de un ProfileProvider.
 * 
 * @throws Error si se usa fuera del ProfileProvider
 * @returns El contexto de perfil con el estado y función de actualización
 */
export function useProfileContext() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
}

// Exportar el provider
export { MissionsProvider } from './MissionsProvider';
export { ProfileProvider } from './ProfileProvider';

// Exportar tipos si son necesarios
export type { MissionsContextType } from './MissionsContext';
export type { ProfileContextType, Profile } from './ProfileContext';
