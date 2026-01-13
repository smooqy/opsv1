"use client";
import { createContext, useContext, ReactNode } from 'react';
import { useNotifications } from './useNotifications';

interface NotificationContextType {
    notifications: any[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    deleteNotification: (id: string) => void;
    createNotification: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const notificationData = useNotifications();

    return (
        <NotificationContext.Provider value={notificationData}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return context;
}
