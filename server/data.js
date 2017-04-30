const router = require('express').Router()
const Data = require('APP/db').Data

router.get('/', function(req, res, next) {
  Data.findAll({
    where: req.query
  })
    .then(allData => res.json(allData))
    .catch(next)
})

module.exports = router
