export type NotificationType =
    | 'deadline'
    | 'followup'
    | 'financial'
    | 'risk'
    | 'achievement'
    | 'suggestion';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    icon: string;
    priority: NotificationPriority;
    timestamp: Date;
    read: boolean;
    actionUrl?: string;
    actionLabel?: string;
}

export interface NotificationSettings {
    enabled: boolean;
    deadlineReminder: boolean;
    followupReminder: boolean;
    financialAlerts: boolean;
    achievements: boolean;
    aiSuggestions: boolean;
    checkInterval: number; // seconds
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    enabled: true,
    deadlineReminder: true,
    followupReminder: true,
    financialAlerts: true,
    achievements: true,
    aiSuggestions: true,
    checkInterval: 60
};
