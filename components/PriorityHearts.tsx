import { Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface PriorityHeartsProps {
    priority: number; // 1-5
    onChange?: (newPriority: number) => void;
    readOnly?: boolean;
}

export function PriorityHearts({ priority = 0, onChange, readOnly = false }: PriorityHeartsProps) {
    const hearts = [1, 2, 3, 4, 5];

    return (
        <div className="flex items-center gap-0.5">
            {hearts.map((heartValue) => {
                const isFilled = heartValue <= priority;

                return (
                    <button
                        key={heartValue}
                        onClick={() => !readOnly && onChange?.(heartValue)}
                        disabled={readOnly}
                        className={clsx(
                            "transition-all",
                            !readOnly && "hover:scale-110 cursor-pointer",
                            readOnly && "cursor-default"
                        )}
                        title={`Prioridade ${heartValue}`}
                    >
                        <Heart
                            className={clsx(
                                "w-4 h-4 transition-colors",
                                isFilled ? "fill-red-500 text-red-500" : "text-slate-700"
                            )}
                        />
                    </button>
                );
            })}
            {priority >= 4 && (
                <span className="ml-1 text-xs font-bold text-red-500">VIP</span>
            )}
        </div>
    );
}
