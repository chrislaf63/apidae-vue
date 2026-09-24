<script setup>
import {convertDate, period, convertDatePeriodDebut, convertDatePeriodFin, checkYear} from '@/utils/date'

const props = defineProps({
  objet: {type: Object, required: true}
})

/** Déclaration de const dans lesquelles vont aller les propriétés d'objet,
 afin de faciliter la lecture du template */

const illustration = props.objet.illustrations[0].traductionFichiers[0].urlDiaporama
const dateDebut = props.objet.ouverture.periodesOuvertures[0].dateDebut
const dateFin = props.objet.ouverture.periodesOuvertures[0].dateFin
const commune = props.objet.localisation.adresse.commune.nom
const descriptifCourt = props.objet.presentation.descriptifCourt.libelleFr
const checkedDateFin = checkYear(dateFin, props.objet.ouverture.periodesOuvertures[0].tousLesAns)
</script>

<template>
  <div class="card">
    <div class="illustration">
      <img :src="`${illustration}`" alt="Illustration">
    </div>
    <div class="card-date">
      <p v-if="period(dateDebut, dateFin)"
         class="date">Du {{ convertDatePeriodDebut(dateDebut) }} au
        {{ convertDatePeriodFin(checkedDateFin) }}</p>
      <p v-else class="date">{{ convertDate(objet.prochaineDate) }}</p>
    </div>
    <div class="card__description">
      <div class="card__description-container">
        <h3>{{ objet.nom.libelleFr }}</h3>
        <p>{{ descriptifCourt }}</p>
      </div>
    </div>
    <div class="card__localisation">
      <p><i class="fa-solid fa-location-dot"></i><span>{{ commune }}</span></p>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  border-radius: 5px;
  height: 600px;
  margin: 15px;
  background-color: #FFFFFF;
  box-shadow: 5px 7px 10px rgba(159,159,169,0.5);
  transition: 0.3s;
}

.card:hover {
  box-shadow: 5px 7px 12px rgba(159,159,169,0.8)
}

.illustration {
  overflow: hidden;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.illustration img {
  width: 100%;
  height: 330px;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: height 0.4s, transform 0.5s;
}

.card:hover .illustration img {
  height: 295px;
  transform: scale(1.2, 1.2);
  z-index: 1;
}

.date::first-letter {
  text-transform: capitalize
}

.card-date {
  padding-block: 8px;
  border-top: 1px solid rgba(92,107,107,0.2)
}

.date {
  text-decoration: none;
  text-align: center;
  color: #5c6b6b;
}

.card__description {
  height: 195px;
  padding-inline: 15px;
  font-size: 0.9em;
  color: #5c6b6b;
  overflow: hidden;
  transition: 0.5s;
}

.card__description-container {
  padding-top: 10px;
  border-top: 1px solid #5c6b6b;
}

.card:hover .card__description {
  height: 230px;
  z-index: 1;
}

h3 {
  color: #17252a;
}

.card:hover .card__description h3 {
  animation: titleblur 0.4s ease-in;
}

.card__localisation {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-block: 5px;
  text-align: center;
  color: #17252a;
}

@keyframes titleblur {
  0% {
    opacity: 0.6;
    text-shadow: 0 5px 5px rgba(0, 0, 0, 0.6);
  }
  100% {
    opacity: 1;
    text-shadow: 0 5px 5px rgba(0, 0, 0, 0);
  }
}

/* Responsive design */
@media screen and (max-width: 450px) {
  .date {
    font-size: 0.8em;
  }

  h3,
  p {
    font-size: 0.95em;
  }
}
</style>