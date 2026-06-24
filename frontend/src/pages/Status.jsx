const countries = [
  {
    name: '유럽연합 (EU)', flag: '🇪🇺', law: 'EU AI Act (2024)',
    body: `세계 최초의 포괄적 AI 규제법입니다. 위험도 기반 분류 체계를 적용하여 AI 시스템을 최소위험·제한된위험·고위험·허용불가 4단계로 분류합니다. 고위험 AI(채용·교육·의료·금융·법집행 등)에는 투명성 의무, 인간 감독, 정확성·견고성 기준, 사이버보안 요건을 부과합니다.

2024년 8월부터 금지 항목(사회적 점수화, 실시간 생체인식 등)이 적용되었으며, 2026년 전면 시행됩니다. EU 시장에서 제품·서비스를 제공하는 한국 기업도 직접 영향을 받으며, 위반 시 최대 전 세계 연간 매출의 6%에 해당하는 과징금이 부과됩니다.`,
  },
  {
    name: '대한민국', flag: '🇰🇷', law: '인공지능 기본법 (2026년 1월 시행)',
    body: `인공지능 발전과 신뢰 기반 조성 등에 관한 기본법이 2026년 1월부터 시행됩니다. 아시아 주요국 중 가장 빠른 AI 기본법 입법으로, 고영향 AI(채용·교육·금융·의료·공공서비스 분야에서 자동화 판단을 내리는 AI)에 대한 투명성 의무와 이용자 고지를 법제화합니다.

AI 윤리 원칙(인간존엄·공정성·안전성·투명성·책임성·지속가능성)이 법률에 명시되었으며, 정부는 AI 위험 관리 체계 구축을 지원해야 합니다. 향후 시행령과 구체적 가이드라인이 산업별로 제정될 예정입니다.`,
  },
  {
    name: '미국', flag: '🇺🇸', law: 'NIST AI RMF + AI Action Plan (2025)',
    body: `미국은 포괄적 AI 규제법 대신 프레임워크 기반 접근을 택하고 있습니다. 국립표준기술연구소(NIST)의 AI 리스크 관리 프레임워크(AI RMF 1.0, 2023)는 거버넌스·지도·측정·관리 4개 기능으로 AI 리스크를 체계화합니다. 2025 미국 AI Action Plan은 AI 분야 선도적 지위 유지를 목표로 정부·민간의 AI 활용을 촉진하면서도 안전기준을 병행합니다.

연방 정부 기관에는 AI 활용 시 책임 있는 AI 사용 기준 준수가 의무화되고 있으며, 상원·하원에서 AI 규제법 논의가 진행 중입니다.`,
  },
  {
    name: '일본', flag: '🇯🇵', law: 'AI 사업자 가이드라인 (2024)',
    body: `일본 경제산업성·총무성이 2024년 발표한 AI 사업자 가이드라인은 AI 개발자·제공자·이용자 각 주체별 행동지침을 제시합니다. 법적 의무보다는 자율 준수 방식이지만, G7 히로시마 AI 프로세스의 국제 행동규범(Code of Conduct)을 주도하며 글로벌 AI 거버넌스 논의에서 중요한 역할을 합니다.

생성형 AI 특화 조항을 포함하고 있으며, AI 생성 콘텐츠의 투명성, 저작권, 개인정보 보호, 딥페이크 규제에 관한 구체적 기준을 제시합니다.`,
  },
  {
    name: 'OECD', flag: '🌐', law: 'OECD AI 원칙 (2019, 업데이트 중)',
    body: `42개국 정부가 채택한 최초의 정부간 AI 윤리 합의 원칙입니다. 포용성·지속가능성, 인권·민주주의·법치 존중, 투명성·설명가능성, 견고성·안보·안전, 책무성의 5대 원칙을 제시합니다. G20 AI 원칙의 토대가 되었으며, 이후 전 세계 AI 윤리 기준의 출발점으로 기능합니다.

2024년에는 생성형 AI의 확산과 AI 규제 강화 흐름을 반영한 업데이트가 이루어졌습니다.`,
  },
  {
    name: 'UNESCO', flag: '🌍', law: 'AI 윤리 권고안 (2021)',
    body: `193개 회원국이 채택한 AI 윤리에 관한 최초의 글로벌 표준입니다. AI를 인권·환경·지속가능발전 목표(SDGs)와 연계하여 단순한 기술 윤리를 넘어 사회적 가치 실현 수단으로 정의합니다. 젠더 평등, 디지털 격차, 문화 다양성 보호를 강조하며, 각국 정부가 AI 거버넌스 체계를 구축할 때 참고해야 하는 국제 기준입니다.`,
  },
]

const esgDetails = [
  {
    title: 'E (환경, Environment)',
    body: 'AI 시스템의 학습과 운영에는 막대한 에너지가 소비됩니다. 대형 언어모델(LLM) 학습 한 번에 수백 톤의 CO₂가 배출되기도 합니다. 기업은 AI 도입 시 탄소발자국을 측정하고, 에너지 효율적인 AI 운영 방식을 채택하며, 환경 영향을 ESG 보고서에 공개해야 합니다.',
  },
  {
    title: 'S (사회, Social)',
    body: 'AI가 특정 집단(여성, 노인, 장애인, 소수집단)에 불이익을 주는 알고리즘 차별을 방지해야 합니다. 또한 AI로 인한 일자리 변화에 취약한 노동자를 위한 재교육과 지원, 디지털 격차 해소, 개인정보 보호도 사회적 책임의 핵심 항목입니다.',
  },
  {
    title: 'G (거버넌스, Governance)',
    body: 'AI 의사결정의 투명성 확보, 이사회 수준의 AI 감독 체계, 내부 AI 윤리 위원회 운영, 외부 감사 대응, AI 관련 규제 컴플라이언스 체계 수립이 거버넌스 항목에 포함됩니다. ISO/IEC 42001 인증 취득은 거버넌스 역량의 국제적 증명 수단이 됩니다.',
  },
]

export default function Status() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">AI 윤리의 현황</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            전 세계가 AI 규제를 강화하고 있습니다. 한국, EU, 미국, 일본, OECD, UNESCO가 잇따라 기준을 제시하며 AI 윤리는 글로벌 비즈니스의 필수 요건이 되었습니다.
          </p>
        </div>
      </section>

      {/* 인식 현황 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">현재 AI 윤리 인식의 현실</h2>
          <div className="space-y-6 text-base text-gray-600 leading-relaxed mb-14">
            <p>
              AI 활용은 폭발적으로 증가하고 있지만, AI를 윤리적으로 사용하는 방법을 교육받은 사람은 극소수입니다. 기업의 87% 이상이 업무에 AI를 활용하고 있지만, 공식적인 AI 사용 정책을 보유한 기업은 3% 미만이라는 조사 결과가 있습니다. AI가 생성한 결과물을 검증 없이 그대로 사용하는 비율은 73%에 달합니다.
            </p>
            <p>
              이 간극이 리스크를 만듭니다. 직원이 고객 개인정보를 ChatGPT에 입력하거나, 보고서에 AI가 만들어낸 허위 통계를 그대로 쓰거나, 딥페이크 영상을 판별하지 못하고 공유하는 사고가 매일 발생하고 있습니다. AI 윤리 교육은 더 이상 선택이 아닙니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { stat: '87%', title: '직장인 AI 사용 경험', body: '업무에 AI 도구를 사용해본 경험이 있다고 응답한 직장인 비율. 그러나 AI 윤리 교육을 받은 비율은 10% 미만.' },
              { stat: '3%', title: '기업 AI 윤리 정책 보유율', body: 'AI를 업무에 활용하는 기업 중 공식적인 AI 사용 정책·가이드라인을 문서화한 기업의 비율.' },
              { stat: '73%', title: 'AI 결과 무검증 사용', body: 'AI가 생성한 정보·보고서·이미지를 별도 검증 절차 없이 그대로 사용한다는 응답 비율.' },
            ].map(item => (
              <div key={item.stat} className="border-t-4 border-primary-400 pt-6">
                <div className="text-5xl font-black text-primary-600 mb-2">{item.stat}</div>
                <div className="text-base font-bold text-gray-900 mb-3">{item.title}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 국가별 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">국가·기관별 AI 윤리·규제 현황</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            2023~2026년 사이, 전 세계 주요 국가와 국제기구가 AI 규제와 윤리 기준을 속속 발표하고 있습니다. 한국 기업이 국제 사업을 하거나 글로벌 기준을 따라야 할 때 반드시 알아야 할 현황입니다.
          </p>

          <div className="space-y-12">
            {countries.map(c => (
              <div key={c.name} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12 border-b border-gray-200 last:border-0">
                <div className="lg:col-span-3">
                  <div className="text-4xl mb-2">{c.flag}</div>
                  <div className="text-xl font-extrabold text-gray-900 mb-1">{c.name}</div>
                  <div className="text-sm font-semibold text-primary-600">{c.law}</div>
                </div>
                <div className="lg:col-span-9">
                  {c.body.split('\n\n').map((para, i) => (
                    <p key={i} className="text-base text-gray-600 leading-relaxed mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">AI 윤리와 ESG의 연결</h2>
          <p className="text-base text-gray-600 mb-4 leading-relaxed">
            AI 윤리는 이제 ESG 보고서와 기업 지속가능성 평가의 핵심 항목으로 자리잡고 있습니다. 글로벌 투자자(블랙록, 피델리티 등)와 신용평가기관들은 기업의 AI 거버넌스 역량을 ESG 점수에 반영하고 있으며, 공급망 실사(Due Diligence) 요건으로 AI 윤리 기준 준수를 요구하는 사례가 늘고 있습니다.
          </p>
          <p className="text-base text-gray-500 mb-14 leading-relaxed">
            AI를 도입한 기업이라면 환경·사회·거버넌스 각 영역에서 AI 사용이 미치는 영향을 측정하고 보고해야 합니다.
          </p>

          <div className="space-y-10">
            {esgDetails.map(item => (
              <div key={item.title} className="border-l-4 border-green-400 pl-6">
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
