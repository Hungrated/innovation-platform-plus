const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Meeting = db.Meeting;

/**
 *
 * 提交课堂记录
 *
 * @api {post} /api/meeting/submit
 * @apiName meetingSubmit
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/submit', function (req, res) { // publish a Meeting(project or event)
  Meeting.create(req.body)
    .then(function () {
      res.json(statusLib.MEETING_REC_SUBMIT_SUCCESSFUL);
      console.log('meeting record submit successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.MEETING_REC_SUBMIT_FAILED);
      console.log('meeting record submit failed');
    });
});

/**
 *
 * 获取课堂记录列表
 *
 * @api {post} /api/meeting/query
 * @apiName meetingQuery
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/query', function (req, res) { // publish a Meeting(project or event)
  Meeting.findAll({
    where: {
      student_id: req.body.student_id,
      class_id: req.body.cur_class
    },
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (meetings) {
      res.json(meetings);
      console.log('meeting record query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.MEETING_QUERY_FAILED);
      console.log('meeting record query failed');
    });
});

module.exports = router;
