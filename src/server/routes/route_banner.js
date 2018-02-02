const express = require('express');
const router = express.Router();

const db = require('../models/db_global');
const statusLib = require('../libs/status');

const uid = require('../middlewares/id_gen');
const Banner = db.Banner;

const path = require('../app_paths');
const pathLib = require('path');

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: path.banner // file upload destination
});

/**
 *
 * 获取首页轮播图列表
 *
 * @api {get} /api/banner banner.fetch
 * @apiName fetch
 * @apiGroup Banner
 * @apiVersion 2.1.0
 * @apiPermission all
 *
 * @apiDescription 获取首页轮播图列表。
 *
 * @apiSuccess {Array} data 轮播图列表
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * [
 *     {
 *         "img_id": "bnr7e8d5d",
 *         "src": "/api/download?banner=bnr7e8d5d.jpg",
 *         "status": "active",
 *         "created_at": "2018-01-26T09:19:36.000Z",
 *         "updated_at": "2018-01-26T09:19:36.000Z",
 *         "uploader_id": 40429
 *     },
 *     {
 *         "img_id": "bnr799d27",
 *         "src": "/api/download?banner=bnr799d27.jpg",
 *         "status": "active",
 *         "created_at": "2018-01-26T09:19:30.000Z",
 *         "updated_at": "2018-01-26T09:19:30.000Z",
 *         "uploader_id": 40429
 *     }
 * ]
 */
router.get('/', function (req, res) {
  Banner.findAll({
    where: {
      status: 'active'
    },
    order: [
      ['created_at', 'DESC']
    ]
  })
    .then(function (imgList) {
      console.log('banner fetch successful');
      res.json(imgList);
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 上传首页轮播图
 *
 * @api {post} /api/banner/upload banner.upload
 * @apiName bannerUpload
 * @apiGroup Banner
 * @apiVersion 2.1.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师上传首页轮播图。上传方式为form-data。
 *
 * @apiParam {File} banner 头像图片
 * @apiParam {Number} uploader_id 上传者编号
 * @apiParamExample {formdata} 请求示例
 * {
 *     "banner": <banner.jpg>,
 *     "uploader_id": 40429
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 8100,
 *     "msg": "轮播图上传成功"
 * }
 */
router.post('/upload', objMulter.any(), function (req, res, next) { // upload a banner img
  const id = 'bnr' + uid.generate();
  req.body.img_id = id;
  req.bannerURL = pathLib.join(path.banner, id + '.jpg');
  console.log('banner upload successful');
  next();
});

router.post('/upload', function (req, res, next) { // rename banner file
  fs.rename(req.files[0].path, req.bannerURL, function (err) {
    if (err) {
      console.log('banner file rename error');
      res.json(statusLib.FILE_RENAME_FAILED);
    } else { next(); }
  });
});

router.post('/upload', function (req, res) { // update database record
  Banner.create({
    img_id: req.body.img_id,
    status: 'active',
    uploader_id: req.body.uploader_id,
    src: '/images/banner/' + req.body.img_id + '.jpg'
  })
    .then(function () {
      console.log('banner upload successful');
      res.json(statusLib.BANNER_IMG_UPLOAD_SUCCESSFUL);
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

/**
 *
 * 切换首页轮播图状态
 *
 * @api {post} /api/banner/switch banner.switch
 * @apiName bannerSwitch
 * @apiGroup Banner
 * @apiVersion 2.1.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师切换首页轮播图状态。
 *
 * @apiParam {String} img_id 头像图片
 * @apiParam {Number} op 操作：0 存档；1 活跃
 * @apiParamExample {json} 请求示例
 * {
 *     "img_id": "bnr7e8d5d",
 *     "op": 0
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 8200,
 *     "msg": "轮播图状态更改成功"
 * }
 */
router.post('/switch', function (req, res) {
  Banner.update({
    status: req.body.op ? 'active' : 'archived' // 0: archived 1: active
  }, {
    where: {
      img_id: req.body.img_id
    }
  })
    .then(function () {
      res.json(statusLib.BANNER_IMG_STATUS_CHANGE_SUCCESSFUL);
      console.log('banner img status change successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.BANNER_IMG_STATUS_CHANGE_FAILED);
      console.log('banner img status change failed');
    });
});

/**
 *
 * 修改当前首页轮播图
 *
 * @api {post} /api/banner/modify banner.modify
 * @apiName bannerModify
 * @apiGroup Banner
 * @apiVersion 2.1.0
 * @apiPermission user.teacher
 *
 * @apiDescription 教师修改首页轮播图。图片上传方式为form-data。
 *
 * @apiParam {File} banner 首页轮播图
 * @apiParam {String} img_id 轮播图编号
 * @apiParamExample {formdata} 请求示例
 * {
 *     "banner": <banner.jpg>,
 *     "img_id": "bnr7e8d5d",
 * }
 *
 * @apiSuccess {Number} status 状态代码
 * @apiSuccess {String} msg 反馈信息
 * @apiSuccessExample {json} 成功返回示例
 * HTTP/1.1 200 OK
 * {
 *     "status": 8300,
 *     "msg": "轮播图更改成功"
 * }
 */
router.post('/modify', objMulter.any(), function (req, res) {
  // check existence of previous banner image file
  const id = req.body.img_id;
  const url = pathLib.join(path.banner, id + '.jpg');
  Banner.findOne({
    where: {
      src: '/images/banner/' + id + '.jpg'
    }
  })
    .then(function () {
      fs.unlink(url, function (err) {
        if (err) throw err;
        else {
          console.log('previous banner file deleted');
          fs.rename(req.files[0].path, pathLib.join(path.banner, id + '.jpg'), function (err) {
            if (err) {
              console.log('banner file rename error');
              res.json(statusLib.FILE_RENAME_FAILED);
            } else {
              res.json(statusLib.BANNER_IMG_MOD_SUCCESSFUL);
              console.log('banner img mod successful');
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

module.exports = router;
