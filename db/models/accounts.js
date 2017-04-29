const Sequelize = require('sequelize')

module.exports = db => db.define('accounts', {
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
  },
  data: {
    type: Sequelize.JSON
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
  }
})
