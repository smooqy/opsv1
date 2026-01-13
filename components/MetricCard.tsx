import { clsx } from 'clsx';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: string;
    color?: string;
}

export function MetricCard({ title, value, change, icon, color = 'violet' }: MetricCardProps) {
    const hasChange = change !== undefined && !isNaN(change);
    const isPositive = hasChange && change > 0;
    const isNegative = hasChange && change < 0;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{icon}</span>
                {hasChange && (
                    <span className={clsx(
                        'text-sm font-medium px-2 py-1 rounded-lg',
                        isPositive && 'text-green-400 bg-green-500/10',
                        isNegative && 'text-red-400 bg-red-500/10',
                        !isPositive && !isNegative && 'text-slate-500 bg-slate-800'
                    )}>
                        {isPositive && '↑'}{isNegative && '↓'} {Math.abs(change).toFixed(1)}%
                    </span>
                )}
            </div>

            <h3 className="text-sm text-slate-500 mb-1">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>

            {hasChange && (
                <p className="text-xs text-slate-600 mt-2">vs mês anterior</p>
            )}
        </div>
    );
}
