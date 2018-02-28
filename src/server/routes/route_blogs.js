const express = require('express');
const router = express.Router();

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
const Image = db.Image;

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
 * @apiVersion 3.1.0
 * @apiPermission user
 *
 * @apiDescription 用户发表文章。
 *
 * @apiParam {String} type 文章类别
 * @apiParam {String} title 文章标题
 * @apiParam {String} group 文章分组
 * @apiParam {String} labels 文章标签列表
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
 *     "group": "技术交流",
 *     "labels": "1,2,6,15",
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
        blog_id: blog.blog_id,
        type: blog.type,
        author_id: blog.author_id
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
 * 从现有文件导入文章内容
 *
 * @api {post} /api/blog/import blog.import
 * @apiName blogImport
 * @apiGroup Blog
 * @apiVersion 2.5.0
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
 * @apiVersion 3.1.0
 * @apiPermission user
 *
 * @apiDescription 根据条件查询并获取文章列表。
 *
 * @apiParam request 查询条件(String|Object)
 * @apiParam {Boolean} carousel 是否提供轮播图列表
 * @apiParam {Number} limit 查询数限制
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
 * @apiParamExample {json} 请求示例3
 * {
 *     "request": {
 *         "group": "技术交流"
 *     },
 *     "limit": 8
 * }
 *
 * @apiParamExample {json} 请求示例4
 * {
 *     "request": {
 *         "labels": "1"
 *     },
 *     "carousel": false
 * }
 *
 * @apiSuccess {Array} data 文章列表列表
 */
router.post('/query', function (req, res) {
  const request = req.body.request;
  let where = {};
  if (typeof request === 'string' && request !== 'all') {
    where = {
      type: request
    };
  }
  if (typeof request === 'number') {
    where = {
      author_id: request
    };
  }
  if (typeof request === 'object') {
    if (!!request.group && request.group !== '所有文章') {
      where.group = request.group;
    }
    if (!!request.labels) {
      where.labels = {
        $or: []
      };
      let labelArr = request.labels.toString().split(',');
      for (let i = 0; i < labelArr.length; i++) {
        where.labels.$or.push({
          $like: '%,' + labelArr[i]
        });
        where.labels.$or.push({
          $like: labelArr[i] + ',%'
        });
        where.labels.$or.push({
          $like: '%,' + labelArr[i] + ',%'
        });
      }
    }
  }
  let query = {
    where: where,
    order: [
      ['created_at', 'DESC']
    ],
    include: [{
      model: Profile,
      attributes: ['name']
    }]
  };
  if (req.body.limit) {
    query.limit = req.body.limit;
  }
  Blog.findAll(query)
    .then(function (data) {
      for (let i = 0; i < data.length; i++) {
        data[i].dataValues.publishTime = timeFormat(data[i].dataValues.created_at);
      }
      let count = 0;
      let carouselList = [];
      if (req.body.carousel) {
        for (let i = 0; i < data.length; i++) {
          let item = data[i].dataValues;
          if (item.cover) {
            item.index = count++;
            carouselList.push(item);
          }
          if (count >= 9) {
            break;
          }
        }
      }
      res.json({
        articleList: data,
        carouselList: carouselList
      });
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
 * @apiVersion 2.5.0
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
    include: [
      {
        model: Profile,
        attributes: ['name']
      },
      {
        model: Comment,
        include: [
          {
            model: Profile,
            attributes: ['name']
          }
        ]
      },
      {
        model: Image,
        attributes: ['src']
      }
    ]
  })
    .then(function (data) {
      let blog = data.dataValues;
      blog.publishTime = timeFormat(data.dataValues.created_at);
      for (let i = 0; i < blog.comments.length; i++) {
        blog.comments[i].dataValues.submitTime = timeFormat(blog.comments[i].dataValues.created_at);
      }
      let images = blog.images;
      let comments = blog.comments;
      delete blog.images;
      delete blog.comments;
      let resData = {
        blog: blog,
        comments: comments
      };
      if (blog.type === 'event') {
        resData.images = images;
      }
      res.json(resData);
      console.log('fetch detail successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BLOG_DETAILS_FETCH_FAILED);
      console.log('fetch detail failed');
    });
});

/**
 *
 * 导出文章内容
 *
 * @api {post} /api/blog/export blog.export
 * @apiName blogExport
 * @apiGroup Blog
 * @apiVersion 2.5.0
 * @apiPermission user
 *
 * @apiDescription 用户导出文章内容到Markdown文档。
 *
 * @apiParam {String} blog_id 文章编号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "blog_id": "blg408695"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccess {String} url 文章导出文件下载地址
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 3400,
 *     "msg": "文章导出成功",
 *     "url": "/api/download?blog=blg408695"
 * }
 */
router.post('/export', function (req, res, next) {
  Blog.findByPrimary(req.body.blog_id, {
    include: [{
      model: Profile,
      attributes: ['name']
    }]
  })
    .then(function (data) {
      data.dataValues.publishTime = timeFormat(data.dataValues.created_at);
      req.blogData = data.dataValues;
      next();
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BLOG_DETAILS_FETCH_FAILED);
      console.log('fetch detail failed');
    });
});

router.post('/export', function (req, res, next) {
  const data = req.blogData;
  const header = `# ${data.title}  \n\n` +
    ` > ${data.profile.name} 发表于 ${data.publishTime}  \n\n` +
    `_描 述：${data.description}_  \n\n`;
  const outputText = header + data.content;
  const outputPath = pathLib.join(path.blogs, data.blog_id);
  const outputFile = pathLib.join(outputPath, `${data.blog_id}.md`);
  const downloadUrl = '/api/download?blog=' + data.blog_id;

  const writeFile = function (path, str, next) {
    fs.writeFile(path, str, function (err) {
      if (err) {
        console.err(err);
      }
      console.log('output: ' + path);
      next();
    });
  };

  req.downloadUrl = downloadUrl;
  fs.access(outputPath, function (err) {
    if (!(err && err.code === "ENOENT")) {
      writeFile(outputFile, outputText, next);
    } else {
      // noinspection JSAnnotator
      fs.mkdir(outputPath, 0777, function (err) {
        if (err) {
          console.log(err);
        } else {
          writeFile(outputFile, outputText, next);
        }
      });
    }
  });
});

router.post('/export', function (req, res) {
  res.json({
    status: statusLib.BLOG_EXPORT_SUCCESSFUL.status,
    msg: statusLib.BLOG_EXPORT_SUCCESSFUL.msg,
    url: req.downloadUrl
  });
});

module.exports = router;
