"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    CheckSquare,
    Palette,
    DollarSign,
    LogOut,
    Lightbulb,
    User,
    Wand2,
    Zap
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { NotificationBell } from './NotificationBell';

const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Clientes', path: '/clients', icon: Users },
    { name: 'Rotina', path: '/routine', icon: CheckSquare },
    { name: 'Produção', path: '/production', icon: Palette },
    { name: 'Financeiro', path: '/financial', icon: DollarSign },
    { name: 'Estratégia IA', path: '/strategy', icon: Lightbulb },
    { name: 'Content Studio', path: '/content-studio', icon: Wand2 },
    { name: 'Automações', path: '/automations', icon: Zap },
];

interface SidebarProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { profile, logout } = useAuth();

    const handleLogout = () => {
        if (confirm('Deseja realmente sair?')) {
            logout();
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                {/* Header with LARGE Logo + Notification Bell */}
                <div className="p-6 pb-4 border-b border-slate-900">
                    <img
                        src="/logo-full.png"
                        alt="OPS Operation"
                        className="h-14 w-full object-contain mb-4"
                    />
                    <div className="flex justify-start pl-1">
                        <NotificationBell />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? "bg-violet-600/10 text-violet-400 border border-violet-600/20"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? "text-violet-400" : "text-slate-500"} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer - User Card */}
                <div className="p-4 border-t border-slate-900 space-y-2">
                    {/* Current User */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-violet-600/10 border border-violet-600/20 rounded-lg flex items-center justify-center">
                                <User className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{profile?.username || 'User'}</p>
                                <p className="text-xs text-slate-500">Colaborador</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors w-full text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </aside>
        </>
    );
}
