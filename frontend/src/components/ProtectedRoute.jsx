import { useAuth } from '../context/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-sm text-gray-400">로딩 중...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-center px-4">
        <div>
          <div className="text-3xl mb-3">🚫</div>
          <h2 className="text-base font-extrabold text-gray-900 mb-1">접근 권한 없음</h2>
          <p className="text-xs text-gray-500">관리자 계정으로 로그인해야 접근할 수 있습니다.</p>
        </div>
      </div>
    )
  }

  return children
}
