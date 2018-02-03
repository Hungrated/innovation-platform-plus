const express = require('express');
const router = express.Router();
const pathLib = require('path');
const path = require('../app_paths');

const timeFormat = require('../middlewares/time_format');
const uid = require('../middlewares/id_gen');

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const moment = require('../middlewares/moment');

const Plan = db.Plan;
const Profile = db.Profile;

const async = require('async');
const fs = require('fs');
const officeGen = require('officegen');

/**
 *
 * 提交计划
 *
 * @api {post} /api/plan/submit plan.submit
 * @apiName planSubmit
 * @apiGroup Plan
 * @apiVersion 2.4.0
 * @apiPermission user.student
 *
 * @apiDescription 学生提交计划。
 *
 * @apiParam {Number} student_id 用户编号
 * @apiParam {String} year 学年
 * @apiParam {String} term 学期
 * @apiParam {String} content 计划内容
 * @apiParam {String} start 文章编号
 * @apiParam {String} deadline 文章编号
 * @apiParam {String} class_id 当前选课号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "student_id": 14051531,
 *     "year": "2017-2018",
 *     "term": "1",
 *     "content": "创新实践平台开发",
 *     "start": "2017-10-11",
 *     "deadline": "2017-12-29",
 *     "class_id": "(2017-2018-1)-S0500560-40429-2"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {String} plan_id 计划编号
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 5000,
 *     "msg": "计划提交成功",
 *     "plan_id": "pln9c43dc"
 * }
 */
router.post('/submit', function (req, res) {
  // a student create a plan
  const {
    student_id,
    year,
    term,
    content,
    start,
    deadline,
    class_id
  } = req.body;

  const status = '未审核';
  const plan_id = 'pln' + uid.generate();

  Plan.create({
    plan_id: plan_id,
    year: year,
    term: term,
    content: content,
    start: start,
    deadline: deadline,
    student_id: student_id,
    status: status,
    class_id: class_id
  })
    .then(function () {
      // if plan is not validated,
      // params[2] should be plan_id, otherwise it should be ''.
      moment.createMoment('planmod', content + '  ( ' + start + ' - ' + deadline + ' )', status, student_id, plan_id);
      res.json({
        'status': statusLib.PLAN_SUBMIT_SUCCESSFUL.status,
        'msg': statusLib.PLAN_SUBMIT_SUCCESSFUL.msg,
        'plan_id': plan_id
      });
      console.log('plan submit successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_SUBMIT_FAILED);
      console.log('plan submit failed');
    });
});

/**
 *
 * 修改计划
 *
 * @api {post} /api/plan/modify plan.modify
 * @apiName planModify
 * @apiGroup Plan
 * @apiVersion 2.4.0
 * @apiPermission user.student
 *
 * @apiDescription 学生修改计划。
 *
 * @apiParam {Number} student_id 用户编号
 * @apiParam {String} year 学年
 * @apiParam {String} term 学期
 * @apiParam {String} content 计划内容
 * @apiParam {String} start 文章编号
 * @apiParam {String} deadline 文章编号
 * @apiParam {String} plan_id 计划编号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "student_id": 14051531,
 *     "year": "2017-2018",
 *     "term": "1",
 *     "content": "创新实践平台开发V2.0.0",
 *     "start": "2018-01-04",
 *     "deadline": "2018-01-19",
 *     "plan_id": "pln9c43dc"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 5100,
 *     "msg": "计划修改成功"
 * }
 */
router.post('/modify', function (req, res, next) {
  // check plan status before modification
  Plan.findOne({
    where: {
      plan_id: req.body.plan_id
    }
  })
    .then(function (plan) {
      if (plan.dataValues.status !== '已通过')
        next();
      else {
        res.json(statusLib.PLAN_MOD_FAILED);
        console.log('plan modify failed');
      }
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_MOD_FAILED);
      console.log('plan modify failed');
    });
});

router.post('/modify', function (req, res) {
  // a student modifies a plan
  const {
    student_id,
    year,
    term,
    content,
    start,
    deadline
  } = req.body;

  const status = '未审核';

  const modData = {
    year: year,
    term: term,
    content: content,
    start: start,
    deadline: deadline,
    student_id: student_id,
    status: status
  };

  Plan.update(modData, {
    where: {
      plan_id: req.body.plan_id
    }
  })
    .then(function () {
      moment.createPlanModifyMoment('planmod', content + '  ( ' + start + ' - ' + deadline + ' )', status, student_id, req.body.plan_id);
      res.json(statusLib.PLAN_MOD_SUCCESSFUL);
      console.log('plan modify successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_MOD_FAILED);
      console.log('plan modify failed');
    });
});

/**
 *
 * （教师）审核计划
 *
 * @api {post} /api/plan/op plan.op
 * @apiName planOp
 * @apiGroup Plan
 * @apiVersion 2.4.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师审核学生计划。
 *
 * @apiParam {String} plan_id 计划编号
 * @apiParam {Number} op 操作：0 不通过；1 通过
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "plan_id": "pln9c43dc"，
 *     "op": 1
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 5200,
 *     "msg": "计划审核成功"
 * }
 */
router.post('/op', function (req, res) {
  // teacher changes plan status
  const status = req.body.op ? '已通过' : '未通过';

  Plan.update({
    status: status
  }, {
    where: {
      plan_id: req.body.plan_id
    }
  })
    .then(function () {
      moment.validatePlanMoment(req.body.plan_id, status);
      res.json(statusLib.PLAN_VERIFY_SUCCESSFUL);
      console.log('plan verified');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_VERIFY_FAILED);
      console.log('plan verify failed');
    });
});

/**
 *
 * 查询计划
 *
 * @api {post} /api/plan/query plan.query
 * @apiName planQuery
 * @apiGroup Plan
 * @apiVersion 2.4.0
 * @apiPermission user
 *
 * @apiDescription 获取学生计划列表。
 *
 * @apiParam request 查询条件："all"或用户编号
 *
 * @apiParamExample {json} 请求示例1
 * {
 *     "request": "all"
 * }
 * @apiParamExample {json} 请求示例2
 * {
 *     "request": 14051531
 * }
 *
 * @apiSuccess {Array} data 计划列表
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * [
 *     {
 *         "plan_id": "pln9c43dc",
 *         "year": "2017-2018",
 *         "term": "1",
 *         "content": "创新实践平台开发V2.0.0",
 *         "start": "2018-01-04",
 *         "deadline": "2018-01-19",
 *         "status": "未审核",
 *         "class_id": "(2017-2018-1)-S0500560-40429-2",
 *         "created_at": "2018-01-30T05:50:22.000Z",
 *         "updated_at": "2018-01-30T05:53:44.000Z",
 *         "student_id": 14051531,
 *         "submitTime": "2018-01-30 13:50:22"
 *     },
 *     {
 *         "plan_id": "plnf1d5c4",
 *         "year": "2017-2018",
 *         "term": "1",
 *         "content": "test0",
 *         "start":"2018-01-26",
 *         "deadline": "2018-01-27",
 *         "status": "已通过",
 *         "class_id": "(2017-2018-1)-S0500560-40429-2",
 *         "created_at": "2018-01-25T17:15:25.000Z",
 *         "updated_at": "2018-01-25T17:16:33.000Z",
 *         "student_id": 14051531,
 *         "submitTime": "2018-01-26 01:15:25"
 *     }
 * ]
 */
router.post('/query', function (req, res) {
  // get list of all (or personal) plans
  const request = req.body.request;
  const where = (request === 'all') ? {} : {student_id: request};

  Plan.findAll({
    where: where,
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (plans) {
      for (let i = 0; i < plans.length; i++) {
        plans[i].dataValues.submitTime = timeFormat(plans[i].dataValues.created_at);
      }
      res.json(plans);
      console.log('plan query successful');

    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_QUERY_FAILED);
      console.log('plan query failed');
    });
});

/**
 *
 * 导出计划到Word
 *
 * @api {post} /api/plan/export plan.export
 * @apiName planExport
 * @apiGroup Plan
 * @apiVersion 2.4.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师导出学生个人计划表。
 *
 * @apiParam {Number} student_id 学生学号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "student_id": 14051531
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {String} path 生成包含学生个人计划信息的Word文档的链接信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 5500,
 *     "msg": "计划导出成功",
 *     "path": "/api/download?plans=plan_export_14051531_1517480499563.docx"
 * }
 */
router.post('/export', function (req, res, next) {
  // fetch profile records from database
  const student_id = req.body.student_id;
  Profile.findByPrimary(student_id)
    .then(function (profile) {
      req.body.profile = profile.dataValues;
      next();
    })
    .catch(function (e) {
      console.log(e);
      res.json(statusLib.PLAN_EXPORT_FAILED);
    });
});

router.post('/export', function (req, res, next) {
  // fetch plan records from database
  let student_id = req.body.student_id;
  Plan.findAll({
    where: {
      student_id: student_id
    }
  })
    .then(function (plans) {
      let planArr = [];
      for (let i = 0; i < plans.length; i++) {
        planArr.push(plans[i].dataValues);
      }
      req.body.planArr = planArr;
      next();
    })
    .catch(function (e) {
      console.log(e);
      res.json(statusLib.PLAN_EXPORT_FAILED);
    });
});

router.post('/export', function (req, res) {
  // export plan archive
  const student_id = req.body.student_id;
  const profile = req.body.profile;
  const planArr = req.body.planArr;

  // get export time & set filename
  let curTime = new Date();
  let exportTime = new Date(curTime.getTime() - curTime.getTimezoneOffset() * 60 * 1000);

  // set filename
  let fileName = 'plan_export_' + student_id + '_' + exportTime.getTime() + '.docx';
  let filePath = pathLib.join(path.plans, fileName);

  // create file
  let docx = officeGen({
    type: 'docx',
    orientation: 'portrait'
  });

  // officeGen.setVerboseMode ( true );

  docx.on('error', function (err) {
    console.log(err);
    res.json(statusLib.PLAN_EXPORT_FAILED);
  });

  let tableHeadOpts = {
    cellColWidth: 1800,
    b: true,
    sz: 20,
    shd: {
      fill: 'DDDDDD'
    },
    fontFamily: 'Times New Roman'
  };

  let tableContentOpts = {
    cellColWidth: 1800,
    b: true,
    sz: 20,
    fontFamily: 'Times New Roman'
  };

  let objLine = {
    type: 'horizontalline'
  };

  let objHeader = [{
    type: 'text',
    val: 'header'
  },
    {
      type: 'image',
      path: pathLib.resolve(__dirname, '../public/assets/HDU_LOGO.png'),
      opt: {cx: 150, cy: 50}
    },
    {
      type: 'text',
      // space as blanks
      val: '                                                                                 '
    },
    {
      type: 'image',
      path: pathLib.resolve(__dirname, '../public/assets/innovation_practice.png'),
      opt: {cx: 150, cy: 50}
    }
  ];

  let objTitle = {
    type: 'text',
    val: '创新实践个人计划报告',
    opt: {font_face: '黑体', bold: true, font_size: 22},
    lopt: {align: 'center'}
  };

  let studentProfile = [
    [{
      val: '姓 名',
      opts: tableHeadOpts
    },
      {
        val: '学 号',
        opts: tableHeadOpts
      },
      {
        val: '导 师',
        opts: tableHeadOpts
      },
      {
        val: '年 级',
        opts: tableHeadOpts
      },
      {
        val: '学 期',
        opts: tableHeadOpts
      }
    ],
    [{
      val: profile.name,
      opts: tableContentOpts
    },
      {
        val: profile.school_id,
        opts: tableContentOpts
      },
      {
        val: profile.supervisor,
        opts: tableContentOpts
      },
      {
        val: profile.grade,
        opts: tableContentOpts
      },
      {
        val: '2017-2018-1',
        opts: tableContentOpts
      }
    ]
  ];

  let studentProfileStyle = {
    tableColWidth: 4261,
    tableSize: 20,
    tableAlign: 'center',
    tableFontFamily: 'Times New Roman',
    borders: true
  };

  let objProfile = {
    type: 'table',
    val: studentProfile,
    opt: studentProfileStyle
  };

  let studentPlans = [
    [{
      val: '序号',
      opts: {
        cellColWidth: 1000,
        b: true,
        sz: 20,
        shd: {
          fill: 'DDDDDD'
        },
        fontFamily: 'Times New Roman'
      }
    },
      {
        val: '内 容',
        opts: {
          cellColWidth: 2500,
          b: true,
          sz: 20,
          shd: {
            fill: 'DDDDDD'
          },
          fontFamily: 'Times New Roman'
        }
      },
      {
        val: '起止时间',
        opts: {
          cellColWidth: 1800,
          b: true,
          sz: 20,
          shd: {
            fill: 'DDDDDD'
          },
          fontFamily: 'Times New Roman'
        }
      },
      // {
      //   val: '评 级',
      //   opts: {
      //     cellColWidth: 1250,
      //     b: true,
      //     sz: 20,
      //     shd: {
      //       fill: 'DDDDDD'
      //     },
      //     fontFamily: 'Times New Roman'
      //   }
      // },
      // {
      //   val: '评 语',
      //   opts: {
      //     cellColWidth: 2000,
      //     b: true,
      //     sz: 20,
      //     shd: {
      //       fill: 'DDDDDD'
      //     },
      //     fontFamily: 'Times New Roman'
      //   }
      // }
    ]
  ];

  let studentPlansStyle = {
    tableColWidth: 5000,
    tableSize: 20,
    tableAlign: 'left',
    tableFontFamily: 'Times New Roman',
    borders: true
  };

  let objPlans = {
    type: 'table',
    val: studentPlans,
    opt: studentPlansStyle
  };

  let objFooter = {
    type: 'text',
    val: '导出时间： ' + timeFormat(curTime),
    opt: {font_face: 'Times New Roman', color: 'DDDDDD', bold: true},
    lopt: {align: 'right'}
  };

  // fill data to studentPlans
  for (let i = 0; i < planArr.length; i++) {
    studentPlans.push([{
      val: i + 1,
      opts: {
        cellColWidth: 1500,
        b: true,
        sz: 20,
        fontFamily: 'Times New Roman'
      }
    },
      {
        val: planArr[i].content,
        opts: {
          cellColWidth: 4000,
          b: true,
          sz: 20,
          fontFamily: 'Times New Roman'
        }
      },
      {
        val: planArr[i].start + '-' + planArr[i].deadline,
        opts: {
          cellColWidth: 3500,
          b: true,
          sz: 20,
          fontFamily: 'Times New Roman'
        }
      }
    ]);
  }

  let data = [

    // header
    objHeader,
    objLine,

    // title
    objTitle,

    // personal information
    objProfile,
    {
      type: 'text',
      val: '\n'
    },
    // personal plans
    {
      type: 'text',
      val: '个人计划详情',
      opt: {font_face: '黑体', bold: true, font_size: 16},
      lopt: {align: 'left'}
    },
    objPlans,
    objLine,

    // other information
    objFooter
  ];

  docx.createByJson(data);

  // export file
  let out = fs.createWriteStream(filePath);

  out.on('error', function (err) {
    console.log(err);
  });

  async.parallel([
    function (done) {
      out.on('close', function () {
        console.log('plan export successful');
        res.json({
          status: statusLib.PLAN_EXPORT_SUCCESSFUL.status,
          msg: statusLib.PLAN_EXPORT_SUCCESSFUL.msg,
          path: '/api/download?plans=' + fileName
        });
        done(null);
      });
      docx.generate(out);
    }

  ], function (err) {
    if (err) {
      console.log('error: ' + err);
    }
  });
});

module.exports = router;
