const Sequelize = require('sequelize')
const cheerio = require('cheerio')
const axios = require('axios')
const fetchStats = require('APP/server/schedule')
console.log('in /models/index.js', require('../server/schedule'))

const db = new Sequelize('postgres://localhost:5432/tagpro-stats', {
  logging: false
})

const Account = db.define('account', {
  name: {
    type: Sequelize.STRING
  },
  previousNames: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  allTime: {
    type: Sequelize.JSON
  },
  rolling300: {
    type: Sequelize.JSON
  },
  flairs: {
    type: Sequelize.ARRAY(Sequelize.JSON)
  },
  timeline: {
    type: Sequelize.ARRAY(Sequelize.JSON),
    defaultValue: []
  }
}, {
  hooks: {
    afterUpdate: function(account) {
      if (account.previousNames.indexOf(account.name) === -1) {
        account.previousNames.push(account.name)
        this.update({
          previousNames: account.previousNames
        }, {
          where: {
            id: account.id
          }
        })
      }
    },
    afterCreate: function(account) {
      axios.get(account.url)
        .then(response => response.data)
        .then(data => {
          const stats = fetchStats(data)
          this.update({
            previousNames: [account.name],
            allTime: stats[0],
            rolling300: stats[1],
            flairs: stats[2],
            name: stats[3]
          }, {
            where: {
              id: account.id
            }
          })
        })
    }
  },
  instanceMethods: {
    getWeeklyStats: function() {
      const weeklyDataObj = {}
      const statNames = Object.keys(this.allTime)
      for (let i = 0; i < statNames.length; i++) {
        if (statNames[i].slice(0, 6) === 'Weekly') {
          weeklyDataObj[statNames[i]] = this.allTime[statNames[i]]
        }
      }
      return weeklyDataObj
    }
  }
})

module.exports = {db, Account}
