"use client";
import { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { Transaction, TransactionType, TransactionCategory } from '@/lib/types';
import { useAppStore } from '@/lib/store';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction?: Transaction | null; // For editing
}

const categories: { value: TransactionCategory; label: string }[] = [
    { value: 'servico', label: 'Serviço' },
    { value: 'mensalidade', label: 'Mensalidade' },
    { value: 'despesa_operacional', label: 'Despesa Operacional' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'investimento', label: 'Investimento' },
    { value: 'outro', label: 'Outro' }
];

export default function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
    const { addTransaction, updateTransaction, clients } = useAppStore();
    const isEditing = !!transaction;

    const [formData, setFormData] = useState<Partial<Transaction>>({
        type: 'receita',
        category: 'servico',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
        client_id: undefined
    });

    useEffect(() => {
        if (transaction) {
            setFormData(transaction);
        } else {
            setFormData({
                type: 'receita',
                category: 'servico',
                amount: 0,
                description: '',
                date: new Date().toISOString().split('T')[0],
                client_id: undefined
            });
        }
    }, [transaction, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate amount
        if (!formData.amount || formData.amount <= 0 || isNaN(formData.amount)) {
            alert('Por favor, insira um valor válido maior que zero.');
            return;
        }

        if (isEditing && transaction) {
            await updateTransaction(transaction.id, formData);
        } else {
            await addTransaction(formData as Omit<Transaction, 'id' | 'created_at' | 'updated_at'>);
        }

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="border-b border-slate-800 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/10 rounded-lg">
                            <DollarSign className="w-5 h-5 text-violet-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-100">
                            {isEditing ? 'Editar Transação' : 'Nova Transação'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Tipo *</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'receita' })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.type === 'receita'
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className="font-semibold">💰 Receita</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'despesa' })}
                                className={`p-3 rounded-lg border-2 transition-all ${formData.type === 'despesa'
                                    ? 'border-red-500 bg-red-500/10 text-red-400'
                                    : 'border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className="font-semibold">💸 Despesa</div>
                            </button>
                        </div>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Categoria *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 transition-colors"
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Valor e Data */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Valor (R$) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount || ''}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                    setFormData({ ...formData, amount: isNaN(value) ? 0 : value });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Data *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Cliente (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Cliente (opcional)</label>
                        <select
                            value={formData.client_id || ''}
                            onChange={(e) => setFormData({ ...formData, client_id: e.target.value ? parseInt(e.target.value) : undefined })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                        >
                            <option value="">Sem cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.company_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Descrição *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 h-24"
                            placeholder="Descreva a transação..."
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-lg shadow-violet-900/20 transition-all active:scale-95"
                        >
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Transação'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
