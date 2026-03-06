<template>
  <div class="painel-container">
    <h2>Painel Administrativo</h2>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Status</th>
          <th>Ação</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paginatedUsers" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="user.subscriptionActive ? 'ativa' : 'inativa'">
              {{ user.subscriptionActive ? 'ATIVA' : 'INATIVA' }}
            </span>
          </td>
          <td>
            <button @click="toggleAssinatura(user)">
              {{ user.subscriptionActive ? 'Desativar' : 'Ativar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginação -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const users = ref([])
const currentPage = ref(1)
const pageSize = 5 // quantos usuários por página

onMounted(async () => {
  const resposta = await fetch('http://localhost:3000/admin/usuarios')
  users.value = await resposta.json()
})

const totalPages = computed(() => Math.ceil(users.value.length / pageSize))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return users.value.slice(start, start + pageSize)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

async function toggleAssinatura(user) {
  const novoStatus = !user.subscriptionActive;

  const resposta = await fetch('http://localhost:3000/admin/assinatura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: user._id, status: novoStatus })
  });

  const usuarioAtualizado = await resposta.json();

  // Atualiza o usuário na lista
  const index = users.value.findIndex(u => u._id === usuarioAtualizado._id);
  if (index !== -1) {
    users.value[index] = usuarioAtualizado;
  }
}

</script>

<style scoped>
body{
   background-color: #1c1c1f;
}
.painel-container {
  padding: 20px;
  background: #1e1e1e; /* fundo escuro */
  border-radius: 10px;
  max-width: 800px;
  margin: auto;
  color: #f0f0f0; /* texto claro */
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 12px;
  border-bottom: 1px solid #333;
}

th {
  background: #2a2a2a;
  color: #fff;
}

.ativa {
  color: #4caf50;
  font-weight: bold;
}

.inativa {
  color: #f44336;
  font-weight: bold;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
