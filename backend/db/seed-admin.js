// 관리자 계정 시드 스크립트
//   실행: cd backend && node db/seed-admin.js
//   환경변수(.env)의 SUPABASE_URL + (SERVICE_ROLE_KEY 권장)로 동작합니다.
const bcrypt = require('bcryptjs')
const supabase = require('./supabase')

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@naver.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234'
const ADMIN_NAME = process.env.ADMIN_NAME || '휴텍씨 관리자'

async function main() {
  const password_hash = await bcrypt.hash(ADMIN_PASSWORD, 12)

  const { data: existing } = await supabase
    .from('users').select('id').eq('email', ADMIN_EMAIL).single()

  if (existing) {
    const { error } = await supabase
      .from('users')
      .update({ role: 'admin', password_hash, name: ADMIN_NAME })
      .eq('email', ADMIN_EMAIL)
    if (error) throw error
    console.log(`✅ 기존 계정을 관리자(admin)로 갱신: ${ADMIN_EMAIL}`)
  } else {
    const { error } = await supabase
      .from('users')
      .insert({ email: ADMIN_EMAIL, password_hash, name: ADMIN_NAME, role: 'admin' })
    if (error) throw error
    console.log(`✅ 관리자 계정 생성 완료: ${ADMIN_EMAIL}`)
  }
  console.log(`   비밀번호: ${ADMIN_PASSWORD} (로그인 후 변경 권장)`)
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ 시드 실패:', err.message)
  console.error('   → Supabase 미연결이거나 RLS가 막은 경우, SQL Editor에서 schema.sql의 관리자 INSERT를 직접 실행하세요.')
  process.exit(1)
})
