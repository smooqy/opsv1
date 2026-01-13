-- =====================================================
-- OPS OPERATION - COMPLETE SUPABASE SCHEMA
-- Migration from localStorage to Supabase
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- Extends Supabase Auth users with custom fields
-- =====================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles são visíveis para todos autenticados" 
  ON profiles FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users podem atualizar próprio perfil" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- 2. ROUTINE TASKS TABLE
-- Kanban diário de tarefas
-- =====================================================

CREATE TABLE routine_tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  client_id BIGINT REFERENCES clients(id),
  priority TEXT CHECK (priority IN ('baixa', 'media', 'alta')) DEFAULT 'media',
  status TEXT CHECK (status IN ('todo', 'doing', 'done')) DEFAULT 'todo',
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_routine_tasks_date ON routine_tasks(task_date);
CREATE INDEX idx_routine_tasks_assigned ON routine_tasks(assigned_to);
CREATE INDEX idx_routine_tasks_status ON routine_tasks(status);
CREATE INDEX idx_routine_tasks_created ON routine_tasks(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_routine_tasks_updated_at 
  BEFORE UPDATE ON routine_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE routine_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados veem todas as routine tasks" 
  ON routine_tasks FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados criam routine tasks" 
  ON routine_tasks FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados atualizam routine tasks" 
  ON routine_tasks FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados deletam routine tasks" 
  ON routine_tasks FOR DELETE 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. TRANSACTIONS TABLE (Atualização)
-- Adicionar RLS se não existir
-- =====================================================

-- Verificar se já existe e adicionar RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes se houver conflito
DROP POLICY IF EXISTS "Usuários autenticados veem transactions" ON transactions;
DROP POLICY IF EXISTS "Usuários autenticados criam transactions" ON transactions;
DROP POLICY IF EXISTS "Usuários autenticados atualizam transactions" ON transactions;
DROP POLICY IF EXISTS "Usuários autenticados deletam transactions" ON transactions;

-- Criar políticas
CREATE POLICY "Usuários autenticados veem transactions" 
  ON transactions FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados criam transactions" 
  ON transactions FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados atualizam transactions" 
  ON transactions FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados deletam transactions" 
  ON transactions FOR DELETE 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. TASKS TABLE (Produção - Atualização)
-- Adicionar RLS se não existir
-- =====================================================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes se houver conflito
DROP POLICY IF EXISTS "Usuários autenticados veem tasks" ON tasks;
DROP POLICY IF EXISTS "Usuários autenticados gerenciam tasks" ON tasks;

-- Criar políticas
CREATE POLICY "Usuários autenticados veem tasks" 
  ON tasks FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados gerenciam tasks" 
  ON tasks FOR ALL 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. CLIENTS TABLE (Atualização)
-- Adicionar RLS se não existir
-- =====================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes se houver conflito
DROP POLICY IF EXISTS "Usuários autenticados veem clients" ON clients;
DROP POLICY IF EXISTS "Usuários autenticados gerenciam clients" ON clients;

-- Criar políticas
CREATE POLICY "Usuários autenticados veem clients" 
  ON clients FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados gerenciam clients" 
  ON clients FOR ALL 
  USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. FUNÇÃO HELPER - Criar Profile Automaticamente
-- Quando um novo user é criado via Auth
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar profile automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 7. VIEWS ÚTEIS
-- =====================================================

-- View: Routine tasks com informações completas
CREATE OR REPLACE VIEW routine_tasks_full AS
SELECT 
  rt.*,
  p.username as assigned_to_name,
  c.company_name as client_name,
  creator.username as created_by_name
FROM routine_tasks rt
LEFT JOIN profiles p ON rt.assigned_to = p.id
LEFT JOIN clients c ON rt.client_id = c.id
LEFT JOIN profiles creator ON rt.created_by = creator.id;

-- =====================================================
-- 8. INSERIR USUÁRIOS INICIAIS (EXEMPLO)
-- Execute isso DEPOIS de criar os usuários via Supabase Auth
-- =====================================================

-- NOTA: Os usuários devem ser criados primeiro via:
-- 1. Supabase Dashboard → Authentication → Add User
-- 2. Ou via magic link / sign up
-- 
-- Depois execute:
-- UPDATE profiles SET username = 'Luis' WHERE email = 'luis@opsoperation.com';
-- UPDATE profiles SET username = 'Gui' WHERE email = 'gui@opsoperation.com';
-- UPDATE profiles SET username = 'JP' WHERE email = 'jp@opsoperation.com';

-- =====================================================
-- VERIFICAÇÕES
-- =====================================================

-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'routine_tasks', 'transactions', 'tasks', 'clients');

-- Verificar RLS está ativo
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'routine_tasks', 'transactions', 'tasks', 'clients');

-- Verificar políticas
SELECT tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public';
