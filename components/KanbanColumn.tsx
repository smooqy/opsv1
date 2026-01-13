"use client";
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
    id: string;
    title: string;
    tasks: any[];
    onDelete: (id: number) => void;
    onAddClick: () => void;
    color: string;
}

export default function KanbanColumn({ id, title, tasks, onDelete, onAddClick, color }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div className="flex-shrink-0 w-[85vw] sm:w-80 md:flex-1 md:min-w-[320px]">
            {/* Column Header */}
            <div className={`flex items-center justify-between mb-4 pb-3 border-b-2 ${color}`}>
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100">{title}</h2>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={onAddClick}
                    className="text-slate-500 hover:text-violet-400 hover:bg-slate-900 p-1.5 rounded-lg transition-colors"
                    title="Adicionar tarefa"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Drop Zone */}
            <div
                ref={setNodeRef}
                className={`min-h-[calc(100vh-300px)] rounded-xl p-3 transition-colors ${isOver
                    ? 'bg-violet-900/20 border-2 border-dashed border-violet-500'
                    : 'bg-slate-900/20 border-2 border-transparent'
                    }`}
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length === 0 ? (
                        <div className="text-center py-12 text-slate-600 text-sm">
                            <div className="text-3xl mb-2">📋</div>
                            Nenhuma tarefa
                        </div>
                    ) : (
                        tasks.map(task => (
                            <TaskCard key={task.id} task={task} onDelete={onDelete} />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
