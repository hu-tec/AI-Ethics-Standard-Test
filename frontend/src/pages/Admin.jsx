import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const TABS = ['대시보드', '회원 관리', '진단 결과']

const typeLabel = {
  free: '무료',
  paid1: '유료 1단계',
  paid2: '유료 2단계',
  paid3: '유료 3단계',
}

const typeColor = {
  free: 'bg-green-100 text-green-700',
  paid1: 'bg-blue-100 text-blue-700',
  paid2: 'bg-purple-100 text-purple-700',
  paid3: 'bg-amber-100 text-amber-700',
}

function fmt(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [diagSearch, setDiagSearch] = useState('')
  const [diagType, setDiagType] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadStats = useCallback(async () => {
    try { setStats(await api.adminStats()) } catch {}
  }, [])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try { setUsers(await api.adminUsers()) } catch {} finally { setLoading(false) }
  }, [])

  const loadDiagnosis = useCallback(async () => {
    setLoading(true)
    try { setDiagnoses(await api.adminDiagnosis()) } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { loadStats() }, [loadStats])
  useEffect(() => {
    if (tab === 1) loadUsers()
    if (tab === 2) loadDiagnosis()
  }, [tab, loadUsers, loadDiagnosis])

  const handleDeleteUser = async (id) => {
    try {
      await api.adminDeleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      setConfirmDelete(null)
    } catch (e) { alert(e.message) }
  }

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!confirm(`이 회원을 ${newRole === 'admin' ? '관리자' : '일반 회원'}으로 변경할까요?`)) return
    try {
      const updated = await api.adminChangeRole(id, newRole)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: updated.role } : u))
    } catch (e) { alert(e.message) }
  }

  const filteredUsers = users.filter(u =>
    u.name?.includes(search) || u.email?.includes(search)
  )

  const filteredDiag = diagnoses.filter(d => {
    const matchType = diagType === 'all' || d.diagnosis_type === diagType
    const matchSearch = !diagSearch ||
      d.users?.name?.includes(diagSearch) ||
      d.users?.email?.includes(diagSearch)
    return matchType && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 어드민 헤더 */}
      <div className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center text-[10px] font-black">A</div>
          <span className="text-sm font-bold">AI 윤리 관리자</span>
        </div>
        <span className="text-[10px] text-gray-400">{user?.name} ({user?.email})</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* 탭 */}
        <div className="flex gap-1 mb-6 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${tab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── 대시보드 ── */}
        {tab === 0 && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: '전체 회원', value: stats?.userCount ?? '-', color: 'text-blue-600' },
                { label: '전체 진단', value: stats?.diagCount ?? '-', color: 'text-primary-600' },
                { label: '오늘 진단', value: stats?.todayCount ?? '-', color: 'text-green-600' },
                { label: '진단 유형', value: Object.keys(stats?.typeCounts || {}).length || '-', color: 'text-purple-600' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-extrabold text-gray-900 mb-4">진단 유형별 현황</h3>
                {stats?.typeCounts && Object.entries(stats.typeCounts).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(stats.typeCounts).map(([type, cnt]) => {
                      const total = stats.diagCount || 1
                      const pct = Math.round(cnt / total * 100)
                      return (
                        <div key={type}>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor[type] || 'bg-gray-100 text-gray-600'}`}>
                              {typeLabel[type] || type}
                            </span>
                            <span className="text-xs font-bold text-gray-700">{cnt}건 ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">진단 데이터 없음</p>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h3 className="text-sm font-extrabold text-gray-900 mb-4">빠른 이동</h3>
                <div className="space-y-2">
                  {[
                    { label: '회원 관리', desc: '가입 회원 목록 확인 및 역할 변경', tab: 1 },
                    { label: '진단 결과 전체', desc: '모든 진단 기록 조회 및 필터링', tab: 2 },
                  ].map(item => (
                    <button
                      key={item.label}
                      onClick={() => setTab(item.tab)}
                      className="w-full text-left border border-gray-100 hover:border-primary-200 hover:bg-primary-50 rounded-lg p-3 transition-all"
                    >
                      <div className="text-xs font-bold text-gray-900 mb-0.5">{item.label}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 회원 관리 ── */}
        {tab === 1 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-gray-900">회원 관리 <span className="text-gray-400 font-normal">({filteredUsers.length}명)</span></h2>
              <input
                type="text" placeholder="이름 또는 이메일 검색"
                value={search} onChange={e => setSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400 w-48"
              />
            </div>

            {loading ? (
              <div className="text-center py-10 text-xs text-gray-400">불러오는 중...</div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['이름', '이메일', '역할', '가입일', '관리'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-bold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">회원 없음</td></tr>
                    ) : filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-semibold text-gray-900">{u.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{u.email}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {u.role === 'admin' ? '관리자' : '일반'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-400">{fmt(u.created_at)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleRoleChange(u.id, u.role)}
                              className="text-[10px] text-blue-600 hover:underline"
                            >
                              {u.role === 'admin' ? '일반으로' : '관리자로'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(u)}
                              className="text-[10px] text-red-500 hover:underline"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 삭제 확인 모달 */}
            {confirmDelete && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
                  <h3 className="text-sm font-extrabold text-gray-900 mb-2">회원 삭제 확인</h3>
                  <p className="text-xs text-gray-600 mb-1">
                    <strong>{confirmDelete.name}</strong> ({confirmDelete.email}) 을 삭제하시겠습니까?
                  </p>
                  <p className="text-[10px] text-red-500 mb-5">삭제된 회원의 진단 기록은 익명으로 유지됩니다.</p>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
                    <button onClick={() => handleDeleteUser(confirmDelete.id)} className="px-4 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">삭제</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 진단 결과 ── */}
        {tab === 2 && (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-sm font-extrabold text-gray-900">진단 결과 <span className="text-gray-400 font-normal">({filteredDiag.length}건)</span></h2>
              <select
                value={diagType} onChange={e => setDiagType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400"
              >
                <option value="all">전체 유형</option>
                <option value="free">무료</option>
                <option value="paid1">유료 1단계</option>
                <option value="paid2">유료 2단계</option>
                <option value="paid3">유료 3단계</option>
              </select>
              <input
                type="text" placeholder="이름 또는 이메일 검색"
                value={diagSearch} onChange={e => setDiagSearch(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-primary-400 w-48"
              />
            </div>

            {loading ? (
              <div className="text-center py-10 text-xs text-gray-400">불러오는 중...</div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['유형', '회원', '점수', '등급', '일시'].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 font-bold text-gray-600">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDiag.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-400">진단 결과 없음</td></tr>
                    ) : filteredDiag.map(d => (
                      <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${typeColor[d.diagnosis_type] || 'bg-gray-100 text-gray-600'}`}>
                            {typeLabel[d.diagnosis_type] || d.diagnosis_type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          {d.users ? (
                            <div>
                              <div className="font-semibold text-gray-900">{d.users.name}</div>
                              <div className="text-[10px] text-gray-400">{d.users.email}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[10px]">비로그인</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="font-bold text-gray-900">{d.percentage}%</div>
                          <div className="text-[10px] text-gray-400">{d.score}/{d.total}</div>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`font-bold text-xs ${
                            d.percentage >= 80 ? 'text-green-600' :
                            d.percentage >= 60 ? 'text-blue-600' :
                            d.percentage >= 45 ? 'text-yellow-600' : 'text-red-600'
                          }`}>{d.grade || '-'}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-400">{fmt(d.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
