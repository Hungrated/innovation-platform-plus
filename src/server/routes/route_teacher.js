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

const Class = db.Class;
const User = db.User;
const Profile = db.Profile;

// query by type
router.post('/query', function (req, res, next) {
  console.log('query');
});

router.post('/query', function (req, res, next) {
  console.log('query');
});

module.exports = router;
