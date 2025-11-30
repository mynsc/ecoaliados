import type { Mission } from '@/features/missions/missions.types';

/**
 * Calcula el total de items reportados en todas las misiones (lifetime).
 * 
 * @param missions - Array de misiones
 * @returns Total de items reportados
 */
export function calculateTotalItems(missions: Mission[]): number {
    return missions.reduce((sum, m) => sum + (m.currentCount || 0), 0);
}

/**
 * Convierte total de items a kilogramos.
 * Asume ~150g por item promedio.
 * 
 * @param totalItems - Total de items
 * @returns Kilogramos con 1 decimal (string)
 */
export function calculateTotalKg(totalItems: number): string {
    return (totalItems * 0.15).toFixed(1);
}

/**
 * Calcula el total de misiones completadas.
 * 
 * @param missions - Array de misiones
 * @returns Número de misiones completadas
 */
export function calculateCompletedMissions(missions: Mission[]): number {
    return missions.filter(m => m.completed).length;
}

/**
 * Calcula el total de recompensas desbloqueadas.
 * 
 * @param missions - Array de misiones
 * @returns Número de recompensas desbloqueadas
 */
export function calculateTotalRewards(missions: Mission[]): number {
    return missions.filter(m => m.rewardUnlocked && m.reward).length;
}

/**
 * Calcula el total de recompensas canjeadas.
 * 
 * @param missions - Array de misiones
 * @returns Número de recompensas canjeadas
 */
export function calculateClaimedRewards(missions: Mission[]): number {
    return missions.filter(m => m.reward?.claimed).length;
}

/**
 * Calcula días transcurridos desde una fecha.
 * 
 * @param fromDate - Fecha en formato ISO string
 * @returns Número de días transcurridos
 */
export function calculateDaysSince(fromDate: string): number {
    const created = new Date(fromDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
