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

function ranker(head, rank) {
  if (head.left) ranker(head.left, rank)
  head.rank = rank
  if (head.right) ranker(head.right, rank + 1)
}

const treeTitles = [
  {title: 'Daily', category: 'allTime'},
  {title: 'Weekly', category: 'allTime'},
  {title: 'Monthly', category: 'allTime'},
  {title: 'All', category: 'allTime'},
  {title: 'All', category: 'rolling300'},
  {title: 'CTF', category: 'rolling300'},
  {title: 'Neutral', category: 'rolling300'}]

function formTreeBase(title) {

}

function buildTrees() {
  Account.findAll()
    .then(allAccounts => {
      const accountData = []
      treeTitles.forEach((title, i) => {
        let timeline
        if (i < 4) timeline = 'allTime'
        else timeline = 'rolling300'
        treesToBuild.forEach(tree => {
          let headValue
          if (tree.method) {
            headValue = tree.method(
              allAccounts[0][timeline][`${title} ${tree.firstArg}`],
              allAccounts[0][timeline][`${title} ${tree.secondArg}`],
              allAccounts[0][timeline][`${title} ${tree.thirdArg}`],
              allAccounts[0][timeline][`${title} ${tree.fourthArg}`]
            )
          }
          const headName = allAccounts[0].name
          const headId = allAccounts[0].id
          const head = statBST(headValue, headName, headId)
          if (!accountData[allAccounts[0].id]) accountData[allAccounts[0].id] = {name: headName, id: headId}
          if (!accountData[allAccounts[0].id][timeline]) accountData[allAccounts[0].id][timeline] = {}
          accountData[allAccounts[0].id][timeline][`${title} ${tree.name}`] = headValue
          let currentAccount = 1
          while (currentAccount < allAccounts.length) {
            let value
            if (tree.method) {
              value = tree.method(
                allAccounts[currentAccount][timeline][`${title} ${tree.firstArg}`],
                allAccounts[currentAccount][timeline][`${title} ${tree.secondArg}`],
                allAccounts[currentAccount][timeline][`${title} ${tree.thirdArg}`],
                allAccounts[currentAccount][timeline][`${title} ${tree.fourthArg}`]
              )
            } else {
              value = allAccounts[currentAccount][timeline][`${title} ${tree.name}`]
            }
            const {name, id} = allAccounts[currentAccount]
            insert(head, value, name, id)
            if (!accountData[allAccounts[currentAccount].id]) accountData[allAccounts[currentAccount].id] = {name, id}
            if (!accountData[allAccounts[currentAccount].id][timeline]) accountData[allAccounts[currentAccount].id][timeline] = {}
            accountData[allAccounts[currentAccount].id][timeline][`${title} ${tree.name}`] = value
            currentAccount++
          }
          ranker(head, 1)
          traverse(head, function(node) {
            accountData[node.id][timeline][`${title} ${tree.name}`] = node.rank
          })
          jsonfile.writeFile(path.resolve(__dirname, `../../public/data/${timeline}/${title}/${tree.name}.json`), head, function(err) {
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
