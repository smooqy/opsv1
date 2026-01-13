import { clsx } from 'clsx';

interface ClientPriorityProps {
    priority: 'low' | 'medium' | 'high' | null;
    onChange?: (newPriority: 'low' | 'medium' | 'high') => void;
    readOnly?: boolean;
}

const priorities = [
    { value: 'low' as const, label: 'Baixa', color: 'bg-blue-500/20 text-blue-400 border-blue-500/50' },
    { value: 'medium' as const, label: 'Média', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
    { value: 'high' as const, label: 'Alta', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
];

export function ClientPriority({ priority, onChange, readOnly = false }: ClientPriorityProps) {
    return (
        <div className="flex gap-2">
            {priorities.map((p) => {
                const isSelected = priority === p.value;

                return (
                    <button
                        key={p.value}
                        onClick={() => !readOnly && onChange?.(p.value)}
                        disabled={readOnly}
                        className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                            isSelected
                                ? p.color
                                : "bg-slate-800/50 text-slate-500 border-slate-700 hover:border-slate-600",
                            !readOnly && "cursor-pointer hover:scale-105",
                            readOnly && "cursor-default opacity-60"
                        )}
                        title={`Prioridade ${p.label}`}
                    >
                        {p.label}
                    </button>
                );
            })}
        </div>
    );
}
