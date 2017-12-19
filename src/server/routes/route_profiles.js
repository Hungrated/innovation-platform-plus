const express = require('express');
const router = express.Router();
const path = require('../app_paths');
const pathLib = require('path');

const db = require('../models/db_global');
const statusLib = require('../libs/status');
const Profile = db.Profile;

const fs = require('fs');
const multer = require('multer');

let objMulter = multer({
  dest: path.avatars // file upload destination
});

router.post('/modify', function (req, res) { // modify a profile
  const {
    school_id,
    sex,
    birth_date,
    phone_num,
    description
  } = req.body;
  const modData = {
    sex: sex,
    birth_date: birth_date,
    phone_num: phone_num,
    description: description
  };

  Profile.update(modData, {
    where: {
      school_id: school_id
    }
  })
    .then(function () {
      res.json(statusLib.PROFILE_MOD_SUCCESSFUL);
      console.log('modify successful');
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

router.post('/avatar', objMulter.any(), function (req, res, next) { // upload an avatar
  const school_id = req.body.school_id; // id is school_id
  const url = pathLib.join(path.avatars, school_id + '.jpg');
  req.avatarURL = url;
  console.log('avatar upload successful');

  // check existance of previous avatar file
  Profile.findOne({
    where: {
      avatar: '/api/download?avatar=' + school_id + '.jpg'
    }
  })
    .then(function (user) {
      if (user !== null) { // exists previous avatar file: delete first
        fs.unlink(url, function (err) {
          if (err) throw err;
          else {
            console.log('previous avatar file deleted');
            next();
          }
        });
      } else {
        next();
      }
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

router.post('/avatar', function (req, res, next) { // rename avatar file
  fs.rename(req.files[0].path, req.avatarURL, function (err) {
    if (err) {
      console.log('avatar file rename error');
      res.json(statusLib.FILE_RENAME_FAILED);
    } else
      next();
  });
});

router.post('/avatar', function (req, res) { // update database record

  Profile.update({
    avatar: '/api/download?avatar=' + req.body.school_id + '.jpg'
  }, {
    where: {
      school_id: req.body.school_id
    }
  })
    .then(function () {
      console.log('avatar modify successful');
      res.json(statusLib.PROFILE_MOD_SUCCESSFUL);
    })
    .catch(function (e) {
      console.error(e);
      res.json(statusLib.CONNECTION_ERROR);
    });
});

router.post('/getinfo', function (req, res) { // fetch profile information

  const request = req.body.request;
  const where = (request === 'all') ? {} : {school_id: request};

  Profile.findAll({
    where: where
  }).then(function (profile) {
    if (profile === null) {
      res.json(statusLib.PROFILE_FETCH_FAILED);
      console.log('profile does not exist');
    } else {
      res.json(profile);
      console.log('profile fetch successful');
    }
  });
});

// router.post('/getavatar', function (req, res) { // fetch an avatar
//   const school_id = req.body.school_id;
//   Profile.findOne({
//     where: {
//       school_id: school_id
//     }
//   }).then(function (profile) {
//     if (profile === null) {
//       res.json(statusLib.PROFILE_FETCH_FAILED);
//       console.log('profile does not exist');
//     } else {
//       console.log(profile.avatar);
//       fs.readFile(profile.avatar, 'binary', function (err, data) {
//         if (err) {
//           console.log(err);
//           res.json(statusLib.PROFILE_FETCH_FAILED);
//           console.log('avatar fetch failed');
//         }
//         else {
//           res.write(data, 'binary');
//           res.end();
//           console.log('avatar fetch successful');
//         }
//       });
//     }
//   });
// });

module.exports = router;
