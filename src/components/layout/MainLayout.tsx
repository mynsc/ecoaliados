import { useState } from 'react';
import { HomeView } from '@/features/home';
import { LeaderboardView } from '@/features/leaderboard';
import { ProfileView } from '@/features/profile';
import { Missions, useMissions } from '@/features/missions';
import { BottomNavigation } from './BottomNavigation';

export function MainLayout() {
    const [activeTab, setActiveTab] = useState('home');
    const { missions } = useMissions();

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <HomeView missions={missions} />;
            case 'missions':
                return <Missions />;
            case 'leaderboard':
                return <LeaderboardView />;
            case 'profile':
                return <ProfileView />;
            default:
                return null;
        }
    };

    return (
        <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
            {/* Contenido principal con padding ajustado para el footer */}
            <main className="p-4 pb-24 max-w-lg mx-auto transition-opacity duration-200">
                {renderContent()}
            </main>

            {/* Barra de navegación inferior */}
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
}
