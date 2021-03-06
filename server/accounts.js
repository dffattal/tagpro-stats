const router = require('express').Router()
const axios = require('axios')
const Account = require('APP/db').Accounts
const fetchStats = require('./schedule')

router.get('/', function(req, res, next) {
  let options = {}
  if (req.query && req.query.name) {
    options = {
      where: {
        name: {
          $iLike: req.query.name
        }
      },
      order: [['name', 'ASC']]
    }
  }
  Account.findAll(options)
    .then(allAccounts => res.json(allAccounts))
    .catch(next)
})

router.post('/', function(req, res, next) {
  const urlCheck = req.body.url && req.body.url.split('/')
  const profileId = urlCheck[urlCheck.length - 1]
  Account.findOne({
    where: {
      url: {
        $iLike: `%${profileId}%`
      }
    }
  })
    .then(foundAccount => {
      if (foundAccount) return res.status(200).send(foundAccount)
      else return axios.get(req.body.url)
    })
    .then(response => response.data)
    .then(data => {
      const stats = fetchStats(data)
      return Account.create({
        url: req.body.url,
        allTime: stats[0],
        rolling300: stats[1],
        flairs: stats[2],
        name: stats[3],
        previousNames: [stats[3]],
        degrees: stats[4],
        selectedFlair: stats[5]
      })
    })
    .then(createdAccount => res.status(201).json(createdAccount))
    .catch(next)
})

router.get('/:id', function(req, res, next) {
  Account.findById(req.params.id)
    .then(foundAccount => {
      if (foundAccount) return res.status(200).json(foundAccount)
      else return res.sendStatus(404)
    })
    .catch(next)
})

router.put('/:id', function(req, res, next) {
  Account.findById(req.params.id)
    .then(foundAccount => foundAccount.update(req.body))
    .then(updatedAccount => {
      if (updatedAccount) return res.sendStatus(200)
      else return res.sendStatus(404)
    })
    .catch(next)
})

module.exports = router
