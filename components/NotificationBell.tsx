"use client";
import { useState } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotificationContext } from '@/lib/NotificationContext';
import { clsx } from 'clsx';
import Link from 'next/link';

export function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotificationContext();

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-500';
            case 'medium': return 'border-orange-500';
            case 'low': return 'border-blue-500';
            default: return 'border-slate-700';
        }
    };

    const formatTimeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

        if (seconds < 60) return 'agora mesmo';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
        return `${Math.floor(seconds / 86400)}d atrás`;
    };

    return (
        <>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
                <Bell className={clsx(
                    "w-5 h-5",
                    unreadCount > 0 && "animate-[ring_2s_ease-in-out_infinite]"
                )} />

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Notification Center */}
            {isOpen && (
                <div className="fixed top-16 right-4 w-96 max-h-[600px] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-white">Notificações</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={clsx(
                                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                                    filter === 'all'
                                        ? "bg-violet-600 text-white"
                                        : "bg-slate-800 text-slate-400 hover:text-white"
                                )}
                            >
                                Todas ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={clsx(
                                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                                    filter === 'unread'
                                        ? "bg-violet-600 text-white"
                                        : "bg-slate-800 text-slate-400 hover:text-white"
                                )}
                            >
                                Não lidas ({unreadCount})
                            </button>
                        </div>

                        {/* Actions */}
                        {notifications.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                Marcar todas como lidas
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                        {filteredNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center opacity-50">
                                <Bell className="w-12 h-12 text-slate-700 mb-2" />
                                <p className="text-sm text-slate-500">
                                    {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
                                </p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-2">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={clsx(
                                            "p-3 rounded-lg border-l-3 transition-all group hover:bg-slate-800/50",
                                            !notification.read ? "bg-slate-900" : "bg-slate-950/50 opacity-70",
                                            getPriorityColor(notification.priority)
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="text-2xl shrink-0">{notification.icon}</div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h4 className="font-medium text-sm text-white truncate">
                                                        {notification.title}
                                                    </h4>
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-slate-400 mb-2">{notification.message}</p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">
                                                        {formatTimeAgo(notification.timestamp)}
                                                    </span>

                                                    <div className="flex gap-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                                                            >
                                                                Marcar lida
                                                            </button>
                                                        )}

                                                        {notification.actionUrl && (
                                                            <Link
                                                                href={notification.actionUrl}
                                                                onClick={() => {
                                                                    markAsRead(notification.id);
                                                                    setIsOpen(false);
                                                                }}
                                                                className="text-xs text-violet-400 hover:text-violet-300 font-medium transition-colors"
                                                            >
                                                                {notification.actionLabel || 'Ver'}
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30% { transform: rotate(-10deg); }
          20%, 40% { transform: rotate(10deg); }
        }
      `}</style>
        </>
    );
}
