const express = require('express');
const router = express.Router();

const fs = require('fs');
const pathLib = require('path');
const path = require('../app_paths');

const urlLib = require('url');
const db = require('../models/db_global');
const statusLib = require('../libs/status');
const moment = require('../middlewares/moment');

/**
 *
 * （教师）获取全站信息列表
 *
 * @api {get} /api/teacher/query
 * @apiName teacherQuery
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.get('/query', function (req, res) {
  // query by type
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

/**
 *
 * （教师）删除信息
 *
 * @api {post} /api/teacher/delete
 * @apiName teacherDelete
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/delete', function (req, res, next) {
  let database = null;
  let type = req.body.type;
  let where = {};
  if (type !== 'meeting' && type !== 'comment') {
    next();
  } else {
    switch (type) {
      case 'meeting':
        database = db.Meeting;
        where.rec_id = req.body.id;
        break;
      case 'comment':
        database = db.Comment;
        where.comment_id = req.body.id;
        break;
      default:
        res.json(statusLib.CONNECTION_ERROR);
    }
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
  } else {
    let Blog = db.Blog;
    let Comment = db.Comment;
    Comment.destroy({
      where: {
        blog_id: req.body.id
      }
    })
      .then(function () {
        Blog.destroy({
          where: {
            blog_id: req.body.id
          }
        })
          .then(function () {
            moment.deleteMoment(req.body.id);
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
  }
});

router.post('/delete', function (req, res, next) {
  if (req.body.type !== 'banner') {
    next();
  } else {
    let Banner = db.Banner;
    let url = pathLib.join(path.banner, req.body.id + '.jpg');
    Banner.destroy({
      where: {
        img_id: req.body.id
      }
    })
      .then(function () {
        fs.unlink(url, function (err) {
          if (err) throw err;
          else {
            res.json(statusLib.INFO_DELETE_SUCCESSFUL);
            console.log('info & file delete successful');
          }
        });
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

router.post('/delete', function (req, res) {
  if (req.body.type !== 'resource') {
    res.json(statusLib.CONNECTION_ERROR);
    console.log('type error');
  } else {
    let File = db.File;
    File.findOne({
      where: {
        file_id: req.body.id
      }
    })
      .then(function (file) {
        let url = pathLib.join(path.sources, urlLib.parse(file.url, true).query.resource);
        fs.unlink(url, function (err) {
          if (err) throw err;
          else {
            File.destroy({
              where: {
                file_id: req.body.id
              }
            })
              .then(function () {
                moment.deleteMoment(req.body.id);
                res.json(statusLib.INFO_DELETE_SUCCESSFUL);
                console.log('info & file delete successful');
              })
              .catch(function (e) {
                console.error(e);
                res.json(statusLib.CONNECTION_ERROR);
              });
          }
        });
      })
      .catch(function (e) {
        console.error(e);
        console.log('error');
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

module.exports = router;
