import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 관리자 바로 입장: 관리자 계정 자동 입력 후 로그인 → 관리자 페이지
  const ADMIN_EMAIL = 'admin@naver.com'
  const ADMIN_PASSWORD = 'admin1234'
  const quickAdmin = async () => {
    setForm({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    setError('')
    setLoading(true)
    try {
      await login(ADMIN_EMAIL, ADMIN_PASSWORD)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-130px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">AI 윤리</span>
          </Link>
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">로그인</h1>
          <p className="text-xs text-gray-500">진단 결과가 자동 저장됩니다</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">이메일</label>
            <input
              type="email" name="email" required value={form.email} onChange={handleChange}
              placeholder="email@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">비밀번호</label>
            <input
              type="password" name="password" required value={form.password} onChange={handleChange}
              placeholder="6자 이상"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {/* 관리자 바로 입장 */}
          <div className="border-t border-dashed border-gray-200 pt-3">
            <button
              type="button" onClick={quickAdmin} disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
            >
              🔑 관리자로 바로 입장
            </button>
            <p className="mt-2 text-center text-[11px] text-gray-400">
              admin@naver.com / admin1234 자동 입력 후 관리자 페이지로 이동
            </p>
          </div>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-primary-600 font-bold hover:underline">회원가입</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          <Link to="/diagnosis" className="hover:text-gray-600">로그인 없이 무료 진단 →</Link>
        </p>
      </div>
    </div>
  )
}
