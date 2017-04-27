export const timeStats = [
  'Hold',
  'Prevent',
  'Support',
  'Time Played'
]

export const percentStats = [
  'Win Percent',
  'Save Percent',
  'Power-up Percent'
]

export const convertTime = value => {
  const hh = Math.floor(value / 3600) || '00'
  let mm = Math.floor((value - +hh * 3600) / 60) || '00'
  mm < 10 ? mm = `0${mm}` : mm
  let ss = Math.floor((value - +hh * 3600 - +mm * 60)) || '00'
  ss < 10 ? ss = `0${ss}` : ss
  return `${hh}:${mm}:${ss}`
}

export const convertPercents = value => `${value * 100}%`

export const calcWinPercent = (data, statNames) => {
  statNames.forEach(stat => {
    if (stat.indexOf('Win Percent') !== -1) {
      const timePeriod = stat.split(' ')[0]
      data[stat] = data[`${timePeriod} Wins`] /
      (
        data[`${timePeriod} Games`] -
        (
          data[`${timePeriod} Saves`] /
          data[`${timePeriod} Save Percent`]
        ) * (
        1 - data[`${timePeriod} Save Percent`]
        )
      )
    }
  })
}
