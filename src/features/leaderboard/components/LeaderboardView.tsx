import { Card, CardContent } from '@/components/ui';
import { Users } from 'lucide-react';

export function LeaderboardView() {
    return (
        <div className="space-y-6">
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Users className="h-6 w-6 text-blue-600" /> Ranking EcoAliados
                    </h3>
                    <ul className="space-y-3">
                        {[
                            { position: 1, name: "Javier G.", points: "125 kg" },
                            { position: 2, name: "Mariana P.", points: "110 kg" },
                            { position: 3, name: "Sofía R.", points: "98 kg" },
                        ].map((user) => (
                            <li
                                key={user.position}
                                className={`flex justify-between items-center p-3 rounded-md ${user.position === 1 ? "bg-blue-50" : "hover:bg-gray-50"
                                    }`}
                            >
                                <span className={`font-bold text-lg ${user.position === 1 ? "text-blue-600" : "text-gray-500"
                                    }`}>
                                    #{user.position}
                                </span>
                                <span className="font-medium">{user.name}</span>
                                <span className="font-semibold text-gray-700">{user.points}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
