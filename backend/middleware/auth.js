const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증이 필요합니다. 로그인 후 이용해주세요.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: '토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.' })
  }
}
