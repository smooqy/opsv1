"use client";
import { useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useGlobalSearch } from '@/lib/useGlobalSearch';
import { clsx } from 'clsx';

export function GlobalSearch() {
    const {
        isOpen,
        setIsOpen,
        query,
        setQuery,
        results,
        groupedResults,
        selectedIndex,
        selectResult
    } = useGlobalSearch();

    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const groupLabels: Record<string, { title: string; icon: string }> = {
        clients: { title: 'Clientes', icon: '👥' },
        tasks: { title: 'Tasks', icon: '✅' },
        transactions: { title: 'Transações', icon: '💰' },
        actions: { title: 'Ações Rápidas', icon: '⚡' }
    };

    let currentIndex = 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[101] px-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-800">
                        <Search className="w-5 h-5 text-slate-500 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar clientes, tasks, transações..."
                            className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none"
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {results.length === 0 ? (
                            <div className="px-4 py-12 text-center text-slate-500">
                                {query ? 'Nenhum resultado encontrado' : 'Digite para buscar...'}
                            </div>
                        ) : (
                            <div className="p-2">
                                {Object.entries(groupedResults).map(([groupKey, groupResults]) => {
                                    if (groupResults.length === 0) return null;

                                    const group = groupLabels[groupKey];

                                    return (
                                        <div key={groupKey} className="mb-4 last:mb-0">
                                            {/* Group Header */}
                                            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                                <span>{group.icon}</span>
                                                <span>{group.title}</span>
                                                <span className="text-slate-700">({groupResults.length})</span>
                                            </div>

                                            {/* Group Items */}
                                            <div className="space-y-1">
                                                {groupResults.map((result) => {
                                                    const itemIndex = currentIndex++;
                                                    const isSelected = itemIndex === selectedIndex;

                                                    return (
                                                        <button
                                                            key={`${result.type}-${result.id}`}
                                                            onClick={() => selectResult(result)}
                                                            className={clsx(
                                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                                                                isSelected
                                                                    ? "bg-violet-600 text-white"
                                                                    : "hover:bg-slate-800 text-slate-300"
                                                            )}
                                                        >
                                                            <span className="text-2xl shrink-0">{result.icon}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={clsx(
                                                                    "text-sm font-medium truncate",
                                                                    isSelected ? "text-white" : "text-slate-200"
                                                                )}>
                                                                    {result.title}
                                                                </p>
                                                                {result.subtitle && (
                                                                    <p className={clsx(
                                                                        "text-xs truncate",
                                                                        isSelected ? "text-violet-200" : "text-slate-500"
                                                                    )}>
                                                                        {result.subtitle}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {isSelected && (
                                                                <span className="text-xs text-violet-200 shrink-0">Enter ↵</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer Hint */}
                    <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                            <span>↑↓ Navegar</span>
                            <span>Enter Abrir</span>
                            <span>ESC Fechar</span>
                        </div>
                        <span className="hidden sm:block">Cmd+K para buscar</span>
                    </div>
                </div>
            </div>
        </>
    );
}
