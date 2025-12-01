import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui';
import { getTodaySum } from '../missions.utils';
import type { Mission } from '../missions.types';

interface MissionReportModalProps {
    mission: Mission;
    inputCount: number;
    setInputCount: (count: number) => void;
    note: string;
    setNote: (note: string) => void;
    error: string | null;
    onClose: () => void;
    onSubmit: () => void;
}

export function MissionReportModal({
    mission,
    inputCount,
    setInputCount,
    note,
    setNote,
    error,
    onClose,
    onSubmit,
}: MissionReportModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const todaySum = getTodaySum(mission);
    const remaining = Math.max(0, (mission.targetCount ?? 0) - (mission.currentCount ?? 0));
    const dailyLimit = mission.metadata?.dailyLimit ?? Infinity;
    const dailyRemaining = dailyLimit === Infinity ? Infinity : Math.max(0, dailyLimit - todaySum);
    const maxAllowed = Math.min(remaining, dailyRemaining);
    const isValid = inputCount > 0 && inputCount <= maxAllowed;

    // Auto-focus en el input de cantidad al abrir el modal
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Manejar teclas ESC y Enter
    useEffect(() => {
        const handleSubmit = async () => {
            if (!isValid || isSubmitting) return;
            
            setIsSubmitting(true);
            try {
                await onSubmit();
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Enter' && isValid && !isSubmitting) {
                handleSubmit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, isValid, isSubmitting, onSubmit]);

    const handleSubmit = async () => {
        if (!isValid || isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            await onSubmit();
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determinar qué restricción es la activa
    const restrictionLabel = dailyRemaining < remaining 
        ? `Límite diario: ${maxAllowed}`
        : `Restante: ${maxAllowed}`;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 max-h-[90vh] overflow-y-auto z-10">
                <h3 className="text-lg font-bold mb-2">{mission.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{mission.description}</p>

                <div className="space-y-2">
                    <label className="block text-sm">Cantidad ({restrictionLabel})</label>
                    <input
                        ref={inputRef}
                        type="number"
                        min={1}
                        max={maxAllowed}
                        value={inputCount}
                        onChange={(e) => setInputCount(Number(e.target.value))}
                        className="w-full border rounded px-2 py-1"
                    />
                    <label className="block text-sm">Nota (opcional)</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                    <div className="text-xs text-gray-500">
                        Límite diario: {mission.metadata?.dailyLimit ?? 'sin límite'} — ya reportado hoy: {todaySum}
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={!isValid || isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Confirmar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
