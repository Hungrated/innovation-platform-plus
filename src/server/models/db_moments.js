const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  moment_id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
    unique: true
  },
  type: {
    type: Sequelize.ENUM,
    values: ['blog', 'comment', 'plan'],
    allowNull: false
  },
  desc: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  href: {
    type: Sequelize.STRING(64),
    allowNull: false
  }
};

const options = {
  underscored: true
};

const Moment = mysql.define('moment', schema, options);

module.exports = Moment;
