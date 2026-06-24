import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const grades = [
  {
    id: 'g9', label: '9급', name: '유치원·초등 저학년', color: 'border-gray-300',
    textColor: 'text-gray-600', badgeColor: 'bg-gray-100 text-gray-700',
    target: '유치원생~초등학교 2학년',
    scope: 'AI가 무엇인지 기초 이해, 개인정보 보호 행동, AI 장난 금지',
    method: '부모·교사 동반 평가 / OX 선택형 / 음성 응답',
    use: '어린이 AI 안전 이수증 (학부모 확인용)',
    desc: '유치원과 초등 저학년 아이가 AI 시대에 처음으로 배워야 할 것은 개념이 아니라 안전 행동입니다. 내 이름과 집 주소를 AI에 알려주면 안 된다는 것, 친구를 놀리는 AI 그림을 만들면 안 된다는 것, AI가 틀릴 수 있다는 것을 이해하는 수준을 평가합니다.',
  },
  {
    id: 'g6', label: '6급', name: '초등 고학년', color: 'border-blue-200',
    textColor: 'text-blue-700', badgeColor: 'bg-blue-50 text-blue-700',
    target: '초등학교 3~6학년',
    scope: 'AI 결과 검증, 딥페이크 개념, 저작권·초상권 기초, AI 과제 윤리',
    method: 'OX / 객관식 / 사례 선택형',
    use: '학생 AI 윤리 이수증',
    desc: '초등 고학년은 AI로 숙제를 하고, 딥페이크 동영상을 접하기 시작합니다. AI가 알려준 정보를 확인하지 않고 그대로 제출하거나, 친구 얼굴을 AI로 합성하는 행위의 문제점을 이해하는 수준을 평가합니다. 저작권과 초상권의 기초 개념을 사례형 문항으로 묻습니다.',
  },
  {
    id: 'g3', label: '3급', name: '중·고등학생 / 일반인 기초', color: 'border-green-300',
    textColor: 'text-green-700', badgeColor: 'bg-green-50 text-green-700',
    target: '중고등학생·대학생·성인 입문자',
    scope: 'AI 학업 윤리, 딥페이크 식별·신고, 글로벌 AI 기준 이해, 직장 AI 보안 기초',
    method: 'OX / 객관식 / 사례형 시나리오',
    use: '취업·학교생활 AI 윤리 기초 자격',
    desc: '본격적인 AI 활용이 시작되는 시기이지만 윤리적 기준은 배운 적이 없는 계층을 대상으로 합니다. 자기소개서에 AI를 써도 되는지, 딥페이크를 발견하면 어떻게 해야 하는지, 회사 자료를 AI에 입력하면 왜 위험한지를 이해하고 판단할 수 있는 수준을 평가합니다.',
  },
  {
    id: 'g1', label: '1급', name: '직장인·전문가 일반', color: 'border-primary-400',
    textColor: 'text-primary-700', badgeColor: 'bg-primary-50 text-primary-700',
    target: '직장인·팀장·실무자·HR/법무/IT 담당자',
    scope: 'AI 책임 이해, 기업 AI 정책 수립, 저작권·개인정보 실무, EU AI Act·AI 기본법',
    method: '객관식 / 사례형 / 단답형',
    use: '기업 AI 윤리 실무 자격 / 입찰·ESG 증빙',
    desc: 'AI를 업무에 매일 사용하는 직장인과 팀장이 갖춰야 할 실무 수준의 AI 윤리 역량을 평가합니다. 기업 AI 사용 정책을 만들고, AI 생성 결과물을 검수하며, 법적 책임 관계를 이해하고, EU AI Act 및 한국 AI 기본법의 핵심 의무를 파악하는 수준을 요구합니다.',
  },
  {
    id: 'pro2', label: '전문 2급', name: '기업 AI 윤리 실무 전문가', color: 'border-purple-400',
    textColor: 'text-purple-700', badgeColor: 'bg-purple-50 text-purple-700',
    target: '교육 강사·컨설턴트 입문자·HR 리더·AI 담당 팀장',
    scope: '진단표 설계, 산업별 사례 분석, 강의 콘텐츠 제작, 기업 정책 수립',
    method: '사례형 / 논술형 / 실습 과제',
    use: '기업 AI 윤리 교육·컨설팅 자격 (강사 등록 연계)',
    desc: '기업에서 AI 윤리를 가르치고 진단하는 실무 전문가 수준을 평가합니다. 진단 문항을 직접 설계하고, 산업별 사례를 분석하며, 강의 자료를 제작하는 역량을 실습 과제로 확인합니다. 수료 시 강사 풀 등록 자격이 부여됩니다.',
  },
  {
    id: 'pro1', label: '전문 1급', name: '기업 AI 윤리 최고 전문가', color: 'border-amber-400',
    textColor: 'text-amber-700', badgeColor: 'bg-amber-50 text-amber-700',
    target: '선임 컨설턴트·기업 AI 윤리 책임자·심사관',
    scope: '기업 리스크 보고서 작성, 경영진 컨설팅, ISO/EU AI Act 심사 대응, 심사관 역할',
    method: '논술형 / 케이스스터디 / 발표 평가',
    use: '최고 전문가 자격 / 심사관·컨설팅 파트너 자격',
    desc: '기업의 AI 윤리 리스크를 총괄하고, 경영진에 보고하며, 외부 심사에 대응하는 최고 전문가 수준을 평가합니다. EU AI Act 적합성 평가, ISO/IEC 42001 심사, 경영진을 위한 AI 리스크 보고서 작성, 대외 컨설팅 수행 역량을 종합적으로 검증합니다.',
  },
]

export default function Certificate() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">자격 안내</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            유치원부터 전문 심사관까지 — 총 6개 등급의 AI 윤리 자격 체계. 민간자격으로 등록되며, 취업·입찰·ESG 보고서에 활용할 수 있습니다.
          </p>
          <p className="text-sm text-gray-400 mt-6 leading-relaxed">
            본 자격은 민간자격으로 국가전문자격이 아닙니다. 자격명칭 및 등급은 발급기관 자체 기준에 따릅니다.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">전체 자격 등급 체계</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            AI 윤리 자격은 단순한 지식 시험이 아닙니다. 무료 진단으로 현재 수준을 파악하고, 맞춤 교육을 이수한 뒤, 해당 급수 시험에 응시하는 체계로 운영됩니다. 취득한 자격은 이력서·포트폴리오·ESG 보고서·입찰 서류에 활용할 수 있으며, 전문 2~1급 자격자는 강사·심사관·컨설팅 파트너로 활동할 수 있습니다.
          </p>

          <div className="space-y-10">
            {grades.map(g => (
              <div key={g.id} className={`border-l-4 ${g.color} pl-6 py-4`}>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`text-lg font-extrabold ${g.textColor}`}>{g.label}</span>
                  <h3 className="text-xl font-extrabold text-gray-900">{g.name}</h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${g.badgeColor}`}>{g.target}</span>
                </div>
                <p className="text-base text-gray-600 leading-relaxed mb-4">{g.desc}</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-bold text-gray-700">평가 범위: </span>
                    <span className="text-gray-500">{g.scope}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">평가 방법: </span>
                    <span className="text-gray-500">{g.method}</span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-700">활용처: </span>
                    <span className="text-gray-500">{g.use}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">자격 취득 절차</h2>
          <p className="text-base text-gray-600 mb-12 leading-relaxed">
            자격 취득은 진단 → 교육 → 시험 → 발급의 4단계로 이루어집니다. 중간에 원하는 단계부터 시작할 수도 있지만, 무료 진단을 먼저 받으면 자신에게 맞는 급수와 취약 영역을 정확히 파악할 수 있습니다.
          </p>

          <div className="space-y-6">
            {[
              { num: '01', title: '무료 진단', body: '현재 자신의 AI 윤리 이해 수준을 파악합니다. 8개 평가 축(투명성·공정성·책임성·안전성·개인정보보호·저작권·컴플라이언스·ESG)별 점수를 확인하고, 취약 영역과 권장 급수를 안내받습니다.' },
              { num: '02', title: '맞춤 교육 수강', body: '진단 결과를 바탕으로 취약 영역 중심의 교육 과정을 수강합니다. 자신의 급수에 맞는 커리큘럼으로 시험에 대비합니다.' },
              { num: '03', title: '급수 시험 응시', body: '해당 급수 시험에 응시합니다. OX, 객관식, 사례형, 논술형 등 급수별로 다른 평가 방식이 적용됩니다. 온라인 시험 또는 대면 시험 중 선택할 수 있습니다.' },
              { num: '04', title: '자격 발급', body: '합격 시 해당 급수의 AI 윤리 자격증이 발급됩니다. 종이 증서와 디지털 배지가 함께 제공됩니다. 이력서·포트폴리오·LinkedIn에 즉시 등록 가능합니다.' },
            ].map(step => (
              <div key={step.num} className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-6 border-b border-gray-200 last:border-0">
                <div className="lg:col-span-2">
                  <div className="text-5xl font-black text-primary-100 leading-none">{step.num}</div>
                </div>
                <div className="lg:col-span-10">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">자격의 활용 가치</h2>
          <p className="text-base text-gray-600 mb-12 leading-relaxed">
            AI 윤리 자격은 단순한 수료증이 아닙니다. 취업, 입찰, 대학 입시, ESG 보고, 강사 활동까지 다양한 맥락에서 실질적 가치를 발휘합니다.
          </p>

          <div className="space-y-6">
            {[
              { label: '취업·이직', body: 'AI 시대에 AI 윤리 역량은 신입·경력 모두에게 강력한 차별화 포인트입니다. 특히 HR·법무·IT·콘텐츠·마케팅 분야에서 활용도가 높습니다.' },
              { label: '기업 입찰·계약', body: '공공기관 입찰, 대기업 협력사 등록, B2B 계약에서 AI 윤리 자격 보유 직원 수가 심사 기준이 되는 사례가 늘고 있습니다.' },
              { label: 'ESG 보고서', body: '기업의 AI 거버넌스 역량을 증명하는 자료로 활용됩니다. 직원 AI 윤리 자격 취득률을 ESG 사회(S) 항목에 기재하는 기업이 증가하고 있습니다.' },
              { label: '학교·입시', body: '고등학생의 경우 자기소개서·생기부에 AI 윤리 자격 취득을 기재할 수 있으며, 관련 진로(법학·컴퓨터공학·미디어학 등)와 연계성을 보여줄 수 있습니다.' },
              { label: '강사·컨설턴트 활동', body: '전문 2~1급 취득자는 저희 강사 풀에 등록되어 기업·학교·기관 교육 의뢰를 받을 수 있습니다. 컨설팅 파트너 자격으로도 활동 가능합니다.' },
            ].map(item => (
              <div key={item.label} className="border-l-4 border-primary-300 pl-6 py-3">
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{item.label}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-sm text-gray-400 mb-10 leading-relaxed">
            본 자격은 민간자격으로서 국가전문자격이 아닙니다. 자격명칭, 등급 기준, 자격증 내용 및 합격 기준은 발급기관 자체 규정에 따라 결정됩니다. 취득 전 반드시 자격 기준 및 용도를 확인하세요.
          </p>
          <h2 className="text-3xl font-extrabold mb-4">지금 무료 진단으로 나의 등급 확인하기</h2>
          <p className="text-base text-white/70 mb-8">10분이면 현재 수준과 권장 급수를 알 수 있습니다.</p>
          <Link to="/diagnosis" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-500 transition-all text-lg">
            무료 진단 시작 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
