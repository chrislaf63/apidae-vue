import { format, isSameYear, isSameMonth, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

export const convertDate = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC"
    })
}

export const period = (dateDebut, dateFin) => dateFin !== dateDebut

export const convertDatePeriodDebut = (date) => {
    const newDatePeriod = new Date(date)
    return newDatePeriod.toLocaleDateString("fr-FR", {day: "numeric", month: "long", timeZone: "UTC"})
}

export const convertDatePeriodDebutWithYear = (date) => {
    const newDatePeriod = new Date(date)
    return newDatePeriod.toLocaleDateString("fr-FR", {day: "numeric", month: "long", year: "numeric", timeZone: "UTC"})
}
export const convertDatePeriodFin = (date) => {
    const newDatePeriod = new Date(date)
    return newDatePeriod.toLocaleDateString("fr-FR", {day: "numeric", month: "long", year: "numeric", timeZone: "UTC"})
}

export const convertDayDate = () => {
    const todayDate = new Date()
    return todayDate.toLocaleDateString("fr-FR", {day: "numeric", month: "long", year: "numeric", timeZone: "UTC"})
}

export const checkYear = (dateFin, tousLesAns) => {
    const todayDate = new Date()
    const thisYear = String(todayDate.getFullYear())
    const dateFinYear = dateFin.slice(0, 4)
    if (thisYear > dateFinYear && tousLesAns) {
        const newDateFin = dateFin.slice(4)
        return thisYear.concat(newDateFin)
    } else {
        return dateFin
    }
}

export const compareDate = (objet, dateDebut, dateFin, identifiantObjet) => {
    const id = Number(identifiantObjet)
    const today = new Date()
    const debut = new Date(dateDebut)
    const fin = new Date(dateFin)
    const days = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
    const day = days[today.getDay()].toLowerCase()
    const marketsId = [4925908, 4809324, 5492544]
    if (verifyMarketDay(id, day)) {
        return true
    } else return (!marketsId.includes(id)) && (!searchCloseDays(objet).includes(day)) && ((today.toDateString() === debut.toDateString() && today.toDateString() === fin.toDateString()) || (today >= debut && today <= fin));
}

export const verifyMarketDay = (id, day) => {
    return (day === "vendredi" && id === 4925908) || (day === "lundi" && id === 4809324) || (day === "mardi" && id === 5492544);
}

export const searchCloseDays = (open) => {
    const closedDays = []
    if (open.type === "OUVERTURE_SAUF") {
        for (const day of open.ouverturesJournalieres) {
            closedDays.push((day.jour).toLowerCase())
        }
    }
    return closedDays
}

export const toYMD = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export const formatPeriode = (dates) => {
    const [debut, fin] = dates
    let motifDebut = "EEEE d MMM yyyy"
    if (fin === null || isSameDay(fin, debut)) return `Le ${format(debut, motifDebut, {locale: fr})}`
    if (isSameYear(fin, debut)) motifDebut = 'EEEE d MMM'
    if (isSameMonth(fin, debut)) motifDebut = 'EEEE d'
    return `Du ${format(debut, motifDebut, { locale: fr })} au ${format(fin, 'EEEE d MMM yyyy', { locale: fr })}`
}

