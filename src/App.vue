<script setup>
import {ref, onMounted, onUnmounted} from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)


const hidden = ref(false)
let lastScrollY = 0
const menuMobile = ref(null)
const cross = ref(null)
const burger = ref(null)

function handleScroll() {
  const current = window.scrollY
  hidden.value = current > lastScrollY
  lastScrollY = current
}

const menuMobileToggler = () => {
  menuMobile.value.classList.toggle('menu__mobile-hidden')
  cross.value.classList.toggle('menu__mobile-hidden')
  burger.value.classList.toggle('menu__mobile-hidden')
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
    <div id="header__mobile">
      <div class="logo__mobile">
        <img src="@/assets/images/logo_ccpl.png" alt="Logo ComCom Plaine Limagne" height="50">
      </div>
      <div @click="menuMobileToggler" class="border__burger">
        <div ref="burger"><font-awesome-icon icon="fa-solid fa-bars"  class="burger"/></div>
        <div ref="cross" class="menu__mobile-hidden"><font-awesome-icon icon="fa-solid fa-xmark" class="closeCross" /></div>
      </div>
    </div>
    <div ref="menuMobile" class="menu__mobile menu__mobile-hidden">
      <RouterLink to="/"><div @click="menuMobileToggler" class="menu__mobile__part"><span>Accueil Agenda</span></div></RouterLink>
      <a href="https://www.plainelimagne.com/"><div class="menu__mobile__part"><span>Accueil Plaine Limagne</span></div></a>
    </div>
  </header>

  <RouterView/>

  </body>
</template>

<style scoped>
/* Header desktop */
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

/* Header mobile */
#header__mobile {
  position: fixed;
  top:0;
  left:0;
  right:0;
  z-index:3;
  display: flex;
  height: 90px;
  background-color: #FFFFFF;
  border-bottom: 1px black solid;
  border-radius: 0 0 50% 50% / 0 0 20px 20px;
  align-items: center;
  justify-content: space-between;
}

.logo__mobile {
  border: 1px solid grey;
  border-radius: 50%;
  padding-left: 3px;
  padding-right: 7px;
  padding-top: 5px;
  margin-bottom: 7px;
  margin-left: 15px;
}

.border__burger {
  border: 1px solid grey;
  border-radius: 7px;

  padding: 11px;
  margin-right: 15px;
  margin-bottom: 7px;
}

.border__burger:hover {
  cursor: pointer;
}

.burger, .closeCross {
  transform: scale(1.7, 1.7);
}

.menu__mobile {
  position: fixed;
  z-index:2;
  top: 85px;
  width:100%;
}

.menu__mobile__part {
  background-color: #FFFFFF;
  height: 50px;
  padding-left: 15px;
  border-bottom: 2px solid black;
}

.menu__mobile-hidden {
  display: none;
}

a .menu__mobile__part span {
  display: inline-block;
  text-decoration: none;
  margin-top: 15px;
}


/* Responsive design */
@media screen and (max-width: 800px) {
  #header {
    display:none
  }
}

@media screen and (min-width: 800px) {
  #header__mobile {
    display: none;
  }
}
</style>
