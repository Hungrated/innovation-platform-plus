const express = require('express');
const router = express.Router();
const path = require('../app_paths');
const pathLib = require('path');
const urlLib = require('url');
const statusLib = require('../libs/status');

/**
 *
 * 下载文件
 *
 * @api {get} /api/download?:type=:id
 * @apiName download
 *
 * @apiSuccess {file} data Response data.
 *
 */
router.get('/', function (req, res) { // download a file
  const raw = urlLib.parse(req.url, true).query;
  let filename = null;
  let realPath = null;

  if (raw.resource) {
    filename = raw.resource;
    realPath = path.sources;
  } else if (raw.avatar) {
    filename = raw.avatar;
    realPath = path.avatars;
  } else if (raw.plans) {
    filename = raw.plans;
    realPath = path.plans;
  } else if (raw.banner) {
    filename = raw.banner;
    realPath = path.banner;
  } else if (raw.cswk) {
    filename = raw.cswk;
    realPath = path.final;
  }

  const realDir = pathLib.join(realPath, filename);

  res.download(realDir, function (err) {
    if (err) {
      console.log(err);
      res.json(statusLib.FILE_DOWNLOAD_FAILED);
    }
  });
});

module.exports = router;
