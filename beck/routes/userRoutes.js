const express = require('express');
const router = express.Router();
const User = require('../models/User'); // importa o model
const bcrypt = require('bcrypt');

// Rota de registro
router.post('/user/registro', async (req, res) => {
  try {
    const { email, senha, name, role } = req.body;

    const novoUsuario = new User({ 
      email, 
      senha, 
      name, 
      role: role || 'cliente' // se não vier, assume cliente
    });

    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao registrar usuário', detalhes: err.message });
  }
});



module.exports = router;
