// Identificador de misión
export type MissionId = string;

// Tipos de misión básicos
export type MissionType = 'count' | 'visit';

// Evento de reporte (historial). Guardar últimos N=100 eventos por misión.
export interface ReportEvent {
  id: string;            // uuid del evento
  added: number;         // cantidad reportada en este evento (>=0)
  timestamp: string;     // ISO string (new Date().toISOString())
  note?: string;         // texto opcional (ej. foto, comentario)
}

// Recompensa embebida simple
export interface Reward {
  id: string;
  type: 'badge' | 'discount' | 'item' | 'points';
  title: string;
  description?: string;
  value?: number;       // porcentaje, puntos, etc.
  claimed?: boolean;
}

// Tipo principal de misión
export interface Mission {
  id: MissionId;
  type: MissionType;
  title: string;
  description: string;

  // Para misiones tipo "count"
  targetCount: number;    // meta total (ej. 10 chapitas)
  currentCount: number;   // progreso actual (>=0, <= targetCount)

  // Historial de reportes (últimos N eventos). Mantener tamaño máximo en la lógica.
  reports?: ReportEvent[]; // orden recomendado: más antiguo primero (push al final)

  // Estados
  active: boolean;        // si está activa para reportes
  completed: boolean;     // si ya se alcanzó la meta

  // Fechas en formato ISO
  createdAt: string;
  updatedAt?: string;
  lastReportedAt?: string; // último reporte (ISO)

  // Recompensa embebida
  reward?: Reward;

  // Metadata extensible
  metadata?: {
    icon?: string;
    unit?: string;          // unidad para los items (ej. 'chapitas', 'botellas', 'árboles', 'visitas')
    dailyLimit?: number;    // máximo por día (opcional)
    priority?: number;
    [key: string]: any;
  };
}

// Resultado resumen de una operación de reporte
export interface ReportResult {
  success: boolean;
  message: string;
  added?: number;
  newCount?: number;
  completed?: boolean;
  mission?: Mission;
}
export const MAX_REPORT_EVENTS_PER_MISSION = 100;