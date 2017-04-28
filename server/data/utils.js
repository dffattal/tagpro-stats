const simpleRatio = (numStat, denStat) => numStat / denStat || 0

const winRatio = (wins, games, saves, savePct) => wins / (games - (saves / savePct * (1 - savePct))) || 0

const timeRatio = (numStat, denTime) => numStat / denTime * 3600 || 0

const nonReturnTags = (tags, returns) => tags - returns

const treesToBuild = [
  {
    name: 'Win Percent',
    method: winRatio,
    args: ['Wins', 'Games', 'Saves', 'Save Percent']
  },
  {
    name: 'Points'
  },
  {
    name: 'Points Per Game',
    method: simpleRatio,
    args: ['Points', 'Games']
  },
  {
    name: 'Games'
  },
  {
    name: 'Games Per Hour',
    method: timeRatio,
    args: ['Games', 'Time Played']
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
    args: ['Tags', 'Games']
  },
  {
    name: 'Tags Per Hour',
    method: timeRatio,
    args: ['Tags', 'Time Played']
  },
  {
    name: 'Popped'
  },
  {
    name: 'Popped Per Game',
    method: simpleRatio,
    args: ['Popped', 'Games']
  },
  {
    name: 'Popped Per Hour',
    method: timeRatio,
    args: ['Popped', 'Time Played']
  },
  {
    name: 'Tags Per Pop',
    method: simpleRatio,
    args: ['Tags', 'Popped']
  },
  {
    name: 'Grabs'
  },
  {
    name: 'Grabs Per Game',
    method: simpleRatio,
    args: ['Grabs', 'Popped']
  },
  {
    name: 'Grabs Per Hour',
    method: timeRatio,
    args: ['Grabs', 'Time Played']
  },
  {
    name: 'Captures'
  },
  {
    name: 'Captures Per Game',
    method: simpleRatio,
    args: ['Captures', 'Games']
  },
  {
    name: 'Captures Per Hour',
    method: timeRatio,
    args: ['Captures', 'Time Played']
  },
  {
    name: 'Captures Per Grab',
    method: simpleRatio,
    args: ['Captures', 'Grabs']
  },
  {
    name: 'Hold'
  },
  {
    name: 'Hold Per Game',
    method: simpleRatio,
    args: ['Hold', 'Games']
  },
  {
    name: 'Hold Per Grab',
    method: simpleRatio,
    args: ['Hold', 'Grabs']
  },
  {
    name: 'Hold Per Hour',
    method: timeRatio,
    args: ['Hold', 'Time Played']
  },
  {
    name: 'Hold Per Cap',
    method: simpleRatio,
    args: ['Hold', 'Captures']
  },
  {
    name: 'Prevent'
  },
  {
    name: 'Prevent Per Game',
    method: simpleRatio,
    args: ['Prevent', 'Games']
  },
  {
    name: 'Prevent Per Hour',
    method: timeRatio,
    args: ['Prevent', 'Time Played']
  },
  {
    name: 'Returns'
  },
  {
    name: 'Returns Per Game',
    method: simpleRatio,
    args: ['Returns', 'Games']
  },
  {
    name: 'Returns Per Hour',
    method: timeRatio,
    args: ['Returns', 'Time Played']
  },
  {
    name: 'Support'
  },
  {
    name: 'Support Per Game',
    method: simpleRatio,
    args: ['Support', 'Games']
  },
  {
    name: 'Support Per Hour',
    method: timeRatio,
    args: ['Support', 'Time Played']
  },
  {
    name: 'Non-Return Tags',
    method: nonReturnTags,
    args: ['Tags', 'Returns']
  },
  {
    name: 'Prevent Per Return',
    method: simpleRatio,
    args: ['Prevent', 'Returns']
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
    args: ['Disconnects', 'Games']
  }
]

module.exports = {
  treesToBuild
}
