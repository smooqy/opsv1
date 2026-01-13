"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Filter, Calendar } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useAuth, COLLABORATORS } from "@/lib/auth";
import KanbanColumn from "@/components/KanbanColumn";
import TaskCard from "@/components/TaskCard";
import QuickAddTask from "@/components/QuickAddTask";

interface KanbanTask {
    id: number;
    title: string;
    assignedTo: string;
    client?: string;
    priority: 'baixa' | 'media' | 'alta';
    time?: string;
    status: 'todo' | 'doing' | 'done';
    date: string;
}

const STORAGE_KEY = 'ops_operation_kanban_tasks';

const columns = [
    { id: 'todo', title: 'A Fazer', color: 'border-slate-600' },
    { id: 'doing', title: 'Fazendo', color: 'border-orange-500' },
    { id: 'done', title: 'Concluído', color: 'border-emerald-500' }
];

export default function RoutinePage() {
    const { clients } = useAppStore();
    const { profile } = useAuth();
    const [tasks, setTasks] = useState<KanbanTask[]>([]);
    const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDefaultStatus, setModalDefaultStatus] = useState<'todo' | 'doing' | 'done'>('todo');
    const [filterUser, setFilterUser] = useState(profile?.username || 'Todos');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    function getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    // Load tasks from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setTasks(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (tasks.length > 0 || localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
    }, [tasks]);

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const matchesUser = filterUser === 'Todos' || task.assignedTo === filterUser;
        const matchesDate = task.date === selectedDate;
        return matchesUser && matchesDate;
    });

    // Get tasks by column
    const getTasksByStatus = (status: 'todo' | 'doing' | 'done') => {
        return filteredTasks.filter(task => task.status === status);
    };

    // Add task
    const handleAddTask = (taskData: Omit<KanbanTask, 'id' | 'date'>) => {
        const newTask: KanbanTask = {
            id: Date.now(),
            ...taskData,
            date: selectedDate
        };
        setTasks([...tasks, newTask]);
    };

    // Delete task
    const handleDeleteTask = (id: number) => {
        if (confirm('Deletar esta tarefa?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    // Open modal for specific column
    const handleAddClick = (status: 'todo' | 'doing' | 'done') => {
        setModalDefaultStatus(status);
        setIsModalOpen(true);
    };

    // Drag handlers
    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id);
        if (task) {
            setActiveTask(task);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as number;
        const overId = over.id;

        // Check if dropped over a column
        if (overId === 'todo' || overId === 'doing' || overId === 'done') {
            setTasks(tasks.map(task =>
                task.id === activeId
                    ? { ...task, status: overId as 'todo' | 'doing' | 'done' }
                    : task
            ));
        }
    };

    // Date navigation
    const changeDate = (days: number) => {
        const current = new Date(selectedDate);
        current.setDate(current.getDate() + days);
        setSelectedDate(current.toISOString().split('T')[0]);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date(getTodayDate() + 'T00:00:00');
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.getTime() === today.getTime()) return 'Hoje';
        if (date.getTime() === tomorrow.getTime()) return 'Amanhã';

        return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' });
    };

    // Stats
    const todoCount = getTasksByStatus('todo').length;
    const doingCount = getTasksByStatus('doing').length;
    const doneCount = getTasksByStatus('done').length;
    const totalCount = todoCount + doingCount + doneCount;
    const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-50 mb-1">Tarefas do Dia</h1>
                    <p className="text-slate-400 text-sm">Arraste os cards entre as colunas</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Filter by User */}
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            value={filterUser}
                            onChange={(e) => setFilterUser(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500"
                        >
                            <option value="Todos">Todos</option>
                            {COLLABORATORS.map(collab => (
                                <option key={collab.email} value={collab.username}>{collab.username}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Navigation */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5">
                        <button
                            onClick={() => changeDate(-1)}
                            className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                        >
                            ←
                        </button>
                        <div className="px-3 py-1 text-sm font-medium text-slate-200 min-w-[120px] text-center">
                            {formatDate(selectedDate)}
                        </div>
                        <button
                            onClick={() => changeDate(1)}
                            className="px-2 py-1 text-slate-400 hover:text-white transition-colors"
                        >
                            →
                        </button>
                        <button
                            onClick={() => setSelectedDate(getTodayDate())}
                            className="ml-1 px-2 py-1 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded transition-colors"
                        >
                            Hoje
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Progresso do Dia</span>
                    <span className="text-2xl font-bold text-violet-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-violet-600 to-emerald-600 h-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex gap-4 mt-3 text-xs text-slate-500">
                    <span>A Fazer: {todoCount}</span>
                    <span>Fazendo: {doingCount}</span>
                    <span>Concluído: {doneCount}</span>
                </div>
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-slate-950">
                    {columns.map(column => (
                        <KanbanColumn
                            key={column.id}
                            id={column.id}
                            title={column.title}
                            tasks={getTasksByStatus(column.id as any)}
                            onDelete={handleDeleteTask}
                            onAddClick={() => handleAddClick(column.id as any)}
                            color={column.color}
                        />
                    ))}
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeTask ? (
                        <div className="opacity-90">
                            <TaskCard task={activeTask} onDelete={() => { }} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Quick Add Modal */}
            <QuickAddTask
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddTask}
                defaultStatus={modalDefaultStatus}
                clients={clients}
            />
        </div>
    );
}
