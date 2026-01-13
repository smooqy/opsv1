"use client";
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/lib/store';
import { AuthProvider, useAuth } from '@/lib/auth';
import { NotificationProvider } from '@/lib/NotificationContext';
import { AIAssistant } from '@/components/AIAssistant';
import { GlobalSearch } from '@/components/GlobalSearch';
import { IOSInstallPrompt } from '@/components/IOSInstallPrompt';
import { PushNotificationPrompt } from '@/components/PushNotificationPrompt';
import { AutomationScheduler } from '@/components/AutomationScheduler';
import { Menu } from 'lucide-react';
import LoginPage from '@/components/LoginPage';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <meta name="theme-color" content="#8b5cf6" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="OPS Operation" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="icon" href="/icons/icon-192.png" />
                <link rel="apple-touch-icon" href="/icons/icon-180.png" />
            </head>
            <body className={inter.className}>
                <AuthProvider>
                    <AppProvider>
                        <NotificationProvider>
                            <LayoutContent>{children}</LayoutContent>
                        </NotificationProvider>
                    </AppProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    // Register Service Worker for PWA
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('✅ Service Worker registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        }
    }, []);

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-50">
            <Sidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

            {/* Mobile Header with Hamburger */}
            <div className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 z-30 flex items-center px-4 md:hidden">
                <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2 ml-3">
                    <img
                        src="/logo-icon.png"
                        alt="OPS Operation"
                        className="w-7 h-7 rounded-lg"
                    />
                    <h1 className="text-white font-bold text-sm">OPS Operation</h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 pt-14 md:pt-0 p-4 md:p-8 w-full min-h-screen overflow-x-hidden">
                {children}
            </main>

            <AIAssistant />
            <GlobalSearch />
            <IOSInstallPrompt />
            <PushNotificationPrompt />
            <AutomationScheduler />
        </div>
    );
}
