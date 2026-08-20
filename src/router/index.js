import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import EventDetail from '../views/EventDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/event/:id', name: 'event-detail', component: EventDetail }
  ],
})

export default router
