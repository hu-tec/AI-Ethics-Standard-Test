import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

const questions = [
  { axis: '법·규제', q: 'EU AI Act에서 "허용 불가 AI 관행"에 해당하는 것은?', options: ['이미지 생성 AI', '공공장소 실시간 생체인식 AI', '번역 AI', '추천 알고리즘'], ans: 1 },
  { axis: '법·규제', q: 'NIST AI RMF의 4개 핵심 기능이 아닌 것은?', options: ['거버넌스(Govern)', '지도(Map)', '측정(Measure)', '배포(Deploy)'], ans: 3 },
  { axis: '의료 AI', q: 'AI 의료기기(SaMD) 도입 시 필수 검토 사항이 아닌 것은?', options: ['임상 근거 및 성능 검증', '개인정보 처리 방침', 'AI 색상·UI 디자인', '알고리즘 편향성 검사'], ans: 2 },
  { axis: '의료 AI', q: 'AI 진단 보조 시스템 사용 시 최종 의사결정 주체는?', options: ['AI가 자동 결정', '담당 의사', '병원 관리자', '보험사'], ans: 1 },
  { axis: '금융 AI', q: 'AI 신용평가에서 반드시 방지해야 할 것은?', options: ['처리 속도 저하', '인종·성별 등에 의한 알고리즘 차별', '고객 민원', '비용 증가'], ans: 1 },
  { axis: '금융 AI', q: '금융 AI 모델의 "설명가능성(XAI)"이 중요한 이유는?', options: ['속도 향상을 위해', '왜 그 결정을 내렸는지 이용자와 감독당국에 설명할 수 있어야 하므로', '비용 절감을 위해', '데이터 보호만을 위해'], ans: 1 },
  { axis: 'HR AI', q: 'AI 채용 필터링 도입 전 반드시 해야 할 것은?', options: ['즉시 사용 시작', '알고리즘 편향성 감사', '가장 저렴한 AI 선택', '채용 인원 확인'], ans: 1 },
  { axis: 'HR AI', q: 'AI가 면접을 자동 평가할 때 지원자에 대한 투명성 의무는?', options: ['없음', 'AI 평가 사용 사실을 지원자에게 고지', '비밀 유지', '회사 재량'], ans: 1 },
  { axis: '콘텐츠 AI', q: 'AI 생성 기사를 미디어에 게재 시 필수 절차는?', options: ['즉시 게재', '팩트체크 및 AI 생성 사실 표시', '제목만 수정 후 게재', '댓글 기능 비활성화'], ans: 1 },
  { axis: '콘텐츠 AI', q: '광고 이미지로 AI 생성 이미지 사용 시 확인 사항은?', options: ['파일 형식', '해당 AI 도구의 상업적 이용 약관 확인', '이미지 해상도', '색상 규격'], ans: 1 },
  { axis: '데이터', q: 'AI 학습용 데이터 수집 시 개인정보 보호법 준수 핵심은?', options: ['가능한 많이 수집', '정보주체 동의 또는 적법 근거 확보', '데이터 양 늘리기', '해외 서버 이용'], ans: 1 },
  { axis: '데이터', q: '개인정보 비식별화 처리 후에도 주의해야 하는 이유는?', options: ['비용 때문에', '재식별 가능성이 여전히 존재하므로', '처리 속도 문제', '저장 공간'], ans: 1 },
  { axis: '거버넌스', q: '기업 AI 윤리 위원회 구성 시 포함하지 않아도 되는 것은?', options: ['법률 전문가', '윤리학자', '경쟁사 직원', 'AI 기술 전문가'], ans: 2 },
  { axis: '거버넌스', q: 'ISO/IEC 42001:2023 인증의 목적은?', options: ['AI 성능 인증', 'AI 관리 시스템 국제 표준 준수 증명', 'AI 속도 인증', 'AI 비용 최적화'], ans: 1 },
  { axis: '교육·정책', q: '직원 AI 윤리 교육의 최우선 대상이 아닌 경우는?', options: ['AI 도구 실사용자', '경영진·의사결정자', '청소·시설 관리 직원', '데이터 관련 업무자'], ans: 2 },
  { axis: '교육·정책', q: '기업 AI 사용 정책에 반드시 포함되어야 할 항목이 아닌 것은?', options: ['허용 AI 도구 목록', '금지 데이터 유형', '직원 식사 메뉴', 'AI 사고 보고 절차'], ans: 2 },
  { axis: '리스크', q: '기업 AI 윤리 리스크 중 "평판 리스크"에 해당하는 사례는?', options: ['서버 과부하', 'AI 편향 차별 사건 언론 보도', '배터리 소모', '인터넷 속도 저하'], ans: 1 },
  { axis: '리스크', q: 'AI 도입 후 리스크 모니터링 주기로 가장 적절한 것은?', options: ['도입 시 1회만', '분기 또는 연간 정기 모니터링', '사고 발생 후에만', '필요 없음'], ans: 1 },
  { axis: '국제규제', q: 'UNESCO AI 윤리 권고안(2021)의 주요 특징은?', options: ['EU에만 법적 구속력 있음', '193개국 채택, AI를 인권·SDGs와 연계한 최초 글로벌 기준', 'EU만 적용', '기업에만 해당'], ans: 1 },
  { axis: '국제규제', q: 'G7 히로시마 AI 프로세스 "국제 행동규범"의 목적은?', options: ['AI 기술 독점', '생성형 AI 개발·운영 주체의 자발적 안전 준수 기준 제시', 'AI 판매 제한', '특정 국가 규제'], ans: 1 },
]

const axisColors = {
  '법·규제': 'bg-slate-50 border-slate-200 text-slate-700',
  '의료 AI': 'bg-red-50 border-red-200 text-red-700',
  '금융 AI': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'HR AI': 'bg-purple-50 border-purple-200 text-purple-700',
  '콘텐츠 AI': 'bg-orange-50 border-orange-200 text-orange-700',
  '데이터': 'bg-blue-50 border-blue-200 text-blue-700',
  '거버넌스': 'bg-cyan-50 border-cyan-200 text-cyan-700',
  '교육·정책': 'bg-green-50 border-green-200 text-green-700',
  '리스크': 'bg-rose-50 border-rose-200 text-rose-700',
  '국제규제': 'bg-indigo-50 border-indigo-200 text-indigo-700',
}

const gradeInfo = [
  { min: 90, label: '최우수', color: 'text-green-600', msg: '산업별 AI 윤리 역량이 전문가 수준입니다. 기업 컨설턴트 또는 강사로 활동할 수 있는 수준입니다.' },
  { min: 75, label: '우수', color: 'text-blue-600', msg: '직무·산업 AI 윤리를 잘 이해하고 있습니다. 1급 자격 취득을 권장합니다.' },
  { min: 60, label: '표준', color: 'text-yellow-600', msg: '기본기는 있으나 특정 산업 규제 이해가 부족합니다. 심화 교육을 권장합니다.' },
  { min: 45, label: '기초', color: 'text-orange-600', msg: '직무별 AI 윤리 기준 이해가 필요합니다. 산업별 맞춤 교육을 먼저 수강하세요.' },
  { min: 0, label: '위험', color: 'text-red-600', msg: '직무 현장에서 AI 윤리 사고 위험이 높습니다. 즉시 교육이 필요합니다.' },
]

export default function PaidDiagnosis2() {
  const [phase, setPhase] = useState('payment')
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const handleAnswer = (qi, val) => setAnswers(prev => ({ ...prev, [qi]: val }))

  const handleSubmit = async () => {
    let correct = 0
    const axisScores = {}
    questions.forEach((q, i) => {
      if (!axisScores[q.axis]) axisScores[q.axis] = { correct: 0, total: 0 }
      axisScores[q.axis].total++
      if (parseInt(answers[i]) === q.ans) { correct++; axisScores[q.axis].correct++ }
    })
    const pct = Math.round(correct / questions.length * 100)
    const grade = gradeInfo.find(g => pct >= g.min)
    const weak = Object.entries(axisScores)
      .map(([axis, s]) => ({ axis, pct: Math.round(s.correct / s.total * 100) }))
      .sort((a, b) => a.pct - b.pct).slice(0, 3)
    setResult({ correct, total: questions.length, pct, grade, axisScores, weak })
    setPhase('result')
    api.saveDiagnosis({
      diagnosis_type: 'paid2',
      score: correct,
      total: questions.length,
      percentage: pct,
      grade: grade?.label,
      axis_scores: axisScores,
      answers,
    }).catch(() => {})
  }

  const answered = Object.keys(answers).length
  const allAnswered = answered === questions.length

  if (phase === 'payment') return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="text-xs text-gray-400 mb-2"><Link to="/paid-diagnosis" className="hover:text-gray-600">유료 진단</Link> / 2단계</div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">유료 진단 2단계 — 직무·산업 심화</h1>
      <p className="text-sm text-gray-500 mb-1">20문항 · 의료·금융·HR·콘텐츠·법규제 전문 문항</p>
      <p className="text-3xl font-black text-primary-600 mb-6">79,000원</p>
      <ul className="text-left space-y-1 mb-8 inline-block">
        {['의료·금융·HR·콘텐츠 산업별 특화 문항','법령·규제 실무 적용 평가','동종 업계 평균과 비교 제공','업종별 핵심 리스크 분석','규제 대응 체크리스트 제공','결과 PDF + 컨설팅 상담 1회'].map(i => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-600"><span className="text-primary-500 font-bold">✓</span>{i}</li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPhase('test')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-3 rounded-lg text-sm transition-all">
          결제 후 진단 시작 (시뮬레이션)
        </button>
        <p className="text-[10px] text-gray-400 mt-3">실제 결제 연동 전 시뮬레이션입니다.</p>
      </div>
    </div>
  )

  if (phase === 'test') return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-extrabold text-gray-900">유료 진단 2단계 — 직무·산업 심화</h1>
          <p className="text-xs text-gray-500">각 문항에서 가장 적절한 답을 선택하세요</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-700">{answered} / {questions.length}</div>
          <div className="text-[10px] text-gray-400">답변 완료</div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {questions.map((q, i) => (
          <div key={i} className={`border rounded-lg p-3 ${answers[i] !== undefined ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${axisColors[q.axis] || 'bg-gray-100 border-gray-200 text-gray-600'}`}>{q.axis}</span>
              <span className="text-[10px] text-gray-400">Q{i + 1}</span>
            </div>
            <p className="text-xs font-semibold text-gray-800 leading-snug mb-2">{q.q}</p>
            <div className="space-y-1">
              {q.options.map((opt, j) => (
                <label key={j} className="flex items-start gap-1.5 cursor-pointer group">
                  <input type="radio" name={`q${i}`} value={j} checked={parseInt(answers[i]) === j} onChange={() => handleAnswer(i, j)} className="mt-0.5 shrink-0 accent-primary-600" />
                  <span className="text-[10px] text-gray-600 leading-tight group-hover:text-gray-900">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={handleSubmit} disabled={!allAnswered} className={`font-bold px-10 py-3 rounded-lg text-sm transition-all ${allAnswered ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          {allAnswered ? '결과 확인하기' : `${questions.length - answered}문항 더 답변해주세요`}
        </button>
      </div>
    </div>
  )

  if (phase === 'result' && result) return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <div className="text-xs text-gray-400 mb-2">유료 진단 2단계 결과</div>
        <div className={`text-5xl font-black mb-1 ${result.grade.color}`}>{result.grade.label}</div>
        <div className="text-xl font-bold text-gray-700 mb-2">{result.pct}점 ({result.correct}/{result.total} 정답)</div>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">{result.grade.msg}</p>
      </div>
      <div className="mb-8">
        <h2 className="text-sm font-extrabold text-gray-900 mb-4">분야별 점수</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(result.axisScores).map(([axis, s]) => {
            const pct = Math.round(s.correct / s.total * 100)
            return (
              <div key={axis} className="text-center">
                <div className={`text-xs font-bold px-2 py-1 rounded mb-2 ${axisColors[axis] || 'bg-gray-100 text-gray-600'}`}>{axis}</div>
                <div className={`text-lg font-black ${pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{pct}%</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className={`h-1.5 rounded-full ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{s.correct}/{s.total}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">취약 분야 Top 3</h2>
        <div className="grid grid-cols-3 gap-3">
          {result.weak.map((w, i) => (
            <div key={w.axis} className="border border-red-200 bg-red-50 rounded-lg p-3 text-center">
              <div className="text-[10px] text-red-400 font-bold mb-1">취약 {i + 1}</div>
              <div className="text-sm font-extrabold text-red-700 mb-1">{w.axis}</div>
              <div className="text-lg font-black text-red-600">{w.pct}%</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/education" className="bg-primary-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-primary-700">맞춤 교육 보기</Link>
        <Link to="/paid-diagnosis/3" className="border border-primary-300 text-primary-700 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-primary-50">3단계 전문가 진단</Link>
        <Link to="/paid-diagnosis" className="border border-gray-300 text-gray-600 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50">다른 진단 보기</Link>
        <button onClick={() => { setPhase('payment'); setAnswers({}); setResult(null) }} className="text-sm text-gray-400 hover:text-gray-600 underline">재응시</button>
      </div>
    </div>
  )
}
