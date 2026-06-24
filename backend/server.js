require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000

// CORS — 프론트 개발 서버 허용
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5178',
    'http://localhost:5200',
  ],
  credentials: true,
}))

app.use(express.json())

// 라우트
app.use('/api/auth', require('./routes/auth'))
app.use('/api/diagnosis', require('./routes/diagnosis'))
app.use('/api/admin', require('./routes/admin'))

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`\n🚀 AI 윤리 백엔드: http://localhost:${PORT}`)
  console.log(`   POST /api/auth/register`)
  console.log(`   POST /api/auth/login`)
  console.log(`   GET  /api/auth/me`)
  console.log(`   POST /api/diagnosis/save`)
  console.log(`   GET  /api/diagnosis/history`)
  console.log(`   GET  /api/admin/stats  (admin only)`)
  console.log(`   GET  /api/admin/users  (admin only)`)
  console.log(`   GET  /api/admin/diagnosis (admin only)\n`)
})
