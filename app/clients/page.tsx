"use client";
import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Plus, Search, Eye, EyeOff, X } from 'lucide-react';
import { Client, ClientAccess } from '@/lib/types';
import ClientDrawer from '@/components/ClientDrawer';
import ClientActionsMenu from '@/components/ClientActionsMenu';
import { ClientPriority } from '@/components/ClientPriority';

export default function Clients() {
    const { clients, addClient, loading, deleteClient, updateClient } = useAppStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [search, setSearch] = useState("");

    const handlePriorityChange = async (clientId: number, newPriority: 'low' | 'medium' | 'high') => {
        await updateClient(clientId, { priority: newPriority });
    };

    const filteredClients = clients.filter(c =>
        c.responsible_name.toLowerCase().includes(search.toLowerCase()) ||
        c.company_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Base de Clientes</h1>
                    <p className="text-slate-500 text-sm">Gerencie os acessos e contratos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-lg shadow-violet-900/20"
                >
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                </button>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou empresa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-600 focus:ring-1 focus:ring-violet-600 transition-all placeholder:text-slate-600"
                    />
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                        <p className="text-slate-400 mt-4">Carregando clientes...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead className="bg-slate-950 border-b border-slate-800">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Empresa</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Valor</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredClients.map(client => (
                                    <tr
                                        key={client.id}
                                        className="hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <ClientPriority
                                                priority={client.priority || null}
                                                onChange={(newPriority) => handlePriorityChange(client.id, newPriority)}
                                            />
                                        </td>
                                        <td className="p-4 text-slate-200 font-medium cursor-pointer" onClick={() => setSelectedClient(client)}>{client.responsible_name}</td>
                                        <td className="p-4 text-slate-400 cursor-pointer" onClick={() => setSelectedClient(client)}>{client.company_name}</td>
                                        <td className="p-4 text-slate-200 cursor-pointer" onClick={() => setSelectedClient(client)}>R$ {client.project_value.toLocaleString('pt-BR')}</td>
                                        <td className="p-4 cursor-pointer" onClick={() => setSelectedClient(client)}>
                                            <span className={`px-2 py-1 rounded-full text-xs border font-medium uppercase ${getStatusStyle(client.pipeline_stage)}`}>
                                                {client.pipeline_stage}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <ClientActionsMenu
                                                onView={() => setSelectedClient(client)}
                                                onEdit={() => alert('Edição em desenvolvimento')}
                                                onDelete={async () => {
                                                    if (confirm(`Deletar ${client.company_name}?`)) {
                                                        await deleteClient(client.id);
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && filteredClients.length === 0 && <div className="p-8 text-center text-slate-500">Nenhum cliente encontrado.</div>}
            </div>

            {isModalOpen && <NewClientModal onClose={() => setIsModalOpen(false)} onSave={addClient} />}

            <ClientDrawer
                client={selectedClient}
                isOpen={!!selectedClient}
                onClose={() => setSelectedClient(null)}
            />
        </div>
    )
}

function NewClientModal({ onClose, onSave }: { onClose: () => void, onSave: (c: Client) => void }) {
    const [formData, setFormData] = useState<Partial<Client>>({
        responsible_name: '',
        company_name: '',
        whatsapp: '',
        project_scope: '',
        project_value: 0,
        start_date: '',
        pipeline_stage: 'new',
        production_stage: 'backlog',
        access_creds: {
            instagram: { u: '', p: '' },
            facebook: { u: '', p: '' },
            gmail: { u: '', p: '' }
        }
    });

    const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: Date.now(),
        } as Client);
        onClose();
    };

    const togglePassword = (key: string) => {
        setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
    }

    const updateCred = (platform: string, field: 'u' | 'p', val: string) => {
        setFormData(prev => {
            const currentCreds = prev.access_creds || {};
            const platformName = platform as keyof ClientAccess; // Cast to satisfy type check logic if strict
            // However, ClientAccess has index signature so string is fine.
            const existingCred = currentCreds[platformName] || { u: '', p: '' };

            return {
                ...prev,
                access_creds: {
                    ...currentCreds,
                    [platformName]: {
                        ...existingCred,
                        [field]: val
                    }
                }
            };
        });
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
                <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center z-10 shrink-0">
                    <h2 className="text-xl font-bold text-slate-100">Novo Cliente</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8 flex-1 overflow-y-auto">

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-violet-400">
                            <span className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-xs font-bold border border-violet-500/20">A</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Identificação</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Nome Responsável" value={formData.responsible_name} onChange={(v: any) => setFormData({ ...formData, responsible_name: v })} required />
                            <Input label="Nome da Empresa" value={formData.company_name} onChange={(v: any) => setFormData({ ...formData, company_name: v })} required />
                            <Input label="WhatsApp" value={formData.whatsapp} onChange={(v: any) => setFormData({ ...formData, whatsapp: v })} />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-violet-400">
                            <span className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-xs font-bold border border-violet-500/20">B</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Acessos</h3>
                        </div>
                        <div className="space-y-3">
                            {['instagram', 'facebook', 'gmail'].map(platform => (
                                <div key={platform} className="grid grid-cols-12 gap-3 items-end bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                    <div className="col-span-12 md:col-span-12 mb-1 text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                        {platform}
                                    </div>
                                    <div className="col-span-6">
                                        <input
                                            placeholder="Usuário / Email"
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-violet-500 focus:outline-none placeholder:text-slate-600"
                                            value={(formData.access_creds as any)?.[platform]?.u || ''}
                                            onChange={e => updateCred(platform, 'u', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-6 relative">
                                        <input
                                            type={showPassword[platform] ? "text" : "password"}
                                            placeholder="Senha"
                                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:border-violet-500 focus:outline-none pr-10 placeholder:text-slate-600"
                                            value={(formData.access_creds as any)?.[platform]?.p || ''}
                                            onChange={e => updateCred(platform, 'p', e.target.value)}
                                        />
                                        <button type="button" onClick={() => togglePassword(platform)} className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300">
                                            {showPassword[platform] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-violet-400">
                            <span className="w-6 h-6 rounded-full bg-violet-500/10 flex items-center justify-center text-xs font-bold border border-violet-500/20">C</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Contrato</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-xs font-medium text-slate-400 mb-1">Valor (R$)</label>
                                <input
                                    type="number"
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-violet-500 focus:outline-none"
                                    value={formData.project_value}
                                    onChange={e => setFormData({ ...formData, project_value: Number(e.target.value) })}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-medium text-slate-400 mb-1">Data Início</label>
                                <input
                                    type="date"
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-violet-500 focus:outline-none"
                                    value={formData.start_date}
                                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-400 mb-1">Escopo do Projeto</label>
                                <textarea
                                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-violet-500 focus:outline-none h-20 placeholder:text-slate-600"
                                    placeholder="Descreva o que será entregue..."
                                    value={formData.project_scope}
                                    onChange={e => setFormData({ ...formData, project_scope: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>
                </form>

                <div className="p-4 border-t border-slate-800 bg-slate-900 rounded-b-2xl flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded text-slate-400 hover:text-white transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} type="button" className="px-6 py-2 rounded bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-900/20 transform transition-transform active:scale-95">Salvar Cliente</button>
                </div>
            </div>
        </div>
    )
}

function Input({ label, value, onChange, required }: any) {
    return (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{label} {required && '*'}</label>
            <input
                required={required}
                type="text"
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:border-violet-500 focus:outline-none placeholder:text-slate-600"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    )
}


function getStatusStyle(status: string) {
    if (status === 'active') return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (status === 'new') return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    if (status === 'negotiation') return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
}
