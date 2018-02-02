const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Class = db.Class;

/**
 *
 * 获取班级列表
 *
 * @api {get} /api/class/query class.query
 * @apiName classQuery
 * @apiGroup Class
 * @apiVersion 2.3.0
 * @apiPermission user.teacher
 *
 * @apiDescription 获取教师所带班级列表。
 *
 * @apiParam {Number} request 查询条件：教师编号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "request": 40429
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {Array} classArr 班级列表
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 6000,
 *     "msg": "班级获取成功",
 *     "classArr": [
 *         {
 *             "class_id": "(2017-2018-1)-S0500566-40429-2",
 *             "year": "2017-2018",
 *             "term": "1",
 *             "cname": "创新综合实践",
 *             "time": "周三第6,7节{第1-17周};周三第8,9节{第1-17周}",
 *             "loc": "第1教研楼608;第1教研楼608",
 *             "status": "active",
 *             "created_at": "2018-01-30T01:56:02.000Z",
 *             "updated_at": "2018-01-30T01:56:02.000Z",
 *             "teacher_id": 40429
 *         },
 *         {
 *             "class_id": "(2017-2018-1)-S0500560-40429-2",
 *             "year": "2017-2018",
 *             "term": "1",
 *             "cname": "创新综合实践",
 *             "time": "周六第6,7节{第1-17周};周六第8,9节{第1-17周}",
 *             "loc": "第1教研楼608;第1教研楼608",
 *             "status": "active",
 *             "created_at": "2018-01-23T17:17:28.000Z",
 *             "updated_at": "2018-01-23T17:17:28.000Z",
 *             "teacher_id": 40429
 *         }
 *     ]
 * }
 */
router.post('/query', function (req, res) {
  // class query
  const request = req.body.request;
  let where = {};

  if (typeof request === 'number') {
    where = {
      teacher_id: request,
      status: 'active'
    };
  }

  Class.findAll({
    where: where,
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (classArr) {
      if (!classArr.length) {
        console.log('classArr does not exist');
        return res.json(statusLib.CLASS_QUERY_NULL);
      }
      res.json({
        'status': statusLib.CLASS_QUERY_SUCCESSFUL.status,
        'msg': statusLib.CLASS_QUERY_SUCCESSFUL.msg,
        'classArr': classArr
      });
      console.log('class query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CLASS_QUERY_FAILED);
      console.log('class query failed');
    });
});

/**
 *
 * 切换班级状态
 *
 * @api {post} /api/class/switch class.switch
 * @apiName classSwitch
 * @apiGroup Class
 * @apiVersion 2.3.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师切换班级当前标记的状态。
 *
 * @apiParam {String} img_id 头像图片
 * @apiParam {Number} op 操作：0 存档；1 活跃
 * @apiParamExample {json} 请求示例
 * {
 *     "class_id": "(2017-2018-1)-S0500560-40429-2",
 *     "op": 0
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 6100,
 *     "msg": "班级状态更改成功"
 * }
 */
router.post('/switch', function (req, res) {
  Class.update({
    status: req.body.op ? 'active' : 'archived' // 0: archived 1: active
  }, {
    where: {
      class_id: req.body.class_id
    }
  })
    .then(function () {
      res.json(statusLib.CLASS_STATUS_CHANGE_SUCCESSFUL);
      console.log('class status change successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CLASS_QUERY_FAILED);
      console.log('class status change failed');
    });
});

module.exports = router;
