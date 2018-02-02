const express = require('express');
const router = express.Router();

const path = require('../app_paths');
const pathLib = require('path');
const uid = require('../middlewares/id_gen');

const db = require('../models/db_global');
const statusLib = require('../libs/status');
const Profile = db.Profile;
const Plan = db.Plan;
const Meeting = db.Meeting;
const Final = db.Final;

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: path.avatars // file upload destination
});

/**
 *
 * 更新用户档案
 *
 * @api {post} /api/profile/modify profile.modify
 * @apiName profileModify
 * @apiGroup Profile
 * @apiVersion 2.2.0
 * @apiPermission user.student
 *
 * @apiDescription 修改用户资料。用户可修改的资料有：性别、出生日期、手机号码、自述。
 *
 * @apiParam {Number} school_id  用户学号
 * @apiParam {String} sex 用户性别
 * @apiParam {String} birth_date 用户出生日期
 * @apiParam {String} phone_num 用户手机号码
 * @apiParam {String} description 用户自述
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "school_id": 14051531,
 *     "sex": "男",
 *     "birth_date": "1996-4-29",
 *     "phone_num": "135xxxx6570",
 *     "description": "A dream pursuer"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 2000,
 *     "msg": "档案更新成功"
 * }
 */
router.post('/modify', function (req, res) {
  // modify a profile
  const {
    school_id,
    sex,
    birth_date,
    phone_num,
    description
  } = req.body;
  const modData = {
    sex: sex,
    birth_date: birth_date,
    phone_num: phone_num,
    description: description
  };

  Profile.update(modData, {
    where: {
      school_id: school_id
    }
  })
    .then(function () {
      res.json(statusLib.PROFILE_MOD_SUCCESSFUL);
      console.log('modify successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 更新用户头像
 *
 * @api {post} /api/profile/avatar profile.avatar
 * @apiName profileAvatar
 * @apiGroup Profile
 * @apiVersion 2.2.0
 * @apiPermission user.student
 *
 * @apiDescription 用户通过上传图片修改头像。上传方式为form-data。
 *
 * @apiParam {File} avatar 头像图片
 * @apiParam {Number} school_id 学生学号
 * @apiParamExample {formdata} 请求示例
 * {
 *     "avatar": <avatar.jpg>,
 *     "school_id": 14051531
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 2000,
 *     "msg": "档案更新成功"
 * }
 */
router.post('/avatar', objMulter.any(), function (req, res, next) {
  const url = req.body.avatar_src;
  console.log('avatar upload successful');

  if (url === '') {
    next();
  } else {
    // get path of old avatar
    let oldPath = pathLib.join(path.avatars, url.match(/avatars\/(\S*)/)[1]);
    console.log(path.avatars, url.match(/avatars\/(\S*)/)[1]);
    // check existance of previous avatar file, delete if exists
    fs.access(oldPath, function (err) {
      if (err && err.code === 'ENOENT') {
        console.log('delete avatar: file no longer exists, skipped');
        next();
      } else {
        fs.unlink(oldPath, function (err) {
          if (err) {
            console.error(err);
            res.json(statusLib.CONNECTION_ERROR);
          } else {
            console.log('previous avatar file deleted');
            next();
          }
        });
      }
    });
  }
});

router.post('/avatar', function (req, res, next) {
  // rename avatar file
  let newFilename = `${req.body.school_id}_${uid.generate()}.jpg`;
  let newPath = pathLib.join(path.avatars, newFilename);
  let newUrl = path.host + '/images/avatars/' + newFilename;
  console.log(req.files[0].path);
  fs.rename(req.files[0].path, newPath, function (err) {
    if (err) {
      console.log('avatar file rename error');
      res.json(statusLib.FILE_RENAME_FAILED);
    } else {
      req.newUrl = newUrl;
      console.log('avatar: file renamed to ' + newFilename);
      next();
    }
  });
});

router.post('/avatar', function (req, res) {
  // update database record

  Profile.update({
    avatar: req.newUrl
  }, {
    where: {
      school_id: req.body.school_id
    }
  })
    .then(function () {
      console.log('avatar modify successful');
      res.json({
        status: statusLib.PROFILE_MOD_SUCCESSFUL.status,
        msg: statusLib.PROFILE_MOD_SUCCESSFUL.msg,
        avatar_src: req.newUrl
      });
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 获取用户资料
 *
 * @api {post} /api/profile/query profile.query
 * @apiName profileQuery
 * @apiGroup Profile
 * @apiVersion 2.2.0
 * @apiPermission user
 *
 * @apiDescription 用户通过上传图片修改头像。
 *
 * @apiParam request 请求条件：可发送"all"获取所有资料，或根据学号、当前选课号或详细模式查询所需信息
 *
 * @apiParamExample {json} 请求示例1
 * {
 *     "request": "all"
 * }
 * @apiParamExample {json} 请求示例2
 * {
 *     "request": 14051531
 * }
 * @apiParamExample {json} 请求示例3
 * {
 *     "request": {
 *         "cur_class": "(2017-2018-1)-S0500560-40429-2"
 *     }
 * }
 *
 * @apiParam {Object} request 请求条件
 *
 * @apiParamExample {json} 请求示例4
 * {
 *     "request": {
 *         "school_id": 14051531,
 *         "details": true
 *     }
 * }
 *
 * @apiSuccess {Array} data 返回根据上述条件所请求的信息列表
 */
router.post('/query', function (req, res, next) {
  // parse req data
  if (typeof req.body.request === 'object') {
    if (req.body.request.cur_class) {
      req.body.where = {
        cur_class: req.body.request.cur_class,
        school_id: {
          $gt: 999999 // student
        }
      };
      req.body.include = [
        {
          model: Plan,
          attributes: ['start', 'deadline', 'content', 'status']
        },
        {
          model: Meeting,
          attributes: ['date', 'content']
        },
        {
          model: Final,
          attributes: ['cswk_id', 'cswk_src', 'rate', 'remark', 'updated_at']
        }
      ];
    }
    next();
  } else if (req.body.request === 'all') {
    req.body.where = {
      school_id: {
        $gt: 999999 // student
      }
    };
    next();
  } else {
    req.body.where = {
      school_id: req.body.request
    };
    next();
  }
});

router.post('/query', function (req, res, next) {
  // standard query
  if (req.body.include !== undefined || req.body.request.details === true) {
    next();
  } else {
    Profile.findAll({
      where: req.body.where
    })
      .then(function (profile) {
        if (profile === null) {
          res.json(statusLib.PROFILE_FETCH_FAILED);
          console.log('profile does not exist');
        } else {
          res.json(profile);
          console.log('profile fetch successful');
        }
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

router.post('/query', function (req, res, next) {
  // class-based query
  if (req.body.request.details === true) {
    next();
  } else {
    Profile.findAll({
      where: req.body.where,
      include: req.body.include
    }).then(function (profiles) {
      if (!profiles.length) {
        res.json(statusLib.PROFILE_FETCH_FAILED);
        console.log('profile does not exist');
      } else {
        for (let i = 0; i < profiles.length; i++) {
          let profile = profiles[i].dataValues;
          let plansLength = profile.plans.length - 1;
          let meetingsLength = profile.meetings.length - 1;
          profiles[i].dataValues.newest_plan = profile.plans[plansLength]
            ? profile.plans[plansLength]
            : null;
          profiles[i].dataValues.newest_meeting = profile.meetings[meetingsLength]
            ? profile.meetings[meetingsLength]
            : null;
          if (profile.finals.length) {
            profiles[i].dataValues.cswk_id = profile.finals[0].cswk_id;
            profiles[i].dataValues.cswk_src = profile.finals[0].cswk_src;
            profiles[i].dataValues.rate = profile.finals[0].rate;
            profiles[i].dataValues.remark = profile.finals[0].remark;
            profiles[i].dataValues.cswk_time = profile.finals[0].updated_at;
          }
          delete profiles[i].dataValues.plans;
          delete profiles[i].dataValues.meetings;
          delete profiles[i].dataValues.finals;
        }
        res.json(profiles);
        console.log('profile fetch successful');
      }
    })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

router.post('/query', function (req, res) {
  // advanced query
  const stuId = req.body.request.school_id;
  const clsId = req.body.request.cur_class;
  let flag = 0;
  let resData = {
    profile: {},
    plans: [],
    meetings: []
  };

  Profile.findOne({
    where: {
      school_id: stuId
    }
  }).then(function (profile) {
    if (profile === null) {
      res.json(statusLib.PROFILE_FETCH_FAILED);
      console.log('profile does not exist');
    } else {
      resData.profile = profile.dataValues;
      flag = flag + 1;
      if (flag === 3) {
        res.json(resData);
        console.log('profile fetch successful');
      }
    }
  })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
  Plan.findAll({
    where: {
      student_id: stuId,
      class_id: clsId
    },
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (plans) {
      let plansArr = [];
      for (let i = 0; i < plans.length; i++) {
        plansArr.push(plans[i].dataValues);
      }
      resData.plans = plansArr;
      flag = flag + 1;
      if (flag === 3) {
        res.json(resData);
        console.log('profile fetch successful');
      }
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });

  Meeting.findAll({
    where: {
      student_id: stuId,
      class_id: clsId
    },
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (meetings) {
      let meetingsArr = [];
      for (let i = 0; i < meetings.length; i++) {
        meetingsArr.push(meetings[i].dataValues);
      }
      resData.meetings = meetingsArr;
      flag = flag + 1;
      if (flag === 3) {
        res.json(resData);
        console.log('profile fetch successful');
      }
    })
    .catch(function (e) {
      console.error(e);
      console.log('error');
      res.json(statusLib.CONNECTION_ERROR);
    });
});

module.exports = router;
