"use client";
import { useState } from 'react';
import { useAuth, COLLABORATORS } from '@/lib/auth';

export default function LoginPage() {
    const [selectedEmail, setSelectedEmail] = useState('');
    const [localLoading, setLocalLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmail) {
            alert('Selecione um usuário');
            return;
        }
        setLocalLoading(true);
        try {
            await login(selectedEmail);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleQuickLogin = async (email: string) => {
        setLocalLoading(true);
        try {
            await login(email);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header with LARGE Logo */}
                <div className="text-center mb-8">
                    <img
                        src="/logo-full.png"
                        alt="OPS Operation"
                        className="h-24 w-auto mx-auto mb-8"
                    />
                    <p className="text-slate-500 text-sm">Selecione seu usuário</p>
                </div>

                {/* Quick Login Buttons */}
                <div className="space-y-3">
                    {COLLABORATORS.map((collab) => (
                        <button
                            key={collab.email}
                            type="button"
                            onClick={() => handleQuickLogin(collab.email)}
                            disabled={localLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-600/50 rounded-xl px-6 py-4 text-left transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-violet-600/10 rounded-full flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
                                    <span className="text-xl font-bold text-violet-400">
                                        {collab.username.charAt(0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-white group-hover:text-violet-300 transition-colors">
                                        {collab.username}
                                    </p>
                                    <p className="text-xs text-slate-500">{collab.email}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-600 mt-8">
                    Ops Operation v2.0 - Powered by Supabase
                </p>
            </div>
        </div>
    );
}
