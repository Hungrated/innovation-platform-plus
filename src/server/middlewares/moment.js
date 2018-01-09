const db = require('../models/db_global');
const Moment = db.Moment;

module.exports = {
  createMoment (type, desc, href, sid) {
    Moment.create({
      type: type,
      desc: desc,
      href: href,
      student_id: sid
    })
      .then(function () {
        console.log('moment create successful');
      })
      .catch(function (e) {
        console.error(e);
        console.log('moment create failed');
      });
  }
};
