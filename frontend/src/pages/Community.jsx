import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const newsArticles = [
  {
    date: '2025년 6월', tag: '해외 규제',
    title: 'EU AI Act 2026년 전면 시행 — 기업이 지금 준비해야 할 것',
    summary: 'EU AI Act의 고위험 AI 의무 사항이 2026년부터 전면 적용됩니다. 채용·교육·금융·의료 분야 AI를 운영하는 기업은 적합성 평가, 기술 문서화, 인간 감독 체계를 갖춰야 합니다. 위반 시 글로벌 연간 매출의 최대 6% 과징금이 부과됩니다. EU 시장에 진출해 있거나 진출 예정인 한국 기업의 즉각적 대응이 필요합니다.',
  },
  {
    date: '2025년 5월', tag: '국내 규제',
    title: '한국 AI 기본법 2026년 1월 시행 — 고영향 AI 투명성 의무란',
    summary: '한국 AI 기본법이 2026년 1월부터 시행됩니다. 채용, 교육, 금융, 의료, 공공서비스 분야에서 자동화 의사결정을 내리는 "고영향 AI"는 이용자에게 AI 활용 사실을 고지해야 합니다. 법 위반 시 과태료와 시정명령이 부과될 수 있습니다. 주요 조항 해설과 기업 대응 방안을 정리합니다.',
  },
  {
    date: '2025년 5월', tag: '국내 규제',
    title: 'AI 기본법 시행령 초안 공개 — 산업별 세부 기준 예고',
    summary: '과학기술정보통신부가 AI 기본법 시행령 초안을 공개했습니다. 고영향 AI의 구체적 범위, 위험도 평가 방법, 사전 신고 절차 등이 규정될 예정입니다. 의료기기 AI, 금융 신용평가 AI, 채용 AI를 운영하는 기업은 시행령 내용을 면밀히 검토해야 합니다.',
  },
  {
    date: '2025년 4월', tag: '국제 기준',
    title: 'OECD AI 원칙 2024 업데이트 — 생성형 AI 항목 추가',
    summary: 'OECD가 2019년 발표한 AI 원칙을 업데이트하여 생성형 AI와 고급 AI 시스템에 특화된 내용을 추가했습니다. 생성 콘텐츠 투명성, 대규모 AI 모델의 위험 평가 의무, 기반모델(Foundation Model) 제공자의 책임 등 새로운 항목이 포함되었습니다.',
  },
  {
    date: '2025년 3월', tag: '사례',
    title: '딥페이크 피해 국내 2024년 급증 — AI 윤리 교육 시급',
    summary: '방송통신위원회·여성가족부 통계에 따르면 2024년 딥페이크 성범죄 신고 건수가 전년 대비 3배 이상 증가했습니다. 피해자의 80% 이상이 10~20대입니다. AI 이미지·영상 생성 도구의 접근성이 높아지면서 아동·청소년 대상 AI 안전 교육의 필요성이 어느 때보다 큽니다.',
  },
  {
    date: '2025년 3월', tag: '사례',
    title: 'AI 채용 차별 소송 — 알고리즘 공정성 이슈 분석',
    summary: '미국과 EU에서 AI 기반 채용 시스템의 성별·인종 차별을 이유로 한 집단소송이 잇따르고 있습니다. 한국에서도 AI 자기소개서 필터링 시스템의 편향 여부에 대한 논의가 시작되었습니다. 기업의 채용 AI 도입 시 알고리즘 공정성 감사가 필수가 되고 있습니다.',
  },
  {
    date: '2025년 2월', tag: '국제 기준',
    title: 'ISO/IEC 42001 인증 기업 급증 — AI 거버넌스 국제 표준',
    summary: '2023년 발효된 ISO/IEC 42001(AI 관리 시스템 국제표준) 인증 기업이 2025년 들어 급증하고 있습니다. 특히 EU AI Act 대응과 B2B 계약에서 AI 거버넌스 역량 증명 수단으로 활용되고 있습니다. 한국에서도 대기업을 중심으로 인증 준비가 시작되고 있습니다.',
  },
  {
    date: '2025년 1월', tag: '해외 규제',
    title: '일본 AI 사업자 가이드라인 발표 — 한일 비교 분석',
    summary: '일본이 AI 개발자·제공자·이용자 각 주체별 행동지침을 담은 AI 사업자 가이드라인을 발표했습니다. G7 히로시마 AI 프로세스 기반으로 만들어졌으며, 생성형 AI 특화 조항을 포함합니다. 한국 AI 기본법과의 비교 분석을 통해 양국 기업에 주는 시사점을 정리합니다.',
  },
]

const resources = [
  { title: 'EU AI Act 공식 원문 (영문)', type: '법령', org: '유럽의회·이사회', year: '2024' },
  { title: 'EU AI Act 주요 내용 요약 (한국어)', type: '요약자료', org: '과학기술정보통신부', year: '2024' },
  { title: 'NIST AI 리스크 관리 프레임워크 (AI RMF 1.0)', type: '프레임워크', org: 'NIST (미국)', year: '2023' },
  { title: '인공지능 발전과 신뢰 기반 조성에 관한 기본법', type: '법령', org: '국회·과기부', year: '2026' },
  { title: 'OECD AI 원칙 (한국어 번역)', type: '원칙', org: 'OECD', year: '2019/업데이트' },
  { title: 'UNESCO AI 윤리 권고안 (영문·국문)', type: '권고안', org: 'UNESCO', year: '2021' },
  { title: '생성형 AI 윤리 가이드북', type: '가이드', org: '과학기술정보통신부', year: '2023' },
  { title: '일본 AI 사업자 가이드라인 (일문·영문)', type: '가이드라인', org: '경제산업성·총무성', year: '2024' },
  { title: 'G7 히로시마 AI 프로세스 행동규범', type: '국제규범', org: 'G7', year: '2023' },
  { title: 'ISO/IEC 42001 AI 관리 시스템 표준 (개요)', type: '국제표준', org: 'ISO/IEC', year: '2023' },
  { title: '개인정보 보호법 AI 관련 조항 해설', type: '해설서', org: '개인정보보호위원회', year: '2024' },
  { title: 'AI 윤리 공식자료 조사 DB v2 (2025~2026)', type: 'DB', org: '자체 제작', year: '2025' },
]

const seminars = [
  { date: '2025년 7월 15일', title: 'AI 윤리 기업 컨설팅 실무 세미나 — 진단부터 인증까지', location: '온라인 (Zoom)', status: '접수중', desc: 'B2B 직원 진단, 기업 AI 윤리 정책 수립, 인증 절차를 실무 중심으로 다룹니다. 기업 HR·법무·IT 담당자 대상.' },
  { date: '2025년 8월 10일', title: 'EU AI Act 대응 기업 실무 워크숍 — 2026년 시행 전 체크리스트', location: '서울 / 온라인', status: '예정', desc: 'EU AI Act 전면 시행에 앞서 우리 회사에 해당하는 의무 사항을 점검하고, 대응 로드맵을 수립하는 워크숍입니다.' },
  { date: '2025년 9월 20일', title: 'AI 윤리 강사 양성 과정 (1기) — 전문 2급 교육 연계', location: '서울 (오프라인)', status: '예정', desc: '기업·학교·기관에서 AI 윤리를 가르칠 수 있는 강사를 양성합니다. 전문 2급 자격과 연계되며, 수료 후 강사 풀에 등록됩니다.' },
  { date: '2025년 10월', title: '어린이 AI 안전 부모 세미나 — 우리 아이 AI 윤리 교육법', location: '온라인', status: '예정', desc: '자녀가 AI를 안전하게 사용하도록 돕는 부모 대상 세미나. 딥페이크, 개인정보, AI 과의존 예방을 다룹니다.' },
  { date: '2025년 11월', title: '한국 AI 기본법 시행 대비 기업 점검 세미나', location: '서울 / 온라인', status: '예정', desc: '2026년 1월 시행을 앞두고 기업이 갖춰야 할 AI 거버넌스 체계를 점검합니다. 법무·IT 담당자 필참.' },
]

const tagColors = {
  '해외 규제': 'bg-blue-100 text-blue-700',
  '국내 규제': 'bg-red-100 text-red-700',
  '국제 기준': 'bg-green-100 text-green-700',
  '사례': 'bg-amber-100 text-amber-700',
}

export default function Community() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">커뮤니티</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            AI 윤리 최신 뉴스, 국내외 정책 분석, 공식 자료실, 세미나 일정을 한곳에서 확인하세요. 빠르게 변화하는 AI 규제 환경을 지속적으로 업데이트합니다.
          </p>
        </div>
      </section>

      {/* 뉴스 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">AI 윤리 뉴스 · 정책 분석</h2>
          <p className="text-base text-gray-500 mb-14">국내외 AI 윤리·규제 최신 동향을 정리합니다.</p>

          <div className="space-y-10">
            {newsArticles.map(article => (
              <div key={article.title} className="pb-10 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tagColors[article.tag]}`}>{article.tag}</span>
                  <span className="text-sm text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3 leading-snug">{article.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{article.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 자료실 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">자료실</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            국내외 AI 윤리·규제 공식 자료를 직접 수집하고 DB화하였습니다. 저희 교육 커리큘럼과 진단 체계는 아래 공식 자료를 기반으로 설계됩니다. 자료의 최신성은 각 발행 기관 공식 사이트에서 확인하세요.
          </p>

          <div className="space-y-4">
            {resources.map(r => (
              <div key={r.title} className="flex items-start gap-5 py-4 border-b border-gray-200 last:border-0">
                <div className="shrink-0 w-20 text-center">
                  <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded">{r.type}</span>
                </div>
                <div className="flex-1">
                  <div className="text-base font-semibold text-gray-900 mb-1">{r.title}</div>
                  <div className="text-sm text-gray-500">{r.org} · {r.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 세미나 */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">세미나 · 교육 일정</h2>
          <p className="text-base text-gray-500 mb-14">AI 윤리 관련 세미나, 워크숍, 강사 양성 과정 일정을 안내합니다.</p>

          <div className="space-y-10">
            {seminars.map(s => (
              <div key={s.title} className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-10 border-b border-gray-100 last:border-0">
                <div className="lg:col-span-3">
                  <div className="text-sm font-bold text-gray-900 mb-1">{s.date}</div>
                  <div className="text-sm text-gray-500 mb-2">{s.location}</div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.status === '접수중' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.status}
                  </span>
                </div>
                <div className="lg:col-span-9">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-snug">{s.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
