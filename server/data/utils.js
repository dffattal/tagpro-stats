const simpleRatio = (numStat, denStat) => numStat / denStat || 0

const winRatio = (wins, games, saves, savePct) => wins / (games - ((saves / savePct * (1 - savePct)) || 0)) || 0

const timeRatio = (numStat, denTime) => numStat / denTime * 3600 || 0

const nonReturnTags = (tags, returns) => tags - returns

const flairTreesToBuild = [
  'TagPro Developer',
  'Community Contributor',
  'Moderator',
  'Map Tester',
  'Level 1 Donor',
  'Level 2 Donor',
  'Level 3 Donor',
  'Level 4 Donor',
  'Bitcoin Donor (Any Amount)',
  'Community Contest Winner',
  'Kongregate',
  'Monthly Leader Board Winner',
  'Weekly Leader Board Winner',
  'Daily Leader Board Winner',
  'Insane Win Rate',
  'Awesome Win Rate',
  'Good Win Rate',
  'Happy Birthday TagPro',
  'Lucky You',
  'How Foolish',
  'Hare Today, Goon Tomorrow',
  'UnfortunateSniper Hacks TagPro',
  'So Very Scary',
  'Daryl Would Be Proud',
  'Happy 2nd Birthday TagPro',
  'Tower 1-1 Complete',
  'Good and Lucky',
  'Clowning Around Gravity',
  'Racing For Eggs',
  'Racing For Carrots',
  'All balls are created equal!',
  'Easy as Pumpkin Pie',
  'DOOT DOOT',
  'Lighter Than a Duck',
  'Happy 3rd Birthday TagPro',
  'Tower 1-2 Complete',
  'Pup Drunk',
  'Participation Egg',
  'Valued Member Egg',
  'Bounty Hunter Egg',
  'Really, Another Pumpkin?',
  'MMM... Brains',
  'Backstabber',
  'Cheap Christmas Candy',
  'You Could Catch Me!',
  'Ho! Ho! Ho!',
  'Happy 4th Birthday TagPro',
  'Tower 1-3 Complete',
  `WOAH! It's real!`,
  'Pencil',
  'Bacon',
  'Baseball',
  'Moon',
  'Penguin',
  'Freezing',
  'Dolphin',
  'Alien',
  'Tomato',
  'Road Sign',
  'Peace',
  'Magma',
  'Flux Capacitor',
  'Microphone',
  'Boiling',
  'Dalmatians',
  'Yellow Lightning',
  'ABC',
  'Plane',
  'Love',
  'Pokemon',
  'Phi',
  'U Turn',
  'World',
  'Bones',
  'Boiling 2',
  'Blue Lightning',
  'Uranium',
  'Boxing',
  'Bowling',
  'Pi',
]

const treesToBuild = {
  'Win Percent': {
    method: winRatio,
    args: ['Wins', 'Games', 'Saves', 'Save Percent']
  },
  'Points': {
    method: false
  },
  'Points Per Game': {
    method: simpleRatio,
    args: ['Points', 'Games']
  },
  'Games': {
    method: false
  },
  'Games Per Hour': {
    method: timeRatio,
    args: ['Games', 'Time Played']
  },
  'Wins': {
    method: false
  },
  'Ties': {
    method: false
  },
  'Losses': {
    method: false
  },
  'Saves': {
    method: false
  },
  'Save Percent': {
    method: false
  },
  'Tags': {
    method: false
  },
  'Tags Per Game': {
    method: simpleRatio,
    args: ['Tags', 'Games']
  },
  'Tags Per Hour': {
    method: timeRatio,
    args: ['Tags', 'Time Played']
  },
  'Popped': {
    method: false
  },
  'Popped Per Game': {
    method: simpleRatio,
    args: ['Popped', 'Games']
  },
  'Popped Per Hour': {
    method: timeRatio,
    args: ['Popped', 'Time Played']
  },
  'Tags Per Pop': {
    method: simpleRatio,
    args: ['Tags', 'Popped']
  },
  'Grabs': {
    method: false
  },
  'Grabs Per Game': {
    method: simpleRatio,
    args: ['Grabs', 'Popped']
  },
  'Grabs Per Hour': {
    method: timeRatio,
    args: ['Grabs', 'Time Played']
  },
  'Captures': {
    method: false
  },
  'Captures Per Game': {
    method: simpleRatio,
    args: ['Captures', 'Games']
  },
  'Captures Per Hour': {
    method: timeRatio,
    args: ['Captures', 'Time Played']
  },
  'Captures Per Grab': {
    method: simpleRatio,
    args: ['Captures', 'Grabs']
  },
  'Hold': {
    method: false
  },
  'Hold Per Game': {
    method: simpleRatio,
    args: ['Hold', 'Games']
  },
  'Hold Per Grab': {
    method: simpleRatio,
    args: ['Hold', 'Grabs']
  },
  'Hold Per Hour': {
    method: timeRatio,
    args: ['Hold', 'Time Played']
  },
  'Hold Per Cap': {
    method: simpleRatio,
    args: ['Hold', 'Captures']
  },
  'Prevent': {
    method: false
  },
  'Prevent Per Game': {
    method: simpleRatio,
    args: ['Prevent', 'Games']
  },
  'Prevent Per Hour': {
    method: timeRatio,
    args: ['Prevent', 'Time Played']
  },
  'Returns': {
    method: false
  },
  'Returns Per Game': {
    method: simpleRatio,
    args: ['Returns', 'Games']
  },
  'Returns Per Hour': {
    method: timeRatio,
    args: ['Returns', 'Time Played']
  },
  'Support': {
    method: false
  },
  'Support Per Game': {
    method: simpleRatio,
    args: ['Support', 'Games']
  },
  'Support Per Hour': {
    method: timeRatio,
    args: ['Support', 'Time Played']
  },
  'Non-Return Tags': {
    method: nonReturnTags,
    args: ['Tags', 'Returns']
  },
  'Prevent Per Return': {
    method: simpleRatio,
    args: ['Prevent', 'Returns']
  },
  'Power-up Percent': {
    method: false
  },
  'Time Played': {
    method: false
  },
  'Disconnects': {
    method: false
  },
  'Disconnects Per Game': {
    method: simpleRatio,
    args: ['Disconnects', 'Games']
  }
}

module.exports = {
  treesToBuild,
  flairTreesToBuild
}
