const Sequelize = require('sequelize')

module.exports = db => db.define('data', {
  category: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  data: {
    type: Sequelize.JSON
  }
})
