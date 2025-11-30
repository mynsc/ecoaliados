import { useState } from 'react';
import { Card, CardContent, Button, Progress, Badge } from '@/components/ui';
import { Gift, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useHomeData } from '../hooks/useHomeData';
import { useMissionsContext, useProfileContext } from '@/contexts';
import { sortMissionsByPriority } from '@/features/missions/missions.utils';

interface HomeViewProps {
    onNavigateToMissions: () => void;
}

export function HomeView({ onNavigateToMissions }: HomeViewProps) {
    const { streak, todayRecycled, streakProgress, nextMilestone } = useHomeData();
    const [isRewardsExpanded, setIsRewardsExpanded] = useState(false);
    
    // Obtener perfil del usuario
    const { profile } = useProfileContext();
    
    // Obtener misiones del contexto y filtrar recompensas desbloqueadas
    const { missions } = useMissionsContext();
    const sortedMissions = sortMissionsByPriority(missions);
    const unlockedRewards = sortedMissions.filter(m => m.rewardUnlocked && m.reward);

    return (
        <div className="space-y-6">
            {/* --- Tarjeta de Bienvenida --- */}
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                        <span className="text-5xl" role="img" aria-label={`Avatar ${profile.avatar}`}>
                            {profile.avatar}
                        </span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">¡Hola, {profile.name}!</h2>
                        <p className="text-md text-gray-600 mt-1">
                            Tu impacto hoy equivale a <span className="font-semibold text-green-600">{todayRecycled} kg</span> de reciclaje. <span role="img" aria-label="Hoja">🌱</span>
                        </p>
                    </div>
                    <Progress
                        value={streakProgress}
                        className="w-full bg-gray-200 h-2.5 rounded-full"
                    />
                    <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        Racha de <span className="font-bold">{streak} {streak === 1 ? 'día' : 'días'}</span> {streak > 0 ? '🔥' : '♻️'}
                    </div>
                    {streak > 0 && nextMilestone && (
                        <p className="text-xs text-gray-500 text-center">
                            ¡{nextMilestone - streak} {nextMilestone - streak === 1 ? 'día' : 'días'} más para alcanzar {nextMilestone} días!
                        </p>
                    )}
                    <Button
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors"
                        aria-label="Registrar nuevo reciclaje"
                        onClick={onNavigateToMissions}
                    >
                        Registrar nuevo reciclaje
                    </Button>
                </CardContent>
            </Card>

            {/* --- Recompensas --- */}
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Gift className="h-6 w-6 text-purple-600" /> Tus Recompensas
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {unlockedRewards
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
                            <p className="text-sm text-gray-600 font-medium">Más recompensas disponibles:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                                    15% en Cineplanet
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                                    Delivery gratis
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                                    3x2 en Starbucks
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                                    20% en H&M
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                                    Pin exclusivo
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                                    Bolsa reutilizable
                                </Badge>
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
                                Canjear más recompensas
                                <ChevronDown className="h-4 w-4" />
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
