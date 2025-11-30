import { Card, CardContent, Button } from '@/components/ui';
import { useProfileStats } from '../hooks/useProfileStats';

export function ProfileView() {
    const { profile, totalKg, completedMissions, daysSinceJoined, currentStreak } = useProfileStats();

    // Formatear fecha de creación (año)
    const joinYear = new Date(profile.createdAt).getFullYear();

    return (
        <div className="space-y-6">
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                        <span className="text-5xl" role="img" aria-label={`Avatar ${profile.avatar}`}>
                            {profile.avatar}
                        </span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                        <p className="text-sm text-gray-500">EcoAliado desde {joinYear}</p>
                    </div>
                    <div className="w-full space-y-3 text-center">
                        <p className="font-medium">
                            Total reciclado: <span className="font-bold text-green-600">{totalKg} kg</span>
                        </p>
                        <p className="font-medium">
                            Misiones completadas: <span className="font-bold text-blue-600">{completedMissions}</span>
                        </p>
                        <p className="font-medium">
                            Racha actual: <span className="font-bold text-orange-600">{currentStreak} {currentStreak === 1 ? 'día' : 'días'}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            Lleva {daysSinceJoined} {daysSinceJoined === 1 ? 'día' : 'días'} en la comunidad
                        </p>
                        <Button
                            variant="outline"
                            className="w-full mt-4 border-gray-300 hover:bg-gray-50 transition-colors"
                            aria-label="Editar perfil"
                        >
                            Editar perfil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
