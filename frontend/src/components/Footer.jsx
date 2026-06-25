import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'

const serviceLinks = [
  { label: '시험 안내', path: '/exams#guide' },
  { label: '시험 일정', path: '/exams#schedule' },
  { label: '시험 접수', path: '/exams#apply' },
  { label: '결제·수험표', path: '/exams#payment' },
  { label: '성적·자격증', path: '/exams#results' },
]

const operationLinks = [
  { label: 'AI 번역 시험', path: '/exams#guide' },
  { label: 'AI 프롬프트 시험', path: '/exams#guide' },
  { label: 'AI 윤리 시험', path: '/exams#guide' },
  { label: 'B2B 단체접수', path: '/exams#apply' },
  { label: '관리자', path: '/admin' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                <span className="text-sm font-bold text-white">HT</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">휴텍씨 AI 시험</div>
                <div className="text-xs text-gray-400">시험 접수·결제·응시·자격증</div>
              </div>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              AI 번역 시험을 중심으로 프롬프트, 윤리 시험까지 확장하는 통합 시험 접수 플랫폼입니다.
            </p>
            <p className="text-xs text-gray-500">
              시험 일정 조회부터 접수, 결제, 수험표 확인, 결과 및 자격증 발급까지 한 흐름으로 운영합니다.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">접수 메뉴</h4>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map((item) => (
                <li key={`${item.label}-${item.path}`}>
                  <Link to={item.path} className="transition-colors hover:text-primary-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">운영 모듈</h4>
            <ul className="space-y-2 text-sm">
              {operationLinks.map((item) => (
                <li key={`${item.label}-${item.path}`}>
                  <Link to={item.path} className="transition-colors hover:text-primary-400">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">연락처</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-primary-400" />
                <span>exam@hutec.kr</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-primary-400" />
                <span>02-0000-0000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary-400" />
                <span>서울특별시</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 space-y-2 border-t border-gray-800 pt-6">
          <p className="text-xs leading-relaxed text-gray-500">
            ※ 본 화면은 시험 접수 플랫폼 프론트엔드 시안이며, 민간자격 운영 고지와 환불 규정은 실제 운영 정책에 맞춰 확정해야 합니다.
          </p>
          <p className="text-xs leading-relaxed text-gray-500">
            ※ 시험별 접수 가능 여부와 결과 발표일은 운영 관리자가 등록한 일정 기준으로 표시됩니다.
          </p>
          <div className="flex flex-col items-start justify-between gap-2 pt-2 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-600">© 2026 휴텍씨 AI 시험 접수 플랫폼. All rights reserved.</p>
            <div className="flex gap-4 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-400">개인정보처리방침</a>
              <a href="#" className="hover:text-gray-400">이용약관</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
