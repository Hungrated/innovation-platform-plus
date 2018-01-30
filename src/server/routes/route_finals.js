const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Final = db.Final;

const path = require('../app_paths');
const pathLib = require('path');
const urlLib = require('url');

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: path.final // file upload destination
});

/**
 *
 * 上传期末作业
 *
 * @api {post} /api/final/upload upload
 * @apiName finalUpload
 *
 * @apiSuccess {JSON} data Response data.
 *
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
 * 获取期末评分列表
 *
 * @api {post} /api/final/query query
 * @apiName finalQuery
 *
 * @apiSuccess {JSON} data Response data.
 *
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
 * @api {post} /api/final/rate rate
 * @apiName finalRate
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/rate', function (req, res) {
  // a teacher rates a course-work

  let calcRate = function (rt) {
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

  let calcRemark = function (rt) {
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

  const {
    cswk_id,
    rate,
    remark
  } = req.body;

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
 * @api {post} /api/final/delete delete
 * @apiName finalDelete
 *
 * @apiSuccess {JSON} data Response data.
 *
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
 * @api {post} /api/final/export export
 * @apiName finalExport
 *
 * @apiSuccess {file} data Response data.
 *
 */
router.post('/export', function (req, res, next) {
});

module.exports = router;
