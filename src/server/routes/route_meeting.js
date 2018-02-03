const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Meeting = db.Meeting;

/**
 *
 * 提交课堂记录
 *
 * @api {post} /api/meeting/submit meeting.submit
 * @apiName meetingSubmit
 * @apiGroup Meeting
 * @apiVersion 2.4.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师提交课堂记录。
 *
 * @apiParam {String} date 记录日期
 * @apiParam {Number} student_id 用户编号
 * @apiParam {String} class_id 班级编号
 * @apiParam {String} content 记录内容
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "date": "2018-01-30",
 *     "student_id": 14051531,
 *     "class_id": "(2017-2018-1)-S0500560-40429-2",
 *     "content": "content0"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 7000,
 *     "msg": "记录提交成功"
 * }
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
 * @api {post} /api/meeting/query meeting.query
 * @apiName meetingQuery
 * @apiGroup Meeting
 * @apiVersion 2.4.0
 * @apiPermission user.student
 *
 * @apiDescription 根据条件获取课堂记录列表。
 *
 * @apiParam {Number} student_id 用户编号
 * @apiParam {String} cur_class 当前选课号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "student_id": 14051531,
 *     "cur_class": "(2017-2018-1)-S0500560-40429-2"
 * }
 *
 * @apiSuccess {Array} data 课堂记录列表
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * [
 *     {
 *         "rec_id": 56,
 *         "date": "2018-01-30",
 *         "content": "content0",
 *         "created_at": "2018-01-30T06:26:52.000Z",
 *         "updated_at": "2018-01-30T06:26:52.000Z",
 *         "student_id": 14051531,
 *         "class_id": "(2017-2018-1)-S0500560-40429-2"
 *     },
 *     {
 *         "rec_id": 55,
 *         "date": "2018-01-30",
 *         "content": "content1",
 *         "created_at": "2018-01-30T01:56:19.000Z",
 *         "updated_at": "2018-01-30T01:56:19.000Z",
 *         "student_id": 14051531,
 *         "class_id": "(2017-2018-1)-S0500560-40429-2"
 *     },
 *     {
 *         "rec_id": 54,
 *         "date": "2018-01-29",
 *         "content": "content2",
 *         "created_at": "2018-01-29T12:27:52.000Z",
 *         "updated_at": "2018-01-29T12:27:52.000Z",
 *         "student_id": 14051531,
 *         "class_id": "(2017-2018-1)-S0500560-40429-2"
 *     }
 * ]
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
