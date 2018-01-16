const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const pathLib = require('path');
const path = require('../app_paths');
const xl = require('node-xlrd');
const config = require('config-lite')(__dirname).database;

const sequelize = require('sequelize');

const urlLib = require('url');
const db = require('../models/db_global');
const statusLib = require('../libs/status');

// query by type
router.get('/query', function (req, res) {
  let query = urlLib.parse(req.url, true).query;
  let where = {};
  let database = null;
  switch (query.type) {
    case 'blog':
      database = db.Blog;
      if (query.sid) {
        where.author_id = query.sid;
      }
      break;
    case 'plan':
      database = db.Plan;
      if (query.sid) {
        where.student_id = query.sid;
      }
      break;
    case 'meeting':
      database = db.Meeting;
      if (query.sid) {
        where.student_id = query.sid;
      }
      break;
    case 'resource':
      database = db.File;
      if (query.sid) {
        where.uploader_id = query.sid;
      }
      break;
    case 'comment':
      database = db.Comment;
      if (query.sid) {
        where.student_id = query.sid;
      }
      break;
    default:
      res.json(statusLib.CONNECTION_ERROR);
  }
  database.findAll({
    where: where,
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (dataList) {
      res.json(dataList);
      console.log('teacher query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

router.post('/delete', function (req, res) {
  let database = null;
  let where = {};
  switch (req.body.type) {
    case 'blog':
      database = db.Blog;
      where.blog_id = req.body.id;
      break;
    case 'plan':
      database = db.Plan;
      where.plan_id = req.body.id;
      break;
    case 'meeting':
      database = db.Meeting;
      where.rec_id = req.body.id;
      break;
    default:
      res.json(statusLib.CONNECTION_ERROR);
  }
  database.destroy({
    where: where
  })
    .then(function () {
      res.json(statusLib.INFO_DELETE_SUCCESSFUL);
      console.log('info delete successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

module.exports = router;
