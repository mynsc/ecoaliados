import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Gift, Award } from 'lucide-react';

export function HomeView() {
    return (
        <div className="space-y-6">
            {/* --- Tarjeta de Bienvenida --- */}
            <Card className="shadow-lg transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                        <span className="text-5xl" role="img" aria-label="Emoji de hoja">🌿</span>
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">¡Hola, Matias!</h2>
                        <p className="text-md text-gray-600 mt-1">
                            Hoy reciclaste <span className="font-semibold text-green-600">2.3 kg</span> de plástico. <span role="img" aria-label="Planeta Tierra">🌍</span>
                        </p>
                    </div>
                    <Progress
                        value={10}
                        className="w-full bg-gray-200 h-2.5 rounded-full"
                    />
                    <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        Racha de <span className="font-bold">7 días</span> <span role="img" aria-label="Símbolo de reciclaje">♻️</span>
                    </div>
                    <Button
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-md transition-colors"
                        aria-label="Registrar nuevo reciclaje"
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
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                            10% en Bodega
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                            2x1 en AJE
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 font-semibold text-sm py-2 px-3 flex items-center justify-center">
                            Sticker especial
                        </Badge>
                    </div>
                    <Button
                        className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-colors"
                        aria-label="Canjear más recompensas"
                    >
                        Canjear más recompensas
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
