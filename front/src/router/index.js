import { createRouter, createWebHistory } from 'vue-router';
import HomeLayout from '../views/Home.vue'; 
import Agendamentos from '../views/Agendamentos.vue';
import Relatorios from '../views/Relatorios.vue';
import Login from '../views/Login.vue';
import Inicial from '../views/Inicial.vue';
import Registro from '../views/Registro.vue';
import Assinatura from '../views/Assinatura.vue';
import painel from '../views/Painel.vue';

const routes = [
  {
    path: '/',
    component: HomeLayout,
    meta: { requiresAuth: true }, // exige login
    children: [
      { path: '', redirect: '/Login' },
      { path: 'agendamentos', component: Agendamentos, meta: { requiresAuth: true } },
      { path: 'relatorios', component: Relatorios, meta: { requiresAuth: true } },
      { path: 'inicial', component: Inicial, meta: { requiresAuth: true } },
      { path: 'assinatura', component: Assinatura, meta:{requiresAuth:true} }
    ]
  },
  { path: '/login', component: Login },
  { path: '/registro', component: Registro },
  { path: '/painel', component: painel}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Proteção de rota
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.meta?.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
