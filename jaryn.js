const Jaryn = Object.freeze(Object.create({
  "getConfigFile": function() {
    return "jaryn-config.json";
  },
  
  /**
   * loadConfig loads a config object from the config file and passes the 
   * config into the callback.
   * 
   * @param function cb Callback function to execute upon init.
   */
  "loadConfig": function(cb) {
    const config = {"averageMood": 5, "moodCount": 0, "averageEmotion": []};
    
    this.readJSON({
      "fileName": this.getConfigFile(),
      "onSuccess": cb,
      "onFailure": (err) => this.saveConfig(config, cb)
    });
  },
  
  /**
   * saveConfig saves a config object to the config file.
   * 
   * @param object config Config object to save.
   * @param function cb Callback to execute when saved.
  */
  "saveConfig": function(config, cb) {
    this.writeJSON({
      "fileName": this.getConfigFile(),
      "data": config,
      "onSuccess": cb,
      "onFailure": (err) => console.log(err)
    });
  },
  
  /**
   * loadHistory reads the current months history file and passes the data
   * into the provided callback function.
   * 
   * @param function cb Callback to execute once history has been loaded.
   */
  "loadHistory": function(fn, cb) {
    this.readJSON({
      "fileName": fn,
      "onSuccess": cb,
      "onFailure": (err) => cb([])
    });
  },
  
  /**
   * This function gets the last five days of historical information.
   * 
   * @param Date date The date to start the history count from.
   * @param function cb The callback function to execute.
   */
  "getSevenDayHistory": function(cb) {
    // Get all the keys we want to get.
    const months = new Set();
    const dates = Array.of(0, 1, 2, 3, 4, 5, 6).map(num => {
      const dayOffset = ((1000*60)*60)*24;
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const date = now.getDate();
      
      now.setTime(0);
      now.setYear(year);
      now.setMonth(month);
      now.setDate(date);
      
      now.setTime(now-(dayOffset*num));
      return now.getTime();
    });
    
    // Builds a set of month files needed to get the last five days.
    dates.forEach(key => {
      const dt = new Date();
      // I hate that I have to put this here, looks so bad... :(
      dt.setTime(key);
      const year = dt.getFullYear();
      const m = dt.getMonth()+1;
      const month = (m < 10) ? "0" + m : m;
      months.add(year + '-' + month + '.json');
    });
    
    // Get all dates from the only file.
    if (months.size === 1) {
      // Well, this DOES get the file name...
      const fn = [...months][0];
      const obj = {};
      
      this.loadHistory(fn, data => {
        dates.forEach(date => obj[date] = data[date]);
        cb(obj);
      });      
    } 
    else {
      const [fn1, fn2] = [...months];
      console.log("Not implemented yet.");
    }
  },
  
  /**
   * getThisMonthsJSON is a convenience function to get the current data file.
   */
  "getThisMonthsJSON": function() {
    return this.getJSONForDate(new Date());
  },
  
  /**
   * This function takes a date, parses the month and year from it
   * and reads the JSON from that months <month>-<year>.json file.
   * The supplied callback is then passed the data and executed.
   * 
   * @param Date date The date to get the history file for.
   * @param function cb Callback to execute when name generated.
   */
  "getJSONForDate": function(date, cb) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    
    return year + "-" + month + ".json";
  },
  
  /**
   * getDataFile gets the data file for the given filename and executes the 
   * given callback with the data stored in the file passed in as an argument.
   * 
   * readJSON does NOT create a file if it doesn't already exist.
   * 
   * @param object obj An object containing the file name and success/failure
   * callback functions.
   */
  "readJSON": function(obj) {
    console.log(`Reading: ${obj.fileName}.`);
    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile(obj.fileName,
        { "create": false },
        (fileEntry) => {
          fileEntry.file((file) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
              obj.onSuccess(JSON.parse(fileReader.result));
            };
            fileReader.readAsText(file);
          });  
        }, obj.onFailure);    
    });
  },
  
  /**
   * This writes data to the specified file, creating it if it does not exist.
   * Ensure data is a JSON object!
   * 
   * @param object obj An object containing the file name, data and success or
   * failure callback functions.
   */
  "writeJSON": function(obj) {
    console.log(`Writing: ${obj.fileName}.`);
    chrome.syncFileSystem.requestFileSystem((fs) => {
      fs.root.getFile(obj.fileName,
      { "create": true },
      (file) => {
        // Zero out the file contents.
        file.createWriter((writer) => writer.truncate(0));
        // Re-write with new data.
        file.createWriter((writer) => {
          const blob = new Blob([JSON.stringify(obj.data)], { "type": "text/plain" });
          writer.write(blob);
          obj.onSuccess(obj.data);
        });
      }, obj.onFailure);
    }); 
  },
  
  /**
   * updateDiary takes a single entry and saves it to the current months 
   * history file.
   * 
   * @param Object day The data for the day.
   * @param function cb the Callback function to execute.
   */
  "updateDiary": function(day, cb) {
    const fn = this.getThisMonthsJSON();
    const writeData = (data) => {
      data[day.id] = day;
      
      this.writeJSON({
        "fileName": fn,
        "data": data,
        "onSuccess": cb,
        "onFailure": (err) => console.log(err)
      });
    };
    
    this.readJSON({
      "fileName": fn,
      "onSuccess": (data) => writeData(data),
      "onFailure": () => writeData([])
    });
  }
}));