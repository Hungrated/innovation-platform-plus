const express = require('express');
const router = express.Router();

const sequelize = require('sequelize');
const db = require('../models/db_global');
const statusLib = require('../libs/status');
const urlLib = require('url');
const timeFormat = require('../middlewares/time_format');
const uid = require('../middlewares/id_gen');

const moment = require('../middlewares/moment');

const Blog = db.Blog;
const Profile = db.Profile;
const Comment = db.Comment;

router.post('/publish', function (req, res) { // publish a blog(project or event)
  let publishData = req.body;
  publishData.blog_id = 'blg' + uid.generate();

  let href = '/articles/details?index=' + publishData.blog_id;

  Blog.create(publishData)
    .then(function () {
      moment.createMoment('article', publishData.title, href, publishData.author_id);
      res.json(statusLib.BLOG_PUB_SUCCESSFUL);
      console.log('publish successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BLOG_PUB_FAILED);
      console.log('publish failed');
    });
});

router.post('/query', function (req, res) { // fetch blog list for brief browsing

  const request = req.body.request;
  const where = (typeof request === 'string') ? (
    (request === 'all') ? {} : {type: request}) : {author_id: request};

  Blog.findAll({
    where: where,
    include: [{
      model: Profile,
      attributes: ['name']
    }]
  })
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].dataValues.publishTime = timeFormat(data[i].dataValues.created_at);
      }
      res.json(data);
      console.log('query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BLOG_LIST_FETCH_FAILED);
      console.log('query failed');
    });
});

router.get('/details', function (req, res) { // fetch blog details

  const id = urlLib.parse(req.url, true).query.index;
  Blog.findByPrimary(id, {
    include: [{
      model: Profile,
      where: {
        school_id: sequelize.col('blog.author_id')
      },
      attributes: ['name']
    }]
  })
    .then(function (data) {
      data.dataValues.publishTime = timeFormat(data.dataValues.created_at);
      Comment.findAll({
        where: {
          blog_id: id
        },
        include: [{
          model: Profile,
          where: {
            school_id: sequelize.col('comment.student_id'),
          },
          attributes: ['name']
        }]
      })
        .then(function (comments) {
          for (let i = 0; i < comments.length; i++) {
            comments[i].dataValues.submitTime = timeFormat(comments[i].dataValues.created_at);
          }
          res.json({
            blog: data,
            comments: comments
          });
          console.log('fetch detail successful');
        })
        .catch(function (e) {
          console.error(e);
          res.json(statusLib.BLOG_DETAILS_FETCH_FAILED);
          console.log('fetch detail failed');
        });
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BLOG_DETAILS_FETCH_FAILED);
      console.log('fetch detail failed');
    });
});

module.exports = router;
