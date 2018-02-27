const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  file_id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
    unique: true
  },
  group: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  labels: {
    type: Sequelize.STRING
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER(32),
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(128)
  }
};

const options = {
  underscored: true
};

const File = mysql.define('file', schema, options);

module.exports = File;
