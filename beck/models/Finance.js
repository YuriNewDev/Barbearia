const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  barbeiro: String,
  pagamento: Number,
  forma: String,
  corte: String,
  data: Date,
  userId: { type: String, required: true },// vínculo com usuário
});

module.exports = mongoose.model('Finance', FinanceSchema);
