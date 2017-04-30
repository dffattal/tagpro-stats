const axios = require('axios')
const cheerio = require('cheerio')

axios.get('http://tagpro-radius.koalabeast.com/profile/52e582ca49164d6a2100044e')
  .then(response => response.data)
  .then(data => {
    const $ = cheerio.load(data)
    console.log($('.selected').find('.flair-header')[0].children[0].data)
  })
