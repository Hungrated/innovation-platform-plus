const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const urlLib = require('url');
const statusLib = require('../libs/status');

const Moment = db.Moment;
const Profile = db.Profile;

/**
 *
 * 获取动态列表
 *
 * @api {get} /api/moment/fetch?type=:type&limit=:limit moment.fetch
 * @apiName momentFetch
 * @apiGroup Moment
 * @apiVersion 2.4.0
 * @apiPermission all
 *
 * @apiDescription 获取动态列表。
 * 可选择类型："all"所有，"blog"文章，"resource"资源文件，"planmod"计划更新。
 * 可限制条目数："limit"
 *
 * @apiParamExample {url} 请求示例
 * moment/fetch?type=all|blog|resource|planmod&limit=40
 *
 * @apiSuccess {Array} data 动态列表
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * [
 *     {
 *         "moment_id":53,
 *         "type": "planmod",
 *         "desc": "创新实践平台开发V2.0.0  ( 2018-01-04 - 2018-01-19 )",
 *         "href": "已通过",
 *         "uid": "pln9c43dc",
 *         "created_at": "2018-01-30T05:53:44.000Z",
 *         "updated_at": "2018-01-30T06:26:36.000Z",
 *         "student_id": 14051531,
 *         "profile": {
 *             "name":"章梓航"
 *         }
 *     },
 *     {
 *         "moment_id":53,
 *         "type": "planmod",
 *         "desc": "创新实践平台开发  ( 2017-10-11 - 2017-12-29 )",
 *         "href": "已修改",
 *         "uid": "m_pln9c43dc",
 *         "created_at": "2018-01-30T05:53:44.000Z",
 *         "updated_at": "2018-01-30T05:53:44.000Z",
 *         "student_id": 14051531,
 *         "profile": {
 *             "name":"章梓航"
 *         }
 *     }
 * ]
 */
router.get('/fetch', function (req, res) {
  const sid = urlLib.parse(req.url, true).query.sid;
  const type = urlLib.parse(req.url, true).query.type;
  const limit = urlLib.parse(req.url, true).query.limit;
  let where = {};
  if (sid) {
    where.student_id = sid;
  } else if (type) {
    where = (type === 'all') ? {} : {type: type};
  }
  Moment.findAll({
    where: where,
    limit: Number(limit),
    order: [
      ['created_at', 'DESC']
    ],
    include: [{
      model: Profile,
      attributes: ['name']
    }]
  })
    .then(function (moments) {
      res.json(moments);
      console.log('moment fetch successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.MOMENT_FETCH_FAILED);
      console.log('moment fetch failed');
    });
});

module.exports = router;
