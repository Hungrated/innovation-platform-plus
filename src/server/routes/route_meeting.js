const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Meeting = db.Meeting;

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

router.post('/query', function (req, res) { // publish a Meeting(project or event)
  Meeting.findAll({
    where: {
      student_id: req.body.student_id,
      class_id: req.body.cur_class
    }
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
