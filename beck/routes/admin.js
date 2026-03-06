const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/admin/usuarios', async (req, res) => {
  const usuarios = await User.find();
  res.json(usuarios);
});

router.post('/admin/assinatura', async (req, res) => {
  const { userId, status } = req.body;
  await User.updateOne({ _id: userId }, { subscriptionActive: status });
  res.json({ sucesso: true });
});

module.exports = router;
