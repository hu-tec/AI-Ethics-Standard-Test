require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000

const devOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5178',
  'http://localhost:5200',
]

const envOrigins = [process.env.FRONTEND_URL, ...(process.env.CORS_ORIGINS || '').split(',')]
  .filter(Boolean)
  .map((origin) => origin.trim())

const allowedOrigins = [...new Set([...devOrigins, ...envOrigins])]

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS blocked: ${origin}`))
  },
  credentials: true,
}))

app.use(express.json({ limit: '2mb' }))

// 라우트
app.use('/api/auth', require('./routes/auth'))
app.use('/api/diagnosis', require('./routes/diagnosis'))
app.use('/api/exams', require('./routes/exams'))
app.use('/api/admin', require('./routes/admin'))

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`\n🚀 휴텍씨 AI 시험 백엔드: http://localhost:${PORT}`)
  console.log(`   POST /api/auth/register`)
  console.log(`   POST /api/auth/login`)
  console.log(`   GET  /api/auth/me`)
  console.log(`   POST /api/diagnosis/save`)
  console.log(`   GET  /api/diagnosis/history`)
  console.log(`   POST /api/exams/applications`)
  console.log(`   GET  /api/exams/applications/me`)
  console.log(`   GET  /api/admin/stats  (admin only)`)
  console.log(`   GET  /api/admin/users  (admin only)`)
  console.log(`   GET  /api/admin/diagnosis (admin only)`)
  console.log(`   GET  /api/admin/applications (admin only)`)
  console.log(`   PATCH /api/admin/applications/:id (admin only)\n`)
})