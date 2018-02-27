const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Label = db.Label;
//
// const path = require('../app_paths');
// const pathLib = require('path');
// const urlLib = require('url');
//
// const fs = require('fs');
// const multer = require('multer');


// router.post('/upload', objMulter.any(), function (req, res, next) {
//   // upload a course-work file
//   Final.findOne({
//     where: {
//       student_id: req.body.student_id,
//       class_id: req.body.class_id
//     }
//   })
//     .then(function (final) {
//       if (final.cswk_src) {
//         req.preExists = true;
//       }
//       req.cswk_id = final.cswk_id;
//       req.cswk_name = final.cswk_id + pathLib.parse(req.files[0].originalname).ext;
//       req.cswkURL = pathLib.join(path.final, final.cswk_id) + pathLib.parse(req.files[0].originalname).ext;
//       next();
//     })
//     .catch(function (e) {
//       console.error(e);
//       res.json(statusLib.CONNECTION_ERROR);
//     });
// });

/**
 *
 * 提交标签
 *
 * @api {post} /api/label/query label.query
 * @apiName labelQuery
 * @apiGroup Label
 * @apiVersion 3.0.0
 * @apiPermission user
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/query', function (req, res) {
  Label.findAll({
    where: {
      $or: [
        {
          category: 'both'
        },
        {
          category: req.body.type
        }
      ]
    }
  })
    .then(function (labels) {
      res.json(labels);
      console.log('label query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
      console.log('label query failed');
    });
});

/**
*
* 提交标签
*
* @api {post} /api/label/query label.query
* @apiName labelQuery
* @apiGroup Label
* @apiVersion 2.5.0
* @apiPermission user.teacher
*
* @apiSuccess {JSON} data Response data.
*
*/
router.post('/submit', function (req, res) {
  Label.create({
    name: req.body.name,
    category: req.body.category,
    adder_id: req.body.adder_id
  })
    .then(function (label) {
      res.json({
        status: statusLib.LABEL_CREATE_SUCCESSFUL.status,
        msg: statusLib.LABEL_CREATE_SUCCESSFUL.msg,
        label_id: label.label_id
      });
      console.log('label create successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.LABEL_CREATE_FAILED);
      console.log('label create failed');
    });
});

module.exports = router;
