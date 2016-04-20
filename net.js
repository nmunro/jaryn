const Net = Object.freeze(Object.create({
  "getNetworkStatus": function() {
    return navigator.onLine ? "Online" : "Offline"; 
  }  
}));