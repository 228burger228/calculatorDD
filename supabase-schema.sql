-- =========================================================================
-- Supabase Schema for AI Pricing Calculator (Dmitry & Dima Studio v4.0)
-- =========================================================================

-- 1. Projects and Estimates Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent_to_client', 'negotiation', 'approved', 'in_development', 'completed')),
    parameters JSONB NOT NULL,
    result JSONB NOT NULL,
    quote_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick sorting and client lookups
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON public.projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_client_name ON public.projects(client_name);

-- 2. Custom Studio Pricing Settings Table
CREATE TABLE IF NOT EXISTS public.pricing_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    config JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
    ON public.projects FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own pricing settings"
    ON public.pricing_settings FOR ALL
    USING (auth.uid() = user_id);
