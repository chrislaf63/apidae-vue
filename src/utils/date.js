export const convertDate = (date) => {
    const newDate = new Date(date)
    return newDate.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long", year:"numeric", timeZone: "UTC"})
}

export const period = (dateDebut, dateFin) => dateFin !== dateDebut

export const convertDatePeriodDebut = (date) => {
    const newDatePeriod = new Date(date)
    return newDatePeriod.toLocaleDateString("fr-FR", {day: "numeric", month: "long", timeZone: "UTC"})
}

export const convertDatePeriodDebutWithYear = (date) => {
    const newDatePeriod = new Date(date)
    return newDatePeriod.toLocaleDateString("fr-FR", {day: "numeric", month: "long", year:"numeric", timeZone: "UTC"})
}
export const convertDatePeriodFin = (date) => {
    const newDatePeriod = new Date(date)
    return newDatePeriod.toLocaleDateString("fr-FR", {day: "numeric", month: "long", year:"numeric", timeZone: "UTC"})
}

export const convertDayDate = () => {
    const todayDate = new Date()
    return todayDate.toLocaleDateString("fr-FR", {day: "numeric", month: "long", year:"numeric", timeZone: "UTC"})
}

export const checkYear = (dateFin, tousLesAns) => {
    const todayDate = new Date()
    const thisYear = String(todayDate.getFullYear())
    const dateFinYear = dateFin.slice(0, 4)
    if (thisYear > dateFinYear && tousLesAns) {
        const newDateFin = dateFin.slice(4)
        const finalDateFin = thisYear.concat(newDateFin)
        return finalDateFin
    } else {
        return dateFin
    }
}

export const compareDate = (dateDebut, dateFin, identifiantObjet) => {
    const id = Number(identifiantObjet)
    const today = new Date()
    const debut = new Date(dateDebut)
    const fin = new Date (dateFin)
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    const day = days[today.getDay()]
    const marketsId = [4925908, 4809324, 5492544]
    if (verifyMarketDay(id, day)) {
        return true
    }
    else return (!marketsId.includes(id)) && ((today.toDateString() === debut.toDateString() && today.toDateString() === fin.toDateString()) || (today >= debut && today <= fin));
}

export const verifyMarketDay = (id, day) => {
    return ( day === "Vendredi" && id === 4925908 ) || (day === "Lundi" && id === 4809324 ) || ( day === "Mardi" && id === 5492544  );
}
