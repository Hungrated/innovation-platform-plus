const express = require('express');
const router = express.Router();
// const pathLib = require('path');
// const path = require('../app_paths');
//
// const timeFormat = require('../middlewares/time_format');
// const uid = require('../middlewares/id_gen');

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Class = db.Class;
// const Profile = db.Profile;

// const async = require('async');
// const fs = require('fs');
// const officeGen = require('officegen');

router.post('/query', function (req, res) { // class query
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
