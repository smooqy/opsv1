"use client";
import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { usePageContext } from '@/lib/usePageContext';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get page context
    const context = usePageContext();
    const hasSuggestions = context.suggestions.length > 0;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = async (userMessage?: string) => {
        const messageToSend = userMessage || input.trim();
        if (!messageToSend || isLoading) return;

        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageToSend,
                    context: {
                        page: context.page,
                        data: context.data
                    }
                }),
            });

            const data = await res.json();
            const reply = data.reply || "Erro ao obter resposta.";

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Erro de conexão. Verifique o console." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (prompt: string) => {
        handleSubmit(prompt);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={clsx(
                    "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-xl shadow-violet-900/30 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50 hover:shadow-violet-900/50 group",
                    isOpen && "scale-0 opacity-0 pointer-events-none"
                )}
                title={`IA • ${context.title}`}
            >
                <Sparkles className="w-6 h-6 animate-pulse" />

                {/* Suggestion Badge */}
                {hasSuggestions && !isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-slate-950"></span>
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsOpen(false)} />
            )}

            {/* Modal */}
            <div className={clsx(
                "fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-950 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header with Context Badge */}
                <div className="p-4 border-b border-slate-800 flex flex-col gap-3 bg-slate-950 shadow-sm z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-violet-500/10 text-violet-400">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-100">AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Context Badge */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 rounded-lg border border-slate-800">
                        <span className="text-lg">{context.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-400">Analisando</p>
                            <p className="text-sm text-white font-semibold truncate">{context.title}</p>
                        </div>
                    </div>

                    {/* Suggestions Alert */}
                    {hasSuggestions && (
                        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <p className="text-xs text-amber-300 font-medium">💡 {context.suggestions[0]}</p>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                {context.quickActions.length > 0 && messages.length === 0 && (
                    <div className="p-4 border-b border-slate-800 bg-slate-950/30">
                        <p className="text-xs font-medium text-slate-500 mb-2">Ações Rápidas</p>
                        <div className="flex flex-wrap gap-2">
                            {context.quickActions.map((action) => (
                                <button
                                    key={action.id}
                                    onClick={() => handleQuickAction(action.prompt)}
                                    disabled={isLoading}
                                    className="px-3 py-1.5 bg-slate-900 hover:bg-violet-600 border border-slate-800 hover:border-violet-600 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    <span>{action.icon}</span>
                                    <span>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-950/50 relative scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 mb-4 shadow-inner">
                                <Sparkles className="w-8 h-8 text-violet-500" />
                            </div>
                            <h3 className="text-slate-200 font-medium mb-2">OPS Intelligence</h3>
                            <p className="text-sm text-slate-500 px-8">
                                {context.page === 'strategy'
                                    ? 'Use o chat dedicado desta página'
                                    : `Pronto para analisar ${context.title.toLowerCase()}`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={clsx("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                        msg.role === 'user' ? "bg-indigo-600" : "bg-slate-800"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-violet-400" />}
                                    </div>
                                    <div className={clsx(
                                        "p-3 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap",
                                        msg.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-violet-400" />
                                    </div>
                                    <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none text-slate-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Pergunte sobre ${context.title.toLowerCase()}...`}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 placeholder-slate-600 transition-all shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 p-1.5 text-violet-500 hover:text-white bg-violet-500/10 hover:bg-violet-600 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
