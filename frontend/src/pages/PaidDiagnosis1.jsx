import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

const questions = [
  { axis: '투명성', q: 'AI 챗봇 운영 시 이용자에게 반드시 알려야 할 것은?', options: ['AI 모델 종류', '대화 상대가 AI임을 명시', '서버 위치', '응답 처리 시간'], ans: 1 },
  { axis: '투명성', q: 'AI 생성 보고서를 상사에게 제출할 때 올바른 방법은?', options: ['그대로 제출', 'AI 작성 표시 + 검토 후 제출', '일부 수정해 내 것처럼 제출', '정책 없으면 표시 불필요'], ans: 1 },
  { axis: '공정성', q: 'AI 채용 시스템 도입 전 반드시 해야 할 것은?', options: ['즉시 사용', '알고리즘 편향성 감사', '가장 저렴한 AI 선택', '직원 수 확인'], ans: 1 },
  { axis: '공정성', q: '의료 AI가 특정 인종에서 정확도가 낮은 원인으로 가장 적절한 것은?', options: ['AI 오류', '학습 데이터의 인종 편향', '하드웨어 문제', '처리 속도 차이'], ans: 1 },
  { axis: '책임성', q: 'AI 의료 오진으로 환자 피해 발생 시 주요 책임 주체는?', options: ['AI 자체', 'AI 개발사만', 'AI 도입·운영 의료기관과 의료진', '책임 없음'], ans: 2 },
  { axis: '책임성', q: 'AI 생성물 배포 전 반드시 해야 할 것은?', options: ['AI 이름 표기', '사실 확인 및 내용 검수', '배포 속도 최적화', '생성 비용 계산'], ans: 1 },
  { axis: '안전성', q: 'AI의 "환각(Hallucination)" 현상이란?', options: ['AI 처리 속도 저하', 'AI가 틀린 정보를 확신하며 생성', 'AI 화면 오류', '데이터 손실'], ans: 1 },
  { axis: '안전성', q: '고위험 AI에 필수적인 안전 장치는?', options: ['24시간 가동', '인간 개입·감독 체계', '최신 모델 사용', '클라우드 저장'], ans: 1 },
  { axis: '개인정보', q: '고객 개인정보를 외부 AI 도구에 입력하면?', options: ['문제없음', '개인정보 유출·법 위반 위험', '처리 속도 향상', '저작권 문제만 발생'], ans: 1 },
  { axis: '개인정보', q: 'AI 자동화 결정에 대해 이용자가 가지는 권리는?', options: ['없음', '설명 요구 및 이의제기 권리', '결과만 수용해야 함', '비용 환불 권리'], ans: 1 },
  { axis: '저작권', q: 'AI 생성 이미지의 저작권 현황으로 가장 정확한 것은?', options: ['항상 사용자에게', '항상 AI 개발사에게', '국가·법령마다 달라 현재 논쟁 중', '저작권이 존재하지 않음'], ans: 2 },
  { axis: '저작권', q: 'AI 번역을 계약서에 사용할 때의 주요 위험은?', options: ['없음', '오역으로 인한 법적 분쟁·책임 문제', '처리 속도 저하', '비용 과다'], ans: 1 },
  { axis: '컴플라이언스', q: 'EU AI Act에서 "고위험 AI"에 해당하지 않는 것은?', options: ['의료 진단 AI', '채용·인사 AI', '이미지 생성 AI', '신용평가 AI'], ans: 2 },
  { axis: '컴플라이언스', q: '한국 AI 기본법(2026.1 시행)에서 고영향 AI 의무는?', options: ['사용 전면 금지', 'AI 활용 사실 이용자 고지', '연간 정부 감사', '정부 사전 승인 필요'], ans: 1 },
  { axis: 'ESG', q: 'AI의 ESG 환경(E) 항목 핵심 이슈는?', options: ['AI 색상 디자인', 'AI 에너지 소비·탄소 배출', 'AI 업데이트 빈도', 'AI 가격'], ans: 1 },
  { axis: 'ESG', q: 'AI의 ESG 거버넌스(G) 항목에 해당하는 것은?', options: ['AI 탄소 배출량', '알고리즘 차별 방지', 'AI 의사결정 투명성·내부 감독 체계', '디지털 격차 해소'], ans: 2 },
  { axis: '딥페이크', q: '딥페이크 성범죄 영상 발견 시 즉각 행동은?', options: ['공유해서 알림', '무시', '방통심의위·경찰 신고', '직접 삭제 요청'], ans: 2 },
  { axis: '딥페이크', q: 'AI 생성 콘텐츠에 워터마크를 삽입하는 이유는?', options: ['파일 크기 증가', 'AI 생성 여부를 사후 식별 가능하도록', '색상 보정', '처리 속도 향상'], ans: 1 },
  { axis: '실무', q: '회사 AI 도입 전 가장 먼저 해야 할 것은?', options: ['즉시 전직원 사용', '내부 AI 사용 정책 수립', '최신 AI 무조건 구매', '경쟁사 AI와 비교'], ans: 1 },
  { axis: '실무', q: 'AI가 틀린 정보를 자신감 있게 제시할 때 올바른 대처는?', options: ['AI가 맞다고 믿고 사용', '독립 출처로 사실 확인 후 사용', 'AI 즉시 교체', '항상 AI 미사용'], ans: 1 },
]

const axisColors = {
  '투명성': 'bg-blue-50 border-blue-200 text-blue-700',
  '공정성': 'bg-green-50 border-green-200 text-green-700',
  '책임성': 'bg-purple-50 border-purple-200 text-purple-700',
  '안전성': 'bg-red-50 border-red-200 text-red-700',
  '개인정보': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  '저작권': 'bg-orange-50 border-orange-200 text-orange-700',
  '컴플라이언스': 'bg-cyan-50 border-cyan-200 text-cyan-700',
  'ESG': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  '딥페이크': 'bg-rose-50 border-rose-200 text-rose-700',
  '실무': 'bg-indigo-50 border-indigo-200 text-indigo-700',
}

const gradeInfo = [
  { min: 90, label: '최우수', color: 'text-green-600', msg: '전문가 수준의 AI 윤리 역량을 갖추고 있습니다. 전문 2급 자격 도전을 권장합니다.' },
  { min: 75, label: '우수', color: 'text-blue-600', msg: '양호한 수준입니다. 취약 영역을 집중 보완하면 1급 자격 취득이 가능합니다.' },
  { min: 60, label: '표준', color: 'text-yellow-600', msg: '기본기는 있으나 실무 적용에 취약점이 있습니다. 3급부터 자격 과정을 권장합니다.' },
  { min: 45, label: '기초', color: 'text-orange-600', msg: '핵심 개념 이해가 부족합니다. 기초 교육 수강 후 재진단을 권장합니다.' },
  { min: 0, label: '위험', color: 'text-red-600', msg: 'AI 사용 중 법적·윤리적 사고 위험이 높습니다. 즉시 기초 교육이 필요합니다.' },
]

export default function PaidDiagnosis1() {
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
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3)
    const resultData = { correct, total: questions.length, pct, grade, axisScores, weak }
    setResult(resultData)
    setPhase('result')
    // 백엔드 저장 (로그인 여부와 무관하게 저장, 비로그인 시 user_id=null)
    api.saveDiagnosis({
      diagnosis_type: 'paid1',
      score: correct,
      total: questions.length,
      percentage: pct,
      grade: grade?.label,
      axis_scores: axisScores,
      answers,
    }).catch(() => {}) // 저장 실패해도 결과 화면은 정상 표시
  }

  const answered = Object.keys(answers).length
  const allAnswered = answered === questions.length

  if (phase === 'payment') return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <div className="text-xs text-gray-400 mb-2"><Link to="/paid-diagnosis" className="hover:text-gray-600">유료 진단</Link> / 1단계</div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">유료 진단 1단계 — 기초 심화</h1>
      <p className="text-sm text-gray-500 mb-1">20문항 · 10개 평가 축 · 전국 백분위 비교</p>
      <p className="text-3xl font-black text-primary-600 mb-6">49,000원</p>
      <ul className="text-left space-y-1 mb-8 inline-block">
        {['20문항 10개 축 전체 평가','축별 점수 + 취약 영역 분석','개인 맞춤 학습 경로 제안','권장 자격 급수 자동 산정','결과 PDF 다운로드','재응시 1회 무료'].map(i => (
          <li key={i} className="flex items-center gap-2 text-xs text-gray-600"><span className="text-primary-500 font-bold">✓</span>{i}</li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPhase('test')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-3 rounded-lg text-sm transition-all">
          결제 후 진단 시작 (시뮬레이션)
        </button>
        <p className="text-[10px] text-gray-400 mt-3">실제 결제 연동 전 시뮬레이션입니다. 버튼 클릭 시 바로 진단이 시작됩니다.</p>
      </div>
    </div>
  )

  if (phase === 'test') return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-extrabold text-gray-900">유료 진단 1단계 — 기초 심화</h1>
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
                  <input
                    type="radio" name={`q${i}`} value={j}
                    checked={parseInt(answers[i]) === j}
                    onChange={() => handleAnswer(i, j)}
                    className="mt-0.5 shrink-0 accent-primary-600"
                  />
                  <span className="text-[10px] text-gray-600 leading-tight group-hover:text-gray-900">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`font-bold px-10 py-3 rounded-lg text-sm transition-all ${allAnswered ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          {allAnswered ? '결과 확인하기' : `${questions.length - answered}문항 더 답변해주세요`}
        </button>
      </div>
    </div>
  )

  if (phase === 'result' && result) return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <div className="text-xs text-gray-400 mb-2">유료 진단 1단계 결과</div>
        <div className={`text-5xl font-black mb-1 ${result.grade.color}`}>{result.grade.label}</div>
        <div className="text-xl font-bold text-gray-700 mb-2">{result.pct}점 ({result.correct}/{result.total} 정답)</div>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">{result.grade.msg}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-extrabold text-gray-900 mb-4">축별 점수</h2>
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
        <h2 className="text-sm font-extrabold text-gray-900 mb-3">취약 영역 Top 3</h2>
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
        <Link to="/certificate" className="border border-primary-300 text-primary-700 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-primary-50">자격 안내</Link>
        <Link to="/paid-diagnosis" className="border border-gray-300 text-gray-600 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-gray-50">다른 진단 보기</Link>
        <button onClick={() => { setPhase('payment'); setAnswers({}); setResult(null) }} className="text-sm text-gray-400 hover:text-gray-600 underline">재응시</button>
      </div>
    </div>
  )
}
