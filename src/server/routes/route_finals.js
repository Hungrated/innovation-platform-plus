const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Final = db.Final;
const Profile = db.Profile;

const path = require('../app_paths');
const pathLib = require('path');
const urlLib = require('url');

const fs = require('fs');
const multer = require('multer');

const async = require('async');
const officeGen = require('officegen');

let objMulter = multer({
  dest: path.final // file upload destination
});

/**
 *
 * 上传或更改期末作业
 *
 * @api {post} /api/final/upload final.upload
 * @apiName finalUpload
 * @apiGroup Final
 * @apiVersion 2.3.0
 * @apiPermission user.student
 *
 * @apiDescription 学生上传或更改期末作业。上传方式为form-data。仅支持上传zip文件。
 *
 * @apiParam {File} cswk 期末作业压缩包
 * @apiParam {String} class_id 学生选课号
 * @apiParam {Number} student_id 学生学号
 * @apiParamExample {formdata} 请求示例
 * {
 *     "cswk": <cswk.zip>,
 *     "school_id": 14051531,
 *     "student_id": 14051531
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
router.post('/upload', objMulter.any(), function (req, res, next) {
  // upload a course-work file
  Final.findOne({
    where: {
      student_id: req.body.student_id,
      class_id: req.body.class_id
    }
  })
    .then(function (final) {
      if (final.cswk_src) {
        req.preExists = true;
      }
      req.cswk_id = final.cswk_id;
      req.cswk_name = final.cswk_id + pathLib.parse(req.files[0].originalname).ext;
      req.cswkURL = pathLib.join(path.final, final.cswk_id) + pathLib.parse(req.files[0].originalname).ext;
      next();
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

router.post('/upload', function (req, res, next) {
  // delete previous file if exists
  fs.access(req.cswkURL, function (err) {
    if (err && err.code === 'ENOENT') {
      next();
    } else {
      fs.unlink(req.cswkURL, function (e) {
        if (e) throw e;
        else {
          console.log('previous course work deleted');
          next();
        }
      });
    }
  });
});

router.post('/upload', function (req, res, next) {
  // rename course work file
  fs.rename(req.files[0].path, req.cswkURL, function (err) {
    if (err) {
      console.log('course work file rename error');
      res.json(statusLib.FILE_RENAME_FAILED);
    } else { next(); }
  });
});

router.post('/upload', function (req, res) {
  // update database record
  Final.update({
    cswk_src: '/api/download?cswk=' + req.cswk_name
  }, {
    where: {
      cswk_id: req.cswk_id
    }
  })
    .then(function () {
      console.log('course work upload successful');
      res.json(statusLib.FILE_UPLOAD_SUCCESSFUL);
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 获取期末信息
 *
 * @api {post} /api/final/query final.query
 * @apiName finalQuery
 * @apiGroup Final
 * @apiVersion 2.3.0
 * @apiPermission user.student
 *
 * @apiDescription 获取期末信息。
 *
 * @apiParam {String} class_id 班级编号
 * @apiParam {Number} student_id 学生学号
 * @apiParamExample {json} 请求示例
 * {
 *     "class_id": "(2017-2018-1)-S0500560-40429-2"，
 *     "student_id": 14051531
 * }
 *
 * @apiSuccess {Array} data 期末总评列表
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * [
 *     {
 *         "cswk_id":"cwka05ae5",
 *         "class_id":"(2017-2018-1)-S0500560-40429-2",
 *         "cswk_src":"/api/download?cswk=cwka05ae5.zip",
 *         "rate":"A",
 *         "remark":"优 秀",
 *         "created_at":"2018-01-23T17:17:28.000Z",
 *         "updated_at":"2018-01-26T04:50:02.000Z",
 *         "student_id":14051531
 *     }
 * ]
 */
router.post('/query', function (req, res) {
  let where = {
    class_id: req.body.class_id
  };
  if (req.body.student_id) {
    where.student_id = req.body.student_id;
  }

  Final.findAll({
    where: where
  })
    .then(function (dataList) {
      res.json(dataList);
      console.log('final data query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 期末总评
 *
 * @api {post} /api/final/rate final.rate
 * @apiName finalRate
 * @apiGroup Final
 * @apiVersion 2.3.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师进行期末总评。
 *
 * @apiParam {String} cswk_id 期末总评编号
 * @apiParam {Number} rate 期末评级
 * @apiParam {String} remark 期末评语
 * @apiParamExample {json} 请求示例
 * {
 *     "cswk_id": "cwka05ae5",
 *     "student_id": 14051531
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 5300,
 *     "msg": "总评成功"
 * }
 */
router.post('/rate', function (req, res) {
  // a teacher rates a course-work

  const {
    cswk_id,
    rate,
    remark
  } = req.body;

  const calcRate = function (rt) {
    switch (rt) {
      case 5:
        return 'A';
      case 4:
        return 'B';
      case 3:
        return 'C';
      case 2:
        return 'D';
      default:
        return 'F';
    }
  };

  const calcRemark = function (rt) {
    switch (rt) {
      case 5:
        return '优 秀';
      case 4:
        return '良 好';
      case 3:
        return '中 等';
      case 2:
        return '及 格';
      default:
        return '不及格';
    }
  };

  const modData = {
    rate: calcRate(rate),
    remark: (remark && remark !== '') ? remark : calcRemark(rate)
  };

  Final.update(modData, {
    where: {
      cswk_id: cswk_id
    }
  })
    .then(function () {
      res.json(statusLib.PLAN_RATE_SUCCESSFUL);
      console.log('final rate successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.PLAN_RATE_FAILED);
      console.log('final rate failed');
    });
});

/**
 *
 * 删除期末作业
 *
 * @api {post} /api/final/delete final.delete
 * @apiName finalDelete
 * @apiGroup Final
 * @apiVersion 2.3.0
 * @apiPermission user.student
 *
 * @apiDescription 删除期末作业。
 *
 * @apiParam {String} cswk_src 期末作业下载链接
 * @apiParamExample {json} 请求示例
 * {
 *     "cswk_src":"/api/download?cswk=cwka05ae5.zip"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 8000,
 *     "msg": "信息删除成功"
 * }
 */
router.post('/delete', function (req, res, next) {
  const cswkName = urlLib.parse(req.body.cswk_src, true).query.cswk;
  const cswkURL = pathLib.join(path.final, cswkName);
  // delete cswk file if exists
  fs.access(cswkURL, function (err) {
    if (err && err.code === 'ENOENT') {
      console.log('delete: file no longer exists, skipped');
      next();
    } else {
      fs.unlink(cswkURL, function (e) {
        if (e) throw e;
        else {
          console.log('previous course work deleted');
          next();
        }
      });
    }
  });
});

router.post('/delete', function (req, res) {
  Final.update({
    cswk_src: null
  }, {
    where: {
      cswk_src: req.body.cswk_src
    }
  })
    .then(function () {
      res.json(statusLib.INFO_DELETE_SUCCESSFUL);
      console.log('course work delete successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 导出期末成绩到Excel
 *
 * @api {post} /api/final/export final.export
 * @apiName finalExport
 * @apiGroup Final
 * @apiVersion 2.3.0
 * @apiPermission user.teacher
 *
 * @apiDescription 导出当前班级的期末成绩表。
 *
 * @apiParam {String} class_id 班级选课号
 * @apiParamExample {json} 请求示例
 * {
 *     "class_id":"(2017-2018-1)-S0500560-40429-2"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {String} path 生成成绩表的链接信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 5600,
 *     "msg": "期末成绩表导出成功",
 *     "path": "/api/download?finals=final_export_(2017-2018-1)-S0500560-40429-2_1517479373965.xlsx"
 * }
 */
router.post('/export', function (req, res, next) {
  Profile.findAll({
    where: {
      cur_class: req.body.class_id
    },
    attributes: ['name', 'academy', 'class_id', 'grade', 'supervisor'],
    include: [{
      model: Final,
      where: {
        class_id: req.body.class_id
      },
      order: [
        ['created_at', 'DESC']
      ]
    }]
  })
    .then(function (finalList) {
      req.body.finalList = finalList;
      console.log('final query successful');
      next();
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
      console.log('moment fetch failed');
    });
});

router.post('/export', function (req, res) {
  // export final marks
  const cid = req.body.class_id;
  const finalList = req.body.finalList;

  const calcRemarkOutput = function (rt) {
    switch (rt) {
      case 'A':
        return '优 秀';
      case 'B':
        return '良 好';
      case 'C':
        return '中 等';
      case 'D':
        return '及 格';
      case 'F':
        return '不及格';
      default:
        return '';
    }
  };

  // get export time & set filename
  let curTime = new Date();
  let exportTime = new Date(curTime.getTime() - curTime.getTimezoneOffset() * 60 * 1000);

  // set filename
  let fileName = 'final_export_' + cid + '_' + exportTime.getTime() + '.xlsx';
  let filePath = pathLib.join(path.finalout, fileName);

  // create file
  let xlsx = officeGen({
    type: 'xlsx'
  });

  // officeGen.setVerboseMode ( true );

  xlsx.on('error', function (err) {
    console.log(err);
  });

  let sheet = xlsx.makeNewSheet();
  sheet.name = req.body.class_id;

  // The direct option - two-dimensional array:
  sheet.data[0] = ['创新实践期末成绩表'];
  sheet.data[1] = ['序 号', '学 号', '姓 名', '学 院', '班级号', '年 级', '选课号'];
  sheet.data[1][10] = '导 师';
  sheet.data[1][11] = '成 绩';
  sheet.data[1][12] = '评 语';

  for (let i = 0; i < finalList.length; i++) {
    let profile = finalList[i];
    let final = profile.finals[0];
    sheet.data[i + 2] = [
      i + 1,
      final.student_id,
      profile.name,
      profile.academy,
      profile.class_id,
      profile.grade,
      final.class_id
    ];
    sheet.data[i + 2][10] = profile.supervisor;
    sheet.data[i + 2][11] = calcRemarkOutput(final.rate);
    sheet.data[i + 2][12] = final.remark ? final.remark : '';
  }

  // export file
  let out = fs.createWriteStream(filePath);

  out.on('error', function (err) {
    console.log(err);
  });

  async.parallel([
    function (done) {
      out.on('close', function () {
        console.log('final export successful');
        res.json({
          status: statusLib.FINAL_EXPORT_SUCCESSFUL.status,
          msg: statusLib.FINAL_EXPORT_SUCCESSFUL.msg,
          path: '/api/download?finals=' + fileName
        });
        done(null);
      });
      xlsx.generate(out);
    }

  ], function (err) {
    if (err) {
      console.log('error: ' + err);
    }
  });
});

module.exports = router;
