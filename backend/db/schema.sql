-- ============================================================
-- AI 윤리 플랫폼 Supabase 테이블 스키마
-- Supabase 대시보드 > SQL Editor에서 실행하세요
-- ============================================================

-- 1. users 테이블
-- Required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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

-- ============================================================
-- Exam registration platform tables
-- 접수 화면에서 제출된 전체 신청 정보를 저장합니다.
-- Supabase SQL Editor에서 이 파일을 다시 실행하면 테이블이 생성됩니다.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS exam_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_no TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  applicant_name TEXT NOT NULL,
  applicant_birthdate DATE,
  applicant_phone TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_address TEXT,
  photo_file_name TEXT,

  application_type TEXT DEFAULT 'individual' CHECK (application_type IN ('individual', 'group')),
  group_info JSONB DEFAULT '{}'::jsonb,

  exam_type TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  subject_id TEXT,
  subject_name TEXT,
  grade_id TEXT,
  grade_name TEXT,
  schedule_id TEXT,
  schedule_snapshot JSONB DEFAULT '{}'::jsonb,

  add_ons JSONB DEFAULT '[]'::jsonb,
  payment_method TEXT,
  base_amount INTEGER DEFAULT 0,
  add_on_amount INTEGER DEFAULT 0,
  total_amount INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),

  application_status TEXT DEFAULT 'submitted' CHECK (application_status IN ('draft', 'submitted', 'confirmed', 'cancelled')),
  ticket_status TEXT DEFAULT 'ready' CHECK (ticket_status IN ('before', 'ready', 'issued', 'cancelled')),
  terms_agreed BOOLEAN DEFAULT false,
  notify_agreed BOOLEAN DEFAULT false,

  raw_payload JSONB DEFAULT '{}'::jsonb,
  admin_memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_applications_created_at ON exam_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exam_applications_user_id ON exam_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_applications_exam_type ON exam_applications(exam_type);
CREATE INDEX IF NOT EXISTS idx_exam_applications_status ON exam_applications(application_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_exam_applications_applicant_email ON exam_applications(applicant_email);
CREATE INDEX IF NOT EXISTS idx_exam_applications_applicant_phone ON exam_applications(applicant_phone);

-- ============================================================
-- [확장] 신청서(HD) 신규 필드 — 엑셀 DB설계 누락분 반영
-- 기존 테이블이 있어도 안전하게 컬럼만 추가합니다.
-- ============================================================
ALTER TABLE exam_applications
  ADD COLUMN IF NOT EXISTS applicant_nationality   TEXT,                       -- 국적
  ADD COLUMN IF NOT EXISTS applicant_address_detail TEXT,                      -- 주소 상세
  ADD COLUMN IF NOT EXISTS emergency_contact       TEXT,                       -- 긴급 연락처
  ADD COLUMN IF NOT EXISTS round_name              TEXT,                       -- 차수 (26년 2차)
  ADD COLUMN IF NOT EXISTS reception_type          TEXT,                       -- 접수 구분 (정시/수시/업체)
  ADD COLUMN IF NOT EXISTS feedback_option         BOOLEAN DEFAULT false,      -- 개별 피드백 신청
  ADD COLUMN IF NOT EXISTS cert_requested          BOOLEAN DEFAULT false,      -- 자격증 발급 신청
  ADD COLUMN IF NOT EXISTS cert_type               TEXT,                       -- 자격증/카드/원본대조필/봉사확인서
  ADD COLUMN IF NOT EXISTS cert_amount             INTEGER DEFAULT 0,          -- 자격증 금액
  ADD COLUMN IF NOT EXISTS discount_amount         INTEGER DEFAULT 0,          -- 쿠폰+포인트 할인 합계
  ADD COLUMN IF NOT EXISTS point_used              INTEGER DEFAULT 0,          -- 포인트 사용액
  ADD COLUMN IF NOT EXISTS coupon_code             TEXT,                       -- 적용 쿠폰 코드
  ADD COLUMN IF NOT EXISTS privacy_agreed          BOOLEAN DEFAULT false,      -- 개인정보 수집·이용 동의
  ADD COLUMN IF NOT EXISTS refund_agreed           BOOLEAN DEFAULT false;      -- 환불 규정 동의

-- 단체 접수 기업/구성원 정보는 group_info(JSONB)에 저장:
--   { company_name, business_no, manager_name, manager_phone, member_count, members:[], tax_invoice }

-- ============================================================
-- [참고] 전체 플랫폼 테이블(37개) 설계는 DB_DESIGN.md 참조.
-- 1단계에서는 접수/관리자 화면이 사용하는 exam_applications만 실제 운영합니다.
-- 추후 단계에서 exams/payments/certificates 등을 점진적으로 추가합니다.
-- ============================================================

-- ============================================================
-- 관리자 계정 시드
--   이메일   : admin@naver.com
--   비밀번호 : admin1234   (bcrypt 12라운드 해시 — 로그인 후 반드시 변경 권장)
--   재실행해도 안전한 UPSERT. 이미 있으면 role=admin 으로 승격.
-- ============================================================
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@naver.com',
  '$2a$12$xad7eCcR3MocknMSW5JJZe4UTY0x59x1zpIssymzCWyXa.WejSdMS',
  '휴텍씨 관리자',
  'admin'
)
ON CONFLICT (email) DO UPDATE
  SET role = 'admin',
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name;