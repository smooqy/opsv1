"use client";
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ProductionStage, Task } from '@/lib/types';
import { Plus, Pencil, Trash2, Calendar } from 'lucide-react';
import TaskModal from '@/components/TaskModal';

const columns: { id: ProductionStage; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: 'border-slate-500/20' },
    { id: 'copy', label: 'Copywriting', color: 'border-pink-500/20' },
    { id: 'design', label: 'Design', color: 'border-purple-500/20' },
    { id: 'approval', label: 'Aprovação', color: 'border-yellow-500/20' },
    { id: 'done', label: 'Concluído', color: 'border-emerald-500/20' },
];

export default function Production() {
    const { tasks, tasksLoading, updateTaskStage, deleteTask } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteTask(id);
    };

    const handleAddNew = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Workflow de Produção</h1>
                    <p className="text-slate-500 text-sm">Acompanhe as tarefas em execução.</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition-all active:scale-95 shadow-lg shadow-violet-900/20"
                >
                    <Plus size={18} />
                    Nova Task
                </button>
            </div>

            {tasksLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-slate-500">Carregando tasks...</div>
                </div>
            ) : (
                <div className="flex gap-4 overflow-x-auto flex-1 pb-4">
                    {columns.map(col => (
                        <div key={col.id} className="flex-shrink-0 w-72">
                            <div className={`bg-slate-900/20 border ${col.color} rounded-lg p-4 h-full flex flex-col`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full ${getStatusColor(col.id)}`}></span>
                                        {col.label}
                                    </h3>
                                    <span className="text-sm text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded-full">
                                        {tasks.filter(t => t.stage === col.id).length}
                                    </span>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto">
                                    {tasks.filter(t => t.stage === col.id).length === 0 ? (
                                        <div className="text-center text-slate-600 text-sm py-8 italic">
                                            Nenhuma task
                                        </div>
                                    ) : (
                                        tasks.filter(t => t.stage === col.id).map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                updateStage={updateTaskStage}
                                                onEdit={() => handleEdit(task)}
                                                onDelete={() => handleDelete(task.id)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                task={selectedTask}
            />
        </div>
    );
}

// TaskCard Component
function TaskCard({
    task,
    updateStage,
    onEdit,
    onDelete
}: {
    task: Task,
    updateStage: (id: string, stage: ProductionStage) => Promise<void>,
    onEdit: () => void,
    onDelete: () => void
}) {
    const isDueSoon = task.due_date ? new Date(task.due_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : false;

    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-sm hover:border-slate-700 hover:shadow-lg transition-all group relative">
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getTypeColor(task.type)}`}>
                    {task.type}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={onEdit}
                        className="p-1 text-slate-500 hover:text-violet-400 transition-colors"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <h3 className="font-semibold text-slate-200 mb-1 text-sm leading-tight">{task.title}</h3>

            {task.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
            )}

            <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <span>{task.client_name}</span>
            </p>

            {task.due_date && (
                <div className={`flex items-center gap-1 text-xs mb-3 ${isDueSoon ? 'text-orange-400' : 'text-slate-500'}`}>
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                </div>
            )}

            <div className="pt-3 border-t border-slate-800/50 mt-2">
                <select
                    value={task.stage}
                    onChange={(e) => updateStage(task.id, e.target.value as ProductionStage)}
                    className="w-full bg-slate-950 text-xs text-slate-400 border border-slate-800 rounded px-2 py-2 focus:border-violet-500 focus:outline-none cursor-pointer hover:bg-slate-900 transition-colors"
                >
                    {columns.map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

function getStatusColor(id: string) {
    if (id === 'backlog') return 'bg-slate-500';
    if (id === 'copy') return 'bg-pink-500';
    if (id === 'design') return 'bg-purple-500';
    if (id === 'approval') return 'bg-yellow-500';
    if (id === 'done') return 'bg-emerald-500';
    return 'bg-slate-500';
}

function getTypeColor(type: string) {
    if (type === 'Arte') return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (type === 'Tráfego') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (type === 'Web') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    return 'bg-slate-500/10 text-slate-400';
}
