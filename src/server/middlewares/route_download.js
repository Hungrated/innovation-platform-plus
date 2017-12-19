const express = require('express');
const router = express.Router();
const path = require('../app_paths');
const pathLib = require('path');
const urlLib = require('url');
const statusLib = require('../libs/status');

router.get('/', function (req, res) { // download a file

  const filename = urlLib.parse(req.url, true).query.resource;
  const realPath = path.sources;
  const realDir = pathLib.join(realPath, filename);

  res.download(realDir, function (err) {
    if (err) {
      console.log(err);
      res.json(statusLib.FILE_DOWNLOAD_FAILED);
    }
  });

});

module.exports = router;
