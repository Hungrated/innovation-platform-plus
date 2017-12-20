const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');
const pathLib = require('path');

const schema = {
  school_id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    unique: true
  },
  avatar: {
    type: Sequelize.STRING,
    set: function (val) {
      this.setDataValue('avatar', pathLib.resolve(val));
    }
  },
  name: {
    type: Sequelize.STRING(16)
  },
  sex: {
    type: Sequelize.ENUM,
    values: ['未知', '男', '女']
  },
  academy: {
    type: Sequelize.STRING(16)
  },
  class_id: {
    type: Sequelize.INTEGER(11)
  },
  grade: {
    type: Sequelize.STRING(16)
  },
  supervisor: {
    type: Sequelize.STRING(16)
  },
  birth_date: {
    type: Sequelize.STRING(16)
  },
  phone_num: {
    type: Sequelize.STRING(16)
  },
  description: {
    type: Sequelize.STRING(128)
  }
};

const options = {
  underscored: true
};

const Profile = mysql.define('profile', schema, options);

module.exports = Profile;
