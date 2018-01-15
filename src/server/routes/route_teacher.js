const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const pathLib = require('path');
const path = require('../app_paths');
const xl = require('node-xlrd');
const config = require('config-lite')(__dirname).database;

const sequelize = require('sequelize');
const db = require('../models/db_global');
const statusLib = require('../libs/status');

// query by type
router.post('/query', function (req, res, next) {
  req.body.where = {};
  next();
});

router.post('/query', function (req, res, next) {
  let database = null;
  switch (req.body.type) {
    case 'blog':
      database = db.Blog;
      break;
    case 'plan':
      database = db.Plan;
      break;
    case 'meeting':
      database = db.Meeting;
      break;
  }
  req.body.database = database;
  next();
});

router.post('/query', function (req, res, next) {
  const database = req.body.database;
  const where = req.body.where;

  database.findAll({
    where: where
  })
    .then(function (dataList) {
      res.json(dataList);
      console.log('teacher query successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

module.exports = router;
