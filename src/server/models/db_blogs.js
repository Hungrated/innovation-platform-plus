const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const schema = {
  blog_id: {
    type: Sequelize.STRING(32),
    primaryKey: true,
    unique: true
  },
  type: {
    type: Sequelize.ENUM,
    values: ['project', 'event'],
    allowNull: false
  },
  labels: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING(32),
    unique: true,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING(128)
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  cover: {
    type: Sequelize.STRING
  }
};

const options = {
  underscored: true
};

const Blog = mysql.define('blog', schema, options);

module.exports = Blog;
