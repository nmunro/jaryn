const Jaryn = function() { return(this === window) ? new Jaryn() : this; };


Jaryn.prototype.error = Object.freeze({
  "printError": ((error) => console.log(`Error: ${error}`))
});

Jaryn.prototype.permissions = Object.freeze({
  "create": { "create": true },
  "notCreate": { "create": false }
});

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
  "readJSON": (name, cb) => {
    chrome.syncFileSystem.requestFileSystem((fs) => {
      const perms = Jaryn.prototype.permissions.notcreate;
      const err = Jaryn.prototype.error.printError;
      
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
  
  /**
   * This writes data to the specified file, creating it if it does not exist.
   * Ensure data is a JSON object!
   * @param file File name to write to.
   * @param data JSON to  stringify and write.
   * @param cb Callback to execute on write.
   */
  "writeJSON": (file, json, cb) => {
    const ops =  Jaryn.prototype.permissions.create;
    const err = Jaryn.prototype.error.printError;
    
    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile(file,
      ops,
      (file) => {
        file.createWriter((writer) => {
          const blob = new Blob([JSON.stringify(json)], { "type": "text/plain" });
          writer.write(blob);
          if(cb !== undefined) cb();
        });
      },
      err);
    }); 
  }
});

// Testing function
Jaryn.prototype.testing = Object.freeze({
  "writeDummyDataFile": () => {
    const file = "dummy.json";
    const data = Jaryn.prototype.testing.generateDummyData();   
    Jaryn.prototype.vfs.writeJSON(file, data, () => {
      console.log(`Wrote ${data} to ${file}.`);  
    }); 
  },
  
  // Fill this in later.
  "readDummyDataFile": () => {
    const file = "dummy.json";
    Jaryn.prototype.vfs.readJSON(file, (data) => {
      console.log(`Read ${file} and got:\n${data}.`);
    });
  },
  
  "generateDummyData": () => {
    const today = new Date();
    const yesterday = new Date();
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
  }  
});