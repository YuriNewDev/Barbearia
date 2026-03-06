<template>
  <div class="registro-layout">
    <!-- Lado esquerdo: formulário -->
    <div class="form-area">
      <div class="form-card">
        <div class="logo-area">
          <h1>Barber Dash</h1>
          <p class="slogan">Tesouras e navalhas</p>
        </div>

        <h2>Faça seu Cadastro</h2>
        <form @submit.prevent="registrar">
          <div class="input-group">
            <span class="icon">👤</span>
            <input v-model="form.name" type="text" placeholder="Seu nome (ou nome da barbearia)" required />
          </div>

          <div class="input-group">
            <span class="icon">📧</span>
            <input v-model="form.email" type="email" placeholder="E-mail" required />
          </div>

          <div class="input-group">
            <span class="icon">🔒</span>
            <input v-model="form.senha" type="password" placeholder="Senha" required />
          </div>

          <div class="input-group">
            <span class="icon">✅</span>
            <input v-model="confirmarSenha" type="password" placeholder="Confirme sua senha" required />
          </div>

          <button type="submit">Cadastrar</button>
          <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
        </form>

        <router-link to="/login" class="voltar">← Voltar para Login</router-link>
      </div>
    </div>

    <!-- Lado direito: painel institucional -->
    <div class="image-area">
      <div class="barber-panel">
        <h2>💈 Barber Dash</h2>
        <p class="tagline">Profissionalismo e tradição em cada corte</p>
        <div class="highlights">
          <p>✂️ Cortes clássicos e modernos</p>
          <p>🪒 Barbearia com estilo</p>
          <p>🤝 Atendimento de qualidade</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const form = reactive({
  name: '',
  email: '',
  senha: ''
});

const confirmarSenha = ref('');
const mensagem = ref('');
const router = useRouter();

const registrar = async () => {
  if (form.senha !== confirmarSenha.value) {
    mensagem.value = '❌ As senhas não coincidem!';
    return;
  }

  try {
    await axios.post('http://localhost:3000/user/registro', form);
    mensagem.value = '✅ Conta criada com sucesso!';
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    mensagem.value = `❌ Erro: ${err.response?.data?.erro || err.message}`;
  }
};

</script>

<style scoped>
.registro-layout {
  display: flex;
  flex-direction: column; /* padrão: mobile: empilhado */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Área do formulário */
.form-area {
  flex: none;
  background-color: #121214;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

/* Card do formulário */
.form-card {
  background-color: #202024;
  padding: 24px;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
  color: #fff;
}

/* Área da imagem/painel institucional */
.image-area {
  display: block; /* agora aparece no mobile também */
  background-color: #1c1c1c;
  color: #e0e0e0;
  padding: 20px;
}

/* Logo e slogan */
.logo-area {
  text-align: center;
  margin-bottom: 20px;
}

.logo-area h1 {
  font-size: 26px;
  font-weight: 800;
  color: #f5f5f5;
  letter-spacing: 2px;
}

.logo-area .slogan {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

/* Formulário */
form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  align-items: center;
  background-color: #121214;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
}

.input-group .icon {
  margin-right: 10px;
  font-size: 18px;
  color: #999;
}

input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 15px;
}

input::placeholder {
  color: #666;
}

button {
  padding: 14px;
  background-color: #6e6a62;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #ffa733;
}

/* Link de voltar */
.voltar {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
  text-decoration: none;
}

.voltar:hover {
  color: #f5f2ef;
}

/* Telas maiores */
@media (min-width: 768px) {
  .registro-layout {
    flex-direction: row; /* lado a lado */
  }

  .form-area {
    flex: 1;
    padding: 40px;
  }

  .image-area {
    flex: 1;
    display: flex; /* mostra no desktop */
    justify-content: center;
    align-items: center;
    padding: 40px;
  }
}

/* Painel institucional */
.barber-panel {
  text-align: center;
  max-width: 400px;
}

.barber-panel h2 {
  font-size: 28px;
  font-weight: 800;
  color: #f5f5f5;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.barber-panel .tagline {
  font-size: 15px;
  color: #ccc;
  margin-bottom: 20px;
  font-style: italic;
}

.barber-panel .highlights p {
  margin: 8px 0;
  font-size: 14px;
  color: #999;
}


</style>
