const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');

router.get('/', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find();
    res.json(agendamentos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar agendamentos', detalhes: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { cliente, servico, barbeiro, data, horario, valor } = req.body;
    const novo = new Agendamento({ cliente, servico, barbeiro, data, horario, valor });
    const salvo = await novo.save();
    res.status(201).json(salvo);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar agendamento', detalhes: err.message });
  }
});

module.exports = router;
