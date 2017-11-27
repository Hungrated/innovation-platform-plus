const express = require('express');
const router = express.Router();

const user = require('../routes/route_users');
const blog = require('../routes/route_blogs');
const file = require('../routes/route_files');
const profile = require('../routes/route_profiles');
const plan = require('../routes/route_plans');
const comment = require('../routes/route_comments');

router.use('/user', user);
router.use('/blog', blog);
router.use('/file', file);
router.use('/profile', profile);
router.use('/plan', plan);
router.use('/comment', comment);

module.exports = router;
