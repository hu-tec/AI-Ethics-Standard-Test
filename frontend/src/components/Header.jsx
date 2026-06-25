import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: '시험접수', path: '/exams' },
  { label: '시험안내', path: '/exams#guide' },
  { label: '시험일정', path: '/exams#schedule' },
  { label: '접수정보', path: '/exams#apply' },
  { label: '결제·수험표', path: '/exams#payment' },
  { label: '결과·자격증', path: '/exams#results' },
  { label: 'B2B 단체접수', path: '/exams#apply' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/exams')
  }

  const isActive = (path) => {
    const [pathname, hash] = path.split('#')
    return location.pathname === pathname && (!hash || location.hash === `#${hash}` || location.hash === '')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/exams" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
              <span className="text-sm font-bold text-white">HT</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-bold text-gray-900">휴텍씨 AI 시험</div>
              <div className="text-xs text-gray-500">번역·프롬프트·윤리 자격 접수</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.path}`}
                to={item.path}
                className={`rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <User size={13} /> {user.name}
                </span>
                <button onClick={handleLogout} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600">
                  <LogOut size={13} /> 로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary-600">로그인</Link>
                <Link to="/register" className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200">회원가입</Link>
              </>
            )}
            <Link to="/exams#apply" className="rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-700">
              접수하기
            </Link>
          </div>

          <button className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <nav className="space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={`${item.label}-${item.path}`}
                to={item.path}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(item.path) ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link to="/login" className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700" onClick={() => setMobileOpen(false)}>로그인</Link>
              <Link to="/exams#apply" className="rounded-lg bg-primary-600 px-4 py-2.5 text-center text-sm font-semibold text-white" onClick={() => setMobileOpen(false)}>접수하기</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
