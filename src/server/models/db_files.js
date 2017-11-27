const Sequelize = require('sequelize');
const pathLib = require('path');

const mysql = require('../middlewares/sequelize');

const schema = {
  filename: {
    type: Sequelize.STRING(32),
    allowNull: false
  },
  size: {
    type: Sequelize.INTEGER(32),
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    set: function (val) {
      this.setDataValue('url', pathLib.resolve(val));
    }
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