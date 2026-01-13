"use client";
import { useEffect } from 'react';
import { useAutomations } from '@/lib/useAutomations';
import { useAppStore } from '@/lib/store';

/**
 * Automation Scheduler Component
 * Runs automations periodically in the background
 */
export function AutomationScheduler() {
    const { getActiveAutomations, runAutomationsNow } = useAutomations();
    const { clients, tasks, transactions } = useAppStore();

    useEffect(() => {
        console.log('🤖 [Scheduler] Starting automation scheduler...');

        // Run automations every 5 minutes
        const interval = setInterval(async () => {
            const activeAutomations = getActiveAutomations();

            if (activeAutomations.length > 0) {
                console.log(`🔄 [Scheduler] Running ${activeAutomations.length} automations...`);

                try {
                    await runAutomationsNow({
                        clients,
                        tasks,
                        transactions,
                        user: {}
                    });

                    console.log('✅ [Scheduler] Automations completed');
                } catch (error) {
                    console.error('❌ [Scheduler] Error running automations:', error);
                }
            }
        }, 5 * 60 * 1000); // 5 minutes

        // Cleanup
        return () => {
            console.log('🛑 [Scheduler] Stopping automation scheduler');
            clearInterval(interval);
        };
    }, [clients, tasks, transactions, getActiveAutomations, runAutomationsNow]);

    return null; // This component doesn't render anything
}
