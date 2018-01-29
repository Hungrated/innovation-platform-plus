const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  label_id: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  name: {
    type: Sequelize.STRING(16)
  },
  category_id: {
    type: Sequelize.INTEGER(11)
  }
};

const options = {
  underscored: true
};

const Label = mysql.define('labels', schema, options);

module.exports = Label;
