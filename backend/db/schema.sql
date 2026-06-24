-- ============================================================
-- AI 윤리 플랫폼 Supabase 테이블 스키마
-- Supabase 대시보드 > SQL Editor에서 실행하세요
-- ============================================================

-- 1. users 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',  -- 'user' | 'expert' | 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. diagnosis_results 테이블
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  diagnosis_type TEXT NOT NULL,  -- 'free' | 'paid1' | 'paid2' | 'paid3'
  score INTEGER,
  total INTEGER,
  percentage INTEGER,
  grade TEXT,
  axis_scores JSONB,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_diagnosis_user_id ON diagnosis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_created_at ON diagnosis_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnosis_type ON diagnosis_results(diagnosis_type);
