const express = require( 'express' );
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const volleyball = require('volleyball');
const cheerio = require('cheerio')
const axios = require('axios')
// const schedules = require('./schedule')
console.log('in /server/app.js', require('./schedule'))

const db = require('../models').db
const Account = require('../models').Account
const transformData = require('./utils').transformData
const clearWhiteSpace = require('./utils').clearWhiteSpace
const clearFlairWhiteSpace = require('./utils').clearFlairWhiteSpace

const url = 'http://tagpro-radius.koalabeast.com/profile/52e582ca49164d6a2100044e'

app.use(volleyball);

app.use(express.static(path.resolve(__dirname, '..', '/public')));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status = err.status || 500;
  res.render('error');
})

app.use('/api', require('./api/api'))

app.get('/test', function (req, res, next) {
  let dataArr = []
  let name = 'this should change'
  axios.get(url)
  .then(response => response.data)
  .then(data => {
    const $ = cheerio.load(data)
    $('#all-stats').find('td').each(function (index, elem) {
      dataArr.push(elem.firstChild.data)
    })
    dataArr = transformData(dataArr, 'all')
    name = clearWhiteSpace($('.profile-name').text())
    Account.findOrCreate({
      where: {
        url
      },
      defaults: {
        url,
        name,
        allTime: dataArr
      }
    })
    res.send('done!')
  })
  .catch(next)
})

app.get('/test2', function (req, res, next) {
  let dataArr = []
  axios.get(url)
  .then(response => response.data)
  .then(data => {
    const $ = cheerio.load(data)
    $('#rolling').find('td').each(function (index, elem) {
      dataArr.push(elem.firstChild.data)
    })
    dataArr = transformData(dataArr, 'rolling')
    return Account.findById(1)
  })
  .then(foundAccount => {
    foundAccount.update({
      rolling300: foundAccount.getWeeklyStats()
    })
  })
  .then(function () {
    res.send('done!')
  })
  .catch(next)
})

app.get('/flairtest', function (req, res, next) {
  let flairArr = []
  axios.get(url)
  .then(response => response.data)
  .then(data => {
    const $ = cheerio.load(data)
    $('#owned-flair').find('.flair-header').each(function (index, elem) {
      flairArr.push({flairName: clearFlairWhiteSpace(elem.firstChild.data)})
    })
    $('#owned-flair').find('.flair-footer').each(function (index, elem) {
      let flairCount = clearWhiteSpace(elem.firstChild.next.firstChild.data)
      flairCount = +flairCount.split(':')[1] || 0
      flairArr[index]['flairCount'] = flairCount
    })
    return Account.findById(1)
  })
  .then(foundAccount => {
    foundAccount.update({
      flairs: flairArr
    })
  })
  .catch(next)
  res.send('flairs!')
})

app.get('/account/:id', function (req, res, next) {
  Account.findById(req.params.id)
  .then(foundAccount => {
    res.json(foundAccount)
  })
  .catch(next)
})

app.get('/account/:id/newnametest', function (req, res, next) {
  Account.findById(req.params.id)
  .then(foundAccount => {
    foundAccount.update({name: 'new name'})
    res.sendStatus(204)
  })
  .catch(next)
})

app.get('/account/:id/previousnames', function (req, res, next) {
  Account.findById(req.params.id)
  .then(foundAccount => {
    console.log(foundAccount)
    res.json(foundAccount.previousNames)
  })
  .catch(next)
})

app.get('/*', function (req, res, next) {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'))
})

db.sync({force: true})
.then(function () {
  app.listen(1337, function () {
    console.log('App listening on port 1337')
  })
})
