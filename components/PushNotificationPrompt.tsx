"use client";
import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import {
    isNotificationSupported,
    getPermissionStatus,
    requestNotificationPermission,
    subscribeToPush,
    sendTestNotification
} from '@/lib/notifications/push';

export function PushNotificationPrompt() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isVisible, setIsVisible] = useState(false);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Check support and permission on mount
        const supported = isNotificationSupported();
        setIsSupported(supported);

        if (!supported) {
            return;
        }

        const currentPermission = getPermissionStatus();
        setPermission(currentPermission);

        // Show prompt if permission not decided yet
        const dismissed = localStorage.getItem('push_prompt_dismissed');
        if (currentPermission === 'default' && !dismissed) {
            // Wait 3 seconds before showing
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleAllow = async () => {
        const granted = await requestNotificationPermission();

        if (granted) {
            setPermission('granted');

            // Subscribe to push
            await subscribeToPush();

            // Send test notification
            await sendTestNotification();

            // Hide prompt
            setIsVisible(false);
        } else {
            setPermission('denied');
            setIsVisible(false);
        }
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('push_prompt_dismissed', 'true');
    };

    const handleNeverShow = () => {
        setIsVisible(false);
        localStorage.setItem('push_prompt_dismissed', 'permanent');
    };

    // Don't show if not supported, already decided, or dismissed
    if (!isSupported || !isVisible || permission !== 'default') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-slate-900 rounded-xl border border-violet-600/50 shadow-2xl max-w-sm p-5 relative">
                {/* Close button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Icon */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
                        <Bell className="text-violet-400" size={24} />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">Ativar Notificações?</h3>
                        <p className="text-sm text-slate-400">
                            Receba alertas das automações no celular, mesmo com o app fechado
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-4 ml-16">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-green-400" />
                        <span>Alertas de tasks atrasadas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-green-400" />
                        <span>Follow-ups automáticos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-green-400" />
                        <span>Funciona no celular</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleAllow}
                        className="w-full px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Bell size={18} />
                        Permitir Notificações
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Agora não
                        </button>
                        <button
                            onClick={handleNeverShow}
                            className="flex-1 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Não mostrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
