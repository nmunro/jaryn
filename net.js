const Net = Object.freeze(Object.create({
  "getNetworkStatus": function() {
    return navigator.online ? "Online" : "Offline"; 
  }  
}));