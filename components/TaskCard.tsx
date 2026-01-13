"use client";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, User, Building2, Trash2, GripVertical } from 'lucide-react';

interface TaskCardProps {
    task: {
        id: number;
        title: string;
        assignedTo: string;
        client?: string;
        priority: 'baixa' | 'media' | 'alta';
        time?: string;
        status: 'todo' | 'doing' | 'done';
    };
    onDelete: (id: number) => void;
}

const priorityColors = {
    alta: 'border-l-red-500',
    media: 'border-l-yellow-500',
    baixa: 'border-l-blue-500'
};

const priorityDots = {
    alta: 'bg-red-500',
    media: 'bg-yellow-500',
    baixa: 'bg-blue-500'
};

export default function TaskCard({ task, onDelete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-slate-900 border border-slate-800 ${priorityColors[task.priority]} border-l-4 rounded-lg p-4 mb-3 hover:border-slate-700 transition-all group cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-2xl shadow-violet-900/50 scale-105' : ''
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing mt-1"
                >
                    <GripVertical className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-slate-100 mb-2 line-clamp-2">
                        {task.title}
                    </h3>

                    {/* Meta Info */}
                    <div className="space-y-1.5">
                        {/* Assigned To */}
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <User className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{task.assignedTo}</span>
                        </div>

                        {/* Client */}
                        {task.client && (
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{task.client}</span>
                            </div>
                        )}
                    </div>

                    {/* Priority Indicator */}
                    <div className="flex items-center gap-2 mt-3">
                        <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`}></div>
                        <span className="text-xs text-slate-500 capitalize">{task.priority} prioridade</span>
                    </div>
                </div>

                {/* Delete Button */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
