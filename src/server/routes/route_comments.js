const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const Comment = db.Comment;

router.post('/submit', function (req, res) {
  const {
    student_id,
    blog_id,
    content
  } = req.body;
  Comment.create({
    content,
    student_id,
    blog_id
  })
    .then(function () {
      res.json(statusLib.COMMENT_SUCCESSFUL);
      console.log('comment successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.COMMENT_FAILED);
      console.log('publish failed');
    });
});

module.exports = router;
