import { Condition, OperatorType, ExecutionContext } from './types';

/**
 * Evaluate a single condition against a data object
 */
export function evaluateCondition(
    condition: Condition,
    data: any,
    context: ExecutionContext
): boolean {
    const { field, operator, value, unit } = condition;

    // Get field value from data
    const fieldValue = getNestedValue(data, field);

    if (fieldValue === undefined) {
        return false;
    }

    switch (operator) {
        case 'equals':
            return fieldValue === value;

        case 'notEquals':
            return fieldValue !== value;

        case 'greaterThan':
            return Number(fieldValue) > Number(value);

        case 'lessThan':
            return Number(fieldValue) < Number(value);

        case 'contains':
            return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());

        case 'olderThan':
            return isOlderThan(fieldValue, value, unit || 'days');

        default:
            return false;
    }
}

/**
 * Evaluate all conditions (AND logic)
 */
export function evaluateConditions(
    conditions: Condition[] | undefined,
    data: any,
    context: ExecutionContext
): boolean {
    if (!conditions || conditions.length === 0) {
        return true; // No conditions = always true
    }

    return conditions.every(condition =>
        evaluateCondition(condition, data, context)
    );
}

/**
 * Get nested value from object using dot notation
 * Example: getNestedValue(obj, 'client.name')
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Check if a date is older than X units
 */
function isOlderThan(dateValue: any, amount: number, unit: 'days' | 'hours' | 'minutes'): boolean {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
        return false;
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();

    let threshold = 0;
    switch (unit) {
        case 'days':
            threshold = amount * 24 * 60 * 60 * 1000;
            break;
        case 'hours':
            threshold = amount * 60 * 60 * 1000;
            break;
        case 'minutes':
            threshold = amount * 60 * 1000;
            break;
    }

    return diff > threshold;
}

/**
 * Replace template variables in string
 * Example: "Task: {task.title}" -> "Task: Design Logo"
 */
export function replaceVariables(template: string, data: any): string {
    return template.replace(/\{([^}]+)\}/g, (match, path) => {
        const value = getNestedValue(data, path);
        return value !== undefined ? String(value) : match;
    });
}
