"use client";
import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TransactionModal from '@/components/TransactionModal';
import { Transaction } from '@/lib/types';

export default function Financial() {
    const { transactions, transactionsLoading, deleteTransaction, clients } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [filterPeriod, setFilterPeriod] = useState<'month' | 'year' | 'all'>('month');

    // Calculate metrics from real transactions
    const { totalRevenue, totalExpenses, recentTransactions, chartData, revenueByMonth } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let filtered = transactions;

        if (filterPeriod === 'month') {
            filtered = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
            });
        } else if (filterPeriod === 'year') {
            filtered = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getFullYear() === currentYear;
            });
        }

        const revenue = filtered
            .filter(t => t.type === 'receita')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = filtered
            .filter(t => t.type === 'despesa')
            .reduce((sum, t) => sum + t.amount, 0);

        // Last 6 months data for charts
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const monthlyData: Record<string, { revenue: number; expenses: number }> = {};

        transactions.forEach(t => {
            const date = new Date(t.date);
            if (date >= sixMonthsAgo) {
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { revenue: 0, expenses: 0 };
                }
                if (t.type === 'receita') {
                    monthlyData[monthKey].revenue += t.amount;
                } else {
                    monthlyData[monthKey].expenses += t.amount;
                }
            }
        });

        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const chartData = Object.keys(monthlyData)
            .sort()
            .slice(-6)
            .map(key => {
                const [year, month] = key.split('-');
                return {
                    month: monthNames[parseInt(month) - 1],
                    receita: monthlyData[key].revenue,
                    despesa: monthlyData[key].expenses
                };
            });

        return {
            totalRevenue: revenue,
            totalExpenses: expenses,
            recentTransactions: transactions.slice(0, 10),
            chartData,
            revenueByMonth: revenue
        };
    }, [transactions, filterPeriod]);

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta transação?')) {
            await deleteTransaction(id);
        }
    };

    const handleAddNew = () => {
        setSelectedTransaction(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const activeClients = clients.filter(c => c.status === 'ACTIVE').length;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-2">Financial Dashboard</h1>
                    <p className="text-slate-400">Visão completa do financeiro da agência</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-violet-900/20"
                >
                    <Plus className="w-4 h-4" />
                    Nova Transação
                </button>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilterPeriod('month')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterPeriod === 'month'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    Este Mês
                </button>
                <button
                    onClick={() => setFilterPeriod('year')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterPeriod === 'year'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    Este Ano
                </button>
                <button
                    onClick={() => setFilterPeriod('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterPeriod === 'all'
                        ? 'bg-violet-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                >
                    Tudo
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <StatCard
                    icon={<DollarSign />}
                    label="Receita Total"
                    value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    change="+12%"
                    positive
                />
                <StatCard
                    icon={<TrendingDown />}
                    label="Despesas Total"
                    value={`R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    change="-5%"
                    positive={false}
                />
                <StatCard
                    icon={<TrendingUp />}
                    label="Lucro"
                    value={`R$ ${(totalRevenue - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    change="+8%"
                    positive
                />
                <StatCard
                    icon={<Calendar />}
                    label="Clientes Ativos"
                    value={activeClients}
                    change="+3"
                    positive
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-50 mb-4">Receita (Últimos 6 Meses)</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                    labelStyle={{ color: '#cbd5e1' }}
                                />
                                <Line type="monotone" dataKey="receita" stroke="#8b5cf6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-500">
                            Sem dados para exibir
                        </div>
                    )}
                </div>

                {/* Expenses Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-50 mb-4">Receita vs Despesas</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                    labelStyle={{ color: '#cbd5e1' }}
                                />
                                <Bar dataKey="receita" fill="#10b981" />
                                <Bar dataKey="despesa" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-slate-500">
                            Sem dados para exibir
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Transações Recentes</h3>
                {transactionsLoading ? (
                    <div className="py-8 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                        <p className="text-slate-400 mt-4">Carregando transações...</p>
                    </div>
                ) : recentTransactions.length === 0 ? (
                    <div className="text-center py-12">
                        <DollarSign className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400">Nenhuma transação encontrada.</p>
                        <p className="text-slate-500 text-sm mt-2">Clique em "Nova Transação" para adicionar.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-slate-800">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Data</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Descrição</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Valor</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {recentTransactions.map(transaction => (
                                    <tr key={transaction.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-slate-400">
                                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-200">{transaction.description}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-full">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-400">
                                            {transaction.client_name || '-'}
                                        </td>
                                        <td className={`py-3 px-4 text-sm font-semibold text-right ${transaction.type === 'receita' ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {transaction.type === 'receita' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="p-1.5 text-slate-400 hover:text-violet-400 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(transaction.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                transaction={selectedTransaction}
            />
        </div>
    );
}

function StatCard({ icon, label, value, change, positive }: any) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-violet-500/50 transition-colors">
            <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                    {icon}
                </div>
                <span className="text-sm text-slate-400">{label}</span>
            </div>
            <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-slate-50">{value}</div>
                <div className={`text-sm font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
                    {change}
                </div>
            </div>
        </div>
    );
}
