import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const principles = [
  {
    num: '01', title: '투명성 (Transparency)',
    body: 'AI 시스템이 어떻게 작동하는지, 어떤 데이터를 사용했는지, 결과가 어떤 방식으로 도출되었는지를 이해 가능한 수준으로 공개해야 합니다. AI로 생성된 콘텐츠·보고서·광고·교육자료에는 "AI 활용" 사실을 명시해야 하며, 자동화 의사결정(채용·대출·진단 등)에 대해서는 그 사실을 당사자에게 고지해야 합니다.',
  },
  {
    num: '02', title: '공정성 (Fairness)',
    body: 'AI 시스템은 성별·나이·인종·장애·출신지역 등 특정 집단에 대한 차별이나 편향을 재생산하거나 심화시켜서는 안 됩니다. 채용·신용평가·의료 진단 등 중요한 의사결정에 AI를 사용할 경우, 알고리즘 편향 여부를 주기적으로 점검하고 공정한 결과가 나오도록 관리해야 합니다.',
  },
  {
    num: '03', title: '책임성 (Accountability)',
    body: 'AI 결과물로 인해 오류·피해·오남용이 발생했을 때 누가 책임을 지는지, 어떤 절차로 대응하는지가 명확해야 합니다. AI 자체가 책임지는 것은 현재 법적으로 불가능하므로, AI를 도입하고 활용한 조직과 개인이 결과에 대한 책임을 져야 합니다. 내부 AI 사용 정책, 승인 절차, 사고 대응 매뉴얼이 필요합니다.',
  },
  {
    num: '04', title: '안전성 (Safety)',
    body: '물리적·사이버적·심리적 위험을 초래하지 않도록 AI 시스템을 설계·운영해야 합니다. 의료기기 제어, 자율주행, 국방 등 고위험 영역에서의 AI 오류는 생명·안전 위협으로 이어질 수 있습니다. 업무 영역에서도 AI 결과를 무검증으로 사용하거나, 보안이 검증되지 않은 AI 도구에 민감정보를 입력하는 것은 안전 리스크입니다.',
  },
  {
    num: '05', title: '정확성 (Accuracy)',
    body: 'AI가 생성한 정보가 사실에 기반하는지, 출처가 확인 가능한지, 맥락에 맞는지를 검증해야 합니다. AI는 할루시네이션(그럴듯한 허위 정보 생성)이 발생할 수 있으며, 이를 검증 없이 사용하면 보고서 오류, 법적 분쟁, 브랜드 리스크로 이어집니다. "AI가 말했으니 맞다"는 접근은 가장 위험한 태도입니다.',
  },
  {
    num: '06', title: '개인정보·보안 (Privacy & Security)',
    body: '고객 개인정보, 내부 기밀자료, 영업비밀, 직원 정보 등을 AI 도구에 입력해서는 안 됩니다. AI 서비스 제공사의 개인정보 처리방침과 데이터 보유 기간을 확인하고, 민감정보가 포함된 데이터를 활용할 때는 익명화·가명화 처리가 선행되어야 합니다. 개인정보보호법, GDPR 등 관련 법령 준수가 필수입니다.',
  },
  {
    num: '07', title: '저작권·권리보호 (Intellectual Property)',
    body: 'AI가 생성한 이미지·텍스트·음악·영상·코드는 타인의 창작물을 학습 데이터로 사용하여 만들어졌을 수 있습니다. AI 생성물을 상업적으로 사용하기 전에 저작권 관계를 확인해야 합니다. 또한 타인의 목소리·얼굴·글쓰기 스타일을 AI로 모방하거나 복제할 때는 당사자 동의가 필요합니다.',
  },
  {
    num: '08', title: 'ESG·컴플라이언스 (ESG & Compliance)',
    body: 'AI 활용은 환경(에너지 소비·탄소발자국), 사회(일자리·디지털 격차·차별), 거버넌스(의사결정 투명성·감독 체계)에 영향을 미칩니다. 기업은 AI 사용이 ESG 목표에 부합하는지 점검하고, EU AI Act·한국 AI 기본법·ISO/IEC 42001 등 국내외 규제와 표준을 준수해야 합니다.',
  },
]

const globalStandards = [
  {
    org: 'OECD AI 원칙', year: '2019',
    body: '42개국이 채택한 최초의 정부간 AI 윤리 합의문. 포용성·지속가능성, 인권·민주주의·법치, 투명성·설명가능성, 견고성·안보·안전, 책무성의 5대 원칙을 제시합니다. G20 AI 원칙의 기반이 되었으며, 이후 전 세계 AI 윤리 기준의 출발점이 됩니다.',
  },
  {
    org: 'UNESCO AI 윤리 권고안', year: '2021',
    body: '193개 회원국이 채택한 AI 윤리에 관한 최초의 글로벌 표준. 인권·환경·지속가능발전과 AI 윤리를 직접 연계하며, 젠더 평등, 디지털 격차, 문화다양성 보호를 강조합니다. 각국 정부가 AI 거버넌스 체계를 구축할 때 기준이 됩니다.',
  },
  {
    org: 'EU AI Act', year: '2024',
    body: '세계 최초 포괄적 AI 규제법. 위험도 기반 분류 체계(최소·제한·고위험·금지)를 적용하며, 고위험 AI에 투명성·안전성·인간 감독을 의무화합니다. 2024년 발효, 금지 항목은 2024년 8월 적용, 전면 시행은 2026년. EU 시장에서 사업하는 한국 기업도 직접 영향을 받습니다.',
  },
  {
    org: 'NIST AI RMF', year: '2023',
    body: '미국 국립표준기술연구소(NIST)의 AI 리스크 관리 프레임워크. 거버넌스(Govern)·지도(Map)·측정(Measure)·관리(Manage) 4개 기능으로 AI 리스크를 체계적으로 관리하는 방법론을 제시합니다. 미국 연방정부·기업의 AI 관리 표준으로 활용됩니다.',
  },
  {
    org: 'ISO/IEC 42001', year: '2023',
    body: 'AI 관리 시스템에 관한 최초의 국제표준. ISO 9001(품질), ISO 27001(정보보안)처럼 AI 관리 체계를 인증받을 수 있는 표준입니다. 기업이 AI 윤리·거버넌스 체계를 국제적으로 검증받는 수단이 됩니다.',
  },
  {
    org: '한국 AI 기본법', year: '2026.1',
    body: '인공지능 발전과 신뢰 기반 조성 등에 관한 기본법. 2026년 1월부터 시행되며, 고영향 AI(채용·교육·금융·의료·공공서비스)에 투명성 의무를 부과합니다. AI 윤리 원칙이 법제화되었으며, 위반 시 제재 근거가 마련됩니다.',
  },
  {
    org: '일본 AI 사업자 가이드라인', year: '2024',
    body: 'AI 개발자·제공자·이용자 각 주체별 행동지침을 제시합니다. G7 히로시마 AI 프로세스의 국제 행동규범(Code of Conduct)을 주도하여 글로벌 AI 거버넌스 논의에서 영향력을 높이고 있습니다.',
  },
  {
    org: 'G7 히로시마 AI 프로세스', year: '2023',
    body: '2023년 G7 정상회의에서 합의된 AI 거버넌스 국제 협력 체계. 생성형 AI에 특화된 국제 행동규범과 가이드라인을 제정하여 각국이 자국 AI 정책에 반영하도록 유도합니다.',
  },
]

export default function About() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">AI 윤리란 무엇인가</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            AI 윤리는 "착하게 쓰자"는 캠페인이 아닙니다. 법·보안·신뢰·ESG·컴플라이언스와 직결되는 필수 역량이며, 전 세계가 제도화하고 있는 새로운 비즈니스 기준입니다.
          </p>
        </div>
      </section>

      {/* 정의 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8">AI 윤리의 정의</h2>
          <div className="space-y-6 text-base text-gray-600 leading-relaxed">
            <p>
              AI 윤리(AI Ethics)란 인공지능 기술을 개발하고 활용하는 과정에서 발생하는 윤리적 문제를 식별하고, 이를 예방·관리하는 원칙과 실천 체계입니다. 단순히 AI를 "올바르게" 사용하는 태도가 아니라, 개인·조직·사회 전체가 AI 기술의 혜택을 누리면서도 그 부작용과 리스크를 최소화할 수 있도록 하는 체계적 접근입니다.
            </p>
            <p>
              AI가 의사결정을 내리거나 콘텐츠를 생성하거나 데이터를 분석할 때, 그 결과가 사람에게 미치는 영향을 고려해야 합니다. 채용에서 특정 집단을 불이익 주는 알고리즘, 사실이 아닌 내용을 생성하는 AI, 개인정보를 무단으로 학습하는 시스템 — 이 모든 것이 AI 윤리가 다루는 문제입니다.
            </p>
            <p>
              과거에는 AI 윤리를 "착한 의도"의 영역으로 보았지만, 이제는 다릅니다. EU AI Act, 한국 AI 기본법, OECD 원칙, UNESCO 권고안, ISO/IEC 42001 등이 잇따라 시행되면서 AI 윤리는 법적 의무와 규제 컴플라이언스의 영역으로 전환되었습니다. 이제 "AI를 윤리적으로 쓴다"는 것은 선택이 아닌, 기업과 개인이 반드시 갖춰야 할 필수 역량이 되었습니다.
            </p>
            <p>
              AI 윤리는 또한 ESG(환경·사회·거버넌스) 경영과 직접 연결됩니다. 글로벌 투자자와 기관들은 기업이 AI를 어떻게 관리하는지를 ESG 평가 항목으로 포함시키고 있습니다. 공정한 AI 활용, 투명한 의사결정, 개인정보 보호는 기업의 사회적 책임과 지속 가능성의 핵심 지표가 됩니다.
            </p>
          </div>

          <div className="mt-10 border-l-4 border-primary-500 pl-6 py-2">
            <p className="text-lg font-bold text-gray-900 leading-snug">
              "AI 윤리는 에티켓이 아니라 컴플라이언스입니다.<br />
              AI를 활용하는 모든 조직은 AI 윤리 리스크를 진단하고 관리해야 합니다."
            </p>
          </div>
        </div>
      </section>

      {/* 8대 원칙 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">AI 윤리 8대 핵심 원칙</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            OECD, UNESCO, EU AI Act, NIST AI RMF, 한국 AI 기본법 등 국내외 공식 기준을 종합하여 도출한 8대 핵심 평가 원칙입니다. 저희 진단·교육·시험 체계는 이 8개 축을 기반으로 설계되어 있습니다.
          </p>

          <div className="space-y-10">
            {principles.map(p => (
              <div key={p.num} className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10 border-b border-gray-200 last:border-0">
                <div className="lg:col-span-1">
                  <span className="text-4xl font-black text-primary-100">{p.num}</span>
                </div>
                <div className="lg:col-span-11">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-3">{p.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 글로벌 기준 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">글로벌 AI 윤리·규제 기준</h2>
          <p className="text-base text-gray-600 mb-4 leading-relaxed">
            저희 진단·교육·자격 체계는 아래 국내외 공식 자료를 직접 수집하고 DB화하여 반영합니다. 각 자료는 정기적으로 업데이트됩니다.
          </p>
          <p className="text-sm text-gray-400 mb-14">※ 각 자료의 최신성은 발행 기관 공식 사이트에서 확인하시기 바랍니다.</p>

          <div className="space-y-8">
            {globalStandards.map(s => (
              <div key={s.org} className="grid grid-cols-1 lg:grid-cols-12 gap-4 pb-8 border-b border-gray-100 last:border-0">
                <div className="lg:col-span-3">
                  <div className="font-extrabold text-gray-900 text-base mb-1">{s.org}</div>
                  <div className="text-sm text-primary-600 font-semibold">{s.year}년</div>
                </div>
                <div className="lg:col-span-9">
                  <p className="text-base text-gray-600 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-4">AI 윤리 수준을 직접 확인해보세요</h2>
          <p className="text-base text-white/80 mb-8 leading-relaxed">
            무료 진단 15문항을 통해 8개 원칙 축별 나의 AI 윤리 이해 수준을 즉시 파악할 수 있습니다.
          </p>
          <Link to="/diagnosis" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all text-lg">
            무료 진단 시작 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
