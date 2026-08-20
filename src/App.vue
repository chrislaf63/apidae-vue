<script setup>
import {ref, onMounted, onUnmounted} from "vue";

const hidden = ref(false)
let lastScrollY = 0

function handleScroll() {
  const current = window.scrollY
  hidden.value = current > lastScrollY
  lastScrollY = current
}

onMounted(() => window.addEventListener('scroll', handleScroll, {passive: true}))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

</script>

<template>
  <body>
  <header>
    <div id="header" :class="{ 'header-hidden': hidden }">
      <div class="container">
        <nav>
          <RouterLink to="/">Accueil Agenda</RouterLink>
          <div class="logo">
            <div class="img">
              <img src="@/assets/images/logo_ccpl.png" alt="Logo ComCom Plaine Limagne" height="100">
            </div>
          </div>
          <a href="https://www.plainelimagne.com/">Accueil Plaine Limagne</a>
        </nav>
      </div>
    </div>
  </header>

  <RouterView/>

  </body>
</template>

<style scoped>
#header {
  position: fixed;
  top: 0;
  width: 100%;
  transition: transform 0.3s ease;
  box-shadow: 0 5px rgb(232, 232, 232);
  z-index: 3;
}

#header.header-hidden {
  transform: translateY(-103%);
}

.container {
  display: flex;
  align-items: center;
  height: 150px;
  width: 100%;
  background-color: white;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
}

nav a {
  text-decoration: none;
  color: black;
  text-transform: uppercase;
  font-weight: bold;
}

.logo {
  display: flex;
  justify-content: center;
}

.img {
  width: 100px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid rgba(128, 128, 128, 0.4);
}

</style>
