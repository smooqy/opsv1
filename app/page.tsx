"use client";
import { useAppStore } from '@/lib/store';
import { generateInsights, calculateMonthlyMetrics } from '@/lib/dashboardAnalytics';
import { InsightCard } from '@/components/InsightCard';
import { MetricCard } from '@/components/MetricCard';
import { useMemo } from 'react';

export default function Dashboard() {
    const { clients, tasks, transactions } = useAppStore();

    // Generate insights
    const insights = useMemo(() => {
        return generateInsights({ clients, tasks, transactions });
    }, [clients, tasks, transactions]);

    // Calculate metrics
    const metrics = useMemo(() => {
        return calculateMonthlyMetrics({ clients, tasks, transactions });
    }, [clients, tasks, transactions]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Dashboard</h1>
                <p className="text-slate-500 mt-2">Visão completa do financeiro da agência</p>
            </div>

            {/* Insights Section */}
            {insights.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        💡 Insights do Dia
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        {insights.map(insight => (
                            <InsightCard key={insight.id} insight={insight} />
                        ))}
                    </div>
                </div>
            )}

            {/* Metrics Grid */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Métricas Principais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                        title="Receita"
                        value={`R$ ${metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        change={metrics.revenueChange}
                        icon="💰"
                    />
                    <MetricCard
                        title="Despesas"
                        value={`R$ ${metrics.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        change={metrics.expensesChange}
                        icon="💸"
                    />
                    <MetricCard
                        title="Lucro"
                        value={`R$ ${metrics.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        change={metrics.profitChange}
                        icon="📈"
                    />
                    <MetricCard
                        title="Clientes Ativos"
                        value={metrics.activeClients}
                        icon="👥"
                    />
                </div>
            </div>

            {/* Tasks Overview */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    ✅ Tasks em Andamento
                    <span className="text-sm font-normal text-slate-500">({metrics.pendingTasks})</span>
                </h2>

                {metrics.pendingTasks === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p className="text-sm">Nenhuma task pendente</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {tasks
                            .filter(t => t.stage !== 'done')
                            .slice(0, 5)
                            .map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                                >
                                    <div>
                                        <p className="font-medium text-white text-sm">{task.title}</p>
                                        <p className="text-xs text-slate-500">{task.client_name || 'Sem cliente'}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-violet-500/10 text-violet-400 rounded">
                                        {task.stage}
                                    </span>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Total de Clientes</p>
                    <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Total de Tasks</p>
                    <p className="text-2xl font-bold text-white">{tasks.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-sm text-slate-500 mb-1">Transações este Mês</p>
                    <p className="text-2xl font-bold text-white">
                        {transactions.filter(t => {
                            const date = new Date(t.date);
                            const now = new Date();
                            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length}
                    </p>
                </div>
            </div>
        </div>
    );
}
