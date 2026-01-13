import { Automation, ExecutionContext, AutomationLog } from './types';
import { evaluateConditions } from './conditions';
import { executeActions } from './actions';

/**
 * Main Automation Engine
 * Runs automations and executes actions when conditions are met
 */

/**
 * Run a single automation
 */
export async function runAutomation(
    automation: Automation,
    context: ExecutionContext
): Promise<AutomationLog> {
    const log: AutomationLog = {
        id: Date.now().toString(),
        automationId: automation.id,
        executedAt: new Date(),
        success: false
    };

    try {
        console.log(`🤖 [Engine] Running automation: ${automation.name}`);

        // Check if automation is enabled
        if (!automation.enabled) {
            log.error = 'Automation is disabled';
            console.log('⏸️  [Engine] Automation disabled, skipping');
            return log;
        }

        // Get relevant data based on trigger
        const dataToCheck = getDataForTrigger(automation, context);

        // Process each item
        let actionsExecuted = 0;

        for (const item of dataToCheck) {
            // Evaluate conditions
            const conditionsMet = evaluateConditions(automation.conditions, item, context);

            if (conditionsMet) {
                console.log(`✅ [Engine] Conditions met for:`, item);

                // Execute actions
                const result = await executeActions(automation.actions, item, context);

                if (result.success) {
                    actionsExecuted++;
                } else {
                    console.error('❌ [Engine] Action errors:', result.errors);
                }
            }
        }

        log.success = true;
        log.result = {
            itemsChecked: dataToCheck.length,
            actionsExecuted
        };

        console.log(`✅ [Engine] Automation completed: ${actionsExecuted} actions executed`);

    } catch (error: any) {
        log.error = error.message;
        console.error('❌ [Engine] Automation error:', error);
    }

    return log;
}

/**
 * Run all enabled automations
 */
export async function runAllAutomations(
    automations: Automation[],
    context: ExecutionContext
): Promise<AutomationLog[]> {
    console.log(`🚀 [Engine] Running ${automations.length} automations`);

    const logs: AutomationLog[] = [];

    for (const automation of automations) {
        if (automation.enabled) {
            const log = await runAutomation(automation, context);
            logs.push(log);
        }
    }

    console.log(`✅ [Engine] All automations completed`);
    return logs;
}

/**
 * Get data to check based on trigger type
 */
function getDataForTrigger(automation: Automation, context: ExecutionContext): any[] {
    const { trigger } = automation;

    switch (trigger.type) {
        case 'time':
        case 'condition':
            // Check all clients by default (can be customized)
            return context.clients || [];

        case 'event':
            // For events, specific entity
            switch (trigger.entity) {
                case 'client':
                    return context.clients || [];
                case 'task':
                    return context.tasks || [];
                case 'transaction':
                    return context.transactions || [];
                default:
                    return [];
            }

        default:
            return [];
    }
}

/**
 * Check if automation should run based on trigger
 */
export function shouldRunAutomation(automation: Automation): boolean {
    const { trigger } = automation;

    // For now, we'll run all time-based triggers
    // In production, check lastRun and interval
    if (trigger.type === 'time') {
        return true;
    }

    // Event-based triggers are handled separately
    return false;
}
