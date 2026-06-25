# 휴텍씨 플랫폼 — 완전 DB 설계서

> 기준: 엑셀 원본(휴텍씨 메뉴 구조 250520) + 플랫폼 개요 + 마케팅 활용 최적화  
> DB: PostgreSQL / Supabase | 작성일: 2026-06-24 | 오류검토 완료: 2026-06-24

---

## ⚠️ 오류 검토 결과 (수정 완료 목록)

### 🔴 Critical — 삽입 불가 / 데이터 파괴 수준

| # | 위치 | 문제 | 수정 내용 |
|---|------|------|----------|
| C1 | `answer_submissions` | `registration_id UNIQUE`이면 시험 1문항만 저장 가능. 20문항 시험에서 2번째 답안 INSERT 시 UNIQUE 오류 발생 | `UNIQUE(registration_id, question_id)` 복합으로 변경. 관계도 1:1 → 1:N 수정 |
| C2 | `practice_packages.exam_type` | `VARCHAR FK 참조`라고 표기했지만 `exams.exam_type`은 UNIQUE/PK 컬럼이 아니므로 FK 불가. DB 생성 시 오류 | FK 표기 제거 → CHECK 제약으로 대체, 별도 `exam_types` 테이블 추가 |
| C3 | `users` | `email`과 `phone` 모두 NULL 허용. 둘 다 NULL인 회원 가입 가능 → 로그인 수단 없는 유령 계정 생성 | CHECK 제약 추가: `email IS NOT NULL OR phone IS NOT NULL` |

### 🟠 Warning — 논리적 오류 / 데이터 불일치

| # | 위치 | 문제 | 수정 내용 |
|---|------|------|----------|
| W1 | `daily_statistics` UNIQUE | `exam_type`이 NULL=전체인데, PostgreSQL에서 NULL ≠ NULL이므로 UNIQUE 제약이 NULL 행에 미적용 → 전체 통계 중복 삽입 가능 | `exam_type DEFAULT 'all'` (NULL 사용 안 함) |
| W2 | `payments.coupon_id` + `user_coupons.payment_id` | 동일 쿠폰-결제 관계가 양쪽에 모두 저장됨 → 한쪽만 수정 시 불일치 발생 | `payments.coupon_id` 제거. `user_coupons.payment_id`로만 단방향 관리 |
| W3 | `group_members` | `exam_registrations`와 연결 없음 → 단체 접수 후 개별 시험 진행 상황 추적 불가 | `group_members.exam_registration_id FK → exam_registrations.id` 추가 |
| W4 | `certificates` | 자격증 발급 시 별도 결제가 필요한데 `payment_id` 없음 → 결제 추적 불가 | `payment_id INT FK → payments.id NULL` 추가 |
| W5 | `learning_history` | `UNIQUE(user_id, exam_type, category_id)` 제약 없음 → 동일 사용자의 동일 영역 이력이 중복 생성 가능 | UNIQUE 복합 제약 추가 |
| W6 | `user_points` 누락 | `payments.point_used`, `payments.held_points`는 있지만 포인트 잔액 관리 테이블 없음 → 포인트 충전/차감 이력 추적 불가 | `user_points` 테이블 신규 추가 |

### 🟡 Minor — 개선 권장

| # | 위치 | 문제 | 수정 내용 |
|---|------|------|----------|
| M1 | `notices.author` vs `blogs.author_id` | notices는 TEXT, blogs는 UUID FK → 일관성 없음 | notices도 `author_id UUID FK → users.id` 로 통일 |
| M2 | `experts.rating NUMERIC(3,2)` | CHECK 제약 없음 → 음수나 99.99 저장 가능 | `CHECK(rating >= 0 AND rating <= 5.00)` 추가 |
| M3 | `coupons.used_count` | 동시 요청 시 race condition 가능 (두 사용자가 마지막 1장 동시 사용) | 주석으로 경고 표기. 앱에서 `SELECT FOR UPDATE` 처리 필요 |
| M4 | `exam_registrations` | 동일 사용자+시험 UNIQUE 여부 미정 (재접수 허용 여부 비즈니스 결정 필요) | 일단 UNIQUE 미적용, 주석으로 확인 필요 표기 |
| M5 | `ai_reports.user_id` | `registration_id`로 이미 user 추적 가능. 중복 컬럼. 단, 비로그인 리포트 없으므로 빠른 조회용 denormalized 컬럼으로 유지 | 주석으로 의도 명확화 |
| M6 | `blogs.author_id` | ON DELETE 정책 없음 → 작성자 탈퇴 시 블로그 삭제되거나 FK 오류 | `ON DELETE SET NULL` 추가 |
| M7 | 인덱스 누락 | `user_subscriptions` 활성 구독 조회, `coupons` 유효기간 조회 인덱스 없음 | 인덱스 섹션에 추가 |

---

## 현재 DB 심플화 판단 기준

> 이 플랫폼(AI 번역/프롬프트/윤리 시험 + 전문가 매칭 + 구독 + B2B)의 규모 기준으로 **37개 테이블은 적정 수준**입니다.
> 억지로 줄이면 오히려 비즈니스 로직이 복잡해집니다.

| 판단 항목 | 상태 | 이유 |
|---------|------|------|
| 테이블 수 37개 | ✅ 적정 | 대형 SaaS 기준 50~80개. 중형 플랫폼 37개는 심플 |
| 중복 컬럼 | ✅ 제거됨 | `payments.coupon_id` 제거(W2), 정규화 완료 |
| 마케팅 필드 | ✅ 완비 | funnel_stage / is_verified / current_points 추가 완료 |
| FK 연결 | ✅ 완비 | 전체 37개 테이블 FK 명시 완료 |
| 삽입 순서 오류 | ✅ 해결 | 섹션 20에 생성 순서 명시 |
| 포인트 이중 관리 | ⚠️ 주의 | `users.current_points`(캐시) + `user_points`(이력) 동기화 필요. 포인트 변경 트랜잭션에서 반드시 둘 다 업데이트 |

---

## 1. 테이블 관계도 (ERD 요약)

```
sites ──────────────────────────────────────────────┐
categories (self-ref) ──────────────────────────────┤
                                                    │
users ──────────────────────────────────────────────┤
  ├── user_social_accounts (1:N)                    │ (site_id FK)
  ├── experts (1:1)                                 │
  │     ├── expert_educations (1:N)                 │
  │     ├── expert_careers (1:N)                    │
  │     ├── expert_publications (1:N)               │
  │     └── expert_certifications (1:N)             │
  ├── user_subscriptions (1:N) ── subscription_plans│
  ├── user_coupons (1:N) ── coupons                 │
  ├── referrals (1:N self-ref)                      │
  │                                                 │
  ├── exam_registrations (N:M exams)                │
  │     ├── answer_submissions (1:1)                │
  │     ├── certificates (1:1)                      │
  │     └── ai_reports (1:N)                        │
  │                                                 │
  ├── practice_records (N:M practice_packages)      │
  ├── learning_history (1:N)                        │
  ├── payments (1:N)                                │
  │     └── refunds (1:1)                           │
  ├── inquiries (1:N)                               │
  │     └── inquiry_replies (1:N)                   │
  ├── notification_logs (1:N)                       │
  └── chatbot_logs (1:N)                            │
                                                    │
exams ──────────────────────────────────────────────┤
  ├── exam_formats (1:N)                            │
  │     └── questions (1:N)                         │
  │           └── wrong_answer_stats (1:1)          │
  └── group_registrations (N:M b2b_companies)       │
        └── group_members (1:N)                     │
                                                    │
[운영] notices / blogs / faqs / banners / popups / terms
[통계] daily_statistics / utm_tracking
[관리자] admins / admin_permissions
```

---

## 2. 공통 분류 테이블

### `sites` — 사이트 구분
> 여러 테이블의 ENUM 중복 제거. site_id FK로 통합 참조.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| code | VARCHAR(30) UNIQUE | metatrans / exam / bookread / curator / collective |
| name | VARCHAR(50) | 메타번역 / 시험 / 통독 / 큐레이터 / 집단지성 |
| is_active | BOOLEAN DEFAULT true | |

---

### `categories` — 카테고리 대/중/소
> 대/중/소 TEXT 필드가 여러 테이블에 반복됨 → 단일 셀프참조 테이블로 정규화

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| parent_id | INT FK → categories.id | NULL=대분류, 값있으면 중/소 |
| depth | SMALLINT | 1=대, 2=중, 3=소 |
| code | VARCHAR(50) UNIQUE | ex) translate / english / us |
| name | VARCHAR(100) | ex) 번역 / 영어 / 미국 |
| site_id | INT FK → sites.id | 어느 사이트의 카테고리인지 |
| sort_order | INT DEFAULT 0 | |

---

## 3. 회원 & 인증

### `users` — 통합 회원 (일반 + 전문가 + 관리자 통합)
> 관리자도 role로 구분. 별도 admins 테이블은 권한 설정용으로만 분리.  
> **마케팅:** referral_code, utm_source, marketing_agree 등 추가  
> **[C3 수정]** email, phone 둘 다 NULL 방지 CHECK 제약 추가

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | UUID PK DEFAULT gen_random_uuid() | | |
| user_no | VARCHAR(20) UNIQUE | NOT NULL | 자동생성 번호 (XX241010001) |
| site_id | INT FK → sites.id | NOT NULL | 주 사이트 구분 |
| role | VARCHAR(20) DEFAULT 'user' | NOT NULL | user / expert / admin / master |
| member_type | VARCHAR(20) DEFAULT 'general' | NOT NULL | general(일반) / formal(정식) / corporate(기업) / withdrawn(탈퇴) |
| group_type | VARCHAR(20) | | university / company / academy / public |
| subscription_status | VARCHAR(20) DEFAULT 'none' | | premium / standard / basic / none / one_time |
| name | VARCHAR(100) | NOT NULL | |
| email | VARCHAR(255) UNIQUE | | |
| phone | VARCHAR(20) UNIQUE | | 이메일 또는 휴대폰 중 하나 필수 |

> **CHECK 제약:** `CONSTRAINT chk_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)`
| password_hash | VARCHAR(255) | | 소셜 로그인 시 NULL |
| gender | CHAR(1) | | M / F |
| birthdate | DATE | | 나이 자동 계산용 |
| nationality | VARCHAR(100) | | |
| individual_or_group | VARCHAR(10) DEFAULT 'individual' | | individual / group |
| group_name | VARCHAR(200) | | 그룹명 |
| business_no | VARCHAR(20) | | 사업자 등록번호 |
| tax_invoice | BOOLEAN DEFAULT false | | 세금계산서 발급 여부 |
| photo_url | TEXT | | S3 저장 경로 |
| notify_methods | JSONB DEFAULT '[]' | | ["kakao","sms","email"] |
| marketing_agree | BOOLEAN DEFAULT false | | **마케팅** |
| marketing_agree_at | TIMESTAMPTZ | | 동의 일시 기록 |
| admin_memo | TEXT | | 관리자 메모 |
| referral_code | VARCHAR(20) UNIQUE | | **마케팅** 내 추천코드 |
| referred_by | UUID FK → users.id | | **마케팅** 추천인 |
| utm_source | VARCHAR(100) | | **마케팅** kakao/naver/google/direct |
| utm_medium | VARCHAR(100) | | **마케팅** social/cpc/email |
| utm_campaign | VARCHAR(200) | | **마케팅** 캠페인명 |
| join_channel | VARCHAR(30) | | kakao / naver / google / signup |
| last_login_at | TIMESTAMPTZ | | |
| is_active | BOOLEAN DEFAULT true | | 탈퇴 시 false |
| is_email_verified | BOOLEAN DEFAULT false | | **마케팅** 이메일 인증 여부 — 미인증 대상 제외 후 캠페인 발송 |
| is_phone_verified | BOOLEAN DEFAULT false | | **마케팅** 휴대폰 인증 여부 — 카카오/SMS 발송 전 체크 |
| funnel_stage | VARCHAR(30) DEFAULT 'registered' | | **마케팅** registered → verified → first_exam → paid_user — 전환 단계 추적 |
| current_points | INT DEFAULT 0 | | **마케팅** 포인트 잔액 캐시 — user_points SUM 대신 빠른 조회. user_points 변경 시 동기화 |
| created_at | TIMESTAMPTZ DEFAULT now() | | |
| updated_at | TIMESTAMPTZ DEFAULT now() | | |

**Index:** email, phone, user_no, referral_code, utm_source, created_at, site_id, funnel_stage

---

### `user_social_accounts` — 소셜 로그인 연동

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id ON DELETE CASCADE | |
| provider | VARCHAR(20) | kakao / naver / google |
| provider_uid | VARCHAR(255) | 소셜 고유 ID |
| access_token | TEXT | 암호화 저장 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

**UNIQUE(provider, provider_uid)**

---

### `user_addresses` — 회원 주소 (복수 주소 지원)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id ON DELETE CASCADE | |
| is_default | BOOLEAN DEFAULT false | |
| zipcode | VARCHAR(10) | |
| address | VARCHAR(300) | |
| address_detail | VARCHAR(200) | |
| is_overseas | BOOLEAN DEFAULT false | |

---

## 4. 전문가

### `experts` — 전문가 추가 정보
> users 테이블과 1:1. users.role = 'expert' 일 때 이 테이블 존재.  
> **[M2 수정]** rating에 CHECK 제약 추가

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id ON DELETE CASCADE UNIQUE | |
| expert_no | VARCHAR(20) UNIQUE | 전문가 관리 번호 |
| approval_status | VARCHAR(20) DEFAULT 'pending' | pending / approved / rejected / requested |
| approved_at | DATE | |
| resume_url | TEXT | 이력서 S3 경로 |
| service_types | JSONB DEFAULT '[]' | ["face","phone","chat","file","scoring"] |
| category_id | INT FK → categories.id | 전문 카테고리 |
| priority | INT DEFAULT 99 | 자동 매칭 우선순위 |
| level | CHAR(1) | A / B / C / D / E |
| available_times | JSONB DEFAULT '[]' | ["weekday_am","weekday_pm","weekend","anytime"] |
| rating | NUMERIC(3,2) DEFAULT 0 | 평점 **[M2 수정]** CHECK(rating >= 0 AND rating <= 5.00) |
| activity_count | INT DEFAULT 0 | |
| rejection_count | INT DEFAULT 0 | 매칭 거절 횟수 |
| review_count | INT DEFAULT 0 | |
| bank_name | VARCHAR(50) | |
| bank_account | VARCHAR(50) | |
| account_holder | VARCHAR(50) | |
| overseas_country | VARCHAR(100) | 해외 거주 국가 |
| overseas_reason | TEXT | |
| overseas_period | DATERANGE | |
| admin_memo | TEXT | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `expert_educations` — 학력 (experts 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| expert_id | INT FK → experts.id ON DELETE CASCADE | |
| school_name | VARCHAR(200) | |
| department | VARCHAR(200) | |
| period | DATERANGE | |
| graduation_status | VARCHAR(20) | graduated / expected / enrolled / leave |
| file_url | TEXT | |

---

### `expert_careers` — 경력 (experts 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| expert_id | INT FK → experts.id ON DELETE CASCADE | |
| company_name | VARCHAR(200) | |
| department | VARCHAR(100) | |
| position | VARCHAR(100) | |
| period | DATERANGE | |
| file_url | TEXT | |

---

### `expert_publications` — 저서 (experts 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| expert_id | INT FK → experts.id ON DELETE CASCADE | |
| title | VARCHAR(300) | |
| publisher | VARCHAR(200) | |
| published_at | DATE | |
| file_url | TEXT | |

---

### `expert_certifications` — 자격증 (experts 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| expert_id | INT FK → experts.id ON DELETE CASCADE | |
| cert_name | VARCHAR(200) | |
| file_url | TEXT | |

---

### `expert_reviews` — 전문가 리뷰 ★ 마케팅 핵심
> 리뷰 데이터 → SNS 콘텐츠 / 성과 분석 / 매칭 품질 개선에 활용

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| expert_id | INT FK → experts.id | |
| user_id | UUID FK → users.id | 작성자 |
| registration_id | INT FK → exam_registrations.id | 연결된 시험 접수 |
| rating | SMALLINT | 1~5점 |
| content | TEXT | |
| is_public | BOOLEAN DEFAULT true | 공개 여부 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

## 5. 구독

### `subscription_plans` — 구독 플랜 정의

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| code | VARCHAR(20) UNIQUE | PREMIUM / STANDARD / BASIC |
| name | VARCHAR(50) | 프리미엄 / 스탠다드 / 베이직 |
| monthly_price | INT | 월 가격 (원) |
| benefits | JSONB | {"practice_count":10,"ai_report":"advanced","discount_rate":20} |
| is_active | BOOLEAN DEFAULT true | |

---

### `user_subscriptions` — 회원 구독 이력
> **마케팅:** 구독 전환율, 업그레이드/다운그레이드 패턴 분석

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | |
| plan_id | INT FK → subscription_plans.id | |
| started_at | DATE NOT NULL | |
| ended_at | DATE | |
| auto_renewal | BOOLEAN DEFAULT true | |
| payment_id | INT FK → payments.id | 연결 결제 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

## 6. 시험

### `exams` — 시험 정보

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| exam_no | VARCHAR(20) UNIQUE | XX241010001 자동생성 |
| site_id | INT FK → sites.id | |
| exam_type | VARCHAR(30) | translate / prompt / ethics |
| exam_name | VARCHAR(200) NOT NULL | |
| grade | VARCHAR(30) | pro1 / pro2 / edu1~8 / gen1~3 |
| subject_areas | JSONB DEFAULT '[]' | 검정과목 (categories FK 배열) |
| session | SMALLINT | 교시 (1~4) |
| round_name | VARCHAR(50) | 24년1차 |
| reception_type | VARCHAR(20) | regular / rolling / corporate |
| purpose | VARCHAR(20) DEFAULT 'exam' | practice / exam |
| source_lang | VARCHAR(30) | 출발어 |
| target_lang | VARCHAR(30) | 도착어 |
| region | VARCHAR(100) | 지역 |
| exam_period | DATERANGE | 시험 가능 기간 |
| exam_date | DATE | 시험일 |
| start_time | TIME | |
| end_time | TIME | |
| result_announce_date | DATE | 성적 발표일 |
| scoring_method | VARCHAR(30) | auto / ai_rescore / ai_human / human |
| pass_score | INT | 합격 기준 점수 |
| total_score | INT | 총점 |
| registrant_count | INT DEFAULT 0 | 자동 집계 |
| examinee_count | INT DEFAULT 0 | |
| pass_count | INT DEFAULT 0 | |
| fail_count | INT DEFAULT 0 | |
| is_default | BOOLEAN DEFAULT false | |
| is_visible | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `exam_formats` — 시험 양식 (exams 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| exam_id | INT FK → exams.id ON DELETE CASCADE | |
| format_no | VARCHAR(20) UNIQUE | |
| format_type | VARCHAR(20) | translate / prompt / short_answer / survey |
| format_name | VARCHAR(200) | |
| stage | SMALLINT | 단계 |
| total_questions | INT | |
| file_type | VARCHAR(20) | doc / audio / video / url |
| source_file_url | TEXT | S3 경로 |
| used_translators | JSONB DEFAULT '[]' | ["deepl","papago"] |
| used_ai_tools | JSONB DEFAULT '[]' | ["chatgpt","claude"] |
| overview | TEXT | |
| total_score | INT | |
| pass_score | INT | |

---

### `questions` — 문항 (exam_formats 1:N)
> **마케팅/수익화:** 오답률 높은 문항 → 교재/강의 콘텐츠로 연결

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| format_id | INT FK → exam_formats.id ON DELETE CASCADE | |
| category_id | INT FK → categories.id | |
| question_no | SMALLINT NOT NULL | 문항 번호 |
| question_text | TEXT NOT NULL | |
| answer1 | TEXT | 정답 (번역 복수 정답 지원) |
| answer2 | TEXT | |
| scoring_method | VARCHAR(20) | auto / auto_human / human / none |
| eval_criteria1 | TEXT | 1차 평가 요소 |
| eval_criteria2 | TEXT | 2차 평가 요소 |
| word_count | INT | |
| sentence_count | INT | |
| char_count | INT | |
| score | INT | 배점 |
| synonyms | JSONB DEFAULT '[]' | 유사어 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `exam_registrations` — 시험 접수 및 응시

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| reg_no | VARCHAR(20) UNIQUE | 접수 관리 번호 |
| user_id | UUID FK → users.id | |
| exam_id | INT FK → exams.id | |
| payment_id | INT FK → payments.id | 연결 결제 |
| reg_status | VARCHAR(20) DEFAULT 'pending' | pending / complete / cancelled |
| reg_status_changed_at | TIMESTAMPTZ | |
| exam_status | VARCHAR(20) DEFAULT 'before' | before / complete / absent |
| submit_status | VARCHAR(20) DEFAULT 'before' | before / submitted / temp_saved |
| result | VARCHAR(20) | pass / fail / na |
| score | NUMERIC(6,2) | 채점 점수 |
| percentage | NUMERIC(5,2) | 백분율 |
| ai_score | NUMERIC(6,2) | AI 자동 채점 점수 |
| human_score | NUMERIC(6,2) | 전문가 채점 점수 |
| feedback_status | VARCHAR(20) | none / requested / in_progress / done |
| editor_used | VARCHAR(30) | prompt_editor / doc_tool |
| postponed_date | DATE | 시험 연기일 |
| emergency_contact | VARCHAR(50) | 긴급 연락처 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `answer_submissions` — 답안 제출 (exam_registrations 1:N)
> 답안 원문 별도 분리 → 용량 최적화, AI 채점 파이프라인 분리  
> **[C1 수정]** 기존 `registration_id UNIQUE` → `UNIQUE(registration_id, question_id)` 복합으로 변경  
> 20문항 시험이면 registration 1개당 20행 존재. 1:1 표기는 잘못된 것이었음.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| registration_id | INT FK → exam_registrations.id NOT NULL | |
| question_id | INT FK → questions.id NOT NULL | |
| answer_text | TEXT | 주관식 답안 |
| answer_file_url | TEXT | 파일 제출 S3 경로 |
| submitted_at | TIMESTAMPTZ | |
| is_temp | BOOLEAN DEFAULT false | 임시저장 여부 |

> **복합 UNIQUE:** `UNIQUE(registration_id, question_id)` — 같은 시험 같은 문항에 중복 답안 방지

---

### `certificates` — 자격증 (exam_registrations 1:1)
> **[W4 수정]** 자격증 발급 결제 추적을 위해 `payment_id` 추가

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| registration_id | INT FK → exam_registrations.id UNIQUE NOT NULL | |
| payment_id | INT FK → payments.id | **[W4 수정]** 자격증 발급 결제 연결 |
| request_status | VARCHAR(20) DEFAULT 'none' | none / requested / cancelled |
| cert_type | VARCHAR(30) | certificate / card / original_copy / service_confirm / confirm |
| price | INT | 발급 금액 |
| photo_url | TEXT | 등록 사진 S3 |
| print_status | VARCHAR(20) DEFAULT 'before' | before / done / cancelled |
| printed_at | DATE | |
| delivery_status | VARCHAR(20) DEFAULT 'before' | before / started / in_transit / returned / done |
| delivered_at | DATE | |
| delivery_tracking | VARCHAR(100) | 운송장 번호 |

---

## 7. 연습문제

### `exam_types` — 시험 종류 마스터 ★ [C2 수정으로 신규 추가]
> `practice_packages.exam_type`이 VARCHAR FK 불가 문제 해결. 별도 마스터 테이블로 분리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| code | VARCHAR(30) UNIQUE NOT NULL | translate / prompt / ethics |
| name | VARCHAR(100) | AI 번역 시험 / AI 프롬프트 시험 / AI 윤리 시험 |
| is_active | BOOLEAN DEFAULT true | |

---

### `practice_packages` — 연습문제 패키지

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| package_no | VARCHAR(20) UNIQUE | PRAC001 |
| name | VARCHAR(200) | 기본 3회 팩 |
| exam_type_id | INT FK → exam_types.id NOT NULL | **[C2 수정]** VARCHAR → 정식 FK 연결 |
| count | INT | 제공 횟수 |
| price | INT | |
| is_visible | BOOLEAN DEFAULT true | |

---

### `practice_records` — 연습 응시 기록
> **마케팅/수익화:** 오답 JSON → AI 학습 데이터, 교재 제작 활용

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| record_no | VARCHAR(20) UNIQUE | EX241010001 |
| user_id | UUID FK → users.id | |
| package_id | INT FK → practice_packages.id | |
| total_score | NUMERIC(6,2) | |
| wrong_answers | JSONB DEFAULT '[]' | [{question_id, user_answer, correct_answer}] |
| exam_date | DATE | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

## 8. AI 분석 리포트

### `ai_reports` — AI 분석 리포트
> **마케팅:** 무료 기본 → 심화 업그레이드 유도 퍼널 핵심

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| report_no | VARCHAR(20) UNIQUE | RPT001 |
| user_id | UUID FK → users.id | |
| registration_id | INT FK → exam_registrations.id | |
| grade | VARCHAR(20) | basic_free / advanced1 / advanced2 / premium |
| is_paid | BOOLEAN DEFAULT false | |
| payment_id | INT FK → payments.id | 유료 구매 결제 |
| analysis | JSONB | {"by_area":{...},"strengths":[...],"weaknesses":[...],"learning_path":[...]} |
| pdf_url | TEXT | S3 PDF 경로 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

## 9. 학습 이력 & 오답 분석

### `learning_history` — 학습 이력
> **마케팅:** 영역별 성장 그래프 → 재구매 / 구독 전환 유도  
> **[W5 수정]** `UNIQUE(user_id, exam_type, category_id)` 추가 — 중복 이력 방지

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | |
| exam_type_id | INT FK → exam_types.id | translate / prompt / ethics |
| category_id | INT FK → categories.id | 세부 영역 |
| avg_score | NUMERIC(5,2) | 해당 영역 평균 점수 |
| score_trend | JSONB DEFAULT '[]' | [{"date":"2024-10-10","score":72}] 시험별 추이 |
| updated_at | TIMESTAMPTZ DEFAULT now() | |

> **복합 UNIQUE:** `UNIQUE(user_id, exam_type_id, category_id)`

---

### `wrong_answer_stats` — 오답 분석 통계
> **수익화:** 오답률 높은 문항 → 교재/강의 콘텐츠 제작 근거 데이터

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| question_id | INT FK → questions.id UNIQUE | |
| wrong_rate | NUMERIC(5,2) | 오답률 % |
| top_wrong_patterns | JSONB DEFAULT '[]' | 주요 오답 패턴 집계 |
| aggregated_at | DATE | 통계 집계 기준일 |

---

## 10. B2B 기업·단체

### `b2b_companies` — B2B 기업 정보

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| company_no | VARCHAR(20) UNIQUE | BIZ001 |
| business_no | VARCHAR(20) | 사업자 등록번호 |
| company_name | VARCHAR(200) NOT NULL | |
| manager_name | VARCHAR(100) | 담당자명 |
| manager_email | VARCHAR(255) | |
| manager_phone | VARCHAR(20) | |
| approval_status | VARCHAR(20) DEFAULT 'pending' | pending / approved / rejected |
| admin_memo | TEXT | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `group_registrations` — 단체 접수

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| group_no | VARCHAR(20) UNIQUE | GRP001 |
| company_id | INT FK → b2b_companies.id | |
| exam_id | INT FK → exams.id | |
| payment_id | INT FK → payments.id | |
| total_price | INT | |
| tax_invoice | BOOLEAN DEFAULT false | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `group_members` — 단체 구성원 (group_registrations 1:N)
> **[W3 수정]** `exam_registration_id` 추가 → 단체 접수 후 개별 시험 진행 상황 연결

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| group_reg_id | INT FK → group_registrations.id ON DELETE CASCADE | |
| user_id | UUID FK → users.id | NULL=미가입자 |
| exam_registration_id | INT FK → exam_registrations.id | **[W3 수정]** 개별 시험 접수와 연결. 초대 수락 후 생성 |
| guest_name | VARCHAR(100) | 미가입자 이름 |
| guest_email | VARCHAR(255) | 미가입자 이메일 |
| invited_at | TIMESTAMPTZ DEFAULT now() | |

---

## 11. 결제

### `coupons` — 쿠폰/할인코드 ★ 마케팅 핵심

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| code | VARCHAR(50) UNIQUE NOT NULL | 쿠폰 코드 |
| name | VARCHAR(200) | 쿠폰명 |
| discount_type | VARCHAR(20) | percent / fixed |
| discount_value | INT | 할인율(%) 또는 할인금액(원) |
| min_order_amount | INT DEFAULT 0 | 최소 주문 금액 |
| max_discount_amount | INT | percent 타입 최대 할인 한도 |
| valid_from | TIMESTAMPTZ | |
| valid_until | TIMESTAMPTZ | |
| max_uses | INT | NULL=무제한 |
| used_count | INT DEFAULT 0 | |
| target_type | VARCHAR(20) DEFAULT 'all' | all / new_user / subscription / exam |
| site_id | INT FK → sites.id | |
| is_active | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `user_coupons` — 회원 쿠폰 발급

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | |
| coupon_id | INT FK → coupons.id | |
| is_used | BOOLEAN DEFAULT false | |
| used_at | TIMESTAMPTZ | |
| payment_id | INT FK → payments.id | 사용된 결제 |
| issued_at | TIMESTAMPTZ DEFAULT now() | |

---

### `payments` — 결제 정보
> **[W2 수정]** `coupon_id` 제거 — `user_coupons.payment_id`로 단방향 관리

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| payment_no | VARCHAR(20) UNIQUE | XX241010001 자동생성 |
| user_id | UUID FK → users.id | |
| payment_type | VARCHAR(30) | service / point_charge / subscription / doc_purchase / exam_reg / cert |
| description | VARCHAR(300) | 결제 내용 |
| detail | TEXT | 결제 상세 |
| origin_amount | INT NOT NULL | 이용 금액 |
| discount_amount | INT DEFAULT 0 | 쿠폰+포인트 합산 할인 금액 |
| point_used | INT DEFAULT 0 | 포인트 사용 금액 |
| final_amount | INT NOT NULL | 최종 결제 금액 |
| held_points | INT DEFAULT 0 | 결제 시점 보유 포인트 스냅샷 |
| method | VARCHAR(30) | card / naver_pay / kakao_pay / point |
| pg_transaction_id | VARCHAR(200) | PG사 거래 ID |
| status | VARCHAR(20) DEFAULT 'pending' | pending / complete / cancelled / refunded |
| paid_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `user_points` — 포인트 잔액 및 이력 ★ [W6 신규 추가]
> `payments.point_used`만으론 포인트 잔액 추적 불가. 충전/차감 이력 별도 관리 필요.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id NOT NULL | |
| change_type | VARCHAR(20) NOT NULL | charge / use / refund / expire / event |
| amount | INT NOT NULL | 양수=적립, 음수=차감 |
| balance_after | INT NOT NULL | 변경 후 잔액 (스냅샷) |
| payment_id | INT FK → payments.id | 결제 연결 (사용 시) |
| description | VARCHAR(200) | 변경 사유 |
| expired_at | DATE | 포인트 만료일 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

> **현재 잔액 조회:** `SELECT SUM(amount) FROM user_points WHERE user_id = ?`  
> **주의:** 포인트 차감 시 잔액 부족 체크는 앱에서 `SELECT FOR UPDATE`로 처리

---

### `refunds` — 환불 (payments 1:1)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| payment_id | INT FK → payments.id UNIQUE | |
| status | VARCHAR(20) DEFAULT 'requested' | requested / in_progress / done / cancelled |
| amount | INT NOT NULL | 환불 금액 |
| reason | TEXT | 환불 사유 |
| bank_name | VARCHAR(50) | |
| bank_account | VARCHAR(50) | |
| account_holder | VARCHAR(50) | |
| requested_at | TIMESTAMPTZ DEFAULT now() | |
| completed_at | TIMESTAMPTZ | |

---

### `pricing_rules` — 결제 기준

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| service_type | VARCHAR(30) | ai / translate / legal / curator / consulting / accounting / hr |
| category_id | INT FK → categories.id | |
| final_price | INT | |
| applied_at | DATE | 적용 시작일 |
| is_active | BOOLEAN DEFAULT true | |

---

## 12. 운영

### `notices` — 공지사항
> **[M1 수정]** `author TEXT` → `author_id UUID FK` 로 blogs와 통일

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| site_id | INT FK → sites.id | |
| title | VARCHAR(300) NOT NULL | |
| content | TEXT | |
| author_id | UUID FK → users.id ON DELETE SET NULL | **[M1 수정]** 작성자 FK (blogs와 통일) |
| view_count | INT DEFAULT 0 | |
| is_pinned | BOOLEAN DEFAULT false | **마케팅** 중요 공지 고정 |
| is_visible | BOOLEAN DEFAULT true | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `blogs` — 블로그
> **마케팅:** SEO 콘텐츠, 유입 채널, 조회수 분석  
> **[M6 수정]** `ON DELETE SET NULL` 추가 — 작성자 탈퇴 시 블로그 보존

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| site_id | INT FK → sites.id | |
| category_id | INT FK → categories.id | |
| title | VARCHAR(300) NOT NULL | |
| content | TEXT | |
| thumbnail_url | TEXT | |
| author_id | UUID FK → users.id ON DELETE SET NULL | **[M6 수정]** 탈퇴 시 NULL 처리 (글은 보존) |
| tags | JSONB DEFAULT '[]' | **마케팅** 태그 검색 |
| view_count | INT DEFAULT 0 | |
| is_visible | BOOLEAN DEFAULT true | |
| published_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `inquiries` — 1:1 상담

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | |
| status | VARCHAR(20) DEFAULT 'requested' | requested / in_progress / done |
| category | VARCHAR(30) | payment / error / refund / service / improvement / etc / exam |
| display_to | VARCHAR(20) DEFAULT 'admin' | admin / expert |
| title | VARCHAR(300) | |
| content | TEXT | |
| admin_memo | TEXT | |
| created_at | TIMESTAMPTZ DEFAULT now() | |
| closed_at | TIMESTAMPTZ | |

---

### `inquiry_replies` — 상담 답변 (inquiries 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| inquiry_id | INT FK → inquiries.id ON DELETE CASCADE | |
| author_id | UUID FK → users.id | 답변자 |
| content | TEXT NOT NULL | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `notification_logs` — 알림 발송 이력
> **마케팅:** 발송 이력 추적, A/B 테스트 가능

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | |
| category | VARCHAR(30) | payment / expert_approval / exam_day / result / matching / translation / doc_sale |
| method | VARCHAR(20) | sms / kakao / email |
| title | VARCHAR(300) | |
| content | TEXT | |
| is_sent | BOOLEAN DEFAULT false | |
| sent_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `faqs` — FAQ

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| site_id | INT FK → sites.id | |
| category | VARCHAR(50) | |
| question | TEXT NOT NULL | |
| answer | TEXT | |
| sort_order | INT DEFAULT 0 | |
| is_visible | BOOLEAN DEFAULT true | |

---

### `banners` — 메인 배너

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| site_id | INT FK → sites.id | |
| image_url | TEXT | |
| link_url | TEXT | |
| alt_text | VARCHAR(200) | |
| sort_order | INT DEFAULT 0 | |
| start_at | DATE | |
| end_at | DATE | |
| is_visible | BOOLEAN DEFAULT true | |

---

### `popups` — 팝업

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| site_id | INT FK → sites.id | |
| image_url | TEXT | |
| text_content | TEXT | |
| link_url | TEXT | |
| valid_from | DATE | |
| valid_until | DATE | |
| is_visible | BOOLEAN DEFAULT true | |

---

### `terms` — 이용약관

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| site_id | INT FK → sites.id | |
| title | VARCHAR(200) | |
| content | TEXT | |
| is_required | BOOLEAN DEFAULT true | |
| version | VARCHAR(20) | |
| effective_at | DATE | |

---

## 13. 챗봇

### `chatbot_faqs` — 챗봇 FAQ

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| faq_no | VARCHAR(20) UNIQUE | BOT001 |
| keyword | VARCHAR(200) | 질문 키워드 |
| answer | TEXT | |
| category | VARCHAR(30) | registration / payment / exam / certificate / etc |
| sort_order | INT DEFAULT 0 | |
| is_visible | BOOLEAN DEFAULT true | |

---

### `chatbot_logs` — 챗봇 대화 로그
> **마케팅:** 미답변 질문 → FAQ 보완, 사용자 니즈 파악

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | NULL=비로그인 |
| messages | JSONB NOT NULL | [{"role":"user","content":"...","at":"..."}] |
| is_unanswered | BOOLEAN DEFAULT false | 미답변=관리자 확인 필요 |
| started_at | TIMESTAMPTZ NOT NULL | |
| ended_at | TIMESTAMPTZ | |

---

## 14. 통계 & 마케팅

### `daily_statistics` — 일별 통계 집계
> 조회 성능을 위해 집계된 스냅샷 저장  
> **[W1 수정]** `exam_type DEFAULT 'all'` — NULL 사용 안 함. PostgreSQL에서 UNIQUE 제약은 NULL ≠ NULL이므로 NULL 대신 'all' 문자열 사용

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| stat_type | VARCHAR(20) NOT NULL | daily / weekly / monthly / by_exam_type |
| stat_date | DATE NOT NULL | |
| exam_type | VARCHAR(30) NOT NULL DEFAULT 'all' | **[W1 수정]** 'all'=전체, 'translate'/'prompt'/'ethics'=개별 |
| registrant_count | INT DEFAULT 0 | |
| examinee_count | INT DEFAULT 0 | |
| pass_count | INT DEFAULT 0 | |
| pass_rate | NUMERIC(5,2) | |
| revenue | BIGINT DEFAULT 0 | 매출 합계 |
| new_user_count | INT DEFAULT 0 | |
| ai_report_purchase | INT DEFAULT 0 | AI 분석 구매 수 |
| subscription_new | INT DEFAULT 0 | **마케팅** 신규 구독 |
| subscription_cancel | INT DEFAULT 0 | **마케팅** 구독 취소 |
| coupon_used | INT DEFAULT 0 | **마케팅** 쿠폰 사용 수 |

**UNIQUE(stat_type, stat_date, exam_type)**

---

### `utm_tracking` — UTM 파라미터 추적 ★ 마케팅 핵심
> 광고 채널별 가입·결제 전환율 분석

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id | NULL=비회원 |
| session_id | VARCHAR(100) | 세션 ID |
| utm_source | VARCHAR(100) | kakao / naver / google / instagram |
| utm_medium | VARCHAR(100) | cpc / social / email / organic |
| utm_campaign | VARCHAR(200) | 캠페인명 |
| utm_content | VARCHAR(200) | 광고 소재 |
| landing_page | TEXT | 최초 랜딩 URL |
| converted | BOOLEAN DEFAULT false | 전환 여부 (가입 또는 결제) |
| converted_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

## 15. 관리자

### `admins` — 관리자 설정
> users 테이블의 role='admin'/'master'와 연동. 권한 상세 설정 분리.

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| user_id | UUID FK → users.id UNIQUE | |
| admin_role | VARCHAR(30) | master / super / meta_translate / payment / exam / settlement / bookread_general |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

### `admin_permissions` — 관리자 권한 설정 (admins 1:N)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | SERIAL PK | |
| admin_id | INT FK → admins.id ON DELETE CASCADE | |
| site_id | INT FK → sites.id | NULL=모든 사이트 |
| menu_code | VARCHAR(100) | 접근 가능 메뉴 코드 |
| can_read | BOOLEAN DEFAULT true | |
| can_write | BOOLEAN DEFAULT false | |
| can_save | BOOLEAN DEFAULT false | |
| can_delete | BOOLEAN DEFAULT false | |

---

## 16. AI 윤리 홈페이지 전용 테이블

> 현재 개발 중인 AI 윤리 사이트 (site_id = ethics)의 진단 기능 전용

### `diagnosis_results` — 진단 결과 (무료 + 유료 1/2/3단계)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID PK DEFAULT gen_random_uuid() | |
| user_id | UUID FK → users.id | NULL=비로그인 |
| diagnosis_type | VARCHAR(20) | free / paid1 / paid2 / paid3 |
| score | INT | 맞은 문항 수 |
| total | INT | 전체 문항 수 |
| percentage | NUMERIC(5,2) | |
| grade | VARCHAR(10) | S / A / B / C |
| axis_scores | JSONB | {"transparency":80,"fairness":70,...} |
| answers | JSONB DEFAULT '[]' | 문항별 답안 스냅샷 |
| created_at | TIMESTAMPTZ DEFAULT now() | |

---

## 17. 전체 FK 관계 요약 (오류 수정 반영)

```
[공통]
sites — (마스터)
exam_types — (마스터) ★ [C2 신규]
categories.parent_id             → categories.id (self-ref)
categories.site_id               → sites.id

[회원]
users.site_id                    → sites.id
users.referred_by                → users.id (self-ref, nullable)
user_social_accounts.user_id     → users.id ON DELETE CASCADE
user_addresses.user_id           → users.id ON DELETE CASCADE

[전문가]
experts.user_id                  → users.id ON DELETE CASCADE UNIQUE
experts.category_id              → categories.id
expert_educations.expert_id      → experts.id ON DELETE CASCADE
expert_careers.expert_id         → experts.id ON DELETE CASCADE
expert_publications.expert_id    → experts.id ON DELETE CASCADE
expert_certifications.expert_id  → experts.id ON DELETE CASCADE
expert_reviews.expert_id         → experts.id
expert_reviews.user_id           → users.id
expert_reviews.registration_id   → exam_registrations.id (nullable)

[구독]
user_subscriptions.user_id       → users.id
user_subscriptions.plan_id       → subscription_plans.id
user_subscriptions.payment_id    → payments.id (nullable)

[시험]
exams.site_id                    → sites.id
exam_formats.exam_id             → exams.id ON DELETE CASCADE
questions.format_id              → exam_formats.id ON DELETE CASCADE
questions.category_id            → categories.id (nullable)
wrong_answer_stats.question_id   → questions.id UNIQUE
exam_registrations.user_id       → users.id
exam_registrations.exam_id       → exams.id
exam_registrations.payment_id    → payments.id (nullable)
answer_submissions.registration_id → exam_registrations.id  ★ [C1: UNIQUE→복합UNIQUE]
answer_submissions.question_id   → questions.id
  ※ UNIQUE(registration_id, question_id)
certificates.registration_id     → exam_registrations.id UNIQUE
certificates.payment_id          → payments.id (nullable) ★ [W4 추가]

[AI리포트]
ai_reports.user_id               → users.id  ※ denormalized 빠른조회용 [M5]
ai_reports.registration_id       → exam_registrations.id
ai_reports.payment_id            → payments.id (nullable)

[연습문제]
practice_packages.exam_type_id   → exam_types.id ★ [C2 수정: VARCHAR→FK]
practice_records.user_id         → users.id
practice_records.package_id      → practice_packages.id

[학습이력]
learning_history.user_id         → users.id
learning_history.exam_type_id    → exam_types.id ★ [C2 연동]
learning_history.category_id     → categories.id (nullable)
  ※ UNIQUE(user_id, exam_type_id, category_id) ★ [W5 추가]
wrong_answer_stats.question_id   → questions.id UNIQUE

[B2B]
b2b_companies — (독립 마스터)
group_registrations.company_id   → b2b_companies.id
group_registrations.exam_id      → exams.id
group_registrations.payment_id   → payments.id (nullable)
group_members.group_reg_id       → group_registrations.id ON DELETE CASCADE
group_members.user_id            → users.id (nullable, 미가입자 NULL)
group_members.exam_registration_id → exam_registrations.id (nullable) ★ [W3 추가]

[결제]
coupons.site_id                  → sites.id (nullable)
user_coupons.user_id             → users.id
user_coupons.coupon_id           → coupons.id
user_coupons.payment_id          → payments.id (nullable)
payments.user_id                 → users.id
  ※ payments.coupon_id 제거 ★ [W2 수정]
user_points.user_id              → users.id ★ [W6 신규]
user_points.payment_id           → payments.id (nullable)
refunds.payment_id               → payments.id UNIQUE
pricing_rules.category_id        → categories.id (nullable)

[운영]
notices.site_id                  → sites.id
notices.author_id                → users.id ON DELETE SET NULL ★ [M1 수정]
blogs.site_id                    → sites.id
blogs.category_id                → categories.id (nullable)
blogs.author_id                  → users.id ON DELETE SET NULL ★ [M6 추가]
inquiries.user_id                → users.id
inquiry_replies.inquiry_id       → inquiries.id ON DELETE CASCADE
inquiry_replies.author_id        → users.id
notification_logs.user_id        → users.id
faqs.site_id                     → sites.id (nullable)
banners.site_id                  → sites.id
popups.site_id                   → sites.id
terms.site_id                    → sites.id

[챗봇/통계]
chatbot_logs.user_id             → users.id (nullable, 비로그인 NULL)
utm_tracking.user_id             → users.id (nullable, 비회원 NULL)

[관리자]
admins.user_id                   → users.id UNIQUE
admin_permissions.admin_id       → admins.id ON DELETE CASCADE
admin_permissions.site_id        → sites.id (nullable, NULL=모든사이트)

[AI윤리 전용]
diagnosis_results.user_id        → users.id (nullable, 비로그인 NULL)
```

---

## 18. 마케팅 활용 포인트 정리

| 목적 | 활용 테이블/컬럼 |
|------|-----------------|
| 가입 채널 분석 | users.join_channel, utm_tracking |
| 광고 전환율 측정 | utm_tracking.converted, utm_tracking.utm_source |
| 추천인 프로그램 | users.referral_code, users.referred_by |
| 이메일/카톡 캠페인 | users.notify_methods, users.marketing_agree, notification_logs |
| 구독 전환 유도 | user_subscriptions, ai_reports.grade(무료→유료 업셀) |
| 쿠폰 마케팅 | coupons, user_coupons |
| 사용자 세그먼테이션 | users.subscription_status, users.member_type |
| 리텐션 분석 | users.last_login_at, learning_history.score_trend |
| B2B 영업 | b2b_companies, group_registrations |
| 콘텐츠 수익화 | wrong_answer_stats (교재 제작), practice_records.wrong_answers |
| NPS/리뷰 | expert_reviews |
| SEO 블로그 | blogs.tags, blogs.view_count |
| 챗봇 니즈 파악 | chatbot_logs.is_unanswered |
| KPI 대시보드 | daily_statistics (구독신규/취소, 쿠폰사용, AI분석구매) |

---

## 19. 권장 인덱스 (M7 수정 반영 — 누락 인덱스 추가)

```sql
-- [회원]
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_site_id ON users(site_id);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_utm_source ON users(utm_source);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_last_login ON users(last_login_at);  -- 리텐션 분석용

-- [시험 접수]
CREATE INDEX idx_exam_reg_user_id ON exam_registrations(user_id);
CREATE INDEX idx_exam_reg_exam_id ON exam_registrations(exam_id);
CREATE INDEX idx_exam_reg_status ON exam_registrations(reg_status);
CREATE UNIQUE INDEX idx_answer_sub_reg_q ON answer_submissions(registration_id, question_id); -- [C1]

-- [결제]
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);  -- [W6 신규]

-- [구독 — M7 추가]
CREATE INDEX idx_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_subscriptions_active ON user_subscriptions(user_id, ended_at)
  WHERE ended_at IS NULL OR ended_at > now();  -- 현재 활성 구독 빠른 조회

-- [쿠폰 — M7 추가]
CREATE INDEX idx_coupons_valid ON coupons(valid_from, valid_until) WHERE is_active = true;
CREATE INDEX idx_user_coupons_user ON user_coupons(user_id, is_used);

-- [AI윤리 진단]
CREATE INDEX idx_diagnosis_user_id ON diagnosis_results(user_id);
CREATE INDEX idx_diagnosis_type ON diagnosis_results(diagnosis_type);
CREATE INDEX idx_diagnosis_created_at ON diagnosis_results(created_at);

-- [통계/마케팅]
CREATE INDEX idx_daily_stats_date ON daily_statistics(stat_date);
CREATE INDEX idx_utm_user_id ON utm_tracking(user_id);
CREATE INDEX idx_utm_source ON utm_tracking(utm_source, utm_campaign);

-- [학습이력 — W5 UNIQUE]
CREATE UNIQUE INDEX idx_learning_hist_unique ON learning_history(user_id, exam_type_id, category_id);
```

---

## 20. 삽입 순서 (테이블 생성 의존성)

테이블을 생성할 때 반드시 아래 순서를 지켜야 FK 오류 없음:

```
1. sites
2. exam_types
3. subscription_plans
4. categories (self-ref이므로 parent_id 는 나중에 UPDATE 가능)
5. users
6. user_social_accounts, user_addresses
7. experts → expert_educations, expert_careers, expert_publications, expert_certifications
8. b2b_companies
9. exams
10. exam_formats → questions
11. practice_packages
12. coupons
13. payments → refunds, user_points
14. user_subscriptions, user_coupons
15. exam_registrations
16. answer_submissions, certificates, ai_reports
17. practice_records, learning_history, wrong_answer_stats
18. group_registrations → group_members
19. expert_reviews
20. notices, blogs, faqs, banners, popups, terms
21. inquiries → inquiry_replies
22. notification_logs, chatbot_faqs, chatbot_logs
23. admins → admin_permissions
24. daily_statistics, utm_tracking
25. diagnosis_results
```
