import { Card, CardContent, Button, Progress, Badge } from '@/components/ui';
import { getProgressPercentage, getTodaySum } from '../missions.utils';
import type { Mission } from '../missions.types';

interface MissionCardProps {
    mission: Mission;
    isJustCompleted: boolean;
    onReport: (id: string) => void;
    onDevComplete: (mission: Mission) => void;
}

export function MissionCard({ mission, isJustCompleted, onReport, onDevComplete }: MissionCardProps) {
    const percent = getProgressPercentage(mission);

    return (
        <Card className={`shadow-md transition-all ${isJustCompleted ? 'mission-completed' : ''}`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl" aria-hidden>{mission.metadata?.icon ?? '🎯'}</div>
                            <div>
                                <h4 className="font-bold text-gray-800">{mission.title}</h4>
                                <p className="text-sm text-gray-500">{mission.description}</p>
                                {mission.rewardUnlocked && !mission.reward?.claimed && (
                                    <Badge variant="secondary" className="mt-1 bg-yellow-100 text-yellow-800 text-xs">
                                        🎁 Recompensa disponible
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        {mission.completed ? (
                            <span className="text-sm font-semibold text-green-600">Completada</span>
                        ) : (
                            <span className="text-sm text-gray-500">{mission.currentCount} / {mission.targetCount} {mission.metadata?.unit ?? 'items'}</span>
                        )}
                    </div>
                </div>

                <div className="mt-3">
                    <Progress value={percent} className="h-2.5" />
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>{percent}%</span>
                        <span>+{getTodaySum(mission)} hoy</span>
                    </div>
                </div>

                <div className="mt-3 flex gap-2">
                    <Button
                        onClick={() => onReport(mission.id)}
                        disabled={!mission.active || mission.completed}
                        aria-label={`Reportar en ${mission.title}`}
                    >
                        Reportar
                    </Button>
                    <Button variant="ghost" onClick={() => onDevComplete(mission)}>
                        Marcar como completada (dev)
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
