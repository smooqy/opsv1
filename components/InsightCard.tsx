import { Insight } from '@/lib/dashboardAnalytics';
import { clsx } from 'clsx';
import Link from 'next/link';

interface InsightCardProps {
    insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
    const severityStyles = {
        critical: 'border-red-500 bg-red-500/10',
        warning: 'border-orange-500 bg-orange-500/10',
        success: 'border-green-500 bg-green-500/10',
        info: 'border-blue-500 bg-blue-500/10'
    };

    return (
        <div className={clsx(
            'p-4 rounded-xl border-l-4 bg-slate-900/50',
            severityStyles[insight.severity]
        )}>
            <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{insight.icon}</span>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-white">{insight.title}</h4>
                        {insight.metric !== undefined && (
                            <span className="text-sm font-bold text-white shrink-0">
                                {insight.metric}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-slate-400 mb-2">{insight.description}</p>

                    {insight.change !== undefined && (
                        <span className={clsx(
                            'text-xs font-medium',
                            insight.change > 0 ? 'text-green-400' : 'text-red-400'
                        )}>
                            {insight.change > 0 ? '↑' : '↓'} {Math.abs(insight.change).toFixed(1)}%
                        </span>
                    )}

                    {insight.action && (
                        <Link
                            href={insight.action.url}
                            className="inline-block mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                        >
                            {insight.action.label} →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
