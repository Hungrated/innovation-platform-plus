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
    default:
      res.json(statusLib.CONNECTION_ERROR);

  }
  console.log(query);
  database.findAll({
    where: where
  })
    .then(function (dataList) {
      res.json(dataList);
      console.log(dataList);
      console.log('teacher query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

module.exports = router;
