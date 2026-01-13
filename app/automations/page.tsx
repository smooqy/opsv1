"use client";
import { useState } from 'react';
import { useAutomations } from '@/lib/useAutomations';
import { useAppStore } from '@/lib/store';
import { Zap, Plus, Play, Clock, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Automation } from '@/lib/automations/types';

export default function AutomationsPage() {
    const { automations, isRunning, toggleAutomation, deleteAutomation, runAutomationsNow, getPredefinedRules, activatePredefined } = useAutomations();
    const { clients, tasks, transactions } = useAppStore();
    const [showPredefined, setShowPredefined] = useState(true);
    const [showNewModal, setShowNewModal] = useState(false);

    const predefinedRules = getPredefinedRules();
    const activeAutomations = automations.filter(a => a.enabled);
    const inactiveAutomations = automations.filter(a => !a.enabled);

    const handleRunNow = async () => {
        await runAutomationsNow({
            clients,
            tasks,
            transactions,
            user: {}
        });
    };

    const handleActivate = (templateName: string) => {
        activatePredefined(templateName);
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center shadow-lg">
                            <Zap className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Automações Inteligentes</h1>
                            <p className="text-slate-400">Automatize tarefas repetitivas e economize tempo</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleRunNow}
                            disabled={isRunning || activeAutomations.length === 0}
                            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Play size={18} />
                            {isRunning ? 'Executando...' : 'Executar Agora'}
                        </button>

                        <button
                            onClick={() => setShowNewModal(true)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Nova Automação
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1">Ativas</div>
                        <div className="text-2xl font-bold text-white">{activeAutomations.length}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1">Inativas</div>
                        <div className="text-2xl font-bold text-white">{inactiveAutomations.length}</div>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1">Execuções Total</div>
                        <div className="text-2xl font-bold text-white">
                            {automations.reduce((sum, a) => sum + a.runCount, 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Predefined Rules */}
            {showPredefined && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-violet-400" size={20} />
                            <h2 className="text-xl font-bold text-white">Regras Pré-Definidas</h2>
                        </div>
                        <button
                            onClick={() => setShowPredefined(false)}
                            className="text-sm text-slate-400 hover:text-white"
                        >
                            Ocultar
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {predefinedRules.map((rule, index) => {
                            const isActivated = automations.some(a => a.name === rule.name);

                            return (
                                <div
                                    key={index}
                                    className="bg-slate-900/50 rounded-lg p-5 border border-slate-800 hover:border-violet-600/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-semibold text-white text-sm">{rule.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${rule.category === 'client' ? 'bg-blue-500/20 text-blue-400' :
                                                rule.category === 'task' ? 'bg-green-500/20 text-green-400' :
                                                    rule.category === 'financial' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-slate-500/20 text-slate-400'
                                            }`}>
                                            {rule.category}
                                        </span>
                                    </div>

                                    <p className="text-sm text-slate-400 mb-4">{rule.description}</p>

                                    <div className="flex items-center gap-2">
                                        {isActivated ? (
                                            <div className="flex-1 text-xs text-green-400 flex items-center gap-1">
                                                <CheckCircle2 size={14} />
                                                Ativada
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleActivate(rule.name)}
                                                className="flex-1 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Ativar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Active Automations */}
            {activeAutomations.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Automações Ativas</h2>
                    <div className="space-y-3">
                        {activeAutomations.map((automation) => (
                            <AutomationCard
                                key={automation.id}
                                automation={automation}
                                onToggle={toggleAutomation}
                                onDelete={deleteAutomation}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Inactive Automations */}
            {inactiveAutomations.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Automações Inativas</h2>
                    <div className="space-y-3">
                        {inactiveAutomations.map((automation) => (
                            <AutomationCard
                                key={automation.id}
                                automation={automation}
                                onToggle={toggleAutomation}
                                onDelete={deleteAutomation}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {automations.length === 0 && !showPredefined && (
                <div className="text-center py-16">
                    <Zap className="mx-auto text-slate-600 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhuma automação criada</h3>
                    <p className="text-slate-400 mb-6">Comece ativando uma regra pré-definida</p>
                    <button
                        onClick={() => setShowPredefined(true)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium"
                    >
                        Ver Regras Pré-Definidas
                    </button>
                </div>
            )}

            {/* New Automation Modal */}
            {showNewModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-md w-full p-6 relative">
                        <button
                            onClick={() => setShowNewModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-2">Nova Automação Customizada</h3>
                        <p className="text-slate-400 text-sm mb-6">
                            🚧 Feature em desenvolvimento! Por enquanto, use as regras pré-definidas ou aguarde a próxima versão com builder visual completo.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowNewModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewModal(false);
                                    setShowPredefined(true);
                                }}
                                className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Ver Pré-Definidas
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Automation Card Component
function AutomationCard({
    automation,
    onToggle,
    onDelete
}: {
    automation: Automation;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className={`bg-slate-900/50 rounded-lg p-5 border transition-colors ${automation.enabled ? 'border-violet-600/50' : 'border-slate-800'
            }`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{automation.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${automation.enabled
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-slate-500/20 text-slate-400'
                            }`}>
                            {automation.enabled ? 'Ativa' : 'Inativa'}
                        </span>
                    </div>

                    <p className="text-sm text-slate-400 mb-3">{automation.description}</p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                        {automation.lastRun && (
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                Última: {new Date(automation.lastRun).toLocaleDateString()}
                            </div>
                        )}
                        <div>Execuções: {automation.runCount}</div>
                        <div>{automation.actions.length} ações</div>
                    </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={() => onToggle(automation.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${automation.enabled
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-violet-600 hover:bg-violet-700 text-white'
                            }`}
                    >
                        {automation.enabled ? 'Pausar' : 'Ativar'}
                    </button>

                    <button
                        onClick={() => onDelete(automation.id)}
                        className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                        Deletar
                    </button>
                </div>
            </div>
        </div>
    );
}
