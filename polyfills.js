Object.prototype.isEmpty = function(o) {
  return Object.keys(o).reduce((p, n) => n ? p+1 : p, 0) <= 0;
};