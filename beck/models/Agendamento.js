const mongoose = require("mongoose");

const agendamentoSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  servico: { type: String, required: true },
  barbeiro: { type: String, required: true },
  data: { type: Date, required: true },   // agora é Date
  horario: { type: String, required: true },
  valor: { type: Number, required: true },
  criadoEm: { type: Date, default: Date.now }
});

const Agendamento = mongoose.model("Agendamento", agendamentoSchema);

module.exports = Agendamento;
