const express = require('express');
const router = express.Router();

const sequelize = require('sequelize');
const db = require('../models/db_global');
const statusLib = require('../libs/status');
const urlLib = require('url');
const timeFormat = require('../middlewares/time_format');
const uid = require('../middlewares/id_gen');

const fs = require('fs');
const multer = require('multer');
const path = require('../app_paths');
const pathLib = require('path');

const moment = require('../middlewares/moment');

const Blog = db.Blog;
const Profile = db.Profile;
const Comment = db.Comment;

let objMulter = multer({
  dest: pathLib.join(path.blogs, '__temp__')
});

/**
 *
 * 发表文章
 *
 * @api {post} /api/blog/publish blog.publish
 * @apiName blogPublish
 * @apiGroup Blog
 * @apiVersion 2.3.0
 * @apiPermission user
 *
 * @apiDescription 用户发表文章。
 *
 * @apiParam {String} type 文章类别
 * @apiParam {String} title 文章标题
 * @apiParam {String} description 文章简介
 * @apiParam {String} content 文章内容
 * @apiParam {String} [cover_url] 文章封面图地址
 * @apiParam {String} [photo_url] 文章所有图片地址
 * @apiParam {Number} aurhor_id 文章作者编号
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
    .then(function (blog) {
      moment.createMoment('article', publishData.title, href, publishData.author_id, publishData.blog_id);
      res.json({
        status: statusLib.BLOG_PUB_SUCCESSFUL.status,
        msg: statusLib.BLOG_PUB_SUCCESSFUL.msg,
        blog_id: blog.blog_id
      });
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
 * 上传文章中的图片（用在发表文章中）
 *
 * @api {post} /api/blog/imgupload blog.imgUpload
 * @apiName blogImgUpload
 * @apiGroup Blog
 * @apiVersion 2.1.0
 * @apiPermission user
 *
 * @apiDescription 用户上传文章中的图片。
 *
 * @apiParam {array} imageList 文件列表
 *
 * @apiSuccess end 默认成功无返回
 */
router.post('/imgupload', objMulter.any(), function (req, res, next) {
  // upload images for an article
  let id = req.body.blog_id;
  let folderName = id;
  let dir = pathLib.join(path.blogs, folderName);
  let imgArr = [];
  // noinspection JSAnnotator
  fs.mkdir(dir, 0777, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(dir + ' created.');
      for (let i = 0; i < req.files.length; i++) {
        // for each file uploaded
        // rename & move a file
        let newFilename = req.files[i].filename + pathLib.parse(req.files[i].originalname).ext;
        // seem to have problems
        console.log(newFilename);
        let newDir = pathLib.join(dir, newFilename);
        let newUrl = path.host + '/images/blogs/' + folderName + '/' + newFilename;
        fs.rename(req.files[i].path, newDir, function (err) {
          if (err) {
            console.log(err);
            console.log('file rename & move error');
            return res.json(statusLib.FILE_RENAME_FAILED);
          }
        });
        imgArr.push([req.files[i].fieldname, newUrl]);
        if (i === req.files.length - 1) {
          req.imgArr = imgArr;
          next();
        }
      }
    }
  });
});

router.post('/imgupload', function (req, res) {
  let correctImgUrl = function (content, imgArr) {
    let contentCorrected = content;
    for (let i = 0; i < imgArr.length; i++) {
      let reg = new RegExp(`\(${imgArr[i][0]}\)`, 'g');
      contentCorrected = contentCorrected.replace(reg, imgArr[i][1]);
    }
    return contentCorrected;
  };
  Blog.findByPrimary(req.body.blog_id)
    .then(function (profile) {
      Blog.update({
        content: correctImgUrl(profile.content, req.imgArr)
      }, {
        where: {
          blog_id: req.body.blog_id
        }
      })
        .then(function () {
          res.end();
        })
        .catch(function (e) {
          console.log(e);
          res.json(statusLib.PLAN_EXPORT_FAILED);
        });
    })
    .catch(function (e) {
      console.log(e);
      res.json(statusLib.PLAN_EXPORT_FAILED);
    });
});

/**
 *
 * 从现有文件导入文章内容
 *
 * @api {post} /api/blog/import blog.import
 * @apiName blogImport
 * @apiGroup Blog
 * @apiVersion 2.3.0
 * @apiPermission user
 *
 * @apiDescription 用户导入文章内容。
 *
 * @apiParam {file} file 含有文本内容的文件
 * @apiParam {String} type 文件类型
 *
 * @apiParamExample {formdata} 请求示例
 * {
 *     "file": <text.md>,
 *     "type": "md"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {String} content 导入的文章内容
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 3300,
 *     "msg": "文章导入成功",
 *     "content": "`机器学习` 是使用计算机来彰显数据背后的真实含义，它为了把无序的数据转换成有用的信息。"
 * }
 */
router.post('/import', objMulter.any(), function (req, res, next) {
  // upload text file
  console.log('text file upload successful');
  if (req.body.type === 'word') {
    next();
  } else {
    fs.readFile(req.files[0].path, function (err, data) {
      if (err) {
        console.err(err);
        console.log('blog import failed');
        res.json(statusLib.BLOG_IMPORT_FAILED);
      } else {
        console.log('blog import successful');
        res.json({
          status: statusLib.BLOG_IMPORT_SUCCESSFUL.status,
          msg: statusLib.BLOG_IMPORT_SUCCESSFUL.msg,
          content: data.toString()
        });
        fs.unlink(req.files[0].path, function (err) {
          if (err) {
            console.err(err);
          }
        });
      }
    });
  }
});

router.post('/import', function (req, res) {
  console.log('text file upload successful');
  res.json({
    status: statusLib.BLOG_IMPORT_SUCCESSFUL.status,
    msg: statusLib.BLOG_IMPORT_SUCCESSFUL.msg,
    content: 'word'
  });
});

/**
 *
 * 获取文章列表
 *
 * @api {post} /api/blog/query blog.query
 * @apiName blogQuery
 * @apiGroup Blog
 * @apiVersion 2.3.0
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
 * @apiSuccess {Array} data 文章列表列表
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
 * @api {get} /api/blog/details?index=:blog_id blog.details
 * @apiName blogDetails
 * @apiGroup Blog
 * @apiVersion 2.3.0
 * @apiPermission user
 *
 * @apiDescription 根据文章编号获取文章详细信息。
 *
 * @apiParamExample {url} 请求示例
 * details?index=blg782148
 *
 * @apiSuccess {Object} blog 文章列表信息
 * @apiSuccess {Array} comments 文章列表信息
 *
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "blog": {
 *         "blog_id": "blg782148",
 *         "type": "project",
 *         "labels": null,
 *         "title": "title0",
 *         "description": "desccription0",
 *         "content": "content0",
 *         "cover_url": "",
 *         "photo_url": "",
 *         "created_at": "2018-01-30T03:35:15.000Z",
 *         "updated_at": "2018-01-30T03:35:15.000Z",
 *         "author_id": 14051531,
 *         "profile": {
 *             "name": "章梓航"
 *         },
 *         "publishTime": "2018-01-30 11:35:15"
 *     },
 *     "comments": [
 *         {
 *             "comment_id": 2,
 *             "content": "comment1",
 *             "created_at": "2018-01-30T03:37:29.000Z",
 *             "updated_at": "2018-01-30T03:37:29.000Z",
 *             "blog_id": "blg782148",
 *             "student_id": 14051531,
 *             "profile": {
 *                 "name": "章梓航"
 *             },
 *             "submitTime": "2018-01-30 11:37:29"
 *         },
 *         {
 *             "comment_id": 1,
 *             "content": "comment0",
 *             "created_at": "2018-01-30T03:37:24.000Z",
 *             "updated_at": "2018-01-30T03:37:24.000Z",
 *             "blog_id": "blg782148",
 *             "student_id": 14051531,
 *             "profile": {
 *                 "name": "章梓航"
 *             },
 *             "submitTime": "2018-01-30 11:37:24"
 *         }
 *     ]
 * }
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
