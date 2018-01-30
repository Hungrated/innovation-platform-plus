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

/**
 *
 * 发表文章
 *
 * @api {post} /api/blog/publish publish
 * @apiName blogPublish
 * @apiGroup Blog
 * @apiVersion 2.1.0
 * @apiPermission user
 *
 * @apiDescription 用户发表文章。
 *
 * @apiParam {String} type 文章类别
 * @apiParam {String} title 标题
 * @apiParam {String} description 简介
 * @apiParam {String} content 内容
 * @apiParam {String} [cover_url] 封面图地址
 * @apiParam {String} [photo_url] 所有图片地址
 * @apiParam {Number} aurhor_id 作者编号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "type": "project",
 *     "title": "title0",
 *     "description": "description0",
 *     "content": "content0",
 *     "cover_url": "",
 *     "photo_url": "",
 *     "author_id": 14051531
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 3000,
 *     "msg": "文章发布成功"
 * }
 */
router.post('/publish', function (req, res) {
  // publish a blog(project or event)
  let publishData = req.body;
  publishData.blog_id = 'blg' + uid.generate();

  let href = '/articles/details?index=' + publishData.blog_id;

  Blog.create(publishData)
    .then(function () {
      moment.createMoment('article', publishData.title, href, publishData.author_id, publishData.blog_id);
      res.json(statusLib.BLOG_PUB_SUCCESSFUL);
      console.log('publish successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BLOG_PUB_FAILED);
      console.log('publish failed');
    });
});

/**
 *
 * 获取文章列表
 *
 * @api {post} /api/blog/query query
 * @apiName blogQuery
 * @apiGroup Blog
 * @apiVersion 2.1.0
 * @apiPermission user
 *
 * @apiDescription 根据条件查询并获取文章列表。
 *
 * @apiParam request 查询条件：文章类型或用户编号
 *
 * @apiParamExample {json} 请求示例1
 * {
 *     "request": "project"
 * }
 *
 * @apiParamExample {json} 请求示例2
 * {
 *     "request": 14051531
 * }
 *
 * @apiSuccess {Array} data 文章列表信息
 */
router.post('/query', function (req, res) {
  // fetch blog list for brief browsing
  const request = req.body.request;
  const where = (typeof request === 'string') ? (
    (request === 'all') ? {} : {type: request}) : {author_id: request};

  Blog.findAll({
    where: where,
    order: [
      ['created_at', 'DESC']
    ],
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

/**
 *
 * 获取文章详情
 *
 * @api {get} /api/blog/details?index=:blog_id
 * @apiName blogDetails
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.get('/details', function (req, res) {
  // fetch blog details
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
        order: [
          ['created_at', 'DESC']
        ],
        include: [{
          model: Profile,
          where: {
            school_id: sequelize.col('comment.student_id')
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
