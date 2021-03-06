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

export const convertRatios = value => value.toFixed(4)

export const convertTime = value => {
  const hh = Math.floor(value / 3600) || '00'
  let mm = Math.floor((value - +hh * 3600) / 60) || '00'
  mm < 10 ? mm = `0${mm}` : mm
  let ss = Math.floor((value - +hh * 3600 - +mm * 60)) || '00'
  ss < 10 ? ss = `0${ss}` : ss
  return `${hh}:${mm}:${ss}`
}

export const convertPercents = (value, statName) => {
  if (statName === 'Win Percent') return `${(value * 100).toFixed(4)}%`
  else return `${(value * 100).toFixed(0)}%`
}
