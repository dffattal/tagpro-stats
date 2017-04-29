const Account = require('APP/db').Accounts
const treesToBuild = require('./utils').treesToBuild
const path = require('path')
const S3FS = require('s3fs')
const s3fs = new S3FS(
  'tagpro-stats',
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
)

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
  {name: 'Neutral', folder: 'rolling300', category: 'Rolling 300'},
  {name: 'Flairs', folder: 'flairs', category: 'Flairs'}]

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

          console.log('Attempting to write full-stat tree...')
          s3fs.writeFile(`/data/${folderName}/${titleName}/${tree.name}.json`, JSON.stringify(head), function(err) {
            if (err) console.error(err)
          })
        })
      })
      accountData.forEach(account => {
        console.log('Attempting to write account tree...')
        s3fs.writeFile(`/data/accounts/${account.id}.json`, JSON.stringify(account), function(err) {
          if (err) console.error(err)
        })
      })
    })
  console.log('Exiting function!')
}

buildTrees()
