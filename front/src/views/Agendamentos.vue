<template>
  <div class="meus-agendamentos">
    <div class="imagem-banner"></div>

    <h2>📅 Meus Agendamentos</h2>
    
    <!-- Mensagem de sucesso -->
    <div v-if="mensagemSucesso" class="sucesso">{{ mensagemSucesso }}</div>
    <div v-if="alarmeAtivo" class="alert">⚠️ Tempo Esgotado!</div>

    <!-- Formulário -->
    <form @submit.prevent="marcarAgendamento" class="formulario">
      <select v-model="novo.cliente" required>
        <option disabled value="">Selecione o cliente</option>
        <option v-for="c in clientes" :key="c" :value="c">{{ c }}</option>
      </select>

      <select v-model="novo.servico" required>
        <option disabled value="">Selecione o serviço</option>
        <option v-for="s in servicos" :key="s" :value="s">{{ s }}</option>
      </select>

      <select v-model="novo.barbeiro" required>
        <option disabled value="">Selecione o barbeiro</option>
        <option v-for="b in barbeiros" :key="b" :value="b">{{ b }}</option>
      </select>

      <input v-model="novo.data" type="date" required />
      <input v-model="novo.horario" type="time" required />
      <input v-model.number="novo.valor" type="number" placeholder="Valor (R$)" required />

      <button type="submit">Marcar Agendamento</button>
    </form>
<!-- Filtros -->
<div class="filtros">
  <select v-model="filtro.cliente">
    <option value="">Todos os clientes</option>
    <option v-for="c in clientes" :key="c" :value="c">{{ c }}</option>
  </select>

  <select v-model="filtro.servico">
    <option value="">Todos os serviços</option>
    <option v-for="s in servicos" :key="s" :value="s">{{ s }}</option>
  </select>

  <select v-model="filtro.barbeiro">
    <option value="">Todos os barbeiros</option>
    <option v-for="b in barbeiros" :key="b" :value="b">{{ b }}</option>
  </select>

  <input v-model="filtro.dataInicio" type="date" />
  <input v-model="filtro.dataFim" type="date" />

  <button @click="limparFiltros">Limpar Filtros</button>
</div>

    <!-- Tabela com paginação -->
    <div v-if="paginatedAgendamentos.length" class="tabela-agendamentos">
      <table>
        <thead>
          <tr>
            <th>👤 Cliente</th>
            <th>✂️ Serviço</th>
            <th>💈 Barbeiro</th>
            <th>🗓 Data</th>
            <th>🕒 Horário</th>
            <th>💵 Valor</th>
          </tr>
        </thead>
    <tbody>
  <tr v-for="item in paginatedAgendamentos" :key="item._id">
    <td>{{ item.cliente }}</td>
    <td>{{ item.servico }}</td>
    <td>{{ item.barbeiro }}</td>
    <td>{{ formatarData(item.data) }}</td>
    <td>{{ formatarHora(item.horario) }}</td>
    <td>R$ {{ item.valor }}</td>
  </tr>
</tbody>

      </table>

      <!-- Controles de paginação -->
      <div class="paginacao">
        <button @click="paginaAtual--" :disabled="paginaAtual === 1">⬅ Anterior</button>
        <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
        <button @click="paginaAtual++" :disabled="paginaAtual === totalPaginas">Próxima </button>
      </div>
    </div>

    <p v-else class="sem-agendamentos">Nenhum agendamento encontrado.</p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      agendamentos: [],
      clientes: ["João", "Maria", "Carlos"],
      servicos: ["Corte", "Barba", "Corte + Barba"],
      barbeiros: ["Pedro", "Lucas", "Rafael"],
      novo: { cliente: '', servico: '', barbeiro: '', data: '', horario: '', valor: null },
      mensagemSucesso: '',
      alarmeAtivo: false,
      paginaAtual: 1,
      itensPorPagina: 5,
      filtro: { cliente: '', servico: '', barbeiro: '', dataInicio: '', dataFim: '' }
    };
  },
  mounted() {
    this.carregarAgendamentos();
  },
  computed: {
    agendamentosFiltrados() {
      let lista = [...this.agendamentos];

      // Ordena do último para o primeiro (mais recente primeiro)
      lista.sort((a, b) => new Date(b.data || b.date) - new Date(a.data || a.date));

      // Filtro por cliente
      if (this.filtro.cliente) {
        lista = lista.filter(a => a.cliente === this.filtro.cliente);
      }

      // Filtro por serviço
      if (this.filtro.servico) {
        lista = lista.filter(a => a.servico === this.filtro.servico);
      }

      // Filtro por barbeiro
      if (this.filtro.barbeiro) {
        lista = lista.filter(a => a.barbeiro === this.filtro.barbeiro);
      }

      // Filtro por intervalo de datas
      if (this.filtro.dataInicio) {
        lista = lista.filter(a => new Date(a.data || a.date) >= new Date(this.filtro.dataInicio));
      }
      if (this.filtro.dataFim) {
        lista = lista.filter(a => new Date(a.data || a.date) <= new Date(this.filtro.dataFim));
      }

      return lista;
    },
    totalPaginas() {
      return Math.ceil(this.agendamentosFiltrados.length / this.itensPorPagina);
    },
    paginatedAgendamentos() {
      const start = (this.paginaAtual - 1) * this.itensPorPagina;
      const end = start + this.itensPorPagina;
      return this.agendamentosFiltrados.slice(start, end);
    }
  },
  methods: {
async carregarAgendamentos() {
  try {
    const res = await axios.get('http://localhost:3000/agendamentos');
    this.agendamentos = Array.isArray(res.data) ? res.data : [];

    // Ordena pelo campo data (mais recente primeiro)
    this.agendamentos.sort((a, b) => new Date(b.data) - new Date(a.data));
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err.message);
  }
},
  formatarData(data) {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR'); // exibe como DD/MM/AAAA
  },
  formatarHora(horario) {
    if (!horario) return '';
    return horario.slice(0,5); // garante HH:MM
  },
  


    async marcarAgendamento() {
const payload = {
  cliente: this.novo.cliente.trim(),
  servico: this.novo.servico.trim(),
  barbeiro: this.novo.barbeiro.trim(),
  data: new Date(this.novo.data), // transforma em Date
  horario: this.novo.horario,
  valor: Number(this.novo.valor)
};


  try {
    await axios.post('http://localhost:3000/agendamentos', payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    // Atualiza lista local
    await this.carregarAgendamentos();

    // Resetar filtros e paginação
    this.paginaAtual = 1;

    // Limpa formulário
    this.novo = { cliente: '', servico: '', barbeiro: '', data: '', horario: '', valor: null };

    // Mensagem de sucesso
    this.mensagemSucesso = "✅ Agendamento criado com sucesso!";
  } catch (err) {
    console.error('❌ Erro ao marcar agendamento:', err.response?.data || err.message);
    alert("Erro ao enviar agendamento. Verifique os dados ou tente novamente.");
  }
}}}
</script>

<style scoped>
#app {
  background-color: #121212;
  min-height: 100vh;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100%; /* usa min-height em vez de height */
  background-color: #121212; /* fundo escuro em toda a página */
}

.meus-agendamentos {
  min-height: 100vh; /* ocupa toda a altura da tela */
  box-sizing: border-box;
  background-color: #121212; /* garante que o container também seja escuro */
  padding: 20px;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

h2 {
  font-size: 22px;
  margin-bottom: 16px;
  color: #d0d3d6;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sucesso {
  margin: 15px 0;
  color: #4caf50;
  font-weight: bold;
  text-align: center;
}

.alert {
  margin: 10px 0;
  color: #ff9800;
  font-weight: bold;
  text-align: center;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  background-color: #2a2a2a;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.filtros {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  background: #2a2a2a;
  padding: 12px;
  border-radius: 8px;
}

.filtros select,
.filtros input {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #121212;
  color: #fff;
}

.filtros button {
  padding: 8px 12px;
  background: #8f9692;
  color: #121212;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.filtros button:hover {
  background: #777c79;
}

.formulario input,
.formulario select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #3a3a3c;
  background-color: #121212;
  color: #fff;
  font-size: 14px;
}

button {
  grid-column: span 2;
  padding: 12px;
  background-color: #8f9692;
  color: #1e1e1e;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #777c79;
}

.tabela-agendamentos {
  padding: 30px;
  background-color: #121212; /* fundo escuro */
  margin: 0; /* remove margens extras */
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

thead {
  background-color: #2c2c2c;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #333;
}

th {
  font-weight: 600;
  color: #ffffff;
}

tr:hover {
  background-color: #2a2a2a;
  transition: background-color 0.2s ease;
}

.paginacao {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
}

.paginacao button {
  padding: 8px 12px;
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.paginacao button:disabled {
  background-color: #777;
  cursor: not-allowed;
}

/* Ajustes para telas menores (celulares) */
@media (max-width: 600px) {
  .meus-agendamentos {
    padding: 12px;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 12px;
  }

  .formulario {
    grid-template-columns: 1fr; /* Coloca os campos em uma única coluna */
    gap: 10px;
    padding: 12px;
  }

  .filtros {
    flex-direction: column; /* Empilha os filtros */
    gap: 10px;
  }

  .filtros button {
    width: 100%; /* Botão ocupa toda a largura */
  }

  table {
    font-size: 12px; /* Fonte menor para caber melhor */
  }

  th, td {
    padding: 10px;
  }

  .paginacao {
    flex-wrap: wrap;
    gap: 8px;
  }

  .paginacao button {
    flex: 1; /* Botões se ajustam ao espaço disponível */
  }
}

</style>
