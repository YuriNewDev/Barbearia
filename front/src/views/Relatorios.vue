<template>
  <div class="financeiro">
    <h2>💵 Controle Financeiro</h2>

    <!-- Formulário -->
    <form @submit.prevent="registrarFinanceiro" class="formulario">
      <input v-model.number="novo.pagamento" type="number" placeholder="Valor do pagamento (R$)" required />

      <select v-model="novo.barbeiro" required>
        <option disabled value="">Selecione o barbeiro</option>
        <option v-for="b in barbeiros" :key="b" :value="b">{{ b }}</option>
      </select>

      <select v-model="novo.forma" required>
        <option disabled value="">Selecione a forma de pagamento</option>
        <option v-for="f in formasPagamento" :key="f" :value="f">{{ f }}</option>
      </select>

      <select v-model="novo.corte" required>
        <option disabled value="">Selecione o tipo de corte</option>
        <option v-for="c in tiposCorte" :key="c" :value="c">{{ c }}</option>
      </select>

      <button type="submit">{{ editandoId ? 'Adicionar venda' : 'Registrar' }}</button>
      <span v-if="mensagemSucesso" class="mensagem-sucesso">{{ mensagemSucesso }}</span>
    </form>

    <!-- Filtros -->
 <!-- Filtros -->
<div class="filtros">
  <select v-model="filtroBarbeiro">
    <option value="">Todos os barbeiros</option>
    <option v-for="b in barbeiros" :key="b" :value="b">{{ b }}</option>
  </select>

  <select v-model="filtroForma">
    <option value="">Todas as formas</option>
    <option v-for="f in formasPagamento" :key="f" :value="f">{{ f }}</option>
  </select>

  <!-- Filtro por data -->
  <input type="date" v-model="filtroDataInicio" />
  <input type="date" v-model="filtroDataFim" />
</div>

    <!-- Tabela -->
    <table class="tabela-financeira" v-if="registrosPaginados.length">
      <thead>
        <tr>
          <th>Barbeiro</th>
          <th>Pagamento</th>
          <th>Forma</th>
          <th>Corte</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in registrosPaginados" :key="item._id">
          <td>{{ item.barbeiro }}</td>
          <td class="valor">R$ {{ item.pagamento }}</td>
          <td>{{ item.forma }}</td>
          <td class="cortes">{{ item.corte }}</td>
          <td>{{ formatarData(item.data) }}</td>
          <td>
            <button @click="removerFinanceiro(item._id)" class="btn-remover">Remover</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="sem-registros">Nenhum registro financeiro encontrado.</p>

    <!-- Paginação -->
    <div class="paginacao" v-if="totalPaginas > 1">
      <button @click="mudarPagina(paginaAtual - 1)" :disabled="paginaAtual === 1">Anterior</button>
      <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
      <button @click="mudarPagina(paginaAtual + 1)" :disabled="paginaAtual === totalPaginas">Próxima</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
 data() {
  return {
    registros: [],
    barbeiros: ["Welisson", "Lucas", "Rafael"],
    formasPagamento: ["Dinheiro", "Cartão de Crédito", "Cartão de Débito", "Pix"],
    tiposCorte: ["Corte simples", "Corte degradê", "Barba", "Corte + Barba + Sombrancelha", "Sombrancelha + barba", "Sombrancelha"],
    novo: { pagamento: null, barbeiro: '', forma: '', corte: '' },
    filtroBarbeiro: '',
    filtroForma: '',
    filtroDataInicio: '',
    filtroDataFim: '',
    editandoId: null,
    mensagemSucesso: '',
    paginaAtual: 1,
    itensPorPagina: 2
  };
},

  mounted() {
    this.carregarRegistros();
  },
  computed: {
  registrosFiltrados() {
    return this.registros.filter(item => {
      const barbeiroOk = this.filtroBarbeiro ? item.barbeiro === this.filtroBarbeiro : true;
      const formaOk = this.filtroForma ? item.forma === this.filtroForma : true;

      // Filtro de data
      const dataItem = new Date(item.data);
      const inicioOk = this.filtroDataInicio ? dataItem >= new Date(this.filtroDataInicio) : true;
      const fimOk = this.filtroDataFim ? dataItem <= new Date(this.filtroDataFim) : true;

      return barbeiroOk && formaOk && inicioOk && fimOk;
    });
  },
  registrosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.registrosFiltrados.slice(inicio, fim);
  },
  totalPaginas() {
    return Math.ceil(this.registrosFiltrados.length / this.itensPorPagina);
  }
}
,
  methods: {
    async carregarRegistros() {
      try {
        const res = await axios.get('http://localhost:3000/relatorios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.registros = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error('Erro ao carregar registros:', err.response?.data?.erro || err.message);
      }
    },

    async registrarFinanceiro() {
      try {
        const payload = { ...this.novo, data: new Date() };
        if (this.editandoId) {
          await axios.put(`http://localhost:3000/finance/${this.editandoId}`, payload);
          this.mensagemSucesso = '✏️ Registro atualizado com sucesso!';
        } else {
          await axios.post('http://localhost:3000/finance', payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          this.mensagemSucesso = '✅ Registro financeiro salvo com sucesso!';
        }
        this.carregarRegistros();
        this.novo = { pagamento: null, barbeiro: '', forma: '', corte: '' };
        this.editandoId = null;
        setTimeout(() => { this.mensagemSucesso = ''; }, 3000);
      } catch (err) {
        console.error('Erro ao registrar/editar financeiro:', err.response?.data?.erro || err.message);
      }
    },

    async removerFinanceiro(id) {
      try {
        await axios.delete(`http://localhost:3000/finance/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.mensagemSucesso = '❌ Registro removido com sucesso!';
        this.carregarRegistros();
        setTimeout(() => { this.mensagemSucesso = ''; }, 3000);
      } catch (err) {
        console.error('Erro ao remover registro:', err.response?.data?.erro || err.message);
      }
    },

    formatarData(data) {
      return new Date(data).toLocaleDateString('pt-BR');
    },

    mudarPagina(p) {
      if (p >= 1 && p <= this.totalPaginas) {
        this.paginaAtual = p;
      }
    }
  }
};
</script>


<style scoped>
.financeiro {
  padding: 16px;
  background-color: #121212;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

.financeiro h2 {
  font-size: 20px;
  margin-bottom: 16px;
  border-bottom: 1px solid #2a2a2a;
  padding-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Formulário no mobile: empilhado */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  background-color: #1c1c1c;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.formulario input,
.formulario select {
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #333;
  background-color: #0f0f0f;
  color: #e0e0e0;
  font-size: 14px;
}

.formulario button {
  width: 100%;
  padding: 14px;
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.formulario button:hover {
  background-color: #666;
}

.mensagem-sucesso {
  text-align: center;
  color: #81c784;
  font-weight: 600;
  margin-top: 8px;
}

/* Filtros no mobile: empilhados */
.filtros {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.filtros select {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #333;
  background-color: #0f0f0f;
  color: #e0e0e0;
  font-size: 14px;
}

/* Tabela no mobile: estilo lista */
.tabela-financeira {
  width: 100%;
  border-collapse: collapse;
  background-color: #1c1c1c;
  color: #e0e0e0;
  font-size: 12px; /* menor */
  border-radius: 6px;
  overflow-x: auto;
  display: block;
  font-family: 'Inter', 'Roboto', 'Montserrat', sans-serif; /* fontes modernas */
}

.tabela-financeira thead {
  display: none; /* esconde cabeçalho no mobile */
}

.tabela-financeira tr {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #2a2a2a;
  padding: 6px; /* bem mais compacto */
}

.tabela-financeira td {
  padding: 2px 0; /* mínimo */
}

.tabela-financeira td.valor {
  color: #81c784;
  font-weight: 600;
  font-size: 13px; /* destaque sem exagero */
}

.tabela-financeira td.cortes {
  color: #ccc;
  font-weight: 500;
  font-size: 12px;
}

.btn-remover {
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #b71c1c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-remover:hover {
  background-color: #d32f2f;
}

.sem-registros {
  font-size: 14px;
  color: #999;
  margin-top: 20px;
  text-align: center;
}

/* Paginação */
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
  transition: background-color 0.3s ease;
}

.paginacao button:hover:not(:disabled) {
  background-color: #666;
}

.paginacao button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Telas maiores */
@media (min-width: 768px) {
  .formulario {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .formulario button {
    grid-column: span 2;
  }

  .filtros {
    flex-direction: row;
  }

  .tabela-financeira {
    display: table;
  }

  .tabela-financeira thead {
    display: table-header-group;
  }

  .tabela-financeira tr {
    display: table-row;
  }

  .tabela-financeira td,
  .tabela-financeira th {
    padding: 12px 16px;
    text-align: left;
  }

  .tabela-financeira th {
    background-color: #222;
    color: #bbb;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 13px;
  }
}
.filtros input[type="date"] {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #333;
  background-color: #0f0f0f;
  color: #e0e0e0;
  font-size: 14px;
}


</style>
