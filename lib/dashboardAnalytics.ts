import { Client, Task, Transaction } from './types';

export interface DashboardData {
    clients: Client[];
    tasks: Task[];
    transactions: Transaction[];
}

export interface Insight {
    id: string;
    type: 'alert' | 'trend' | 'suggestion' | 'achievement';
    severity: 'info' | 'warning' | 'critical' | 'success';
    icon: string;
    title: string;
    description: string;
    metric?: number;
    change?: number;
    action?: {
        label: string;
        url: string;
    };
}

// Calculate percentage change between two numbers
export function calculateChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

// Analyze trend from array of numbers
export function analyzeTrend(data: number[]): 'up' | 'down' | 'neutral' {
    if (data.length < 2) return 'neutral';

    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, data.slice(-3).length);
    const older = data.slice(0, 3).reduce((a, b) => a + b, 0) / Math.min(3, data.slice(0, 3).length);

    if (recent > older * 1.1) return 'up';
    if (recent < older * 0.9) return 'down';
    return 'neutral';
}

// Calculate days since a date
function daysSince(date: Date | string): number {
    const now = new Date();
    const then = new Date(date);
    return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

// Generate insights from dashboard data
export function generateInsights(data: DashboardData): Insight[] {
    const insights: Insight[] = [];

    try {
        // Check inactive clients  
        const inactiveClients = data.clients.filter(c => {
            if (!c || c.status === 'inativo') return false;
            // Skip created_at check since it doesn't exist in Client type
            return false;
        });

        if (inactiveClients.length > 0) {
            insights.push({
                id: 'inactive-clients',
                type: 'alert',
                severity: inactiveClients.length >= 5 ? 'critical' : 'warning',
                icon: '📞',
                title: `${inactiveClients.length} cliente${inactiveClients.length > 1 ? 's' : ''} precisam atenção`,
                description: 'Clientes sem contato recente',
                metric: inactiveClients.length,
                action: { label: 'Contactar', url: '/clients' }
            });
        }

        // Analyze revenue
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const currentRevenue = data.transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'receita' &&
                    date.getMonth() === thisMonth &&
                    date.getFullYear() === thisYear;
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const previousRevenue = data.transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'receita' &&
                    date.getMonth() === lastMonth &&
                    date.getFullYear() === lastMonthYear;
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        const revenueChange = calculateChange(currentRevenue, previousRevenue);

        if (revenueChange > 10) {
            insights.push({
                id: 'revenue-growth',
                type: 'trend',
                severity: 'success',
                icon: '📈',
                title: 'Receita em alta!',
                description: `Crescimento de ${revenueChange.toFixed(0)}% vs mês anterior`,
                change: revenueChange
            });
        } else if (revenueChange < -10) {
            insights.push({
                id: 'revenue-decline',
                type: 'alert',
                severity: 'critical',
                icon: '📉',
                title: 'Receita em queda',
                description: `Redução de ${Math.abs(revenueChange).toFixed(0)}% vs mês anterior`,
                change: revenueChange,
                action: { label: 'Analisar', url: '/financial' }
            });
        }

        // Check expenses vs revenue
        const currentExpenses = data.transactions
            .filter(t => {
                const date = new Date(t.date);
                return t.type === 'despesa' &&
                    date.getMonth() === thisMonth &&
                    date.getFullYear() === thisYear;
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        if (currentExpenses > currentRevenue && currentRevenue > 0) {
            insights.push({
                id: 'expenses-high',
                type: 'alert',
                severity: 'warning',
                icon: '💸',
                title: 'Despesas maiores que receita',
                description: `Despesas: R$ ${currentExpenses.toFixed(0)} | Receita: R$ ${currentRevenue.toFixed(0)}`,
                action: { label: 'Revisar', url: '/financial' }
            });
        }

        // Check tasks
        const pendingTasks = data.tasks.filter(t =>
            t.stage !== 'done'
        ).length;

        if (pendingTasks > 10) {
            insights.push({
                id: 'many-tasks',
                type: 'suggestion',
                severity: 'info',
                icon: '✅',
                title: `${pendingTasks} tasks em andamento`,
                description: 'Considere priorizar as mais urgentes',
                metric: pendingTasks,
                action: { label: 'Priorizar', url: '/production' }
            });
        }

        // Achievement: New clients
        const newClientsThisMonth = 0; // Skip since created_at doesn't exist in Client type

        if (newClientsThisMonth >= 3) {
            insights.push({
                id: 'new-clients',
                type: 'achievement',
                severity: 'success',
                icon: '🎉',
                title: `${newClientsThisMonth} novos clientes!`,
                description: 'Ótimo trabalho de aquisição este mês',
                metric: newClientsThisMonth
            });
        }

    } catch (err) {
        console.error('Error generating insights:', err);
    }

    return insights.slice(0, 5); // Limit to 5 insights
}

// Calculate monthly metrics
export interface MonthlyMetrics {
    revenue: number;
    expenses: number;
    profit: number;
    activeClients: number;
    pendingTasks: number;
    revenueChange: number;
    expensesChange: number;
    profitChange: number;
}

export function calculateMonthlyMetrics(data: DashboardData): MonthlyMetrics {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const currentRevenue = data.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'receita' &&
                date.getMonth() === thisMonth &&
                date.getFullYear() === thisYear;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const previousRevenue = data.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'receita' &&
                date.getMonth() === lastMonth &&
                date.getFullYear() === lastMonthYear;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const currentExpenses = data.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'despesa' &&
                date.getMonth() === thisMonth &&
                date.getFullYear() === thisYear;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const previousExpenses = data.transactions
        .filter(t => {
            const date = new Date(t.date);
            return t.type === 'despesa' &&
                date.getMonth() === lastMonth &&
                date.getFullYear() === lastMonthYear;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    const profit = currentRevenue - currentExpenses;
    const previousProfit = previousRevenue - previousExpenses;

    return {
        revenue: currentRevenue,
        expenses: currentExpenses,
        profit,
        activeClients: data.clients.filter(c => c.status === 'ativo').length,
        pendingTasks: data.tasks.filter(t => t.stage !== 'done').length,
        revenueChange: calculateChange(currentRevenue, previousRevenue),
        expensesChange: calculateChange(currentExpenses, previousExpenses),
        profitChange: calculateChange(profit, previousProfit)
    };
}
