const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const uid = require('../middlewares/id_gen');
const Banner = db.Banner;
const Blog = db.Blog;

const path = require('../app_paths');
const pathLib = require('path');

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: pathLib.join(path.blogs, '__temp__')
});

/**
 *
 * 上传文章图片（用在发表文章中）
 *
 * @api {post} /api/image/upload image.upload
 * @apiName imageUpload
 * @apiGroup Image
 * @apiVersion 2.5.0
 * @apiPermission user
 *
 * @apiDescription 用户上传文章中的图片。
 *
 * @apiParam {formdata} imageList 文件列表
 *
 * @apiSuccess / 默认成功无返回
 */
router.post('/upload', objMulter.any(), function (req, res, next) {
  // upload images for an article
  let folderName = req.body.blog_id;
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

router.post('/upload', function (req, res) {
  let correctImgUrl = function (content, imgArr) {
    let contentCorrected = content;
    for (let i = 0; i < imgArr.length; i++) {
      let reg = new RegExp(`\(${imgArr[i][0]}\)`, 'g');
      contentCorrected.replace(reg, imgArr[i]);
      contentCorrected = contentCorrected.replace(reg, imgArr[i][1]);
    }
    return contentCorrected;
  };
  if(req.body.type === 'event') {
    res.end();
  } else {
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
  }
});

module.exports = router;
