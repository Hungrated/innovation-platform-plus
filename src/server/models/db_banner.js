const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  img_id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
    unique: true
  },
  src: {
    type: Sequelize.STRING,
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

const Banner = mysql.define('banner', schema, options);

module.exports = Banner;
