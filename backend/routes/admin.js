const router = require('express').Router()
const authMiddleware = require('../middleware/auth')
const adminMiddleware = require('../middleware/admin')
const supabase = require('../db/supabase')

// 모든 어드민 라우트: JWT 인증 + admin 역할 필요
router.use(authMiddleware)
router.use(adminMiddleware)

// GET /api/admin/stats — 대시보드 통계
router.get('/stats', async (req, res) => {
  try {
    const [{ count: userCount }, { count: diagCount }, { count: applicationCount }] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('diagnosis_results').select('*', { count: 'exact', head: true }),
      supabase.from('exam_applications').select('*', { count: 'exact', head: true }),
    ])

    const today = new Date().toISOString().split('T')[0]
    const [{ count: todayCount }, { count: todayApplicationCount }] = await Promise.all([
      supabase
        .from('diagnosis_results')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`),
      supabase
        .from('exam_applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00`),
    ])

    const { data: typeRows } = await supabase
      .from('diagnosis_results').select('diagnosis_type')

    const typeCounts = {}
    typeRows?.forEach(r => { typeCounts[r.diagnosis_type] = (typeCounts[r.diagnosis_type] || 0) + 1 })

    res.json({
      userCount: userCount || 0,
      diagCount: diagCount || 0,
      todayCount: todayCount || 0,
      applicationCount: applicationCount || 0,
      todayApplicationCount: todayApplicationCount || 0,
      typeCounts,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/users — 전체 회원 목록
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/admin/users/:id — 회원 삭제
router.delete('/users/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', req.params.id)
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/users/:id/role — 역할 변경 (user ↔ admin)
router.patch('/users/:id/role', async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: '역할은 user 또는 admin이어야 합니다.' })
  try {
    const { data, error } = await supabase
      .from('users').update({ role }).eq('id', req.params.id)
      .select('id, email, name, role').single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/diagnosis — 전체 진단 결과
router.get('/diagnosis', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diagnosis_results')
      .select('id, diagnosis_type, score, total, percentage, grade, created_at, user_id, users(name, email)')
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/applications — 전체 시험 접수 목록
router.get('/applications', async (req, res) => {
  try {
    const { status = 'all', exam_type, q } = req.query
    let query = supabase
      .from('exam_applications')
      .select('*, users(name, email)')  // 신규 컬럼(국적/긴급연락처/자격증종류 등) 포함 전체
      .order('created_at', { ascending: false })
      .limit(500)

    if (status && status !== 'all') query = query.eq('application_status', status)
    if (exam_type && exam_type !== 'all') query = query.eq('exam_type', exam_type)

    const { data, error } = await query
    if (error) throw error

    const keyword = String(q || '').trim().toLowerCase()
    const filtered = keyword
      ? data.filter((row) => [
          row.application_no,
          row.applicant_name,
          row.applicant_email,
          row.applicant_phone,
          row.exam_name,
          row.subject_name,
          row.grade_name,
        ].some((value) => String(value || '').toLowerCase().includes(keyword)))
      : data

    res.json(filtered)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/admin/applications/:id — 접수 상태/결제 상태/관리자 메모 수정
router.patch('/applications/:id', async (req, res) => {
  const allowedApplicationStatuses = ['draft', 'submitted', 'confirmed', 'cancelled']
  const allowedPaymentStatuses = ['pending', 'paid', 'failed', 'cancelled', 'refunded']
  const allowedTicketStatuses = ['before', 'ready', 'issued', 'cancelled']
  const patch = {}

  if (req.body.application_status) {
    if (!allowedApplicationStatuses.includes(req.body.application_status)) {
      return res.status(400).json({ error: 'application_status 값이 올바르지 않습니다.' })
    }
    patch.application_status = req.body.application_status
  }
  if (req.body.payment_status) {
    if (!allowedPaymentStatuses.includes(req.body.payment_status)) {
      return res.status(400).json({ error: 'payment_status 값이 올바르지 않습니다.' })
    }
    patch.payment_status = req.body.payment_status
  }
  if (req.body.ticket_status) {
    if (!allowedTicketStatuses.includes(req.body.ticket_status)) {
      return res.status(400).json({ error: 'ticket_status 값이 올바르지 않습니다.' })
    }
    patch.ticket_status = req.body.ticket_status
  }
  if (Object.prototype.hasOwnProperty.call(req.body, 'admin_memo')) {
    patch.admin_memo = req.body.admin_memo || null
  }

  patch.updated_at = new Date().toISOString()

  try {
    const { data, error } = await supabase
      .from('exam_applications')
      .update(patch)
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
