import { Action, CreateTaskAction, NotifyAction, UpdateFieldAction, AISuggestAction, ExecutionContext } from './types';
import { replaceVariables } from './conditions';
import { sendLocalPushNotification, getPermissionStatus } from '@/lib/notifications/push';

/**
 * Execute a single action
 */
export async function executeAction(
    action: Action,
    data: any,
    context: ExecutionContext
): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
        switch (action.type) {
            case 'createTask':
                return await executeCreateTask(action, data, context);

            case 'notify':
                return await executeNotify(action, data, context);

            case 'updateField':
                return await executeUpdateField(action, data, context);

            case 'aiSuggest':
                return await executeAISuggest(action, data, context);

            default:
                return { success: false, error: 'Unknown action type' };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Execute multiple actions sequentially
 */
export async function executeActions(
    actions: Action[],
    data: any,
    context: ExecutionContext
): Promise<{ success: boolean; results: any[]; errors: string[] }> {
    const results: any[] = [];
    const errors: string[] = [];

    for (const action of actions) {
        const result = await executeAction(action, data, context);
        results.push(result);

        if (!result.success) {
            errors.push(result.error || 'Unknown error');
        }
    }

    return {
        success: errors.length === 0,
        results,
        errors
    };
}

// ========== Action Implementations ==========

async function executeCreateTask(
    action: CreateTaskAction,
    data: any,
    context: ExecutionContext
): Promise<{ success: boolean; result?: any }> {
    const { title, description, priority, stage } = action.data;

    const newTask = {
        id: Date.now(),
        title: replaceVariables(title, data),
        description: description ? replaceVariables(description, data) : '',
        priority: priority || 'medium',
        stage: stage || 'To Do',
        status: 'pending',
        createdAt: new Date(),
        automated: true
    };

    // In real app, this would call the store or API
    console.log('✅ [Automation] Created task:', newTask);

    return {
        success: true,
        result: newTask
    };
}

async function executeNotify(
    action: NotifyAction,
    data: any,
    context: ExecutionContext
): Promise<{ success: boolean; result?: any }> {
    const message = replaceVariables(action.message, data);
    const title = action.title ? replaceVariables(action.title, data) : 'Automação';

    // 1. Create in-app notification
    const notification = {
        id: Date.now().toString(),
        type: 'automation' as const,
        title,
        message,
        timestamp: new Date(),
        read: false
    };

    console.log('🔔 [Automation] Notification:', notification);

    // 2. Send push notification (NEW!)
    const canPush = typeof window !== 'undefined' && getPermissionStatus() === 'granted';

    if (canPush) {
        try {
            await sendLocalPushNotification(title, message, '/automations');
            console.log('📱 [Automation] Push notification sent!');
        } catch (error) {
            console.error('❌ [Automation] Push notification failed:', error);
        }
    }

    return {
        success: true,
        result: notification
    };
}

async function executeUpdateField(
    action: UpdateFieldAction,
    data: any,
    context: ExecutionContext
): Promise<{ success: boolean; result?: any }> {
    const { entity, field, value } = action;

    console.log(`🔄 [Automation] Update ${entity}.${field} = ${value}`);

    // In real app, this would update Supabase
    return {
        success: true,
        result: { entity, field, value }
    };
}

async function executeAISuggest(
    action: AISuggestAction,
    data: any,
    context: ExecutionContext
): Promise<{ success: boolean; result?: any }> {
    const { context: suggestionContext } = action;

    console.log('💡 [Automation] AI Suggestion for context:', suggestionContext);

    // In real app, this would call Gemini API
    const suggestion = {
        context: suggestionContext,
        suggestion: 'AI suggestion would appear here',
        confidence: 85
    };

    return {
        success: true,
        result: suggestion
    };
}
