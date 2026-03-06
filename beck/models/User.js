const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  senha: {
    type: String,
    required: true
  },
   subscriptionActive: { type: Boolean, default: false },
     foto: String // caminho ou URL da foto
});

// Criptografa a senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  try {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Método para validar senha no login
UserSchema.methods.validarSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
