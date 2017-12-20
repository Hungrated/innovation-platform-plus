const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  class_id: {
    type: Sequelize.STRING,
    primaryKey: true,
    unique: true
  },
  year: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  term: {
    type: Sequelize.STRING(8),
    allowNull: false
  },
  cname: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  time: {
    type: Sequelize.STRING(64),
    allowNull: false
  },
  loc: {
    type: Sequelize.STRING(64),
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM,
    values: ['active', 'archived'],
    allowNull: false
  }
};

const options = {
  underscored: true
};

const Class = mysql.define('class', schema, options);

module.exports = Class;
