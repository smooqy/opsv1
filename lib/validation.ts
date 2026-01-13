// Validation helpers for OPS Operation

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

// ========== EMAIL VALIDATION ==========
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ========== PHONE VALIDATION ==========
export function isValidPhone(phone: string): boolean {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    // Brazilian phone: 10-11 digits
    return cleaned.length >= 10 && cleaned.length <= 11;
}

// ========== CLIENT VALIDATION ==========
export function validateClient(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Nome obrigatório (min 3 chars)
    if (!data.responsible_name || data.responsible_name.trim().length < 3) {
        errors.push({
            field: 'responsible_name',
            message: 'Nome deve ter pelo menos 3 caracteres'
        });
    }

    // Company name obrigatório
    if (!data.company_name || data.company_name.trim().length < 2) {
        errors.push({
            field: 'company_name',
            message: 'Nome da empresa é obrigatório'
        });
    }

    // WhatsApp obrigatório e válido
    if (!data.whatsapp) {
        errors.push({
            field: 'whatsapp',
            message: 'WhatsApp é obrigatório'
        });
    } else if (!isValidPhone(data.whatsapp)) {
        errors.push({
            field: 'whatsapp',
            message: 'WhatsApp inválido (use apenas números)'
        });
    }

    // Email opcional mas deve ser válido
    if (data.email && !isValidEmail(data.email)) {
        errors.push({
            field: 'email',
            message: 'Email inválido'
        });
    }

    // Valores numéricos devem ser positivos
    if (data.project_value && data.project_value < 0) {
        errors.push({
            field: 'project_value',
            message: 'Valor do projeto deve ser positivo'
        });
    }

    if (data.monthly_value && data.monthly_value < 0) {
        errors.push({
            field: 'monthly_value',
            message: 'Valor mensal deve ser positivo'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// ========== TASK VALIDATION ==========
export function validateTask(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Título obrigatório (min 3 chars)
    if (!data.title || data.title.trim().length < 3) {
        errors.push({
            field: 'title',
            message: 'Título deve ter pelo menos 3 caracteres'
        });
    }

    // Cliente obrigatório
    if (!data.client_id) {
        errors.push({
            field: 'client_id',
            message: 'Cliente é obrigatório'
        });
    }

    // Deadline deve ser data válida e futura (opcional)
    if (data.deadline) {
        const deadline = new Date(data.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(deadline.getTime())) {
            errors.push({
                field: 'deadline',
                message: 'Data inválida'
            });
        }
    }

    // Stage válido
    const validStages = ['a_fazer', 'fazendo', 'concluido'];
    if (data.stage && !validStages.includes(data.stage)) {
        errors.push({
            field: 'stage',
            message: 'Stage inválido'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// ========== TRANSACTION VALIDATION ==========
export function validateTransaction(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Amount obrigatório e > 0
    if (!data.amount || data.amount <= 0) {
        errors.push({
            field: 'amount',
            message: 'Valor deve ser maior que zero'
        });
    }

    // Description obrigatória
    if (!data.description || data.description.trim().length < 3) {
        errors.push({
            field: 'description',
            message: 'Descrição deve ter pelo menos 3 caracteres'
        });
    }

    // Tipo válido
    if (!data.type || !['receita', 'despesa'].includes(data.type)) {
        errors.push({
            field: 'type',
            message: 'Tipo deve ser "receita" ou "despesa"'
        });
    }

    // Data válida e não futura
    if (data.date) {
        const transactionDate = new Date(data.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (isNaN(transactionDate.getTime())) {
            errors.push({
                field: 'date',
                message: 'Data inválida'
            });
        } else if (transactionDate > today) {
            errors.push({
                field: 'date',
                message: 'Data não pode ser futura'
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// ========== FORMAT ERROR MESSAGES ==========
export function formatErrors(errors: ValidationError[]): string {
    return errors.map(e => `${e.field}: ${e.message}`).join('\n');
}
