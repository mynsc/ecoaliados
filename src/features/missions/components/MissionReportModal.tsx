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
    const todaySum = getTodaySum(mission);
    const remaining = Math.max(0, (mission.targetCount ?? 0) - (mission.currentCount ?? 0));

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4 z-10">
                <h3 className="text-lg font-bold mb-2">{mission.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{mission.description}</p>

                <div className="space-y-2">
                    <label className="block text-sm">Cantidad (máx {remaining})</label>
                    <input
                        type="number"
                        min={1}
                        max={remaining}
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
                    <Button onClick={onSubmit} disabled={inputCount <= 0 || inputCount > remaining}>
                        Confirmar
                    </Button>
                </div>
            </div>
        </div>
    );
}
