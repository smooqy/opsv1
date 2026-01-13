"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    user: UserProfile | null;
    profile: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string) => Promise<void>;
    logout: () => void;
}

interface UserProfile {
    id: string;
    email: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const COLLABORATORS = [
    { email: 'luissantunes031@gmail.com', username: 'Luis' },
    { email: 'guiferreirahosken13@gmail.com', username: 'Gui' },
    { email: 'jotawxw@gmail.com', username: 'JP' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in (localStorage)
    useEffect(() => {
        if (typeof window === 'undefined') {
            setIsLoading(false);
            return;
        }

        const storedUser = localStorage.getItem('ops_current_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem('ops_current_user');
            }
        }
        setIsLoading(false);
    }, []);

    // Simple localStorage-only login
    const login = async (email: string) => {
        console.log('🔐 Login com email:', email);

        try {
            const collaborator = COLLABORATORS.find(c => c.email === email);

            if (!collaborator) {
                throw new Error('Email não encontrado');
            }

            const userProfile: UserProfile = {
                id: `user-${Date.now()}`,
                email: email,
                username: collaborator.username,
                display_name: collaborator.username
            };

            console.log('✅ Login bem-sucedido:', userProfile);

            // Salvar no localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem('ops_current_user', JSON.stringify(userProfile));
            }
            setUser(userProfile);

        } catch (error) {
            console.error('❌ Erro ao fazer login:', error);
            throw error;
        }
    };

    // Logout
    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ops_current_user');
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile: user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
