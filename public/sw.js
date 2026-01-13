// OPS Operation - Service Worker
// Version 1.0.0

const CACHE_NAME = 'ops-operation-v1';
const RUNTIME_CACHE = 'ops-runtime-v1';

// Assets to cache on install
const PRECACHE_URLS = [
    '/',
    '/dashboard',
    '/clients',
    '/production',
    '/offline.html'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Precaching core assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network First, Cache Fallback strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    // Skip API calls (always network)
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    event.respondWith(
        caches.open(RUNTIME_CACHE).then((cache) => {
            return fetch(request)
                .then((response) => {
                    // Cache successful responses
                    if (response.status === 200) {
                        cache.put(request, response.clone());
                    }
                    return response;
                })
                .catch(() => {
                    // Network failed, try cache
                    return cache.match(request).then((cached) => {
                        if (cached) {
                            console.log('[SW] Serving from cache:', request.url);
                            return cached;
                        }

                        // Show offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return cache.match('/offline.html');
                        }

                        return new Response('Offline', { status: 503 });
                    });
                });
        })
    );
});

// Push Notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');

    let data = {
        title: 'OPS Operation',
        message: 'Nova notificação',
        url: '/'
    };

    // Parse push data if available
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.message = event.data.text();
        }
    }

    const options = {
        body: data.message || data.body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now()
        },
        actions: [
            { action: 'open', title: 'Abrir', icon: '/icons/icon-192.png' },
            { action: 'close', title: 'Fechar' }
        ],
        tag: data.tag || 'ops-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'OPS Operation', options)
    );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Open or focus app window
    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open
                for (const client of clientList) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

// Background sync (future enhancement)
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);
    // Can be used for offline data sync later
});

