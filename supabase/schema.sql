-- =========================================
-- ITALIANTO DIALOGUE STUDIO - Schema SQL
-- Ejecutar en Supabase SQL Editor
-- =========================================

-- Tabla de usuarios (sincronizada con Clerk vía webhook)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,                          -- Clerk user ID
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de suscripciones
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,                          -- Stripe subscription ID
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,                         -- active | canceled | past_due | trialing
  price_id TEXT NOT NULL,                       -- Stripe price ID
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de diálogos generados (historial)
CREATE TABLE IF NOT EXISTS public.dialogues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  output_text TEXT,
  output_type TEXT NOT NULL CHECK (output_type IN ('written', 'audio')),
  source_language TEXT NOT NULL DEFAULT 'es',
  characters JSONB,                             -- [{name, gender, voice_id}]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_dialogues_user_id ON public.dialogues(user_id);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dialogues ENABLE ROW LEVEL SECURITY;

-- Policies: solo el service role puede escribir (desde los webhooks)
-- Los usuarios pueden leer sus propios datos via API autenticada
CREATE POLICY "Service role full access users" ON public.users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access subscriptions" ON public.subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access dialogues" ON public.dialogues
  FOR ALL USING (auth.role() = 'service_role');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =========================================
-- MIGRACIÓN: Multi-plan pricing (2026-03)
-- Ejecutar en Supabase SQL Editor si no se ha aplicado aún
-- =========================================

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'basic'
    CHECK (plan_type IN ('basic', 'standard', 'pro')),
  ADD COLUMN IF NOT EXISTS dialogues_used_this_month INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS audio_used_this_month INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usage_reset_at TIMESTAMPTZ DEFAULT NOW();

-- Función RPC para incrementar uso de forma atómica
CREATE OR REPLACE FUNCTION increment_usage(p_user_id TEXT, p_type TEXT)
RETURNS VOID AS $func$
BEGIN
  UPDATE public.subscriptions
  SET
    dialogues_used_this_month = CASE WHEN p_type = 'dialogue'
      THEN dialogues_used_this_month + 1 ELSE dialogues_used_this_month END,
    audio_used_this_month = CASE WHEN p_type = 'audio'
      THEN audio_used_this_month + 1 ELSE audio_used_this_month END
  WHERE user_id = p_user_id AND status IN ('active', 'trialing');
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
