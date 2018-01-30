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
 *
 * @apiSuccess {JSON} data Response data.
 *
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
