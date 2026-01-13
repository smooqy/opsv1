"use client";
import { usePathname } from 'next/navigation';
import { useAppStore } from './store';
import { useMemo } from 'react';

export type PageType = 'dashboard' | 'clients' | 'routine' | 'production' | 'financial' | 'strategy' | 'tools';

export interface PageContext {
    page: PageType;
    title: string;
    icon: string;
    data: any;
    suggestions: string[];
    quickActions: QuickAction[];
}

export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    prompt: string;
}

export function usePageContext(): PageContext {
    const pathname = usePathname();
    const { clients, tasks, transactions } = useAppStore();

    return useMemo(() => {
        // Dashboard
        if (pathname === '/') {
            const activeClients = clients.filter(c => c.status === 'ativo').length;
            const revenue = transactions
                .filter(t => t.type === 'receita')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                page: 'dashboard',
                title: 'Dashboard',
                icon: '📊',
                data: {
                    activeClients,
                    revenue,
                    totalClients: clients.length,
                    totalTasks: tasks.length
                },
                suggestions: [
                    activeClients < 5 ? '⚠️ Poucos clientes ativos. Considere prospecção.' : '',
                    revenue < 10000 ? '💰 Receita baixa este mês. Foque em vendas!' : ''
                ].filter(Boolean),
                quickActions: [
                    { id: 'analyze', label: 'Analisar Performance', icon: '🎯', prompt: 'Analise o desempenho geral da agência e sugira melhorias' },
                    { id: 'report', label: 'Gerar Relatório', icon: '📊', prompt: 'Gere um relatório executivo do mês atual' },
                    { id: 'suggestions', label: 'Sugestões', icon: '💡', prompt: 'Dê 5 sugestões acionáveis para melhorar resultados' }
                ]
            };
        }

        // Clients
        if (pathname === '/clients') {
            const inactiveClients = clients.filter(c => c.status === 'inativo').length;

            return {
                page: 'clients',
                title: 'Clientes',
                icon: '👥',
                data: {
                    totalClients: clients.length,
                    inactiveClients,
                    clients: clients.slice(0, 5) // Top 5 para contexto
                },
                suggestions: [
                    inactiveClients > 0 ? `💼 ${inactiveClients} clientes inativos. Reativar?` : ''
                ].filter(Boolean),
                quickActions: [
                    { id: 'contact', label: 'Quem Contactar Hoje', icon: '📞', prompt: 'Liste os 3 clientes que devo contactar hoje baseado em quando foi o último contato' },
                    { id: 'upsell', label: 'Oportunidades Upsell', icon: '💰', prompt: 'Analise quais clientes têm maior potencial de upsell e novos serviços' },
                    { id: 'risk', label: 'Clientes em Risco', icon: '⚠️', prompt: 'Identifique clientes em risco de churn e sugira ações' }
                ]
            };
        }

        // Routine
        if (pathname === '/routine') {
            return {
                page: 'routine',
                title: 'Rotina',
                icon: '✅',
                data: {
                    tasks: tasks.length
                },
                suggestions: [],
                quickActions: [
                    { id: 'prioritize', label: 'Priorizar Tasks', icon: '🎯', prompt: 'Me ajude a priorizar minhas tarefas de hoje' },
                    { id: 'next', label: 'Próximas Ações', icon: '⏰', prompt: 'Quais as 3 próximas ações mais importantes que devo fazer?' },
                    { id: 'optimize', label: 'Otimizar Agenda', icon: '📅', prompt: 'Como otimizar minha agenda para ser mais produtivo hoje?' }
                ]
            };
        }

        // Production
        if (pathname === '/production') {
            const activeTasks = tasks.filter(t => t.stage !== 'done');

            return {
                page: 'production',
                title: 'Produção',
                icon: '🎨',
                data: {
                    tasks: activeTasks,
                    totalTasks: tasks.length
                },
                suggestions: [
                    activeTasks.length > 10 ? '🚨 Muitos projetos em andamento. Priorize!' : ''
                ].filter(Boolean),
                quickActions: [
                    { id: 'creative', label: 'Ideias Criativas', icon: '🎨', prompt: 'Gere 5 ideias criativas para conteúdo de redes sociais' },
                    { id: 'briefing', label: 'Gerar Briefing', icon: '📝', prompt: 'Crie um template de briefing criativo completo' },
                    { id: 'copy', label: 'Escrever Copy', icon: '✍️', prompt: 'Escreva uma copy persuasiva para um anúncio de produto' }
                ]
            };
        }

        // Financial
        if (pathname === '/financial') {
            const revenue = transactions
                .filter(t => t.type === 'receita')
                .reduce((sum, t) => sum + t.amount, 0);
            const expenses = transactions
                .filter(t => t.type === 'despesa')
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                page: 'financial',
                title: 'Financeiro',
                icon: '💰',
                data: {
                    revenue,
                    expenses,
                    profit: revenue - expenses,
                    transactions: transactions.length
                },
                suggestions: [
                    expenses > revenue ? '⚠️ Despesas maiores que receita! Atenção!' : ''
                ].filter(Boolean),
                quickActions: [
                    { id: 'reduce', label: 'Reduzir Custos', icon: '💰', prompt: 'Analise minhas despesas e sugira onde posso reduzir custos' },
                    { id: 'forecast', label: 'Previsão de Receita', icon: '📈', prompt: 'Preveja a receita dos próximos 3 meses baseado no histórico' },
                    { id: 'analyze', label: 'Análise Completa', icon: '📊', prompt: 'Faça uma análise financeira completa e sugira melhorias' }
                ]
            };
        }

        // Strategy (já tem chat próprio)
        if (pathname === '/strategy') {
            return {
                page: 'strategy',
                title: 'Estratégia IA',
                icon: '🤖',
                data: {},
                suggestions: ['📌 Esta página tem chat IA dedicado'],
                quickActions: []
            };
        }

        // Default
        return {
            page: 'dashboard',
            title: 'OPS Operation',
            icon: '🏢',
            data: {},
            suggestions: [],
            quickActions: []
        };
    }, [pathname, clients, tasks, transactions]);
}
