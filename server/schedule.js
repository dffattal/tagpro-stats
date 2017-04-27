const schedule = require('node-schedule')
const axios = require('axios')
const cheerio = require('cheerio')
const Account = require('APP/db').Accounts
const transformData = require('./utils').transformData
const clearAllWhiteSpace = require('./utils').clearAllWhiteSpace
const clearOuterWhiteSpace = require('./utils').clearOuterWhiteSpace

const weeklyTimelineUpdateRule = new schedule.RecurrenceRule()
weeklyTimelineUpdateRule.minute = 55
weeklyTimelineUpdateRule.hour = 19
weeklyTimelineUpdateRule.dayOfWeek = 0

const hourlyStatsUpdateRule = new schedule.RecurrenceRule()
hourlyStatsUpdateRule.minute = 0

const fetchLeaderboardsAccountsRule = new schedule.RecurrenceRule()
fetchLeaderboardsAccountsRule.minute = 55
fetchLeaderboardsAccountsRule.hour = 19


const weeklyTimelineUpdate = schedule.scheduleJob(weeklyTimelineUpdateRule, function() {
  console.log('Updating all player timelines!')
  Account.findAll()
    .then(allAccounts => allAccounts.map(account => account.update({
      timeline: account.timeline.concat(account.getWeeklyStats())
    })))
    .catch(console.error)
})

const hourlyStatsUpdate = schedule.scheduleJob(hourlyStatsUpdateRule, function() {
  console.log('Updating all player stats!')
  Account.findAll()
    .then(allAccounts => allAccounts.map(account => {
      axios.get(account.url)
        .then(response => response.data)
        .then(data => {
          const newStats = fetchStats(data)
          account.update({
            allTime: newStats[0],
            rolling300: newStats[1],
            flairs: newStats[2],
            name: newStats[3]
          })
        })
    }))
})

const fetchLeaderboardsAccounts = schedule.scheduleJob(fetchLeaderboardsAccountsRule, function() {
  console.log('Fetching new accounts from Leaderboards pages!')
  axios.get('http://tagpro-radius.koalabeast.com/boards')
    .then(response => response.data)
    .then(data => {
      const $ = cheerio.load(data)
      fetchLeaderboards($)
    })
})

function fetchStats(data) {
  const $ = cheerio.load(data)
  return [fetchAllTime($), fetchRolling300($), fetchFlairs($), fetchName($), fetchDegrees($)]
}

function fetchAllTime($) {
  let dataArr = []
  $('#all-stats').find('td').each(function(index, elem) {
    dataArr.push(elem.firstChild.data)
  })
  dataArr = transformData(dataArr, 'all')
  return dataArr
}

function fetchRolling300($) {
  let dataArr = []
  $('#rolling').find('td').each(function(index, elem) {
    dataArr.push(elem.firstChild.data)
  })
  dataArr = transformData(dataArr, 'rolling')
  return dataArr
}

function fetchName($) {
  return clearOuterWhiteSpace($('.profile-name').text())
}

function fetchDegrees($) {
  return clearAllWhiteSpace($('.profile-detail').find('td')[5].children[0].data.slice(0, -1))
}

function fetchFlairs($) {
  const dataArr = []
  $('#owned-flair').find('.flair-header').each(function(index, elem) {
    const flairName = clearOuterWhiteSpace(elem.firstChild.data)
    if (flairName !== 'Remove Flair') dataArr.push({flairName})
  })
  $('#owned-flair').find('.flair-footer').each(function(index, elem) {
    let flairCount = clearAllWhiteSpace(elem.firstChild.next.firstChild.data)
    flairCount = +flairCount.split(':')[1] || 0
    if (index !== dataArr.length) dataArr[index].flairCount = flairCount
  })
  return dataArr
}

function fetchLeaderboards($) {
  const accountArr = []
  $('#daily').find('a').each(function(index, elem) {
    accountArr.push({
      name: clearOuterWhiteSpace(elem.lastChild.data),
      url: `http://tagpro-radius.koalabeast.com${elem.attribs.href}`
    })
  })
  accountArr.forEach(account => Account.findOrCreate({
    where: {
      url: account.url
    },
    defaults: {
      name: account.name
    }
  }))
}

module.exports = fetchStats
