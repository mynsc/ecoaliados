import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import mockMissions from '../missions.data';
import type { Mission } from '../missions.types';
import { reportItems, sortMissionsByPriority } from '../missions.utils';

const STORAGE_KEY = 'ecoaliados.missions.v1';

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

export function useMissions() {
    const [missions, setMissions] = useState<Mission[]>(() => loadMissionsFromStorage() ?? mockMissions);
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
    const [inputCount, setInputCount] = useState<number>(1);
    const [note, setNote] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

    useEffect(() => {
        saveMissionsToStorage(missions);
    }, [missions]);

    const openReport = (id: string) => {
        setError(null);
        setInputCount(1);
        setNote('');
        setSelectedMissionId(id);
    };

    const closeModal = () => setSelectedMissionId(null);

    const submitReport = () => {
        if (!selectedMissionId) return;

        const { result, missions: updatedMissions } = reportItems(
            missions,
            selectedMissionId,
            inputCount,
            note,
            new Date()
        );

        if (!result.success) {
            setError(result.message);
            toast.error('Error al reportar', {
                description: result.message,
            });
            return;
        }

        setMissions(updatedMissions);
        const mission = updatedMissions.find(m => m.id === selectedMissionId);

        // Animar si se completó la misión
        if (result.completed) {
            setJustCompleted(prev => new Set(prev).add(selectedMissionId));
            setTimeout(() => {
                setJustCompleted(prev => {
                    const next = new Set(prev);
                    next.delete(selectedMissionId);
                    return next;
                });
            }, 2000);
        }

        toast.success(result.message, {
            description: result.completed
                ? '🎉 ¡Felicitaciones por completar la misión!'
                : `+${result.added} ${mission?.metadata?.unit ?? 'items'} agregados`,
            duration: result.completed ? 5000 : 3000,
        });
        closeModal();
    };

    const sortedMissions = sortMissionsByPriority(missions);
    const mainMission = sortedMissions[0];
    const selectedMission = missions.find(m => m.id === selectedMissionId);

    return {
        missions,
        setMissions,
        sortedMissions,
        mainMission,
        selectedMission,
        selectedMissionId,
        inputCount,
        setInputCount,
        note,
        setNote,
        error,
        justCompleted,
        openReport,
        closeModal,
        submitReport,
    };
}
