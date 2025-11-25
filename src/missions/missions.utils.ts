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