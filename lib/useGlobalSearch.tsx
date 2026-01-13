"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from './store';

export interface SearchResult {
    type: 'client' | 'task' | 'transaction' | 'action';
    id: string | number;
    title: string;
    subtitle?: string;
    icon: string;
    url?: string;
    score: number;
    action?: () => void;
}

export function useGlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { clients, tasks, transactions } = useAppStore();
    const router = useRouter();

    // Keyboard shortcut: Cmd+K or Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Open search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setQuery('');
                setSelectedIndex(0);
            }

            // Close search
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setQuery('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Calculate score for fuzzy matching
    const calculateScore = useCallback((text: string, searchQuery: string): number => {
        if (!text || !searchQuery) return 0;

        const lowerText = text.toLowerCase();
        const lowerQuery = searchQuery.toLowerCase();

        // Exact match
        if (lowerText === lowerQuery) return 100;

        // Starts with
        if (lowerText.startsWith(lowerQuery)) return 80;

        // Contains
        if (lowerText.includes(lowerQuery)) return 50;

        // Fuzzy match (each letter appears in order)
        let textIndex = 0;
        let queryIndex = 0;
        while (textIndex < lowerText.length && queryIndex < lowerQuery.length) {
            if (lowerText[textIndex] === lowerQuery[queryIndex]) {
                queryIndex++;
            }
            textIndex++;
        }
        if (queryIndex === lowerQuery.length) return 30;

        return 0;
    }, []);

    // Search in all data
    const results = useMemo(() => {
        if (!query.trim()) {
            // Show quick actions when empty
            return [
                {
                    type: 'action' as const,
                    id: 'new-client',
                    title: 'Novo Cliente',
                    subtitle: 'Criar novo cliente',
                    icon: '👥',
                    score: 100,
                    action: () => {
                        setIsOpen(false);
                        // TODO: Open new client modal
                        router.push('/clients');
                    }
                },
                {
                    type: 'action' as const,
                    id: 'new-task',
                    title: 'Nova Task',
                    subtitle: 'Criar nova task',
                    icon: '✅',
                    score: 99,
                    action: () => {
                        setIsOpen(false);
                        router.push('/production');
                    }
                },
                {
                    type: 'action' as const,
                    id: 'new-transaction',
                    title: 'Nova Transação',
                    subtitle: 'Adicionar receita ou despesa',
                    icon: '💰',
                    score: 98,
                    action: () => {
                        setIsOpen(false);
                        router.push('/financial');
                    }
                }
            ];
        }

        const allResults: SearchResult[] = [];

        // Search clients
        clients.forEach(client => {
            const nameScore = calculateScore(client.company_name || '', query);
            const respScore = calculateScore(client.responsible_name || '', query);
            const score = Math.max(nameScore, respScore);

            if (score > 0) {
                allResults.push({
                    type: 'client',
                    id: client.id,
                    title: client.company_name || 'Sem nome',
                    subtitle: client.responsible_name || '',
                    icon: '👥',
                    url: `/clients?id=${client.id}`,
                    score
                });
            }
        });

        // Search tasks
        tasks.forEach(task => {
            const titleScore = calculateScore(task.title || '', query);
            const descScore = calculateScore(task.description || '', query);
            const score = Math.max(titleScore, descScore);

            if (score > 0) {
                allResults.push({
                    type: 'task',
                    id: task.id,
                    title: task.title || 'Sem título',
                    subtitle: task.client_name || '',
                    icon: '✅',
                    url: `/production?id=${task.id}`,
                    score
                });
            }
        });

        // Search transactions
        transactions.forEach(transaction => {
            const descScore = calculateScore(transaction.description || '', query);
            const amountStr = transaction.amount?.toString() || '';
            const amountScore = calculateScore(amountStr, query);
            const score = Math.max(descScore, amountScore);

            if (score > 0) {
                allResults.push({
                    type: 'transaction',
                    id: transaction.id,
                    title: transaction.description || 'Sem descrição',
                    subtitle: `R$ ${transaction.amount?.toFixed(2)} - ${transaction.type}`,
                    icon: '💰',
                    url: `/financial`,
                    score
                });
            }
        });

        // Sort by score (highest first)
        return allResults.sort((a, b) => b.score - a.score).slice(0, 20); // Limit to 20 results
    }, [query, clients, tasks, transactions, calculateScore, router]);

    // Group results by type
    const groupedResults = useMemo(() => {
        const groups: Record<string, SearchResult[]> = {
            clients: [],
            tasks: [],
            transactions: [],
            actions: []
        };

        results.forEach(result => {
            groups[result.type === 'client' ? 'clients' :
                result.type === 'task' ? 'tasks' :
                    result.type === 'transaction' ? 'transactions' : 'actions'].push(result);
        });

        return groups;
    }, [results]);

    // Navigate to selected result
    const selectResult = useCallback((result: SearchResult) => {
        if (result.action) {
            result.action();
        } else if (result.url) {
            router.push(result.url);
            setIsOpen(false);
            setQuery('');
        }
    }, [router]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            e.preventDefault();
            selectResult(results[selectedIndex]);
        }
    }, [isOpen, results, selectedIndex, selectResult]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Reset selected index when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    return {
        isOpen,
        setIsOpen,
        query,
        setQuery,
        results,
        groupedResults,
        selectedIndex,
        selectResult
    };
}
