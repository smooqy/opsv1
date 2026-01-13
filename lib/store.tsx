"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, Task, PipelineStage, ProductionStage, Transaction } from './types';
import { supabase } from './supabaseClient';
import { validateClient, validateTask, validateTransaction, formatErrors } from './validation';
import { toast } from './toast';

interface AppContextType {
    clients: Client[];
    tasks: Task[];
    transactions: Transaction[];
    loading: boolean;
    tasksLoading: boolean;
    transactionsLoading: boolean;
    // Clients
    addClient: (client: Omit<Client, 'id'>) => Promise<void>;
    updateClient: (id: number, data: Partial<Client>) => Promise<void>;
    updateClientStage: (id: number, stage: PipelineStage) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
    refreshClients: () => Promise<void>;
    // Tasks
    addTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateTask: (id: string, data: Partial<Task>) => Promise<void>;
    updateTaskStage: (id: string, stage: ProductionStage) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    refreshTasks: () => Promise<void>;
    // Transactions
    addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
    updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    refreshTransactions: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [transactionsLoading, setTransactionsLoading] = useState(true);

    // ========== CLIENTS CRUD (Supabase) ==========
    const fetchClients = async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setClients(data as Client[]);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Erro ao carregar clientes');
        } finally {
            setLoading(false);
        }
    };

    const refreshClients = async () => {
        setLoading(true);
        await fetchClients();
    };

    const addClient = async (clientData: Omit<Client, 'id'>) => {
        try {
            // Validate input
            const validation = validateClient(clientData);
            if (!validation.isValid) {
                toast.error(formatErrors(validation.errors));
                return;
            }

            const { data, error } = await supabase
                .from('clients')
                .insert([{
                    responsible_name: clientData.responsible_name,
                    company_name: clientData.company_name,
                    whatsapp: clientData.whatsapp,
                    email: clientData.email || null,
                    project_scope: clientData.project_scope,
                    project_value: clientData.project_value,
                    monthly_value: clientData.monthly_value || 0,
                    start_date: clientData.start_date,
                    pipeline_stage: clientData.pipeline_stage,
                    production_stage: clientData.production_stage,
                    status: clientData.status || 'ativo'
                }])
                .select()
                .single();

            if (error) throw error;

            // Add credentials if provided
            if (data && clientData.access_creds) {
                const credPromises = Object.entries(clientData.access_creds).map(([platform, cred]) => {
                    if (cred && cred.u) {
                        return supabase.from('client_credentials').insert([{
                            client_id: data.id,
                            platform,
                            username: cred.u,
                            password: cred.p
                        }]);
                    }
                });
                await Promise.all(credPromises);
            }

            await fetchClients();
            toast.success('Cliente adicionado com sucesso!');
        } catch (error) {
            console.error('Error adding client:', error);
            toast.error('Erro ao adicionar cliente');
        }
    };

    const updateClientStage = async (id: number, stage: PipelineStage) => {
        try {
            const { error } = await supabase
                .from('clients')
                .update({ pipeline_stage: stage })
                .eq('id', id);

            if (error) throw error;

            setClients(prev => prev.map(c => c.id === id ? { ...c, pipeline_stage: stage } : c));
            toast.success('Stage atualizado!');
        } catch (error) {
            console.error('Error updating client stage:', error);
            toast.error('Erro ao atualizar stage');
        }
    };

    const deleteClient = async (id: number) => {
        try {
            // Confirmation prompt
            if (typeof window !== 'undefined') {
                const confirmed = window.confirm('Tem certeza que deseja deletar este cliente? Todas as tasks e transações relacionadas também serão removidas.');
                if (!confirmed) return;
            }

            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setClients(prev => prev.filter(c => c.id !== id));
            toast.success('Cliente deletado com sucesso!');
        } catch (error) {
            console.error('Error deleting client:', error);
            toast.error('Erro ao deletar cliente');
        }
    };

    const updateClient = async (id: number, data: Partial<Client>) => {
        try {
            const { error } = await supabase
                .from('clients')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            setClients(prev => prev.map(c =>
                c.id === id ? { ...c, ...data } : c
            ));
            toast.success('Cliente atualizado!');
        } catch (error) {
            console.error('Error updating client:', error);
            toast.error('Erro ao atualizar cliente');
        }
    };

    // ========== TASKS CRUD (Supabase - MIGRADO!) ==========
    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select(`
                    *,
                    clients (company_name)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const enrichedTasks = data.map(task => ({
                    ...task,
                    client_name: task.clients?.company_name || 'Cliente Desconhecido'
                }));
                setTasks(enrichedTasks as Task[]);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast.error('Erro ao carregar tasks');
        } finally {
            setTasksLoading(false);
        }
    };

    const refreshTasks = async () => {
        setTasksLoading(true);
        await fetchTasks();
    };

    const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            // Validate input
            const validation = validateTask(taskData);
            if (!validation.isValid) {
                toast.error(formatErrors(validation.errors));
                return;
            }

            const { error } = await supabase
                .from('tasks')
                .insert([{
                    title: taskData.title,
                    description: taskData.description,
                    type: taskData.type,
                    stage: taskData.stage,
                    client_id: taskData.client_id,
                    due_date: taskData.due_date
                }]);

            if (error) throw error;

            await fetchTasks();
            toast.success('Task criada com sucesso!');
        } catch (error) {
            console.error('Error adding task:', error);
            toast.error('Erro ao criar task');
        }
    };

    const updateTask = async (id: string, taskData: Partial<Task>) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .update(taskData)
                .eq('id', id);

            if (error) throw error;

            await fetchTasks();
            toast.success('Task atualizada!');
        } catch (error) {
            console.error('Error updating task:', error);
            toast.error('Erro ao atualizar task');
        }
    };

    const updateTaskStage = async (id: string, stage: ProductionStage) => {
        await updateTask(id, { stage });
    };

    const deleteTask = async (id: string) => {
        try {
            if (typeof window !== 'undefined') {
                const confirmed = window.confirm('Tem certeza que deseja deletar esta task?');
                if (!confirmed) return;
            }

            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setTasks(prev => prev.filter(t => t.id !== id));
            toast.success('Task deletada!');
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Erro ao deletar task');
        }
    };

    // ========== TRANSACTIONS CRUD (Supabase - MIGRADO!) ==========
    const fetchTransactions = async () => {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    *,
                    clients (company_name)
                `)
                .order('date', { ascending: false });

            if (error) throw error;

            if (data) {
                const enrichedTransactions = data.map(trans => ({
                    ...trans,
                    client_name: trans.clients?.company_name
                }));
                setTransactions(enrichedTransactions as Transaction[]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Erro ao carregar transações');
        } finally {
            setTransactionsLoading(false);
        }
    };

    const refreshTransactions = async () => {
        setTransactionsLoading(true);
        await fetchTransactions();
    };

    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            // Validate input
            const validation = validateTransaction(transactionData);
            if (!validation.isValid) {
                toast.error(formatErrors(validation.errors));
                return;
            }

            const { error } = await supabase
                .from('transactions')
                .insert([{
                    client_id: transactionData.client_id || null,
                    type: transactionData.type,
                    category: transactionData.category,
                    amount: transactionData.amount,
                    description: transactionData.description,
                    date: transactionData.date
                }]);

            if (error) throw error;

            await fetchTransactions();
            toast.success('Transação adicionada!');
        } catch (error) {
            console.error('Error adding transaction:', error);
            toast.error('Erro ao adicionar transação');
        }
    };

    const updateTransaction = async (id: string, transactionData: Partial<Transaction>) => {
        try {
            const { error } = await supabase
                .from('transactions')
                .update(transactionData)
                .eq('id', id);

            if (error) throw error;

            await fetchTransactions();
            toast.success('Transação atualizada!');
        } catch (error) {
            console.error('Error updating transaction:', error);
            toast.error('Erro ao atualizar transação');
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            if (typeof window !== 'undefined') {
                const confirmed = window.confirm('Tem certeza que deseja deletar esta transação?');
                if (!confirmed) return;
            }

            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setTransactions(prev => prev.filter(t => t.id !== id));
            toast.success('Transação deletada!');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error('Erro ao deletar transação');
        }
    };

    // ========== INITIAL DATA LOAD ==========
    useEffect(() => {
        fetchClients();
    }, []);

    // Load tasks and transactions after clients are loaded
    useEffect(() => {
        if (clients.length > 0 || !loading) {
            fetchTasks();
            fetchTransactions();
        }
    }, [clients.length > 0, loading]);

    return (
        <AppContext.Provider value={{
            clients,
            tasks,
            transactions,
            loading,
            tasksLoading,
            transactionsLoading,
            // Clients
            addClient,
            updateClient,
            updateClientStage,
            deleteClient,
            refreshClients,
            // Tasks
            addTask,
            updateTask,
            updateTaskStage,
            deleteTask,
            refreshTasks,
            // Transactions
            addTransaction,
            updateTransaction,
            deleteTransaction,
            refreshTransactions
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppStore() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppStore must be used within AppProvider");
    return context;
}
