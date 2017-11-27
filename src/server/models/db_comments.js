const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  content: {
    type: Sequelize.STRING,
    allowNull: false
  }
};

const options = {
  underscored: true
};

const Comment = mysql.define('comment', schema, options);

module.exports = Comment;