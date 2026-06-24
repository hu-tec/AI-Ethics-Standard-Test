import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const plans = [
  {
    step: '1단계', name: '기초 심화 진단', price: '49,000원',
    badge: '가장 인기', badgeColor: 'bg-primary-600 text-white',
    target: '직장인·대학생·자격 취득 준비자',
    items: ['20문항 10개 평가 축', '투명성·공정성·책임성·안전성·개인정보·저작권·컴플라이언스·ESG·딥페이크·실무', '축별 점수 + 취약 영역 분석', '개인 맞춤 학습 경로 제안', '권장 자격 급수 자동 산정', '결과 PDF · 재응시 1회 무료'],
    link: '/paid-diagnosis/1', color: 'border-primary-400',
  },
  {
    step: '2단계', name: '직무·산업 심화 진단', price: '79,000원',
    badge: '산업 전문', badgeColor: 'bg-accent-600 text-white',
    target: '의료·금융·HR·콘텐츠 업종 종사자',
    items: ['20문항 직무·산업 특화 문항', '의료AI·금융AI·HR AI·콘텐츠AI·법·규제·데이터·거버넌스', '동종 업계 평균 비교', '업종별 핵심 리스크 분석', '규제 대응 체크리스트', '결과 PDF + 컨설팅 상담 1회'],
    link: '/paid-diagnosis/2', color: 'border-accent-400',
  },
  {
    step: '3단계', name: '전문가 자격 사전 진단', price: '39,000원',
    badge: '자격 연계', badgeColor: 'bg-purple-600 text-white',
    target: '전문 2~1급 자격 취득 준비자',
    items: ['20문항 전문가 수준 문항', 'EU AI Act·AI기본법·NIST·ISO42001·진단설계·컨설팅·사례분석', '합격 가능성 예측 점수', '자격 등급 추천 (전문 2급/1급)', '권장 준비 기간 안내', '재응시 1회 무료'],
    link: '/paid-diagnosis/3', color: 'border-purple-400',
  },
]

const compare = [
  { item: '문항 수', free: '15문항', p1: '20문항', p2: '20문항', p3: '20문항' },
  { item: '평가 수준', free: '기초 이해', p1: '기초 심화', p2: '직무·산업 전문', p3: '전문가·자격 수준' },
  { item: '결과 리포트', free: '기본 점수', p1: '전체 축 분석 PDF', p2: '업종별 리스크 PDF', p3: '합격 가능성 예측' },
  { item: '맞춤 학습 경로', free: '미제공', p1: '개인 맞춤', p2: '산업 맞춤', p3: '자격별 맞춤' },
  { item: '부가 서비스', free: '없음', p1: '재응시 1회 무료', p2: '컨설팅 상담 1회', p3: '재응시 1회 무료' },
]

export default function PaidDiagnosisHub() {
  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-14">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-xs text-gray-400 mb-3">
            <Link to="/diagnosis" className="hover:text-white">무료 진단</Link> → 유료 진단
          </div>
          <h1 className="text-4xl font-extrabold mb-3">유료 심화 진단</h1>
          <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
            무료 진단(15문항)보다 깊고 맞춤화된 AI 윤리 진단입니다. 3가지 단계 중 목적에 맞게 선택하세요.
          </p>
          <p className="text-xs text-gray-500 mt-3">
            처음이라면?{' '}
            <Link to="/diagnosis" className="underline text-gray-400 hover:text-white">무료 진단(15문항) 먼저 해보기 →</Link>
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="space-y-8">
            {plans.map(plan => (
              <div key={plan.step} className={`border-l-4 ${plan.color} pl-6 py-4`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>{plan.step}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeColor} opacity-70`}>{plan.badge}</span>
                    </div>
                    <h2 className="text-lg font-extrabold text-gray-900 mb-0.5">{plan.name}</h2>
                    <div className="text-2xl font-black text-primary-600 mb-1">{plan.price}</div>
                    <div className="text-xs text-gray-500 mb-4">{plan.target}</div>
                    <Link to={plan.link} className="inline-flex items-center gap-1.5 bg-primary-600 text-white font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-primary-700 transition-all">
                      시작하기 <ArrowRight size={12} />
                    </Link>
                  </div>
                  <div className="lg:col-span-8">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {plan.items.map(item => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-primary-500 font-bold mt-0.5 shrink-0">✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-sm font-extrabold text-gray-900 mb-6">무료 진단 vs 유료 진단 비교</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 pr-4 text-gray-700 font-bold">항목</th>
                  <th className="text-center py-2 px-3 text-gray-500 font-semibold">무료 진단</th>
                  <th className="text-center py-2 px-3 text-primary-700 font-bold">1단계</th>
                  <th className="text-center py-2 px-3 text-accent-700 font-bold">2단계</th>
                  <th className="text-center py-2 px-3 text-purple-700 font-bold">3단계</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((r, i) => (
                  <tr key={r.item} className={`border-b border-gray-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-2 pr-4 font-semibold text-gray-700">{r.item}</td>
                    <td className="py-2 px-3 text-center text-gray-400">{r.free}</td>
                    <td className="py-2 px-3 text-center text-primary-700 font-semibold">{r.p1}</td>
                    <td className="py-2 px-3 text-center text-accent-700 font-semibold">{r.p2}</td>
                    <td className="py-2 px-3 text-center text-purple-700 font-semibold">{r.p3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
