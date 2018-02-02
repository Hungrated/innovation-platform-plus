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
const uid = require('../middlewares/id_gen');

const Class = db.Class;
const User = db.User;
const Profile = db.Profile;
const Final = db.Final;

let objMulter = multer({
  dest: path.userinfo // file upload destination
});

/**
 *
 * （教师）用户注册
 *
 * @api {post} /api/user/reg user.reg
 * @apiName userReg
 * @apiGroup User
 * @apiVersion 2.3.0
 * @apiPermission administrator
 *
 * @apiDescription 教师用户注册。
 *
 * @apiParam {Number} school_id 教师工号
 * @apiParam {String} name 教师姓名
 * @apiParam {String} password 密码
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "school_id": 40429,
 *     "name": "邬惠峰",
 *     "password": "teacher"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 1000,
 *     "msg": "注册成功"
 * }
 */
router.post('/reg', function (req, res) {
  // only for teachers, only in backend
  const {id, name, password} = req.body;
  if (!(id || name || password)) { return res.json(statusLib.REG_FAILED); }

  User.create({
    username: id.toString(),
    password: password,
    identity: 'teacher'
  })
    .then(function (user) {
      Profile.create({
        school_id: id,
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
});

/**
 *
 * 学生用户解析
 *
 * @api {post} /api/user/parse user.parse
 * @apiName userParse
 * @apiGroup User
 * @apiVersion 2.3.0
 * @apiPermission user.teacher
 *
 * @apiDescription 学生用户解析。
 * 上传一个给定格式的Excel表格，返回解析的学生用户注册信息，含用户名和初始密码。
 * 表格上传方式为form-data。
 *
 * @apiParam {File} excel 指定电子表格
 *
 * @apiParamExample {formdata} 请求示例
 * {
 *     "file": <教学班点名册.xls>
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {Object} classData 班级信息
 * @apiSuccess {Array} userArr 待注册学生用户信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 1300,
 *     "msg": "学生信息解析成功",
 *     "classData": {
 *         "year": "2017-2018",
 *         "term": "1",
 *         "class_id": "(2017-2018-1)-S0500560-40429-2",
 *         "cname": "创新综合实践",
 *         "time": "周六第6,7节{第1-17周};周六第8,9节{第1-17周}",
 *         "loc": "第1教研楼608;第1教研楼608",
 *         "status": "active",
 *         "teacher_id": 40429
 *     },
 *     "userArr": [
 *         {
 *             "username": "14051531",
 *             "password": "14051531",
 *             "name": "章梓航",
 *             "school_id": 14051531,
 *             "class_id": 14052313,
 *             "grade": "2014",
 *             "cur_class": "(2017-2018-1)-S0500566-40429-2",
 *             "supervisor": "邬惠峰"
 *         },
 *         {
 *             "username": "14051309",
 *             "password": "14051309",
 *             "name": "陈钧博",
 *             "school_id": 14051309,
 *             "class_id": 14052312,
 *             "grade": "2014",
 *             "cur_class": "(2017-2018-1)-S0500566-40429-2",
 *             "supervisor": "邬惠峰"
 *         }
 *     ]
 * }
 */
router.post('/parse', objMulter.any(), function (req, res, next) {
  // XLS file upload
  // rename a file
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

router.post('/parse', function (req, res, next) {
  // extract user data & convert to JS object
  xl.open(req.fileURL, function (err, data) {
    if (err) {
      console.log(err.name, err.message);
      res.json(statusLib.USERINFO_IMPORT_FAILED);
    } else {
      let sheet = data.sheets[0];
      // check if xls is suitable for parsing
      if (sheet.cell(0, 0) !== '教学班点名册') {
        console.log('xls data not suitable for parsing');
        return res.json(statusLib.USERINFO_PARSE_FAILED_NOT_SUITABLE);
      } else {
        Class.findOne({
          where: {
            class_id: sheet.cell(1, 6)
          }
        })
          .then(function (classData) {
            if (classData === null) {
              req.body.sheet = sheet;
              next();
            } else {
              console.log('duplicated class info');
              res.json(statusLib.USERINFO_PARSE_FAILED_DUP_CLASS_INFO);
            }
          })
          .catch(function (e) {
            console.error(e);
            res.json(statusLib.USERINFO_IMPORT_FAILED);
            console.log('validate failed');
          });
      }
    }
  });
});

router.post('/parse', function (req, res) {
  const sheet = req.body.sheet;

  // parse class info
  let classData = {
    year: sheet.cell(1, 1),
    term: sheet.cell(1, 4),
    class_id: sheet.cell(1, 6),
    cname: sheet.cell(1, 13),
    time: sheet.cell(2, 9),
    loc: sheet.cell(2, 13),
    status: 'active',
    teacher_id: Number(sheet.cell(1, 6).split('-')[4])
  };

  // parse student info
  let userArr = [];
  for (let rIdx = 4; rIdx < sheet.row.count; rIdx++) {
    try {
      userArr.push({
        username: sheet.cell(rIdx, 0),
        password: sheet.cell(rIdx, 0),
        name: sheet.cell(rIdx, 2),
        school_id: parseInt(sheet.cell(rIdx, 0)),
        class_id: parseInt(sheet.cell(rIdx, 4)),
        grade: 20 + sheet.cell(rIdx, 0)[0] + sheet.cell(rIdx, 0)[1],
        cur_class: sheet.cell(1, 6),
        supervisor: sheet.cell(2, 1)
      });
    } catch (e) {
      console.log(e.message);
    }
  }
  res.json({
    status: statusLib.USERINFO_PARSE_SUCCESSFUL.status,
    msg: statusLib.USERINFO_PARSE_SUCCESSFUL.msg,
    classData: classData,
    userArr: userArr
  });
});

/**
 *
 * 学生用户导入
 *
 * @api {post} /api/user/import user.import
 * @apiName userImport
 * @apiGroup User
 * @apiVersion 2.3.0
 * @apiPermission user.teacher
 *
 * @apiDescription 学生用户导入。
 * 将 User - parse 接口获得的用户信息确认后进行批量注册，同时将班级信息也存入数据库。
 *
 * @apiParam {Number} teacher_id 指定电子表格
 * @apiParam {Object} classData 班级信息
 * @apiParam {Array} userArr 待注册学生用户信息
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "teacher_id": 40429,
 *     "classData": {
 *         "year": "2017-2018",
 *         "term": "1",
 *         "class_id": "(2017-2018-1)-S0500560-40429-2",
 *         "cname": "创新综合实践",
 *         "time": "周六第6,7节{第1-17周};周六第8,9节{第1-17周}",
 *         "loc": "第1教研楼608;第1教研楼608",
 *         "status": "active",
 *         "teacher_id": 40429
 *     },
 *     "userArr": [
 *         {
 *             "username": "14051531",
 *             "password": "14051531",
 *             "name": "章梓航",
 *             "school_id": 14051531,
 *             "class_id": 14052313,
 *             "grade": "2014",
 *             "cur_class": "(2017-2018-1)-S0500566-40429-2",
 *             "supervisor": "邬惠峰"
 *         },
 *         {
 *             "username": "14051309",
 *             "password": "14051309",
 *             "name": "陈钧博",
 *             "school_id": 14051309,
 *             "class_id": 14052312,
 *             "grade": "2014",
 *             "cur_class": "(2017-2018-1)-S0500566-40429-2",
 *             "supervisor": "邬惠峰"
 *         }
 *     ]
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 *
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 1400,
 *     "msg": "学生信息导入成功"
 * }
 */
router.post('/import', function (req, res, next) {
  // validate teacher identity
  Profile.findOne({
    where: {
      school_id: req.body.teacher_id
    }
  })
    .then(function (profile) {
      if (profile !== null) {
        next();
      } else {
        console.log('validation error not teacher');
        return res.json(statusLib.USERINFO_IMPORT_FAILED);
      }
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.USERINFO_IMPORT_FAILED);
      console.log('validate failed');
    });
});

router.post('/import', function (req, res, next) {
  // import data
  const classData = req.body.classData;
  Class.create(classData)
    .then(function () {
      next();
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.USERINFO_IMPORT_FAILED);
      console.log('class import failed');
    });
});

router.post('/import', function (req, res) {
  // create record in table `user` & `profile`
  const users = req.body.userArr;
  const identity = 'student';
  const academy = '计算机学院';

  let flag = 0; // flag of all users imported

  function createUser (userIdx) {
    User.findOne({ // check record to ensure no duplication
      where: {
        username: users[userIdx].username
      }
    })
      .then(function (user) {
        Final.create({
          cswk_id: 'cwk' + uid.generate(),
          class_id: users[userIdx].cur_class,
          student_id: users[userIdx].school_id
        })
          .then(function () {
            console.log('cswk record created');
          });
        if (user !== null) { // exists duplication
          console.log('user already exists');
          Profile.update({
            cur_class: users[userIdx].cur_class
          }, {
            where: {
              school_id: users[userIdx].school_id
            }
          })
            .then(function () {
              flag++;
              if (flag === users.length) {
                console.log('all users modified');
                res.json(statusLib.USERINFO_IMPORT_SUCCESSFUL);
              }
            })
            .catch(function (e) {
              console.error(e);
              return res.json(statusLib.USERINFO_IMPORT_FAILED);
            });
        } else {
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
                .then(function (profile) {
                  // create a profile record for a student
                  if (profile !== null) { // exists duplication
                    console.log('user already exists');
                  } else {
                    Profile.create({
                      school_id: users[userIdx].school_id,
                      avatar: '',
                      name: users[userIdx].name,
                      academy: academy,
                      class_id: users[userIdx].class_id,
                      grade: users[userIdx].grade,
                      cur_class: users[userIdx].cur_class,
                      supervisor: users[userIdx].supervisor,
                      user_id: user.id
                    }).then(function () {
                      flag++;
                      if (flag === users.length) {
                        console.log('all users imported');
                        res.json(statusLib.USERINFO_IMPORT_SUCCESSFUL);
                      }
                    })
                      .catch(function (e) {
                        console.error(e);
                        return res.json(statusLib.USERINFO_IMPORT_FAILED);
                      });
                  }
                });
            })
            .catch(function (e) {
              console.error(e);
              return res.json(statusLib.USERINFO_IMPORT_FAILED);
            });
        }
      })
      .catch(function (e) {
        console.error(e);
        return res.json(statusLib.USERINFO_IMPORT_FAILED);
      });
  }

  for (let userIdx = 0; userIdx < users.length; userIdx++) {
    createUser(userIdx);
  }
});

/**
 *
 * 用户登录
 *
 * @api {post} /api/user/login user.login
 * @apiName userLogin
 * @apiGroup User
 * @apiVersion 2.3.0
 * @apiPermission all
 *
 * @apiDescription 用户登入系统。
 *
 * @apiParam {String} username 用户名（学号/工号）
 * @apiParam {String} password 密码
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "username": "14051531",
 *     "password": "14051531"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {Number} id 用户编号
 * @apiSuccess {String} username 用户名
 * @apiSuccess {Number} school_id 用户名
 * @apiSuccess {String} name 姓名
 * @apiSuccess {String} cur_class 当前选课号
 *
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 1100,
 *     "msg": "登录成功",
 *     "id":16,
 *     "username":"14051531",
 *     "school_id":14051531,
 *     "name":"章梓航",
 *     "cur_class":"(2017-2018-1)-S0500560-40429-2"
 * }
 */
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
        attributes: ['school_id', 'name', 'cur_class']
      }]
    })
      .then(function (user) { // do further check
        if (user.dataValues === null) { // username does not exist
          res.json(statusLib.INVALID_USERNAME);
          console.log('does not exist');
        } else if (user.dataValues.password ===
          crypto.createHash('sha256')
            .update(config.salt + password)
            .digest('hex').slice(0, 255)) { // password checked
          req.session.isLogin = true;
          req.session.username = user.username;
          // req.session.cur_class = user.profile.cur_class;
          res.cookie('isLogin', true);
          res.cookie('username', user.username);
          res.cookie('identity', user.identity);
          // res.cookie('cur_class', user.profile.cur_class);
          res.json({
            status: statusLib.LOGIN_SUCCESSFUL.status,
            msg: statusLib.LOGIN_SUCCESSFUL.msg,
            id: user.id,
            username: user.username,
            school_id: user.profile.school_id,
            name: user.profile.name,
            cur_class: user.profile.cur_class
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

/**
 *
 * 用户登出
 *
 * @api {post} /api/user/logout user.logout
 * @apiName userLogout
 * @apiGroup User
 * @apiVersion 2.3.0
 * @apiPermission user
 *
 * @apiDescription 用户登出系统。
 *
 * @apiParamExample {json} 请求示例
 * {}
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 1200,
 *     "msg": "已退出登录"
 * }
 */
router.post('/logout', function (req, res) {
  req.session.isLogin = false;
  res.clearCookie('isLogin');
  res.clearCookie('username');
  res.json(statusLib.LOGGED_OUT);
  console.log('logged out');
});

/**
 *
 * 用户修改密码
 *
 * @api {post} /api/user/pwdmod user.pwdmod
 * @apiName userPwdMod
 * @apiGroup User
 * @apiVersion 2.3.0
 * @apiPermission user
 *
 * @apiDescription 用户修改密码。
 *
 * @apiParam {String} username 用户名（学号/工号）
 * @apiParam {String} password 当前密码
 * @apiParam {String} newPassword 新密码
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "username": "14051531",
 *     "password": "14051531"，
 *     "newPassword": "14051531"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 1500,
 *     "msg": "密码修改成功"
 * }
 */
router.post('/pwdmod', function (req, res, next) {
  if (!req.session.isLogin) {
    res.json(statusLib.NOT_YET_LOGGED_IN);
    console.log('not logged in');
  }

  const {username, password, newPassword} = req.body;

  if (!username || !password || !newPassword) {
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
            .digest('hex').slice(0, 255)) {
          // password checked
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

router.post('/pwdmod', function (req, res) {
  // password checked
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
