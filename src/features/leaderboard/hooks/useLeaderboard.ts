import { useMemo } from 'react';
import { useProfileContext } from '@/contexts';
import { useProfileStats } from '@/features/profile/hooks/useProfileStats';
import { generateLeaderboard } from '../leaderboard.utils';

/**
 * Hook personalizado para generar y gestionar el leaderboard.
 * Combina el perfil del usuario con NPCs generados dinámicamente.
 * 
 * @returns Array de entradas del leaderboard (top 10) y posición del usuario
 */
export function useLeaderboard() {
    // Obtener contexto y estadísticas del usuario
    const { profile } = useProfileContext();
    const { totalKg, completedMissions, currentStreak } = useProfileStats();

    // Generar leaderboard dinámico
    const leaderboard = useMemo(() => {
        return generateLeaderboard(profile, {
            totalKg,
            completedMissions,
            currentStreak
        });
    }, [profile, totalKg, completedMissions, currentStreak]);

    // Encontrar posición del usuario (1-indexed)
    const userPosition = useMemo(() => {
        const index = leaderboard.findIndex(entry => entry.isCurrentUser);
        return index !== -1 ? index + 1 : null;
    }, [leaderboard]);

    // Encontrar entrada del usuario
    const userEntry = useMemo(() => {
        return leaderboard.find(entry => entry.isCurrentUser) || null;
    }, [leaderboard]);

    return {
        leaderboard,      // Array completo del leaderboard (top 10)
        userPosition,     // Posición del usuario (1-10 o null)
        userEntry,        // Entrada completa del usuario
    };
}
