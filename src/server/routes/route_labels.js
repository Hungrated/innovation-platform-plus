const express = require('express');
const router = express.Router();

// const db = require('../models/db_global');
// const statusLib = require('../libs/status');
//
// const Final = db.Final;
//
// const path = require('../app_paths');
// const pathLib = require('path');
// const urlLib = require('url');

/**
 *
 * 获取标签列表
 *
 * @api {post} /api/label/query label.query
 * @apiName labelQuery
 * @apiGroup Label
 * @apiVersion 2.0.0
 * @apiPermission user.teacher
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
// router.post('/upload', function (req, res, next) {
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

module.exports = router;
