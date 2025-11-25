import { describe, it, expect } from 'vitest';
import type { Mission } from './missions.types';
import { reportItems, pushReport, getTodaySum, isCompleted } from './missions.utils';

describe('reportItems', () => {
  const baseMission: Mission = {
    id: 'test-mission-1',
    type: 'count',
    title: 'Reciclar chapitas',
    description: 'Recolecta 10 chapitas',
    targetCount: 10,
    currentCount: 0,
    active: true,
    completed: false,
    createdAt: new Date().toISOString(),
    reports: [],
  };

  it('debe retornar error si el array de missions no es válido', () => {
    const { result, missions } = reportItems(null as any, 'test-mission-1', 5);
    expect(result.success).toBe(false);
    expect(result.message).toContain('no es válido');
    expect(missions).toEqual([]);
  });

  it('debe retornar error si la misión no existe', () => {
    const missions = [baseMission];
    const { result, missions: updatedMissions } = reportItems(missions, 'id-inexistente', 5);
    expect(result.success).toBe(false);
    expect(result.message).toContain('no encontrada');
    expect(updatedMissions).toEqual(missions);
  });

  it('debe retornar error si count es negativo o cero', () => {
    const missions = [baseMission];
    const { result: result1 } = reportItems(missions, baseMission.id, -5);
    expect(result1.success).toBe(false);
    expect(result1.message).toContain('mayor que 0');

    const { result: result2 } = reportItems(missions, baseMission.id, 0);
    expect(result2.success).toBe(false);
    expect(result2.message).toContain('mayor que 0');
  });

  it('debe retornar error si la misión no está activa', () => {
    const inactiveMission = { ...baseMission, active: false };
    const missions = [inactiveMission];
    const { result } = reportItems(missions, baseMission.id, 5);
    expect(result.success).toBe(false);
    expect(result.message).toContain('no está activa');
  });

  it('debe agregar un reporte exitoso y actualizar el array de missions', () => {
    const missions = [baseMission];
    const { result, missions: updatedMissions } = reportItems(missions, baseMission.id, 5);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('agregado correctamente');
    expect(result.newCount).toBe(5);
    expect(result.completed).toBe(false);
    
    const updatedMission = updatedMissions.find((m) => m.id === baseMission.id);
    expect(updatedMission).toBeDefined();
    expect(updatedMission!.currentCount).toBe(5);
    expect(updatedMission!.reports).toHaveLength(1);
    expect(updatedMission!.reports![0].added).toBe(5);
  });

  it('debe completar la misión cuando se alcanza el targetCount', () => {
    const missions = [baseMission];
    const { result, missions: updatedMissions } = reportItems(missions, baseMission.id, 10);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('completada');
    expect(result.newCount).toBe(10);
    expect(result.completed).toBe(true);
    
    const updatedMission = updatedMissions.find((m) => m.id === baseMission.id);
    expect(updatedMission!.completed).toBe(true);
    expect(updatedMission!.active).toBe(false);
  });

  it('debe respetar el límite diario si está configurado', () => {
    const missionWithLimit: Mission = {
      ...baseMission,
      metadata: { dailyLimit: 5 },
    };
    const missions = [missionWithLimit];
    
    // Primer reporte: 3 chapitas
    const { missions: updated1 } = reportItems(missions, baseMission.id, 3);
    
    // Segundo reporte: 3 chapitas más (excede el límite de 5)
    const { result } = reportItems(updated1, baseMission.id, 3);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('Límite diario excedido');
  });

  it('no debe superar el targetCount aunque se reporte más', () => {
    const missions = [baseMission];
    const { result, missions: updatedMissions } = reportItems(missions, baseMission.id, 15);
    
    expect(result.success).toBe(true);
    expect(result.newCount).toBe(10); // cap al targetCount
    expect(result.completed).toBe(true);
    
    const updatedMission = updatedMissions.find((m) => m.id === baseMission.id);
    expect(updatedMission!.currentCount).toBe(10);
  });

  it('debe mantener otras misiones sin cambios', () => {
    const mission2: Mission = {
      ...baseMission,
      id: 'test-mission-2',
      title: 'Otra misión',
    };
    const missions = [baseMission, mission2];
    
    const { missions: updatedMissions } = reportItems(missions, baseMission.id, 5);
    
    const unchangedMission = updatedMissions.find((m) => m.id === 'test-mission-2');
    expect(unchangedMission).toEqual(mission2);
  });
});

describe('pushReport', () => {
  const mission: Mission = {
    id: 'test-1',
    type: 'count',
    title: 'Test',
    description: 'Test mission',
    targetCount: 10,
    currentCount: 0,
    active: true,
    completed: false,
    createdAt: new Date().toISOString(),
    reports: [],
  };

  it('debe agregar un reporte válido', () => {
    const result = pushReport(mission, 5);
    expect(result.success).toBe(true);
    expect(result.newCount).toBe(5);
    expect(result.mission?.reports).toHaveLength(1);
  });

  it('debe rechazar count <= 0', () => {
    const result = pushReport(mission, 0);
    expect(result.success).toBe(false);
  });
});

describe('getTodaySum', () => {
  it('debe calcular la suma de reportes del día', () => {
    const today = new Date();
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 5,
      active: true,
      completed: false,
      createdAt: today.toISOString(),
      reports: [
        { id: '1', added: 2, timestamp: today.toISOString() },
        { id: '2', added: 3, timestamp: today.toISOString() },
      ],
    };
    
    const sum = getTodaySum(mission, today);
    expect(sum).toBe(5);
  });
});

describe('isCompleted', () => {
  it('debe retornar true si currentCount >= targetCount', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 10,
      active: true,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    expect(isCompleted(mission)).toBe(true);
  });

  it('debe retornar false si currentCount < targetCount', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 5,
      active: true,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    expect(isCompleted(mission)).toBe(false);
  });
});
