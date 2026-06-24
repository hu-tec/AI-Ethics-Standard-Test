import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* 브랜드 */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm">AI 윤리</div>
                <div className="text-xs text-gray-400">자격·진단·교육·인증</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              AI 시대의 경쟁력은 기술이 아니라 신뢰에서 완성됩니다.
              AI 윤리는 에티켓이 아니라 컴플라이언스입니다.
            </p>
            <p className="text-xs text-gray-500">
              사단법인 국제통역번역협회와 함께 자격 교육 및 발급 체계를 운영합니다.
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h4 className="font-semibold text-white mb-4">서비스</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'AI 윤리 진단', path: '/diagnosis' },
                { label: 'AI 윤리 교육', path: '/education' },
                { label: '자격 체계', path: '/certificate' },
                { label: 'AI 윤리 인증', path: '/process' },
                { label: '기업 컨설팅', path: '/process' },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h4 className="font-semibold text-white mb-4">안내</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'AI 윤리 소개', path: '/about' },
                { label: 'AI 윤리 현황', path: '/status' },
                { label: '비용 안내', path: '/pricing' },
                { label: '전문가 모집', path: '/expert' },
                { label: '커뮤니티', path: '/community' },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:text-primary-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="font-semibold text-white mb-4">연락처</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={15} className="mt-0.5 text-primary-400 shrink-0" />
                <span>info@aiethics.kr</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={15} className="mt-0.5 text-primary-400 shrink-0" />
                <span>02-0000-0000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 text-primary-400 shrink-0" />
                <span>서울특별시</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 space-y-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            ※ 본 자격은 민간자격입니다. 국가공인 자격이 아닙니다.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            ※ 특허는 평가 방법의 전문성과 관련된 것이며, 자격의 국가공인 여부를 의미하지 않습니다.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            ※ 진단 결과는 교육·컨설팅 목적의 참고자료이며 법률 자문을 대체하지 않습니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
            <p className="text-xs text-gray-600">© 2025 AI 윤리 자격·진단·교육·인증. All rights reserved.</p>
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
