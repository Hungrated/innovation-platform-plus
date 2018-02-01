const pathLib = require('path');

const root = __dirname;

// const app = pathLib.join(root, 'app.js');

const upload = pathLib.join(root, 'public', 'files');

const avatars = pathLib.join(upload, 'avatars');

const sources = pathLib.join(upload, 'sources');

const userinfo = pathLib.join(upload, 'userinfo');

const banner = pathLib.join(upload, 'banner');

const plans = pathLib.join(root, 'public', 'files', 'plans');

const final = pathLib.join(upload, 'final');

const finalout = pathLib.join(final, 'out');

const apidoc = pathLib.join(root, 'public', 'apidoc');

module.exports = {
  avatars, sources, userinfo, banner, plans, final, finalout, apidoc
};
