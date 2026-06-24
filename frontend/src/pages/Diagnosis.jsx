import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, XCircle, RotateCcw } from 'lucide-react'

const diagnosisTypes = [
  {
    id: 'free',
    label: '무료 진단',
    tag: 'FREE',
    tagColor: 'bg-green-100 text-green-700',
    desc: '15문항, 약 5분, AI 윤리 기초 수준 파악',
    target: '누구나',
    icon: '🎯',
  },
  {
    id: 'general',
    label: '일반 유료 진단',
    tag: '유료',
    tagColor: 'bg-blue-100 text-blue-700',
    desc: '20문항, 개인·직장인 취약 영역 분석 + 리포트',
    target: '직장인·대학생',
    icon: '📊',
  },
  {
    id: 'expert',
    label: '전문가 진단',
    tag: '유료',
    tagColor: 'bg-blue-100 text-blue-700',
    desc: '30문항, 강사·컨설턴트 역량 심층 평가',
    target: '강사·컨설턴트',
    icon: '🏆',
  },
  {
    id: 'b2b',
    label: 'B2B 직원 진단',
    tag: 'B2B',
    tagColor: 'bg-purple-100 text-purple-700',
    desc: '부서별 AI 윤리 이해도 분석 + 기업 리포트',
    target: '기업·기관',
    icon: '🏢',
  },
  {
    id: 'child',
    label: '자녀·초등 진단',
    tag: '부모',
    tagColor: 'bg-rose-100 text-rose-700',
    desc: '"우리 아이는 AI 윤리에 안전한가요?"',
    target: '학부모·아동',
    icon: '👧',
  },
]

const questions = [
  {
    id: 1,
    axis: '투명성',
    text: 'AI로 만든 콘텐츠(글, 이미지, 영상 등)를 사용할 때 AI를 사용했다고 표시하는 편인가요?',
    options: [
      { text: '항상 표시합니다', score: 5 },
      { text: '중요한 경우에는 표시합니다', score: 4 },
      { text: '가끔 표시합니다', score: 2 },
      { text: '표시하지 않습니다', score: 1 },
    ],
  },
  {
    id: 2,
    axis: '정확성',
    text: 'AI가 생성한 정보(통계, 사실, 법률 등)를 그대로 사용하기 전에 별도로 검증하나요?',
    options: [
      { text: '항상 원본 자료로 검증합니다', score: 5 },
      { text: '대부분의 경우 검증합니다', score: 4 },
      { text: '의심스러울 때만 검증합니다', score: 2 },
      { text: '검증 없이 사용합니다', score: 1 },
    ],
  },
  {
    id: 3,
    axis: '개인정보·보안',
    text: '업무용 AI 도구에 고객 개인정보, 내부 기밀자료, 영업비밀 등을 입력한 적이 있나요?',
    options: [
      { text: '전혀 없습니다', score: 5 },
      { text: '익명화 처리 후에만 입력합니다', score: 4 },
      { text: '가끔 입력한 적이 있습니다', score: 2 },
      { text: '자주 입력합니다', score: 1 },
    ],
  },
  {
    id: 4,
    axis: '저작권·권리보호',
    text: 'AI가 생성한 이미지, 텍스트, 음악 등을 사용할 때 저작권 문제를 검토하나요?',
    options: [
      { text: '항상 저작권 검토 후 사용합니다', score: 5 },
      { text: '상업용 사용 시에는 검토합니다', score: 4 },
      { text: '잘 몰라서 그냥 사용합니다', score: 2 },
      { text: 'AI 생성물은 저작권 문제가 없다고 생각합니다', score: 1 },
    ],
  },
  {
    id: 5,
    axis: '공정성',
    text: 'AI 결과물에 특정 집단(성별, 인종, 나이, 장애)에 대한 편향이 없는지 확인하나요?',
    options: [
      { text: '항상 편향 여부를 검토합니다', score: 5 },
      { text: '민감한 주제일 때는 검토합니다', score: 4 },
      { text: '별로 생각해본 적이 없습니다', score: 2 },
      { text: 'AI는 공정하다고 생각합니다', score: 1 },
    ],
  },
  {
    id: 6,
    axis: '책임성',
    text: 'AI 결과물을 활용한 작업에서 문제가 생겼을 때 책임 주체가 명확하다고 생각하나요?',
    options: [
      { text: '사람·조직이 책임지며 절차가 명확합니다', score: 5 },
      { text: '대체로 명확합니다', score: 4 },
      { text: 'AI 제공사 책임이라고 생각합니다', score: 2 },
      { text: '생각해본 적 없습니다', score: 1 },
    ],
  },
  {
    id: 7,
    axis: '컴플라이언스',
    text: 'EU AI Act, 한국 AI 기본법, OECD AI 원칙 등 AI 관련 법·규제를 알고 있나요?',
    options: [
      { text: '잘 알고 있으며 업무에 반영합니다', score: 5 },
      { text: '대략적으로 알고 있습니다', score: 3 },
      { text: '들어본 적은 있습니다', score: 2 },
      { text: '전혀 모릅니다', score: 1 },
    ],
  },
  {
    id: 8,
    axis: '투명성',
    text: 'AI를 활용해 만든 보고서, 광고, 교육자료 등에 "AI 활용" 표기를 하고 있나요?',
    options: [
      { text: '항상 표기합니다', score: 5 },
      { text: '외부 배포 시에는 표기합니다', score: 4 },
      { text: '표기해야 하는지 몰랐습니다', score: 2 },
      { text: '표기할 필요 없다고 생각합니다', score: 1 },
    ],
  },
  {
    id: 9,
    axis: 'ESG·사회적 영향',
    text: 'AI 활용이 환경(에너지 소비), 사회(일자리, 격차), 거버넌스에 미치는 영향을 고려하나요?',
    options: [
      { text: '업무에서 적극 고려합니다', score: 5 },
      { text: '가끔 생각해봅니다', score: 3 },
      { text: '잘 모릅니다', score: 2 },
      { text: '고려한 적 없습니다', score: 1 },
    ],
  },
  {
    id: 10,
    axis: '정확성',
    text: 'AI가 생성한 내용이 잘못되었거나 편향되었을 때 수정·보완하는 절차가 있나요?',
    options: [
      { text: '명확한 검수·수정 절차가 있습니다', score: 5 },
      { text: '대부분 검토 후 수정합니다', score: 4 },
      { text: '발견하면 수정하는 편입니다', score: 2 },
      { text: '별도 절차가 없습니다', score: 1 },
    ],
  },
  {
    id: 11,
    axis: '개인정보·보안',
    text: '조직의 AI 사용 정책(어떤 도구를 써도 되는지, 어떤 데이터를 입력해도 되는지)이 있나요?',
    options: [
      { text: '명문화된 AI 사용 정책이 있습니다', score: 5 },
      { text: '구두 지침은 있습니다', score: 3 },
      { text: '없지만 필요하다고 생각합니다', score: 2 },
      { text: '없고 필요성을 잘 모릅니다', score: 1 },
    ],
  },
  {
    id: 12,
    axis: '공정성',
    text: 'AI 기반 채용, 평가, 대출 심사 등 자동화 의사결정에서 차별이 발생할 수 있다는 것을 알고 있나요?',
    options: [
      { text: '알고 있으며 예방 방안을 적용합니다', score: 5 },
      { text: '알고 있습니다', score: 3 },
      { text: '처음 듣습니다', score: 1 },
      { text: 'AI는 차별하지 않는다고 생각합니다', score: 1 },
    ],
  },
  {
    id: 13,
    axis: '책임성',
    text: 'AI로 생성한 딥페이크, 보이스클로닝, 허위 정보 등의 위험성을 교육받거나 인식하고 있나요?',
    options: [
      { text: '잘 알고 있으며 예방 활동을 합니다', score: 5 },
      { text: '위험성은 알고 있습니다', score: 3 },
      { text: '뉴스에서 본 적은 있습니다', score: 2 },
      { text: '잘 모릅니다', score: 1 },
    ],
  },
  {
    id: 14,
    axis: '저작권·권리보호',
    text: '타인의 목소리, 얼굴, 글쓰기 스타일을 AI로 모방·복제할 때 당사자 동의가 필요하다고 생각하나요?',
    options: [
      { text: '당연히 동의가 필요합니다', score: 5 },
      { text: '상업적 목적일 때는 필요합니다', score: 3 },
      { text: '잘 모르겠습니다', score: 2 },
      { text: 'AI로 만든 것이니 괜찮다고 생각합니다', score: 1 },
    ],
  },
  {
    id: 15,
    axis: 'ESG·사회적 영향',
    text: '앞으로 AI 윤리가 기업의 ESG 평가, 법적 규제, 투자 기준에 포함될 것으로 생각하나요?',
    options: [
      { text: '이미 포함되고 있습니다', score: 5 },
      { text: '곧 포함될 것으로 생각합니다', score: 4 },
      { text: '잘 모르겠습니다', score: 2 },
      { text: '해당 없다고 생각합니다', score: 1 },
    ],
  },
]

const axes = ['투명성', '정확성', '개인정보·보안', '저작권·권리보호', '공정성', '책임성', 'ESG·사회적 영향', '컴플라이언스']

function getGrade(score, max) {
  const pct = (score / max) * 100
  if (pct >= 80) return { label: '우수', color: 'text-green-600', bg: 'bg-green-100', icon: <CheckCircle size={48} className="text-green-500" />, desc: 'AI 윤리에 대한 이해와 실천이 우수합니다. 전문가 과정을 통해 한 단계 더 성장하세요.' }
  if (pct >= 60) return { label: '양호', color: 'text-blue-600', bg: 'bg-blue-100', icon: <CheckCircle size={48} className="text-blue-500" />, desc: '기본적인 AI 윤리 이해는 있으나, 일부 영역에서 개선이 필요합니다. 일반 교육 과정을 추천드립니다.' }
  if (pct >= 40) return { label: '주의', color: 'text-amber-600', bg: 'bg-amber-100', icon: <AlertTriangle size={48} className="text-amber-500" />, desc: 'AI 윤리 취약 영역이 다수 발견되었습니다. AI 윤리 기초 교육이 필요합니다.' }
  return { label: '위험', color: 'text-red-600', bg: 'bg-red-100', icon: <XCircle size={48} className="text-red-500" />, desc: 'AI 윤리 리스크가 높습니다. 즉시 기초 교육을 받고 조직 내 AI 사용 지침을 수립하세요.' }
}

function calcAxisScores(answers) {
  const axisScores = {}
  const axisMax = {}
  questions.forEach((q) => {
    const axis = q.axis
    if (!axisScores[axis]) { axisScores[axis] = 0; axisMax[axis] = 0 }
    axisMax[axis] += 5
    if (answers[q.id] !== undefined) axisScores[axis] += answers[q.id]
  })
  return { axisScores, axisMax }
}

export default function Diagnosis() {
  const [phase, setPhase] = useState('select') // select | test | result
  const [selectedType, setSelectedType] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selectedOption, setSelectedOption] = useState(null)

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0)
  const maxScore = questions.length * 5

  function selectType(type) {
    setSelectedType(type)
    setPhase('test')
    setCurrent(0)
    setAnswers({})
    setSelectedOption(null)
  }

  function handleAnswer(score) {
    setSelectedOption(score)
  }

  function handleNext() {
    if (selectedOption === null) return
    const newAnswers = { ...answers, [questions[current].id]: selectedOption }
    setAnswers(newAnswers)
    setSelectedOption(null)
    if (current + 1 >= questions.length) {
      setPhase('result')
      // 백엔드 저장
      const total = questions.length * 5
      const score = Object.values(newAnswers).reduce((a, b) => a + b, 0)
      const { axisScores } = calcAxisScores(newAnswers)
      const grade = getGrade(score, total)
      api.saveDiagnosis({
        diagnosis_type: 'free',
        score,
        total,
        percentage: Math.round((score / total) * 100),
        grade: grade.label,
        axis_scores: axisScores,
        answers: newAnswers,
      }).catch(() => {})
    } else {
      setCurrent(current + 1)
    }
  }

  function handlePrev() {
    if (current === 0) { setPhase('select'); return }
    setCurrent(current - 1)
    setSelectedOption(answers[questions[current - 1].id] ?? null)
    const newAnswers = { ...answers }
    delete newAnswers[questions[current].id]
    setAnswers(newAnswers)
  }

  function restart() {
    setPhase('select')
    setSelectedType(null)
    setCurrent(0)
    setAnswers({})
    setSelectedOption(null)
  }

  if (phase === 'result') {
    const grade = getGrade(totalScore, maxScore)
    const pct = Math.round((totalScore / maxScore) * 100)
    const { axisScores, axisMax } = calcAxisScores(answers)
    const weakAxes = Object.entries(axisScores)
      .map(([axis, score]) => ({ axis, pct: Math.round((score / axisMax[axis]) * 100) }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 3)

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`p-8 text-center ${grade.bg}`}>
              <div className="flex justify-center mb-4">{grade.icon}</div>
              <div className={`text-5xl font-bold ${grade.color} mb-1`}>{pct}점</div>
              <div className={`text-xl font-bold ${grade.color}`}>AI 윤리 수준: {grade.label}</div>
              <p className="text-gray-600 mt-3 text-sm">{grade.desc}</p>
            </div>

            <div className="p-8">
              {/* 축별 점수 */}
              <h3 className="font-bold text-gray-900 mb-4">영역별 분석</h3>
              <div className="space-y-3 mb-8">
                {Object.entries(axisScores).map(([axis, score]) => {
                  const p = Math.round((score / axisMax[axis]) * 100)
                  const barColor = p >= 80 ? 'bg-green-500' : p >= 60 ? 'bg-blue-500' : p >= 40 ? 'bg-amber-500' : 'bg-red-500'
                  return (
                    <div key={axis}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{axis}</span>
                        <span className="text-gray-500">{p}점</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${p}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 취약 영역 */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-8">
                <h3 className="font-bold text-amber-800 mb-3">취약 영역 TOP 3</h3>
                <ul className="space-y-1">
                  {weakAxes.map((w) => (
                    <li key={w.axis} className="flex items-center gap-2 text-sm text-amber-700">
                      <AlertTriangle size={14} />
                      {w.axis} ({w.pct}점)
                    </li>
                  ))}
                </ul>
              </div>

              {/* 추천 */}
              <div className="space-y-3 mb-8">
                <h3 className="font-bold text-gray-900 mb-3">추천 다음 단계</h3>
                {[
                  { label: 'AI 윤리 일반 3급 교육 신청', path: '/education' },
                  { label: '유료 심화 진단으로 상세 분석', path: '/pricing' },
                  { label: '기업 AI 윤리 컨설팅 문의', path: '/process' },
                ].map((item) => (
                  <Link key={item.label} to={item.path} className="flex items-center justify-between p-3 bg-primary-50 border border-primary-100 rounded-lg text-sm text-primary-700 font-medium hover:bg-primary-100 transition-colors">
                    {item.label} <ArrowRight size={16} />
                  </Link>
                ))}
              </div>

              <button onClick={restart} className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
                <RotateCcw size={16} /> 다시 진단하기
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                ※ 본 진단 결과는 교육·컨설팅 목적의 참고자료이며 법률 자문을 대체하지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'test') {
    const q = questions[current]
    const progress = ((current) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* 진행바 */}
            <div className="h-1.5 bg-gray-100">
              <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-xs font-medium">{q.axis}</span>
                <span>{current + 1} / {questions.length}</span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-6 leading-snug">{q.text}</h2>

              <div className="space-y-3 mb-8">
                {q.options.map((opt) => (
                  <button
                    key={opt.text}
                    onClick={() => handleAnswer(opt.score)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                      selectedOption === opt.score
                        ? 'border-primary-500 bg-primary-50 text-primary-800 font-medium'
                        : 'border-gray-100 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={handlePrev} className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">
                  <ArrowLeft size={16} /> 이전
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                    selectedOption !== null
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {current + 1 === questions.length ? '결과 보기' : '다음'} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">AI 윤리 진단 테스트</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            당신은 AI 윤리를 얼마나 알고 있나요?<br />진단을 통해 취약 영역을 파악하고 맞춤 교육을 추천받으세요.
          </p>
        </div>
      </section>

      {/* 진단 선택 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">진단 유형 선택</h2>
            <p className="text-gray-600">나에게 맞는 진단을 선택하세요</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diagnosisTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => selectType(type)}
                className="text-left p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-primary-400 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3">{type.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{type.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${type.tagColor}`}>{type.tag}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{type.desc}</p>
                <div className="text-xs text-gray-400">대상: {type.target}</div>
                <div className="mt-4 flex items-center text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  진단 시작하기 <ArrowRight size={14} className="ml-1" />
                </div>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-8">
            ※ 무료 진단은 15문항으로 구성되며, 결과는 교육 목적의 참고자료입니다.<br />
            ※ 진단 결과는 법률 자문을 대체하지 않습니다.
          </p>
        </div>
      </section>
    </div>
  )
}
