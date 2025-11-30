import type { Mission, ReportEvent, ReportResult } from './missions.types';
import { MAX_REPORT_EVENTS_PER_MISSION } from './missions.types';

/** Generador simple de id (suficiente para frontend/local) */
function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/** ISO ahora */
function nowISO(): string {
  return new Date().toISOString();
}

/** Extrae YYYY-MM-DD de un timestamp ISO o Date */
function toYMD(ts: string | Date): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts;
  // usar toISOString para normalizar zona y formato
  return d.toISOString().slice(0, 10);
}

/** Devuelve la suma de 'added' de los reportes del mismo día (por defecto hoy) */
export function getTodaySum(mission: Mission, referenceDate: Date = new Date()): number {
  const day = toYMD(referenceDate);
  const reports = mission.reports ?? [];
  return reports.reduce((acc, r) => (toYMD(r.timestamp) === day ? acc + (r.added || 0) : acc), 0);
}

/** Comprueba si una misión está completada según sus contadores */
export function isCompleted(mission: Mission): boolean {
  return (mission.currentCount ?? 0) >= (mission.targetCount ?? Infinity);
}

/**
 * Calcula el porcentaje de progreso de una misión (0-100).
 * @param mission - La misión a evaluar
 * @returns Porcentaje redondeado entre 0 y 100
 */
export function getProgressPercentage(mission: Mission): number {
  const current = mission.currentCount ?? 0;
  const target = mission.targetCount ?? 1;

  // Evitar división por cero
  if (target === 0) return 100;

  const percentage = (current / target) * 100;
  
  // Limitar a rango 0-100 y redondear
  return Math.round(Math.min(100, Math.max(0, percentage)));
}

/** Asegura que el array de reports no supere MAX_REPORT_EVENTS_PER_MISSION.
 *  Se asume que reports están en orden cronológico (más antiguo primero).
 */
export function capReports(reports: ReportEvent[] = []): ReportEvent[] {
  if (reports.length <= MAX_REPORT_EVENTS_PER_MISSION) return [...reports];
  // conservar los más recientes: slice desde el final
  return reports.slice(-MAX_REPORT_EVENTS_PER_MISSION);
}

/**
 * pushReport: intenta añadir un reporte a la misión respetando invariantes:
 * - added debe ser > 0 y finito
 * - misión debe estar active
 * - respetar metadata.dailyLimit si existe
 * - mantener máximo de eventos y no superar targetCount
 *
 * Devuelve ReportResult y misión actualizada en result.mission (copia inmutable).
 */
export function pushReport(
  mission: Mission,
  added: number,
  note?: string,
  referenceDate: Date = new Date()
): ReportResult {
  // validaciones básicas
  if (!isFinite(added) || added <= 0) {
    return { success: false, message: 'La cantidad debe ser un número mayor que 0.' };
  }

  if (!mission.active) {
    return { success: false, message: 'La misión no está activa.' };
  }

  const now = nowISO();

  // comprobar límite diario si está definido
  const dailyLimit = mission.metadata?.dailyLimit;
  if (typeof dailyLimit === 'number' && isFinite(dailyLimit)) {
    const todaySum = getTodaySum(mission, referenceDate);
    if (todaySum + added > dailyLimit) {
      return {
        success: false,
        message: `Límite diario excedido. Ya reportaste ${todaySum} hoy (límite ${dailyLimit}).`,
      };
    }
  }

  // crear evento
  const event: ReportEvent = {
    id: generateId(),
    added,
    timestamp: now,
    note,
  };

  const oldReports = mission.reports ?? [];
  const newReports = [...oldReports, event];
  const cappedReports = capReports(newReports);

  // actualizar contador sin pasar de targetCount
  const prevCount = mission.currentCount ?? 0;
  const target = mission.targetCount ?? Infinity;
  const newCount = Math.min(target, prevCount + added);
  const completed = newCount >= target;

  const updatedMission: Mission = {
    ...mission,
    currentCount: newCount,
    reports: cappedReports,
    lastReportedAt: now,
    updatedAt: now,
    completed,
    // desactivar misión si quedó completada (comportamiento propuesto)
    active: completed ? false : mission.active,
    // desbloquear recompensa al completar (una vez desbloqueado, siempre desbloqueado)
    rewardUnlocked: completed || mission.rewardUnlocked,
  };

  return {
    success: true,
    message: completed ? 'Reporte agregado. ¡Misión completada!' : 'Reporte agregado correctamente.',
    added,
    newCount,
    completed,
    mission: updatedMission,
  };
}

/**
 * reportItems: busca una misión en el array por id y agrega un reporte usando pushReport.
 * Devuelve el resultado del reporte y el array de misiones actualizado (copia inmutable).
 * 
 * @param missions - Array completo de misiones
 * @param missionId - ID de la misión a reportar
 * @param count - Cantidad a reportar (debe ser > 0)
 * @param note - Nota opcional para el reporte
 * @param referenceDate - Fecha de referencia (por defecto hoy)
 * @returns Objeto con result (ReportResult) y missions (array actualizado)
 */
export function reportItems(
  missions: Mission[],
  missionId: string,
  count: number,
  note?: string,
  referenceDate: Date = new Date()
): { result: ReportResult; missions: Mission[] } {
  // Validar que missions sea un array válido
  if (!Array.isArray(missions)) {
    return {
      result: { success: false, message: 'El array de misiones no es válido.' },
      missions: [],
    };
  }

  // Buscar la misión por id
  const mission = missions.find((m) => m.id === missionId);
  if (!mission) {
    return {
      result: { success: false, message: 'Misión no encontrada.' },
      missions,
    };
  }

  // Invocar pushReport existente
  const reportResult = pushReport(mission, count, note, referenceDate);

  // Si pushReport falla, retornar sin modificar el array
  if (!reportResult.success) {
    return {
      result: reportResult,
      missions,
    };
  }

  // Si tiene éxito, actualizar el array inmutablemente
  const updatedMissions = missions.map((m) =>
    m.id === missionId ? reportResult.mission! : m
  );

  return {
    result: reportResult,
    missions: updatedMissions,
  };
}

/**
 * Ordena misiones por prioridad.
 * Criterios:
 * 1. Misiones completadas al final
 * 2. Misiones activas primero
 * 3. Misiones iniciadas primero (currentCount > 0)
 *    - Entre iniciadas: ordenar por progreso descendente (más avanzadas primero)
 * 4. Misiones sin iniciar después
 *    - Entre no iniciadas: ordenar por priority ascendente (menor número primero)
 * 5. Desempate final por fecha de última actualización (más reciente primero)
 * 
 * @param missions - Array de misiones a ordenar
 * @returns Nuevo array ordenado (no muta el original)
 */
export function sortMissionsByPriority(missions: Mission[]): Mission[] {
  return [...missions].sort((a, b) => {
    // 1. Completadas al final
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    // 2. Activas primero
    if (a.active !== b.active) {
      return a.active ? -1 : 1;
    }

    // 3. Separar iniciadas de no iniciadas
    const aStarted = (a.currentCount ?? 0) > 0;
    const bStarted = (b.currentCount ?? 0) > 0;
    if (aStarted !== bStarted) {
      return aStarted ? -1 : 1;
    }

    // 4. Ambas iniciadas: ordenar por progreso (mayor primero)
    if (aStarted && bStarted) {
      const progressA = getProgressPercentage(a);
      const progressB = getProgressPercentage(b);
      if (progressA !== progressB) {
        return progressB - progressA;
      }
      // Desempate por priority
      const priorityA = a.metadata?.priority ?? 999;
      const priorityB = b.metadata?.priority ?? 999;
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // Desempate final por fecha (más reciente primero)
      const dateA = new Date(a.lastReportedAt ?? a.updatedAt ?? a.createdAt ?? 0).getTime();
      const dateB = new Date(b.lastReportedAt ?? b.updatedAt ?? b.createdAt ?? 0).getTime();
      return dateB - dateA;
    }

    // 5. Ambas sin iniciar: ordenar por priority (menor primero)
    const priorityA = a.metadata?.priority ?? 999;
    const priorityB = b.metadata?.priority ?? 999;
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Desempate final por fecha de creación (más reciente primero)
    const dateA = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const dateB = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Calcula la racha de días consecutivos con reportes.
 * Una racha se mantiene si hay al menos un reporte por día, contando desde hoy o ayer.
 * Si el último reporte es de hace más de 1 día, la racha se considera rota (retorna 0).
 * 
 * @param missions - Array de todas las misiones del usuario
 * @returns Número de días consecutivos con al menos un reporte (0 si no hay racha activa)
 * 
 * @example
 * // Usuario reportó hoy, ayer y anteayer
 * calculateStreak(missions) // => 3
 * 
 * // Usuario reportó hace 3 días (racha rota)
 * calculateStreak(missions) // => 0
 */
export function calculateStreak(missions: Mission[]): number {
  // Recolectar todos los reportes de todas las misiones
  const allReports = missions.flatMap(m => m.reports ?? []);
  
  if (allReports.length === 0) return 0;

  // Extraer fechas únicas en formato YYYY-MM-DD
  const reportDates = allReports.map(r => toYMD(r.timestamp));
  const uniqueDates = [...new Set(reportDates)].sort((a, b) => b.localeCompare(a)); // descendente

  if (uniqueDates.length === 0) return 0;

  // Verificar si la racha está activa (último reporte fue hoy o ayer)
  const today = toYMD(new Date());
  const yesterday = toYMD(new Date(Date.now() - 24 * 60 * 60 * 1000));
  
  const mostRecentDate = uniqueDates[0];
  
  // Si el último reporte no es de hoy ni de ayer, la racha está rota
  if (mostRecentDate !== today && mostRecentDate !== yesterday) {
    return 0;
  }

  // Contar días consecutivos hacia atrás desde el más reciente
  let streak = 1;
  let currentDate = new Date(mostRecentDate);

  for (let i = 1; i < uniqueDates.length; i++) {
    // Calcular el día anterior esperado
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    const expectedDate = toYMD(previousDay);

    // Si la siguiente fecha en el array es el día anterior consecutivo, incrementar racha
    if (uniqueDates[i] === expectedDate) {
      streak++;
      currentDate = new Date(uniqueDates[i]);
    } else {
      // La secuencia se rompió
      break;
    }
  }

  return streak;
}