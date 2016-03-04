const Jaryn = function() { return(this === window) ? new Jaryn() : this; };


Jaryn.prototype.error = Object.freeze({
  "printError": ((error) => console.log(error))
});

Jaryn.prototype.permissions = Object.freeze({
  "create": { "create": true },
  "notCreate": { "create": false }
});

// Virtual file system layer to google drive.
Jaryn.prototype.vfs = Object.freeze({
  /**
   * Convenience function to get the current data file.
   * @param function cb Call back to execute once data is loaded. 
   */
  "getThisMonthsJSON": (cb) => {
    const date = new Date();
    const month = date.getMonth()+1;
    const year = date.getFullYear();
    const name = month + "-" + year + ".json";
    
    Jaryn.prototype.vfs.readJSON(name, cb);
  },
  
  /**
   * getDataFile gets the data file for the given month/year and executes the 
   * given callback.
   * 
   * @param month 
   * @param year
   * @param cb
   */
  "readJSON": (cb) => {
    chrome.syncFileSystem.requestFileSystem((fs) => {
      const perms = Jaryn.prototype.permissions.notCreate;
      const err = Jaryn.prototype.error.printError;
      
      fs.root.getFile("jaryn.json",
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
  
  /**
   * This writes data to the specified file, creating it if it does not exist.
   * Ensure data is a JSON object!
   * @param file File name to write to.
   * @param data JSON to  stringify and write.
   * @param cb Callback to execute on write.
   */
  "writeJSON": (json, cb) => {
    const ops =  Jaryn.prototype.permissions.create;
    const err = Jaryn.prototype.error.printError;
    
    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile("jaryn.json",
      ops,
      (file) => {
        file.createWriter((writer) => {
          const blob = new Blob([JSON.stringify(json)], { "type": "text/plain" });
          writer.write(blob);
          if(cb !== undefined) cb(JSON.stringify(json));
        });
      },
      err);
    }); 
  },
  
  "updateJSON": (day, cb) => {
    Jaryn.prototype.vfs.readJSON((data) => {
      data.push(day);  
      console.log(data);
      Jaryn.prototype.vfs.writeJSON(data, cb);
    });
  }
});