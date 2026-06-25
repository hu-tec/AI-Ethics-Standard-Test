import { useMemo, useState } from 'react'
import { Award, CalendarDays, CheckCircle2, ClipboardList, CreditCard, FileText, Search, Ticket } from 'lucide-react'
import { api } from '../lib/api'

const examTypes = [
  {
    id: 'translation',
    name: 'AI 번역 시험',
    english: 'AI Translation Certification',
    status: '핵심 개발',
    target: '번역가, 언어 학습자, 언어 서비스 기업',
    purpose: 'AI 도구(ChatGPT·DeepL·파파고 등)를 활용한 고품질 번역 능력 공식 검증',
    format: '실기형',
    grading: 'AI 1차 채점 + 전문가 2차 검증',
    result: '시험 후 30일 이내',
    certificate: '합격 시 자격증·카드 발급 가능',
  },
  {
    id: 'prompt',
    name: 'AI 프롬프트 시험',
    english: 'AI Prompt Specialist Certification',
    status: '개발 예정',
    target: '직장인, IT 종사자, 콘텐츠 크리에이터, 학생',
    purpose: 'AI 모델에 최적의 지시를 작성하는 역량 및 결과물 품질 검증',
    format: '실기형 + 객관식 혼합',
    grading: '자동채점 + AI 결과물 평가',
    result: '시험 후 7일 이내',
    certificate: '합격 시 자격증 발급 가능',
  },
  {
    id: 'ethics',
    name: 'AI 윤리 시험',
    english: 'AI Ethics Certification',
    status: '추후 개발',
    target: '전 직군, 학생, 기업 담당자, 공공기관',
    purpose: 'AI 사용의 윤리적 판단력·책임 인식·관련 규제 이해도 검증',
    format: '객관식 + 단답형',
    grading: '100% 자동채점',
    result: '시험 후 즉시',
    certificate: '합격 시 자격증 발급 가능',
  },
]

const subjectsByExam = {
  translation: [
    ['ttt', 'AI 문서번역 (TTT)', 'PDF·DOCX·HWP·PPTX 문서를 AI 도구로 번역 후 제출', 'PDF/DOCX/HWP/PPTX'],
    ['stt', 'AI 영상번역 (STT→TTS)', '유튜브·다큐·예능 영상의 음성을 텍스트로 변환 후 번역', 'MP3/MP4/URL'],
    ['subtitle', 'AI 자막번역', '웹툰·드라마 등 자막 특화 번역, 말풍선 제약 조건 반영', 'SRT/DOCX/이미지'],
    ['sts', 'AI 동시통역 보조 (STS)', '음성→텍스트→번역→음성 전 과정을 AI로 보조하고 정확도 평가', 'MP3/WAV'],
  ],
  prompt: [
    ['basic', '프롬프트 기초', 'AI 모델 구조 이해, 기본 지시 작성, 출력 제어 방법', '텍스트'],
    ['applied', '프롬프트 응용', 'Role·Context·Format 지정, 체인 프롬프트, Few-shot 기법', '텍스트'],
    ['translationPrompt', '번역 특화 프롬프트', 'AI 번역 품질 향상을 위한 프롬프트 최적화 및 후처리 지시', 'DOCX/텍스트'],
    ['domainPrompt', '분야별 프롬프트', '법률·의료·IT·비즈니스 도메인별 프롬프트 작성 및 결과 평가', '텍스트'],
  ],
  ethics: [
    ['bias', 'AI 편향성과 공정성', '데이터 편향, 알고리즘 차별, 방지 방법론 이해', '텍스트'],
    ['data', '데이터 윤리', '개인정보 보호, 데이터 수집·활용 시 윤리 기준', '텍스트'],
    ['ip', 'AI 저작권·지식재산권', '생성형 AI 산출물의 법적 지위와 상업적 이용 기준', '텍스트'],
    ['policy', 'AI 책임과 투명성', '설명 가능한 AI, 감사 가능성, 인간 감독 원칙', '텍스트'],
  ],
}

const gradesByExam = {
  translation: [
    ['pro1', '전문 1급', '최고 전문가', '산업번역·동시통역 수준, 품질·속도 모두 최상', 120000],
    ['pro2', '전문 2급', '전문가', '일반 전문 문서 번역 가능, 품질 기준 상위', 90000],
    ['edu1', '교육 1급', '고급 학습자', '교육 목적 단계형 평가, 1급=고급학습자', 70000],
    ['edu8', '교육 8급', '입문자', '교육 목적 단계형 평가, 8급=입문자', 30000],
    ['gen1', '일반 1급', '일반인 우수', '실생활·업무에서 AI 번역 활용 능력 우수', 55000],
    ['gen3', '일반 3급', '입문', 'AI 번역 활용 기본 능력 평가', 35000],
  ],
  prompt: [
    ['advanced', '고급 (Advanced)', '전문가·강사', '복잡한 멀티스텝 프롬프트, 분야 전문 적용 가능', 80000],
    ['intermediate', '중급 (Intermediate)', '실무자', '업무용 프롬프트 작성·최적화 및 결과물 평가', 55000],
    ['basic', '기초 (Basic)', '입문자·학생', 'AI 기본 개념 이해, 단순 프롬프트 작성 가능', 35000],
  ],
  ethics: [
    ['professional', '전문 (Professional)', '기업·기관 담당자', 'AI 정책 수립, 위험 평가, 규제 대응 능력 보유', 70000],
    ['basic', '기초 (Basic)', '일반인·학생', 'AI 윤리 기본 원칙 이해, 책임감 있는 AI 사용 인식', 30000],
  ],
}

const scheduleRows = [
  { id: 'TR-01', exam: 'translation', period: '2026.07.01~07.12', region: '서울', date: '2026.07.12 (토)', reception: '정기', round: '1차', subject: 'AI 문서번역 (TTT)', grade: '전문 2급', start: '10:00', end: '12:00', status: '접수 전', result: '2026.08.12', seats: 12 },
  { id: 'TR-02', exam: 'translation', period: '2026.07.01~07.19', region: '온라인', date: '2026.07.19 (토)', reception: '정기', round: '2차', subject: 'AI 자막번역', grade: '일반 1급', start: '13:00', end: '15:00', status: '접수 중', result: '2026.08.19', seats: 38 },
  { id: 'TR-03', exam: 'translation', period: '2026.07.10~07.26', region: '부산', date: '2026.07.26 (토)', reception: '수시', round: '수시', subject: 'AI 영상번역 (STT→TTS)', grade: '전문 1급', start: '15:30', end: '18:00', status: '접수 중', result: '2026.08.26', seats: 9 },
  { id: 'PR-01', exam: 'prompt', period: '2026.08.01~08.16', region: '온라인', date: '2026.08.16 (토)', reception: '정기', round: '예정', subject: '프롬프트 응용', grade: '중급 (Intermediate)', start: '10:00', end: '11:30', status: '개발 예정', result: '2026.08.23', seats: 0 },
  { id: 'ET-01', exam: 'ethics', period: '일정 미정', region: '온라인', date: '추후 공지', reception: '미정', round: '예정', subject: 'AI 책임과 투명성', grade: '기초 (Basic)', start: '-', end: '-', status: '추후 개발', result: '-', seats: 0 },
]

const platformMenus = [
  ['시험 안내', '/exam-guide/:type', '등급·과목·시험시간·합격 혜택 안내'],
  ['시험 접수', '/exams', '시험 선택, 일정·지역 필터, 약관, 결제'],
  ['시험 응시', '/exam/take', '문제 유형 렌더링, 자동저장, 최종 제출'],
  ['성적 & 분석', '/my/results', '합불판정, 점수, AI 상세분석, PDF 결과지'],
  ['자격증·교재', '/my/certificates', '자격증 신청·배송 추적, 디지털 배지'],
  ['결제·주문', '/my/orders', '결제 내역, 영수증, 환불 신청'],
  ['수험표', '/my/ticket', '접수 건별 수험표, PDF 출력, 시험장 지도'],
  ['B2B 단체접수', '/b2b/apply', '구성원 엑셀 업로드, 일괄 결제, 상태 조회'],
]

const addOns = [
  ['certificate', '자격증·카드 발급', 10000, '합격 후 자격증 디자인 확인 및 발급 신청'],
  ['analysis', 'AI 상세 분석 결과', 15000, '영역별 레이더차트, 강·약점 AI 해석, PDF 다운로드'],
  ['practice', '연습문제 패키지', 9000, '무료 1회 이후 실전과 동일한 환경으로 추가 연습'],
]

const statusStyle = {
  '접수 중': 'border-primary-200 bg-primary-50 text-primary-700',
  '접수 전': 'border-accent-200 bg-accent-50 text-accent-700',
  '개발 예정': 'border-orange-200 bg-orange-50 text-orange-700',
  '추후 개발': 'border-yellow-200 bg-yellow-50 text-yellow-700',
}

const inputClass = 'h-8 w-full rounded border border-gray-300 bg-white px-2 text-[11px] outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100'

function won(value) {
  return `₩${value.toLocaleString('ko-KR')}`
}

function Section({ id, code, title, note, children }) {
  return (
    <section id={id} className="grid scroll-mt-20 border-b border-gray-200 bg-white lg:grid-cols-[132px_1fr]">
      <div className="border-b border-gray-200 bg-slate-50 px-3 py-3 lg:border-b-0 lg:border-r">
        <div className="mb-1 text-[10px] font-black tracking-wide text-slate-400">{code}</div>
        <h2 className="text-[13px] font-black text-slate-950">{title}</h2>
        <p className="mt-1 text-[10px] leading-4 text-slate-500">{note}</p>
      </div>
      <div className="min-w-0 px-3 py-3">{children}</div>
    </section>
  )
}

function ChoiceCard({ checked, disabled, onChange, title, desc, meta, badge }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`min-w-0 rounded border px-2 py-1.5 text-left transition ${checked ? 'border-primary-300 bg-primary-50 ring-1 ring-primary-200' : 'border-gray-200 bg-white hover:border-primary-200'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <strong className="truncate text-[11px] font-black text-slate-950">{title}</strong>
        {badge && <span className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-black ${statusStyle[badge] || 'border-gray-200 bg-gray-50 text-gray-600'}`}>{badge}</span>}
      </div>
      {desc && <p className="mt-0.5 truncate text-[9px] text-slate-500">{desc}</p>}
      {meta && <p className="mt-1 text-[9px] font-bold text-slate-600">{meta}</p>}
    </button>
  )
}

function InlineOption({ checked, onChange, children, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      className={`flex min-h-8 min-w-0 items-center gap-1.5 rounded border px-2 py-1 text-left text-[10px] font-bold transition ${checked ? 'border-primary-300 bg-primary-50 text-primary-800 ring-1 ring-primary-200' : 'border-gray-200 bg-white text-slate-700 hover:border-primary-200'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <span className={`h-2.5 w-2.5 shrink-0 rounded-full border ${checked ? 'border-primary-600 bg-primary-600' : 'border-gray-400'}`} />
      <span className="truncate">{children}</span>
    </button>
  )
}

function Field({ label, required, children, className = '' }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1 flex gap-1 text-[10px] font-black text-slate-600">{label}{required && <em className="text-red-600">*</em>}</span>
      {children}
    </label>
  )
}

export default function ExamRegistration() {
  const [examId, setExamId] = useState('translation')
  const [subjectId, setSubjectId] = useState('ttt')
  const [gradeId, setGradeId] = useState('pro2')
  const [regionFilter, setRegionFilter] = useState('전체')
  const [receptionFilter, setReceptionFilter] = useState('전체')
  const [scheduleId, setScheduleId] = useState('TR-01')
  const [applyType, setApplyType] = useState('individual')
  const [addOnIds, setAddOnIds] = useState(['certificate'])
  const [agreeAll, setAgreeAll] = useState(true)
  const [notifyAgreed, setNotifyAgreed] = useState(true)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [applicationResult, setApplicationResult] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [feedbackOption, setFeedbackOption] = useState(false)
  const [certType, setCertType] = useState('card')
  const [applicant, setApplicant] = useState({
    name: '박지원',
    birthdate: '1994-02-18',
    phone: '010-1234-5678',
    email: 'jiwon@example.com',
    address: '서울시 강남구 테헤란로',
    address_detail: '',
    nationality: '대한민국',
    emergency_contact: '',
    photo_file_name: '',
  })
  const [groupInfo, setGroupInfo] = useState({
    organization: '',
    business_no: '',
    manager: '',
    manager_phone: '',
    member_count: '',
    tax_invoice: '발급 필요',
  })

  const selectedExam = examTypes.find((exam) => exam.id === examId)
  const subjects = subjectsByExam[examId]
  const grades = gradesByExam[examId]
  const selectedSubject = subjects.find(([id]) => id === subjectId) || subjects[0]
  const selectedGrade = grades.find(([id]) => id === gradeId) || grades[0]
  const selectedSchedule = scheduleRows.find((row) => row.id === scheduleId) || scheduleRows[0]

  const filteredSchedules = scheduleRows.filter((row) => {
    const examOk = row.exam === examId
    const regionOk = regionFilter === '전체' || row.region === regionFilter
    const receptionOk = receptionFilter === '전체' || row.reception === receptionFilter
    return examOk && regionOk && receptionOk
  })

  const addOnTotal = useMemo(
    () => addOnIds.reduce((sum, id) => sum + (addOns.find(([itemId]) => itemId === id)?.[2] || 0), 0),
    [addOnIds]
  )
  const basePrice = selectedGrade[4]
  const total = basePrice + addOnTotal

  const updateApplicant = (key, value) => {
    setApplicant((current) => ({ ...current, [key]: value }))
  }

  const updateGroupInfo = (key, value) => {
    setGroupInfo((current) => ({ ...current, [key]: value }))
  }

  const changeExam = (id) => {
    const nextSubjects = subjectsByExam[id]
    const nextGrades = gradesByExam[id]
    const firstSchedule = scheduleRows.find((row) => row.exam === id)
    setExamId(id)
    setSubjectId(nextSubjects[0][0])
    setGradeId(nextGrades[0][0])
    setScheduleId(firstSchedule?.id || '')
    setRegionFilter('전체')
    setReceptionFilter('전체')
    setDone(false)
    setSubmitError('')
  }

  const toggleAddOn = (id) => {
    setAddOnIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setDone(false)
    setApplicationResult(null)

    if (!agreeAll) {
      setSubmitError('필수 약관에 동의해야 접수를 완료할 수 있습니다.')
      return
    }

    if (['개발 예정', '추후 개발'].includes(selectedSchedule.status)) {
      setSubmitError('아직 접수 가능한 일정이 아닙니다. 접수 중 또는 접수 전 일정을 선택해주세요.')
      return
    }

    const selectedAddOns = addOns
      .filter(([id]) => addOnIds.includes(id))
      .map(([id, label, price, desc]) => ({ id, label, price, desc }))

    const payload = {
      applicant,
      application_type: applyType,
      group_info: applyType === 'group' ? groupInfo : null,
      exam: {
        type: examId,
        name: selectedExam.name,
        subject_id: selectedSubject[0],
        subject_name: selectedSubject[1],
        grade_id: selectedGrade[0],
        grade_name: selectedGrade[1],
        grade_price: basePrice,
        round_name: selectedSchedule.round,
        reception_type: selectedSchedule.reception,
        feedback_option: feedbackOption,
      },
      schedule: selectedSchedule,
      add_ons: selectedAddOns,
      cert: {
        requested: addOnIds.includes('certificate'),
        type: addOnIds.includes('certificate') ? certType : null,
        amount: addOnIds.includes('certificate') ? (addOns.find(([id]) => id === 'certificate')?.[2] || 0) : 0,
      },
      payment: {
        method: paymentMethod,
        base_amount: basePrice,
        add_on_amount: addOnTotal,
        discount_amount: 0,
        point_used: 0,
        coupon_code: '',
        total_amount: total,
        status: 'pending',
      },
      agreements: {
        terms_agreed: agreeAll,
        privacy_agreed: agreeAll,
        refund_agreed: agreeAll,
        notify_agreed: notifyAgreed,
      },
    }

    try {
      setSubmitting(true)
      const result = await api.createExamApplication(payload)
      setApplicationResult(result.application)
      setDone(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#f6f7fb] py-4 text-slate-900">
      <form onSubmit={submit} className="mx-auto w-full max-w-[1080px] border border-gray-200 bg-white shadow-sm">
        <header id="top" className="border-b border-gray-200 px-4 py-3">
          <div className="grid gap-3 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-gradient-to-br from-primary-500 to-accent-600 text-xs font-black text-white">HT</div>
              <div>
                <h1 className="text-base font-black text-slate-950">휴텍씨 AI 시험 접수 플랫폼</h1>
                <p className="text-[10px] font-medium text-slate-500">시험 일정 → 접수 → 결제 → 수험표 → 응시 → 결과/자격증</p>
              </div>
            </div>
            <div className="hidden lg:block" />
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-black">
              <span className="rounded border border-primary-200 bg-primary-50 px-2 py-1 text-primary-700">번역시험 핵심 개발</span>
              <span className="rounded border border-accent-200 bg-accent-50 px-2 py-1 text-accent-700">접수·결제 모듈</span>
              <span className="rounded border border-gray-200 bg-white px-2 py-1 text-slate-600">DB 저장 연동</span>
            </div>
          </div>

          <div className="mt-3 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
            {platformMenus.map(([label, path, desc]) => (
              <div key={label} className={`rounded border px-2 py-1.5 ${path === '/exams' ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-[11px] font-black text-slate-950">{label}</strong>
                  <span className="text-[9px] font-bold text-slate-400">{path}</span>
                </div>
                <p className="mt-0.5 truncate text-[9px] text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </header>

        <Section id="guide" code="01 PLATFORM" title="시험 종류" note="엑셀 플랫폼 개요 기준 3가지 AI 자격 시험">
          <div className="grid gap-1.5 lg:grid-cols-3">
            {examTypes.map((exam) => (
              <ChoiceCard
                key={exam.id}
                checked={examId === exam.id}
                onChange={() => changeExam(exam.id)}
                title={exam.name}
                desc={exam.purpose}
                meta={`${exam.english} · 대상: ${exam.target}`}
                badge={exam.status}
              />
            ))}
          </div>
          <div className="mt-2 grid gap-1.5 border border-gray-200 bg-slate-50 p-2 text-[10px] lg:grid-cols-5">
            <div><b>문제 형식</b><p>{selectedExam.format}</p></div>
            <div><b>채점 방식</b><p>{selectedExam.grading}</p></div>
            <div><b>시험 환경</b><p>{examId === 'translation' ? '온라인 / 오프라인 선택' : examId === 'prompt' ? '온라인 PC 브라우저' : '온라인 PC·모바일'}</p></div>
            <div><b>성적 발표</b><p>{selectedExam.result}</p></div>
            <div><b>자격증</b><p>{selectedExam.certificate}</p></div>
          </div>
        </Section>

        <Section id="subjects" code="02 SUBJECT" title="검정 과목·등급" note="시험별 세부 과목, 파일 형식, 등급 체계">
          <div className="grid gap-3 lg:grid-cols-[1fr_.9fr]">
            <div>
              <div className="mb-1.5 flex items-center gap-1 text-[10px] font-black text-slate-600"><FileText size={13} /> 검정 과목</div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {subjects.map(([id, label, desc, file]) => (
                  <ChoiceCard key={id} checked={subjectId === id} onChange={() => setSubjectId(id)} title={label} desc={desc} meta={`관련 파일: ${file}`} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center gap-1 text-[10px] font-black text-slate-600"><Award size={13} /> 등급 선택</div>
              <div className="grid gap-1.5">
                {grades.map(([id, label, target, desc, price]) => (
                  <ChoiceCard key={id} checked={gradeId === id} onChange={() => setGradeId(id)} title={label} desc={desc} meta={`${target} · ${won(price)}`} />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section id="schedule" code="03 SCHEDULE" title="시험 일정" note="시험 기간, 지역, 접수 구분, 차수, 상태, 결과 발표일">
          <div className="grid gap-2 lg:grid-cols-[1fr_160px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-slate-400" />
              <input className="h-8 w-full rounded border border-gray-300 bg-white pl-8 pr-2 text-[11px] outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100" placeholder="시험명, 검정 과목, 지역 검색" />
            </label>
            <select value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)} className={inputClass}>
              {['전체', '온라인', '서울', '부산'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={receptionFilter} onChange={(event) => setReceptionFilter(event.target.value)} className={inputClass}>
              {['전체', '정기', '수시', '미정'].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="mt-2 overflow-hidden border border-gray-200">
            <div className="grid grid-cols-[74px_1fr_90px_84px_72px_78px_76px_74px] bg-slate-50 text-[10px] font-black text-slate-500">
              {['상태', '시험명/과목', '시험일', '지역', '접수', '차수', '시간', '잔여'].map((head) => <div key={head} className="border-r border-gray-200 px-2 py-1.5 last:border-r-0">{head}</div>)}
            </div>
            {filteredSchedules.map((row) => (
              <button key={row.id} type="button" onClick={() => setScheduleId(row.id)} className={`grid w-full grid-cols-[74px_1fr_90px_84px_72px_78px_76px_74px] border-t border-gray-200 text-left text-[10px] hover:bg-primary-50 ${scheduleId === row.id ? 'bg-primary-50' : 'bg-white'}`}>
                <div className="px-2 py-1.5"><span className={`rounded-full border px-1.5 py-0.5 font-black ${statusStyle[row.status] || 'border-gray-200 bg-gray-50 text-gray-600'}`}>{row.status}</span></div>
                <div className="min-w-0 px-2 py-1.5"><b className="block truncate">{examTypes.find((exam) => exam.id === row.exam)?.name}</b><span className="block truncate text-slate-500">{row.subject} · {row.grade}</span></div>
                <div className="px-2 py-1.5 font-bold">{row.date}</div>
                <div className="px-2 py-1.5">{row.region}</div>
                <div className="px-2 py-1.5">{row.reception}</div>
                <div className="px-2 py-1.5">{row.round}</div>
                <div className="px-2 py-1.5">{row.start}~{row.end}</div>
                <div className="px-2 py-1.5 font-black text-primary-700">{row.seats ? `${row.seats}석` : '-'}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section id="apply" code="04 APPLY" title="접수 정보" note="사진 등록, 개인/단체 접수, 약관 동의">
          <div className="grid gap-2 md:grid-cols-4">
            <Field label="이름" required><input className={inputClass} value={applicant.name} onChange={(event) => updateApplicant('name', event.target.value)} /></Field>
            <Field label="생년월일" required><input className={inputClass} type="date" value={applicant.birthdate} onChange={(event) => updateApplicant('birthdate', event.target.value)} /></Field>
            <Field label="휴대폰" required><input className={inputClass} value={applicant.phone} onChange={(event) => updateApplicant('phone', event.target.value)} /></Field>
            <Field label="이메일" required><input className={inputClass} type="email" value={applicant.email} onChange={(event) => updateApplicant('email', event.target.value)} /></Field>
            <Field label="주소" className="md:col-span-2"><input className={inputClass} value={applicant.address} onChange={(event) => updateApplicant('address', event.target.value)} /></Field>
            <Field label="상세주소" className="md:col-span-2"><input className={inputClass} value={applicant.address_detail} onChange={(event) => updateApplicant('address_detail', event.target.value)} placeholder="동/호수 등" /></Field>
            <Field label="국적"><input className={inputClass} value={applicant.nationality} onChange={(event) => updateApplicant('nationality', event.target.value)} /></Field>
            <Field label="긴급 연락처"><input className={inputClass} value={applicant.emergency_contact} onChange={(event) => updateApplicant('emergency_contact', event.target.value)} placeholder="보호자/비상 연락처" /></Field>
            <Field label="사진 등록"><input className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-[11px]" type="file" accept="image/*" onChange={(event) => updateApplicant('photo_file_name', event.target.files?.[0]?.name || '')} /></Field>
            <Field label="접수 구분"><select value={applyType} onChange={(event) => setApplyType(event.target.value)} className={inputClass}><option value="individual">개인 접수</option><option value="group">B2B 단체 접수</option></select></Field>
          </div>
          {applyType === 'group' && (
            <div className="mt-2 grid gap-2 border border-accent-100 bg-accent-50 p-2 md:grid-cols-4">
              <Field label="기업/학교명"><input className={inputClass} value={groupInfo.organization} onChange={(event) => updateGroupInfo('organization', event.target.value)} placeholder="단체명" /></Field>
              <Field label="사업자등록번호"><input className={inputClass} value={groupInfo.business_no} onChange={(event) => updateGroupInfo('business_no', event.target.value)} placeholder="000-00-00000" /></Field>
              <Field label="담당자"><input className={inputClass} value={groupInfo.manager} onChange={(event) => updateGroupInfo('manager', event.target.value)} placeholder="담당자명" /></Field>
              <Field label="담당자 연락처"><input className={inputClass} value={groupInfo.manager_phone} onChange={(event) => updateGroupInfo('manager_phone', event.target.value)} placeholder="02-000-0000" /></Field>
              <Field label="응시 인원"><input className={inputClass} type="number" value={groupInfo.member_count} onChange={(event) => updateGroupInfo('member_count', event.target.value)} placeholder="명" /></Field>
              <Field label="세금계산서"><select className={inputClass} value={groupInfo.tax_invoice} onChange={(event) => updateGroupInfo('tax_invoice', event.target.value)}><option>발급 필요</option><option>불필요</option></select></Field>
            </div>
          )}
          <div className="mt-2 grid gap-1.5 md:grid-cols-3">
            <InlineOption checked={agreeAll} onChange={() => setAgreeAll(!agreeAll)}>전체 동의 · 이용약관, 개인정보 수집·이용, 응시 규정, 환불 규정</InlineOption>
            <InlineOption checked={notifyAgreed} onChange={() => setNotifyAgreed(!notifyAgreed)}>수험표 즉시 조회 및 이메일/카카오 알림 수신</InlineOption>
            <InlineOption checked={feedbackOption} onChange={() => setFeedbackOption(!feedbackOption)}>개별 피드백 신청 (전문가 첨삭 · 결과 발표 후)</InlineOption>
          </div>
        </Section>

        <Section id="payment" code="05 PAYMENT" title="결제·완료" note="응시료, 자격증 발급비, AI 분석 상품, 환불 신청">
          <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="grid gap-1.5 sm:grid-cols-3">
                {addOns.map(([id, label, price, desc]) => (
                  <ChoiceCard key={id} checked={addOnIds.includes(id)} onChange={() => toggleAddOn(id)} title={label} desc={desc} meta={`+${won(price)}`} />
                ))}
              </div>
              {addOnIds.includes('certificate') && (
                <div className="mt-2 flex items-center gap-2 border border-primary-100 bg-primary-50 px-2 py-1.5">
                  <span className="text-[10px] font-black text-slate-600">자격증 종류</span>
                  <select className={`${inputClass} max-w-[220px]`} value={certType} onChange={(event) => setCertType(event.target.value)}>
                    <option value="card">카드 자격증</option>
                    <option value="certificate">자격증(상장형)</option>
                    <option value="original_copy">원본대조필</option>
                    <option value="service_confirm">봉사확인서</option>
                  </select>
                </div>
              )}
              <div className="mt-2 grid border border-indigo-100 bg-indigo-50 text-[10px] md:grid-cols-6">
                {[
                  ['시험', selectedExam.name],
                  ['과목', selectedSubject[1]],
                  ['등급', selectedGrade[1]],
                  ['일정', selectedSchedule.date],
                  ['지역', selectedSchedule.region],
                  ['수험표', '결제 후 즉시'],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 border-b border-indigo-100 px-2 py-1.5 md:border-b-0 md:border-r md:last:border-r-0">
                    <div className="font-black text-slate-500">{label}</div>
                    <div className="truncate font-black text-slate-950">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <aside className="border border-gray-200 bg-white">
              <div className="grid grid-cols-[92px_1fr] border-b border-gray-200 text-[11px]"><b className="bg-slate-50 px-2 py-2 text-[10px] text-slate-600">응시료</b><span className="px-2 py-2 font-black">{won(basePrice)}</span></div>
              <div className="grid grid-cols-[92px_1fr] border-b border-gray-200 text-[11px]"><b className="bg-slate-50 px-2 py-2 text-[10px] text-slate-600">추가 상품</b><span className="px-2 py-2 font-black">{won(addOnTotal)}</span></div>
              <div className="grid grid-cols-[92px_1fr] border-b border-gray-200 text-[11px]"><b className="bg-slate-50 px-2 py-2 text-[10px] text-slate-600">결제 수단</b><span className="px-2 py-1"><select className={inputClass} value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value="card">카드결제</option><option value="point">포인트 사용</option><option value="virtual_account">가상계좌</option></select></span></div>
              <div className="flex items-center justify-between bg-primary-50 px-3 py-2"><b className="text-[12px]">최종 결제</b><strong className="text-lg font-black text-primary-700">{won(total)}</strong></div>
              <div className="border-t border-orange-200 bg-orange-50 px-3 py-2 text-[10px] leading-5 text-orange-800">현재 결제 PG는 미연동 상태입니다. 접수 정보와 결제 예정 금액을 DB에 저장하고, 관리자에서 결제 상태를 변경할 수 있습니다.</div>
            </aside>
          </div>
        </Section>

        <div id="results" className="scroll-mt-20" />
        {submitError && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-[12px] font-bold text-red-700">
            {submitError}
          </div>
        )}
        {done && applicationResult && (
          <div className="border-b border-primary-200 bg-primary-50 px-4 py-3 text-[12px] font-bold text-primary-800">
            <CheckCircle2 className="mr-1 inline h-4 w-4" /> 접수번호 {applicationResult.application_no} 접수가 DB에 저장되었습니다. 관리자 페이지의 시험 접수 탭에서 바로 확인할 수 있습니다.
          </div>
        )}

        <div className="grid gap-1.5 border-t border-gray-200 bg-slate-50 px-3 py-3 md:grid-cols-[1fr_1fr_1fr_1.4fr]">
          <button type="button" className="flex min-h-9 items-center justify-center gap-1 rounded border border-gray-300 bg-white text-[11px] font-black text-slate-700"><ClipboardList size={14} /> 임시 저장</button>
          <button id="ticket" type="button" className="flex min-h-9 items-center justify-center gap-1 rounded border border-gray-300 bg-white text-[11px] font-black text-slate-700"><Ticket size={14} /> 수험표 미리보기</button>
          <button type="button" className="flex min-h-9 items-center justify-center gap-1 rounded border border-gray-300 bg-white text-[11px] font-black text-slate-700"><CalendarDays size={14} /> 일정 변경</button>
          <button type="submit" disabled={submitting} className="flex min-h-9 items-center justify-center gap-1 rounded border border-primary-600 bg-primary-600 text-[11px] font-black text-white disabled:cursor-wait disabled:opacity-60"><CreditCard size={14} /> {submitting ? '접수 저장 중...' : '결제하고 접수 완료'}</button>
        </div>
      </form>
    </div>
  )
}