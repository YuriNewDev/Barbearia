const express = require('express');
const router = express.Router();
const User = require('../models/User'); // importa o model
const jwt = require('jsonwebtoken');

// Rota de login
// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await User.findOne({ email });
  if (!usuario) return res.status(401).json({ erro: 'Usuário não encontrado' });

  const senhaValida = await usuario.validarSenha(senha);
  if (!senhaValida) return res.status(401).json({ erro: 'Senha inválida' });

  const payload = { id: usuario._id, nome: usuario.name, subscriptionActive: usuario.subscriptionActive };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  // 👉 Retorna também a foto salva no banco
  res.json({ 
    token, 
    id: usuario._id, 
    nome: usuario.name, 
    subscriptionActive: usuario.subscriptionActive,
    foto: usuario.foto ? `http://localhost:3000/uploads/${usuario.foto}` : null
  });
});

module.exports = router;
