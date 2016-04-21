const Net = Object.freeze(Object.create({
  "getNetworkStatus": function() {
    return navigator.onLine ? "Online" : "Offline"; 
  },
  
  "download": function() {
    console.log("Downloading data.");  
  },
  
  "upload": function() {
    console.log("Uploading data.");  
  }
}));