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

router.post('/submit', function (req, res) { // a student create a plan
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
      // if plan is not validated, params[2] should be plan_id, otherwise it should be ''.
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

router.post('/modify', function (req, res, next) { // check plan status before modification
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

router.post('/modify', function (req, res) { // a student modifies a plan

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

// router.post('/op', function (req, res, next) { // check plan status before modification
//
//   Plan.findOne({
//     where: {
//       plan_id: req.body.plan_id
//     }
//   })
//     .then(function (plan) {
//       if (plan.status !== '未审核') {
//         res.json(statusLib.PLAN_MOD_FAILED);
//         console.log('plan modify failed');
//       } else
//         next();
//     })
//     .catch(function (e) {
//       console.error(e);
//       res.json(statusLib.PLAN_MOD_FAILED);
//       console.log('plan modify failed');
//     });
// });

router.post('/op', function (req, res) { // teacher changes plan status

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

router.post('/rate', function (req, res) { // a teacher rates a plan
  const {
    plan_id,
    rate,
    remark
  } = req.body;

  const modData = {
    rate: rate,
    remark: remark
  };

  Plan.update(modData, {
    where: {
      plan_id: plan_id
    }
  })
    .then(function () {
      res.json(statusLib.PLAN_RATE_SUCCESSFUL);
      console.log('plan rate successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_RATE_FAILED);
      console.log('plan rate failed');
    });

});

router.post('/query', function (req, res) { // get list of all (or personal) plans

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

router.post('/export', function (req, res, next) { // fetch profile records from database
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

router.post('/export', function (req, res, next) { // fetch plan records from database
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

router.post('/export', function (req, res) { // export plan archive

  const student_id = req.body.student_id;
  const profile = req.body.profile;
  const planArr = req.body.planArr;

  // let avatarDir = '../public/upload/avatars/' + profile.school_id + '.jpg';

  // get export time & set filename
  let curTime = new Date();
  let exportTime = new Date(curTime.getTime() - curTime.getTimezoneOffset() * 60 * 1000);

  // set filename
  let fileName = 'plan_export_' + student_id + '_' + exportTime.getTime() + '.docx';
  let filePath = pathLib.join(path.plans, fileName);

  // create file
  let docx = officeGen('docx');

  docx.on('error', function (err) {
    console.log(err);
    res.json(statusLib.PLAN_EXPORT_FAILED);
  });

  let tableHeadOpts = {
    cellColWidth: 1800,
    b: true,
    sz: 32,
    shd: {
      fill: 'DDDDDD'
    },
    fontFamily: '黑体'
  };

  let tableContentOpts = {
    cellColWidth: 1800,
    b: true,
    sz: 28,
    fontFamily: '宋体'
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
    opt: {font_face: '黑体', bold: true, font_size: 24},
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
        val: '2014',
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
    tableSize: 16,
    tableAlign: 'center',
    tableFontFamily: 'Times New Roman'
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
        sz: 32,
        shd: {
          fill: 'DDDDDD'
        },
        fontFamily: '黑体'
      }
    },
      {
        val: '内 容',
        opts: {
          cellColWidth: 2500,
          b: true,
          sz: 32,
          shd: {
            fill: 'DDDDDD'
          },
          fontFamily: '黑体'
        }
      },
      {
        val: '起止时间',
        opts: {
          cellColWidth: 1800,
          b: true,
          sz: 32,
          shd: {
            fill: 'DDDDDD'
          },
          fontFamily: '黑体'
        }
      },
      {
        val: '评 级',
        opts: {
          cellColWidth: 1250,
          b: true,
          sz: 32,
          shd: {
            fill: 'DDDDDD'
          },
          fontFamily: '黑体'
        }
      },
      {
        val: '评 语',
        opts: {
          cellColWidth: 2000,
          b: true,
          sz: 32,
          shd: {
            fill: 'DDDDDD'
          },
          fontFamily: '黑体'
        }
      }
    ]
  ];

  let studentPlansStyle = {
    tableColWidth: 5000,
    tableSize: 16,
    tableAlign: 'left',
    tableFontFamily: 'Times New Roman'
  };

  let objPlans = {
    type: 'table',
    val: studentPlans,
    opt: studentPlansStyle
  };

  let objFooter = {
    type: 'text',
    val: '导出时间： ' + timeFormat(curTime),
    opt: {font_face: '宋体', color: 'DDDDDD', bold: true},
    lopt: {align: 'right'}
  };

  // fill data to studentPlans

  for (let i = 0; i < planArr.length; i++) {
    studentPlans.push([{
      val: i + 1,
      opts: {
        cellColWidth: 1000,
        b: true,
        sz: 24,
        fontFamily: '宋体'
      }
    },
      {
        val: planArr[i].content,
        opts: {
          cellColWidth: 4000,
          b: true,
          sz: 28,
          fontFamily: '宋体'
        }
      },
      {
        val: planArr[i].start + '-' + planArr[i].deadline,
        opts: {
          cellColWidth: 1800,
          b: true,
          sz: 24,
          fontFamily: '宋体'
        }
      },
      {
        val: planArr[i].rate,
        opts: {
          cellColWidth: 1800,
          b: true,
          sz: 24,
          fontFamily: '宋体'
        }
      },
      {
        val: planArr[i].remark,
        opts: {
          cellColWidth: 2000,
          b: true,
          sz: 24,
          fontFamily: '宋体'
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
      opt: {font_face: '黑体', bold: true, font_size: 18},
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
