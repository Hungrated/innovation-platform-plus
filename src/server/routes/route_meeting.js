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

module.exports = router;
