export type PipelineStage = 'new' | 'negotiation' | 'contract' | 'onboarding' | 'active';

export type ProductionStage = 'backlog' | 'copy' | 'design' | 'approval' | 'done';

export type TaskType = 'Arte' | 'Tráfego' | 'Web';

export type TransactionType = 'receita' | 'despesa';

export type TransactionCategory = 'servico' | 'mensalidade' | 'despesa_operacional' | 'marketing' | 'investimento' | 'outro';

export interface Credentials {
    u: string;
    p: string;
}

export interface ClientAccess {
    instagram?: Credentials;
    facebook?: Credentials;
    gmail?: Credentials;
    [key: string]: Credentials | undefined;
}

export interface Client {
    id: number;
    responsible_name: string;
    company_name: string;
    whatsapp: string;
    email?: string;
    access_creds: ClientAccess;
    project_scope: string;
    project_value: number;
    monthly_value?: number;
    start_date: string; // YYYY-MM-DD
    pipeline_stage: PipelineStage;
    status?: string;
    production_stage: ProductionStage;
    priority?: 'low' | 'medium' | 'high'; // Azul, Amarelo, Vermelho
    // Brand Identity (NEW!)
    brand_colors?: string[]; // Array de cores HEX: ["#FF5733", "#C70039"]
    visual_style?: string; // Ex: "minimalista", "moderno", "vintage"
    logo_url?: string; // URL do logo
    brand_keywords?: string[]; // Tags da marca: ["tech", "inovação", "sustentável"]
    created_at?: string;
}

export interface Task {
    id: string; // UUID from Supabase
    title: string;
    description?: string; // Added description field
    type: TaskType;
    stage: ProductionStage;
    client_id: number;
    client_name?: string; // Made optional, will be fetched from client
    due_date?: string; // Added due date field (YYYY-MM-DD)
    created_at?: string;
    updated_at?: string;
}

export interface Transaction {
    id: string; // UUID from Supabase
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string; // YYYY-MM-DD
    client_id?: number; // Optional, link to client
    client_name?: string; // For display purposes
    created_at?: string;
    updated_at?: string;
}
