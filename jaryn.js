const Jaryn = function() {
  return(this === window) ? new Jaryn() : this;
};

Jaryn.prototype.init = function() {
  console.log("Jaryn: Init");  
};

// This only returns dummy data right now.
Jaryn.prototype.getHistory = function() {
  const today = new Date();
  var yesterday = new Date();
  yesterday.setDate(today.getDate() -1); 
  
  return Object.freeze([{
    "id": today.getTime(),
    "date": today,
    "mood": 5,
    "feelings": [
      "ok/fine"
    ],
    "notes": "Lorim ipsom"
  },
  {
    "id": yesterday.getTime(),
    "date": yesterday,
    "mood": 5,
    "feelings": [
      "ok/fine",
      "tired"
    ],
    "notes": "Lorim ipsom"
  }]);
};

Jaryn.prototype.setData = function(data) {
  console.log("Jaryn: setData");  
};