"use client";
import { useState, useEffect } from 'react';
import { X, Briefcase } from 'lucide-react';
import { Task, TaskType, ProductionStage } from '@/lib/types';
import { useAppStore } from '@/lib/store';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null; // For editing
}

const taskTypes: { value: TaskType; label: string }[] = [
    { value: 'Arte', label: 'Arte' },
    { value: 'Tráfego', label: 'Tráfego' },
    { value: 'Web', label: 'Web' }
];

const stages: { value: ProductionStage; label: string }[] = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'copy', label: 'Copywriting' },
    { value: 'design', label: 'Design' },
    { value: 'approval', label: 'Aprovação' },
    { value: 'done', label: 'Concluído' }
];

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
    const { addTask, updateTask, clients } = useAppStore();
    const isEditing = !!task;

    const [formData, setFormData] = useState<Partial<Task>>({
        title: '',
        description: '',
        type: 'Arte',
        stage: 'backlog',
        client_id: 0,
        due_date: ''
    });

    useEffect(() => {
        if (task) {
            setFormData(task);
        } else {
            setFormData({
                title: '',
                description: '',
                type: 'Arte',
                stage: 'backlog',
                client_id: clients[0]?.id || 0,
                due_date: ''
            });
        }
    }, [task, isOpen, clients]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.client_id) {
            alert('Selecione um cliente');
            return;
        }

        if (isEditing && task) {
            await updateTask(task.id, formData);
        } else {
            await addTask(formData as Omit<Task, 'id' | 'created_at' | 'updated_at'>);
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
                            <Briefcase className="w-5 h-5 text-violet-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-100">
                            {isEditing ? 'Editar Task' : 'Nova Task'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Título *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                            placeholder="Ex: Carrossel de 5 dicas de skincare"
                            required
                        />
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Descrição</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 h-24"
                            placeholder="Detalhes sobre a task..."
                        />
                    </div>

                    {/* Tipo e Stage */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Tipo *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as TaskType })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                                required
                            >
                                {taskTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Stage *</label>
                            <select
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value as ProductionStage })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                                required
                            >
                                {stages.map(stage => (
                                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Cliente e Data de Entrega */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Cliente *</label>
                            <select
                                value={formData.client_id}
                                onChange={(e) => setFormData({ ...formData, client_id: parseInt(e.target.value) })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                                required
                            >
                                <option value="">Selecione...</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.company_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">📅 Data de Entrega</label>
                            <input
                                type="date"
                                value={formData.due_date || ''}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 cursor-pointer hover:border-slate-600 transition-colors"
                            />
                        </div>
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
                            {isEditing ? 'Salvar Alterações' : 'Criar Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
