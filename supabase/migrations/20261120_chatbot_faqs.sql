-- =============================================================================
-- Migration: Josan Logistics Chatbot FAQ & Unanswered Inquiries Tables
-- =============================================================================

-- 1. Table for structured manual FAQ knowledge base
CREATE TABLE IF NOT EXISTS public.chatbot_faqs (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(64) NOT NULL DEFAULT 'General',
  main_question TEXT NOT NULL,
  alternative_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  approved_answer TEXT NOT NULL,
  has_quote_action BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_active ON public.chatbot_faqs (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_chatbot_faqs_category ON public.chatbot_faqs (category);

-- 2. Table for privacy-conscious unanswered question logging
CREATE TABLE IF NOT EXISTS public.chatbot_unanswered_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_question TEXT NOT NULL,
  normalized_question TEXT NOT NULL,
  confidence_score NUMERIC(4,3) NOT NULL DEFAULT 0,
  closest_faq_id VARCHAR(64),
  session_id VARCHAR(128),
  ip_hash VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_unanswered_logs_created ON public.chatbot_unanswered_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_unanswered_logs_status ON public.chatbot_unanswered_logs (status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.chatbot_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_unanswered_logs ENABLE ROW LEVEL SECURITY;

-- Public can read active FAQs
DROP POLICY IF EXISTS "public read active faqs" ON public.chatbot_faqs;
CREATE POLICY "public read active faqs" ON public.chatbot_faqs
  FOR SELECT USING (is_active = true);

-- Staff / Admin can read all FAQs and manage them
DROP POLICY IF EXISTS "staff manage faqs" ON public.chatbot_faqs;
CREATE POLICY "staff manage faqs" ON public.chatbot_faqs
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- Public can insert unanswered logs
DROP POLICY IF EXISTS "public insert unanswered logs" ON public.chatbot_unanswered_logs;
CREATE POLICY "public insert unanswered logs" ON public.chatbot_unanswered_logs
  FOR INSERT WITH CHECK (true);

-- Staff can read and manage unanswered logs
DROP POLICY IF EXISTS "staff manage unanswered logs" ON public.chatbot_unanswered_logs;
CREATE POLICY "staff manage unanswered logs" ON public.chatbot_unanswered_logs
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());
