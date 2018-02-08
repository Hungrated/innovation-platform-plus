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
 * @api {get} /api/teacher/query teacher.query
 * @apiName teacherQuery
 * @apiGroup Teacher
 * @apiVersion 2.6.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师根据查询条件获取全站信息列表。
 *
 * @apiParam type 查询类型 可选值有blog|image|plan|meeting|resource|comment|class|banner|label
 *
 * @apiParamExample {url} 请求示例
 * teacher/query?type=image
 *
 * @apiSuccess {Array} data 返回根据上述条件所请求的信息列表
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
    case 'image':
      database = db.Image;
      if (query.sid) {
        where.uploader_id = query.sid;
      }
      if (query.bid) {
        where.blog_id = query.bid
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
    case 'label':
      database = db.Label;
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
 * @api {post} /api/teacher/delete teacher.delete
 * @apiName teacherDelete
 * @apiGroup Teacher
 * @apiVersion 2.6.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师根据查询条件删除特定信息。
 *
 * @apiParam {String} type 目标信息类型："blog"|"meeting"|"resource"|"comment"|"banner"|"label"
 * @apiParam {String} id 目标信息编号
 *
 * @apiParamExample {json} 请求示例
 * {
 *     "type": "resource",
 *     "id": "fil963a43"
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 8000,
 *     "msg": "信息删除成功"
 * }
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
    let removeDir = function (fileUrl) {
      let files = fs.readdirSync(fileUrl);
      files.forEach(function (file) {
        fs.unlinkSync(fileUrl + '/' + file);
      });
      fs.rmdirSync(fileUrl);
    };
    let Blog = db.Blog;
    let Comment = db.Comment;
    let Image = db.Image;
    Comment.destroy({
      where: {
        blog_id: req.body.id
      }
    })
      .then(function () {
        Image.destroy({
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
                let dir = pathLib.join(path.blogs, req.body.id);
                fs.access(dir, function (err) {
                  if (!(err && err.code === 'ENOENT')) {
                    removeDir(dir);
                    console.log('Images of this article has been removed.');
                  } else {
                    console.log('This article has no images. Skipped.');
                  }
                });
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
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

router.post('/delete', function (req, res, next) {
  if (req.body.type !== 'image') {
    next();
  } else {
    let Blog = db.Blog;
    let Image = db.Image;

    Image.findByPrimary(req.body.id)
      .then(function (image) {
        let blogId = image.blog_id;
        let imageId = image.image_id;
        let imageUrl = pathLib.join(path.blogs, image.src.split(`/images/blogs/${blogId}/`)[1]);
        fs.access(imageUrl, function (err) {
          if (!(err && err.code === 'ENOENT')) {
            fs.unlinkSync(imageUrl);
            console.log('Image has been removed.');
          } else {
            console.log('Image not found. Skipped.');
          }
          Image.destroy({
            where: {
              image_id: imageId
            }
          })
            .then(function () {
              res.json(statusLib.INFO_DELETE_SUCCESSFUL);
              console.log('image delete successful');
            })
            .catch(function (e) {
              console.error(e);
              res.json(statusLib.CONNECTION_ERROR);
            });
        });
        Blog.findByPrimary(blogId)
          .then(function (blog) {
            if(blog.type === 'project') {
              let newContent = blog.content.replace(image.src, '');
              Blog.update({
                content: newContent
              }, {
                where: {
                  blog_id: blogId
                }
              })
            }
          })
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
    Banner.findOne({
      where: {
        img_id: req.body.id
      }
    }).then(function (banner) {
      Banner.destroy({
        where: {
          img_id: req.body.id
        }
      })
        .then(function () {
          let url = pathLib.join(path.banner, banner.src.match(/banner\/(\S*)/)[1]);
          fs.access(url, function (err) {
            if (err && err.code === 'ENOENT') {
              console.log('delete: file no longer exists, skipped');
              res.json(statusLib.INFO_DELETE_SUCCESSFUL);
            } else {
              fs.unlink(url, function (err) {
                if (err) throw err;
                else {
                  res.json(statusLib.INFO_DELETE_SUCCESSFUL);
                  console.log('info & file delete successful');
                }
              });
            }
          });
        })
        .catch(function (e) {
          console.error(e);
          res.json(statusLib.CONNECTION_ERROR);
        });
    });
  }
});

router.post('/delete', function (req, res, next) {
  // delete file if exists
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
        fs.access(url, function (err) {
          if (err && err.code === 'ENOENT') {
            console.log('delete: file no longer exists, skipped');
            next();
          } else {
            fs.unlink(url, function (err) {
              if (err) throw err;
              else {
                next();
              }
            });
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
  // delete resource record
  let File = db.File;
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
});

module.exports = router;
