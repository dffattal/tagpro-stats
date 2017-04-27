const simpleRatio = (numStat, denStat) => numStat / denStat

const winRatio = (wins, games, saves, savePct) => wins / (games - (saves / savePct * (1 - savePct)))

const timeRatio = (numStat, denTime) => numStat / denTime * 3600

const nonReturnTags = (tags, returns) => tags - returns

const treesToBuild = [
  {
    name: 'Win Percent',
    method: winRatio,
    firstArg: 'Wins',
    secondArg: 'Games',
    thirdArg: 'Saves',
    fourthArg: 'Save Percent'
  },
  {
    name: 'Points'
  },
  {
    name: 'Points Per Game',
    method: simpleRatio,
    firstArg: 'Points',
    secondArg: 'Games'
  },
  {
    name: 'Games'
  },
  {
    name: 'Games Per Hour',
    method: timeRatio,
    firstArg: 'Games',
    secondArg: 'Time Played'
  },
  {
    name: 'Wins'
  },
  {
    name: 'Ties'
  },
  {
    name: 'Losses'
  },
  {
    name: 'Saves'
  },
  {
    name: 'Save Percent'
  },
  {
    name: 'Tags'
  },
  {
    name: 'Tags Per Game',
    method: simpleRatio,
    firstArg: 'Tags',
    secondArg: 'Games'
  },
  {
    name: 'Tags Per Hour',
    method: timeRatio,
    firstArg: 'Tags',
    secondArg: 'Time Played'
  },
  {
    name: 'Pops'
  },
  {
    name: 'Pops Per Game',
    method: simpleRatio,
    firstArg: 'Pops',
    secondArg: 'Games'
  },
  {
    name: 'Pops Per Hour',
    method: timeRatio,
    firstArg: 'Pops',
    secondArg: 'Time Played'
  },
  {
    name: 'Tags Per Pop',
    method: simpleRatio,
    firstArg: 'Tags',
    secondArg: 'Pops'
  },
  {
    name: 'Grabs'
  },
  {
    name: 'Grabs Per Game',
    method: simpleRatio,
    firstArg: 'Grabs',
    secondArg: 'Pops'
  },
  {
    name: 'Grabs Per Hour',
    method: timeRatio,
    firstArg: 'Grabs',
    secondArg: 'Time Played'
  },
  {
    name: 'Captures'
  },
  {
    name: 'Captures Per Game',
    method: simpleRatio,
    firstArg: 'Captures',
    secondArg: 'Games'
  },
  {
    name: 'Captures Per Hour',
    method: timeRatio,
    firstArg: 'Captures',
    secondArg: 'Time Played'
  },
  {
    name: 'Captures Per Grab',
    method: simpleRatio,
    firstArg: 'Captures',
    secondArg: 'Grabs'
  },
  {
    name: 'Hold'
  },
  {
    name: 'Hold Per Game',
    method: simpleRatio,
    firstArg: 'Hold',
    secondArg: 'Games'
  },
  {
    name: 'Hold Per Grab',
    method: simpleRatio,
    firstArg: 'Hold',
    secondArg: 'Grabs'
  },
  {
    name: 'Hold Per Hour',
    method: timeRatio,
    firstArg: 'Hold',
    secondArg: 'Time Played'
  },
  {
    name: 'Hold Per Cap',
    method: simpleRatio,
    firstArg: 'Hold',
    secondArg: 'Captures'
  },
  {
    name: 'Prevent'
  },
  {
    name: 'Prevent Per Game',
    method: simpleRatio,
    firstArg: 'Prevent',
    secondArg: 'Games'
  },
  {
    name: 'Prevent Per Hour',
    method: timeRatio,
    firstArg: 'Prevent',
    secondArg: 'Time Played'
  },
  {
    name: 'Returns'
  },
  {
    name: 'Returns Per Game',
    method: simpleRatio,
    firstArg: 'Returns',
    secondArg: 'Games'
  },
  {
    name: 'Returns Per Hour',
    method: timeRatio,
    firstArg: 'Returns',
    secondArg: 'Time Played'
  },
  {
    name: 'Support'
  },
  {
    name: 'Support Per Game',
    method: simpleRatio,
    firstArg: 'Support',
    secondArg: 'Games'
  },
  {
    name: 'Support Per Hour',
    method: timeRatio,
    firstArg: 'Support',
    secondArg: 'Time Played'
  },
  {
    name: 'Non-Return Tags',
    method: nonReturnTags,
    firstArg: 'Tags',
    secondArg: 'Returns'
  },
  {
    name: 'Prevent Per Return',
    method: simpleRatio,
    firstArg: 'Prevent',
    secondArg: 'Returns'
  },
  {
    name: 'Power-up Percent'
  },
  {
    name: 'Time Played'
  },
  {
    name: 'Disconnects'
  },
  {
    name: 'Disconnects Per Game',
    method: simpleRatio,
    firstArg: 'Disconnects',
    secondArg: 'Games'
  }
]

module.exports = {
  treesToBuild
}
