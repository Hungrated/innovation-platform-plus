module.exports = {
  generate () {
    return (((1 + Math.random()) * 0x1000000) | 0).toString(16).substring(1);
  }
};
