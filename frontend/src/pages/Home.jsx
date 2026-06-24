import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const values = [
  { icon: '🔍', title: '투명성', body: 'AI가 어떻게 판단했는지 이용자가 알 수 있어야 합니다. 블랙박스 AI는 신뢰를 잃습니다.' },
  { icon: '⚖️', title: '공정성', body: '알고리즘 편향은 채용·의료·금융에서 특정 집단을 차별합니다. 데이터부터 검증이 필요합니다.' },
  { icon: '🛡️', title: '책임성', body: 'AI 사고의 책임은 AI가 아닌 도입·운영 조직에 있습니다. 명확한 거버넌스가 필수입니다.' },
  { icon: '🔒', title: '안전성', body: '환각, 사이버공격, 오남용 — 고위험 AI에는 인간 감독 체계가 법적으로 요구됩니다.' },
]

const services = [
  { num: '01', title: 'AI 윤리 진단', sub: '개인·기업·기관', body: '8개 축 평가 체계로 투명성·공정성·책임성·안전성·개인정보·저작권·컴플라이언스·ESG 수준을 정량 측정합니다.', link: '/diagnosis', cta: '무료 진단' },
  { num: '02', title: '교육 과정', sub: '유치원 ~ 전문가', body: '대상별 맞춤 커리큘럼. 안전 습관 교육부터 기업 AI 거버넌스 설계까지 6단계 체계로 운영됩니다.', link: '/education', cta: '교육 보기' },
  { num: '03', title: '자격 인증', sub: '9급 ~ 전문 1급', body: '민간자격 6개 등급. 취업·입찰·ESG 보고서·강사 활동에 활용할 수 있는 공식 자격증이 발급됩니다.', link: '/certificate', cta: '자격 안내' },
  { num: '04', title: '기업 컨설팅', sub: '진단→인증→사후관리', body: '6단계 프로세스로 기업의 AI 윤리 체계를 구축합니다. EU AI Act·AI 기본법 대응 리스크 보고서를 제공합니다.', link: '/process', cta: '프로세스 보기' },
]

const targets = [
  { emoji: '🏢', who: '기업·스타트업', why: 'EU AI Act 2026 시행, 한국 AI 기본법 시행. 미대응 시 매출의 최대 6% 과징금.', what: '직원 진단 + 인증 + 컨설팅' },
  { emoji: '🎓', who: '학교·교육기관', why: '딥페이크, AI 과제 표절, 저작권 — 학생 AI 사고가 급증하고 있습니다.', what: '학생 교육 + 교사 연수 + 학교 인증' },
  { emoji: '👤', who: '직장인·개인', why: 'AI를 쓰다 생긴 법적 사고, 정보 유출, 오답 신뢰 — 실무 윤리 감각이 필요합니다.', what: '개인 진단 + 교육 + 자격 취득' },
  { emoji: '🏆', who: '전문가·강사 지망', why: 'AI 윤리 강사·컨설턴트 수요가 급성장. 자격 취득 후 바로 활동 가능합니다.', what: '전문 2~1급 + 강사 풀 등록' },
]

const trust = [
  { label: '특허 기반', detail: '프롬프트 평가 특허 출원 기술로 설계된 진단 체계' },
  { label: '공식 자료 DB', detail: '국내외 AI 윤리 공식 자료 200+ 직접 수집 DB화' },
  { label: '민간자격 등록', detail: '자격기본법에 따라 등록된 민간자격 6개 등급 운영' },
  { label: '규제 대응 설계', detail: 'EU AI Act · 한국 AI 기본법 · OECD · UNESCO 기준 반영' },
]

export default function Home() {
  return (
    <div className="text-gray-800">

      {/* 히어로 */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-block text-xs font-bold bg-primary-600 px-3 py-1 rounded-full mb-4">2026년 AI 기본법 시행 대비</div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                AI 윤리<br />진단·교육·자격·컨설팅
              </h1>
              <p className="text-sm text-gray-300 leading-relaxed mb-8">
                AI를 쓰는 모든 개인과 기업이 알아야 할 윤리 기준. 무료 진단으로 지금 당장 취약점을 파악하세요. EU AI Act·한국 AI 기본법 대응부터 자격 취득까지 원스톱으로 지원합니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/diagnosis" className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white font-bold px-6 py-3 rounded-lg text-sm transition-all">
                  무료 진단 시작 <ArrowRight size={14} />
                </Link>
                <Link to="/paid-diagnosis" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all">
                  유료 심화 진단
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '87%', d: '직장인 AI 사용 경험' },
                { n: '3%', d: '기업 AI 정책 보유율' },
                { n: '2026.1', d: '한국 AI 기본법 시행' },
                { n: '6%', d: 'EU AI Act 최대 과징금(매출)' },
              ].map(s => (
                <div key={s.n} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-2xl font-black text-primary-400 mb-1">{s.n}</div>
                  <div className="text-[10px] text-gray-400">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 원칙 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-base font-extrabold text-gray-900">AI 윤리 4대 핵심 원칙</h2>
            <p className="text-xs text-gray-500 mt-1">OECD·EU·UNESCO가 공통으로 강조하는 글로벌 AI 윤리 기준</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map(v => (
              <div key={v.title} className="border-t-2 border-primary-400 pt-4">
                <div className="text-xl mb-2">{v.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 서비스 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-base font-extrabold text-gray-900">4대 서비스</h2>
            <p className="text-xs text-gray-500 mt-1">진단 → 교육 → 자격 → 컨설팅으로 이어지는 통합 AI 윤리 솔루션</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map(s => (
              <div key={s.num} className="bg-white border border-gray-100 p-4 rounded-lg">
                <div className="text-[10px] font-black text-primary-300 mb-1">{s.num}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">{s.title}</h3>
                <div className="text-[10px] text-primary-600 font-semibold mb-2">{s.sub}</div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{s.body}</p>
                <Link to={s.link} className="text-[10px] font-bold text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
                  {s.cta} <ArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 대상 */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-base font-extrabold text-gray-900">누구를 위한 서비스인가요</h2>
            <p className="text-xs text-gray-500 mt-1">AI를 쓰는 모든 사람을 위해 설계했습니다</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {targets.map(t => (
              <div key={t.who} className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl mb-2">{t.emoji}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{t.who}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{t.why}</p>
                <div className="text-[10px] font-semibold text-primary-600">{t.what}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 신뢰 */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-base font-extrabold">왜 신뢰할 수 있나요</h2>
            <p className="text-xs text-gray-400 mt-1">검증된 기준과 공식 자료를 기반으로 운영합니다</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trust.map(t => (
              <div key={t.label} className="border-l-2 border-primary-500 pl-4">
                <h3 className="text-sm font-bold text-white mb-1">{t.label}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{t.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-extrabold mb-3">지금 무료로 AI 윤리 수준을 확인하세요</h2>
          <p className="text-xs text-white/80 mb-6">15문항 · 10분 · 8개 축 결과 리포트 · 무료</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/diagnosis" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-lg text-sm hover:bg-gray-50 transition-all">
              무료 진단 시작 <ArrowRight size={14} />
            </Link>
            <Link to="/paid-diagnosis" className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-white/10 transition-all">
              유료 심화 진단
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
