import { Card, CardContent, Button, Progress, Badge } from '@/components/ui';
import { Star, Award } from 'lucide-react';
import { useMissions } from './hooks/useMissions';
import { MissionCard } from './components/MissionCard';
import { MissionReportModal } from './components/MissionReportModal';
import { getProgressPercentage } from './missions.utils';
import type { Mission } from './missions.types';

export default function Missions() {
  const {
    setMissions,
    sortedMissions,
    mainMission,
    selectedMission,
    inputCount,
    setInputCount,
    note,
    setNote,
    error,
    justCompleted,
    openReport,
    closeModal,
    submitReport,
  } = useMissions();

  const handleDevComplete = (m: Mission) => {
    const manual: Mission = { ...m, currentCount: m.targetCount, completed: true, active: false, updatedAt: new Date().toISOString() };
    setMissions(ms => ms.map(x => x.id === m.id ? manual : x));
  };

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
                  className={`${m.reward?.claimed
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
      {sortedMissions.map((m) => (
        <MissionCard
          key={m.id}
          mission={m}
          isJustCompleted={justCompleted.has(m.id)}
          onReport={openReport}
          onDevComplete={handleDevComplete}
        />
      ))}

      {/* Modal simple */}
      {selectedMission && (
        <MissionReportModal
          mission={selectedMission}
          inputCount={inputCount}
          setInputCount={setInputCount}
          note={note}
          setNote={setNote}
          error={error}
          onClose={closeModal}
          onSubmit={submitReport}
        />
      )}
    </div>
  );
}