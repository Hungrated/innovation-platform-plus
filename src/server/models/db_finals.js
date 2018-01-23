const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  cswk_id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
    unique: true
  },
  class_id: {
    type: Sequelize.STRING
  },
  cswk_src: {
    type: Sequelize.STRING
  },
  rate: {
    type: Sequelize.ENUM,
    values: ['A', 'B', 'C', 'D', 'F']
  },
  remark: {
    type: Sequelize.STRING(128)
  }
};

const options = {
  underscored: true
};

const Rate = mysql.define('finals', schema, options);

module.exports = Rate;
