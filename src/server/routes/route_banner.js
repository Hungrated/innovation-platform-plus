const express = require('express');
const router = express.Router();

const sequelize = require('sequelize');
const db = require('../models/db_global');
const statusLib = require('../libs/status');
const urlLib = require('url');
const timeFormat = require('../middlewares/time_format');

const uid = require('../middlewares/id_gen');
const Banner = db.Banner;

const path = require('../app_paths');
const pathLib = require('path');

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: path.banner // file upload destination
});

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

router.post('/upload', objMulter.any(), function (req, res, next) { // upload a banner img
  const id = 'bnr' + uid.generate();
  req.body.img_id = id;
  req.bannerURL = pathLib.join(path.banner, id + '.jpg');
  console.log('banner upload successful');
  next();

  // // check existance of previous banner file
  // Banner.findOne({
  //   where: {
  //     banner: '/api/download?banner=' + school_id + '.jpg'
  //   }
  // })
  //   .then(function (user) {
  //     if (user !== null) { // exists previous banner file: delete first
  //       fs.unlink(url, function (err) {
  //         if (err) throw err;
  //         else {
  //           console.log('previous banner file deleted');
  //           next();
  //         }
  //       });
  //     } else {
  //       next();
  //     }
  //   })
  //   .catch(function (e) {
  //     console.error(e);
  //     res.json(statusLib.CONNECTION_ERROR);
  //   });
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
    src: '/api/download?banner=' + req.body.img_id + '.jpg'
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

module.exports = router;
