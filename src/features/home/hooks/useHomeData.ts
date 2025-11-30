import { useMemo } from 'react';
import { calculateStreak } from '@/features/missions/missions.utils';
import { useMissionsContext } from '@/contexts';

/**
 * Hook personalizado para calcular datos dinámicos del Home.
 * Calcula estadísticas del usuario basadas en el historial de misiones.
 * Obtiene las misiones directamente del contexto global.
 * 
 * @returns Objeto con datos calculados (racha, kg reciclados hoy, progreso)
 */
export function useHomeData() {
  // Obtener misiones del contexto global
  const { missions } = useMissionsContext();
  // Calcular racha de días consecutivos
  const streak = useMemo(() => calculateStreak(missions), [missions]);

  // Calcular kilogramos reciclados hoy
  const todayRecycled = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Obtener todos los reportes de hoy de todas las misiones
    const todayReports = missions.flatMap(m =>
      (m.reports || []).filter(r => r.timestamp.startsWith(today))
    );

    // Sumar items reportados hoy
    const totalItemsToday = todayReports.reduce((sum, r) => sum + r.added, 0);

    // Convertir a kilogramos (asumiendo ~150g por item promedio)
    return (totalItemsToday * 0.15).toFixed(1);
  }, [missions]);

  // Calcular progreso hacia el próximo hito de racha
  const streakProgress = useMemo(() => {
    // Hitos comunes: 7, 14, 30, 60, 90, 180, 365 días
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    
    // Encontrar el próximo hito
    const nextMilestone = milestones.find(m => m > streak) || 365;
    
    // Calcular porcentaje de progreso
    return Math.round((streak / nextMilestone) * 100);
  }, [streak]);

  // Obtener el próximo hito para mostrar al usuario
  const nextMilestone = useMemo(() => {
    const milestones = [7, 14, 30, 60, 90, 180, 365];
    return milestones.find(m => m > streak) || 365;
  }, [streak]);

  // Calcular total de misiones completadas
  const completedMissions = useMemo(() => {
    return missions.filter(m => m.completed).length;
  }, [missions]);

  // Calcular total de items reportados (lifetime)
  const totalItemsRecycled = useMemo(() => {
    return missions.reduce((sum, m) => sum + (m.currentCount || 0), 0);
  }, [missions]);

  return {
    streak,                  // Racha actual en días
    todayRecycled,          // Kg reciclados hoy (string con 1 decimal)
    streakProgress,         // Porcentaje hacia próximo hito (0-100)
    nextMilestone,          // Próximo hito a alcanzar
    completedMissions,      // Total de misiones completadas
    totalItemsRecycled,     // Total de items reciclados (lifetime)
  };
}
