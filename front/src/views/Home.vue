<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ aberta: sidebarAberta }">
      <!-- Botão de abrir/fechar -->
      <button class="toggle-btn" @click="sidebarAberta = !sidebarAberta">
        <span v-if="!sidebarAberta">☰</span>
        <span v-else>✖</span>
      </button>

      <div class="profile">
        <img 
          v-if="usuarioFoto" 
          :src="usuarioFoto" 
          alt="Foto de perfil" 
          class="avatar" 
        />
        <span v-if="sidebarAberta" class="username">{{ usuarioNome }}</span>

        <label v-if="!usuarioFoto" class="upload-label">
          📷 Selecionar foto
          <input type="file" @change="atualizarFoto" accept="image/*" hidden />
        </label>
      </div>

      <!-- Menu -->
      <nav>
        <ul class="menu">
          <li>
            <router-link to="/inicial">
              <span class="icon">🏠</span>
              <span v-if="sidebarAberta" class="text">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/agendamentos">
              <span class="icon">📅</span>
              <span v-if="sidebarAberta" class="text">Agendamentos</span>
            </router-link>
          </li>
          <li>
            <router-link to="/relatorios">
              <span class="icon">📈</span>
              <span v-if="sidebarAberta" class="text">Relatórios</span>
            </router-link>
          </li>
          <li>
            <router-link to="/assinatura">
              <span class="icon">💳</span>
              <span v-if="sidebarAberta" class="text">Perfil</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Logout -->
      <button class="logout" @click="fazerLogout">
        <span class="icon">🚪</span>
        <span v-if="sidebarAberta" class="text">Logout</span>
      </button>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
export default {
  name: 'Dashboard',
  data() {
    return {
      sidebarAberta: false,
      usuarioNome: localStorage.getItem('nome') || 'Usuário',
      usuarioFoto: localStorage.getItem('foto') || ''
    };
  },
  methods: {
    fazerLogout() {
      Swal.fire({
        icon: 'success',
        title: 'Logout realizado!',
        text: 'Você saiu da sua conta com sucesso.',
        background: '#1c1c1c',
        color: '#fff',
        confirmButtonColor: '#ffa733'
      }).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('nome');
        this.usuarioFoto = '';
        this.$router.push('/login');
      });
    },
   async atualizarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('foto', file);

  const token = localStorage.getItem('token');
  const response = await axios.post('http://localhost:3000/user/foto', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  this.usuarioFoto = response.data.url;
  localStorage.setItem('foto', this.usuarioFoto);
}

    }
  }
</script>

<style scoped>
#app {
  background-color: #121212;
  min-height: 100vh;
}
.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #0c0c0f;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 70px;
  background-color: #121212;
  border-right: 1px solid #2a2a2a;
  padding: 16px 8px;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar.aberta {
  width: 220px;
}

/* Botão toggle */
.toggle-btn {
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 16px;
  transition: color 0.3s ease;
}

.toggle-btn:hover {
  color: #ffa733;
}

/* Perfil */
.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.avatar {
  width: 80%;
  max-width: 160px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
  transition: all 0.3s ease;
}

.username {
  font-size: 14px;
  font-weight: 600;
  color: #e0e0e0;
}

.upload-label {
  font-size: 12px;
  color: #aaa;
  cursor: pointer;
  margin-top: 6px;
  transition: color 0.3s ease;
}

.upload-label:hover {
  color: #ffa733;
}

/* Menu */
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.menu li {
  margin: 12px 0;
}

.menu a {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #e0e0e0;
  text-decoration: none;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.menu a:hover {
  background-color: #1f1f1f;
}

.icon {
  font-size: 18px;
}

.text {
  white-space: nowrap;
}

/* Logout */
.logout {
  margin-top: auto;
  background: none;
  border: none;
  font-size: 16px;
  color: #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  transition: color 0.3s ease;
}

.logout:hover {
  color: #ffa733;
}

/* Main */
.main {
  flex: 1;
  padding: 24px;
  background-color: #1c1c1f;
}
</style>
