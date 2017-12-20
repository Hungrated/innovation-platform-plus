const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  rec_id: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  date: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
};

const options = {
  underscored: true
};

const Meeting = mysql.define('meeting', schema, options);

module.exports = Meeting;
