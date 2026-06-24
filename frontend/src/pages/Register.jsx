import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      return setError('비밀번호가 일치하지 않습니다.')
    }
    setLoading(true)
    try {
      await register(form.email, form.password, form.name)
      navigate('/')
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
          <h1 className="text-xl font-extrabold text-gray-900 mb-1">회원가입</h1>
          <p className="text-xs text-gray-500">가입하면 진단 기록이 자동 저장됩니다</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">이름</label>
            <input
              type="text" name="name" required value={form.name} onChange={handleChange}
              placeholder="홍길동"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
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
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">비밀번호 확인</label>
            <input
              type="password" name="confirm" required value={form.confirm} onChange={handleChange}
              placeholder="비밀번호 재입력"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            가입 시 개인정보 처리방침 및 이용약관에 동의하는 것으로 간주됩니다.
          </p>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-primary-600 font-bold hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  )
}
