import { Button } from '@/components/ui/button';
import { Home, TreePine, Trophy, User } from 'lucide-react';

interface BottomNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
    const tabs = [
        { id: 'home', icon: Home, label: 'Inicio' },
        { id: 'missions', icon: TreePine, label: 'Misiones' },
        { id: 'leaderboard', icon: Trophy, label: 'Ranking' },
        { id: 'profile', icon: User, label: 'Perfil' },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
            <nav className="max-w-lg mx-auto flex justify-around items-center p-2">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant="ghost"
                        onClick={() => onTabChange(tab.id)}
                        className={`flex flex-col items-center gap-1 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'text-green-600 bg-green-50 rounded-lg'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        aria-label={`Ir a ${tab.label}`}
                    >
                        <tab.icon className="h-5 w-5" />
                        {tab.label}
                    </Button>
                ))}
            </nav>
        </footer>
    );
}
