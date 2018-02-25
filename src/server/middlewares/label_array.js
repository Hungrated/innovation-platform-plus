module.exports = {
  parseArray: function (string) {
    return string.split(',');
  },

  stringifyArray: function (arr) {
    return arr.toString();
  },

  containsLabel: function (string, label_id) {
    let r = new RegExp(label_id, 'g');
    return r.test(string);
  },

  removeLabel: function (string, label_id) {
    let r1 = new RegExp(label_id + ',', 'g');
    let r2 = new RegExp(',' + label_id, 'g');
    return string.replace(r1, '').replace(r2, '');
  }
};
