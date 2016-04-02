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
          fr.onload = (e) => {
            if(fr.result === null || fr.result === "") obj.onSuccess({});
            else obj.onSuccess(JSON.parse(fr.result));
          };
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
     const entries = {};
     let offset = 0;
     
     // Get list of files, at most there will only ever be two and the number
     // of entries to read from the file.
    [0, 1, 2, 3, 4, 5, 6].forEach((num) => {
      const now = DateUtil.getYYYYMMDD(num);
      const fn = `${now.year}-${now.month}.json`;
      
      entries[fn] = entries[fn] === undefined ? 1 : entries[fn] += 1;
    });
    
    Object.keys(entries).forEach((entry) => {
      this.loadHistory(entry, (data) => {
        Array(entries[entry]).fill(0).forEach((o, count, arr) => {
          const date = new Date(today.getTime());
          let tmpDate;
          let entry;
          
          date.setDate(date.getDate()-offset);
          tmpDate = DateUtil.getYYYYMMDD(offset);
          offset++;
          
          if(data[tmpDate.day] === undefined || Object.isEmpty(data)) {
            obj.push({
              "date": `${tmpDate.year}-${tmpDate.month}-${tmpDate.day}`,
              "notes": "-",
              "feelings": [],
              "exercise": false
            });
          }
          else {
            obj.push(data[tmpDate.day]);   
          }
          
          if(count === arr.length-1) cb(obj);
        });
      });
    });
   },

  /**
   * updateDiary takes a single entry and saves it to the current months 
   * history file.
   * 
   * @param Object day The data for the day.
   * @param function cb the Callback function to execute.
   */
  "updateDiary": function(obj, cb) {
    const [year, month, day] = obj.date.split("-");
    const fn = `${year}-${month}.json`;
    const writeData = (data) => {
      data[day] = obj;
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