const Account = require('APP/db').Accounts
const Data = require('APP/db').Data
const treesToBuild = require('./utils').treesToBuild
const flairTreesToBuild = require('./utils').flairTreesToBuild

function StatBST(val, name, id) {
  this.value = val
  this.name = name
  this.id = id
}

StatBST.prototype.insert = function(val, name, id) {
  if (val <= this.value) {
    if (this.left) return this.left.insert(val, name, id)
    this.left = new StatBST(val, name, id)
  } else {
    if (this.right) return this.right.insert(val, name, id)
    this.right = new StatBST(val, name, id)
  }
}

StatBST.prototype.min = function() {
  let currentNode = this
  while (currentNode.left) {
    currentNode = currentNode.left
  }
  return currentNode
}

StatBST.prototype.max = function() {
  let currentNode = this
  while (currentNode.right) {
    currentNode = currentNode.right
  }
  return currentNode
}

StatBST.prototype.traverse = function(iterator) {
  if (this.right) this.right.traverse(iterator)
  iterator(this)
  if (this.left) this.left.traverse(iterator)
}

const treeTitles = [
  {name: 'Daily', folder: 'allTime', category: 'All Time'},
  {name: 'Weekly', folder: 'allTime', category: 'All Time'},
  {name: 'Monthly', folder: 'allTime', category: 'All Time'},
  {name: 'All', folder: 'allTime', category: 'All Time'},
  {name: 'All', folder: 'rolling300', category: 'Rolling 300'},
  {name: 'CTF', folder: 'rolling300', category: 'Rolling 300'},
  {name: 'Neutral', folder: 'rolling300', category: 'Rolling 300'}
]

const getStatValue = (account, tree, folderName, titleName, fullStatName) => {
  let value
  if (tree.method) {
    const args = tree.args.map(arg => account[folderName][`${titleName} ${arg}`]) // pull data from account model if tree requires special method
    value = tree.method(...args)
  } else {
    value = account[folderName][fullStatName] // else pull data direct from account model
  }
  return value
}

function buildTrees() {
  Account.findAll()
    .then(allAccounts => { // fetch all accounts from db
      const accountData = [] // initialize individual player stat json structures
      const statData = {'All Time': {}, 'Rolling 300': {}}

      treeTitles.forEach((title, i) => {
        const folderName = title.folder // initialize folder name and model obj ('allTime' or 'rolling300')
        const timePeriod = title.category // initialize timePeriod ('All Time' or 'Rolling 300' )
        const titleName = title.name // initialize tab ('Daily', 'Weekly', etc.)
        statData[timePeriod][titleName] = {}

        const treeNamesToBuild = Object.keys(treesToBuild)

        treeNamesToBuild.forEach(tree => {
          const statName = tree
          const fullStatName = `${titleName} ${statName}`

          allAccounts.forEach(account => {
            const value = getStatValue(account, tree, folderName, titleName, fullStatName)
            const {name, id} = account
            if (!accountData[id]) {
              accountData[id] = {name, id}
            }
            if (!accountData[id][timePeriod]) {
              accountData[id][timePeriod] = {}
            }
            if (!accountData[id][timePeriod][titleName]) {
              accountData[id][timePeriod][titleName] = {}
            }
            accountData[id][timePeriod][titleName][statName] = {value}
            if (!statData[timePeriod][titleName][statName]) {
              statData[timePeriod][titleName][statName] = new StatBST(value, name, id)
            } else {
              statData[timePeriod][titleName][statName].insert(value, name, id)
            }
          })
          let rank = 1
          statData[timePeriod][titleName][statName].traverse(function(node) {
            node.rank = rank++
            accountData[node.id][timePeriod][titleName][statName].rank = node.rank
          })
          Data.findOrCreate({
            where: {
              category: timePeriod,
              name: statName
            },
            defaults: {
              category: timePeriod,
              name: statName
            }
          })
            .then(dataRow => {
              console.log('Attempting to write stat data table tree...')
              dataRow[0].update({
                data: statData[timePeriod][titleName]
              })
            })
            .catch(console.error)
        })
      })

      const flairData = {}

      allAccounts.forEach(account => {
        accountData[account.id].flairs = {}
        account.flairs.forEach(flair => {
          if (!flairData[flair.flairName]) {
            flairData[flair.flairName] = new StatBST(flair.flairCount, account.name, account.id)
          } else {
            flairData[flair.flairName].insert(flair.flairCount, account.name, account.id)
          }
          accountData[account.id].flairs[flair.flairName] = {value: flair.flairCount}
        })
        const totalFlairs = account.flairs.length
        if (!flairData['Total']) {
          flairData['Total'] = new StatBST(totalFlairs, account.name, account.id)
        } else {
          flairData['Total'].insert(totalFlairs, account.name, account.id)
        }
        accountData[account.id].flairs['Total'] = {value: account.flairs.length}
      })

      const flairTrees = Object.keys(flairData)
      flairTrees.forEach(flair => {
        let rank = 1
        flairData[flair].traverse(function(node) {
          node.rank = rank++
          accountData[node.id].flairs[flair].rank = node.rank
        })
        Data.findOrCreate({
          where: {
            category: 'Flairs',
            name: flair
          }
        })
          .then(dataRow => {
            console.log('Attempting to write flair data table tree...')
            dataRow[0].update({
              data: flairData[flair]
            })
          })
          .catch(console.error)
      })

      accountData.forEach(accountDataObj => {
        Account.findById(accountDataObj.id)
          .then(accountToUpdate => {
            console.log('Attempting to write player stat tree...')
            accountToUpdate.update({
              data: accountDataObj
            })
          })
          .catch(console.error)
      })
    })
    .catch(console.error)
}

buildTrees()
