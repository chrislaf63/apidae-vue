<script setup>
import {computed, onMounted, ref, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {useApidaeStore} from '@/stores/apidae.js'
import {toYMD, formatPeriode} from '@/utils/date.js'
import {VueDatePicker} from '@vuepic/vue-datepicker'
import {fr} from 'date-fns/locale'
import '@vuepic/vue-datepicker/dist/main.css'
import '@/assets/style/datepicker.css'

import Card from "@/Components/Card.vue";

const rangeDate = ref(null)
const store = useApidaeStore()

// storeToRefs garde la réactivité quand on "déstructure" le state/getters.
// Les actions, elles, se prennent directement sur `store` (voir plus bas).
const {filtered, numFound, loading, error, fromCache, search, searchCommune, objets} =
    storeToRefs(store)

watch(rangeDate, (newVal) => {
  if (newVal && newVal[0] && newVal[1]) {
    store.from = toYMD(newVal[0])
    store.to = toYMD(newVal[1])
  } else if (newVal && newVal[0]) {
    store.from = toYMD(newVal[0])
    store.to = ''
  } else {
    store.from = ''
    store.to = ''
  }
})

onMounted(async () => {
  await store.fetchObjets()
})

// petit helper : la commune peut manquer selon les fiches
const commune = (o) => o.localisation?.adresse?.commune?.nom ?? '—'

// Computed : recalculé tout seul dès que `objets` est rempli par fetchObjets().
// Renvoie [{ nom : 'Ambert', count : 3 }, …] trié par nom.
const communes = computed(() => {
  const counted = objets.value.reduce((acc, o) => {
    const nom = o.localisation?.adresse?.commune?.nom
    if (!nom) return acc            // on ignore les fiches sans commune
    acc[nom] = (acc[nom] || 0) + 1
    return acc
  }, {})

  return Object.entries(counted)
      .map(([nom, count]) => ({nom, count}))
      .sort((a, b) => a.nom.localeCompare(b.nom))
})
const sendCommune = (com) => searchCommune.value = com
</script>

<template>
  <div class="hero">
    <div>
      <h1>Agenda des manifestations</h1>
    </div>
    <span id="credit">Image Rachel Coyne sur Unsplash</span>
  </div>
  <div class="wrap">

    <!-- Colonne de filtres : 3 v-model branchés sur le store -->

    <div class="controls">
      <div class="byDate">
        <p>DU ~ AU</p>
        <div class="datePicker">
          <VueDatePicker
              v-model="rangeDate"
              range
              multi-calendars
              :time-config="{ enableTimePicker: false }"
              :locale="fr"
              :formats="{ input: formatPeriode, preview: 'dd/MM/yyy' }"
              :action-row="{ selectBtnLabel: 'Choisir', cancelBtnLabel: 'Abandon'}"
              :min-date="new Date()"
              :config="{ monthChangeOnScroll: false }"
              placeholder="Choisir une période"
          />
        </div>
      </div>
      <hr/>
      <div class="byTown">
        <p>Par commune</p>
        <select v-model="searchCommune">
          <option value="" selected>Toutes ({{ numFound }})</option>
          <option v-for="c in communes"
                  :key="c.nom"
                  @click="sendCommune(c.nom)">{{ c.nom }} ({{ c.count }})
          </option>
        </select>
      </div>
      <hr/>
      <div class="byEventType">
        <p>Par type d'évènement</p>
        <input
            v-model="search"
            type="search"
            placeholder="Rechercher un nom…"
            aria-label="Rechercher un nom"
        />
      </div>
    </div>

    <!-- États : erreur, chargement, vide, données -->
    <p v-if="error" class="state error">Impossible de charger les données : {{ error }}</p>
    <p v-else-if="loading" class="state">Récupération des objets…</p>
    <p v-else-if="filtered.length === 0" class="state">
      Aucun objet ne correspond. Élargis la recherche ou change de type.
    </p>
    <div v-else class="events-containers">

      <!-- Affichage du nombre de résultats -->
      <header class="head">
        <div class="results">
          <h2>{{ filtered.length }} résultats</h2>
        </div>
        <button class="refresh__desktop" :disabled="loading" @click="store.fetchObjets(true)">
          {{ loading ? 'Chargement…' : 'Rafraîchir' }}
        </button>
        <button class="refresh__mobile" :disabled="loading" @click="store.fetchObjets(true)">
          <i class="fa-solid fa-arrow-rotate-right"></i>
        </button>
      </header>

      <!-- Affichage carte évènement -->
      <div class="card-container">

        <RouterLink
            :to="`/event/${o.id}`"
            class="card-link"
            v-for="o in filtered"
            :key="o.id"
        >
          <Card :objet="o"/>
        </RouterLink>

      </div>
      <p v-if="!loading && !error && fromCache" class="cache-note">
        Données servies depuis le cache du proxy PHP.
      </p>
    </div>

  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 500px;
  background-image: url("src/assets/images/concert-unsplash.jpg");
  background-size: cover;
  background-position: 40% 60%;
  margin-top: 150px;
}

#credit {
  position: absolute;
  bottom: 5px;
  right: 20px;
  color: #ffffff;
}

h1 {
  font-family: "Montserrat", sans-serif;
  background-color: rgba(255, 255, 255, 0.6);
  font-size: 3em;
  padding-inline: 15px;
  border-radius: 20px;
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
  margin-inline: 15px;
  border: 1px grey dotted;
}

h2 {
  margin: 0.15rem 0 0;
  font-size: 1.75rem;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.results {
  margin-left: 15px;
  margin-block: 20px;
}

.refresh__desktop, .refresh__mobile {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: border-color 0.15s;
  margin-right: 15px;
  margin-bottom: 20px;
}

.refresh__desktop:hover:not(:disabled) {
  border-color: var(--accent);
}

.refresh__mobile:hover:not(:disabled) {
  border-color: var(--accent);
}

.refresh__desktop:disabled {
  opacity: 0.6;
  cursor: default;
}

.refresh__mobile:disabled {
  opacity: 0.6;
  cursor: default;
}


.controls {
  width: 25%;
}

.controls input,
select {
  border: 1px solid var(--line);
  background: var(--surface);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
}

.datePicker {
  border: 1px solid var(--line);
  border-radius: 8px;
}

.controls input,
select {
  flex: 1 1 240px;
}

.byDate {
  border: 1px solid var(--ccpl-green-3);
  border-radius: 10px;
  padding-bottom: 15px;
  background-color: var(--ccpl-green-3);
  margin-bottom: 20px;
}

.byTown {
  margin-block: 20px;
  background-color: var(--ccpl-green-2);
  padding-top: 1px;
  padding-bottom: 15px;
  border-radius: 10px;
}

.byEventType {
  margin-block: 20px;
  background-color: var(--ccpl-turquoise);
  padding-top: 1px;
  padding-bottom: 15px;
  border-radius: 10px;
}

.byTown p,
.byEventType p {
  font-size: 1.2em;
}

.byTown input,
.byDate input,
.byEventType input,
.datePicker,
select {
  width: 90%;
  margin-left: 5%;
}

.controls p {
  font-family: "Chewy", sans-serif;
  text-align: center;
  margin-block: 10px;
  color: #ffffff;
}

.events-containers {
  width: 75%;
}

.state {
  color: var(--muted);
  padding: 2rem 0;
}

.state.error {
  color: #b3261e;
}

.cache-note {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--muted);
}

.card-container {
  display: flex;
  flex-wrap: wrap;

}

.card-link {
  display: block;
  text-decoration: none;
  width: 25%;
}

/* Responsive Design */
@media screen and (max-width: 1350px) {
  .card-link {
    display: block;
    text-decoration: none;
    width: 33%;
  }
}

@media screen and (max-width: 950px) {
  h1 {
    font-size: 2em
  }

  .card-link {
    display: block;
    text-decoration: none;
    width: 50%;
  }
}

@media screen and (max-width: 800px) {
  .hero {
    margin-top: 50px;
    height: 350px;
  }

  #credit {
    font-size: 0.8em;
  }
}

@media screen and (min-width: 660px) {
  .refresh__mobile {
    display: none
  }

  .refresh__desktop {
    display: inline-block;
  }
}

@media screen and (max-width: 660px) {
  .refresh__desktop {
    display: none;
  }

  .results h2 {
    font-size: 1.2em;
  }
}

@media screen and (max-width: 650px) {
  .controls {
    width: 50%;
  }

  .card-link {
    display: block;
    text-decoration: none;
    width: 100%;
  }
}

@media screen and (max-width: 465px) {
  h1 {
    font-size: 1.7em;
  }

  #credit {
    font-size: 0.7em;
  }

  .controls {
    width: 100%;
  }

  .events-containers {
    width: 100%;
  }

  .wrap {
    flex-direction: column;
  }
}

@media screen and (max-width: 400px) {
  h1 {
    font-size: 1.5em;
  }
}

@media screen and (max-width: 355px) {
  h1 {
    font-size: 1.3em;
  }
}

</style>