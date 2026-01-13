"use client";
import { useState, useEffect } from 'react';
import { CheckSquare, Timer, Edit3, Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function Routine() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-100">Rotina & Foco</h1>
                <p className="text-slate-500 text-sm">Organize seu dia e mantenha a produtividade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DailyGoals />
                <FocusMode />
                <Scratchpad />
            </div>
        </div>
    );
}

// --- Componente A: Metas do Dia ---
function DailyGoals() {
    const [goals, setGoals] = useState<{ id: number, text: string, done: boolean }[]>([]);
    const [input, setInput] = useState("");

    const addGoal = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;
        setGoals([...goals, { id: Date.now(), text: input, done: false }]);
        setInput("");
    };

    const toggleGoal = (id: number) => {
        setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
    };

    const deleteGoal = (id: number) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[400px] shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <CheckSquare className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-100">Prioridades de Hoje</h3>
            </div>

            <form onSubmit={addGoal} className="flex gap-2 mb-4">
                <input
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                    placeholder="Adicionar meta..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button type="submit" className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    <Plus className="w-4 h-4" />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {goals.length === 0 && (
                    <p className="text-center text-slate-600 text-sm mt-10 italic">Nenhuma meta definida ainda.</p>
                )}
                {goals.map(goal => (
                    <div key={goal.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-800/50 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <button
                                onClick={() => toggleGoal(goal.id)}
                                className={clsx(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-all",
                                    goal.done ? "bg-emerald-500 border-emerald-500 text-slate-950" : "border-slate-600 hover:border-emerald-500"
                                )}
                            >
                                {goal.done && <CheckSquare className="w-3.5 h-3.5" />}
                            </button>
                            <span className={clsx("text-sm truncate", goal.done ? "text-slate-600 line-through decoration-slate-600" : "text-slate-300")}>
                                {goal.text}
                            </span>
                        </div>
                        <button onClick={() => deleteGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 p-1 transition-all">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Componente B: Modo Foco (Pomodoro) ---
function FocusMode() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus'); // 'focus' | 'break'

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const setTimer = (mins: number, m: 'focus' | 'break') => {
        setIsActive(false);
        setTimeLeft(mins * 60);
        setMode(m);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[400px] shadow-sm hover:border-slate-700 transition-colors relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 bg-violet-500/10 rounded-lg text-violet-500">
                    <Timer className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-100">Modo Foco</h3>
            </div>

            {/* Background progress ring effect could go here, but keeping it simple for now */}

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                <div className={clsx(
                    "text-7xl font-mono font-bold tracking-tighter mb-8",
                    isActive ? "text-violet-400 animate-pulse" : "text-slate-700"
                )}>
                    {formatTime(timeLeft)}
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={clsx(
                            "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95",
                            isActive ? "bg-slate-800 text-slate-300 border border-slate-700" : "bg-violet-600 text-white shadow-violet-900/40 hover:bg-violet-700"
                        )}
                    >
                        {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                    </button>
                    <button
                        onClick={() => setTimer(mode === 'focus' ? 25 : 5, mode)}
                        className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center hover:text-white hover:border-slate-600 transition-all active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setTimer(25, 'focus')}
                        className={clsx("px-4 py-1.5 rounded-md text-xs font-medium transition-colors", mode === 'focus' ? "bg-violet-900/50 text-violet-300" : "text-slate-500 hover:text-slate-300")}
                    >
                        Foco (25m)
                    </button>
                    <button
                        onClick={() => setTimer(5, 'break')}
                        className={clsx("px-4 py-1.5 rounded-md text-xs font-medium transition-colors", mode === 'break' ? "bg-emerald-900/50 text-emerald-300" : "text-slate-500 hover:text-slate-300")}
                    >
                        Pausa (5m)
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Componente C: Rascunho Rápido ---
function Scratchpad() {
    const [note, setNote] = useState("");

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-[400px] shadow-sm hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500">
                    <Edit3 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-100">Rascunho</h3>
            </div>

            <textarea
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 focus:outline-none focus:border-orange-500/50 resize-none font-mono leading-relaxed custom-scrollbar placeholder-slate-700"
                placeholder="Cole aqui links, ideias ou lembretes rápidos..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />

            <div className="mt-3 flex justify-between items-center text-xs text-slate-600">
                <span>Não salvo na nuvem</span>
                <span>{note.length} caracteres</span>
            </div>
        </div>
    )
}
