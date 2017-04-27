const Account = require('APP/db').Accounts
const treesToBuild = require('./utils').treesToBuild

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

function buildTrees() {
  const accountTrees = []
  treesToBuild.forEach(tree => {

  })
}
