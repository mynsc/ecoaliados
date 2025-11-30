import { useState } from 'react';
import { toast } from 'sonner';
import { reportItems, sortMissionsByPriority } from '../missions.utils';
import { useMissionsContext } from '@/contexts';

export function useMissions() {
    // Obtener el estado de misiones del contexto global
    const { missions, setMissions } = useMissionsContext();
    
    // Estado local para la UI del modal y animaciones
    const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
    const [inputCount, setInputCount] = useState<number>(1);
    const [note, setNote] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [justCompleted, setJustCompleted] = useState<Set<string>>(new Set());

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
