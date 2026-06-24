const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../db/supabase')

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ error: '이메일, 비밀번호, 이름을 모두 입력해주세요.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' })
  }
  try {
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single()
    if (existing) return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' })

    const password_hash = await bcrypt.hash(password, 12)
    const { data, error } = await supabase
      .from('users').insert({ email, password_hash, name }).select('id, email, name, role, created_at').single()
    if (error) throw error

    const token = jwt.sign({ id: data.id, email: data.email, name: data.name, role: data.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ user: data, token })
  } catch (err) {
    console.error('[register]', err.message)
    res.status(500).json({ error: 'DB 오류 또는 서버 오류입니다. Supabase 연결을 확인하세요.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' })
  }
  try {
    const { data: user } = await supabase
      .from('users').select('id, email, name, role, password_hash').eq('email', email).single()
    if (!user) return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' })

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' })

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password_hash, ...userSafe } = user
    res.json({ user: userSafe, token })
  } catch (err) {
    console.error('[login]', err.message)
    res.status(500).json({ error: 'DB 오류입니다. Supabase 연결을 확인하세요.' })
  }
})

// GET /api/auth/me (토큰 검증 + 내 정보)
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users').select('id, email, name, role, created_at').eq('id', req.user.id).single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
