const Account = require('APP/db').Accounts
const treesToBuild = require('./utils').treesToBuild
const jsonfile = require('jsonfile')
const path = require('path')

function statBST(val, name, id) {
  return {
    value: val,
    name: name,
    id: id
  }
}

function insert(head, val, name, id) {
  if (val < head.value) {
    if (head.left) insert(head.left, val, name, id)
    else head.left = statBST(val, name, id)
  } else {
    if (head.right) insert(head.right, val, name, id)
    else head.left = statBST(val, name, id)
  }
}

function min(head) {
  let minNode = head
  while (minNode.left) {
    minNode = minNode.left
  }
  return minNode.value
}

function max(head) {
  let maxNode = head
  while (maxNode.right) {
    maxNode = maxNode.right
  }
  return maxNode.value
}

function traverse(head, iterator) {
  if (head.left) traverse(head.left, iterator)
  iterator(head)
  if (head.right) traverse(head.right, iterator)
}

const treeTitles = [
  {title: 'Daily', folder: 'allTime', category: 'All Time'},
  {title: 'Weekly', folder: 'allTime', category: 'All Time'},
  {title: 'Monthly', folder: 'allTime', category: 'All Time'},
  {title: 'All', folder: 'allTime', category: 'All Time'},
  {title: 'All', folder: 'rolling300', category: 'Rolling 300'},
  {title: 'CTF', folder: 'rolling300', category: 'Rolling 300'},
  {title: 'Neutral', folder: 'rolling300', category: 'Rolling 300'}]

const getStatValue = (account, tree, folderName, timePeriod) => {
  let value
  if (tree.method) {
    const args = tree.args.map(arg => account[folderName][`${timePeriod} ${tree.name}`]) // pull data from account model if tree requires special method
    value = tree.method(...args)
  } else {
    value = account[folderName][`${timePeriod} ${tree.name}`] // else pull data direct from account model
  }
  return value
}

const findOrCreateAccountDataObj = (accountData, id, name, timePeriod) => {
  if (!accountData[id]) {
    accountData[id] = {name, id} // initialize accountData obj if doesnt exist
  }
  if (!accountData[id][timePeriod]) {
    accountData[id][timePeriod] = {} // initialize timePeriod obj if doesnt exist
  }
  return accountData[id]
}

function buildTrees() {
  Account.findAll()
    .then(allAccounts => { // fetch all accounts from db
      const accountData = [] // initialize individual player stat json structures

      treeTitles.forEach((title, i) => {
        const folderName = title.folder // initialize folder name and model obj ('allTime' or 'rolling300')
        const timePeriod = title.category // initialize timePeriod ('All Time' or 'Rolling 300' )

        treesToBuild.forEach(tree => {
          const statName = `${title} ${tree.name}`

          const headValue = getStatValue(allAccounts[0], tree, folderName, timePeriod)
          const headName = allAccounts[0].name
          const headId = allAccounts[0].id
          const head = statBST(headValue, headName, headId)

          const headAccountData = findOrCreateAccountDataObj(accountData, headId, headName, timePeriod)
          headAccountData[timePeriod][statName] = headValue

          let currentIndex = 1
          let currentAccountData
          while (currentIndex < allAccounts.length) {
            const currentAccount = allAccounts[currentIndex]
            const currentValue = getStatValue(currentAccount, tree, folderName, timePeriod)
            const {currentName, currentId} = currentAccount
            insert(head, currentValue, currentName, currentId)

            currentAccountData = findOrCreateAccountDataObj(accountData, currentId, currentName, timePeriod)
            currentAccountData[timePeriod][statName] = currentValue
            currentIndex++
          }
          let rank = 1
          traverse(head, function(node) {
            node.rank = rank++
            currentAccountData[timePeriod][statName].rank = node.rank
          })
          jsonfile.writeFile(path.resolve(__dirname, `../../public/data/${folderName}/${title}/${tree.name}.json`), head, function(err) {
            console.error(err)
          })
        })
      })
      accountData.forEach(account => {
        jsonfile.writeFile(path.resolve(__dirname, `../../public/data/accounts/${account.id}.json`), account, function(err) {
          console.error(err)
        })
      })
    })
}

buildTrees()
