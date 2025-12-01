import type { Profile } from '@/contexts';

/**
 * Tipo para entrada del leaderboard.
 * Combina perfil con estadísticas.
 */
export interface LeaderboardEntry {
    profile: Profile;
    totalKg: string;
    completedMissions: number;
    currentStreak: number;
    isCurrentUser: boolean;  // Flag para identificar al usuario real
}

/**
 * Nombres aleatorios para NPCs.
 */
const NPC_NAMES = [
    'Danna K.', 'Carlos R.', 'Diana P.', 'Eduardo S.', 'Fernanda L.',
    'Gabriel T.', 'Helena V.', 'Ignacio B.', 'Juliana C.', 'Kevin D.',
    'Laura F.', 'Miguel A.', 'Natalia G.', 'Oscar H.', 'Basilio S.',
    'Ricardo J.', 'Sofia K.', 'Tomás N.', 'Valentina O.', 'William Q.'
];

/**
 * Avatares aleatorios para NPCs.
 */
const NPC_AVATARS = [
    '🌱', '🌿', '🍃', '🌾', '🌳', '🌲', '🌴', '🌵', '🌷', '🌸',
    '🌺', '🌻', '🌼', '🌽', '🍀', '🍁', '🍂', '🌰', '🌹', '🪴'
];

/**
 * Genera un perfil NPC aleatorio.
 * 
 * @param index - Índice para generar datos únicos
 * @returns Perfil NPC
 */
function generateNPCProfile(index: number): Profile {
    const name = NPC_NAMES[index % NPC_NAMES.length];
    const avatar = NPC_AVATARS[index % NPC_AVATARS.length];
    
    return {
        id: `npc-${index}`,
        name,
        avatar,
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    };
}

/**
 * Genera estadísticas para un NPC basadas en las del usuario.
 * Algunos NPCs tendrán mejores stats, otros peores.
 * 
 * @param userTotalKg - Total de kg del usuario
 * @param userMissions - Misiones completadas del usuario
 * @param userStreak - Racha actual del usuario
 * @param variance - Factor de variación (0-1, default 0.5)
 * @returns Estadísticas del NPC
 */
function generateNPCStats(
    userTotalKg: number,
    userMissions: number,
    userStreak: number,
    variance: number = 0.5
): { totalKg: string; completedMissions: number; currentStreak: number } {
    // Generar variación aleatoria (-variance a +variance)
    const randomFactor = (Math.random() * 2 - 1) * variance;
    
    // Calcular stats del NPC con variación
    const npcKg = Math.max(0.1, userTotalKg * (1 + randomFactor));
    const npcMissions = Math.max(0, Math.round(userMissions * (1 + randomFactor * 0.8)));
    const npcStreak = Math.max(0, Math.round(userStreak * (1 + randomFactor * 0.6)));
    
    return {
        totalKg: npcKg.toFixed(1),
        completedMissions: npcMissions,
        currentStreak: npcStreak
    };
}

/**
 * Genera un leaderboard completo con NPCs y el usuario real.
 * 
 * @param userProfile - Perfil del usuario real
 * @param userStats - Estadísticas del usuario real
 * @returns Array de entradas del leaderboard ordenadas por totalKg (top 10)
 */
export function generateLeaderboard(
    userProfile: Profile,
    userStats: { totalKg: string; completedMissions: number; currentStreak: number }
): LeaderboardEntry[] {
    const userTotalKg = parseFloat(userStats.totalKg);
    
    // Generar entre 7-10 NPCs
    const npcCount = Math.floor(Math.random() * 4) + 7; // 7 a 10
    
    const npcs: LeaderboardEntry[] = [];
    
    for (let i = 0; i < npcCount; i++) {
        const npcProfile = generateNPCProfile(i);
        const npcStats = generateNPCStats(
            userTotalKg,
            userStats.completedMissions,
            userStats.currentStreak
        );
        
        npcs.push({
            profile: npcProfile,
            totalKg: npcStats.totalKg,
            completedMissions: npcStats.completedMissions,
            currentStreak: npcStats.currentStreak,
            isCurrentUser: false
        });
    }
    
    // Agregar usuario real
    const userEntry: LeaderboardEntry = {
        profile: userProfile,
        totalKg: userStats.totalKg,
        completedMissions: userStats.completedMissions,
        currentStreak: userStats.currentStreak,
        isCurrentUser: true
    };
    
    // Combinar NPCs y usuario
    const allEntries = [...npcs, userEntry];
    
    // Ordenar por totalKg descendente
    allEntries.sort((a, b) => parseFloat(b.totalKg) - parseFloat(a.totalKg));
    
    // Retornar solo top 10
    return allEntries.slice(0, 10);
}
