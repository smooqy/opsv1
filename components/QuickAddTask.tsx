"use client";
import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth, COLLABORATORS } from '@/lib/auth';

interface QuickAddTaskProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (task: {
        title: string;
        assignedTo: string;
        client?: string;
        priority: 'baixa' | 'media' | 'alta';
        status: 'todo' | 'doing' | 'done';
    }) => void;
    defaultStatus: 'todo' | 'doing' | 'done';
    clients: any[];
}

export default function QuickAddTask({ isOpen, onClose, onAdd, defaultStatus, clients }: QuickAddTaskProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [assignedTo, setAssignedTo] = useState(user?.username || 'Luis');
    const [client, setClient] = useState('');
    const [priority, setPriority] = useState<'baixa' | 'media' | 'alta'>('media');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('Digite um título para a tarefa');
            return;
        }

        onAdd({
            title: title.trim(),
            assignedTo,
            client: client || undefined,
            priority,
            status: defaultStatus
        });

        // Reset form
        setTitle('');
        setClient('');
        setPriority('media');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Postar stories no Instagram"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-violet-500"
                            autoFocus
                        />
                    </div>

                    {/* Row: Assigned To & Client */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Responsável
                            </label>
                            <select
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                            >
                                {COLLABORATORS.map(collab => (
                                    <option key={collab.email} value={collab.username}>{collab.username}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                Cliente
                            </label>
                            <select
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                            >
                                <option value="">Nenhum</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.company_name}>
                                        {c.company_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            Prioridade
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setPriority('baixa')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${priority === 'baixa'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Baixa
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('media')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${priority === 'media'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Média
                            </button>
                            <button
                                type="button"
                                onClick={() => setPriority('alta')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${priority === 'alta'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Alta
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
