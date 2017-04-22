const router = require('express').Router()
const Account = require('APP/db').Accounts

router.get('/', function(req, res, next) {
  Account.findAll()
  .then(allAccounts => res.json(allAccounts))
  .catch(next)
})

router.post('/', function(req, res, next) {
  Account.create(req.body)
  .then(createdAccount => res.json(createdAccount))
  .catch(next)
})

router.get('/:id', function(req, res, next) {
  Account.findById(req.params.id)
  .then(foundAccount => res.json(foundAccount))
  .catch(next)
})

router.put('/:id', function(req, res, next) {
  Account.update(req.body, { where: { id: req.params.id } })
})



module.exports = router
