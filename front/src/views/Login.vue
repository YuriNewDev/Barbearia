<template>
  <div class="login-layout">
    <div class="form-area">
      <div class="form-card">
        <div class="logo-area">
          <h1>Barber Dash</h1>
          <p class="slogan">Awesome • Haircuts & Shaves</p>
        </div>

        <h2>🔐 Login</h2>
        <form @submit.prevent="fazerLogin">
          <div class="input-group">
            <span class="icon">📧</span>
            <input type="email" v-model="email" placeholder="E-mail" required />
          </div>

          <div class="input-group">
            <span class="icon">🔑</span>
            <input type="password" v-model="senha" placeholder="Senha" required />
          </div>

          <button type="submit">Entrar</button>
          <p v-if="erro" class="erro">{{ erro }}</p>
        </form>

        <router-link to="/registro" class="voltar">← Criar Conta</router-link>
        <router-link to="/registro" class="voltar">Esqueceu sua senha? Clique aqui </router-link>
      </div>
    </div>
    <div class="image-area"></div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      senha: '',
      erro: '',

  };

},
  methods: {
    async fazerLogin() {
      try {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, senha: this.senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          this.erro = dados.erro || 'Erro ao fazer login';
          Swal.fire({
            icon: 'error',
            title: 'Erro no login',
            text: this.erro,
            background: '#1c1c1c',
            color: '#fff'
          });
        } else {
          // Salva token e nome
    localStorage.setItem('token', dados.token);
localStorage.setItem('userId', dados.id);   // <-- aqui
localStorage.setItem('nome', dados.nome);
localStorage.setItem('subscriptionActive', dados.subscriptionActive);


          // Pop-up escuro e bonito
          Swal.fire({
            icon: 'success',
            title: 'Logado com sucesso!',
            text: `Bem-vindo, ${dados.nome}!`,
            background: '#1c1c1c',
            color: '#fff',
            confirmButtonColor: '#ffa733'
          }).then(() => {
            // Só redireciona depois que o pop-up fechar
            this.$router.push('/inicial');
          });
        }
      } catch (err) {
        this.erro = 'Erro de conexão com o servidor';
        Swal.fire({
          icon: 'error',
          title: 'Erro de conexão',
          text: this.erro,
          background: '#1c1c1c',
          color: '#fff'
        });
      }
    }
  }
};
</script>

<style scoped>
/* estilos iguais aos que você já tinha */
.login-layout {
  display: flex;
  height: 100vh;
  font-family: 'Inter', sans-serif;
}

.form-area {
  flex: 1;
  background-color: #121214;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-area {
  flex: 1;
  background: url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260') no-repeat center center;
  background-size: cover;
}

.form-card {
  background-color: #202024;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
  color: #fff;
}

.logo-area {
  text-align: center;
  margin-bottom: 20px;
}

.logo-area h1 {
  font-size: 32px;
  font-weight: 800;
  color: #4b4845;
  letter-spacing: 2px;
}

.logo-area .slogan {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.form-card h2 {
  font-size: 20px;
  margin-bottom: 24px;
  text-align: center;
}

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

input:focus {
  outline: none;
}

button {
  padding: 14px;
  background-color: #696964;
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

.erro {
  margin-top: 12px;
  font-size: 14px;
  color: #ff6b6b;
  text-align: center;
}

.voltar {
  display: block;
  margin-top: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
  text-decoration: none;
}

.voltar:hover {
  color: #ff9000;
}
</style>
