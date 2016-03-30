const configFile = "jaryn-config.json";

/**
 * readJSON gets the data file for the given filename and executes the 
 * given callback with the data stored in the file passed in as an argument.
 * 
 * readJSON does NOT create a file if it doesn't already exist.
 * 
 * @param object obj An object containing the file name and success/failure
 * callback functions.
 */
const readJSON = (obj) => {
  chrome.syncFileSystem.requestFileSystem((fs) => {
    fs.root.getFile(obj.fileName,
      obj.permissions,
      (fileEntry) => {
        fileEntry.file((file) => {
          const fr = new FileReader();
          fr.onload = (e) => obj.onSuccess(JSON.parse(fr.result));
          fr.readAsText(file);
        });  
      }, obj.onFailure);    
  });
};

/**
 * writeJSON writes data to the specified file, creating it if it does not exist.
 * Ensure data is a JSON object!
 * 
 * @param object obj An object containing the file name, data and success or
 * failure callback functions.
 */
const writeJSON = (obj) => {
  chrome.syncFileSystem.requestFileSystem((fs) => {
    fs.root.getFile(obj.fileName,
    obj.permissions,
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
};

const VFS = Object.freeze(Object.create({
  "readJSON": readJSON,
  "writeJSON": writeJSON,
  /**
   * loadConfig loads a config object from the config file and passes the 
   * config into the callback.
   * 
   * @param function cb Callback function to execute upon init.
   */
  "loadConfig": function(cb) {
    const config = {"averageMood": 5, "moodCount": 0, "averageEmotion": []};
    
    readJSON({
      "fileName": configFile,
      "permissions": { "create": false },
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
    writeJSON({
      "fileName": configFile,
      "permissions": { "create": true },
      "data": config,
      "onSuccess": cb,
      "onFailure": (err) => console.log(err)
    });
  },
  
  /**
   * loadHistory reads the current months history file and passes the data
   * into the provided callback function.
   * 
   * @param String fn File name to open.
   * @param function cb Callback to execute once history has been loaded.
   */
  "loadHistory": function(fn, cb) {
    readJSON({
      "fileName": fn,
      "permissions": { "create": true },
      "onSuccess": cb,
      "onFailure": (err) => cb([])
    });
  },
  
  /**
   * getSevenDayHistory gets the last seven days of historical information.
   * 
   * @param function cb The callback function to execute.
   */
   "getSevenDayHistory": function(cb) {
     const obj = [];  
     const today = DateUtil.getDate();
     const limit = today.getDate()-6;
     const files = new Set();
     
     // Get list of files, at most there will only ever be two.
    Array.of(0, 1, 2, 3, 4, 5, 6).forEach((num) => {
      const now = DateUtil.getDate();
      const dayOffset = ((1000*60)*60)*24;
      files.add(`${now.getFullYear()}-${DateUtil.zeroPad(now.getMonth()+1)}.json`);
    });
    
    files.forEach((fn) => {
      this.loadHistory(fn, (data) => {
        const days = Object.keys(data).reverse().filter((day) => day >= limit);
        
        obj[`${today.getDate()}`] = {
          "date": today,
          "notes": "-",
          "feelings": [],
          "exercise": false
        };
        
        days.forEach((d, count, arr) => {
          obj[d] = data[d];
          if(count === arr.length-1) cb(obj.reverse());
        });
      });
    });
   },
   
  /**
   * getThisMonthsJSON parses the month and year and reads the JSON from
   * this months <month>-<year>.json file.
   * The supplied callback is then passed the data and executed.
   * 
   * @param function cb Callback to execute when name generated.
   */
  "getThisMonthsJSON": function(cb) {
    const {year, month} = DateUtil.getYYYYMMDD();
    return `${year}-${month}.json`;
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
      data[day.date.getDate()] = day;
      writeJSON({
        "fileName": fn,
        "permissions": { "create": true },
        "data": data,
        "onSuccess": cb,
        "onFailure": (err) => console.log(err)
      });
    };
    
    readJSON({
      "fileName": fn,
      "permissions": { "create": false },
      "onSuccess": (data) => writeData(data),
      "onFailure": () => writeData([])
    });
  }
}));