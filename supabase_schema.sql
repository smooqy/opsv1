-- ============================================
-- OPS OPERATION - SUPABASE DATABASE SCHEMA
-- ============================================
-- Execute este arquivo no Supabase SQL Editor
-- para criar as tabelas necessárias

-- ============================================
-- 1. TRANSACTIONS TABLE (Financial Dashboard)
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('receita', 'despesa')),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  client_id BIGINT REFERENCES clients(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON transactions(client_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. TASKS TABLE (Production Workflow)
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Arte', 'Tráfego', 'Web')),
  stage VARCHAR(50) NOT NULL CHECK (stage IN ('backlog', 'copy', 'design', 'approval', 'done')),
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_stage ON tasks(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_type ON tasks(type);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Trigger to update updated_at on tasks
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. SEED DATA (Optional - for testing)
-- ============================================

-- Sample transactions (uncomment to use)
/*
INSERT INTO transactions (type, category, amount, description, date) VALUES
  ('receita', 'servico', 5000.00, 'Projeto de Design - Cliente Exemplo', '2025-12-01'),
  ('receita', 'mensalidade', 1500.00, 'Mensalidade Beauty Spa', '2025-12-05'),
  ('despesa', 'marketing', 800.00, 'Facebook Ads - Dezembro', '2025-12-10'),
  ('despesa', 'despesa_operacional', 500.00, 'Ferramentas e Software', '2025-12-15'),
  ('receita', 'servico', 3000.00, 'Landing Page - Cliente X', '2026-01-05'),
  ('receita', 'mensalidade', 1500.00, 'Mensalidade Beauty Spa', '2026-01-05');
*/

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Uncomment if you want to enable RLS for multi-user support
/*
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users
CREATE POLICY "Allow all for authenticated users" ON transactions
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users" ON tasks
  FOR ALL USING (auth.role() = 'authenticated');
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify tables were created successfully:

-- SELECT * FROM transactions;
-- SELECT * FROM tasks;
-- SELECT COUNT(*) FROM transactions;
-- SELECT COUNT(*) FROM tasks;
