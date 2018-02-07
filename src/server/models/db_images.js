const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  image_id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
    unique: true
  },
  src: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

const options = {
  underscored: true
};

const Image = mysql.define('images', schema, options);

module.exports = Image;
