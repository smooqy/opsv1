# Guia de Setup - Migração Supabase

## 🎯 Objetivo
Migrar localStorage para Supabase para acesso multi-dispositivo.

## 📝 Passo a Passo

### 1. Executar Schema no Supabase

1. Acesse seu projeto Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** (menu lateral)
3. Clique em **New Query**
4. Cole todo o conteúdo do arquivo [`supabase_migration_schema.sql`](file:///c:/Users/nipobsw/Desktop/Ops%20Operation/supabase_migration_schema.sql)
5. Clique em **Run** (ou Ctrl+Enter)
6. Verifique se não há erros

### 2. Criar Usuários Iniciais

**Opção A: Via Dashboard** (Recomendado para teste)
1. Vá em **Authentication** → **Users**
2. Clique **Add User**
3. Crie 3 usuários:
   - Email: `luis@opsoperation.com`, Password: temporária (ou use magic link)
   - Email: `gui@opsoperation.com`
   - Email: `jp@opsoperation.com`

**Opção B: Configurar Magic Link**
1. **Authentication** → **Email Templates**
2. Habilitar **Confirm signup** e **Magic Link**
3. Usuários receberão email para login (sem senha)

### 3. Atualizar Usernames

Depois de criar os usuários, execute no SQL Editor:

```sql
-- Encontrar IDs dos usuários
SELECT id, email FROM auth.users;

-- Atualizar usernames (substitua os IDs)
UPDATE profiles SET username = 'Luis' WHERE id = 'uuid-do-luis';
UPDATE profiles SET username = 'Gui' WHERE id = 'uuid-do-gui';
UPDATE profiles SET username = 'JP' WHERE id = 'uuid-do-jp';
```

### 4. Configurar Variáveis de Ambiente

Crie/atualize `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-key

# Gemini (já existe)
GEMINI_API_KEY=sua-chave-gemini
```

**Onde encontrar**:
- Supabase Dashboard → **Settings** → **API**
- Copie `URL` e `anon public`

### 5. Instalar Dependências

```bash
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
```

### 6. Testar Schema

Execute no SQL Editor:

```sql
-- Ver tabelas criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Ver policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Inserir task de teste
INSERT INTO routine_tasks (title, priority, status, task_date)
VALUES ('Teste', 'media', 'todo', CURRENT_DATE);

-- Ver task criada
SELECT * FROM routine_tasks;
```

## ✅ Checklist

- [ ] Schema executado sem erros
- [ ] Tabela `profiles` criada
- [ ] Tabela `routine_tasks` criada
- [ ] RLS habilitado em todas as tabelas
- [ ] 3 usuários criados (Luis, Gui, JP)
- [ ] Usernames atualizados
- [ ] `.env.local` configurado
- [ ] Dependências instaladas
- [ ] Teste de insert funcionou

## 🚨 Troubleshooting

**Erro: relation already exists**
- A tabela já existe, pode ignorar ou usar `DROP TABLE` antes

**Erro: permission denied**
- Verifique se está usando a key correta (service_role para admin)

**RLS bloqueando acesso**
- Certifique-se de estar autenticado ao testar

## 📚 Próximo Passo

Após completar este setup:
1. Atualizar código para usar Supabase
2. Testar autenticação
3. Migrar dados do localStorage (opcional)
