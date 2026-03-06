<template>
  <div class="perfil-container">
    <h2>💈 Perfil do Cliente</h2>

    <form class="perfil-form">
      <!-- Bloco de informações pessoais -->
      <section class="bloco">
        <h3>👤 Informações Pessoais</h3>
        <div class="campo">
          <label for="nome">Nome</label>
          <input id="nome" v-model="user.name" type="text" placeholder="Digite seu nome" />
        </div>

      </section>

      <!-- Bloco de foto -->
      <section class="bloco">
        <h3>📸 Foto de Perfil</h3>
        <div class="foto-upload">
          <img :src="user.photo || defaultPhoto" alt="Foto do usuário" class="foto-preview" />
          <input id="foto" type="file" @change="updatePhoto" />
        </div>
      </section>

      <!-- Bloco de assinatura -->
      <section class="bloco">
        <h3>💳 Assinatura</h3>
        <div class="assinatura-status" :class="user.subscriptionActive ? 'ativa' : 'inativa'">
          {{ user.subscriptionActive ? 'ATIVA' : 'INATIVA' }}
        </div>
      </section>

      <button type="submit">💾 Salvar Alterações</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref({
  name: '',
  email: '',
  photo: null,
  subscriptionActive: false
})

const defaultPhoto = '/default-avatar.png'

onMounted(() => {
  user.value.name = localStorage.getItem('nome') || ''
  user.value.email = localStorage.getItem('email') || ''
  user.value.subscriptionActive = localStorage.getItem('subscriptionActive') === 'false';
})

function updatePhoto(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      user.value.photo = reader.result
      localStorage.setItem('foto', reader.result) // 👉 salva no localStorage
    }
    reader.readAsDataURL(file)
  }
}

</script>

<style scoped>
.perfil-container {
  padding: 16px;
  background: #121212;
  color: #e0e0e0;
  font-family: 'Inter', sans-serif;
  border-radius: 12px;
  max-width: 100%; /* ocupa toda a tela no mobile */
  margin: auto;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

h2 {
  font-size: 22px;
  margin-bottom: 16px;
  color: #f5f5f5;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
}

.perfil-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bloco {
  background: #1e1e1e;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid #2a2a2a;
}

.bloco h3 {
  margin-bottom: 12px;
  font-size: 16px;
  color: #cfcfcf;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

label {
  margin-bottom: 6px;
  font-weight: bold;
  color: #cfd2d4;
  font-size: 14px;
}

input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #1a1a1a;
  color: #fff;
  font-size: 15px;
}

/* Foto no mobile: empilhada */
.foto-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.foto-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #8f9692;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

.assinatura-status {
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
}

.ativa {
  background-color: #4caf50;
  color: #fff;
}

.inativa {
  background-color: #ad1a1a;
  color: #fff;
}

button {
  padding: 14px;
  background: #8f9692;
  color: #121212;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #777c79;
  transform: scale(1.02);
}

/* Telas maiores */
@media (min-width: 768px) {
  .perfil-container {
    max-width: 700px;
    padding: 30px;
  }

  .foto-upload {
    flex-direction: row; /* foto e upload lado a lado */
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
  }

  h2 {
    font-size: 26px;
  }

  .bloco h3 {
    font-size: 18px;
  }
}

</style>
