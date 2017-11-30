const config = require('config-lite')(__dirname).database;

const Sequelize = require('sequelize');

const mysql = require('../middlewares/sequelize');

const crypto = require('crypto');

const schema = {
  username: {
    type: Sequelize.STRING(32),
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING(256),
    allowNull: false,
    set: function (val) { // crypto
      const hash = crypto.createHash('sha256');
      hash.update(config.salt + val);
      const hashedPWD = hash.digest('hex');
      this.setDataValue('password', hashedPWD.slice(0, 255));
    }
  },
  identity: {
    type: Sequelize.ENUM,
    values: ['student', 'teacher'],
    allowNull: false
  }

};

const options = {
  underscored: true
};

const User = mysql.define('user', schema, options);

module.exports = User;
