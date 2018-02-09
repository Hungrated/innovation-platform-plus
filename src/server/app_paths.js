const pathLib = require('path');
const fs = require('fs');

const root = __dirname;

const host = 'http://localhost:3001';

const app = pathLib.join(root, 'app.js');

// file upload root
const upload = pathLib.join(root, 'public', 'files');

// image dir
const images = pathLib.join(upload, 'images');

const blogs = pathLib.join(images, 'blogs');

const avatars = pathLib.join(images, 'avatars');

const banner = pathLib.join(images, 'banner');

// source dir
const sources = pathLib.join(upload, 'sources');

const userinfo = pathLib.join(upload, 'userinfo');

const plans = pathLib.join(upload, 'plans');

const final = pathLib.join(upload, 'final');

const finalout = pathLib.join(final, 'out');

// document dir
const apidoc = pathLib.join(root, 'public', 'apidoc');

// make dir functions
const makeDir = function (dir) {
  // noinspection JSAnnotator
  fs.mkdir(dir, 0777, function (err) {
    if (err) {
      console.log('dir: `' + dir + '` exists.');
    } else {
      console.log(dir + ' created.');
    }
  });
};

const mkdirIfNotExist = function (dir) {
  fs.access(dir, function (err) {
    if (err && err.code === 'ENOENT') {
      makeDir(dir);
    } else {
      console.log('dir: `' + dir + '` exists.');
    }
  });
};


mkdirIfNotExist(plans);
mkdirIfNotExist(finalout);
mkdirIfNotExist(blogs);
mkdirIfNotExist(pathLib.join(blogs, '__temp__'));

module.exports = {
  app,
  host,
  upload,
  images,
  blogs,
  avatars,
  sources,
  userinfo,
  banner,
  plans,
  final,
  finalout,
  apidoc,
  mkdirIfNotExist
};
