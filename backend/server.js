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

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`\n🚀 AI 윤리 백엔드 실행 중: http://localhost:${PORT}`)
  console.log(`📋 API 엔드포인트:`)
  console.log(`   POST /api/auth/register  — 회원가입`)
  console.log(`   POST /api/auth/login     — 로그인`)
  console.log(`   GET  /api/auth/me        — 내 정보`)
  console.log(`   POST /api/diagnosis/save — 진단 결과 저장`)
  console.log(`   GET  /api/diagnosis/history — 내 진단 기록`)
  console.log(`\n⚠️  DB 연결: .env 파일에 Supabase 설정 필요\n`)
})
