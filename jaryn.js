const Jaryn = function() { return(this === window) ? new Jaryn() : this; };


Jaryn.prototype.error = Object.freeze({
  "printError": ((error) => console.log(`Error: ${error}`))
});

Jaryn.prototype.permissions = Object.freeze({
  "create": { "create": true },
  "notCreate": { "create": false }
});

Jaryn.prototype.vfs = Object.freeze({
  "operation": ((cb) => {
    const name = "jaryn.json";
    const ops =  Jaryn.prototype.permissions.create;
    const err = Jaryn.prototype.error.printError;

    chrome.syncFileSystem.requestFileSystem((fs) =>
      fs.root.getFile(name, ops, cb, err));
  }),
  
  /**
   * getDataFile gets the data file for the given month/year and executes the 
   * given callback.
   * 
   * @param month 
   * @param year
   * @param cb
   */
  "getFile": (name, cb) => {
    chrome.syncFileSystem.requestFileSystem((fs) => {
      const perms = Jaryn.prototype.permissions.create;
      const err = Jaryn.prototype.error.printError;
      
      console.log(`Attempting to open: ${name}.`);
      fs.root.getFile(name,
        perms,
        (fileEntry) => {
          fileEntry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
              if(cb !== undefined) cb(JSON.parse(fileReader.result));
            };
            fileReader.readAsText(file);
          });  
        },
        err);    
    });
  },
  
  "writeHistory": (data, cb) => {
    Jaryn.prototype.vfs.operation((file) => {
      file.createWriter((writer) => {
        const blob = new Blob([JSON.stringify(data)], { "type": "text/plain" });
        writer.write(blob);
        if(cb !== undefined) cb();
      }, (err) => console.log(`Error: ${err}.`));
    });
  }
});

// Everything down here is to be deleted later!
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
