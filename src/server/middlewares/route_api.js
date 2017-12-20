const express = require('express');
const router = express.Router();

const user = require('../routes/route_users');
const classes = require('../routes/route_classes');
const blog = require('../routes/route_blogs');
const file = require('../routes/route_files');
const profile = require('../routes/route_profiles');
const plan = require('../routes/route_plans');
const comment = require('../routes/route_comments');
const download = require('./route_download');
const banner = require('../routes/route_banner');

router.use('/user', user);
router.use('/class', classes);
router.use('/blog', blog);
router.use('/file', file);
router.use('/profile', profile);
router.use('/plan', plan);
router.use('/comment', comment);
router.use('/download', download);
router.use('/banner', banner);

module.exports = router;
