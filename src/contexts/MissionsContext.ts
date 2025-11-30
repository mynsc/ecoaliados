import { createContext } from 'react';
import type { Mission } from '@/features/missions/missions.types';

// Tipo del contexto
export interface MissionsContextType {
    missions: Mission[];
    setMissions: (missions: Mission[]) => void;
}

// Crear el contexto
export const MissionsContext = createContext<MissionsContextType | undefined>(undefined);
