import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

const questions = [
  { axis: 'EU AI Act', q: 'EU AI Act Article 13에서 요구하는 "투명성" 의무의 핵심 내용은?', options: ['AI 가격 공개 의무', '고위험 AI의 능력·한계·감독 방법을 이용자가 이해하도록 설계', '개발자 명단 공개', '학습 데이터 전체 공개'], ans: 1 },
  { axis: 'EU AI Act', q: 'EU AI Act에서 "금지 AI 관행(Prohibited Practices)" 시행 시점은?', options: ['2024년 2월', '2024년 8월', '2025년 8월', '2026년 전면 시행'], ans: 1 },
  { axis: 'AI 기본법', q: '한국 AI 기본법의 "고영향 AI" 정의에 해당하지 않는 분야는?', options: ['채용·인사 자동화', '의료·건강 관련 자동 판단', '개인 음악 추천 서비스', '금융 신용평가 자동화'], ans: 2 },
  { axis: 'AI 기본법', q: '한국 AI 기본법 제정의 주요 입법 목적으로 가장 적절한 것은?', options: ['AI 사용 전면 규제', 'AI 발전과 신뢰 기반 조성의 균형 추구', 'AI 수출 제한', '외국 AI 서비스 금지'], ans: 1 },
  { axis: '진단 설계', q: 'AI 윤리 진단 문항 설계 시 가중치 부여가 필요한 이유는?', options: ['문항 수를 줄이기 위해', '산업·기업 특성에 따라 위험도가 다른 영역의 중요도를 차등 반영', '시간을 단축하기 위해', '비용 절감을 위해'], ans: 1 },
  { axis: '진단 설계', q: '프롬프트 기반 AI 윤리 평가의 차별적 특징은?', options: ['처리 속도가 빠름', '입력 행동과 결과를 통해 실제 AI 사용 패턴의 윤리성을 평가', '비용이 저렴', '결과가 단순하고 명확'], ans: 1 },
  { axis: '사례 분석', q: '2023년 삼성 직원 ChatGPT 기밀 입력 사건의 핵심 시사점은?', options: ['AI 사용 전면 금지 필요', '외부 AI 도구 데이터 입력 기준과 내부 사용 정책 수립의 필요성', 'AI 개발사 책임', '직원 교육 불필요'], ans: 1 },
  { axis: '사례 분석', q: 'Amazon AI 채용 시스템 폐기 사례의 핵심 문제는?', options: ['AI 처리 속도', '여성 지원자에게 불이익을 준 학습 데이터 편향', '비용 과다', '특허 문제'], ans: 1 },
  { axis: '리포트 작성', q: '경영진 AI 윤리 리스크 보고서에 반드시 포함되어야 하는 항목은?', options: ['AI 색상 디자인', '리스크 등급·발생 가능성·잠재 피해액·개선 우선순위', 'AI 구매 가격 비교', '직원 명단'], ans: 1 },
  { axis: '리포트 작성', q: '기업 AI 윤리 개선 로드맵 수립 시 우선순위 결정 기준은?', options: ['비용이 적은 순', '리스크 심각도 × 발생 가능성이 높은 영역부터', '담당자 선호도', '알파벳 순서'], ans: 1 },
  { axis: '컨설팅', q: '기업 AI 윤리 컨설팅 초기 단계에서 가장 먼저 해야 할 것은?', options: ['즉시 개선안 제시', '현황 진단: AI 사용 현황·정책 유무·사고 이력 파악', '경쟁사 조사', '예산 협의'], ans: 1 },
  { axis: '컨설팅', q: '기업 AI 윤리 정책 수립에 내부 저항이 있을 때 컨설턴트의 접근법은?', options: ['강압적으로 추진', '규제 위반 리스크와 준수 이점을 데이터로 제시', '프로젝트 포기', '외부 감사 위협'], ans: 1 },
  { axis: 'NIST RMF', q: 'NIST AI RMF "Map(지도)" 기능의 주요 내용은?', options: ['AI 리스크 대응 계획 수립', 'AI 시스템 맥락·용도·이해관계자 파악을 통한 리스크 식별', 'AI 성능 측정', 'AI 거버넌스 체계 구축'], ans: 1 },
  { axis: 'NIST RMF', q: 'NIST AI RMF와 EU AI Act의 핵심 차이는?', options: ['내용 차이 없음', 'NIST는 자발적 프레임워크, EU AI Act는 법적 구속력 있는 규제', '적용 국가만 다름', 'NIST가 더 강력한 규제'], ans: 1 },
  { axis: 'ISO 42001', q: 'ISO/IEC 42001:2023의 적용 범위가 아닌 것은?', options: ['AI 개발 조직', 'AI 도입·운영 조직', 'AI 관련 서비스 제공 조직', 'AI를 전혀 사용하지 않는 조직'], ans: 3 },
  { axis: 'ISO 42001', q: 'ISO/IEC 42001이 EU AI Act 대응에 도움이 되는 이유는?', options: ['직접 대체 가능', 'AI 관리 시스템 체계를 국제적으로 증명해 규제 준수 증빙에 활용', '같은 기관이 발행', '비용이 저렴'], ans: 1 },
  { axis: '강사 역량', q: '기업 AI 윤리 교육에서 사례 기반 강의가 이론 강의보다 효과적인 이유는?', options: ['강의 시간이 짧아서', '실제 맥락에서 판단력과 적용 능력을 키울 수 있으므로', '비용이 저렴해서', '평가가 쉬워서'], ans: 1 },
  { axis: '강사 역량', q: '다양한 산업 대상 AI 윤리 강의 설계의 핵심 접근법은?', options: ['모든 대상에 동일한 내용', '산업별 규제·사례·리스크를 맞춤화해 실무 연관성 높이기', '이론만 중심으로', '가장 쉬운 내용만 제공'], ans: 1 },
  { axis: '정책 설계', q: '기업 AI 사용 정책에서 "허용 AI 도구 목록" 관리가 필요한 이유는?', options: ['직원 불편 유발', '비승인 AI 도구에 기밀 정보 입력을 방지하고 법적 책임 소재 명확화', '비용 절감', '처리 속도 향상'], ans: 1 },
  { axis: '정책 설계', q: 'AI 윤리 사고 보고 체계에서 "익명 신고 채널"이 필요한 이유는?', options: ['비용 절감', '직원이 불이익 없이 AI 오용 사례를 신고할 심리적 안전감 확보', '기록 관리 편의', '법적 규정 요건만으로'], ans: 1 },
]

const axisColors = {
  'EU AI Act': 'bg-blue-50 border-blue-200 text-blue-700',
  'AI 기본법': 'bg-red-50 border-red-200 text-red-700',
  '진단 설계': 'bg-purple-50 border-purple-200 text-purple-700',
  '사례 분석': 'bg-amber-50 border-amber-200 text-amber-700',
  '리포트 작성': 'bg-slate-50 border-slate-200 text-slate-700',
  '컨설팅': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'NIST RMF': 'bg-cyan-50 border-cyan-200 text-cyan-700',
  'ISO 42001': 'bg-green-50 border-green-200 text-green-700',
  '강사 역량': 'bg-orange-50 border-orange-200 text-orange-700',
  '정책 설계': 'bg-indigo-50 border-indigo-200 text-indigo-700',
}

const gradeInfo = [
  { min: 88, label: '전문 1급 권장', color: 'text-green-600', msg: '최고 전문가 수준의 역량입니다. 전문 1급 자격 취득과 심사관·컨설팅 파트너 활동을 권장합니다.' },
  { min: 72, label: '전문 2급 권장', color: 'text-blue-600', msg: '전문가 수준입니다. 전문 2급 자격 취득 후 강사·컨설턴트로 활동하세요.' },
  { min: 56, label: '준전문가', color: 'text-yellow-600', msg: '기본 전문 지식은 있으나 심화 영역 보강이 필요합니다. 전문 2급 과정 수강을 권장합니다.' },
  { min: 40, label: '일반 1급 권장', color: 'text-orange-600', msg: '전문가 과정보다 일반 1급이 적합합니다. 법령·사례 분야 집중 학습이 필요합니다.' },
  { min: 0, label: '기초 보강 필요', color: 'text-red-600', msg: '전문가 과정 응시 전 기초·일반 교육부터 시작하는 것을 권장합니다.' },
]

export default function PaidDiagnosis3() {
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
      diagnosis_type: 'paid3',
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
      <div className="text-xs text-gray-400 mb-2"><Link to="/paid-diagnosis" className="hover:text-gray-600">유료 진단</Link> / 3단계</div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">유료 진단 3단계 — 전문가 자격 사전 진단</h1>
      <p className="text-sm text-gray-500 mb-1">20문항 · 법령·사례·진단설계·컨설팅 전문 역량 평가</p>
      <p className="text-3xl font-black text-primary-600 mb-6">39,000원</p>
      <ul className="text-left space-y-1 mb-8 inline-block">
        {['전문 2급·1급 자격시험 수준 평가','합격 가능성 예측 점수 제공','법령·사례·설계 역량 분리 분석','취약 학습 영역 세부 분석','권장 준비 기간 안내','재응시 1회 무료'].map(i => (
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
          <h1 className="text-base font-extrabold text-gray-900">유료 진단 3단계 — 전문가 자격 사전 진단</h1>
          <p className="text-xs text-gray-500">전문 2~1급 자격시험 수준의 문항입니다. 법령·사례·설계·컨설팅 역량을 평가합니다.</p>
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
        <div className="text-xs text-gray-400 mb-2">유료 진단 3단계 결과</div>
        <div className={`text-4xl font-black mb-1 ${result.grade.color}`}>{result.grade.label}</div>
        <div className="text-xl font-bold text-gray-700 mb-2">{result.pct}점 ({result.correct}/{result.total} 정답)</div>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">{result.grade.msg}</p>
      </div>
      <div className="mb-8">
        <h2 className="text-sm font-extrabold text-gray-900 mb-4">전문 영역별 점수</h2>
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
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">보강 필요 영역 Top 3</h2>
        <div className="grid grid-cols-3 gap-3">
          {result.weak.map((w, i) => (
            <div key={w.axis} className="border border-red-200 bg-red-50 rounded-lg p-3 text-center">
              <div className="text-[10px] text-red-400 font-bold mb-1">보강 {i + 1}</div>
              <div className="text-sm font-extrabold text-red-700 mb-1">{w.axis}</div>
              <div className="text-lg font-black text-red-600">{w.pct}%</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/education" className="bg-primary-600 text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-primary-700">전문가 교육 보기</Link>
        <Link to="/certificate" className="border border-primary-300 text-primary-700 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-primary-50">자격 안내</Link>
        <Link to="/expert" className="border border-gray-300 text-gray-600 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50">전문가 등록</Link>
        <button onClick={() => { setPhase('payment'); setAnswers({}); setResult(null) }} className="text-sm text-gray-400 hover:text-gray-600 underline">재응시</button>
      </div>
    </div>
  )
}
