import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const targets = [
  {
    id: 'child', label: '유치원·초등 저학년', icon: '🧒', grade: '9~7급',
    intro: 'AI가 대중화된 시대, 아이들은 이미 AI 도구를 접하고 있습니다. 유치원·초등 저학년은 AI의 위험성을 인식하고, 개인정보를 보호하며, AI를 올바르게 사용하는 안전 습관을 기릅니다.',
    courses: [
      { name: 'AI와 친구하기 (유치원)', body: 'AI가 무엇인지 그림과 이야기로 이해합니다. AI가 항상 맞지는 않다는 것, AI에게 이름·학교·전화번호를 알려주면 안 된다는 것을 배웁니다.' },
      { name: '개인정보 지키기', body: '나의 이름, 집 주소, 사진, 학교 이름은 AI에게도, 인터넷에도 함부로 올리면 안 된다는 것을 상황극과 OX 게임으로 익힙니다.' },
      { name: '착한 AI 사용', body: '친구의 사진으로 장난치거나, 친구를 놀리는 이미지·음성을 AI로 만들면 안 된다는 것을 배웁니다. AI를 나쁘게 쓰면 친구에게 상처가 된다는 것을 이해합니다.' },
      { name: '보호자 연결 가이드', body: '자녀의 AI 사용 현황을 보호자가 확인하고 대화할 수 있도록 부모 안내문과 대화 가이드를 제공합니다.' },
    ],
  },
  {
    id: 'middle_elem', label: '초등 고학년·중학생', icon: '📚', grade: '6~3급',
    intro: '본격적으로 AI로 과제를 하고, 딥페이크를 접하며, 저작권 문제가 생기기 시작하는 시기입니다. AI 결과를 검증하는 능력, 저작권 기초, 딥페이크 식별 능력을 기릅니다.',
    courses: [
      { name: 'AI 결과 검증법', body: 'AI가 알려준 것이 사실인지 확인하는 방법을 배웁니다. 인터넷 검색과 교과서로 AI 답변을 확인하는 연습을 합니다. "AI가 말했으니 맞다"는 생각이 왜 위험한지 이해합니다.' },
      { name: '저작권·초상권 기초', body: 'AI로 만든 그림·글이 다른 사람의 창작물을 사용한 것일 수 있다는 것을 배웁니다. 타인의 사진, 얼굴, 목소리를 함부로 AI로 변형하면 안 된다는 것을 사례 퀴즈로 익힙니다.' },
      { name: '딥페이크 경계와 신고', body: '가짜 영상·음성을 AI로 만들 수 있다는 것을 이해하고, 딥페이크를 발견했을 때 신고하는 방법을 배웁니다. 학교 폭력 맥락에서의 딥페이크 피해를 토론합니다.' },
      { name: 'AI 과제 윤리', body: '숙제·리포트에 AI를 사용할 때는 선생님이 허용한 범위에서만 사용하고, AI를 사용했음을 표시해야 한다는 것을 배웁니다. AI 표절이 왜 문제인지 이해합니다.' },
    ],
  },
  {
    id: 'high', label: '고등학생', icon: '🎒', grade: '2~1급',
    intro: '입시·진로에 AI를 적극 활용하는 시기이지만, 자기소개서·과제에서 AI 윤리 위반이 가장 많이 발생하는 시기이기도 합니다. 학업 윤리와 글로벌 AI 기준을 함께 배웁니다.',
    courses: [
      { name: '학업 AI 윤리 기준', body: '자기소개서, 소논문, 발표자료, 수행평가에서 AI를 어떻게, 어디까지 사용할 수 있는지 학교 정책과 교육부 지침 기준을 이해합니다.' },
      { name: '공식자료 탐색 실습', body: 'EU AI Act, OECD AI 원칙, 한국 AI 기본법 등의 공식 사이트를 직접 방문하고 핵심 내용을 요약하는 실습을 합니다. AI 시대 정보 리터러시 역량을 기릅니다.' },
      { name: '글로벌 AI 규제 이해', body: '전 세계가 왜 AI 규제를 만드는지, 각 나라의 기준이 어떻게 다른지를 이해합니다. 미래 진로(법률·의료·개발·교육 등)와 AI 윤리의 연관성을 탐색합니다.' },
      { name: '진로·취업 AI 윤리', body: '대학 지원서, 취업 자기소개서에 AI를 사용했을 때 어떤 문제가 생길 수 있는지, 어떻게 올바르게 활용할 수 있는지 실제 사례로 배웁니다.' },
    ],
  },
  {
    id: 'college', label: '대학생', icon: '🎓', grade: '일반 3~2급',
    intro: '리포트·논문·포트폴리오에 AI가 일상화된 대학생에게는 학문 윤리와 AI 활용 기준이 가장 중요합니다. 취업 시장에서 AI 윤리 역량은 경쟁력이 됩니다.',
    courses: [
      { name: '논문·리포트 AI 활용 기준', body: '학교별, 학과별, 국제 학술지별 AI 사용 기준이 다릅니다. AI 활용 선언문 작성, 출처 표기, AI 생성 텍스트 검출 원리를 이해하고 대응하는 방법을 배웁니다.' },
      { name: '취업·포트폴리오 윤리', body: '자기소개서·포트폴리오에 AI가 만든 내용을 자신의 것처럼 제출하면 어떤 문제가 생기는지, 기업들이 어떻게 AI 작성 여부를 확인하는지 알아봅니다.' },
      { name: '글로벌 AI 기준 탐구', body: 'EU AI Act, NIST, UNESCO, OECD 공식 문서를 읽고 핵심 내용을 정리하는 보고서 작성 실습을 합니다. 국제 AI 정책 트렌드를 이해합니다.' },
      { name: '자격 연계 모의시험', body: '일반 3~2급 자격시험에 대비한 모의시험으로 OX, 객관식, 사례형 문항을 풀어봅니다. 취업·대학원 진학에 AI 윤리 자격을 경력으로 활용하는 방법도 안내합니다.' },
    ],
  },
  {
    id: 'worker', label: '직장인', icon: '💼', grade: '일반 3~1급',
    intro: '업무에 AI를 활용하는 직장인에게는 보안·저작권·책임의 실무 감각이 중요합니다. 회사 자료를 보호하고, AI 결과를 검수하며, 법적 책임을 이해하는 역량을 기릅니다.',
    courses: [
      { name: '업무 AI 보안 기초', body: '고객 개인정보, 내부 기밀자료, 영업비밀을 AI 도구에 입력하면 왜 위험한지 이해합니다. 회사에서 허가된 AI 도구와 금지된 도구를 구분하는 기준을 배웁니다.' },
      { name: '생성물 검수와 책임', body: 'AI가 만든 보고서·번역·이미지·코드를 배포하기 전 반드시 검수해야 하는 이유와 방법을 익힙니다. AI 오류로 인한 사고 발생 시 책임이 어디에 있는지 이해합니다.' },
      { name: '저작권·개인정보 실무', body: 'AI 생성 이미지를 광고에 사용하거나, AI 번역을 계약서에 활용할 때 확인해야 할 저작권 체크포인트를 실무 시나리오로 배웁니다.' },
      { name: '부서 AI 규정 만들기', body: '내 부서에서 AI를 어떤 목적으로, 어떤 도구로, 어떤 데이터로 사용할 수 있는지 규정을 직접 작성해보는 실습 과제입니다.' },
    ],
  },
  {
    id: 'expert', label: '전문가·강사', icon: '🏆', grade: '전문 2~1급',
    intro: '기업·학교·기관에서 AI 윤리를 가르치고, 진단하고, 컨설팅할 수 있는 전문가를 양성합니다. 이론 이해를 넘어 실제 진단표 설계, 사례 강의, 보고서 작성 역량을 기릅니다.',
    courses: [
      { name: 'AI 윤리 진단표 설계', body: '기업·개인의 AI 윤리 수준을 평가하는 진단 문항 설계, 가중치 설정, 점수화 방법을 배웁니다. 프롬프트 평가 특허 기반 평가 방법론을 적용합니다.' },
      { name: '산업별 사례 강의 제작', body: '금융·의료·교육·HR·콘텐츠 등 산업별 실제 AI 윤리 사고 사례를 분석하고, 이를 강의 콘텐츠로 제작하는 방법을 익힙니다.' },
      { name: '기업 컨설팅 실습', body: '가상 기업의 AI 사용 현황을 진단하고, 위험 영역을 분석하며, 개선 방향과 교육 계획을 담은 컨설팅 리포트를 작성합니다.' },
      { name: '리스크 보고서 작성', body: '경영진이 이해하고 의사결정에 활용할 수 있는 AI 윤리 리스크 보고서 형식과 작성 방법을 배웁니다. EU AI Act, AI 기본법 규제 대응 섹션 포함.' },
    ],
  },
]

export default function Education() {
  const [active, setActive] = useState('child')
  const current = targets.find(t => t.id === active)

  return (
    <div className="text-gray-800">
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">AI 윤리 교육 과정</h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            유치원부터 최고전문가까지 — 대상별로 설계된 AI 윤리 커리큘럼. 단순한 개념 강의가 아닌, 진단·시험·자격으로 연결되는 실무 중심 교육입니다.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-12">
            {targets.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  active === t.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {current && (
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h2 className="text-3xl font-extrabold text-gray-900">{current.label}</h2>
                <span className="text-sm font-bold bg-primary-50 text-primary-700 px-3 py-1 rounded-full">{current.grade}</span>
              </div>
              <p className="text-base text-gray-600 leading-relaxed mb-12">{current.intro}</p>

              <div className="space-y-8">
                {current.courses.map((c, i) => (
                  <div key={c.name} className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-8 border-b border-gray-100 last:border-0">
                    <div className="lg:col-span-3">
                      <div className="text-xs font-black text-primary-300 mb-1">{String(i + 1).padStart(2, '0')}</div>
                      <h3 className="text-base font-extrabold text-gray-900">{c.name}</h3>
                    </div>
                    <div className="lg:col-span-9">
                      <p className="text-base text-gray-600 leading-relaxed">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">교육에서 자격까지 연결되는 구조</h2>
          <p className="text-base text-gray-600 mb-10 leading-relaxed">
            교육은 단순 지식 전달이 아닙니다. 무료 진단으로 취약 영역을 파악하고, 맞춤 교육을 받은 뒤 급수 시험으로 자격을 취득하는 체계로 연결됩니다.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {['무료 진단', '→', '취약 영역 확인', '→', '맞춤 교육 수강', '→', '급수 시험 응시', '→', '자격 취득', '→', '전문가 과정 진입', '→', '기업 인증·컨설팅 참여'].map((item, i) => (
              item === '→'
                ? <span key={i} className="text-gray-400 font-bold text-xl">→</span>
                : <span key={i} className="bg-white border border-primary-200 text-primary-700 px-4 py-2 rounded-lg text-sm font-semibold">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-4">나에게 맞는 교육 과정 찾기</h2>
          <p className="text-base text-white/80 mb-8 leading-relaxed">무료 진단으로 취약 영역을 먼저 파악하고, 맞춤 교육 과정을 추천받으세요.</p>
          <Link to="/diagnosis" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all text-lg">
            무료 진단 시작 <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
