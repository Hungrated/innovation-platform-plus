const db = require('../models/db_global');
const Moment = db.Moment;

module.exports = {
  createMoment (type, desc, extras, sid) {
    Moment.create({
      type: type,
      desc: desc,
      href: extras,
      student_id: sid
    })
      .then(function () {
        console.log('moment create successful');
      })
      .catch(function (e) {
        console.error(e);
        console.log('moment create failed');
      });
  },
  validatePlanMoment (plan_id, status) {
    Moment.update({
      href: status
    }, {
      where: {
        href: plan_id
      }
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
