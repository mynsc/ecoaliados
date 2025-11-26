import { Card, CardContent, Button } from '@/components/ui';
import { User } from 'lucide-react';

export function ProfileView() {
    return (
        <div className="space-y-6">
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
                        <User className="w-12 h-12 text-gray-600" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Sebastián</h2>
                        <p className="text-sm text-gray-500">EcoAliado desde 2023</p>
                    </div>
                    <div className="w-full space-y-3 text-center">
                        <p className="font-medium">
                            Total reciclado: <span className="font-bold text-green-600">540 kg</span>
                        </p>
                        <p className="font-medium">
                            Misiones completadas: <span className="font-bold text-blue-600">12</span>
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
