const express = require('express');
const router = express.Router();

const path = require('../app_paths');

const user = require('./route_users');
const classes = require('./route_classes');
const blog = require('./route_blogs');
const file = require('./route_files');
const profile = require('./route_profiles');
const plan = require('./route_plans');
const comment = require('./route_comments');
const download = require('./route_download');
const banner = require('./route_banner');
const meeting = require('./route_meeting');
const moment = require('./route_moments');
const teacher = require('./route_teacher');
const final = require('./route_finals');
const label = require('./route_labels');

router.use('/', express.static(path.apidoc));

router.use('/user', user);
router.use('/class', classes);
router.use('/blog', blog);
router.use('/file', file);
router.use('/profile', profile);
router.use('/plan', plan);
router.use('/comment', comment);
router.use('/download', download);
router.use('/banner', banner);
router.use('/meeting', meeting);
router.use('/moment', moment);
router.use('/teacher', teacher);
router.use('/final', final);
router.use('/label', label);

module.exports = router;
