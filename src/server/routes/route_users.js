const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const pathLib = require('path');
const path = require('../app_paths');
const xl = require('node-xlrd');
const config = require('config-lite')(__dirname).database;

const sequelize = require('sequelize');
const db = require('../models/db_global');
const statusLib = require('../libs/status');

const User = db.User;
const Profile = db.Profile;

let objMulter = multer({
  dest: path.userinfo // file upload destination
});

// student register interface disabled: use '/import' instead

router.post('/reg', function (req, res) { // only for teachers, only in backend
  const {school_id, name, password, identity} = req.body;
  if (!(school_id || name || password || identity))
    return res.json(statusLib.REG_FAILED);

  if (identity !== 'teacher') {
    res.json(statusLib.REG_FAILED);
    console.log('identity wrong');
  } else {
    User.create({
      username: school_id.toString(),
      password: password,
      identity: identity
    })
      .then(function (user) {
        console.log(user);
        console.log(user.dataValues);
        Profile.create({
          school_id: school_id,
          name: name,
          user_id: user.dataValues.id
        })
          .then(function () {
            res.json(statusLib.REG_SUCCESSFUL);
            console.log('teacher reg successful');
          })
          .catch(function (e) {
            console.error(e);
            res.json(statusLib.CONNECTION_ERROR);
          });
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

router.post('/import', objMulter.any(), function (req, res, next) { // XLS file upload

  //rename a file
  let newName = req.files[0].path + pathLib.parse(req.files[0].originalname).ext;
  fs.rename(req.files[0].path, newName, function (err) {
    if (err) {
      console.log('file rename error');
      return res.json(statusLib.FILE_RENAME_FAILED);
    } else { // parse XLS file
      req.fileURL = newName;
      next();
    }
  });
});

router.post('/import', function (req, res, next) { // extract user data & convert to JSON

  xl.open(req.fileURL, function (err, data) {
    if (err) {
      console.log(err.name, err.message);
      res.json(statusLib.USERINFO_IMPORT_FAILED);
    } else {
      let userArr = [];
      let sheet = data.sheets[0];
      for (let rIdx = 4; rIdx < sheet.row.count; rIdx++) {
        try {
          userArr.push({
            username: sheet.cell(rIdx, 0),
            password: sheet.cell(rIdx, 0),
            name: sheet.cell(rIdx, 2),
            school_id: parseInt(sheet.cell(rIdx, 0)),
            class_id: parseInt(sheet.cell(rIdx, 4)),
            grade: 20 + sheet.cell(rIdx, 0)[0] + sheet.cell(rIdx, 0)[1]
          });
        } catch (e) {
          console.log(e.message);
        }
      }
      req.body.supervisor = sheet.cell(2, 1);
      req.body.users = userArr;
      next();
    }
  });
});

router.post('/import', function (req, res) { // create database record

  const users = req.body.users;
  const identity = 'student';
  const academy = '计算机学院';
  const supervisor = req.body.supervisor;

  let flag = 0; // flag of all users imported

  function createUser (userIdx) {
    User.findOne({ // check record to ensure no duplication
      where: {
        username: users[userIdx].username
      }
    })
      .then(function (user) {
        if (user !== null) { // exists duplication
          console.log('user already exists');
        } else
          User.create({ // first: create a User record
            username: users[userIdx].username,
            password: users[userIdx].password,
            identity: identity
          })
            .then(function (user) {
              Profile.findOne({ // ensure no duplication
                where: {
                  school_id: users[userIdx].school_id
                }
              })
                .then(function (profile) { // create a profile record for a student
                  if (profile !== null) { // exists duplication
                    console.log('user already exists');
                  } else
                    Profile.create({
                      school_id: users[userIdx].school_id,
                      name: users[userIdx].name,
                      academy: academy,
                      class_id: users[userIdx].class_id,
                      grade: users[userIdx].grade,
                      supervisor: supervisor,
                      user_id: user.id
                    }).then(function () {
                      flag++;
                      if (flag === users.length) {
                        console.log('all users imported');
                        res.json(statusLib.USERINFO_IMPORT_SUCCESSFUL);
                      }
                    }).catch(function (e) {
                      console.error(e);
                      return res.json(statusLib.USERINFO_IMPORT_FAILED);
                    });
                });
            }).catch(function (e) {
            console.error(e);
            return res.json(statusLib.USERINFO_IMPORT_FAILED);
          });
      }).catch(function (e) {
      console.error(e);
      return res.json(statusLib.USERINFO_IMPORT_FAILED);
    });
  }

  for (let userIdx = 0; userIdx < users.length; userIdx++) {
    createUser(userIdx);
  }
});

router.post('/login', function (req, res) {
  const {username, password} = req.body;
  if (!req.session.isLogin || username !== req.session.username) {
    // when not logged in or different user logging in

    // check if there is a record include username
    User.findOne({
      where: {
        username: username
      },
      include: [{
        model: Profile,
        where: {
          user_id: sequelize.col('user.id')
        },
        attributes: ['school_id', 'name']
      }]
    })
      .then(function (user) { // do further check
        if (user.dataValues === null) { //username does not exist
          res.json(statusLib.INVALID_USERNAME);
          console.log('does not exist');
        } else if (user.dataValues.password ===
          crypto.createHash('sha256')
            .update(config.salt + password)
            .digest('hex').slice(0, 255)) { // password checked

          req.session.isLogin = true;
          req.session.username = user.username;
          res.cookie('isLogin', true);
          res.cookie('username', user.username);
          res.cookie('identity', user.identity);
          res.json({
            status: statusLib.LOGIN_SUCCESSFUL.status,
            msg: statusLib.LOGIN_SUCCESSFUL.msg,
            id: user.id,
            username: user.username,
            school_id: user.profile.school_id,
            name: user.profile.name
          });
          console.log('log in successful');
        } else {
          res.json(statusLib.PASSWORD_CHECK_FAILED);
          console.log('password wrong');
        }
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  } else {
    res.json(statusLib.ALREADY_LOGGED_IN);
    console.log('already logged in');
  }
});

router.post('/logout', function (req, res) {
  req.session.isLogin = false;
  res.clearCookie('isLogin');
  res.clearCookie('username');
  res.json(statusLib.LOGGED_OUT);
  console.log('logged out');
});

router.post('/pwdmod', function (req, res, next) {
  if (!req.session.isLogin) {
    res.json(statusLib.NOT_YET_LOGGED_IN);
    console.log('not logged in');
  }

  const {username, password, new_password} = req.body;

  if (!username || !password || !new_password) {
    console.log('data not complete');
    res.json(statusLib.USER_PWD_MOD_FAILED);
  } else {
    User.findOne({
      where: {
        username: username
      }
    })
      .then(function (user) { // do further check
        if (user.dataValues.password ===
          crypto.createHash('sha256')
            .update(config.salt + password)
            .digest('hex').slice(0, 255)) { // password checked
          next();
        } else {
          res.json(statusLib.USER_PWD_MOD_FAILED);
          console.log('password wrong');
        }
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

router.post('/pwdmod', function (req, res) { // password checked
  User.update({
    password: req.body.new_password
  }, {
    where: {
      username: req.body.username
    }
  })
    .then(function () {
      console.log('password mod successful');
      res.json(statusLib.USER_PWD_MOD_SUCCESSFUL);
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

module.exports = router;
