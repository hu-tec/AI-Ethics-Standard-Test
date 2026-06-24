import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const b2cPlans = [
  {
    name: '개인 기초', price: '무료', period: '',
    target: '처음 AI 윤리를 접하는 개인',
    desc: '무료 진단 1회로 현재 수준을 파악하고, 무료 기초 자료와 뉴스레터를 받을 수 있습니다. 별도 결제 없이 시작하세요.',
    includes: ['무료 온라인 진단 1회', '8개 축 점수 및 취약 영역 리포트', '3급 이하 무료 교육 자료 접근', 'AI 윤리 뉴스레터 구독', '커뮤니티 자료실 열람'],
  },
  {
    name: '개인 자격 패키지', price: '49,000원~', period: '급수별 상이',
    target: '자격 취득을 목표로 하는 개인',
    desc: '자격 시험 응시권, 급수별 교육 콘텐츠, 모의시험이 포함된 개인 자격 패키지입니다. 3급부터 전문 1급까지 급수별로 신청하세요.',
    includes: ['급수별 교육 콘텐츠 전체 접근', '모의시험 3회', '자격 시험 응시권 1회', '오답 분석 리포트', '자격 합격 시 디지털 배지 + 종이 증서', '재응시 시 50% 할인'],
  },
  {
    name: '개인 전문가 과정', price: '190,000원~', period: '전문 2급 기준',
    target: '강사·컨설턴트를 목표로 하는 개인',
    desc: '전문 2~1급 취득과 강사 등록을 목표로 하는 집중 과정입니다. 실습 과제 첨삭, 멘토링, 강사 풀 등록이 포함됩니다.',
    includes: ['전문 2급 또는 1급 교육 전체', '실습 과제 첨삭 2회', '담당 멘토 배정', '자격 시험 응시권 1회', '합격 시 강사 풀 자동 등록', '컨설팅 파트너 온보딩 자료'],
  },
]

const b2bPlans = [
  {
    name: '직원 교육 패키지', price: '협의', period: '인원수·기간 기준',
    target: '전 직원 또는 특정 부서 AI 윤리 교육',
    desc: '기업 전체 또는 특정 부서 직원을 대상으로 한 온라인 AI 윤리 교육 패키지입니다. 인원수와 교육 기간에 따라 단가가 조정됩니다.',
    includes: ['직원 전원 온라인 진단 (무제한)', '부서별 맞춤 교육 콘텐츠', '부서·팀별 이해도 대시보드', '수료 인증서 발급', '교육 이수율·성과 보고서', '인원 추가 시 단가 할인'],
  },
  {
    name: '기업 진단 + 컨설팅', price: '협의', period: '3~6개월 프로젝트',
    target: 'AI 윤리 체계 구축이 필요한 기업',
    desc: '기업의 AI 사용 현황을 전문가가 직접 진단하고, 개선 방향·정책 초안·교육 계획을 제공합니다. 경영진 보고용 리스크 보고서가 포함됩니다.',
    includes: ['전문가 방문·원격 진단', 'AI 윤리 리스크 보고서', 'AI 사용 정책 초안', '교육 계획·자료 제공', '부서별 체크리스트', '경영진 프레젠테이션'],
  },
  {
    name: '기업 인증', price: '협의', period: '연간 갱신',
    target: 'AI 윤리 인증을 공식 취득하려는 기업',
    desc: '기초·표준·우수·최우수 4단계 기업 AI 윤리 인증을 취득합니다. 인증서는 ESG 보고서, 입찰 서류, IR 자료에 활용할 수 있습니다.',
    includes: ['공식 AI 윤리 인증서 발급 (기초~최우수)', '인증 마크 사용권', 'ESG 보고서 반영 자료 제공', '연간 갱신 점검 포함', '규제 변화 모니터링 리포트 (분기)', '인증 기업 목록 공개'],
  },
  {
    name: '학교·기관 특별 패키지', price: '협의', period: '연간 계약',
    target: '학교·교육기관·공공기관·비영리단체',
    desc: '학교와 공공기관을 위한 별도 요금제입니다. 학생·교사·공무원 대상 AI 윤리 교육을 기관 단위로 도입할 수 있습니다.',
    includes: ['학생 대상 커리큘럼 (유~고)', '교사·강사 연수 프로그램', '학교·기관 단위 진단', '교육부·지자체 제출용 교육 이수 자료', '예산 협의 가능 (영세 기관 할인)'],
  },
]

const faqs = [
  { q: '진단과 기초 자료는 정말 무료인가요?', a: '네. 온라인 진단 1회와 기초 교육 자료·뉴스레터는 비용 없이 이용하실 수 있습니다. 자격 시험 응시나 전문 교육 과정은 유료입니다.' },
  { q: '기업 요금은 어떻게 산정되나요?', a: '기업 규모(직원 수), 교육 대상 범위, 진단·컨설팅 깊이, 인증 등급 목표에 따라 달라집니다. 먼저 B2B 직원 진단으로 현황을 파악한 뒤 상담을 신청하시면 맞춤 견적을 제안드립니다.' },
  { q: '자격 시험을 불합격하면 재응시할 수 있나요?', a: '재응시는 가능합니다. 개인 자격 패키지 구매자는 재응시 시 50% 할인이 적용됩니다. 오답 분석 리포트를 기반으로 취약 영역을 집중 보완한 후 재응시를 권장합니다.' },
  { q: '강사 등록 후 실제 수입이 발생하나요?', a: '전문 2~1급 취득자는 저희 강사 풀에 등록됩니다. 기업·학교·기관으로부터 교육 의뢰가 연결되며, 강사료는 의뢰 기관과 직접 협의하는 방식입니다. 저희는 의뢰 연결 수수료를 별도 청구하지 않습니다.' },
  { q: '학교나 공공기관 예산이 부족한 경우 어떻게 하나요?', a: '영세 학교·비영리기관·지자체 위탁 사업의 경우 별도 할인 또는 보조금 연계를 논의할 수 있습니다. 문의 시 기관 유형과 예산 규모를 알려주세요.' },
]

export default function Pricing() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">요금 안내</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            무료 진단으로 시작하고, 필요한 만큼만 결제하세요. 개인·학생·직장인·기업·학교 모두를 위한 유연한 요금 구조를 운영합니다.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">개인 요금제 (B2C)</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            개인 학습자, 자격 취득 희망자, 강사·컨설턴트를 목표로 하는 분을 위한 요금제입니다. 무료 진단으로 시작하여 필요에 따라 업그레이드할 수 있습니다.
          </p>

          <div className="space-y-10">
            {b2cPlans.map(plan => (
              <div key={plan.name} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 border-b border-gray-100 last:border-0">
                <div className="lg:col-span-4">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="text-3xl font-black text-primary-600 mb-1">{plan.price}</div>
                  {plan.period && <div className="text-sm text-gray-400 mb-3">{plan.period}</div>}
                  <div className="text-sm text-gray-500 leading-relaxed">{plan.target}</div>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-base text-gray-600 leading-relaxed mb-5">{plan.desc}</p>
                  <ul className="space-y-2">
                    {plan.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-primary-500 font-bold mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">기업·기관 요금제 (B2B)</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            기업과 교육기관을 위한 요금은 규모·범위·기간에 따라 맞춤 산정됩니다. 직원 수, 교육 대상 부서, 인증 목표를 알려주시면 견적을 제안드립니다.
          </p>

          <div className="space-y-10">
            {b2bPlans.map(plan => (
              <div key={plan.name} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 border-b border-gray-100 last:border-0">
                <div className="lg:col-span-4">
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{plan.name}</h3>
                  <div className="text-2xl font-black text-primary-600 mb-1">{plan.price}</div>
                  {plan.period && <div className="text-sm text-gray-400 mb-3">{plan.period}</div>}
                  <div className="text-sm text-gray-500 leading-relaxed">{plan.target}</div>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-base text-gray-600 leading-relaxed mb-5">{plan.desc}</p>
                  <ul className="space-y-2">
                    {plan.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-primary-500 font-bold mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">자주 묻는 질문</h2>
          <p className="text-base text-gray-500 mb-14">요금과 서비스 구조에 대해 자주 질문하는 내용을 정리했습니다.</p>

          <div className="space-y-8">
            {faqs.map(faq => (
              <div key={faq.q} className="pb-8 border-b border-gray-100 last:border-0">
                <h3 className="text-lg font-extrabold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-extrabold mb-4">아직 어떤 플랜이 맞는지 모르겠다면</h2>
              <p className="text-base text-white/80 leading-relaxed">
                무료 진단으로 현재 AI 윤리 이해 수준을 파악하세요. 진단 결과에 따라 권장 급수와 맞춤 교육 과정을 자동 안내해 드립니다. 기업 담당자는 B2B 직원 진단 후 상담 신청으로 견적을 받으세요.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/diagnosis" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold px-6 py-4 rounded-xl hover:bg-gray-50 transition-all text-base">
                무료 진단 시작 <ArrowRight size={16} />
              </Link>
              <Link to="/expert" className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-bold px-6 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
                B2B 상담 신청
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
