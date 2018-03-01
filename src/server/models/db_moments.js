const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  moment_id: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  type: {
    type: Sequelize.ENUM,
    values: ['article', 'resource', 'planmod'],
    allowNull: false
  },
  desc: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  extras: {
    type: Sequelize.STRING
  },
  uid: {
    type: Sequelize.STRING(32),
    allowNull: false
  }
};

const options = {
  underscored: true
};

const Moment = mysql.define('moment', schema, options);

module.exports = Moment;
