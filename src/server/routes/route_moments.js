const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const urlLib = require('url');
const statusLib = require('../libs/status');

const Moment = db.Moment;
const Profile = db.Profile;

router.get('/fetch', function (req, res) {
  const type = urlLib.parse(req.url, true).query.type;
  let where = (type === 'all') ? {} : {type: type};

  Moment.findAll({
    where: where,
    limit: 20,
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
