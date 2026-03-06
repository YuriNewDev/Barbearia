const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Verifica se o header existe e se começa com "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica o token
    const decoded = jwt.verify(token, 'secreto'); // 🔑 troque por chave segura em produção
    req.user = decoded; // adiciona info do usuário na requisição
    next(); // segue para a rota protegida
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado' });
  }
}

module.exports = autenticar;
