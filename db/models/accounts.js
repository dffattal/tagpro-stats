const Sequelize = require('sequelize')
const cheerio = require('cheerio')
const axios = require('axios')

const db = new Sequelize('postgres://localhost:5432/tagpro-stats', {
  logging: false
})

const Account = db => db.define('accounts', {
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
  degrees: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  allTime: {
    type: Sequelize.JSON,
    allowNull: false
  },
  rolling300: {
    type: Sequelize.JSON,
    allowNull: false
  },
  flairs: {
    type: Sequelize.ARRAY(Sequelize.JSON),
    allowNull: false
  },
  timeline: {
    type: Sequelize.ARRAY(Sequelize.JSON),
    defaultValue: []
  }
}, {
  hooks: {
    afterUpdate: function(account) {
      if (account.previousNames.indexOf(account.name) === -1) {
        const newNames = account.previousNames.concat([account.name])
        this.update({
          previousNames: newNames
        }, {
          where: {
            id: account.id
          }
        })
      }
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

module.exports = Account
