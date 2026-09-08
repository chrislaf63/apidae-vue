<script setup>
import {onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useApidaeStore} from "@/stores/apidae.js";
import {computed} from 'vue'
import ContactBlock from "@/Components/ContactBlock.vue";
import EventMap from "@/Components/EventMap.vue";
import {convertDate, period, convertDatePeriodDebut, convertDatePeriodFin} from '@/utils/date'


const route = useRoute()
const store = useApidaeStore()
const objet = computed(() => store.getObjectById(route.params.id))

onMounted(() => {
  window.scrollTo(0, 0)
})

</script>

<template>
  <div class="event" v-if="objet">
    <div class="title__container">
      <div class="title__grid">
        <span
            v-if="period(objet.ouverture.periodesOuvertures[0].dateDebut, objet.ouverture.periodesOuvertures[0].dateFin)"
            class="date">Du {{ convertDatePeriodDebut(objet.ouverture.periodesOuvertures[0].dateDebut) }} au
          {{ convertDatePeriodFin(objet.ouverture.periodesOuvertures[0].dateFin) }}</span>
        <span v-else class="date">{{ convertDate(objet.prochaineDate) }}</span>
        <div class="title">
          <h1>{{ objet.nom?.libelleFr }}</h1>
        </div>
        <p v-if="objet.localisation.adresse.nomDuLieu">{{ objet.localisation.adresse.nomDuLieu }}</p>
        <p>
          <span v-if="objet.localisation.adresse.adresse1">{{ objet.localisation.adresse.adresse1 }}, </span>
          <span v-if="objet.localisation.adresse.adresse2">{{ objet.localisation.adresse.adresse2 }}&nbsp; </span>
          <span v-if="objet.localisation.adresse.codePostal"> {{ objet.localisation.adresse.codePostal }}&nbsp;</span>
          <span v-if="objet.localisation.adresse.commune.nom"> {{ objet.localisation.adresse.commune.nom }}</span></p>
      </div>
    </div>
    <div class="container__main">
      <div class="description__block">
        <div class="leftSide">
          <div class="description__text">
            <p>{{ objet.presentation?.descriptifCourt?.libelleFr }}</p>
            <p class="description__body">
              {{
                objet.presentation?.descriptifDetaille?.libelleFr ?? objet.presentation?.descriptifCourt?.libelleFr
              }}</p>
            <p class="description__body">{{ objet.prestations?.complementAccueil?.libelleFr }}</p>
          </div>
          <div v-if="objet.descriptionTarif?.tarifsEnClair?.libelleFr" class="blockTarifs">
            <h2>Tarifs</h2>
            <div class="tarifs">
              <p>{{ objet.descriptionTarif?.tarifsEnClair?.libelleFr }}</p>
            </div>
          </div>
          <div v-if="objet.ouverture?.periodeEnClair?.libelleFr" class="blockHoraires">
            <h2>Horaires d'ouverture</h2>
            <div class="horaires">
              <p>{{ objet.ouverture?.periodeEnClair?.libelleFr }}</p>
            </div>
          </div>
        </div>
        <aside>
          <div class="description__image">
            <img :src="`${objet.illustrations[0].traductionFichiers[0].urlDiaporama }`" alt="image d'illustration">
          </div>
          <ContactBlock class="contact"/>
        </aside>
      </div>
      <h2 id="localisation__title">Localisation</h2>
      <div class="localisation">
        <div class="lieu">
          <h3>{{ objet.nom?.libelleFr }}</h3>
          <p><i class="fa-solid fa-location-dot"></i><span>Lieu :</span></p>
          <p v-if="objet.localisation.adresse.nomDuLieu">{{ objet.localisation.adresse.nomDuLieu }}</p>
          <p>
            <span v-if="objet.localisation.adresse.adresse1">{{ objet.localisation.adresse.adresse1 }}, </span>
            <span v-if="objet.localisation.adresse.adresse2">{{ objet.localisation.adresse.adresse2 }}&nbsp; </span>
            <span v-if="objet.localisation.adresse.codePostal"> {{ objet.localisation.adresse.codePostal }}&nbsp;</span>
            <span v-if="objet.localisation.adresse.commune.nom"> {{ objet.localisation.adresse.commune.nom }}</span></p>
        </div>

        <EventMap
            :lon="objet.localisation?.geolocalisation?.geoJson?.coordinates[0]"
            :lat="objet.localisation?.geolocalisation?.geoJson?.coordinates[1]"
            :label="objet.nom?.libelleFr"
        />
      </div>
      <hr />

      <footer>
      <div class="apidae__desktop">
        <img src="../../src/assets/images/vign_apidae.jpeg" alt="Logo apidae" width="250px">
      </div>
        <div class="apidae__mobile">
          <img src="../../src/assets/images/vign_apidae.jpeg" alt="Logo apidae" width="150px">
        </div>
        <div class="apidae-text">
          <p>Mis à jour le
            <span v-if="objet.gestion.dateExportModification">{{ convertDate(objet.gestion?.dateExportModification) }}</span>
            <span v-else-if="objet.gestion.dateModification">{{ convertDate(objet.gestion?.dateModification) }}</span>
            <span v-else>{{ convertDate(objet.gestion?.dateCreation)}}</span>
          </p>
          <p>par {{ objet.gestion?.membreProprietaire?.nom }}</p>
          <p>Identifiant de l'offre: {{ objet.id }}</p>
        </div>
      </footer>
    </div>

    <!-- <div v-for="illustration in objet.illustrations" :key="illustration.identifiant">
    </div> -->

  </div>

  <div v-else>
    Evènement introuvable
  </div>

</template>

<style scoped>

.event {
  margin-top: 155px;
}

.title__container {
  background-color: #ffffff;
  line-height: 1;
}

.title__grid {
  max-width: 1200px;
  margin: auto;
  padding-top: 15px;
  padding-bottom: 5px;
}

.title__grid p {
  margin-block: 10px;
}

.title {
  display: flex;
  flex-shrink: 1;
  margin-block: 20px;
}

h1 {
  font-size: 3em;
  font-family: "Chewy", sans-serif;
}

.container__main {
  max-width: 1200px;
  margin: auto;
}

.localisation {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  align-items: center;
  border-radius: 15px;
  margin-inline: 12px;
  margin-bottom: 50px;
}

.lieu {
  padding-left: 100px;
  align-self: flex-start;
}

.description__block {
  display: flex;
  justify-content: space-around;
  margin-block: 30px;
}

.leftSide {
  width: 65%;
}

.leftSide h2 {
  font-family: "Chewy", sans-serif;
  font-size: 1.8em;
  margin-left: 25px;
  margin-top: 20px;
}

h2 {
  font-family: "Chewy", sans-serif;
  font-size: 1.8em;
  margin-left: 35px;
  margin-bottom: 5px;
}

h3 {
  font-family: "Chewy", sans-serif;
  font-size: 2em;
  margin-block: 20px;
}

.description__image {
  height: auto;
  border-radius: 15px;
  overflow: hidden;
}

.description__image img {
  object-fit: cover;
  height: auto;
  width: 100%;
}

.description__text {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 25px;
  align-self: flex-start;
}

.description__text p:nth-child(1) {
  font-weight: bold;
  padding-bottom: 25px;
}

.description__body,
.description__text,
.leftSide {
  white-space: pre-line;
}

.tarifs,
.horaires {
  border-radius: 15px;
  padding: 25px;
  background-color: #ffffff;
}

aside {
  width: 370px;
}

footer {
  margin-block: 25px;
  display: flex;
}

.apidae-text {
  margin-left: 15px;
  font-size: 0.8em;
  font-style: italic;
}

/* Responsive design */
@media screen and (max-width: 1225px) {
  .title__container {
  text-align: center;
  }
  .title {
    justify-content: center;
  }
}

@media screen and (max-width: 800px) {
  .event {
    margin-top: 90px;
  }

  .description__block {
    flex-direction: column-reverse;
    align-items: center;
  }

  aside,
  .leftSide {
    width: 90%;
  }

  #localisation__title {
    margin-left: 55px;
  }

  .localisation {
    margin-inline: 0;
    margin: auto;
    width: 90%;
  }

  .lieu {
    padding-left: 55px;
  }

}

@media screen and (max-width: 600px) {
  .lieu {
  padding-left: 45px;
  }

  h3 {
    font-size: 1.7em;
  }

  footer {
    justify-content: space-around;
    margin-block: 10px;
  }

  .apidae__desktop {
    display: none;
  }

  .apidae-text {
    font-size: 0.6em;
  }
}

@media screen and (min-width: 600px) {
  .apidae__mobile {
    display: none;
  }
}

@media screen and (max-width: 400px) {
  .lieu {
    padding-left: 30px;
  }
}
</style>