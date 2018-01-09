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
    include: [{
      model: Profile,
      attributes: ['name', 'student_id']
    }]
  })
    .then(function () {
      res.json(statusLib.MOMENT_FETCH_SUCCESSFUL);
      console.log('comment successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.MOMENT_FETCH_FAILED);
      console.log('publish failed');
    });
});

module.exports = router;
