"use client";
import { useState, useEffect, useCallback } from 'react';
import { Automation, ExecutionContext, AutomationLog } from './automations/types';
import { runAutomation, runAllAutomations } from './automations/engine';
import { PREDEFINED_AUTOMATIONS, createFromTemplate } from './automations/predefined-rules';

const STORAGE_KEY = 'ops_automations';
const LOGS_KEY = 'ops_automation_logs';

export function useAutomations() {
    const [automations, setAutomations] = useState<Automation[]>([]);
    const [logs, setLogs] = useState<AutomationLog[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    // Load automations from localStorage
    useEffect(() => {
        if (typeof window === 'undefined') return; // Browser only

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setAutomations(parsed.map((a: any) => ({
                    ...a,
                    createdAt: new Date(a.createdAt),
                    updatedAt: a.updatedAt ? new Date(a.updatedAt) : undefined,
                    lastRun: a.lastRun ? new Date(a.lastRun) : undefined
                })));
            } catch (error) {
                console.error('Error loading automations:', error);
            }
        }
    }, []);

    // Save automations to localStorage
    const saveAutomations = useCallback((newAutomations: Automation[]) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newAutomations));
        }
        setAutomations(newAutomations);
    }, []);

    // Create automation
    const createAutomation = useCallback((automation: Omit<Automation, 'id' | 'createdAt' | 'runCount'>) => {
        const newAutomation: Automation = {
            ...automation,
            id: Date.now().toString(),
            createdAt: new Date(),
            runCount: 0
        };

        saveAutomations([...automations, newAutomation]);
        return newAutomation;
    }, [automations, saveAutomations]);

    // Update automation
    const updateAutomation = useCallback((id: string, updates: Partial<Automation>) => {
        const updated = automations.map(a =>
            a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
        );
        saveAutomations(updated);
    }, [automations, saveAutomations]);

    // Delete automation
    const deleteAutomation = useCallback((id: string) => {
        saveAutomations(automations.filter(a => a.id !== id));
    }, [automations, saveAutomations]);

    // Toggle automation
    const toggleAutomation = useCallback((id: string) => {
        updateAutomation(id, {
            enabled: !automations.find(a => a.id === id)?.enabled
        });
    }, [automations, updateAutomation]);

    // Activate predefined rule
    const activatePredefined = useCallback((templateName: string) => {
        const automation = createFromTemplate(templateName);
        automation.enabled = true;
        saveAutomations([...automations, automation]);
        return automation;
    }, [automations, saveAutomations]);

    // Run automations
    const runAutomationsNow = useCallback(async (context: ExecutionContext) => {
        setIsRunning(true);

        try {
            const newLogs = await runAllAutomations(automations, context);

            // Update lastRun and runCount
            const updated = automations.map(a => {
                const log = newLogs.find(l => l.automationId === a.id);
                if (log) {
                    return {
                        ...a,
                        lastRun: log.executedAt,
                        runCount: a.runCount + 1
                    };
                }
                return a;
            });

            saveAutomations(updated);
            setLogs([...newLogs, ...logs].slice(0, 100)); // Keep last 100 logs

            return newLogs;
        } finally {
            setIsRunning(false);
        }
    }, [automations, logs, saveAutomations]);

    // Get predefined templates
    const getPredefinedRules = useCallback(() => {
        return PREDEFINED_AUTOMATIONS;
    }, []);

    // Get active automations
    const getActiveAutomations = useCallback(() => {
        return automations.filter(a => a.enabled);
    }, [automations]);

    return {
        automations,
        logs,
        isRunning,
        createAutomation,
        updateAutomation,
        deleteAutomation,
        toggleAutomation,
        activatePredefined,
        runAutomationsNow,
        getPredefinedRules,
        getActiveAutomations
    };
}
