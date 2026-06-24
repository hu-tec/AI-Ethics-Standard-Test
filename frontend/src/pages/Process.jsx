import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const steps = [
  {
    num: '01', title: '진단 (Diagnosis)',
    body: `기업의 AI 활용 현황 전반을 파악합니다. 어떤 AI 도구를 사용하고 있는지, 어떤 데이터를 AI에 입력하는지, AI 사용 정책이 있는지, 직원들의 AI 윤리 이해 수준은 어떠한지를 온라인 설문·인터뷰·문서 검토를 통해 조사합니다.

주요 진단 항목: AI 도구 목록 및 승인 여부, 데이터 입력 현황(개인정보·기밀 포함 여부), 부서별 AI 사용 빈도, 기존 AI 관련 사내 규정 유무, 이전 AI 관련 사고·민원 이력`,
  },
  {
    num: '02', title: '평가 (Assessment)',
    body: `진단 결과를 기반으로 기업의 AI 윤리 수준을 투명성·공정성·책임성·안전성·개인정보보호·저작권·컴플라이언스·ESG 8개 축으로 정량·정성 평가합니다. 각 축별 점수와 가중치를 적용하여 종합 위험 등급을 산정합니다.

등급 체계: 최우수(90점 이상) / 우수(75~89점) / 표준(60~74점) / 기초(45~59점) / 위험(44점 이하). 등급별로 필수 개선 사항과 권고 사항이 구분됩니다.`,
  },
  {
    num: '03', title: '가이드 (Guidance)',
    body: `평가 결과에 따른 맞춤 개선 방향을 제시합니다. 내부 AI 사용 정책 초안, 부서별 행동수칙, 교육 우선순위, 기술적 조치 방향(개인정보 비식별화, AI 도구 승인 프로세스 등)을 문서로 제공합니다.

가이드 산출물: AI 사용 정책 초안, 부서별 체크리스트, 교육 대상·내용·일정 계획, 법적 검토가 필요한 영역 표시, 단기·중기·장기 개선 로드맵`,
  },
  {
    num: '04', title: '검증 (Verification)',
    body: `개선 이행 여부를 점검합니다. 가이드 제공 후 일정 기간이 지난 뒤 이행 상황을 확인하고, 직원 재진단으로 실제 이해도 변화를 측정합니다. 개선 효과를 정량 수치로 확인할 수 있어 경영진 보고 자료로 활용됩니다.

검증 방법: 이행 체크리스트 검토, 직원 재진단(Before/After 비교), 문서·정책 업데이트 확인, 개선 전후 점수 비교`,
  },
  {
    num: '05', title: '인증 (Certification)',
    body: `기준 점수 이상 충족 시 AI 윤리 인증을 공식 부여합니다. 인증서가 발급되며 기업 홈페이지, IR 자료, 입찰 서류, ESG 보고서에 활용할 수 있습니다. 인증은 기초·표준·우수·최우수 4개 등급으로 차등화됩니다.

인증 효과: 거래처·투자자·공공기관에 AI 신뢰 증빙, ESG 평가 항목 반영, 규제 대응 준비 완료 입증, 직원·고객 신뢰 제고`,
  },
  {
    num: '06', title: '사후관리 (Ongoing Management)',
    body: `인증 유지와 지속적 개선을 지원합니다. AI 규제는 빠르게 변화하므로 연 1회 정기 갱신 점검, 규제 변화 사항 업데이트, 신규 직원 교육 지원, AI 사고 발생 시 긴급 자문을 제공합니다.

사후관리 서비스: 연간 갱신 점검, AI 규제 변화 모니터링 리포트(분기별), 신규 직원 AI 윤리 교육, 사고 발생 시 24시간 자문`,
  },
]

const certLevels = [
  { level: '기초', score: '45~59점', color: 'border-gray-300', textColor: 'text-gray-700', desc: 'AI 윤리 최소 기준을 충족합니다. 단기 내 집중 개선이 권고됩니다.' },
  { level: '표준', score: '60~74점', color: 'border-blue-300', textColor: 'text-blue-700', desc: 'AI 윤리 정책 수립과 직원 기초 교육이 이행되고 있습니다.' },
  { level: '우수', score: '75~89점', color: 'border-green-400', textColor: 'text-green-700', desc: 'AI 윤리 체계가 구축되고 지속적 개선 프로세스가 운영되고 있습니다.' },
  { level: '최우수', score: '90점 이상', color: 'border-purple-400', textColor: 'text-purple-700', desc: '업계 선도적 AI 윤리 거버넌스를 구축하고 있습니다. ESG 리더십을 증명합니다.' },
]

export default function Process() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">업무 프로세스</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            AI 윤리 인증·컨설팅의 전 과정을 안내합니다. 진단에서 인증, 사후관리까지 6단계 체계적 프로세스로 기업의 AI 신뢰 역량을 공식 증명합니다.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">6단계 AI 윤리 인증 프로세스</h2>
          <p className="text-base text-gray-600 mb-16 leading-relaxed">
            각 단계는 이전 단계의 결과를 기반으로 진행되며, 기업의 상황에 따라 일부 단계를 집중 강화할 수 있습니다. 최소 3개월에서 6개월의 기간이 소요되며, 기업 규모와 현황에 따라 달라집니다.
          </p>

          <div className="space-y-14">
            {steps.map(step => (
              <div key={step.num} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-14 border-b border-gray-100 last:border-0">
                <div className="lg:col-span-2">
                  <div className="text-6xl font-black text-primary-100 leading-none">{step.num}</div>
                </div>
                <div className="lg:col-span-10">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-4">{step.title}</h3>
                  {step.body.split('\n\n').map((para, i) => (
                    <p key={i} className={`text-base leading-relaxed ${i === 0 ? 'text-gray-600 mb-4' : 'text-sm text-gray-500'}`}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">AI 윤리 인증 등급 체계</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            기업의 AI 윤리 수준을 4단계로 등급화하여 공식 인증합니다. 인증서는 기업 홈페이지, ESG 보고서, IR 자료, 입찰 서류에 활용할 수 있습니다.
          </p>

          <div className="space-y-5">
            {certLevels.map(c => (
              <div key={c.level} className={`border-l-4 ${c.color} pl-6 py-4`}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-xl font-extrabold ${c.textColor}`}>{c.level}</h3>
                  <span className="text-sm text-gray-400">{c.score}</span>
                </div>
                <p className="text-base text-gray-600">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-4">기업 AI 윤리 인증 문의</h2>
          <p className="text-base text-white/80 mb-8 leading-relaxed">
            먼저 B2B 직원 진단으로 현재 수준을 파악하고, 컨설팅 상담을 신청하세요. 기업 규모와 산업에 맞는 맞춤 인증 프로그램을 제안드립니다.
          </p>
          <Link to="/diagnosis" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all text-lg">
            기업 진단 시작하기 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
