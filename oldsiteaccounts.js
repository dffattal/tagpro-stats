const axios = require('axios')
const cheerio = require('cheerio')
const fetchStats = require('./server/schedule')

for (let i = 1; i < 117922; i++) {
  setTimeout(function() {
    console.log('Currently seeding account #', i)
    console.log('Attempting to get tagpro-stats profile page...')
    axios.get(`http://tagpro-stats.com/profile.php?userid=${i}`)
      .then(response => response.data)
      .then(data => {
        const $ = cheerio.load(data)
        if (+$('.stat')[3].children[0].data > 300) {
          const url = $('h3')[0].children[1].attribs.href
          console.log('Attempting to add account to database...')
          return axios.post('https://tagpro-stats.herokuapp.com/api/accounts/', {url})
        }
      })
      .catch(console.error)
  }, i * 1000)
}
