import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const TABS = ['대시보드', '시험 접수', '회원 관리', '진단 결과']

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

const applicationStatusLabel = {
  draft: '임시저장',
  submitted: '접수요청',
  confirmed: '접수확정',
  cancelled: '취소',
}

const paymentStatusLabel = {
  pending: '결제대기',
  paid: '결제완료',
  failed: '결제실패',
  cancelled: '결제취소',
  refunded: '환불완료',
}

const applicationStatusColor = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const paymentStatusColor = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  refunded: 'bg-purple-100 text-purple-700',
}

function fmt(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function won(value) {
  return `₩${Number(value || 0).toLocaleString('ko-KR')}`
}

function Badge({ value, labels, colors }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colors[value] || 'bg-gray-100 text-gray-600'}`}>{labels[value] || value || '-'}</span>
}

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b border-gray-100 text-xs last:border-b-0">
      <div className="bg-gray-50 px-3 py-2 font-bold text-gray-500">{label}</div>
      <div className="min-w-0 px-3 py-2 text-gray-800 break-words">{value || '-'}</div>
    </div>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState(0)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [diagnoses, setDiagnoses] = useState([])
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [memoDraft, setMemoDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [diagSearch, setDiagSearch] = useState('')
  const [diagType, setDiagType] = useState('all')
  const [applicationSearch, setApplicationSearch] = useState('')
  const [applicationStatus, setApplicationStatus] = useState('all')
  const [applicationExamType, setApplicationExamType] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadStats = useCallback(async () => {
    try { setStats(await api.adminStats()) } catch (error) { console.warn(error.message) }
  }, [])

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try { setUsers(await api.adminUsers()) } catch (error) { console.warn(error.message) } finally { setLoading(false) }
  }, [])

  const loadDiagnosis = useCallback(async () => {
    setLoading(true)
    try { setDiagnoses(await api.adminDiagnosis()) } catch (error) { console.warn(error.message) } finally { setLoading(false) }
  }, [])

  const loadApplications = useCallback(async () => {
    setLoading(true)
    try {
      setApplications(await api.adminApplications({
        status: applicationStatus,
        exam_type: applicationExamType,
        q: applicationSearch,
      }))
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }, [applicationExamType, applicationSearch, applicationStatus])

  useEffect(() => {
    const timer = window.setTimeout(() => { loadStats() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadStats])
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (tab === 1) loadApplications()
      if (tab === 2) loadUsers()
      if (tab === 3) loadDiagnosis()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [tab, loadApplications, loadUsers, loadDiagnosis])

  const handleDeleteUser = async (id) => {
    try {
      await api.adminDeleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      setConfirmDelete(null)
    } catch (e) { alert(e.message) }
  }

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (!confirm(`이 회원을 ${newRole === 'admin' ? '관리자' : '일반 회원'}으로 변경할까요?`)) return
    try {
      const updated = await api.adminChangeRole(id, newRole)
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: updated.role } : u))
    } catch (e) { alert(e.message) }
  }

  const openApplication = (application) => {
    setSelectedApplication(application)
    setMemoDraft(application.admin_memo || '')
  }

  const updateApplication = async (id, patch) => {
    try {
      const updated = await api.adminUpdateApplication(id, patch)
      setApplications((prev) => prev.map((item) => item.id === id ? { ...item, ...updated } : item))
      setSelectedApplication((current) => current?.id === id ? { ...current, ...updated } : current)
      await loadStats()
    } catch (error) {
      alert(error.message)
    }
  }

  const filteredUsers = users.filter((u) => u.name?.includes(search) || u.email?.includes(search))

  const filteredDiag = diagnoses.filter((d) => {
    const matchType = diagType === 'all' || d.diagnosis_type === diagType
    const matchSearch = !diagSearch || d.users?.name?.includes(diagSearch) || d.users?.email?.includes(diagSearch)
    return matchType && matchSearch
  })

  const applicationSummary = useMemo(() => {
    const confirmed = applications.filter((item) => item.application_status === 'confirmed').length
    const paid = applications.filter((item) => item.payment_status === 'paid').length
    const revenue = applications.filter((item) => item.payment_status === 'paid').reduce((sum, item) => sum + Number(item.total_amount || 0), 0)
    return { confirmed, paid, revenue }
  }, [applications])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between bg-gray-900 px-6 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-500 text-[10px] font-black">HT</div>
          <span className="text-sm font-bold">휴텍씨 AI 시험 관리자</span>
        </div>
        <span className="text-[10px] text-gray-400">{user?.name} ({user?.email})</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex w-fit gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`rounded-md px-4 py-2 text-xs font-bold transition-all ${tab === i ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href={`${import.meta.env.BASE_URL}mockup-admin-hd.html`} target="_blank" rel="noreferrer" className="rounded-lg border border-gray-800 bg-white px-4 py-2 text-xs font-bold text-gray-800 hover:bg-gray-50">🗄 목업 HTML ↗</a>
            <Link to="/admin/db" className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white hover:bg-black">🗄 DB 관리 · 30개 테이블 →</Link>
          </div>
        </div>

        {tab === 0 && (
          <div>
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
              {[
                { label: '전체 회원', value: stats?.userCount ?? '-', color: 'text-blue-600' },
                { label: '전체 접수', value: stats?.applicationCount ?? '-', color: 'text-primary-600' },
                { label: '오늘 접수', value: stats?.todayApplicationCount ?? '-', color: 'text-green-600' },
                { label: '전체 진단', value: stats?.diagCount ?? '-', color: 'text-purple-600' },
                { label: '오늘 진단', value: stats?.todayCount ?? '-', color: 'text-amber-600' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className={`mb-1 text-3xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-4 text-sm font-extrabold text-gray-900">빠른 이동</h3>
                <div className="space-y-2">
                  {[
                    { label: '시험 접수 현황', desc: '접수자 정보, 시험, 일정, 결제 상태 확인', tab: 1 },
                    { label: '회원 관리', desc: '가입 회원 목록 확인 및 역할 변경', tab: 2 },
                    { label: '진단 결과 전체', desc: '모든 진단 기록 조회 및 필터링', tab: 3 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setTab(item.tab)}
                      className="w-full rounded-lg border border-gray-100 p-3 text-left transition-all hover:border-primary-200 hover:bg-primary-50"
                    >
                      <div className="mb-0.5 text-xs font-bold text-gray-900">{item.label}</div>
                      <div className="text-[10px] text-gray-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-4 text-sm font-extrabold text-gray-900">진단 유형별 현황</h3>
                {stats?.typeCounts && Object.entries(stats.typeCounts).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(stats.typeCounts).map(([type, cnt]) => {
                      const total = stats.diagCount || 1
                      const pct = Math.round(cnt / total * 100)
                      return (
                        <div key={type}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColor[type] || 'bg-gray-100 text-gray-600'}`}>{typeLabel[type] || type}</span>
                            <span className="text-xs font-bold text-gray-700">{cnt}건 ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-gray-100"><div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${pct}%` }} /></div>
                        </div>
                      )
                    })}
                  </div>
                ) : <p className="text-xs text-gray-400">진단 데이터 없음</p>}
              </div>
            </div>
          </div>
        )}

        {tab === 1 && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-sm font-extrabold text-gray-900">시험 접수 <span className="font-normal text-gray-400">({applications.length}건)</span></h2>
              <select value={applicationStatus} onChange={(e) => setApplicationStatus(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none">
                <option value="all">전체 상태</option>
                <option value="submitted">접수요청</option>
                <option value="confirmed">접수확정</option>
                <option value="cancelled">취소</option>
              </select>
              <select value={applicationExamType} onChange={(e) => setApplicationExamType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none">
                <option value="all">전체 시험</option>
                <option value="translation">AI 번역</option>
                <option value="prompt">AI 프롬프트</option>
                <option value="ethics">AI 윤리</option>
              </select>
              <input value={applicationSearch} onChange={(e) => setApplicationSearch(e.target.value)} placeholder="접수번호, 이름, 이메일, 휴대폰 검색" className="w-64 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none" />
              <button onClick={loadApplications} className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white">조회</button>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3"><div className="text-lg font-black text-primary-600">{applications.length}</div><div className="text-[10px] text-gray-500">조회 접수</div></div>
              <div className="rounded-xl border border-gray-200 bg-white p-3"><div className="text-lg font-black text-green-600">{applicationSummary.paid}</div><div className="text-[10px] text-gray-500">결제 완료</div></div>
              <div className="rounded-xl border border-gray-200 bg-white p-3"><div className="text-lg font-black text-slate-900">{won(applicationSummary.revenue)}</div><div className="text-[10px] text-gray-500">확인 매출</div></div>
            </div>

            {loading ? <div className="py-10 text-center text-xs text-gray-400">불러오는 중...</div> : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>{['접수번호', '신청자', '시험/과목', '일정', '금액', '상태', '관리'].map((h) => <th key={h} className="px-4 py-2.5 text-left font-bold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? <tr><td colSpan={7} className="py-8 text-center text-gray-400">접수 없음</td></tr> : applications.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5"><div className="font-black text-gray-900">{item.application_no}</div><div className="text-[10px] text-gray-400">{fmt(item.created_at)}</div></td>
                        <td className="px-4 py-2.5"><div className="font-semibold text-gray-900">{item.applicant_name}</div><div className="text-[10px] text-gray-400">{item.applicant_phone}</div><div className="text-[10px] text-gray-400">{item.applicant_email}</div></td>
                        <td className="px-4 py-2.5"><div className="font-semibold text-gray-900">{item.exam_name}</div><div className="text-[10px] text-gray-500">{item.subject_name} · {item.grade_name}</div></td>
                        <td className="px-4 py-2.5"><div className="font-semibold text-gray-900">{item.schedule_snapshot?.date || '-'}</div><div className="text-[10px] text-gray-500">{item.schedule_snapshot?.region || '-'} · {item.schedule_snapshot?.start || '-'}~{item.schedule_snapshot?.end || '-'}</div></td>
                        <td className="px-4 py-2.5 font-bold text-gray-900">{won(item.total_amount)}</td>
                        <td className="space-y-1 px-4 py-2.5"><Badge value={item.application_status} labels={applicationStatusLabel} colors={applicationStatusColor} /><br /><Badge value={item.payment_status} labels={paymentStatusLabel} colors={paymentStatusColor} /></td>
                        <td className="px-4 py-2.5"><button onClick={() => openApplication(item)} className="rounded border border-primary-200 px-2 py-1 text-[10px] font-bold text-primary-700 hover:bg-primary-50">상세 보기</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 2 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gray-900">회원 관리 <span className="font-normal text-gray-400">({filteredUsers.length}명)</span></h2>
              <input type="text" placeholder="이름 또는 이메일 검색" value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none" />
            </div>
            {loading ? <div className="py-10 text-center text-xs text-gray-400">불러오는 중...</div> : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50"><tr>{['이름', '이메일', '역할', '가입일', '관리'].map((h) => <th key={h} className="px-4 py-2.5 text-left font-bold text-gray-600">{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredUsers.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-400">회원 없음</td></tr> : filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-semibold text-gray-900">{u.name}</td>
                        <td className="px-4 py-2.5 text-gray-600">{u.email}</td>
                        <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{u.role === 'admin' ? '관리자' : '일반'}</span></td>
                        <td className="px-4 py-2.5 text-gray-400">{fmt(u.created_at)}</td>
                        <td className="px-4 py-2.5"><div className="flex gap-2"><button onClick={() => handleRoleChange(u.id, u.role)} className="text-[10px] text-blue-600 hover:underline">{u.role === 'admin' ? '일반으로' : '관리자로'}</button><button onClick={() => setConfirmDelete(u)} className="text-[10px] text-red-500 hover:underline">삭제</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 3 && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-sm font-extrabold text-gray-900">진단 결과 <span className="font-normal text-gray-400">({filteredDiag.length}건)</span></h2>
              <select value={diagType} onChange={(e) => setDiagType(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none">
                <option value="all">전체 유형</option><option value="free">무료</option><option value="paid1">유료 1단계</option><option value="paid2">유료 2단계</option><option value="paid3">유료 3단계</option>
              </select>
              <input type="text" placeholder="이름 또는 이메일 검색" value={diagSearch} onChange={(e) => setDiagSearch(e.target.value)} className="w-48 rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-primary-400 focus:outline-none" />
            </div>
            {loading ? <div className="py-10 text-center text-xs text-gray-400">불러오는 중...</div> : (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-200 bg-gray-50"><tr>{['유형', '회원', '점수', '등급', '일시'].map((h) => <th key={h} className="px-4 py-2.5 text-left font-bold text-gray-600">{h}</th>)}</tr></thead>
                  <tbody>
                    {filteredDiag.length === 0 ? <tr><td colSpan={5} className="py-8 text-center text-gray-400">진단 결과 없음</td></tr> : filteredDiag.map((d) => (
                      <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColor[d.diagnosis_type] || 'bg-gray-100 text-gray-600'}`}>{typeLabel[d.diagnosis_type] || d.diagnosis_type}</span></td>
                        <td className="px-4 py-2.5">{d.users ? <div><div className="font-semibold text-gray-900">{d.users.name}</div><div className="text-[10px] text-gray-400">{d.users.email}</div></div> : <span className="text-[10px] text-gray-400">비로그인</span>}</td>
                        <td className="px-4 py-2.5"><div className="font-bold text-gray-900">{d.percentage}%</div><div className="text-[10px] text-gray-400">{d.score}/{d.total}</div></td>
                        <td className="px-4 py-2.5"><span className="text-xs font-bold text-gray-900">{d.grade || '-'}</span></td>
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

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
              <div>
                <h3 className="text-sm font-black text-gray-900">접수 상세 · {selectedApplication.application_no}</h3>
                <p className="text-[10px] text-gray-400">{fmt(selectedApplication.created_at)} 접수</p>
              </div>
              <button onClick={() => setSelectedApplication(null)} className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100">닫기</button>
            </div>
            <div className="max-h-[calc(92vh-60px)] overflow-y-auto p-5">
              <div className="mb-4 grid gap-4 lg:grid-cols-3">
                <div className="overflow-hidden rounded-xl border border-gray-200"><DetailRow label="이름" value={selectedApplication.applicant_name} /><DetailRow label="생년월일" value={selectedApplication.applicant_birthdate} /><DetailRow label="휴대폰" value={selectedApplication.applicant_phone} /><DetailRow label="이메일" value={selectedApplication.applicant_email} /><DetailRow label="주소" value={selectedApplication.applicant_address} /><DetailRow label="상세주소" value={selectedApplication.applicant_address_detail} /><DetailRow label="국적" value={selectedApplication.applicant_nationality} /><DetailRow label="긴급 연락처" value={selectedApplication.emergency_contact} /><DetailRow label="사진 파일" value={selectedApplication.photo_file_name} /></div>
                <div className="overflow-hidden rounded-xl border border-gray-200"><DetailRow label="시험" value={selectedApplication.exam_name} /><DetailRow label="과목" value={selectedApplication.subject_name} /><DetailRow label="등급" value={selectedApplication.grade_name} /><DetailRow label="차수" value={selectedApplication.round_name} /><DetailRow label="접수구분" value={selectedApplication.reception_type} /><DetailRow label="일정" value={selectedApplication.schedule_snapshot?.date} /><DetailRow label="지역" value={selectedApplication.schedule_snapshot?.region} /><DetailRow label="시간" value={`${selectedApplication.schedule_snapshot?.start || '-'}~${selectedApplication.schedule_snapshot?.end || '-'}`} /><DetailRow label="개별 피드백" value={selectedApplication.feedback_option ? '신청' : '미신청'} /></div>
                <div className="overflow-hidden rounded-xl border border-gray-200"><DetailRow label="접수 구분" value={selectedApplication.application_type === 'group' ? 'B2B 단체' : '개인'} /><DetailRow label="결제수단" value={selectedApplication.payment_method} /><DetailRow label="응시료" value={won(selectedApplication.base_amount)} /><DetailRow label="추가상품" value={won(selectedApplication.add_on_amount)} /><DetailRow label="할인" value={won(selectedApplication.discount_amount)} /><DetailRow label="포인트" value={won(selectedApplication.point_used)} /><DetailRow label="자격증" value={selectedApplication.cert_requested ? `신청 · ${selectedApplication.cert_type || ''}` : '미신청'} /><DetailRow label="총액" value={won(selectedApplication.total_amount)} /><DetailRow label="알림 동의" value={selectedApplication.notify_agreed ? '동의' : '미동의'} /></div>
              </div>

              <div className="mb-4 grid gap-4 lg:grid-cols-3">
                <label className="block text-xs font-bold text-gray-700">접수 상태<select value={selectedApplication.application_status} onChange={(e) => updateApplication(selectedApplication.id, { application_status: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"><option value="submitted">접수요청</option><option value="confirmed">접수확정</option><option value="cancelled">취소</option></select></label>
                <label className="block text-xs font-bold text-gray-700">결제 상태<select value={selectedApplication.payment_status} onChange={(e) => updateApplication(selectedApplication.id, { payment_status: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"><option value="pending">결제대기</option><option value="paid">결제완료</option><option value="failed">결제실패</option><option value="cancelled">결제취소</option><option value="refunded">환불완료</option></select></label>
                <label className="block text-xs font-bold text-gray-700">수험표 상태<select value={selectedApplication.ticket_status} onChange={(e) => updateApplication(selectedApplication.id, { ticket_status: e.target.value })} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs"><option value="before">발급 전</option><option value="ready">조회 가능</option><option value="issued">발급 완료</option><option value="cancelled">취소</option></select></label>
              </div>

              <div className="mb-4 rounded-xl border border-gray-200 p-3">
                <div className="mb-2 text-xs font-black text-gray-900">추가 상품</div>
                {selectedApplication.add_ons?.length ? <div className="flex flex-wrap gap-2">{selectedApplication.add_ons.map((item) => <span key={item.id} className="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-bold text-primary-700">{item.label} · {won(item.price)}</span>)}</div> : <p className="text-xs text-gray-400">추가 상품 없음</p>}
              </div>

              {selectedApplication.application_type === 'group' && (
                <div className="mb-4 rounded-xl border border-accent-200 bg-accent-50 p-3">
                  <div className="mb-2 text-xs font-black text-gray-900">B2B 단체 정보</div>
                  <pre className="whitespace-pre-wrap break-all text-[11px] text-gray-700">{JSON.stringify(selectedApplication.group_info, null, 2)}</pre>
                </div>
              )}

              <div className="mb-4 rounded-xl border border-gray-200 p-3">
                <div className="mb-2 text-xs font-black text-gray-900">관리자 메모</div>
                <textarea value={memoDraft} onChange={(e) => setMemoDraft(e.target.value)} className="h-20 w-full rounded-lg border border-gray-300 p-2 text-xs focus:border-primary-400 focus:outline-none" placeholder="접수 확인, 결제 확인, 전화 상담 내용 등을 기록" />
                <button onClick={() => updateApplication(selectedApplication.id, { admin_memo: memoDraft })} className="mt-2 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-bold text-white">메모 저장</button>
              </div>

              <details className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <summary className="cursor-pointer text-xs font-black text-gray-900">원본 저장 데이터 JSON</summary>
                <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-white p-3 text-[10px] text-gray-700">{JSON.stringify(selectedApplication.raw_payload, null, 2)}</pre>
              </details>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-sm font-extrabold text-gray-900">회원 삭제 확인</h3>
            <p className="mb-1 text-xs text-gray-600"><strong>{confirmDelete.name}</strong> ({confirmDelete.email}) 을 삭제하시겠습니까?</p>
            <p className="mb-5 text-[10px] text-red-500">삭제된 회원의 진단/접수 기록은 익명으로 유지됩니다.</p>
            <div className="flex justify-end gap-2"><button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-gray-300 px-4 py-2 text-xs hover:bg-gray-50">취소</button><button onClick={() => handleDeleteUser(confirmDelete.id)} className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white hover:bg-red-700">삭제</button></div>
          </div>
        </div>
      )}
    </div>
  )
}