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
    const [{ count: userCount }, { count: diagCount }] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('diagnosis_results').select('*', { count: 'exact', head: true }),
    ])

    const today = new Date().toISOString().split('T')[0]
    const { count: todayCount } = await supabase
      .from('diagnosis_results')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`)

    const { data: typeRows } = await supabase
      .from('diagnosis_results').select('diagnosis_type')

    const typeCounts = {}
    typeRows?.forEach(r => { typeCounts[r.diagnosis_type] = (typeCounts[r.diagnosis_type] || 0) + 1 })

    res.json({ userCount: userCount || 0, diagCount: diagCount || 0, todayCount: todayCount || 0, typeCounts })
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

module.exports = router
