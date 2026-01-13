// Push Notifications Library for OPS Operation

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 */
export function getPermissionStatus(): NotificationPermissionStatus {
    if (!isNotificationSupported()) {
        return 'denied';
    }
    return Notification.permission;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!isNotificationSupported()) {
        console.warn('[Push] Notifications not supported');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    try {
        const permission = await Notification.requestPermission();
        console.log('[Push] Permission result:', permission);
        return permission === 'granted';
    } catch (error) {
        console.error('[Push] Error requesting permission:', error);
        return false;
    }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (!isNotificationSupported()) {
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        // Check if already subscribed
        let subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            console.log('[Push] Already subscribed');
            return subscription;
        }

        // Subscribe (userVisibleOnly is required)
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true
        });

        console.log('[Push] New subscription created');

        // Save subscription to localStorage
        localStorage.setItem('push_subscription', JSON.stringify(subscription.toJSON()));

        return subscription;
    } catch (error) {
        console.error('[Push] Error subscribing:', error);
        return null;
    }
}

/**
 * Get current push subscription
 */
export async function getSubscription(): Promise<PushSubscription | null> {
    if (!isNotificationSupported()) {
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    } catch (error) {
        console.error('[Push] Error getting subscription:', error);
        return null;
    }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
    try {
        const subscription = await getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            localStorage.removeItem('push_subscription');
            console.log('[Push] Unsubscribed successfully');
            return true;
        }
        return false;
    } catch (error) {
        console.error('[Push] Error unsubscribing:', error);
        return false;
    }
}

/**
 * Send a local push notification (via Service Worker)
 * This doesn't require a backend server
 */
export async function sendLocalPushNotification(
    title: string,
    message: string,
    url?: string
): Promise<boolean> {
    if (!isNotificationSupported()) {
        console.warn('[Push] Notifications not supported');
        return false;
    }

    if (Notification.permission !== 'granted') {
        console.warn('[Push] Permission not granted');
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification(title, {
            body: message,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            vibrate: [200, 100, 200],
            data: {
                url: url || '/'
            },
            actions: [
                { action: 'open', title: 'Abrir' },
                { action: 'close', title: 'Fechar' }
            ],
            tag: 'ops-local-' + Date.now(),
            requireInteraction: false
        } as any);

        console.log('[Push] Local notification sent:', title);
        return true;
    } catch (error) {
        console.error('[Push] Error sending local notification:', error);
        return false;
    }
}

/**
 * Send a test notification
 */
export async function sendTestNotification(): Promise<boolean> {
    return sendLocalPushNotification(
        '🎉 Notificações Ativadas!',
        'Você receberá alertas das automações aqui.',
        '/'
    );
}

/**
 * Initialize push notifications
 * Call this on app start
 */
export async function initializePushNotifications(): Promise<{
    supported: boolean;
    permission: NotificationPermissionStatus;
    subscribed: boolean;
}> {
    const supported = isNotificationSupported();
    const permission = getPermissionStatus();
    const subscription = await getSubscription();

    return {
        supported,
        permission,
        subscribed: !!subscription
    };
}
