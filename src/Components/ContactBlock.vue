<script setup>
import {computed} from "vue";
import {useRoute} from 'vue-router'
import {useApidaeStore} from "@/stores/apidae.js";
import {
  compareDate,
  checkYear
} from "@/utils/date.js";

const route = useRoute()
const store = useApidaeStore()
const objet = computed(() => store.getObjectById(route.params.id))
const phones = computed(() => byType(201))
const emails = computed(() => byType(204))
const websites = computed(() => byType(205))

const byType = (id) => objet.value?.informations?.moyensCommunication?.filter(m => m.type.id === id) ?? []
const toggle = () => document.querySelector(".contact__phone__list").classList.toggle("hidden")
</script>

<template>
  <aside>

    <p v-for="n in objet.ouverture?.periodesOuvertures" class="isToday"><span v-if="compareDate(n.dateDebut, checkYear(n.dateFin, n.tousLesAns), objet.id)">Se déroule aujourd'hui</span></p>
    <h3>Contacts</h3>
    <div v-if="phones.length > 0"
         class="phone__block">

      <div class="one__phone" v-if="phones.length === 1">
        <a :href="`tel:${phones[0].coordonnees.fr}`">
          <div class="link__wrapper">
            <i class="fa-solid fa-phone"></i>&nbsp&nbsp&nbsp&nbsp&nbsp{{ phones[0].coordonnees.fr }}
          </div>
        </a>
      </div>

      <div v-else-if="phones.length > 1" class="togglable">
        <button class="phone__button" @click="toggle"><i class="fa-solid fa-phone"></i>&nbsp&nbsp&nbsp Téléphoner
        </button>
        <ul class="contact__phone__list hidden">
          <li v-for="phone in phones" :key="phone.identifiant">
            <div>
              <p class="phone__coordonnees"><a :href="`tel:${phone.coordonnees.fr}`">Appeller le numéro
                {{ phone.coordonnees.fr }}</a></p>
              <p class="phone__observation" v-if="phone.observation">{{ phone.observation?.libelleFr }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="emails.length > 0"
         class="email__block">
      <ul class="contact__block">
        <li v-for="mail in emails" :key="mail.identifiant">
          <div class="email">
            <a :href="`mailto:${mail.coordonnees.fr}`">
              <div class="link__wrapper">
                <i class="fa-regular fa-envelope"></i>&nbsp&nbsp&nbsp&nbsp{{ mail.coordonnees.fr }}
              </div>
            </a>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="websites.length > 0"
         class="website__block">
      <p><i class="fa-solid fa-earth-europe"></i>&nbsp&nbsp&nbspSite<span v-if="websites > 1">s</span> web</p>
      <ul class="contact__block">
        <li v-for="website in websites" :key="website.identifiant">
          <div class="websites">
            <a :href="`${website.coordonnees.fr}`" target="_blank">
              <div class="link__wrapper">
                {{ website.coordonnees.fr }}
              </div>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
aside {
  position: relative;
  border: 1px solid grey;
  padding-inline: 20px;
  padding-bottom: 20px;
  background-color: #ffffff;
}

h3 {
  text-align: center;
}

a {
  text-decoration: none;
}

.isToday {
  text-align: center;
  margin-block: 20px;
  font-size: 1.3em;
  color: var(--ccpl-green-2)
}

.one__phone,
.email,
.websites {
  margin: auto;
  text-align: center;
  background-color: var(--ccpl-green-1);
  transition: 0.3s;
  border-radius: 5px;
}

.link__wrapper {
  height: 100%;
  padding-block: 15px;
  color: #17252a;
  font-weight: bold;
  overflow: hidden;
}

.phone__button {
  border: none;
  background-color: var(--ccpl-green-1);
  transition: 0.3s;
  font-weight: bold;
  padding-block: 15px;
  border-radius: 5px;
}

.phone__button:hover,
.one__phone:hover,
.email:hover {
  background-color: rgba(63, 165, 53, 0.7);
}

.email__block {
  margin-top: 40px;
}

.contact__block {
  padding: 0;
}

.contact__block, .contact__phone__list {
  list-style: none;
}

.contact__phone__list {
  position: absolute;
  background-color: white;
  border: 1px solid darkgrey;
  border-radius: 5px;
  box-shadow: 3px 3px 3px darkgrey;
}

.phone__coordonnees a {
  color: #17252a;
  font-weight: bold;
}

.phone__coordonnees:hover {
  text-decoration: underline;
}

.phone__observation {
  text-align: center;
  font-style: italic;
}

.hidden {
  display: none;
}

.togglable {
  margin: auto;
}

.togglable button {
  width: 100%;
}

.togglable ul {
  width: 90%;
}

.togglable p {
  margin-block: 5px;
}

.togglable ul li div {
  margin-block: 10px;
}

.website__block > p {
  text-align: center;
}
</style>