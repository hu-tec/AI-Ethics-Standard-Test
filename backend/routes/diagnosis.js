const router = require('express').Router()
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth')
const supabase = require('../db/supabase')

// 로그인 여부 선택적으로 확인 (비로그인도 저장 가능, user_id=null)
function optionalAuth(req) {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    }
  } catch {}
  return null
}

// POST /api/diagnosis/save
// 무료·유료 진단 결과 저장 (로그인 선택)
router.post('/save', async (req, res) => {
  const user = optionalAuth(req)
  const { diagnosis_type, score, total, percentage, grade, axis_scores, answers } = req.body

  if (!diagnosis_type) {
    return res.status(400).json({ error: 'diagnosis_type이 필요합니다.' })
  }

  try {
    const { data, error } = await supabase
      .from('diagnosis_results')
      .insert({
        user_id: user ? user.id : null,
        diagnosis_type,
        score,
        total,
        percentage,
        grade,
        axis_scores,
        answers,
      })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, id: data.id })
  } catch (err) {
    console.error('[diagnosis/save]', err.message)
    res.status(500).json({ error: 'DB 오류입니다. Supabase 연결을 확인하세요.' })
  }
})

// GET /api/diagnosis/history (로그인 필요 — 내 진단 기록)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('diagnosis_results')
      .select('id, diagnosis_type, score, total, percentage, grade, axis_scores, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
