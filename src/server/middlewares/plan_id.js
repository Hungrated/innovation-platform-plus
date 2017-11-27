const timeFormat = require('./time_format');

function planIdGen(school_id) {
    return timeFormat(new Date(), school_id);
}

module.exports = planIdGen;