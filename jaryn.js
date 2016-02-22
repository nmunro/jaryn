const Jaryn = function() {
  return(this === window) ? new Jaryn() : this;
};

Jaryn.prototype.init = function() {
  console.log("Jaryn: Init");  
};

Jaryn.prototype.getData = function() {
  console.log("Jaryn: getData");  
};

Jaryn.prototype.setData = function() {
  console.log("Jaryn: setData");  
};