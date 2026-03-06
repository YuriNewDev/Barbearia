require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const autenticarToken = require('./middleware/auth');
const adminRoutes = require('./routes/admin');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' }) // salva em pasta local
const path = require('path');



// Rotas externas
const agendamentosRoutes = require('./routes/agendamentsRoutes'); 
const financeRoutes = require('./routes/financeRoutes');
const userRoutes = require('./routes/userRoutes');

// Models
const Finance = require('./models/Finance');
const User = require('./models/User');

const app = express();
const port = 3000;



// Configurações básicas
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas principais
app.use('/agendamentos', agendamentosRoutes);
app.use('/finance', financeRoutes);
app.use('/user', userRoutes);
app.use(adminRoutes);

// 🔐 Login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user._id }, 'secreto', { expiresIn: '1h' });

    res.json({ token, nome: user.name });
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

// 🔎 Relatórios (usa Finance como base)
app.get('/relatorios', autenticarToken, async (req, res) => {
  try {
    const registros = await Finance.find({ userId: req.user.id }); // 🔑 filtro por usuário
    res.json(registros);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar relatórios', detalhes: err.message });
  }
});


// 🔐 Registro de usuário
app.post('/user/registro', async (req, res) => {
  try {
    const { email, senha, name } = req.body;

    // Regex para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: 'Email inválido' });
    }

    // Regex para validar senha (mínimo 8 caracteres, pelo menos uma letra e um número)
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!senhaRegex.test(senha)) {
      return res.status(400).json({ erro: 'Senha deve ter no mínimo 8 caracteres, incluindo letras e números' });
    }

    // Criptografa a senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Cria novo usuário
    const novoUsuario = new User({ 
      email, 
      senha: senhaHash, 
      name, 
      subscriptionActive: false 
    });

    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao registrar usuário', detalhes: err.message });
  }
});



app.post('/user/foto', autenticarToken, upload.single('foto'), async (req, res) => {
  try {
    const userId = req.user.id;
    const fotoPath = req.file.filename;

    // Atualiza o usuário com o caminho da foto
    await User.findByIdAndUpdate(userId, { foto: fotoPath });

    // Retorna a URL completa para o front-end
    res.json({ url: `http://localhost:3000/uploads/${fotoPath}` });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar foto', detalhes: err.message });
  }
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch((err) => {
  console.error('❌ Erro ao conectar no MongoDB:', err.message);
  process.exit(1);
});


// Inicialização do servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
