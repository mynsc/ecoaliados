import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Profile } from './ProfileContext';
import { ProfileContext } from './ProfileContext';
import type { ProfileContextType } from './ProfileContext';

const STORAGE_KEY = 'ecoaliados.profile.v1';

// Funciones auxiliares para localStorage
function loadProfileFromStorage(): Profile | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed?.v === 1 && parsed.profile) return parsed.profile;
        return null;
    } catch {
        return null;
    }
}

function saveProfileToStorage(profile: Profile) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, profile }));
    } catch {
        // silent
    }
}

// Generar perfil por defecto si no existe
function generateDefaultProfile(): Profile {
    return {
        id: crypto.randomUUID(),
        name: 'EcoAliado',
        avatar: '🌿',
        createdAt: new Date().toISOString(),
    };
}

// Props del provider
interface ProfileProviderProps {
    children: ReactNode;
}

// Provider del contexto
export function ProfileProvider({ children }: ProfileProviderProps) {
    const [profile, setProfile] = useState<Profile>(() => 
        loadProfileFromStorage() ?? generateDefaultProfile()
    );

    // Guardar en localStorage cada vez que cambia el perfil
    useEffect(() => {
        saveProfileToStorage(profile);
    }, [profile]);

    // Función para actualizar parcialmente el perfil
    const updateProfile = (updates: Partial<Profile>) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const value: ProfileContextType = {
        profile,
        updateProfile,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}
