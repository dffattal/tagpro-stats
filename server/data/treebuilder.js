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

const getStatValue = (account, tree, folderName, titleName, statName) => {
  let value
  if (tree.method) {
    const args = tree.args.map(arg => account[folderName][`${titleName} ${arg}`]) // pull data from account model if tree requires special method
    value = tree.method(...args)
  } else {
    value = account[folderName][statName] // else pull data direct from account model
  }
  return value
}

const initiateAccountDataObj = (accountData, id, name, timePeriod, titleName) => {
  if (!accountData[id]) accountData[id] = {name, id} // initialize accountData obj if doesnt exist
  if (!accountData[id][timePeriod]) accountData[id][timePeriod] = {} // initialize timePeriod obj if doesnt exist
  if (!accountData[id][timePeriod][titleName]) accountData[id][timePeriod][titleName] = {}
  return accountData
}

function buildTrees() {
  Account.findAll()
    .then(allAccounts => { // fetch all accounts from db
      const accountData = [] // initialize individual player stat json structures

      treeTitles.forEach((title, i) => {
        const folderName = title.folder // initialize folder name and model obj ('allTime' or 'rolling300')
        const timePeriod = title.category // initialize timePeriod ('All Time' or 'Rolling 300' )
        const titleName = title.name

        treesToBuild.forEach(tree => {
          const headAccount = allAccounts[0]
          const statName = `${titleName} ${tree.name}`

          const headValue = getStatValue(headAccount, tree, folderName, titleName, statName)
          const headName = headAccount.name
          const headId = headAccount.id
          const head = new StatBST(headValue, headName, headId)

          initiateAccountDataObj(accountData, headId, headName, timePeriod, titleName)
          accountData[headId][timePeriod][titleName][tree.name] = {value: headValue}

          let currentIndex = 1
          while (currentIndex < allAccounts.length) {
            const currentAccount = allAccounts[currentIndex]
            const currentValue = getStatValue(currentAccount, tree, folderName, titleName, statName)
            const {name: currentName, id: currentId} = currentAccount
            head.insert(currentValue, currentName, currentId)

            initiateAccountDataObj(accountData, currentId, currentName, timePeriod, titleName)
            accountData[currentId][timePeriod][titleName][tree.name] = {value: currentValue}
            currentIndex++
          }

          let rank = 1
          head.traverse(function(node) {
            node.rank = rank++
            accountData[node.id][timePeriod][titleName][tree.name].rank = node.rank
          })

          Data.findOrCreate({
            where: {
              category: timePeriod,
              name: tree.name
            }
          })
            .then(dataRow => {
              console.log('Attempting to write stat data table tree...')
              dataRow[0].update({
                data: head
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
