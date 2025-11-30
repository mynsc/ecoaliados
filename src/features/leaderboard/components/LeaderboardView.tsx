import { Card, CardContent } from '@/components/ui';
import { Users, Trophy, Medal, Award } from 'lucide-react';
import { useLeaderboard } from '../hooks/useLeaderboard';

export function LeaderboardView() {
    const { leaderboard, userPosition } = useLeaderboard();

    // Función para obtener medalla según posición
    const getMedalIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Award className="h-5 w-5 text-orange-600" />;
            default:
                return null;
        }
    };

    // Función para obtener color de fondo según posición y si es usuario
    const getBackgroundClass = (position: number, isCurrentUser: boolean) => {
        if (isCurrentUser) {
            return 'bg-green-50 border-2 border-green-500';
        }
        if (position === 1) {
            return 'bg-yellow-50';
        }
        if (position <= 3) {
            return 'bg-gray-50';
        }
        return 'hover:bg-gray-50';
    };

    // Función para obtener color del número de posición
    const getPositionClass = (position: number, isCurrentUser: boolean) => {
        if (isCurrentUser) {
            return 'text-green-600 font-bold';
        }
        if (position === 1) {
            return 'text-yellow-600 font-bold';
        }
        if (position <= 3) {
            return 'text-gray-600 font-bold';
        }
        return 'text-gray-500 font-semibold';
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Users className="h-6 w-6 text-blue-600" /> Ranking EcoAliados
                        </h3>
                        {userPosition && (
                            <div className="text-sm font-medium text-green-600">
                                Tu posición: #{userPosition}
                            </div>
                        )}
                    </div>

                    <ul className="space-y-3">
                        {leaderboard.map((entry, index) => {
                            const position = index + 1;
                            const medal = getMedalIcon(position);

                            return (
                                <li
                                    key={entry.profile.id}
                                    className={`flex justify-between items-center p-3 rounded-md transition-colors ${getBackgroundClass(position, entry.isCurrentUser)}`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className={`text-lg min-w-10 ${getPositionClass(position, entry.isCurrentUser)}`}>
                                            #{position}
                                        </span>
                                        {medal && <span>{medal}</span>}
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl" role="img" aria-label={`Avatar ${entry.profile.avatar}`}>
                                                {entry.profile.avatar}
                                            </span>
                                            <span className="font-medium">
                                                {entry.profile.name}
                                                {entry.isCurrentUser && (
                                                    <span className="ml-2 text-xs text-green-600 font-semibold">(Tú)</span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-700">{entry.totalKg} kg</span>
                                </li>
                            );
                        })}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
