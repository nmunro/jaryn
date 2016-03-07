const Jaryn = Object.freeze(Object.create({
  "initConfig": function(cb) {
    const config = { "averageMood": 5, "moodCount": 0, "averageEmotion": "" };
    this.writeConfig(config, cb);    
  },
  
  "readConfig": function(cb) {
    this.readJSON("jaryn-config.json", cb);  
  },
  
  "writeConfig": function(config, cb) {
    this.writeJSON("jaryn-config.json", config, cb);    
  },
  
  /**
   * Convenience function to get the current data file.
   * @param function cb Call back to execute once data is loaded. 
   */
  "getThisMonthsJSON": function(cb) {
    this.getJSONForDate(new Date(), cb);
  },
  
  /**
   * This function takes a date, parses the month and year from it
   * and reads the JSON from that months <month>-<year>.json file.
   * The supplied callback is then passed the data and executed.
   * 
   * @param Date date 
   * @param function cb Callback to execute when name generated.
   */
  "getJSONForDate": function(date, cb) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    
    this.readJSON(year + "-" + month + ".json", cb);
  },
  
  /**
   * getDataFile gets the data file for the given filename and executes the 
   * given callback with the data stored in the file passed in as an argument.
   * 
   * readJSON does NOT create a file if it doesn't already exist.
   * 
   * @param String fn File name to open and read.
   * @param function cb Callback to execute when file is read.
   */
  "readJSON": function(fn, cb) {
    chrome.syncFileSystem.requestFileSystem((fs) => {
      
      fs.root.getFile(fn,
        { "create": false },
        (fileEntry) => {
          fileEntry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
              if(cb !== undefined) cb(JSON.parse(fileReader.result));
            };
            fileReader.readAsText(file);
          });  
        },
        (err) => console.log(err));    
    });
  },
  
  /**
   * createJSON creates a new json file with the given file name.
   * 
   * @param String fn File name to create.
   * @param Function fn Callback to execute when file is created.
   */
  "createJSON": function(fn, cb) {
    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile(fn,
      { "create": true },
      () => {
        if(cb !== undefined) cb();  
      }, 
      (err) => console.log(err));
    });
  },
  
  /**
   * This writes data to the specified file, creating it if it does not exist.
   * Ensure data is a JSON object!
   * 
   * @param String fn File name to write to.
   * @param Object json JSON to  stringify and write.
   * @param cb Callback to execute on write.
   */
  "writeJSON": function(fn, json, cb) {
    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile(fn,
      { "create": true },
      (file) => {
        file.createWriter((writer) => {
          const blob = new Blob([JSON.stringify(json)], { "type": "text/plain" });
          writer.write(blob);
          if(cb !== undefined) cb(json);
        });
      },
      (err) => console.log(err));
    }); 
  },
  
  /**
   * @param String fn File name to write to.
   * @param Object day The data for the day.
   * @param function cb the Callback function to execute.
   */
  "updateJSON": function(fn, day, cb) {
    this.readJSON(fn, (data) => {
      data.push(day);  
      this.writeJSON(fn, data, cb);
    });
  }
}));