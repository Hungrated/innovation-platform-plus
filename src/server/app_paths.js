const pathLib = require('path');
const fs = require('fs');

const root = __dirname;

const app = pathLib.join(root, 'app.js');

const upload = pathLib.join(root, 'public', 'files');

const avatars = pathLib.join(upload, 'avatars');

const sources = pathLib.join(upload, 'sources');

const userinfo = pathLib.join(upload, 'userinfo');

const banner = pathLib.join(upload, 'banner');

const plans = pathLib.join(root, 'public', 'files', 'plans');

const final = pathLib.join(upload, 'final');

const finalout = pathLib.join(final, 'out');

const apidoc = pathLib.join(root, 'public', 'apidoc');

const makeDir = function (dir) {
  // noinspection JSAnnotator
  fs.mkdir(dir, 0777, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(dir + ' created.')
    }
  });
};

const mkdirIfNotExist = function (dir) {
  fs.access(dir, function (err) {
    if(err && err.code === 'ENOENT') {
      makeDir(dir);
    } else {
      console.log('dir: `' + dir + '` exists.');
    }
  });
};

mkdirIfNotExist(finalout);

module.exports = {
   app, avatars, sources, userinfo, banner, plans, final, finalout, apidoc
};
