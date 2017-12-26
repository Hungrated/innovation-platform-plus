const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  plan_id: {
    type: Sequelize.STRING(32),
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
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  start: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  deadline: {
    type: Sequelize.STRING(16),
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM,
    values: ['已通过', '未通过', '未审核'],
  },
  cur_class: {
    type: Sequelize.STRING
  },
  rate: {
    type: Sequelize.STRING(8)
  },
  remark: {
    type: Sequelize.STRING(128)
  }
};

const options = {
  underscored: true
};

const Plan = mysql.define('plan', schema, options);

module.exports = Plan;
