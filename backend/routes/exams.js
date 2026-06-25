const router = require('express').Router()
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/auth')
const supabase = require('../db/supabase')

function optionalAuth(req) {
  try {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    }
  } catch {}
  return null
}

function makeApplicationNo() {
  const now = new Date()
  const ymd = now.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `EX${ymd}-${rand}`
}

function toInt(value) {
  const next = Number(value)
  return Number.isFinite(next) ? Math.max(0, Math.round(next)) : 0
}

// POST /api/exams/applications
// 시험 접수 신청 저장. 비로그인도 가능하며 로그인 사용자는 user_id가 연결됩니다.
router.post('/applications', async (req, res) => {
  const user = optionalAuth(req)
  const { applicant = {}, exam = {}, schedule = {}, payment = {}, agreements = {}, group_info, add_ons = [], cert = {} } = req.body

  const required = [
    ['applicant.name', applicant.name],
    ['applicant.phone', applicant.phone],
    ['applicant.email', applicant.email],
    ['exam.type', exam.type],
    ['exam.name', exam.name],
  ]
  const missing = required.filter(([, value]) => !String(value || '').trim()).map(([key]) => key)
  if (missing.length > 0) {
    return res.status(400).json({ error: `필수 항목이 누락되었습니다: ${missing.join(', ')}` })
  }
  if (!agreements.terms_agreed) {
    return res.status(400).json({ error: '필수 약관 동의가 필요합니다.' })
  }

  const row = {
    application_no: makeApplicationNo(),
    user_id: user ? user.id : null,
    applicant_name: applicant.name,
    applicant_birthdate: applicant.birthdate || null,
    applicant_phone: applicant.phone,
    applicant_email: applicant.email,
    applicant_address: applicant.address || null,
    applicant_address_detail: applicant.address_detail || null,
    applicant_nationality: applicant.nationality || null,
    emergency_contact: applicant.emergency_contact || null,
    photo_file_name: applicant.photo_file_name || null,
    application_type: req.body.application_type === 'group' ? 'group' : 'individual',
    group_info: req.body.application_type === 'group' ? (group_info || {}) : {},
    exam_type: exam.type,
    exam_name: exam.name,
    subject_id: exam.subject_id || null,
    subject_name: exam.subject_name || null,
    grade_id: exam.grade_id || null,
    grade_name: exam.grade_name || null,
    schedule_id: schedule.id || null,
    schedule_snapshot: schedule || {},
    round_name: exam.round_name || schedule.round_name || null,
    reception_type: exam.reception_type || null,
    feedback_option: Boolean(exam.feedback_option),
    add_ons,
    cert_requested: Boolean(cert.requested),
    cert_type: cert.type || null,
    cert_amount: toInt(cert.amount),
    payment_method: payment.method || null,
    base_amount: toInt(payment.base_amount),
    add_on_amount: toInt(payment.add_on_amount),
    discount_amount: toInt(payment.discount_amount),
    point_used: toInt(payment.point_used),
    coupon_code: payment.coupon_code || null,
    total_amount: toInt(payment.total_amount),
    payment_status: payment.status || 'pending',
    application_status: 'submitted',
    ticket_status: 'ready',
    terms_agreed: Boolean(agreements.terms_agreed),
    privacy_agreed: Boolean(agreements.privacy_agreed),
    refund_agreed: Boolean(agreements.refund_agreed),
    notify_agreed: Boolean(agreements.notify_agreed),
    raw_payload: req.body,
  }

  try {
    const { data, error } = await supabase
      .from('exam_applications')
      .insert(row)
      .select('id, application_no, application_status, payment_status, ticket_status, created_at')
      .single()

    if (error) throw error
    res.status(201).json({ success: true, application: data })
  } catch (err) {
    console.error('[exams/applications]', err.message)
    res.status(500).json({ error: '접수 저장 중 DB 오류가 발생했습니다. Supabase 테이블 생성 여부를 확인하세요.' })
  }
})

// GET /api/exams/applications/me
// 로그인 사용자의 접수 이력
router.get('/applications/me', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('exam_applications')
      .select('id, application_no, exam_name, subject_name, grade_name, schedule_snapshot, total_amount, application_status, payment_status, ticket_status, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router