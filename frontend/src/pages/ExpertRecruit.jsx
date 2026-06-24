import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const expertTypes = [
  {
    type: '법률·규제 전문가', icon: '⚖️',
    body: 'AI 관련 법률, 개인정보 보호법, 저작권법, EU AI Act, 한국 AI 기본법 분야의 전문가를 모십니다. 기업 법무 담당자, 변호사, 정책 연구자, 법학 교수 등 AI 규제 해석과 컴플라이언스 자문이 가능한 분을 찾고 있습니다.',
  },
  {
    type: '교육 전문가·강사', icon: '🎓',
    body: '초중고·대학교·기업체에서 AI 윤리를 가르칠 수 있는 강사를 모십니다. 현직 교사, 대학 교수, HRD 전문가, 평생교육 강사 등 대상에 맞는 교육 설계와 강의 진행이 가능한 분을 환영합니다. 전문 2급 자격 보유자 우대.',
  },
  {
    type: 'AI·데이터 윤리 연구자', icon: '🔬',
    body: '알고리즘 공정성, 설명가능한 AI(XAI), 프라이버시 보호 기술, AI 편향성 연구 경험이 있는 분을 찾습니다. 학계 연구자뿐 아니라 기업 AI 팀 출신으로 실무와 이론을 겸비한 분도 환영합니다.',
  },
  {
    type: '산업 분야 전문가', icon: '🏭',
    body: '의료, 금융, 교육, 제조, 콘텐츠, HR, 공공행정 등 특정 산업에서 AI를 실제로 활용하고 그 윤리 문제를 직접 경험한 분을 모십니다. 산업별 사례를 구체적으로 제시하고 컨설팅할 수 있는 경험이 핵심입니다.',
  },
  {
    type: '콘텐츠 개발 전문가', icon: '✍️',
    body: 'AI 윤리 관련 교육 자료, 영상 강의, 보고서, 진단 문항을 개발할 수 있는 분을 찾습니다. 교육 콘텐츠 기획, e-Learning 제작, 커리큘럼 설계 경험이 있으신 분을 우대합니다.',
  },
  {
    type: '국제 협력·번역 전문가', icon: '🌐',
    body: 'OECD, UNESCO, EU AI Act 등 국제 AI 윤리 자료를 한국어로 번역하고 해석하는 역할을 담당합니다. 영어·일어·독어 등 외국어 능력과 AI 정책 이해가 동시에 필요한 포지션입니다.',
  },
]

const benefits = [
  { title: '전문 활동 무대', body: '기업 교육, 학교 강의, 기관 컨설팅 등 다양한 현장에서 AI 윤리 전문가로 활동할 수 있는 의뢰를 연결해 드립니다. 수수료 없이 의뢰 기관과 직접 계약하는 방식으로 운영됩니다.' },
  { title: '콘텐츠 공동 개발', body: '교육 과정·진단 문항·보고서 등 콘텐츠를 공동 개발하고 수익을 나누는 모델을 운영합니다. 본인의 전문 지식이 교육 자산으로 남는 방식입니다.' },
  { title: '네트워크 참여', body: '법률·교육·AI 기술·산업 현장의 전문가들과 함께하는 AI 윤리 전문가 네트워크에 참여하고, 공동 연구·세미나·정책 자문 기회를 얻을 수 있습니다.' },
  { title: '자격 연계', body: '전문 2~1급 자격 취득을 지원합니다. 전문가 네트워크 내 교육 기회와 함께 자격 취득 후 강사·심사관·컨설팅 파트너로 공식 등록됩니다.' },
]

const steps = [
  { num: '01', title: '지원서 작성', body: '아래 양식에 전문 분야, 주요 경력, 가능한 활동 유형(강의·컨설팅·콘텐츠 개발·연구 등), 보유 자격 및 학위, 연락처를 작성해 주세요.' },
  { num: '02', title: '서류 검토', body: '제출된 이력과 전문성을 검토합니다. 필요 시 추가 자료(포트폴리오, 강의 영상 등)를 요청할 수 있습니다. 검토 기간은 통상 5~10 영업일입니다.' },
  { num: '03', title: '면담 또는 샘플 과제', body: '서류 통과 후 화상 면담 또는 샘플 콘텐츠 개발 과제를 통해 전문성을 확인합니다. 강사 지원자의 경우 15분 시연 강의가 포함될 수 있습니다.' },
  { num: '04', title: '전문가 풀 등록', body: '최종 선정 후 전문가 풀에 등록되며, 활동 유형과 분야에 맞는 프로젝트·의뢰가 연결됩니다. 등록 후 온보딩 자료와 활동 가이드를 제공합니다.' },
]

export default function ExpertRecruit() {
  const [form, setForm] = useState({ name: '', email: '', specialty: '', experience: '', activityType: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true) }

  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">전문가 모집</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            AI 윤리 전문가 풀을 확장하고 있습니다. 법률·교육·AI 연구·산업 현장의 전문가로서 기업·학교·기관에 AI 윤리를 가르치고, 진단하고, 컨설팅하는 활동에 함께하세요.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">모집 분야</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            특정 분야의 박사 학위나 공인 자격이 반드시 필요한 것은 아닙니다. 해당 분야에서 실무 경험이 있고, AI 윤리의 중요성에 공감하며, 타인에게 지식을 전달할 수 있는 분이라면 지원을 환영합니다.
          </p>

          <div className="space-y-8">
            {expertTypes.map(e => (
              <div key={e.type} className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-8 border-b border-gray-100 last:border-0">
                <div className="lg:col-span-3">
                  <div className="text-3xl mb-2">{e.icon}</div>
                  <h3 className="text-lg font-extrabold text-gray-900">{e.type}</h3>
                </div>
                <div className="lg:col-span-9">
                  <p className="text-base text-gray-600 leading-relaxed">{e.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">전문가로 활동하면 얻는 것</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            단순한 강사 등록이 아닙니다. AI 윤리 전문가 생태계의 일원으로 지식을 나누고, 영향력을 확장하며, 함께 성장하는 구조를 만들고 있습니다.
          </p>

          <div className="space-y-7">
            {benefits.map(b => (
              <div key={b.title} className="border-l-4 border-primary-400 pl-6 py-3">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">지원 절차</h2>
          <p className="text-base text-gray-600 mb-14 leading-relaxed">
            복잡한 절차 없이 간단한 지원서 작성과 면담으로 진행됩니다.
          </p>

          <div className="space-y-8 mb-16">
            {steps.map(step => (
              <div key={step.num} className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-8 border-b border-gray-100 last:border-0">
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

          {submitted ? (
            <div className="border border-primary-200 bg-primary-50 rounded-xl p-10 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-2xl font-extrabold text-primary-700 mb-3">지원서가 접수되었습니다</h3>
              <p className="text-base text-gray-600 leading-relaxed">검토 후 5~10 영업일 이내로 이메일로 연락드리겠습니다. 감사합니다.</p>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-8">전문가 지원서 작성</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">이름 *</label>
                    <input
                      type="text" name="name" required value={form.name} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-500"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">이메일 *</label>
                    <input
                      type="email" name="email" required value={form.email} onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-500"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">전문 분야 *</label>
                  <select
                    name="specialty" required value={form.specialty} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-500"
                  >
                    <option value="">선택해주세요</option>
                    {expertTypes.map(e => <option key={e.type} value={e.type}>{e.type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">희망 활동 유형 *</label>
                  <select
                    name="activityType" required value={form.activityType} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-500"
                  >
                    <option value="">선택해주세요</option>
                    <option>강의·교육</option>
                    <option>기업 컨설팅</option>
                    <option>콘텐츠·교재 개발</option>
                    <option>정책 자문·연구</option>
                    <option>번역·국제 협력</option>
                    <option>복수 가능</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">주요 경력 및 전문성 소개 *</label>
                  <textarea
                    name="experience" required value={form.experience} onChange={handleChange} rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-500"
                    placeholder="직책, 소속, 주요 경력, 관련 자격·학위, AI 윤리 관련 활동 등을 자유롭게 작성해 주세요."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">기타 메시지</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-primary-500"
                    placeholder="포트폴리오 링크, 문의 사항, 특이사항 등"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-700 transition-all text-lg"
                >
                  지원서 제출
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
