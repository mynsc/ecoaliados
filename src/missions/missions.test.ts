import { describe, it, expect } from 'vitest';
import type { Mission } from './missions.types';
import { reportItems, pushReport, getTodaySum, isCompleted, getProgressPercentage, sortMissionsByPriority } from './missions.utils';

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

describe('getProgressPercentage', () => {
  it('debe retornar 50% cuando está a la mitad', () => {
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
    
    expect(getProgressPercentage(mission)).toBe(50);
  });

  it('debe retornar 100% cuando está completa', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 10,
      active: true,
      completed: true,
      createdAt: new Date().toISOString(),
    };
    
    expect(getProgressPercentage(mission)).toBe(100);
  });

  it('debe retornar 100% cuando currentCount supera targetCount', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 15,
      active: true,
      completed: true,
      createdAt: new Date().toISOString(),
    };
    
    expect(getProgressPercentage(mission)).toBe(100);
  });

  it('debe retornar 0% cuando no hay progreso', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 0,
      active: true,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    expect(getProgressPercentage(mission)).toBe(0);
  });

  it('debe retornar 100% cuando targetCount es 0', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 0,
      currentCount: 0,
      active: true,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    expect(getProgressPercentage(mission)).toBe(100);
  });

  it('debe manejar valores undefined y retornar 0%', () => {
    const mission: Mission = {
      id: 'test-1',
      type: 'count',
      title: 'Test',
      description: 'Test',
      targetCount: 10,
      currentCount: 0,
      active: true,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    expect(getProgressPercentage(mission)).toBe(0);
  });
});

describe('sortMissionsByPriority', () => {
  const createMission = (overrides: Partial<Mission>): Mission => ({
    id: `mission-${Math.random()}`,
    type: 'count',
    title: 'Test',
    description: 'Test',
    targetCount: 10,
    currentCount: 0,
    active: true,
    completed: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  });

  it('debe poner misiones activas primero', () => {
    const missions = [
      createMission({ id: 'inactive', active: false }),
      createMission({ id: 'active', active: true }),
    ];
    
    const sorted = sortMissionsByPriority(missions);
    expect(sorted[0].id).toBe('active');
    expect(sorted[1].id).toBe('inactive');
  });

  it('debe poner misiones no completadas primero', () => {
    const missions = [
      createMission({ id: 'completed', completed: true, currentCount: 10 }),
      createMission({ id: 'incomplete', completed: false, currentCount: 5 }),
    ];
    
    const sorted = sortMissionsByPriority(missions);
    expect(sorted[0].id).toBe('incomplete');
    expect(sorted[1].id).toBe('completed');
  });

  it('debe ordenar por mayor progreso primero entre activas no completadas', () => {
    const missions = [
      createMission({ id: 'low', currentCount: 2 }), // 20%
      createMission({ id: 'high', currentCount: 8 }), // 80%
      createMission({ id: 'mid', currentCount: 5 }), // 50%
    ];
    
    const sorted = sortMissionsByPriority(missions);
    expect(sorted[0].id).toBe('high'); // 80%
    expect(sorted[1].id).toBe('mid'); // 50%
    expect(sorted[2].id).toBe('low'); // 20%
  });

  it('debe aplicar todos los criterios en orden correcto', () => {
    const missions = [
      createMission({ id: 'inactive-complete', active: false, completed: true, currentCount: 10 }),
      createMission({ id: 'active-complete', active: true, completed: true, currentCount: 10 }),
      createMission({ id: 'inactive-incomplete', active: false, completed: false, currentCount: 5 }),
      createMission({ id: 'active-incomplete-low', active: true, completed: false, currentCount: 2 }),
      createMission({ id: 'active-incomplete-high', active: true, completed: false, currentCount: 8 }),
    ];
    
    const sorted = sortMissionsByPriority(missions);
    
    // Orden esperado:
    // 1. active-incomplete-high (activa, no completada, 80%)
    // 2. active-incomplete-low (activa, no completada, 20%)
    // 3. active-complete (activa, completada)
    // 4. inactive-incomplete (inactiva, no completada)
    // 5. inactive-complete (inactiva, completada)
    
    expect(sorted[0].id).toBe('active-incomplete-high');
    expect(sorted[1].id).toBe('active-incomplete-low');
    expect(sorted[2].id).toBe('active-complete');
    expect(sorted[3].id).toBe('inactive-incomplete');
    expect(sorted[4].id).toBe('inactive-complete');
  });

  it('no debe mutar el array original', () => {
    const missions = [
      createMission({ id: 'second', currentCount: 2 }),
      createMission({ id: 'first', currentCount: 8 }),
    ];
    
    const original = [...missions];
    sortMissionsByPriority(missions);
    
    expect(missions).toEqual(original);
  });

  it('debe manejar array vacío', () => {
    const sorted = sortMissionsByPriority([]);
    expect(sorted).toEqual([]);
  });
});
