const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.warn('[DB] ⚠️  Supabase 미연결 — .env 파일에 SUPABASE_URL, SUPABASE_ANON_KEY 설정 필요')
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

module.exports = supabase
