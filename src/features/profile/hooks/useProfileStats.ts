import { useMemo } from 'react';
import { calculateStreak } from '@/features/missions/missions.utils';
import { 
    calculateTotalItems, 
    calculateTotalKg, 
    calculateCompletedMissions,
    calculateTotalRewards,
    calculateClaimedRewards,
    calculateDaysSince
} from '../profile.utils';
import { useMissionsContext, useProfileContext } from '@/contexts';

/**
 * Hook personalizado para calcular estadísticas del perfil del usuario.
 * Combina datos del perfil con estadísticas calculadas desde las misiones.
 * 
 * @returns Objeto con estadísticas del usuario (totalKg, completedMissions, streaks, etc.)
 */
export function useProfileStats() {
    // Obtener contextos
    const { missions } = useMissionsContext();
    const { profile } = useProfileContext();

    // Calcular racha actual
    const currentStreak = useMemo(() => calculateStreak(missions), [missions]);

    // Calcular mejor racha histórica (por ahora igual a currentStreak, puede expandirse)
    const longestStreak = useMemo(() => {
        // TODO: En el futuro, guardar esto en el perfil o calcular del historial completo
        return currentStreak;
    }, [currentStreak]);

    // Calcular total de items reciclados usando función compartida
    const totalItems = useMemo(() => calculateTotalItems(missions), [missions]);

    // Convertir a kilogramos usando función compartida
    const totalKg = useMemo(() => calculateTotalKg(totalItems), [totalItems]);

    // Calcular total de misiones completadas usando función compartida
    const completedMissions = useMemo(() => calculateCompletedMissions(missions), [missions]);

    // Calcular total de recompensas desbloqueadas usando función compartida
    const totalRewards = useMemo(() => calculateTotalRewards(missions), [missions]);

    // Calcular recompensas canjeadas usando función compartida
    const claimedRewards = useMemo(() => calculateClaimedRewards(missions), [missions]);

    // Calcular días desde creación del perfil usando función compartida
    const daysSinceJoined = useMemo(() => calculateDaysSince(profile.createdAt), [profile.createdAt]);

    return {
        // Datos del perfil
        profile,
        
        // Estadísticas calculadas
        totalKg,                // Total de kg reciclados (string con 1 decimal)
        totalItems,             // Total de items reciclados (number)
        completedMissions,      // Total de misiones completadas
        currentStreak,          // Racha actual en días
        longestStreak,          // Mejor racha histórica
        totalRewards,           // Total de recompensas desbloqueadas
        claimedRewards,         // Recompensas canjeadas
        daysSinceJoined,        // Días desde que se unió
    };
}

