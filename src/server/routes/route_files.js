const express = require('express');
const router = express.Router();

const sequelize = require('sequelize');
const db = require('../models/db_global');
const statusLib = require('../libs/status');
const pathLib = require('path');
const timeFormat = require('../middlewares/time_format');
const uid = require('../middlewares/id_gen');
const path = require('../app_paths');

const multer = require('multer');
const fs = require('fs');

const moment = require('../middlewares/moment');

const File = db.File;
const Profile = db.Profile;

let objMulter = multer({
  dest: path.sources // file upload destination
});

router.use(objMulter.any()); // any file type

/**
 *
 * 文件上传
 *
 * @api {post} /api/file/upload
 * @apiName fileUpload
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/upload', function (req, res) {
  // upload files: multipart/form-data

  const schoolId = req.body.school_id;
  const fileDescriptions = req.body.descriptions.split(',');

  let flag = 0;

  for (let i = 0; i < req.files.length; i++) {
    // for each file uploaded
    // rename a file
    let newName = req.files[i].path + pathLib.parse(req.files[i].originalname).ext;
    let downloadUrl = '/api/download?resource=' + req.files[i].filename + pathLib.parse(req.files[i].originalname).ext;

    fs.rename(req.files[i].path, newName, function (err) {
      if (err) {
        console.log('file rename error');
        return res.json(statusLib.FILE_RENAME_FAILED);
      }
    });

    let fileInfo = {
      file_id: 'fil' + uid.generate(),
      filename: req.files[i].originalname,
      size: req.files[i].size,
      url: downloadUrl,
      uploader_id: schoolId,
      description: fileDescriptions[i]
    };

    // create a record for table `files`
    File.create(fileInfo)
      .then(function () {
        flag++;
        if (flag === req.files.length) {
          moment.createMoment('resource', fileInfo.filename + ' | ' + fileInfo.description, fileInfo.url, fileInfo.uploader_id, fileInfo.file_id);
          res.json(statusLib.FILE_UPLOAD_SUCCESSFUL);
          console.log('file upload successful');
        }
      })
      .catch(function (e) {
        console.error(e);
        res.json(statusLib.CONNECTION_ERROR);
      });
  }
});

/**
 *
 * 获取文件列表
 *
 * @api {post} /api/file/query
 * @apiName fileQuery
 *
 * @apiSuccess {JSON} data Response data.
 *
 */
router.post('/query', function (req, res) {
  // fetch file list
  const request = req.body.request;
  const where = (request === 'all') ? {} : {uploader_id: request};

  File.findAll({
    where: where,
    order: [
      ['created_at', 'DESC']
    ],
    include: [{
      model: Profile,
      where: {
        school_id: sequelize.col('file.uploader_id')
      },
      attributes: ['name']
    }]
  })
    .then(function (files) {
      // convert to absolute dir
      for (let i = 0; i < files.length; i++) {
        files[i].dataValues.uploadTime = timeFormat(files[i].dataValues.created_at);
      }
      res.json(files);
      console.log('file list fetch successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

module.exports = router;
