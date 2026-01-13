"use client";
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from './store';
import { AppNotification, NotificationType, NotificationPriority } from './notifications.types';

const STORAGE_KEY = 'ops_notifications';

export function useNotifications() {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const { clients, tasks, transactions } = useAppStore();

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const withDates = parsed.map((n: any) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                }));
                setNotifications(withDates);
            } catch (e) {
                console.error('Error loading notifications:', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (notifications.length > 0 || localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        }
    }, [notifications]);

    // Create notification helper
    const createNotification = useCallback((
        type: NotificationType,
        title: string,
        message: string,
        priority: NotificationPriority = 'medium',
        actionUrl?: string,
        actionLabel?: string
    ) => {
        const icons: Record<NotificationType, string> = {
            deadline: '⏰',
            followup: '📞',
            financial: '💰',
            risk: '⚠️',
            achievement: '🎉',
            suggestion: '💡'
        };

        const notification: AppNotification = {
            id: `${Date.now()}-${Math.random()}`,
            type,
            title,
            message,
            icon: icons[type],
            priority,
            timestamp: new Date(),
            read: false,
            actionUrl,
            actionLabel
        };

        setNotifications(prev => [notification, ...prev]);
        return notification;
    }, []);

    // Check for deadlines - HARDENED
    const checkDeadlines = useCallback(() => {
        if (!tasks || tasks.length === 0) return;

        const now = new Date();

        tasks.forEach(task => {
            try {
                // Skip if no title
                if (!task.title) return;

                // Tasks don't have deadline property yet - skip for now
                // This will be enabled when we add deadline field to tasks
                /*
                if (!task.deadline || task.stage === 'entregue') return;
        
                const deadline = new Date(task.deadline);
                const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
                const alreadyNotified = notifications.some(n => 
                  n.message.includes(task.title) && 
                  n.type === 'deadline' &&
                  !n.read
                );
        
                if (alreadyNotified) return;
        
                if (diffDays === 0) {
                  createNotification(
                    'deadline',
                    'Task vence hoje!',
                    `"${task.title}" vence hoje`,
                    'high',
                    '/production',
                    'Ver task'
                  );
                } else if (diffDays === 1) {
                  createNotification(
                    'deadline',
                    'Task vence amanhã',
                    `"${task.title}" vence amanhã`,
                    'medium',
                    '/production',
                    'Ver task'
                  );
                }
                */
            } catch (err) {
                console.error('Error checking deadline for task:', task, err);
            }
        });
    }, [tasks, notifications, createNotification]);

    // Check for client follow-ups - HARDENED
    const checkFollowups = useCallback(() => {
        if (!clients || clients.length === 0) return;

        const now = new Date();

        clients.forEach(client => {
            try {
                if (!client || !client.company_name) return;
                if (client.status === 'inativo') return;

                // Using created_at as proxy for last contact
                const lastContactDate = client.created_at ? new Date(client.created_at) : new Date();
                const daysSinceContact = Math.floor((now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));

                const alreadyNotified = notifications.some(n =>
                    n.message?.includes(client.company_name || '') &&
                    n.type === 'followup' &&
                    !n.read
                );

                if (alreadyNotified) return;

                if (daysSinceContact >= 30) {
                    createNotification(
                        'followup',
                        'Cliente precisa de atenção!',
                        `${client.company_name} está há ${daysSinceContact} dias sem contato`,
                        'high',
                        '/clients',
                        'Contactar agora'
                    );
                } else if (daysSinceContact >= 14) {
                    createNotification(
                        'followup',
                        'Follow-up necessário',
                        `${client.company_name} está há ${daysSinceContact} dias sem contato`,
                        'medium',
                        '/clients',
                        'Ver cliente'
                    );
                }
            } catch (err) {
                console.error('Error checking followup for client:', client, err);
            }
        });
    }, [clients, notifications, createNotification]);

    // Check financials - HARDENED
    const checkFinancials = useCallback(() => {
        if (!transactions || transactions.length === 0) return;

        try {
            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();

            const monthlyTransactions = transactions.filter(t => {
                if (!t || !t.date) return false;
                try {
                    const date = new Date(t.date);
                    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
                } catch {
                    return false;
                }
            });

            const revenue = monthlyTransactions
                .filter(t => t.type === 'receita')
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            const expenses = monthlyTransactions
                .filter(t => t.type === 'despesa')
                .reduce((sum, t) => sum + (t.amount || 0), 0);

            const alreadyNotified = notifications.some(n =>
                n.type === 'financial' &&
                n.message?.includes('despesas') &&
                !n.read
            );

            if (expenses > revenue && !alreadyNotified && expenses > 0) {
                createNotification(
                    'financial',
                    'Atenção às finanças!',
                    `Despesas (R$ ${expenses.toFixed(0)}) maiores que receita (R$ ${revenue.toFixed(0)}) este mês`,
                    'high',
                    '/financial',
                    'Revisar'
                );
            }
        } catch (err) {
            console.error('Error checking financials:', err);
        }
    }, [transactions, notifications, createNotification]);

    // Check risks - HARDENED
    const checkRisks = useCallback(() => {
        if (!clients || clients.length === 0) return;

        try {
            const inactiveClients = clients.filter(c => c?.status === 'inativo').length;

            const alreadyNotified = notifications.some(n =>
                n.type === 'risk' &&
                n.message?.includes('inativos') &&
                !n.read
            );

            if (inactiveClients >= 3 && !alreadyNotified) {
                createNotification(
                    'risk',
                    'Muitos clientes inativos',
                    `Você tem ${inactiveClients} clientes inativos. Considere reativação.`,
                    'medium',
                    '/clients',
                    'Ver clientes'
                );
            }
        } catch (err) {
            console.error('Error checking risks:', err);
        }
    }, [clients, notifications, createNotification]);

    // Run all checks - SAFE
    const runAllChecks = useCallback(() => {
        try {
            checkDeadlines();
            checkFollowups();
            checkFinancials();
            checkRisks();
        } catch (err) {
            console.error('Error running notification checks:', err);
        }
    }, [checkDeadlines, checkFollowups, checkFinancials, checkRisks]);

    // Auto-check every 60 seconds
    useEffect(() => {
        runAllChecks();

        const interval = setInterval(() => {
            runAllChecks();
        }, 60000);

        return () => clearInterval(interval);
    }, [runAllChecks]);

    // Mark as read
    const markAsRead = useCallback((id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }, []);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    }, []);

    // Clear all
    const clearAll = useCallback(() => {
        setNotifications([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // Delete one
    const deleteNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        deleteNotification,
        createNotification
    };
}
