const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const uid = require('../middlewares/id_gen');
const Final = db.Final;

const path = require('../app_paths');
const pathLib = require('path');

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: path.final // file upload destination
});

/**
 *
 * 上传期末作业
 *
 * @api {post} /api/final/upload
 * @apiName finalUpload
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/upload', objMulter.any(), function (req, res, next) {
  // upload a course-work file
  const id = 'cwk' + uid.generate();
  req.body.cswk_id = id;
  req.cswkURL = pathLib.join(path.final, id) + pathLib.parse(req.files[0].originalname).ext;
  console.log(req.cswkURL);
  console.log('course work upload successful');
  next();
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
  Final.create({
    cswk_id: req.body.cswk_id,
    class_id: req.body.class_id,
    student_id: req.body.student_id,
    cswk_src: '/api/download?cswk=' + req.body.cswk_id
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
 * 期末总评
 *
 * @api {post} /api/final/rate
 * @apiName finalRate
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/rate', function (req, res) {
  // a teacher rates a course-work
  const {
    cswk_id,
    rate,
    remark
  } = req.body;

  const modData = {
    rate: rate,
    remark: remark
  };

  Final.update(modData, {
    where: {
      cswk_id: cswk_id
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

/**
 *
 * 获取期末评分列表
 *
 * @api {post} /api/final/query
 * @apiName finalQuery
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/query', function (req, res, next) {
});

/**
 *
 * 导出期末成绩到Excel
 *
 * @api {post} /api/final/export
 * @apiName finalExport
 *
 * @apiSuccess {file} data Response data.
 *
 */
router.post('/export', function (req, res, next) {
});

module.exports = router;