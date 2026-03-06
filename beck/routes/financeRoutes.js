const express = require('express');
const router = express.Router();
const Finance = require('../models/Finance');
const autenticarToken = require('../middleware/auth');

// 📌 Listar todos os registros
// 📌 Listar registros do usuário autenticado
router.get('/', autenticarToken, async (req, res) => {
  try {
    const registros = await Finance.find({ userId: req.user.id }); // 🔑 filtro por usuário
    res.json(registros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar registros', detalhes: err.message });
  }
});

// 📌 Criar novo registro
router.post('/', autenticarToken, async (req, res) => {
  try {
    const userId = req.user.id; // vem do token
    const novoRegistro = new Finance({ ...req.body, userId });
    await novoRegistro.save();
    res.status(201).json(novoRegistro);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao salvar registro', detalhes: err.message });
  }
});


// 📌 Atualizar registro existente
router.put('/:id', autenticarToken, async (req, res) => {
  try {
    const atualizado = await Finance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!atualizado) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.json(atualizado);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar', detalhes: err.message });
  }
});

// 📌 Remover registro
router.delete('/:id', autenticarToken, async (req, res) => {
  try {
    const removido = await Finance.findByIdAndDelete(req.params.id);
    if (!removido) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.json({ mensagem: 'Registro removido com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao remover', detalhes: err.message });
  }
});

module.exports = router;
