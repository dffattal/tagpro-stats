const Account = require('APP/db').Accounts
const treesToBuild = require('./utils').treesToBuild
const jsonfile = require('jsonfile')

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

function rank(head, rank) {
  if (head.left) rank(head.left, rank)
  head.rank = rank
  if (head.right) rank(head.right, rank + 1)
}

const treeTitles = ['Daily', 'Weekly', 'Monthly', 'All', 'All', 'CTF', 'Neutral']

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
          if (!accountData[0]) accountData[0] = {name: headName, id: headId}
          accountData[0][timeline][`${title} ${tree.name}`] = headValue
          let totalAccounts = 1
          while (totalAccounts < allAccounts.length) {
            let value
            if (tree.method) {
              value = tree.method(
                allAccounts[totalAccounts][timeline][`${title} ${tree.firstArg}`],
                allAccounts[totalAccounts][timeline][`${title} ${tree.secondArg}`],
                allAccounts[totalAccounts][timeline][`${title} ${tree.thirdArg}`],
                allAccounts[totalAccounts][timeline][`${title} ${tree.fourthArg}`]
              )
            } else {
              value = allAccounts[totalAccounts][timeline][`${title} ${tree.name}`]
            }
            const {name, id} = allAccounts[totalAccounts]
            insert(head, value, name, id)
            if (!accountData[totalAccounts]) accountData[totalAccounts] = {name, id}
            accountData[totalAccounts][timeline][`${title} ${tree.name}`] = value
            totalAccounts++
          }
          rank(head, 1)
          traverse(head, function(node) {
            accountData[node.id - 1][timeline][`${title} ${tree.name}`] = node.rank
          })
          jsonfile.writeFile(`/public/data/${timeline}/${title}/${tree.name}.json`, head)
        })
      })
      accountData.forEach(account => {
        jsonfile.writeFile(`/public/data/accounts/${account.id}.json`, account)
      })
    })
}

buildTrees()
