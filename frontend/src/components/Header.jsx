import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'AI 윤리 소개', path: '/about' },
  {
    label: '분야별',
    path: '/fields',
    children: [
      { label: '콘텐츠별', path: '/fields#content' },
      { label: '산업별', path: '/fields#industry' },
      { label: '전문가별', path: '/fields#expert' },
      { label: '기능별', path: '/fields#function' },
      { label: '사업별', path: '/fields#business' },
      { label: '분야별', path: '/fields#domain' },
    ],
  },
  { label: '업무 프로세스', path: '/process' },
  { label: 'AI 윤리 현황', path: '/status' },
  { label: '진단 테스트', path: '/diagnosis' },
  { label: '비용', path: '/pricing' },
  { label: '전문가 모집', path: '/expert' },
  { label: '커뮤니티', path: '/community' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-gray-900 text-sm">AI 윤리</div>
              <div className="text-xs text-gray-500">자격·진단·교육·인증</div>
            </div>
          </Link>

          {/* 데스크탑 네비 */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.children && setDropdownOpen(item.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                  {item.children && <ChevronDown size={14} />}
                </Link>
                {item.children && dropdownOpen === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA / 로그인 영역 */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <User size={13} /> {user.name}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <LogOut size={13} /> 로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">로그인</Link>
                <Link to="/register" className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-lg transition-colors">회원가입</Link>
              </>
            )}
            <Link
              to="/diagnosis"
              className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              무료 진단하기
            </Link>
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                to="/diagnosis"
                className="block text-center bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                무료 진단하기
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
