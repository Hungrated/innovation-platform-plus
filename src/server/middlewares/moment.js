const db = require('../models/db_global');
const Moment = db.Moment;

module.exports = {
  createMoment (type, desc, extras, sid, uid) {
    let momentData = {
      type: type,
      desc: desc,
      href: extras,
      student_id: sid,
      uid: uid
    };
    Moment.create(momentData)
      .then(function () {
        console.log('moment: ' + uid + ' create successful');
      })
      .catch(function (e) {
        console.log(momentData);
        console.error(e);
        console.log('moment: ' + uid + ' create failed');
      });
  },
  validatePlanMoment (id, status) {
    Moment.update({
      href: status
    }, {
      where: {
        uid: id
      }
    })
      .then(function () {
        console.log('moment: ' + id + ' validate successful');
      })
      .catch(function (e) {
        console.error(e);
        console.log('moment: ' + id + ' validate failed');
      });
  },
  createPlanModifyMoment (type, desc, extras, sid, uid) {
    let _this = this;
    Moment.update({
      href: '已修改',
      uid: 'm_' + uid
    }, {
      where: {
        uid: uid
      }
    })
      .then(function () {
        _this.createMoment(type, desc, extras, sid, uid);
        console.log('moment: ' + uid + ' modify successful');
      })
      .catch(function (e) {
        console.error(e);
        console.log('moment: ' + uid + ' modify failed');
      });
  },
  deleteMoment (uid) {
    Moment.destroy({
      where: {
        uid: uid
      }
    })
      .then(function () {
        console.log('moment: ' + uid + ' delete successful');
      })
      .catch(function (e) {
        console.error(e);
        console.log('moment: ' + uid + ' delete failed');
      });
  }
};
