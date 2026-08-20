import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store Apidae — porte les objets touristiques du projet et l'état de l'UI.
 *
 * On utilise la "setup syntax" de Pinia (une fonction qui renvoie ce qu'on
 * expose) : ref() = state, computed() = getters, fonctions = actions.
 * C'est la même logique que le <script setup> d'un composant, ce qui rend
 * le passage composant <-> store très naturel.
 */
export const useApidaeStore = defineStore('apidae', () => {
  // --- state ---------------------------------------------------------------
  const objets = ref([])        // liste brute renvoyée par le back-end
  const numFound = ref(0)       // total annoncé par Apidae
  const loading = ref(false)
  const error = ref(null)
  const fromCache = ref(false)  // true si le PHP a servi son cache

  // filtres pilotés par l'UI (v-model dessus dans le composant)
  const search = ref('')
  const searchCommune = ref('')
  const from = ref('')
  const to = ref('')

  // --- actions -------------------------------------------------------------
  async function fetchObjets(refresh = false) {
    loading.value = true
    error.value = null
    try {
      const url = '/api?format=json' + (refresh ? '&refresh=1' : '')
      const res = await fetch(url)
      if (!res.ok) {
        // le proxy PHP renvoie le message d'erreur Apidae en texte brut
        throw new Error(await res.text() || `HTTP ${res.status}`)
      }
      const data = await res.json()
      objets.value = data.objets ?? []
      numFound.value = data.numFound ?? 0
      fromCache.value = data._fromCache ?? false
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const getObjectById = computed(() => {
    return (id) => objets.value.find((o) => String(o.id) === String(id))
  })

  // Liste filtrée : se recalcule automatiquement dès que search,
  // ou objets changent. C'est ça, la réactivité.
  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return objets.value.filter((o) => {
      const nom = (o.nom?.libelleFr ?? '').toLowerCase()
      const okSearch = q === '' || nom.includes(q)
      const b = from.value
      const e = to.value
      const hasDate = !!o.prochaineDate
      const okFrom = b === '' || (hasDate && o.prochaineDate >= b)
      const okTo = e === '' || (hasDate && o.prochaineDate <= e)
      const dateSearch = okFrom && okTo
      const c = searchCommune.value.trim().toLowerCase()
      const nomCommune = (o.localisation?.adresse?.commune?.nom ?? '').toLowerCase()
      const OkCommune = c === '' || nomCommune.includes(c)
      return okSearch && dateSearch && OkCommune
    })
  })

  return {
    objets, numFound, loading, error, fromCache, from, to, searchCommune,
    search, fetchObjets, getObjectById, filtered
  }
})
