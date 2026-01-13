import { Client, Task } from './types';

export const initialClients: Client[] = [
    {
        id: 1,
        responsible_name: 'Ana Silva',
        company_name: 'Beauty Spa',
        whatsapp: '11999998888',
        access_creds: { instagram: { u: 'beautyspa', p: 'pass123' } },
        project_scope: 'Social Media Management',
        project_value: 1500.00,
        start_date: '2024-01-10',
        pipeline_stage: 'active',
        production_stage: 'backlog'
    },
    {
        id: 2,
        responsible_name: 'Carlos Oliveira',
        company_name: 'Tech Solutions',
        whatsapp: '11988887777',
        access_creds: {},
        project_scope: 'Website Redesign',
        project_value: 5000.00,
        start_date: '2024-01-15',
        pipeline_stage: 'negotiation',
        production_stage: 'backlog'
    },
    {
        id: 3,
        responsible_name: 'Mariana Costa',
        company_name: 'Doces Gourmet',
        whatsapp: '11977776666',
        access_creds: {},
        project_scope: 'Branding',
        project_value: 2500.00,
        start_date: '2024-01-20',
        pipeline_stage: 'new',
        production_stage: 'backlog'
    }
];

export const initialTasks: Task[] = [
    { id: 't1', title: 'Carrossel: 5 Dicas de Pele', type: 'Arte', stage: 'design', client_id: 1, client_name: 'Beauty Spa' },
    { id: 't2', title: 'Setup Google Ads', type: 'Tráfego', stage: 'backlog', client_id: 2, client_name: 'Tech Solutions' },
    { id: 't3', title: 'Copy LP Vendas', type: 'Web', stage: 'copy', client_id: 2, client_name: 'Tech Solutions' },
    { id: 't4', title: 'Reels Bastidores', type: 'Arte', stage: 'approval', client_id: 1, client_name: 'Beauty Spa' },
];
