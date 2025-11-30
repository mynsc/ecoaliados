import { createContext } from 'react';

// Tipo del perfil del usuario
export interface Profile {
    id: string;
    name: string;
    avatar: string;  // emoji o URL
    createdAt: string; // ISO string
}

// Tipo del contexto
export interface ProfileContextType {
    profile: Profile;
    updateProfile: (updates: Partial<Profile>) => void;
}

// Crear el contexto
export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);
