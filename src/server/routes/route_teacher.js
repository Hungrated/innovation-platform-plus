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
const moment = require('../middlewares/moment');

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
    case 'class':
      database = db.Class;
      break;
    case 'banner':
      database = db.Banner;
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
      console.log('teacher: ' + query.type + ' query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

router.post('/delete', function (req, res, next) {
  let flag = 1;
  let database = null;
  let type = req.body.type;
  let where = {};
  switch (type) {
    case 'meeting':
      database = db.Meeting;
      where.rec_id = req.body.id;
      break;
    case 'comment':
      database = db.Comment;
      where.comment_id = req.body.id;
      break;
    case 'resource':
    case 'banner':
    case 'blog':
      flag = 0;
      next();
      break;
    default:
      res.json(statusLib.CONNECTION_ERROR);
  }
  if (flag) {
    database.destroy({ // need not to delete files
      where: where
    })
      .then(function () {
        res.json(statusLib.INFO_DELETE_SUCCESSFUL);
        // console.log('info delete successful');
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }

});

router.post('/delete', function (req, res, next) {
  if (req.body.type !== 'blog') {
    next();
  }
  let Blog = db.Blog;
  let Comment = db.Comment;
  Blog.destroy({ // need not to delete files
    where: {
      blog_id: req.body.id
    }
  })
    .then(function () {
      moment.deleteMoment(req.body.id);
      Comment.destroy({
        where: {
          blog_id: req.body.id
        }
      })
        .then(function () {
          res.json(statusLib.INFO_DELETE_SUCCESSFUL);
          console.log('blog & comments delete successful');
        })
        .catch(function (e) {
          console.error(e);
          res.json(statusLib.CONNECTION_ERROR);
        });
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });

});

router.post('/delete', function (req, res, next) {
  // let database = null;
  // let type = req.body.type;
  // let where = {};
  // if (type === 'blog') {
  //   where.blog_id = req.body.id;
  // } else {
  //   next();
  // }
});

module.exports = router;
