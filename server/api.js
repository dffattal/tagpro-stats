'use strict'
const axios = require('axios')
const cheerio = require('cheerio')
const buildTrees = require('./data/treebuilder').buildTrees

const api = module.exports = require('express').Router()

api
  .get('/heartbeat', (req, res) => res.send({ok: true}))
  .use('/accounts', require('./accounts'))
  .use('/data', require('./data'))
  .get('/seed', function(req, res, next) {
    const {start, end} = req.query
    for (let i = +start; i < +end; i++) {
      console.log('Currently seeding account #', i)
      console.log('Attempting to get tagpro-stats profile page...')
      axios.get(`http://tagpro-stats.com/profile.php?userid=${i}`)
        .then(response => response.data)
        .then(data => {
          const $ = cheerio.load(data)
          const url = $('h3')[0].children[1].attribs.href
          setTimeout(function() {
            console.log('Attempting to add account to database...')
            return axios.post('https://tagpro-stats.herokuapp.com/api/accounts/', {url})
          }, i*10)
        })
        .catch(console.error)
    }
    res.sendStatus(204)
  })
  .get('/build', function(req, res, next) {
    buildTrees()
    res.sendStatus(204)
  })

// No routes matched? 404.
api.use((req, res) => res.status(404).end())
