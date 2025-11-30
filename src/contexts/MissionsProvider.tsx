import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Mission } from '@/features/missions/missions.types';
import mockMissions from '@/features/missions/missions.data';
import { MissionsContext } from './MissionsContext';
import type { MissionsContextType } from './MissionsContext';

const STORAGE_KEY = 'ecoaliados.missions.v1';

// Funciones auxiliares para localStorage
function loadMissionsFromStorage(): Mission[] | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed?.v === 1 && Array.isArray(parsed.missions)) return parsed.missions;
        return null;
    } catch {
        return null;
    }
}

function saveMissionsToStorage(missions: Mission[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, missions }));
    } catch {
        // silent
    }
}

// Props del provider
interface MissionsProviderProps {
    children: ReactNode;
}

// Provider del contexto
export function MissionsProvider({ children }: MissionsProviderProps) {
    const [missions, setMissions] = useState<Mission[]>(() => 
        loadMissionsFromStorage() ?? mockMissions
    );

    // Guardar en localStorage cada vez que cambian las misiones
    useEffect(() => {
        saveMissionsToStorage(missions);
    }, [missions]);

    const value: MissionsContextType = {
        missions,
        setMissions,
    };

    return (
        <MissionsContext.Provider value={value}>
            {children}
        </MissionsContext.Provider>
    );
}
