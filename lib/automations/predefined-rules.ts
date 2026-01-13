import { Automation } from './types';

/**
 * Pre-defined automation rules ready to use
 */

export const PREDEFINED_AUTOMATIONS: Omit<Automation, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'runCount'>[] = [
    // 1. Follow-up Cliente Inativo
    {
        name: 'Follow-up Cliente Inativo',
        description: 'Cria uma task de follow-up para clientes sem contato há 7+ dias',
        enabled: false,
        category: 'client',
        trigger: {
            type: 'time',
            interval: 'daily'
        },
        conditions: [
            {
                field: 'lastContact',
                operator: 'olderThan',
                value: 7,
                unit: 'days'
            }
        ],
        actions: [
            {
                type: 'createTask',
                data: {
                    title: 'Follow-up: {name}',
                    description: 'Cliente sem contato há mais de 7 dias. Agendar reunião ou enviar mensagem.',
                    priority: 'high'
                }
            },
            {
                type: 'notify',
                title: 'Cliente Inativo',
                message: 'Cliente {name} está sem contato há 7 dias'
            }
        ]
    },

    // 2. Alerta Task Atrasada
    {
        name: 'Alerta Task Atrasada',
        description: 'Notifica quando uma task está atrasada',
        enabled: false,
        category: 'task',
        trigger: {
            type: 'time',
            interval: 'daily'
        },
        conditions: [
            {
                field: 'deadline',
                operator: 'olderThan',
                value: 0,
                unit: 'days'
            },
            {
                field: 'status',
                operator: 'notEquals',
                value: 'concluida'
            }
        ],
        actions: [
            {
                type: 'notify',
                title: '⚠️ Task Atrasada',
                message: 'A task "{title}" está atrasada!'
            }
        ]
    },

    // 3. Pipeline Parado
    {
        name: 'Pipeline Parado',
        description: 'Alerta quando um cliente fica muito tempo em negociação',
        enabled: false,
        category: 'client',
        trigger: {
            type: 'time',
            interval: 'daily'
        },
        conditions: [
            {
                field: 'stage',
                operator: 'equals',
                value: 'negociacao'
            },
            {
                field: 'stageUpdatedAt',
                operator: 'olderThan',
                value: 3,
                unit: 'days'
            }
        ],
        actions: [
            {
                type: 'notify',
                title: '🔔 Pipeline Parado',
                message: 'Cliente {name} está em negociação há 3+ dias'
            },
            {
                type: 'aiSuggest',
                context: 'pipeline_stuck'
            }
        ]
    },

    // 4. Cliente Novo
    {
        name: 'Onboarding Cliente Novo',
        description: 'Cria checklist de onboarding para clientes novos',
        enabled: false,
        category: 'client',
        trigger: {
            type: 'event',
            entity: 'client',
            event: 'create'
        },
        actions: [
            {
                type: 'createTask',
                data: {
                    title: 'Onboarding: {name}',
                    description: 'Checklist:\n- Reunião inicial\n- Briefing completo\n- Definir objetivos\n- Assinar contrato',
                    priority: 'high'
                }
            },
            {
                type: 'notify',
                title: '🎉 Novo Cliente',
                message: 'Cliente {name} cadastrado! Iniciar onboarding.'
            }
        ]
    },

    // 5. Pagamento Recebido
    {
        name: 'Atualizar Status Pós-Pagamento',
        description: 'Atualiza status do cliente após receber pagamento',
        enabled: false,
        category: 'financial',
        trigger: {
            type: 'event',
            entity: 'transaction',
            event: 'create'
        },
        conditions: [
            {
                field: 'type',
                operator: 'equals',
                value: 'entrada'
            }
        ],
        actions: [
            {
                type: 'updateField',
                entity: 'client',
                field: 'status',
                value: 'ativo'
            },
            {
                type: 'notify',
                title: '💰 Pagamento Recebido',
                message: 'Transação de {amount} recebida'
            }
        ]
    },

    // 6. Deadline Próximo
    {
        name: 'Lembrete de Deadline',
        description: 'Notifica 1 dia antes do deadline da task',
        enabled: false,
        category: 'task',
        trigger: {
            type: 'time',
            interval: 'daily'
        },
        conditions: [
            {
                field: 'deadline',
                operator: 'equals',
                value: 1 // tomorrow
            },
            {
                field: 'status',
                operator: 'notEquals',
                value: 'concluida'
            }
        ],
        actions: [
            {
                type: 'notify',
                title: '⏰ Deadline Amanhã',
                message: 'Task "{title}" vence amanhã!'
            }
        ]
    }
];

/**
 * Get automation by category
 */
export function getAutomationsByCategory(category: Automation['category']) {
    return PREDEFINED_AUTOMATIONS.filter(auto => auto.category === category);
}

/**
 * Create automation from predefined template
 */
export function createFromTemplate(templateName: string): Automation {
    const template = PREDEFINED_AUTOMATIONS.find(t => t.name === templateName);

    if (!template) {
        throw new Error(`Template "${templateName}" not found`);
    }

    return {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date(),
        runCount: 0
    };
}
