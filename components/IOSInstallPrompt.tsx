"use client";
import { useState, useEffect } from 'react';
import { X, Share, Plus, Square } from 'lucide-react';

export function IOSInstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

        // Detect if already installed (standalone mode)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone;

        // Check if user dismissed it before
        const wasDismissed = localStorage.getItem('ios-install-dismissed');

        // Show prompt if: iOS + Safari + not standalone + not dismissed
        if (isIOS && !isStandalone && !wasDismissed) {
            // Wait 2 seconds before showing
            const timer = setTimeout(() => {
                setShowPrompt(true);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('ios-install-dismissed', 'true');
    };

    const handleNeverShow = () => {
        setShowPrompt(false);
        localStorage.setItem('ios-install-dismissed', 'permanent');
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleDismiss}
            />

            {/* Prompt Card */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 border-t border-violet-600/30 shadow-2xl">
                <div className="max-w-2xl mx-auto p-6">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Icon */}
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-2xl font-bold text-white">OPS</span>
                        </div>

                        <div className="flex-1">
                            {/* Title */}
                            <h3 className="text-lg font-bold text-white mb-1">
                                Instalar OPS Operation
                            </h3>
                            <p className="text-sm text-slate-300 mb-4">
                                Adicione à tela inicial para acesso rápido como um app
                            </p>

                            {/* Instructions */}
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mb-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-violet-400 font-bold text-sm">1</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-200">
                                                Toque no botão <strong className="text-white">Compartilhar</strong>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-blue-400">
                                                <Share size={18} strokeWidth={2.5} />
                                                <span className="text-xs">(na barra inferior)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-violet-400 font-bold text-sm">2</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-200">
                                                Selecione <strong className="text-white">"Adicionar à Tela de Início"</strong>
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-slate-400">
                                                <Plus size={18} strokeWidth={2.5} />
                                                <Square size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-violet-400 font-bold text-sm">3</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-slate-200">
                                                Confirme clicando em <strong className="text-white">"Adicionar"</strong>
                                            </p>
                                            <p className="text-xs text-green-400 mt-1">✓ Pronto! Ícone aparecerá na tela inicial</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors text-sm"
                                >
                                    Agora não
                                </button>
                                <button
                                    onClick={handleNeverShow}
                                    className="px-4 py-2.5 text-slate-400 hover:text-white font-medium rounded-lg transition-colors text-sm"
                                >
                                    Não mostrar novamente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
