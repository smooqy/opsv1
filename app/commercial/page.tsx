"use client";
import { useAppStore } from '@/lib/store';
import { PipelineStage, Client } from '@/lib/types';
import { MoreHorizontal } from 'lucide-react';

const columns: { id: PipelineStage; label: string; color: string }[] = [
    { id: 'new', label: 'Novos Contatos', color: 'border-slate-500/20' },
    { id: 'negotiation', label: 'Negociação', color: 'border-orange-500/20' },
    { id: 'contract', label: 'Contrato', color: 'border-blue-500/20' },
    { id: 'onboarding', label: 'Onboarding', color: 'border-indigo-500/20' },
    { id: 'active', label: 'Ativos', color: 'border-emerald-500/20' },
];

export default function Commercial() {
    const { clients, updateClientStage } = useAppStore();

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Pipeline de Vendas</h1>
                    <p className="text-slate-500 text-sm">Gerencie o fluxo comercial da agência.</p>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                {columns.map(col => (
                    <div key={col.id} className="w-80 flex-shrink-0 flex flex-col bg-slate-900/30 rounded-xl border border-slate-800 h-full">
                        <div className={`p-4 border-b border-slate-800 font-medium text-slate-200 flex justify-between items-center bg-slate-900/50 rounded-t-xl ${col.color}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(col.id)}`}></div>
                                <span>{col.label}</span>
                            </div>
                            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                                {clients.filter(c => c.pipeline_stage === col.id).length}
                            </span>
                        </div>
                        <div className="p-3 space-y-3 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                            {clients.filter(c => c.pipeline_stage === col.id).map(client => (
                                <ClientCard key={client.id} client={client} updateStage={updateClientStage} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ClientCard({ client, updateStage }: { client: Client, updateStage: Function }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-sm hover:border-slate-700 hover:shadow-lg transition-all group relative">
            <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{client.company_name}</span>
                <MoreHorizontal className="w-4 h-4 text-slate-600 cursor-pointer hover:text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-200 text-lg mb-4">{client.responsible_name}</h3>

            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase">Proposta</span>
                    <span className="text-emerald-400 font-medium text-sm">
                        R$ {client.project_value.toLocaleString('pt-BR')}
                    </span>
                </div>
            </div>

            <div className="pt-3 border-t border-slate-800/50 mt-2">
                <label className="text-[10px] text-slate-600 uppercase font-bold mb-1 block">Mover para</label>
                <select
                    value={client.pipeline_stage}
                    onChange={(e) => updateStage(client.id, e.target.value)}
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
    if (id === 'new') return 'bg-slate-500';
    if (id === 'negotiation') return 'bg-orange-500';
    if (id === 'contract') return 'bg-blue-500';
    if (id === 'onboarding') return 'bg-indigo-500';
    if (id === 'active') return 'bg-emerald-500';
    return 'bg-slate-500';
}
