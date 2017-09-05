const URLify = function(str) {
  if (!str) {
    return str;
  }
  return str.trim().replace(/\s/g, '%20');
};

export default URLify;
