"use client";
import { useState } from "react";
import { Client } from '@/lib/types';
import { X, User, Phone, Mail, Globe, FolderOpen, Link as LinkIcon, FileText, Lock, TrendingUp, DollarSign, Calendar, Target } from "lucide-react";

interface ClientDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    client: Client | null;
}

export default function ClientDrawer({ isOpen, onClose, client }: ClientDrawerProps) {
    const [activeTab, setActiveTab] = useState<"info" | "metrics" | "setup">("info");

    // Client Info States
    const [contactName, setContactName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [driveLink, setDriveLink] = useState("");
    const [instagramLink, setInstagramLink] = useState("");
    const [websiteLink, setWebsiteLink] = useState("");
    const [facebookLogin, setFacebookLogin] = useState("");
    const [instagramLogin, setInstagramLogin] = useState("");
    const [notes, setNotes] = useState("");

    // Metrics States  
    const [monthlyBudget, setMonthlyBudget] = useState("");
    const [currentSpend, setCurrentSpend] = useState("");
    const [leadsGoal, setLeadsGoal] = useState("");

    if (!isOpen || !client) return null;

    const saveClientInfo = () => {
        alert("✅ Informações salvas com sucesso!");
        // TODO: Integrar com banco de dados
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full shadow-2xl flex flex-col">

                {/* HEADER */}
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center z-10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {client.company_name}
                        <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded">
                            {client.status}
                        </span>
                    </h2>
                    <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-white" /></button>
                </div>

                {/* TABS */}
                <div className="flex border-b border-slate-800 bg-slate-900/50">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${activeTab === "info" ? "text-blue-400 border-b-2 border-blue-500 bg-blue-500/5" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        👤 Dados
                    </button>
                    <button
                        onClick={() => setActiveTab("metrics")}
                        className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${activeTab === "metrics" ? "text-violet-400 border-b-2 border-violet-500 bg-violet-500/5" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        📊 Métricas
                    </button>
                    <button
                        onClick={() => setActiveTab("setup")}
                        className={`flex-1 py-3 text-xs font-bold uppercase transition-all ${activeTab === "setup" ? "text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/5" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        🎯 Setup LSA
                    </button>
                </div>

                {/* ABA DADOS */}
                {activeTab === "info" && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">

                        {/* Informações do Cliente */}
                        <div>
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <User size={18} className="text-blue-400" />
                                Informações do Cliente
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Nome do Contato</label>
                                    <input
                                        type="text"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        placeholder="Ex: João Silva"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                                            <Phone size={12} /> Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="(11) 99999-9999"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                                            <Mail size={12} /> Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="cliente@email.com"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links Úteis */}
                        <div className="border-t border-slate-800 pt-6">
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <LinkIcon size={18} className="text-blue-400" />
                                Links Úteis
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                                        <FolderOpen size={12} /> Pasta do Google Drive
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={driveLink}
                                            onChange={(e) => setDriveLink(e.target.value)}
                                            placeholder="https://drive.google.com/..."
                                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                        />
                                        {driveLink && (
                                            <a href={driveLink} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs flex items-center gap-1 transition-all">
                                                <Globe size={14} /> Abrir
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Instagram</label>
                                    <input
                                        type="url"
                                        value={instagramLink}
                                        onChange={(e) => setInstagramLink(e.target.value)}
                                        placeholder="https://instagram.com/..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Website</label>
                                    <input
                                        type="url"
                                        value={websiteLink}
                                        onChange={(e) => setWebsiteLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Acessos / Logins */}
                        <div className="border-t border-slate-800 pt-6">
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <Lock size={18} className="text-blue-400" />
                                Acessos e Logins
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Login do Facebook</label>
                                    <input
                                        type="text"
                                        value={facebookLogin}
                                        onChange={(e) => setFacebookLogin(e.target.value)}
                                        placeholder="usuario@facebook"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Login do Instagram</label>
                                    <input
                                        type="text"
                                        value={instagramLogin}
                                        onChange={(e) => setInstagramLogin(e.target.value)}
                                        placeholder="@usuario"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Anotações */}
                        <div className="border-t border-slate-800 pt-6">
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <FileText size={18} className="text-blue-400" />
                                Anotações
                            </h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Anotações importantes sobre o cliente, preferências, observações..."
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-3 text-sm text-white outline-none focus:border-blue-500 resize-none h-32 transition-all"
                            />
                            <p className="text-xs text-slate-500 mt-2">💾 Essas anotações ficam salvas no perfil do cliente</p>
                        </div>

                        {/* Botão Salvar */}
                        <div className="pt-2 sticky bottom-0 bg-slate-950 pb-4">
                            <button
                                onClick={saveClientInfo}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                            >
                                💾 Salvar Informações
                            </button>
                        </div>
                    </div>
                )}

                {/* ABA MÉTRICAS */}
                {activeTab === "metrics" && (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">

                        {/* Overview */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp size={20} className="text-violet-400" />
                                Resumo do Cliente
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                                    <p className="text-xs text-slate-400 mb-1">Investimento Mensal</p>
                                    <p className="text-2xl font-bold text-white">R$ {client.monthly_value || 1500}</p>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                                    <p className="text-xs text-slate-400 mb-1">Status</p>
                                    <p className="text-2xl font-bold text-emerald-400">{client.status}</p>
                                </div>
                            </div>
                        </div>

                        {/* Metas e Objetivos */}
                        <div className="border-t border-slate-800 pt-6">
                            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <Target size={18} className="text-violet-400" />
                                Metas e Objetivos
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                                        <DollarSign size={12} /> Orçamento Mensal Google LSA
                                    </label>
                                    <input
                                        type="text"
                                        value={monthlyBudget}
                                        onChange={(e) => setMonthlyBudget(e.target.value)}
                                        placeholder="R$ 3.000"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Gasto Atual (Mês)</label>
                                    <input
                                        type="text"
                                        value={currentSpend}
                                        onChange={(e) => setCurrentSpend(e.target.value)}
                                        placeholder="R$ 1.250"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Meta de Leads/Mês</label>
                                    <input
                                        type="text"
                                        value={leadsGoal}
                                        onChange={(e) => setLeadsGoal(e.target.value)}
                                        placeholder="50 leads"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="border-t border-slate-800 pt-6">
                            <h3 className="text-white font-bold text-sm mb-4">Performance do Mês</h3>
                            <div className="space-y-3">
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center">
                                    <p className="text-sm text-slate-300">Leads Recebidos</p>
                                    <p className="text-lg font-bold text-emerald-400">32</p>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center">
                                    <p className="text-sm text-slate-300">Taxa de Conversão</p>
                                    <p className="text-lg font-bold text-blue-400">4.2%</p>
                                </div>
                                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex justify-between items-center">
                                    <p className="text-sm text-slate-300">Custo por Lead</p>
                                    <p className="text-lg font-bold text-yellow-400">R$ 39</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ABA SETUP LSA */}
                {activeTab === "setup" && (
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-950">
                        <div className="mb-6">
                            <h3 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
                                <Target size={24} className="text-emerald-500" />
                                Setup Google LSA
                            </h3>
                            <p className="text-slate-400 text-sm">
                                Checklist para configuração do Google Local Service Ads
                            </p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { title: "Conta Google LSA criada e verificada", critical: true },
                                { title: "Licenças e certificados enviados", critical: true },
                                { title: "Verificação de background aprovada", critical: true },
                                { title: "Área de cobertura definida", critical: false },
                                { title: "Horário de atendimento configurado", critical: false },
                                { title: "Orçamento semanal definido", critical: false },
                                { title: "Tipos de serviço selecionados", critical: false },
                                { title: "Fotos do negócio enviadas", critical: false },
                                { title: "Sistema de gestão de leads integrado", critical: false },
                                { title: "Treinamento da equipe de atendimento", critical: false }
                            ].map((item, idx) => (
                                <label
                                    key={idx}
                                    className={`flex items-start gap-3 p-4 bg-slate-900 border rounded-lg hover:border-emerald-500/30 cursor-pointer transition-all group ${item.critical ? 'border-orange-500/30' : 'border-slate-800'}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 focus:ring-offset-slate-900"
                                    />
                                    <div className="flex-1">
                                        <span className="text-sm text-slate-300 block">{item.title}</span>
                                        {item.critical && (
                                            <span className="text-xs text-orange-400 mt-1 block">⚠️ Crítico para começar</span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                            <p className="text-xs text-emerald-300">
                                💡 <strong>Dica:</strong> Priorize os itens marcados como críticos antes de ativar os anúncios LSA.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
