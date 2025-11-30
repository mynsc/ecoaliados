import { useState } from 'react';
import { Card, CardContent, Button, Progress, Badge } from '@/components/ui';
import { Star, Gift, ChevronDown, ChevronUp } from 'lucide-react';
import { useMissions } from './hooks/useMissions';
import { MissionCard } from './components/MissionCard';
import { MissionReportModal } from './components/MissionReportModal';
import { getProgressPercentage } from './missions.utils';
import type { Mission, ReportEvent } from './missions.types';
import { useProfileContext } from '@/contexts';

export default function Missions() {
  const { profile } = useProfileContext();
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

  const [isRewardsExpanded, setIsRewardsExpanded] = useState(false);

  // Estado de modo desarrollo
  const [devModeEnabled, setDevModeEnabled] = useState(() => {
    const saved = localStorage.getItem('devModeEnabled');
    return saved === 'true';
  });

  const [secretClickCount, setSecretClickCount] = useState(0);

  // Función de activación del modo dev
  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    
    if (newCount === 6) {
      setDevModeEnabled(true);
      localStorage.setItem('devModeEnabled', 'true');
      setSecretClickCount(0); // Reset counter
    }
  };

  // Función para desactivar modo dev (OBLIGATORIA)
  const disableDevMode = () => {
    setDevModeEnabled(false);
    localStorage.removeItem('devModeEnabled');
    setSecretClickCount(0); // Reset counter también
  };

  const handleDevComplete = (m: Mission) => {
    setMissions(sortedMissions.map(x => {
      if (x.id === m.id) {
        const now = new Date().toISOString();
        const itemsNeeded = x.targetCount - x.currentCount; // Cuántos items faltan
        
        // Crear reporte sintético para completar la misión
        const syntheticReport: ReportEvent = {
          id: `dev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          added: itemsNeeded,
          timestamp: now,
          note: '🔧 Completado en modo desarrollo',
        };
        
        const updatedReports = [...(x.reports ?? []), syntheticReport];
        
        return {
          ...x,
          currentCount: x.targetCount,        // Completar contador
          completed: true,                     // Marcar como completada
          active: false,                       // Desactivar
          rewardUnlocked: true,                // Desbloquear recompensa
          lastReportedAt: now,                 // Actualizar último reporte
          updatedAt: now,                      // Actualizar modificación
          reports: updatedReports,             // Agregar reporte sintético
        };
      }
      return x;
    }));
  };

  return (
    <div className="space-y-4">
      {/* Indicador de modo desarrollo - SIEMPRE VISIBLE cuando está activo */}
      {devModeEnabled && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <Badge className="bg-red-500 text-white font-bold shadow-lg animate-pulse px-3 py-1">
            🔧 DEV MODE
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={disableDevMode}
            className="bg-white hover:bg-gray-100 border border-gray-300 shadow-md"
            aria-label="Desactivar modo desarrollo"
          >
            ✕
          </Button>
        </div>
      )}

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
              <h2 
                className="text-2xl font-bold text-gray-800"
                onClick={handleSecretClick}
                style={{ cursor: 'default', userSelect: 'none' }}
              >
                ¡Sigue adelante, {profile.name}!
              </h2>
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
            <Gift className="h-6 w-6 text-purple-600" /> Tus Recompensas
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {sortedMissions
              .filter(m => m.rewardUnlocked && m.reward)
              .slice(0, 3)
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

          {/* Contenido expandible */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isRewardsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="pt-4 space-y-3 border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium">Más recompensas desbloqueadas:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {sortedMissions
                  .filter(m => m.rewardUnlocked && m.reward)
                  .slice(3)
                  .map((m) => (
                    <Badge
                      key={m.id}
                      variant="outline"
                      className={`${m.reward?.claimed
                        ? 'bg-gray-50 text-gray-500'
                        : 'bg-blue-50 text-blue-700'
                        } font-semibold text-sm py-2 px-3 flex items-center justify-center`}
                    >
                      {m.reward?.claimed ? '✓ ' : '🎁 '}
                      {m.reward?.title ?? m.title}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-colors flex items-center justify-center gap-2"
            aria-label="Canjear más recompensas"
            onClick={() => setIsRewardsExpanded(!isRewardsExpanded)}
          >
            {isRewardsExpanded ? (
              <>
                Ver menos recompensas
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Ver más recompensas
                <ChevronDown className="h-4 w-4" />
              </>
            )}
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
          devModeEnabled={devModeEnabled}
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