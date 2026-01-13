// Automation Types and Interfaces

export type TriggerType = 'time' | 'event' | 'condition';
export type ActionType = 'createTask' | 'notify' | 'updateField' | 'aiSuggest';
export type TimeInterval = 'daily' | 'weekly' | 'monthly';
export type EntityType = 'client' | 'task' | 'transaction';
export type EventType = 'create' | 'update' | 'delete';
export type OperatorType = 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'olderThan' | 'contains';

// Trigger Configurations
export interface TimeTriggerConfig {
    type: 'time';
    interval: TimeInterval;
    time?: string; // HH:MM format
}

export interface EventTriggerConfig {
    type: 'event';
    entity: EntityType;
    event: EventType;
}

export interface ConditionTriggerConfig {
    type: 'condition';
    entity: EntityType;
    field: string;
    operator: OperatorType;
    value: any;
}

export type TriggerConfig = TimeTriggerConfig | EventTriggerConfig | ConditionTriggerConfig;

// Condition
export interface Condition {
    field: string;
    operator: OperatorType;
    value: any;
    unit?: 'days' | 'hours' | 'minutes';
}

// Actions
export interface CreateTaskAction {
    type: 'createTask';
    data: {
        title: string;
        description?: string;
        priority?: 'low' | 'medium' | 'high';
        stage?: string;
    };
}

export interface NotifyAction {
    type: 'notify';
    message: string;
    title?: string;
    users?: string[];
}

export interface UpdateFieldAction {
    type: 'updateField';
    entity: EntityType;
    field: string;
    value: any;
}

export interface AISuggestAction {
    type: 'aiSuggest';
    context: string;
}

export type Action = CreateTaskAction | NotifyAction | UpdateFieldAction | AISuggestAction;

// Main Automation Interface
export interface Automation {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    trigger: TriggerConfig;
    conditions?: Condition[];
    actions: Action[];
    createdAt: Date;
    updatedAt?: Date;
    lastRun?: Date;
    runCount: number;
    category?: 'client' | 'task' | 'financial' | 'custom';
}

// Execution Log
export interface AutomationLog {
    id: string;
    automationId: string;
    executedAt: Date;
    success: boolean;
    result?: any;
    error?: string;
}

// Execution Context (data available during execution)
export interface ExecutionContext {
    clients: any[];
    tasks: any[];
    transactions: any[];
    user: any;
}

// AI Suggestion
export interface AutomationSuggestion {
    id: string;
    pattern: string;
    description: string;
    confidence: number; // 0-100
    suggestedAutomation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'runCount'>;
    examples: string[];
}
