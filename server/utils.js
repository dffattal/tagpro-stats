// removes white space and new lines that come from tagpro profile page html
const clearOuterWhiteSpace = elem => {
  const elemText = elem.match(/\S/g)
  const startIndex = elem.indexOf(elemText[0])
  const endIndex = elem.lastIndexOf(elemText[elemText.length - 1])
  return elem.slice(startIndex, endIndex + 1)
}

// removes special hyphen '–' used when %s are n/a
const hyphensToZero = elem => {
  if (elem.toString() === '–') return '0%'
  else return elem
}

// convert hh:mm:ss time to seconds to allow for easier search sorting
const convertTime = elem => {
  if (elem.indexOf(':') !== -1) {
    const timeArr = elem.split(':')
    return +timeArr[0] * 3600 + +timeArr[1] * 60 + +timeArr[2]
  } else {
    return elem
  }
}

// replaces % signs with 'Percent' for easier db entry
const convertStatTitles = elem => {
  if (/[a-zA-Z]/.test(elem[0])) return elem.toString().replace('%', 'Percent')
  else return elem
}

// win% will be calculated on site to allow for more precise stats
const skipWinPercent = (elem, i, skipValue) => {
  if (elem === 'WinPercent') return i + skipValue + 1
  else return i
}

// tagpro profile page html has 2 hidden 'Powerups' rows, discarded because all-time powerup stats are not provided
const skipPowerups = (elem, i) => {
  if (elem === 'Powerups') return i + 8
  else return i
}

const skipStats = (elem, i, skipValue) => {
  i = skipWinPercent(elem, i, skipValue)
  i = skipPowerups(elem, i)
  return i
}

// builds data object for db
const dataArrToObj = (dataArr, period) => {
  const dataObj = {}
  const statLabel = period === 'all' ? ['Daily', 'Weekly', 'Monthly', 'All'] : ['All', 'CTF', 'Neutral']
  let statLabelIndex = 0
  for (var i = 0; i < dataArr.length; i++) {
    i = skipStats(dataArr[i], i, statLabel.length)
    if (/[a-zA-Z]/.test(dataArr[i][0])) {
      this.currentStat = dataArr[i]
      statLabelIndex = 0
    } else {
      dataObj[`${statLabel[statLabelIndex]} ${this.currentStat}`] =
      dataArr[i].indexOf('%') !== -1
      ? +dataArr[i].split('%')[0] / 100
      : +dataArr[i]
      statLabelIndex++
    }
  }
  return dataObj
}

const transformData = (dataArr, period) => {
  dataArr = dataArr.map(elem => {
    elem = clearOuterWhiteSpace(elem)
    elem = hyphensToZero(elem)
    elem = convertTime(elem)
    elem = convertStatTitles(elem)
    return elem
  })
  return dataArrToObj(dataArr, period)
}

module.exports = {transformData, clearOuterWhiteSpace}
