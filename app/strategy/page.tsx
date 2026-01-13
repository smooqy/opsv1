"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Paperclip, PlusCircle, Copy, Palette, ChevronDown, User, AlertCircle } from "lucide-react";

// MOCK DE CLIENTES (Para teste)
const MOCK_CLIENTS = [
    { id: 1, name: "Ana Silva", business: "Beauty Spa" },
    { id: 2, name: "Carlos Oliveira", business: "Tech Solutions" },
    { id: 3, name: "Mariana Costa", business: "Doces Gourmet" },
];

export default function StrategyPage() {
    const [selectedClient, setSelectedClient] = useState(MOCK_CLIENTS[0]);
    const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

    // Chat States
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [image, setImage] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages, loading]);

    // Reset ao mudar cliente
    useEffect(() => {
        setMessages([]);
        setErrorMsg("");
    }, [selectedClient]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const addToBacklog = (ideaTitle: string) => {
        alert(`✅ "${ideaTitle}" enviado para Produção!`);
    };

    // --- FUNÇÃO DE ENVIO ---
    const sendMessage = async () => {
        if (!inputMessage.trim() && !image) return;

        const userText = inputMessage;
        const userMsg = { role: "user", content: userText };

        setMessages(prev => [...prev, userMsg]);
        setInputMessage("");
        setLoading(true);
        setErrorMsg("");

        try {
            // console.log("Enviando mensagem para API...");

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: [...messages, userMsg],
                    imageBase64: image,
                    context: {
                        clientName: selectedClient.name,
                        clientBusiness: selectedClient.business
                    }
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro na resposta da API");
            if (!data.reply) throw new Error("A IA não retornou texto.");

            // Tenta detectar JSON
            let isJson = false;
            let parsedContent = null;
            try {
                parsedContent = JSON.parse(data.reply);
                if (parsedContent.ideas) isJson = true;
            } catch (e) {
                // Texto normal
            }

            setMessages(prev => [...prev, {
                role: "assistant",
                content: data.reply,
                isJson,
                parsedContent
            }]);

            setImage(null);

        } catch (error: any) {
            console.error("Erro no frontend:", error);
            setErrorMsg("Erro ao conectar com a IA. Verifique se o servidor está rodando.");
            setMessages(prev => [...prev, { role: "assistant", content: "❌ Ocorreu um erro ao processar sua mensagem." }]);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZAÇÃO DE MENSAGENS ---
    const renderMessage = (msg: any) => {
        if (msg.role === "user") {
            return (
                <div className="flex justify-end">
                    <div className="bg-violet-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-md">
                        {msg.content}
                    </div>
                </div>
            );
        }

        // Se for JSON (Ideias)
        if (msg.isJson && msg.parsedContent) {
            return (
                <div className="w-full space-y-4 animate-in fade-in duration-500">
                    <div className="bg-slate-800/50 text-slate-300 p-4 rounded-2xl rounded-tl-none border border-slate-700 text-sm">
                        {msg.parsedContent.reply}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                        {msg.parsedContent.ideas.map((idea: any, idx: number) => (
                            <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-violet-500/50 transition-all group shadow-sm flex flex-col">
                                <div className="p-4 border-b border-slate-900 bg-slate-900/30 flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase text-violet-300 bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">
                                            {idea.format}
                                        </span>
                                        <h4 className="text-white font-bold text-sm mt-2">{idea.title}</h4>
                                    </div>
                                    <button onClick={() => addToBacklog(idea.title)} className="text-slate-400 hover:text-white hover:bg-emerald-500 p-2 rounded-lg transition-all">
                                        <PlusCircle size={20} />
                                    </button>
                                </div>
                                <div className="p-4 space-y-2 flex-1">
                                    <p className="text-slate-400 text-xs leading-relaxed">{idea.description}</p>
                                </div>
                                {idea.visual_prompt && (
                                    <div className="bg-black/40 p-3 flex gap-3 items-center cursor-pointer hover:bg-black/60" onClick={() => navigator.clipboard.writeText(idea.visual_prompt)}>
                                        <Palette size={14} className="text-slate-500 shrink-0" />
                                        <p className="text-[10px] text-slate-500 font-mono truncate flex-1">{idea.visual_prompt}</p>
                                        <Copy size={14} className="text-slate-500 hover:text-violet-400" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Texto normal
        return (
            <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none max-w-[85%] text-sm border border-slate-700 whitespace-pre-wrap">
                    {msg.content}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-slate-950 text-white overflow-hidden">

            {/* HEADER COM SELETOR DE CLIENTE */}
            <div className="border-b border-slate-900 bg-slate-950/90 backdrop-blur-sm p-3 md:p-4 relative z-10 flex-shrink-0">
                <div className="w-full flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <Sparkles size={20} className="text-violet-500 flex-shrink-0 md:w-6 md:h-6" />
                        <div className="min-w-0">
                            <h1 className="text-base md:text-lg font-bold text-white truncate">Estratégia IA</h1>
                            <p className="text-[10px] md:text-xs text-slate-500 hidden sm:block">Gerador de Conteúdo Inteligente</p>
                        </div>
                    </div>

                    <div className="relative z-50 flex-shrink-0">
                        <button
                            onClick={() => setIsClientMenuOpen(!isClientMenuOpen)}
                            className="flex items-center gap-2 md:gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2.5 transition-all"
                        >
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-violet-600 flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0">
                                {selectedClient.name.charAt(0)}
                            </div>
                            <div className="text-left hidden sm:block">
                                <p className="text-xs md:text-sm font-bold text-white">{selectedClient.name}</p>
                                <p className="text-[9px] md:text-[10px] text-slate-400">{selectedClient.business}</p>
                            </div>
                            <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                        </button>
                        {isClientMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-[100] min-w-[200px] md:min-w-[250px] overflow-hidden">
                                {MOCK_CLIENTS.map(client => (
                                    <button
                                        key={client.id}
                                        onClick={() => { setSelectedClient(client); setIsClientMenuOpen(false); }}
                                        className="w-full text-left p-3 hover:bg-slate-800 flex items-center gap-3 border-b border-slate-800/50 last:border-0"
                                    >
                                        <User size={14} className="text-slate-500" />
                                        <span className="text-sm text-slate-300">{client.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ÁREA DE CHAT - FULL WIDTH */}
            <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden min-h-0">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-8 pb-32">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-60 px-4">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-4 md:mb-6 border border-slate-800">
                                <Sparkles size={32} className="text-violet-500 md:w-10 md:h-10" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Ops IA 2.5</h2>
                            <p className="text-xs md:text-sm max-w-md text-center">
                                Estou pronto para criar estratégias visuais para <span className="text-violet-400 font-bold">{selectedClient.business}</span>.
                            </p>
                            <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 w-full max-w-md">
                                <button
                                    onClick={() => setInputMessage("3 ideias para vender essa semana")}
                                    className="px-3 md:px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs hover:border-violet-500 hover:text-white transition-all text-left"
                                >
                                    "3 ideias para vender essa semana"
                                </button>
                                <button
                                    onClick={() => setInputMessage("Ideia de Reels viral mostrando bastidores")}
                                    className="px-3 md:px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs hover:border-violet-500 hover:text-white transition-all text-left"
                                >
                                    "Ideia de Reels de bastidores"
                                </button>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div key={idx} className="w-full animate-in slide-in-from-bottom-2 duration-300">
                            {renderMessage(msg)}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-3 text-slate-500 ml-4">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                                <span className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                            </div>
                            <span className="text-xs">Analisando e criando pautas...</span>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="flex items-center gap-2 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                            <AlertCircle size={18} />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                </div>

                {/* Input Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
                    <div className="w-full max-w-5xl mx-auto">
                        {image && (
                            <div className="flex items-center gap-2 mb-3 bg-slate-900/80 p-2 rounded-lg w-fit border border-slate-800 backdrop-blur-sm">
                                <div className="w-10 h-10 rounded bg-slate-800 overflow-hidden">
                                    <img src={image} className="w-full h-full object-cover" alt="Upload" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-white font-bold">Imagem Anexada</span>
                                    <span className="text-[10px] text-slate-400">Será usada para análise visual</span>
                                </div>
                                <button onClick={() => setImage(null)} className="ml-2 p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400">×</button>
                            </div>
                        )}

                        <div className="flex gap-2 md:gap-3 bg-slate-900 p-2 rounded-xl md:rounded-2xl border border-slate-800 focus-within:border-violet-600 focus-within:ring-1 focus-within:ring-violet-600/50 shadow-2xl transition-all">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 md:p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg md:rounded-xl transition-colors flex-shrink-0"
                            >
                                <Paperclip size={18} className="md:w-5 md:h-5" />
                            </button>
                            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />

                            <input
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                placeholder={`Converse com o estrategista...`}
                                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none min-w-0"
                            />

                            <button
                                onClick={sendMessage}
                                disabled={loading || (!inputMessage && !image)}
                                className="p-2 md:p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg md:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-900/20 transition-all active:scale-95 flex-shrink-0"
                            >
                                <Send size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                        </div>
                        <p className="text-center text-[9px] md:text-[10px] text-slate-600 mt-2 md:mt-3">
                            A IA pode cometer erros. Revise as pautas antes de enviar para produção.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
