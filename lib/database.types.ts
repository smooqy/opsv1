export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    username: string
                    display_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    username: string
                    display_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    display_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            routine_tasks: {
                Row: {
                    id: number
                    title: string
                    assigned_to: string | null
                    client_id: number | null
                    priority: 'baixa' | 'media' | 'alta'
                    status: 'todo' | 'doing' | 'done'
                    task_date: string
                    created_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    title: string
                    assigned_to?: string | null
                    client_id?: number | null
                    priority?: 'baixa' | 'media' | 'alta'
                    status?: 'todo' | 'doing' | 'done'
                    task_date?: string
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    title?: string
                    assigned_to?: string | null
                    client_id?: number | null
                    priority?: 'baixa' | 'media' | 'alta'
                    status?: 'todo' | 'doing' | 'done'
                    task_date?: string
                    created_by?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            clients: {
                Row: {
                    id: number
                    company_name: string
                    responsible_name: string
                    email: string
                    phone: string | null
                    website: string | null
                    niche: string | null
                    goal: string | null
                    media_inventory: string | null
                    pipeline_stage: string
                    project_value: number
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    company_name: string
                    responsible_name: string
                    email: string
                    phone?: string | null
                    website?: string | null
                    niche?: string | null
                    goal?: string | null
                    media_inventory?: string | null
                    pipeline_stage?: string
                    project_value?: number
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    company_name?: string
                    responsible_name?: string
                    email?: string
                    phone?: string | null
                    website?: string | null
                    niche?: string | null
                    goal?: string | null
                    media_inventory?: string | null
                    pipeline_stage?: string
                    project_value?: number
                    status?: string
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: number
                    title: string
                    description: string | null
                    type: string
                    stage: string
                    client_id: number | null
                    due_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    title: string
                    description?: string | null
                    type: string
                    stage?: string
                    client_id?: number | null
                    due_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    title?: string
                    description?: string | null
                    type?: string
                    stage?: string
                    client_id?: number | null
                    due_date?: string | null
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: number
                    type: string
                    category: string
                    amount: number
                    date: string
                    client_id: number | null
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    type: string
                    category: string
                    amount: number
                    date: string
                    client_id?: number | null
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    type?: string
                    category?: string
                    amount?: number
                    date?: string
                    client_id?: number | null
                    description?: string | null
                    created_at?: string
                }
            }
        }
    }
}
