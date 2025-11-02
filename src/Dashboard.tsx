import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Users, Trophy, User, Home, TreePine, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            {/* --- Tarjeta de Bienvenida --- */}
            <Card className="shadow-lg transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                  <span className="text-5xl" role="img" aria-label="Emoji de hoja">🌿</span>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800">¡Hola, Sebastián!</h2>
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

      case 'missions':
        return (
          <div className="space-y-6">
            {/* --- Misión Principal --- */}
            <Card className="shadow-lg transition-all hover:shadow-md">
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                <div className="relative">
                  <img 
                    src="https://placehold.co/100x100/A3E635/000?text=M" 
                    alt="Misión Pandito - Recoge chapitas para salvar al oso" 
                    className="rounded-full border-4 border-lime-400 p-1" 
                  />
                  <span className="absolute bottom-0 right-0 text-xl animate-pulse" role="img" aria-label="Efecto de brillo">✨</span>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800">¡Hola, EcoGuardián!</h2>
                  <p className="text-md text-gray-600 mt-1">¡Salva a Pandito del basural! <span role="img" aria-label="Botella de jugo">🧃</span></p>
                </div>
                <Progress 
                  value={40} 
                  className="w-full bg-gray-200 h-2.5 rounded-full" 
                />
                <div className="text-sm text-gray-500 font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" /> 
                  Misión activa: <span className="font-bold">4 de 10 chapitas</span>
                </div>
                <Button 
                  className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white shadow-md transition-colors"
                  aria-label="Reportar chapitas recolectadas"
                >
                  Reportar chapitas
                </Button>
              </CardContent>
            </Card>

            {/* --- Logros --- */}
            <Card className="shadow-lg transition-all hover:shadow-md">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-orange-500" /> Mis Logros
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <Badge className="bg-lime-100 text-lime-900 font-bold py-2 px-3 text-center border border-lime-200">
                    Chapita #1
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-900 font-bold py-2 px-3 text-center border border-yellow-200">
                    Pandito feliz
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-900 font-bold py-2 px-3 text-center border border-blue-200">
                    EcoHéroe
                  </Badge>
                  <Badge variant="outline" className="py-2 px-3 text-center text-gray-400 border-dashed border-gray-300 col-span-3">
                    + Nuevo logro próximo
                  </Badge>
                </div>
                <Button 
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-colors"
                  aria-label="Ver colección completa"
                >
                  Ver mi colección
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'leaderboard':
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
                      className={`flex justify-between items-center p-3 rounded-md ${
                        user.position === 1 ? "bg-blue-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className={`font-bold text-lg ${
                        user.position === 1 ? "text-blue-600" : "text-gray-500"
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

      case 'profile':
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

      {/* Barra de navegación inferior mejorada */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
        <nav className="max-w-lg mx-auto flex justify-around items-center p-2">
          {[
            { id: 'home', icon: Home, label: 'Inicio' },
            { id: 'missions', icon: TreePine, label: 'Misiones' },
            { id: 'leaderboard', icon: Trophy, label: 'Ranking' },
            { id: 'profile', icon: User, label: 'Perfil' },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 text-sm font-medium transition-colors ${
                activeTab === tab.id
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
    </div>
  );
}