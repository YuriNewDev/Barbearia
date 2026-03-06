<template>
  <div class="inicial">
    <div class="top-bar">
      <div class="boas-vindas">
        <h1>👋 Bem-vindo, <span class="nome">{{ nome }}</span></h1>
        <p>Gerencie seus agendamentos, clientes e relatórios com facilidade.</p>
      </div>
    </div>

<div class="atalhos">
  <!-- Card de número de agendamentos -->
  <div class="atalho-card">
    📅 <span>Agendamentos de hoje</span>
    <div v-if="agendamentosHoje.length" class="agendamento-total">
      {{ agendamentosHoje.length }}
    </div>
    <p v-else class="sem-agendamentos">Nenhum agendamento para hoje.</p>
  </div>

  <!-- Card de relatórios financeiros -->
  <div class="atalho-card">
    📈 <span>Faturado Hoje</span>
    <div v-if="registrosFinanceiros.length" class="financeiro-total">
      R$ {{ somaFinanceirosHoje }}
    </div>
    <p v-else class="sem-registros">Nenhum registro financeiro encontrado.</p>
  </div>

  <!-- ✅ Novo card de faturamento mensal -->
  <div class="atalho-card">
    💰 <span>Faturamento do Mês</span>
    <div v-if="registrosFinanceirosMes.length" class="financeiro-total">
      R$ {{ somaFinanceirosMes }}
    </div>
    <p v-else class="sem-registros">Nenhum registro financeiro neste mês.</p>
  </div>
</div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Inicial',
  data() {
    return {
      nome: localStorage.getItem('nome') || 'Usuário',
      agendamentosHoje: [],
      registrosFinanceiros: [],
      registrosFinanceirosMes: [],
      somaFinanceirosHoje: 0,
      somaFinanceirosMes: 0
    };
  },
  mounted() {
    this.carregarAgendamentosHoje();
    this.carregarFinanceiros();
  },
  methods: {
    async carregarAgendamentosHoje() {
      try {
        const res = await axios.get('http://localhost:3000/agendamentos', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const todos = Array.isArray(res.data) ? res.data : [];
        const hoje = new Date().toISOString().split('T')[0];
        this.agendamentosHoje = todos.filter(a => a.data === hoje);
      } catch (err) {
        console.error('Erro ao carregar agendamentos do dia:', err.message);
      }
    },
async carregarFinanceiros() {
  try {
    const res = await axios.get('http://localhost:3000/relatorios', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    this.registrosFinanceiros = Array.isArray(res.data) ? res.data : [];

    const hoje = new Date();

    // soma do dia
    this.somaFinanceirosHoje = this.registrosFinanceiros
      .filter(item => {
        const dataItem = new Date(item.data);
        return (
          dataItem.getDate() === hoje.getDate() &&
          dataItem.getMonth() === hoje.getMonth() &&
          dataItem.getFullYear() === hoje.getFullYear()
        );
      })
      .reduce((total, item) => total + Number(item.pagamento || 0), 0);

    // soma do mês
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    this.registrosFinanceirosMes = this.registrosFinanceiros.filter(item => {
      const dataItem = new Date(item.data);
      return (
        dataItem.getMonth() === mesAtual &&
        dataItem.getFullYear() === anoAtual
      );
    });

    this.somaFinanceirosMes = this.registrosFinanceirosMes.reduce(
      (total, item) => total + Number(item.pagamento || 0),
      0
    );
  } catch (err) {
    console.error('Erro ao carregar registros financeiros:', err.message);
  }
}}}
</script>


<style scoped>
.inicial {
  padding: 16px;
  font-family: 'Poppins', sans-serif;
}

.top-bar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.atalhos {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

/* Card base */
.atalho-card {
  width: 100%;
  background: #1e1e1e;
  padding: 16px;
  border-radius: 12px;
  color: #f1f1f1;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.atalho-card span {
  font-weight: 600;
  font-size: 16px;
  color: #d0d0d0;
}

.atalho-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.agendamento-total,
.financeiro-total {
  margin-top: 12px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  background: #2a2a2a;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #333131;
  box-shadow: inset 0 2px 6px rgba(0,0,0,0.4);
}

.sem-agendamentos,
.sem-registros {
  margin-top: 12px;
  color: #999;
  font-style: italic;
  text-align: center;
}

/* Telas maiores */
@media (min-width: 768px) {
  .top-bar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .atalhos {
    flex-direction: row;
  }

  .atalho-card {
    flex: 1;
  }
}

</style>
