const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.warn('[DB] Supabase 미연결: .env 파일에 SUPABASE_URL을 설정하세요.')
}

if (!supabaseKey || supabaseKey.includes('placeholder')) {
  console.warn('[DB] Supabase key 미설정: SUPABASE_SERVICE_ROLE_KEY 또는 SUPABASE_ANON_KEY를 설정하세요.')
}

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

module.exports = supabase