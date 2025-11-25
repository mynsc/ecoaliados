import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';
import { toast } from 'sonner';
import mockMissions from './missions.data';
import type { Mission } from './missions.types';
import { getTodaySum, reportItems, getProgressPercentage, sortMissionsByPriority } from './missions.utils';

const STORAGE_KEY = 'ecoaliados.missions.v1';

function loadMissionsFromStorage(): Mission[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.v === 1 && Array.isArray(parsed.missions)) return parsed.missions;
    return null;
  } catch {
    return null;
  }
}

function saveMissionsToStorage(missions: Mission[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, missions }));
  } catch (e) {
    // silent
  }
}

export default function Missions() {
  const [missions, setMissions] = useState<Mission[]>(() => loadMissionsFromStorage() ?? mockMissions);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [inputCount, setInputCount] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    saveMissionsToStorage(missions);
  }, [missions]);

  const openReport = (id: string) => {
    setError(null);
    setInputCount(1);
    setNote('');
    setSelectedMissionId(id);
  };

  const closeModal = () => setSelectedMissionId(null);

  const submitReport = () => {
    if (!selectedMissionId) return;
    
    const { result, missions: updatedMissions } = reportItems(
      missions,
      selectedMissionId,
      inputCount,
      note,
      new Date()
    );
    
    if (!result.success) {
      setError(result.message);
      toast.error('Error al reportar', {
        description: result.message,
      });
      return;
    }
    
    setMissions(updatedMissions);
    const mission = updatedMissions.find(m => m.id === selectedMissionId);
    
    // Animar si se completó la misión
    if (result.completed) {
      setJustCompleted(prev => new Set(prev).add(selectedMissionId));
      setTimeout(() => {
        setJustCompleted(prev => {
          const next = new Set(prev);
          next.delete(selectedMissionId);
          return next;
        });
      }, 2000);
    }
    
    toast.success(result.message, {
      description: result.completed 
        ? '🎉 ¡Felicitaciones por completar la misión!' 
        : `+${result.added} ${mission?.metadata?.unit ?? 'items'} agregados`,
      duration: result.completed ? 5000 : 3000,
    });
    closeModal();
  };

  // Ordenar misiones por prioridad antes de mostrar
  const sortedMissions = sortMissionsByPriority(missions);
  const mainMission = sortedMissions[0];

  return (
    <div className="space-y-4">
      {/* Tarjeta principal*/}
      {mainMission && (
        <Card className="shadow-lg transition-all hover:shadow-md">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src="https://placehold.co/100x100/A3E635/000?text=M"
                alt={mainMission.title}
                className="rounded-full border-4 border-lime-400 p-1"
              />
              <span className="absolute bottom-0 right-0 text-xl animate-pulse" role="img" aria-label="Efecto de brillo">✨</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">¡Hola, EcoGuardián!</h2>
              <p className="text-md text-gray-600 mt-1">{mainMission.description}</p>
            </div>
            <Progress
              value={getProgressPercentage(mainMission)}
              className="w-full bg-gray-200 h-2.5 rounded-full"
            />
            <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              Misión activa: <span className="font-bold">{mainMission.currentCount} de {mainMission.targetCount} {mainMission.metadata?.unit ?? 'items'}</span>
            </div>
            <Button
              className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md transition-colors"
              aria-label="Reportar en misión principal"
              onClick={() => openReport(mainMission.id)}
              disabled={!mainMission.active || mainMission.completed}
            >
              Reportar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Logros*/}
      <Card className="shadow-lg transition-all hover:shadow-md">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-600" /> Tus Recompensas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sortedMissions
              .filter(m => m.rewardUnlocked && m.reward)
              .map((m) => (
              <Badge 
                key={m.id} 
                variant="outline" 
                className={`${
                  m.reward?.claimed 
                    ? 'bg-gray-50 text-gray-500' 
                    : 'bg-purple-50 text-purple-700'
                } font-semibold text-sm py-2 px-3 flex items-center justify-center`}
              >
                {m.reward?.claimed ? '✓ ' : '🎁 '}
                {m.reward?.title ?? m.title}
              </Badge>
            ))}
          </div>
          <Button
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-colors"
            aria-label="Canjear más recompensas"
          >
            Canjear más recompensas
          </Button>
        </CardContent>
      </Card>

      {/* Lista de misiones */}
      {sortedMissions.map((m) => {
        const percent = getProgressPercentage(m);
        return (
          <Card key={m.id} className={`shadow-md transition-all ${justCompleted.has(m.id) ? 'mission-completed' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl" aria-hidden>{m.metadata?.icon ?? '🎯'}</div>
                    <div>
                      <h4 className="font-bold text-gray-800">{m.title}</h4>
                      <p className="text-sm text-gray-500">{m.description}</p>
                      {m.rewardUnlocked && !m.reward?.claimed && (
                        <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800 text-xs">
                          🎁 Recompensa disponible
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {m.completed ? (
                    <span className="text-sm font-semibold text-green-600">Completada</span>
                  ) : (
                    <span className="text-sm text-gray-500">{m.currentCount} / {m.targetCount} {m.metadata?.unit ?? 'items'}</span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <Progress value={percent} className="h-2.5" />
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>{percent}%</span>
                  <span>+{getTodaySum(m)} hoy</span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  onClick={() => openReport(m.id)}
                  disabled={!m.active || m.completed}
                  aria-label={`Reportar en ${m.title}`}
                >
                  Reportar
                </Button>
                <Button variant="ghost" onClick={() => {
                  const manual: Mission = { ...m, currentCount: m.targetCount, completed: true, active: false, updatedAt: new Date().toISOString() };
                  setMissions(ms => ms.map(x => x.id === m.id ? manual : x));
                }}>
                  Marcar como completada (dev)
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Modal simple */}
      {selectedMissionId && (() => {
        const mission = missions.find((x) => x.id === selectedMissionId)!;
        const todaySum = getTodaySum(mission);
        const remaining = Math.max(0, mission.targetCount - mission.currentCount);
        return (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10">
              <h3 className="text-lg font-bold mb-2">{mission.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{mission.description}</p>

              <div className="space-y-2">
                <label className="block text-sm">Cantidad (máx {remaining})</label>
                <input
                  type="number"
                  min={1}
                  max={remaining}
                  value={inputCount}
                  onChange={(e) => setInputCount(Number(e.target.value))}
                  className="w-full border rounded px-2 py-1"
                />
                <label className="block text-sm">Nota (opcional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded px-2 py-1"
                />
                <div className="text-xs text-gray-500">
                  Límite diario: {mission.metadata?.dailyLimit ?? 'sin límite'} — ya reportado hoy: {todaySum}
                </div>
                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
                <Button onClick={submitReport} disabled={inputCount <= 0 || inputCount > remaining}>
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}